import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Destinations from "./pages/Destinations";
import Beaches from "./pages/Beaches";
import Hotels from "./pages/Hotels";
import TouristSites from "./pages/TouristSites";

import Footer from "./components/footer/Footer";
import Topbar from "./components/navbar/Navbar";
import Hospitals from "./pages/Hospitals";
import ShoppingMalls from "./pages/Malls";
export default function App() {
  return (
    <>
      <Topbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/ghana/beaches" element={<Beaches />} />
        <Route path="/ghana/hotels" element={<Hotels />} />
        <Route path="/ghana/tourist-sites" element={<TouristSites />} />
        <Route path="/ghana/hospitals" element={<Hospitals />} />
        <Route path="/ghana/shopping-malls" element={<ShoppingMalls />} />
      </Routes>
      <Footer />
    </>
  );
}
