import React from "react";
import BeachesHero from "../components/Heros/BeachesHero";
import UniversalCard from "../components/cards/UniversalCard";
const Hospitals = () => {
  return (
    <>
      <BeachesHero
        headline={"All hospitals in Ghana"}
        description={"Find hospitals around and across Ghana."}
      />
      <UniversalCard
        url="https://gmh-backend.vercel.app/api/hospitals"
        imageUrl="https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg"
        unknown="Unknown Hospital"
        name="Hospital"
      />
    </>
  );
};

export default Hospitals;
