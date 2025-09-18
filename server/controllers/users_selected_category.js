const axios = require("axios");

const categoryMap = {
  airport: "Q1248784",
  bank: "Q22687",
  beach: "Q40080",
  castle: "Q57831",
  church: "Q16970",
  hotel: "Q27686",
  mountain: "Q8502",
  museum: "Q33506",
  national_park: "Q570116",
  hospital: "Q16917",
  restaurant: "Q11707",
  school: "Q3914",
  shopping_mall: "Q200508",
  stadium: "Q483110",
  theater: "Q24354",
  zoo: "Q43501",
};

const getUserSelectedMatch = async (req, res) => {
  try {
    const { region, category } = req.query;
    if (!region || !category)
      return res
        .status(400)
        .json({ error: "Please provide both region and category" });

    const categoryId = categoryMap[category.toLowerCase()];
    if (!categoryId)
      return res.status(400).json({ error: "Invalid category provided" });

    const sparql = `
      SELECT DISTINCT ?item ?itemLabel ?itemDescription ?image ?coord ?inception ?website ?regionLabel WHERE {
        ?item wdt:P31/wdt:P279* wd:${categoryId};
              wdt:P17 wd:Q117;
              wdt:P131* ?region.
        ?region rdfs:label ?regionLabel.
        FILTER(LANG(?regionLabel)="en" && CONTAINS(LCASE(?regionLabel), LCASE("${region}")))
        OPTIONAL { ?item wdt:P18 ?image. }
        OPTIONAL { ?item wdt:P625 ?coord. }
        OPTIONAL { ?item wdt:P571 ?inception. }
        OPTIONAL { ?item wdt:P856 ?website. }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      }
      ORDER BY ?itemLabel
    `;

    const response = await axios.get("https://query.wikidata.org/sparql", {
      params: { format: "json", query: sparql },
    });

    const results = response.data.results.bindings.map((p) => ({
      id: p.item?.value,
      name: p.itemLabel?.value,
      description: p.itemDescription?.value || "No description available",
      image: p.image?.value || null,
      coord: p.coord?.value || null,
      inception: p.inception?.value || null,
      website: p.website?.value || null,
      region: p.regionLabel?.value || null,
    }));

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch places" });
  }
};

module.exports = getUserSelectedMatch;
