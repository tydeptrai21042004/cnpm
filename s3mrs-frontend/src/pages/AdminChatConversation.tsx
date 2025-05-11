import { useState, useEffect, useRef } from "react"; // Import useRef
import { useParams } from "react-router-dom";
import api from "../api";
import { Message } from "../types";
import styles from './AdminChatConversation.module.css'; // Import the CSS module

export default function AdminChatConversation() {
  const { userId } = useParams<{ userId: string }>();
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for scrolling

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load messages function
  const load = () => {
    api.get<Message[]>(`/chat/messages/${userId}`)
      .then(r => {
        setMsgs(r.data);
        // We'll scroll in the useEffect that depends on msgs
      })
      .catch(err => console.error("Failed to load messages:", err)); // Add error handling
  };

  // Effect for initial load and polling
  useEffect(() => {
    load(); // Initial load
    const iv = setInterval(load, 5000); // Poll every 5 seconds
    return () => clearInterval(iv); // Cleanup interval on unmount
  }, [userId]); // Re-run if userId changes

  // Effect for scrolling when messages update
  useEffect(() => {
    scrollToBottom();
  }, [msgs]); // Scroll whenever the msgs array changes

  // Send message function
  const send = async () => {
    if (!text.trim()) return; // Prevent sending empty messages
    try {
      await api.post("/chat/admin/reply", { user_id: userId, content: text.trim() });
      setText(""); // Clear input field
      load(); // Reload messages immediately after sending
    } catch (err) {
      console.error("Failed to send message:", err); // Add error handling
      // Optionally: set an error state to show the user
    }
  };

  // Handle Enter key press in input
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) { // Send on Enter, allow Shift+Enter for newline
      event.preventDefault(); // Prevent default form submission/newline
      send();
    }
  };


  return (
    // Apply container style
    <div className={styles.container}>
      {/* Apply title style */}
      <h2 className={styles.title}>Chat with User: {userId}</h2>

      {/* Apply messages container style */}
      <div className={styles.messagesContainer}>
        {msgs.map(m => (
          // Apply base message style + conditional sender style
          <div
            key={m._id}
            className={`${styles.message} ${
              m.sender === "admin" ? styles.messageAdmin : styles.messageUser
            }`}
          >
             <div className={styles.bubble}>
                 {/* Optional: Show sender name (can be hidden via CSS if desired) */}
                 {/* <strong className={styles.sender}>{m.sender === "admin" ? "You" : "User"}</strong> */}
                 <span className={styles.content}>{m.content}</span>
                 <small className={styles.timestamp}>
                     {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {/* Simplified time */}
                 </small>
             </div>
          </div>
        ))}
        {/* Empty div at the end to target for scrolling */}
        <div ref={messagesEndRef} />
      </div>

      {/* Apply input area style */}
      <div className={styles.inputArea}>
        {/* Apply text input style */}
        <input
          className={styles.textInput}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyPress={handleKeyPress} // Add key press handler
          placeholder="Type your message..."
        />
        {/* Apply send button style */}
        <button onClick={send} className={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
}