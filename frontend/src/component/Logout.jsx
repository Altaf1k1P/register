import { useDispatch } from "react-redux";
import  { logout }  from "../Store/authSlice.js";

const Logout = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    // Clear user state
    dispatch(logout());

    // Optionally, redirect to login or home page
    window.location.href = "/login"; // Adjust path as needed
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;
