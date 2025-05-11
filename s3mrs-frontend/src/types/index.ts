// src/types/index.ts
export interface User {
  id: string;
  email: string;
  role: "student" | "admin";
  banned: boolean;
}


export interface Room {
  _id: string;
  name: string;
  capacity: number;
  type: string;
  status: "available" | "reserved";
  position: { x: number; y: number; z: number };
  light: boolean;          // ← new

}

export interface Booking {
  _id: string;
  room_id: string;
  start: string;
  end: string;
  state: string;
}

// Add this for the admin requests page:
export interface BookingRequest {
  _id: string;
  user_id: string;
  room_id: string;
  start: string;
  end: string;
  state: string;
}
export interface Message {
  _id: string;
  sender: "user" | "admin";
  content: string;
  timestamp: string;
}
export interface AdminStats {
  user_count: number;
  room_count: number;
  bookings: {
    pending: number;
    approved: number;
    declined: number;
  };
}
export interface ChatUser {
  id: string;
  email: string;
}