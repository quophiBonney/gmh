import React, { useState, useEffect } from "react";

const Topbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ease-in-out ${
        scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="px-6 lg:px-12 transition-all duration-700 ease-in-out">
        <nav
          className={`flex justify-between items-center text-gray-800 backdrop-blur-md bg-white/90 px-4 md:px-6 py-3 transition-all duration-700 ease-in-out ${
            scrolled ? "rounded-none" : "rounded-xl"
          }`}
        >
          {/* Logo */}
          <div>
            <a href="/">
              <h1 className="text-2xl font-bold text-green-600 uppercase">
                GMH
              </h1>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 items-center">
            <a
              href="/"
              className="hover:text-green-700 transition duration-300"
            >
              Home
            </a>
            <a
              href="/ghana/malls"
              className="hover:text-green-700 transition duration-300"
            >
              Malls
            </a>
            <a
              href="/ghana/tourist-sites"
              className="hover:text-green-700 transition duration-300"
            >
              Tourist Sites
            </a>
            <a
              href="/ghana/hospitals"
              className="hover:text-green-700 transition duration-300"
            >
              Hospitals
            </a>
            <a
              href="/ghana/restaurants"
              className="hover:text-green-700 transition duration-300"
            >
              Restaurants
            </a>
            <a
              href="/ghana/beaches"
              className="hover:text-green-700 transition duration-300"
            >
              Beaches
            </a>
            <a
              href="/ghana/hotels"
              className="hover:text-green-700 transition duration-300"
            >
              Hotels
            </a>
            <a
              href="/users/registration"
              target="_blank"
              className="bg-green-600 rounded text-white p-2 block transition duration-300"
            >
              Register
            </a>
          </div>

          {/* Hamburger (Mobile) */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="bg-green-600 text-white p-2 rounded focus:outline-none"
            >
              {!open ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        {open && (
          <div className="md:hidden mt-2 rounded bg-white w-full text-black px-4 py-3 space-y-3 transition-all duration-300">
            <a
              href="/"
              className="block hover:text-green-700 transition duration-300"
            >
              Home
            </a>
            <a
              href="about-us.php"
              className="block hover:text-green-700 transition duration-300"
            >
              About Us
            </a>
            <a
              href="contact.php"
              className="block hover:text-green-700 transition duration-300"
            >
              Contact
            </a>
            <a
              href="customers/login.php"
              className="bg-green-600 rounded text-white p-3 block transition duration-300"
            >
              Portal
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
