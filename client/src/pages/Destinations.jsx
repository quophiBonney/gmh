import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import DestinationCards from "../components/cards/DestinationCards";
import DestinationsHero from "../components/Heros/DestinationsHero";

const ACCRA_COORDS = { lat: 5.6037, lon: -0.187 };

function getDistanceKm(coord1, coord2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLon = toRad(coord2.lon - coord1.lon);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(coord1.lat)) *
      Math.cos(toRad(coord2.lat)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const Destinations = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");
  const region = queryParams.get("region");

  const [places, setPlaces] = useState([]);
  const [sortOption, setSortOption] = useState("name-asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!category || !region) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://gmh-backend.vercel.app/api/search",
          {
            params: { category, region },
          }
        );

        const placesWithExtras = res.data.map((p) => {
          const [lat, lon] = p.coord
            ? p.coord.replace("Point(", "").replace(")", "").split(" ")
            : [null, null];

          const dist =
            lat && lon
              ? getDistanceKm(ACCRA_COORDS, {
                  lat: parseFloat(lat),
                  lon: parseFloat(lon),
                })
              : null;

          return {
            ...p,
            rating: (Math.random() * 2 + 3).toFixed(1),
            distance: dist ? dist.toFixed(1) : null,
          };
        });

        setPlaces(placesWithExtras);
      } catch (err) {
        console.error(err);
        setError("Failed to load places.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, region]);

  const sortPlaces = (data) => {
    switch (sortOption) {
      case "name-asc":
        return [...data].sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return [...data].sort((a, b) => b.name.localeCompare(a.name));
      case "rating":
        return [...data].sort((a, b) => b.rating - a.rating);
      case "distance":
        return [...data].sort(
          (a, b) => (a.distance || 99999) - (b.distance || 99999)
        );
      default:
        return data;
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-xl">
        Loading places...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex justify-center items-center text-red-600 text-xl">
        {error}
      </div>
    );
  }

  const sortedPlaces = sortPlaces(places);

  return (
    <>
      <DestinationsHero />
      <div className="min-h-screen px-5 md:px-10 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <input
            type="search"
            className="px-4 py-2 rounded-md border text-gray-700"
            placeholder="Search by name..."
          />

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-4 py-2 rounded-md border text-gray-700"
          >
            <option value="name-asc">Sort by Name (A–Z)</option>
            <option value="name-desc">Sort by Name (Z–A)</option>
            <option value="rating">Sort by Rating</option>
            <option value="distance">Sort by Distance</option>
          </select>
        </div>

        {sortedPlaces.length === 0 ? (
          <p className="text-gray-600 text-lg">
            No results found. Try another region or category.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedPlaces.map((place) => (
              <DestinationCards key={place.id} place={place} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Destinations;
