// controllers/getPlaces.js
const axios = require("axios");

const overpassUrl = "https://overpass-api.de/api/interpreter";

async function getWikipediaImage(name) {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php`;
    const resp = await axios.get(searchUrl, {
      params: {
        action: "query",
        prop: "pageimages",
        piprop: "thumbnail",
        pithumbsize: 800,
        format: "json",
        generator: "search",
        gsrsearch: name + " Ghana",
        gsrlimit: 1,
        origin: "*",
      },
    });

    const pages = resp.data?.query?.pages || {};
    const first = Object.values(pages)[0];
    return first?.thumbnail?.source || null;
  } catch {
    return null;
  }
}

const getTouristSites = async (req, res) => {
  const query = `
  [out:json][timeout:60];
area["ISO3166-1"="GH"]->.ghana;

(
  node["tourism"~"^(attraction|museum|artwork|castle|heritage)$"](area.ghana);
  way["tourism"~"^(attraction|museum|artwork|castle|heritage)$"](area.ghana);
  relation["tourism"~"^(attraction|museum|artwork|castle|heritage)$"](area.ghana);

  node["historic"](area.ghana);
  way["historic"](area.ghana);
  relation["historic"](area.ghana);

  node["boundary"="national_park"](area.ghana);
  way["boundary"="national_park"](area.ghana);
  relation["boundary"="national_park"](area.ghana);

  node["leisure"="nature_reserve"](area.ghana);
  way["leisure"="nature_reserve"](area.ghana);
  relation["leisure"="nature_reserve"](area.ghana);
);

out center tags;
  `;

  try {
    const response = await axios.post(overpassUrl, query, {
      headers: { "Content-Type": "text/plain" },
    });

    const elements = response.data.elements || [];

    const places = await Promise.all(
      elements.map(async (el) => {
        const name = el.tags?.name || "Unknown Tourist Site";

        let image = el.tags?.image || null;
        if (!image && el.tags?.wikimedia_commons) {
          const file = el.tags.wikimedia_commons.replace(/ /g, "_");
          image = `https://commons.wikimedia.org/wiki/Special:FilePath/${file}`;
        }
        if (!image && name !== "Unknown Tourist Site") {
          image = await getWikipediaImage(name);
        }

        return {
          id: el.id,
          name,
          type: el.tags?.natural || "unknown",
          lat: el.lat || el.center?.lat,
          lon: el.lon || el.center?.lon,
          image,
          tags: el.tags || {},
        };
      })
    );

    return res.json({
      total: places.length,
      data: places,
    });
  } catch (err) {
    console.error("Error fetching data:", err.message);
    return res
      .status(500)
      .json({ error: "Failed to fetch tourist sites data" });
  }
};

module.exports = getTouristSites;
