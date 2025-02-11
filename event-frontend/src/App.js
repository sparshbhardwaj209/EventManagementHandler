import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import { useAuth } from "./context/authContext";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

// function App() {
//   return (
//     <Routes>
//       <Route path="/login" element={<Auth />} />
//       <Route
//         path="/dashboard"
//         element={
//           <PrivateRoute>
//             <Dashboard />
//           </PrivateRoute>
//         }
//       />
//       <Route path="/" element={<Navigate to="/login" />} />
//     </Routes>
//   );
// }

// export default App;


export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Auth />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}