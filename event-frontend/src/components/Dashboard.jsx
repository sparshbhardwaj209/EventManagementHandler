import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import EventList from "./EventList";
import CreateEvent from "./CreateEvent";
import { useAuth } from "../context/authContext";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");
  const { user, logout } = useAuth();


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
  }, []); 

  const getFilteredEvents = () => {
    let filtered = [...events];
    const now = new Date();
    if (filter === "upcoming") {
      filtered = filtered.filter((event) => new Date(event.date) >= now);
    } else if (filter === "past") {
      filtered = filtered.filter((event) => new Date(event.date) < now);
    } else if (filter === "recent") {
      filtered = filtered.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }
    return filtered;
  };

  return (
    <div className="dashboard-container">
      <header
        className="dashboard-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div className="header-left">
          <h1>Event Dashboard</h1>
        </div>
        <button
          className="logout-button"
          onClick={logout}
          style={{ marginLeft: "20px" }}
        >
          Logout
        </button>
      </header>

      {/* Only show CreateEvent if user is not a guest */}
      {user && user.role !== "guest" && <CreateEvent setEvents={setEvents} />}
      
      <EventList
        events={getFilteredEvents()}
        setEvents={setEvents}
        filter={filter}
        setFilter={setFilter}
      />
      {/* <EventList events={getFilteredEvents()} setEvents={setEvents} /> */}
    </div>
  );
}
