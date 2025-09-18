const axios = require("axios");

const getHotels = async (req, res) => {
  try {
    const endpoint = "https://query.wikidata.org/sparql";

    const sparql = `
      SELECT ?item ?itemLabel ?itemDescription ?coord ?image ?adminLabel WHERE {
        ?item wdt:P31/wdt:P279* wd:Q27686.      # instance of beach
        ?item wdt:P17 wd:Q117.                  # located in Ghana
        OPTIONAL { ?item wdt:P625 ?coord. }
        OPTIONAL { ?item wdt:P18 ?image. }
        OPTIONAL { ?item wdt:P131 ?admin. }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      }
    `;

    const response = await axios.post(
      endpoint,
      new URLSearchParams({
        query: sparql,
        format: "json",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/sparql-results+json",
          "User-Agent": "GhanaTourismApp/1.0 (https://yourdomain.com)",
        },
        timeout: 120000,
      }
    );

    const bindings = response.data.results.bindings;

    const hotels = bindings.map((b) => {
      let coords = null;
      if (b.coord?.value) {
        const match = b.coord.value.match(/Point\\(([-\\d.]+) ([-\\d.]+)\\)/);
        if (match) {
          coords = { lon: parseFloat(match[1]), lat: parseFloat(match[2]) };
        }
      }

      return {
        id: b.item?.value?.replace("http://www.wikidata.org/entity/", "") || "",
        name: b.itemLabel?.value || "",
        description: b.itemDescription?.value || "No description available",
        region: b.adminLabel?.value || "Unknown Region",
        coord: coords,
        image: b.image?.value || "",
        mapUrl: coords
          ? `https://www.google.com/maps?q=${coords.lat},${coords.lon}`
          : null,
      };
    });

    res.json(hotels);
  } catch (err) {
    console.error("Error fetching hotels:", err.message);
    res.status(500).json({ error: "Failed to fetch hotels" });
  }
};

module.exports = getHotels;
