import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Homepage from "./components/Homepage";
import Login from "./components/Login";
import Register from "./components/Register";
import LawyerDashboard from "./components/LawyerDashboard";
import ClientDashboard from "./components/ClientDashboard"; // Import ClientDashboard
import FileManagement from "./components/FileManagement";
import FetchFileComponent from "./components/FetchFileComponent";
import UploadPage from "./components/UploadPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/lawyer-dashboard" element={<LawyerDashboard />} />
          <Route path="/client-dashboard" element={<ClientDashboard />} /> {/* Add ClientDashboard route */}
          <Route path="/UploadPage" element={<UploadPage />} />
          <Route path="/file-management" element={<FileManagement />} />
          <Route path="/fetch-file" element={<FetchFileComponent />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
