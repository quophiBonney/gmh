import React, { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import DestinationCards from "../components/cards/DestinationCards";

const ACCRA_COORDS = { lat: 5.6037, lon: -0.187 };

// Haversine formula to calculate distance between two coordinates
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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name-asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!category || !region) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("http://localhost:5000/api/search", {
          params: { category, region },
        });

        const placesWithExtras = res.data.map((p) => {
          // parse coords expected "Point(lon lat)" or other variants
          let lat = null;
          let lon = null;
          if (p.coord && typeof p.coord === "string") {
            const m = p.coord.match(/Point\(\s*([-.\d]+)\s+([-.\d]+)\s*\)/i);
            if (m && m.length >= 3) {
              lon = parseFloat(m[1]);
              lat = parseFloat(m[2]);
            } else {
              // try a simple split fallback
              const parts = p.coord.replace(/[()]/g, "").split(/\s+/);
              if (parts.length >= 2) {
                const maybe0 = parseFloat(parts[0]);
                const maybe1 = parseFloat(parts[1]);
                // heuristic: lat is between -90 and 90
                if (Math.abs(maybe1) <= 90) {
                  lon = maybe0;
                  lat = maybe1;
                } else {
                  lon = maybe1;
                  lat = maybe0;
                }
              }
            }
          }

          const dist =
            lat !== null && lon !== null
              ? getDistanceKm(ACCRA_COORDS, { lat, lon })
              : null;

          return {
            ...p,
            // safe name fallback
            name:
              (p.name || p.label || p.itemLabel || "").toString() ||
              "Unknown place",
            description: p.description || p.summary || "",
            rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // 3.0 - 5.0
            distance: dist !== null ? Number(dist.toFixed(1)) : null,
          };
        });

        setPlaces(placesWithExtras);
      } catch (err) {
        console.error("fetch error:", err);
        setError("Failed to load places.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, region]);

  // filter by name, region, or description (case-insensitive)
  const filtered = useMemo(() => {
    const q = (searchTerm || "").trim().toLowerCase();
    if (!q) return places;
    return places.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const reg = (p.region || "").toLowerCase();
      const desc = (p.description || "").toLowerCase();
      return name.includes(q) || reg.includes(q) || desc.includes(q);
    });
  }, [places, searchTerm]);

  // sort filtered results
  const sortedPlaces = useMemo(() => {
    const data = [...filtered];
    switch (sortOption) {
      case "name-asc":
        return data.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      case "name-desc":
        return data.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
      case "rating":
        return data.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "distance":
        return data.sort(
          (a, b) =>
            (a.distance !== null && a.distance !== undefined
              ? a.distance
              : 999999) -
            (b.distance !== null && b.distance !== undefined
              ? b.distance
              : 999999)
        );
      default:
        return data;
    }
  }, [filtered, sortOption]);

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

  return (
    <div className="min-h-screen px-5 md:px-10 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full sm:w-1/2">
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-md border text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Search by name, region or description..."
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-500 text-gray-500 hover:text-gray-900"
              >
                X
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              Showing {sortedPlaces.length} result
              {sortedPlaces.length !== 1 ? "s" : ""}
            </div>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-4 py-2 rounded-md border text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="name-asc">Sort by Name (A–Z)</option>
              <option value="name-desc">Sort by Name (Z–A)</option>
              <option value="rating">Sort by Rating</option>
              <option value="distance">Sort by Distance</option>
            </select>
          </div>
        </div>

        {sortedPlaces.length === 0 ? (
          <p className="text-gray-600 text-lg">
            No results found. Try another search.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedPlaces.map((place) => (
              <DestinationCards key={place.id || place.name} place={place} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Destinations;
