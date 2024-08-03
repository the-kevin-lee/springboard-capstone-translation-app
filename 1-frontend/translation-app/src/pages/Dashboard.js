import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);





  const handleViewTranslations = () => {
    navigate("/translations");
  };

  const handleEditUserInfo = () => {
    navigate("/edit-info");
  };

  const handleDeleteAccount = () => {
    navigate("/delete-account");
  };

  return (
    <div>
      <h1>Welcome to your Dashboard</h1>
      <button onClick={handleViewTranslations}>View Your Translatiosn</button>
      <button onClick={handleEditUserInfo}>Edit Your Info</button>
      <button onClick={handleDeleteAccount}>Delete Your Account</button>
    </div>
  );
};


export default Dashboard;