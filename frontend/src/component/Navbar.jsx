import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Logout from "./Logout.jsx";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Track menu state for mobile
  const navigate = useNavigate();
  const status = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  // Close the menu when status changes (e.g., after logout)
  useEffect(() => {
    if (!status) {
      setIsMenuOpen(false);
    }
  }, [status]);

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Add Post", slug: "/add-post", active: status === true },
    { name: "Login", slug: "/login", active: status === false },
    { name: "Signup", slug: "/signup", active: status === false },
  ];

  return (
    <nav className="bg-stone-800 shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div>
          <h1
            className="text-white text-2xl font-bold cursor-pointer"
            onClick={() => navigate("/")}
          >
            MyApp
          </h1>
        </div>

        {/* Hamburger Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              className={`w-8 h-8 transition-transform ${
                isMenuOpen ? "rotate-90" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <ul
          className={`${
            isMenuOpen ? "block" : "hidden"
          } lg:flex lg:items-center space-y-4 lg:space-y-0 lg:space-x-6 absolute lg:static top-16 left-0 w-full lg:w-auto bg-stone-800 lg:bg-transparent px-4 lg:px-0`}
        >
          {navItems.map(
            (item) =>
              item.active && (
                <li key={item.name} className="text-center text-white text-lg px-4 py-2 hover:bg-gray-700 rounded">
                  <button
                    onClick={() => {
                      navigate(item.slug);
                      setIsMenuOpen(false); // Close menu on click
                    }}
                    className="text-white text-lg px-4 py-2 hover:bg-gray-700 rounded block lg:inline transition"
                  >
                    {item.name}
                  </button>
                </li>
              )
          )}

          {status === true && (
            <>
              <li className="text-center text-white text-lg px-4 py-2 hover:bg-gray-700 rounded">
                <Link
                  to={`/my-post/${user?.userId}`}
                  onClick={() => setIsMenuOpen(false)} // Close menu on click
                  className="block lg:inline"
                >
                  My Posts
                </Link>
              </li>
              <li className="text-center text-white text-lg px-4 py-2">
                {user && (
                  <span className="font-medium italic">
                    Welcome, {user.username || "User"}!
                  </span>
                )}
              </li>
              <li className="text-center">
                <Logout onClick={() => setIsMenuOpen(false)} /> {/* Reset menu */}
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
