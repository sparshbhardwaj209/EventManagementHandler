import axios from "axios";

export default function EventList({ events, setEvents }) {
  const handleDelete = async (id) => {
    console.log("Attempting to delete event with ID:", id);
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/events/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Delete response:", response.data);
      // Remove the deleted event from state
      setEvents(events.filter((event) => event._id !== id));
      alert("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting event", error);
      alert("Failed to delete event");
    }
  };

  return (
    <div className="event-list">
      <h2>Event List</h2>
      {events.map((event) => (
        <div key={event._id} className="event-item">
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <p>Date: {new Date(event.date).toLocaleDateString()}</p>
          <p>Location: {event.location}</p>
          <button onClick={() => handleDelete(event._id)}>Delete Event</button>
        </div>
      ))}
    </div>
  );
}
