import React from "react";
import BeachesHero from "../components/Heros/BeachesHero";
import UniversalCard from "../components/cards/UniversalCard";
const TouristSites = () => {
  return (
    <>
      <BeachesHero
        headline={"All tourist sites in Ghana"}
        description={
          "Explore and discover some of the magnificent and outstanding sites nature has endowed Ghana with."
        }
      />
      <UniversalCard
        // url="http://localhost:5000/api/tourist-sites"
        url="https://gmh-backend.vercel.app/api/tourist-sites"
        imageUrl="https://images.pexels.com/photos/19031621/pexels-photo-19031621.jpeg"
        unknown="Unknown Tourist Site"
        name="Tourist Site"
      />
    </>
  );
};

export default TouristSites;
