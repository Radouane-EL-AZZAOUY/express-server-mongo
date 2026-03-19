import {
  fetchTop10FromApi,
  fetchTop10FromDb,
} from "./apiClient.js";
import {
  showTop10Loading,
  renderTop10,
  showTop10Error,
} from "./ui.js";

function setupEventHandlers() {
  const top10ApiBtn = document.getElementById("btn-top10-api");
  const top10DbBtn = document.getElementById("btn-top10-db");

  if (top10ApiBtn) {
    top10ApiBtn.addEventListener("click", async () => {
      showTop10Loading();
      try {
        const data = await fetchTop10FromApi();
        renderTop10(data.songs || []);
      } catch (err) {
        console.error(err);
        showTop10Error(err.message || "Unknown error");
      }
    });
  }

  if (top10DbBtn) {
    top10DbBtn.addEventListener("click", async () => {
      showTop10Loading();
      try {
        const data = await fetchTop10FromDb();
        renderTop10(data.songs || []);
      } catch (err) {
        console.error(err);
        showTop10Error(err.message || "Unknown error");
      }
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupEventHandlers);
} else {
  setupEventHandlers();
}
