import React from "react";
import BeachesCard from "../components/cards/UniversalCard";
import BeachesHero from "../components/Heros/BeachesHero";
import UniversalCard from "../components/cards/UniversalCard";
const Beaches = () => {
  return (
    <>
      <BeachesHero
        headline={"All beaches in Ghana"}
        description={
          "Explore the beauty and electrifying moment of the beaches across Ghana"
        }
      />
      <UniversalCard
        url="http://localhost:5000/api/beaches"
        imageUrl="https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg"
        unknown="Unknown Beach"
        name="Beach"
      />
    </>
  );
};

export default Beaches;
