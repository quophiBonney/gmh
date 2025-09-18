import React from "react";
import UniversalCard from "../components/cards/UniversalCard";
import HotelsHero from "../components/Heros/HotelsHero";
const Hotels = () => {
  return (
    <>
      <HotelsHero />
      <UniversalCard
        url="https://gmh-backend.vercel.app/api/hotels"
        imageUrl="https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg"
        unknown="Unknow Hotel"
        name="Hotel"
      />
    </>
  );
};

export default Hotels;
