import { useDispatch, useSelector } from "react-redux";
import  { logout }  from "../Store/authSlice.js";

const Logout = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.auth.isAuthenticated)

  const handleLogout = () => {
    // Clear user state
    dispatch(logout());
    // Check if the user is still authenticated after logout
    if (status === false) {
      window.location.href = "/login"; // Redirect to login page
    }
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;
