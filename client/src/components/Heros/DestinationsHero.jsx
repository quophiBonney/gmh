import { useLocation } from "react-router-dom";

const DestinationsHero = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get("category");
  const region = params.get("region");

  return (
    <div className="py-28 text-center bg-green-600 p-5">
      <div className="mt-10 mb-10 text-white">
        <h1 className="text-5xl font-bold mb-4 capitalize">
          {category + "s" || "Destinations"}
        </h1>
        <p className="text-xl capitalize">
          Showing {category}s in {region || "Ghana"}
        </p>
      </div>
    </div>
  );
};

export default DestinationsHero;
