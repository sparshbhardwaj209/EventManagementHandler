import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import EventList from "./EventList";
import CreateEvent from "./CreateEvent";
import { useAuth } from "../context/authContext";


export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const { user } = useAuth();

  // const socket = io(process.env.REACT_APP_API_URL);

  useEffect(() => {
    // Fetch events from the backend
    const fetchEvents = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/events`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setEvents(res.data);
      } catch (error) {
        console.error("Error fetching events", error);
      }
    };

    fetchEvents();

    // Create and subscribe to Socket.IO events
    const socket = io(process.env.REACT_APP_API_URL);

    socket.on("attendeeUpdated", (updatedEvent) => {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === updatedEvent._id ? updatedEvent : event
        )
      );
    });

    // Cleanup: disconnect the socket when component unmounts
    return () => {
      socket.disconnect();
    };
  }, []); // No external dependencies here

  return (
    <div className="dashboard-container">
      <h1>Event Dashboard</h1>
      {/* Only show CreateEvent if user is not a guest */}
      {user && user.role !== "guest" && <CreateEvent setEvents={setEvents} />}
      <EventList events={events} setEvents={setEvents} />
      {/* <CreateEvent setEvents={setEvents} />
      <EventList events={events} setEvents={setEvents} /> */}
    </div>
  );
}
