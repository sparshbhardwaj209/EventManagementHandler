import axios from "axios";
import { useAuth } from "../context/authContext";

export default function EventList({ events, setEvents }) {
  const { user } = useAuth();

  // Safely get the current user's ID as a string.
  const currentUserId = user && user._id ? user._id.toString() : "";

  // Helper: convert an array of IDs to strings
  const getAttendeeIds = (attendees) => {
    return Array.isArray(attendees)
      ? attendees.map((id) => (id ? id.toString() : ""))
      : [];
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/events/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setEvents(events.filter((event) => event._id !== id));
      alert("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting event", error);
      alert("Failed to delete event");
    }
  };

  const handleAttend = async (id) => {
    // Check if user is already attending
    const event = events.find((e) => e._id === id);
    const attendeeIds = getAttendeeIds(event?.attendees);

    if (attendeeIds.includes(currentUserId)) {
      alert("You have already registered for the event");
      return;
    }
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/events/${id}/attend`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setEvents((prevEvents) =>
        prevEvents.map((e) =>
          e._id === id
            ? {
                ...e,
                attendees: [...getAttendeeIds(e.attendees), currentUserId],
              }
            : e
        )
      );
      alert("You are now attending this event.");
    } catch (error) {
      console.error("Error attending event", error.response || error.message);
      alert("Failed to attend event");
    }
  };

  const handleWithdraw = async (id) => {
    // Check if user is currently attending
    const event = events.find((e) => e._id === id);
    const attendeeIds = getAttendeeIds(event?.attendees);

    if (!attendeeIds.includes(currentUserId)) {
      alert("You are not registered for this event");
      return;
    }
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/events/${id}/withdraw`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Optimistically update state: remove user's id from attendees array
      setEvents((prevEvents) =>
        prevEvents.map((e) =>
          e._id === id
            ? {
                ...e,
                attendees: getAttendeeIds(e.attendees).filter(
                  (attId) => attId !== currentUserId
                ),
              }
            : e
        )
      );
      alert("You have withdrawn your attendance.");
    } catch (error) {
      console.error(
        "Error withdrawing from event",
        error.response || error.message
      );
      alert("Failed to withdraw from event");
    }
  };

  return (
    <div className="event-list">
      <h2>Event List</h2>
      {events.map((event) => {
        const isAttending =
          event.attendees &&
          getAttendeeIds(event.attendees).includes(currentUserId);
        return (
          <div key={event._id} className="event-item">
            <h3>{event.title}</h3>
            {event.imageUrl && (
              <img
                src={event.imageUrl}
                alt={event.title}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  marginBottom: "10px",
                }}
              />
            )}
            <p>{event.description}</p>
            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
            <p>Location: {event.location}</p>
            <p>Attendees: {event.attendees ? event.attendees.length : 0}</p>
            {user.role !== "guest" &&
              (isAttending ? (
                <button onClick={() => handleWithdraw(event._id)}>
                  Withdraw
                </button>
              ) : (
                <button onClick={() => handleAttend(event._id)}>Attend</button>
              ))}
            <button onClick={() => handleDelete(event._id)}>
              Delete Event
            </button>
          </div>
        );
      })}
    </div>
  );
}
