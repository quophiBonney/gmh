const axios = require("axios");

const getSites = async (req, res) => {
  try {
    const sparqlQuery = `
      SELECT DISTINCT ?item ?itemLabel ?image ?coord WHERE {
        VALUES ?class {
          wd:Q1081138   # tourist attraction
          wd:Q23413     # museum
          wd:Q57831     # castle
          wd:Q839954    # archaeological site
          wd:Q33506     # world heritage site
          wd:Q570116    # national park
          wd:Q27686     # hotel
          wd:Q40080     # beach
          wd:Q8502      # mountain
          wd:Q16917     # university
          wd:Q16970     # hospital
          wd:Q200508    # shopping mall
        }
        ?item wdt:P31/wdt:P279* ?class ;
              wdt:P17 wd:Q117 ;       # Ghana
              wdt:P18 ?image .
        OPTIONAL { ?item wdt:P625 ?coord. }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      }
      ORDER BY ?itemLabel
    `;
    const url = "https://query.wikidata.org/sparql";

    const response = await axios.get(url, {
      params: {
        format: "json",
        query: sparqlQuery,
      },
    });

    const results = response.data.results.bindings.map((place) => ({
      id: place.item.value,
      name: place.itemLabel?.value,
      image: place.image?.value,
      coord: place.coord?.value,
    }));

    res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch places" });
  }
};
module.exports = getSites;
