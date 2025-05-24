export async function fetchRecommendations(query, userId) {
  const response = await fetch("http://192.168.93.55:8000/recommend", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: query,
      user_id: userId
    })
  });

  if (!response.ok) {
    throw new Error("Failed to fetch recommendations");
  }

  const data = await response.json();
  return data;
}