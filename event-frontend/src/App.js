import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import { useAuth } from "./context/authContext";

function PrivateRoute({ children }) {
  // const { user } = useAuth();
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>; // Optionally show a spinner
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Auth />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}