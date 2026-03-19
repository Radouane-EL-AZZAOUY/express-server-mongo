const API_BASE = "";

async function handleJsonResponse(response) {
  if (!response.ok) {
    throw new Error("Request failed: " + response.status);
  }
  const data = await response.json();
  if (!data.ok) {
    throw new Error(data.error || "Unknown error");
  }
  return data;
}

export async function fetchTop10FromApi() {
  const res = await fetch(`${API_BASE}/top10`);
  return handleJsonResponse(res);
}

export async function fetchTop10FromDb() {
  const res = await fetch(`${API_BASE}/top10/db`);
  return handleJsonResponse(res);
}

