import { useEffect, useState, useMemo } from "react";
import axios from "axios";

const ACCRA = { lat: 5.6037, lon: -0.187 };
const ITEMS_PER_PAGE = 6;

// Haversine formula
const getDistanceKm = (a, b) => {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const d =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(d), Math.sqrt(1 - d)));
};

export default function UniversalCard({ url, unknown, imageUrl, name }) {
  const [allPlaces, setAllPlaces] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name-asc");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch data from backend
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(url);
        const enriched = data.data.map((p) => ({
          id: p.id,
          name: p.name || unknown,
          image: p.image || imageUrl,
          rating: +(Math.random() * 2 + 3).toFixed(1),
          lat: p.lat,
          lon: p.lon,
          distance:
            p.lat && p.lon
              ? +getDistanceKm(ACCRA, { lat: p.lat, lon: p.lon }).toFixed(1)
              : null,
        }));
        setAllPlaces(enriched);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter + sort
  const filtered = useMemo(() => {
    let list = allPlaces;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    switch (sort) {
      case "name-desc":
        return list.slice().sort((a, b) => b.name.localeCompare(a.name));
      case "rating":
        return list.slice().sort((a, b) => b.rating - a.rating);
      case "distance":
        return list
          .slice()
          .sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999));
      default:
        return list.slice().sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [allPlaces, search, sort]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageData = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <div className="px-5 md:px-10 py-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow overflow-hidden animate-pulse"
            >
              <div className="h-48 w-full bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="flex justify-between mt-2">
                  <div className="h-3 bg-gray-200 rounded w-12" />
                  <div className="h-3 bg-gray-200 rounded w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 md:px-10 py-10">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="px-4 py-3 rounded-md border"
          placeholder="Search beaches..."
        />

        <div className="flex items-center gap-3">
          <span className="font-bold">
            {filtered.length} {name} found
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-3 rounded-md border"
          >
            <option value="name-asc">Name (A–Z)</option>
            <option value="name-desc">Name (Z–A)</option>
            <option value="rating">Rating</option>
            <option value="distance">Distance</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {pageData.length === 0 ? (
        <p className="text-gray-600">No {name} found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pageData.map((b) => (
            <div
              key={b.id}
              className="p-3 md:p-4 bg-white rounded-xl shadow hover:shadow-lg overflow-hidden"
            >
              <div>
                <img
                  src={b.image}
                  alt={b.name}
                  className="rounded h-48 w-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-3xl text-black">{b.name}</h3>
                <div className="flex justify-between text-gray-700">
                  <span>⭐ {b.rating}</span>
                  {b.distance !== null && <span>{b.distance} km</span>}
                </div>
                {b.lat && b.lon && (
                  <a
                    href={`https://www.google.com/maps?q=${b.lat},${b.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-center inline-block mt-3 p-3 rounded-md bg-green-600 text-white hover:bg-green-700"
                  >
                    Find Location
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10">
          <nav className="inline-flex items-center gap-1 bg-white border rounded-lg shadow-sm px-2 py-1">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-40"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === totalPages ||
                  (p >= page - 2 && p <= page + 2)
              )
              .map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    p === page
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              ))}
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-40"
            >
              ›
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
