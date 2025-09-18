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

const getPlaces = async (req, res) => {
  const query = `
     [out:json][timeout:60];
    area["ISO3166-1"="GH"]->.ghana;

    (
      node["natural"="beach"](area.ghana);
      way["natural"="beach"](area.ghana);
      relation["natural"="beach"](area.ghana);
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
        const name = el.tags?.name || "Unknown Beach";

        let image = el.tags?.image || null;
        if (!image && el.tags?.wikimedia_commons) {
          const file = el.tags.wikimedia_commons.replace(/ /g, "_");
          image = `https://commons.wikimedia.org/wiki/Special:FilePath/${file}`;
        }
        if (!image && name !== "Unknown Beach") {
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
    return res.status(500).json({ error: "Failed to fetch beaches data" });
  }
};

module.exports = getPlaces;
