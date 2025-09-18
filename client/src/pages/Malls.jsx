import React from "react";
import BeachesHero from "../components/Heros/BeachesHero";
import UniversalCard from "../components/cards/UniversalCard";
const ShoppingMalls = () => {
  return (
    <>
      <BeachesHero
        headline={"All shopping malls in Ghana"}
        description={
          "Discover shopping malls and supermarkets across the entire Ghana."
        }
      />
      <UniversalCard
        url="http://localhost:5000/api/shipping-malls"
        imageUrl="https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg"
        unknown="Unknown Shopping Mall"
        name="Shopping Mall"
      />
    </>
  );
};

export default ShoppingMalls;
