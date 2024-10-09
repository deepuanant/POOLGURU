import React from "react";
import { useSelector } from "react-redux";
// import { logout } from "../features/app/userslice";

function Dashboard() {
  const user = useSelector((state) => state.auth.user);

  return (
    <div>
      <h2>Welcome, {user.username}!</h2>
      {/* <button onClick={handleLogout}>Log out</button> */}
    </div>
  );
}

export default Dashboard;
