import React from "react";

const DestinationCards = ({ place }) => {
  if (!place) return null;

  const placeholder = "https://via.placeholder.com/600x400?text=No+Image";

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
      <img
        src={place?.image || placeholder}
        alt={place?.name || "Place"}
        className="h-48 w-full object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-1">{place?.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{place?.region || ""}</p>

        <div className="flex justify-between items-center mb-2 text-sm text-gray-700">
          <span>⭐ {place?.rating ?? "—"}</span>
          {place?.distance !== null && place?.distance !== undefined ? (
            <span>{place.distance} km from Accra</span>
          ) : null}
        </div>

        <p className="text-sm text-gray-700 line-clamp-3">
          {place?.description || "No description available."}
        </p>
      </div>
    </div>
  );
};

export default DestinationCards;
