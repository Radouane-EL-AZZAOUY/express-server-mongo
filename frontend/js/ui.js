export function getFormData() {
  const form = document.getElementById("contact-form");
  const nameInput = form?.elements.namedItem("name");
  const emailInput = form?.elements.namedItem("email");

  const name = nameInput && "value" in nameInput ? nameInput.value : "";
  const email = emailInput && "value" in emailInput ? emailInput.value : "";

  return { name, email };
}

export function showSubmitMessage(message) {
  const msgEl = document.getElementById("submit-msg");
  if (msgEl) {
    msgEl.textContent = message;
  }
}

export function downloadJson(data) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "data.json";
  link.click();
  URL.revokeObjectURL(url);
}

export function showTop10Loading() {
  const listEl = document.getElementById("top10");
  const stateEl = document.getElementById("top10-state");
  if (listEl) {
    listEl.innerHTML = "";
  }
  if (stateEl) {
    stateEl.textContent = "Loading…";
  }
}

export function renderTop10(songs) {
  const listEl = document.getElementById("top10");
  const stateEl = document.getElementById("top10-state");
  if (!listEl) return;

  listEl.innerHTML = "";

  if (!songs || songs.length === 0) {
    if (stateEl) {
      stateEl.textContent = "No results. Use the buttons above to load the chart.";
    }
    return;
  }

  if (stateEl) {
    stateEl.textContent = `Showing ${songs.length} songs`;
  }

  songs.forEach((song, index) => {
    const li = document.createElement("li");

    if (song.image) {
      const img = document.createElement("img");
      img.src = song.image;
      img.alt = song.title;
      img.width = 55;
      img.height = 55;
      li.appendChild(img);
    }

    const textWrapper = document.createElement("div");
    textWrapper.className = "top10-track";

    const titleEl = document.createElement("div");
    titleEl.className = "top10-title";
    titleEl.textContent = song.title;

    const authorEl = document.createElement("div");
    authorEl.className = "top10-author";
    authorEl.textContent = song.author || "Unknown artist";

    textWrapper.appendChild(titleEl);
    textWrapper.appendChild(authorEl);
    li.appendChild(textWrapper);

    const indexEl = document.createElement("div");
    indexEl.className = "top10-index";
    indexEl.textContent = `#${index + 1}`;
    li.appendChild(indexEl);

    listEl.appendChild(li);
  });
}

export function showTop10Error(message) {
  const listEl = document.getElementById("top10");
  const stateEl = document.getElementById("top10-state");
  if (listEl) {
    listEl.innerHTML = "";
  }
  if (stateEl) {
    stateEl.textContent = `Error: ${message}`;
  }
}

