import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HomeHero = () => {
  const [formData, setFormData] = useState({ region: "", category: "" });
  const [loading, setLoading] = useState(false); // NEW
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // start loading

    axios
      .get("http://localhost:5000/api/search", {
        params: {
          region: formData.region,
          category: formData.category,
        },
      })
      .then((response) => {
        console.log(response.data);
        navigate(
          `/destinations?category=${encodeURIComponent(
            formData.category
          )}&region=${encodeURIComponent(formData.region)}`
        );
      })
      .catch((error) => {
        console.error("Error fetching search results:", error);
      })
      .finally(() => {
        setLoading(false); // stop loading
      });
  };

  return (
    <div className="h-screen flex justify-center items-center home-hero text-white">
      <div className="w-full max-w-7xl text-center px-5 md:px-0">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
          Welcome to Ghana Our Home
        </h1>
        <p className="text-xl mb-8">
          Discover amazing content and connect with us!
        </p>
        <div className="shadow-md bg-white p-5 rounded-lg">
          <form
            className="w-full flex flex-col md:flex-row gap-5"
            onSubmit={handleSubmit}
          >
            <select
              className="w-full px-4 py-3 rounded-l-full text-gray-700 focus:outline-none"
              name="category"
              onChange={handleChange}
              defaultValue="#"
            >
              <option value="#" disabled>
                Select your destination
              </option>
              <option value="airport">Airport</option>
              <option value="bank">Bank</option>
              <option value="beach">Beach</option>
              <option value="castle">Castle</option>
              <option value="church">Church</option>
              <option value="hotel">Hotel</option>
              <option value="mountain">Mountain</option>
              <option value="museum">Museum</option>
              <option value="national_park">Park</option>
              <option value="hospital">Hospital</option>
              <option value="restaurant">Restaurant</option>
              <option value="school">School</option>
              <option value="shopping_mall">Shopping Mall</option>
              <option value="stadium">Stadium</option>
              <option value="theater">Theater</option>
              <option value="zoo">Zoo</option>
            </select>

            <select
              className="w-full px-4 py-3 rounded-l-full text-gray-700 focus:outline-none"
              name="region"
              onChange={handleChange}
              defaultValue="#"
            >
              <option value="#" disabled>
                Select region
              </option>
              <option value="greater accra region">Greater Accra Region</option>
              <option value="ashanti region">Ashanti Region</option>
              <option value="central region">Central Region</option>
              <option value="volta region">Volta Region</option>
              <option value="oti region">Oti Region</option>
              <option value="western region">Western Region</option>
              <option value="western north region">Western North</option>
              <option value="ahafo region">Ahafo Region</option>
              <option value="nothern region">Northern Region</option>
              <option value="upper east region">Upper East</option>
              <option value="upper west region">Upper West</option>
              <option value="techiman south region">Techiman South</option>
              <option value="savannah region">Savannah Region</option>
              <option value="bono east region">Bono East Region</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className={`rounded w-full px-6 py-3 font-semibold transition ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-green-500 hover:scale-105 cursor-pointer"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 010 16v4l3.5-3.5L12 20v4a8 8 0 01-8-8z"
                    ></path>
                  </svg>
                  Searching ...
                </span>
              ) : (
                "Search"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
