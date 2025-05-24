import React, { useState } from "react";
import { fetchRecommendations } from "../utils/fetchrecommendation";


function RecommendResults() {
  const [query, setQuery] = useState("learn python");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const data = await fetchRecommendations(query, "user1");
      setResults(data);
    } catch (err) {
      console.error("Error:", err);
      alert("Could not fetch recommendations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Learning Resource Recommendations</h2>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter search query"
        style={{ marginRight: "1rem" }}
      />
      <button onClick={handleClick}>Get Recommendations</button>

      {loading && <p>Loading...</p>}

      <ul>
        {results.map((item, index) => (
          <li key={index}>
            <a href={item.link} target="_blank" rel="noreferrer">
              {item.title} — ⭐ {item.predicted_rating.toFixed(2)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecommendResults;