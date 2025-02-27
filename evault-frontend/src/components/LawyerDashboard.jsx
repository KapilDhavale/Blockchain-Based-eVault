import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Avatar,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./CSS/LawyerDashboard.css";

const LawyerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  // Dropdown menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Dynamic data states
  const [dashboardData, setDashboardData] = useState({
    documentCount: 0,
    activeCases: [],
    deadlines: [],
    pendingTasks: 0,
    completedTasks: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [docRes, casesRes, tasksRes] = await Promise.all([
          axios.get("http://localhost:5000/api/documents/count", { headers }),
          axios.get("http://localhost:5000/api/cases/lawyer", { headers }),
          axios.get("http://localhost:5000/api/tasks", { headers }),
        ]);

        setDashboardData({
          documentCount: docRes.data.count,
          activeCases: casesRes.data.filter((c) => c.status === "Open"),
          deadlines: ["Feb 5 2025", "Feb 8 2025", "Feb 9 2025"],
          pendingTasks: tasksRes.data.pending,
          completedTasks: tasksRes.data.completed,
        });
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <ul>
          <li>My Documents</li>
          <li onClick={() => navigate("/UploadPage")} style={{ cursor: "pointer" }}>Summariser</li>
          <li onClick={() => navigate("/file-management")} style={{ cursor: "pointer" }}>Upload Documents</li>
          <li>Case Schedules</li>
          <li>Profile</li>
          <li>Settings</li>
          <li onClick={logout} style={{ cursor: "pointer" }}>Logout</li>
        </ul>
      </div>

      <div className="content-area">
        <div className="placeholder-div">
          <div id="welcome">Welcome back, <br /> Adv. {user?.name || "User"}</div>
          <div id="header-home-box">
            <Avatar 
  alt="Profile" 
  src={user?.profileImage || ""} 
  sx={{ 
    width: 50, 
    height: 50, 
    cursor: "pointer", 
    bgcolor: user?.profileImage ? "transparent" : "#1976d2", 
    color: "white", 
    fontSize: "1.2rem", 
    fontWeight: "bold" 
  }} 
  onClick={(e) => setAnchorEl(e.currentTarget)}
>
  {!user?.profileImage && user?.name 
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase() 
    : ""}
</Avatar>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={() => setAnchorEl(null)}>Profile</MenuItem>
              <MenuItem onClick={() => setAnchorEl(null)}>My Account</MenuItem>
              <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
            <TextField
              id="search-bar-home"
              variant="outlined"
              placeholder="Search..."
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ backgroundColor: "rgb(216, 221, 219)", borderRadius: "5px", width: "250px", height: "36px" }}
            />
          </div>
        </div>

        <div id="quick-taskbar">
          <div className="task-box box-documents">
            <img src="/docs-uploaded-img.png" alt="Documents Icon" className="task-box-icon" />
            <h3>Total {dashboardData.documentCount} Documents</h3>
            <p>Uploaded Till Now</p>
            <button onClick={() => navigate("/file-management")}>Upload Now</button>
          </div>

          <div className="task-box box-cases">
            <img src="/active-cases-img.png" alt="Cases Icon" className="task-box-icon" />
            <h3>{dashboardData.activeCases.length} Active Cases</h3>
          </div>

          <div className="task-box box-deadlines">
            <img src="/schedule-deadline-img.png" alt="Deadlines Icon" className="task-box-icon" />
            <h3>{dashboardData.deadlines.length} Deadlines This Week</h3>
            <ul>{dashboardData.deadlines.map((d, i) => (<li key={i}>{d}</li>))}</ul>
          </div>

          <div className="task-box box-taskboard">
            <img src="/tasks-leaderboard-img.png" alt="Taskboard Icon" className="task-box-icon" />
            <h3>Legal Taskboard</h3>
            <div id="tasks">
              <p>{dashboardData.pendingTasks} Pending</p>
              <p>{dashboardData.completedTasks} Completed</p>
            </div>
          </div>
        </div>

        <div id="recent-cases">
          <h2>Recent Cases</h2>
          <p>Stay updated with your latest cases</p>
          <div id="recent-cards">
            {dashboardData.activeCases.map((caseItem) => (
              <div key={caseItem._id} className="case-card">
                <h3>{caseItem.caseTitle}</h3>
                <p><strong>Client:</strong> {caseItem.client?.name || "N/A"}</p>
                <p>Status: {caseItem.status}</p>
                <button className="view-details">View Details</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerDashboard;
