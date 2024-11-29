import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";  // Correctly import useDispatch
import Logout from "./Logout.jsx";


function Navbar() {
  const navigate = useNavigate();
  // const dispatch = useDispatch();  // Use dispatch here
  const status = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);  // user should be fetched from auth slice
  
//console.log("userId", user.userId)

const userId = user.userId;

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Add Post", slug: "/add-post", active: status === true },
    { name: "Login", slug: "/login", active: status === false },
    { name: "Signup", slug: "/signup", active: status === false },
  ];

  return (
    <nav className="bg-stone-700 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div>
          <h1
            className="text-white text-lg font-bold cursor-pointer"
            onClick={() => navigate("/")}
          >
            MyApp
          </h1>
        </div>

        <ul className="flex items-center space-x-6">
          {navItems.map(
            (item) =>
              item.active && (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className="text-white px-4 py-2 hover:bg-gray-600 rounded"
                  >
                    {item.name}
                  </button>
                </li>
              )
          )}

          {status === true &&  (
            <>
              <li className="text-white px-4 py-2 hover:bg-gray-600 rounded">
                {/* Use user._id to access the current user's ID */}
                <Link to={`/my-post/${userId}`}>
                  My Posts
                </Link>
              </li>
              <li className="text-white">
                {user && <span>Welcome, {user.username || "User"}!</span>}
              </li>
              <li>
                <Logout />
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
