const express = require("express");
const router = express.Router();
const getSites = require("../controllers/get_sites_controller");
const getUserSelectedMatch = require("../controllers/users_selected_category");
const getBeaches = require("../controllers/get_beaches_controller");
const getHotels = require("../controllers/get_hotels_controller");
const getTouristSites = require("../controllers/get_tourist_sites");
const getHospitals = require("../controllers/get_hospitals_controller");
const getShoppingMalls = require("../controllers/get_malls_controller");

router.get("/sites", getSites);
router.get("/search", getUserSelectedMatch);
router.get("/beaches", getBeaches);
router.get("/hotels", getHotels);
router.get("/tourist-sites", getTouristSites);
router.get("/hospitals", getHospitals);
router.get("/shopping-malls", getShoppingMalls);

module.exports = router;
