import { useEffect, useState } from "react";
import api from "../api";
import { Room } from "../types";

export default function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Room[]>("/rooms")
      .then((r) => setRooms(r.data))
      .finally(() => setLoading(false));
  }, []);

  return { rooms, loading };
}
