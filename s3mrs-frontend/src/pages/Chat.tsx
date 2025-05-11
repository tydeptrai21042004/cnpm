import { useState, useEffect, useRef } from "react"; // Import useRef
import api from "../api";
import { Message } from "../types";
import styles from './Chat.module.css'; // Import the CSS module

export default function Chat() {
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for scrolling

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load messages function
  const load = () => {
    // Don't reset loading/error on polling updates
    api.get<Message[]>("/chat/messages")
      .then(res => {
          setMsgs(res.data);
          // Error can be cleared on successful load
          if (error) setError(null);
      })
      .catch(err => {
          console.error("Failed to load messages:", err);
          // Set error only if it's not already set, avoid spamming console/UI
          if (!error) setError("Could not load messages. Trying again...");
      })
      .finally(() => {
          // Only set loading false on initial load
          if (loading) setLoading(false);
      });
  };

  // Effect for initial load and polling
  useEffect(() => {
    load(); // Initial load triggers loading state change
    const interval = setInterval(load, 5000); // Poll every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Effect for scrolling when messages update
  useEffect(() => {
    // Add slight delay to ensure DOM is updated before scrolling
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [msgs]); // Scroll whenever the msgs array changes

  // Send message function
  const send = async () => {
    if (!text.trim()) return; // Prevent sending empty messages
    const tempId = `temp-${Date.now()}`; // Create temporary ID for optimistic update
    const newMessage: Message = { // Define optimistic message structure
        _id: tempId,
        sender: 'user', // This message is from 'user'
        content: text.trim(),
        timestamp: new Date().toISOString() // Use current time
    };

    // Optimistically add message to state
    setMsgs(prev => [...prev, newMessage]);
    const messageToSend = text.trim(); // Store text before clearing
    setText(""); // Clear input field immediately

    try {
      await api.post("/chat/messages", { content: messageToSend });
      load(); // Fetch messages again to get real ID and confirm
    } catch (err) {
      console.error("Failed to send message:", err);
      setError("Failed to send message.");
      // Remove the optimistic message on failure
      setMsgs(prev => prev.filter(m => m._id !== tempId));
      // Optional: Restore text to input field
      // setText(messageToSend);
    }
  };

  // Handle Enter key press in input
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  };

  return (
    // Apply container style
    <div className={styles.chatContainer}>
      {/* Apply title style */}
      <h2 className={styles.title}>Chat with Admin</h2>

      {/* Apply messages container style */}
      <div className={styles.messagesContainer}>
        {loading && <p className={styles.loading}>Loading messages...</p>}
        {error && !loading && <p className={styles.error}>{error}</p>}
        {!loading && msgs.map(m => (
          // Apply base message style + conditional sender style
          <div
            key={m._id}
            className={`${styles.message} ${
              // User messages align right, Admin messages align left
              m.sender === "user" ? styles.messageUser : styles.messageAdmin
            }`}
          >
             <div className={styles.bubble}>
                 {/* Sender name (optional, can be hidden via CSS) */}
                 {/* <strong className={styles.sender}>{m.sender === "user" ? "You" : "Admin"}</strong> */}
                 <span className={styles.content}>{m.content}</span>
                 <small className={styles.timestamp}>
                     {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </small>
             </div>
          </div>
        ))}
        {/* Empty div at the end to target for scrolling */}
        <div ref={messagesEndRef} />
      </div>

      {/* Apply input area style */}
      <div className={styles.inputArea}>
        <input
          className={styles.textInput}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyPress={handleKeyPress} // Add key press handler
          placeholder="Type your message here..."
          disabled={loading} // Disable input while loading initial messages
        />
        <button
          onClick={send}
          className={styles.sendButton}
          disabled={loading || !text.trim()} // Disable send if loading or input empty
        >
          Send
        </button>
      </div>
    </div>
  );
}