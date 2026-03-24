let activeAudio = null;
let activePlayBtn = null;
let activeProgressFill = null;
let activeProgressInterval = null;
let activeLi = null;

function stopActive() {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio = null;
  }
  if (activePlayBtn) {
    activePlayBtn.textContent = "▶";
    activePlayBtn.classList.remove("playing");
    activePlayBtn = null;
  }
  if (activeProgressFill) {
    activeProgressFill.style.width = "0%";
    activeProgressFill = null;
  }
  if (activeProgressInterval) {
    clearInterval(activeProgressInterval);
    activeProgressInterval = null;
  }
  if (activeLi) {
    activeLi.classList.remove("is-playing");
    activeLi = null;
  }
}

function playSong(song, li, playBtn, progressFill) {
  if (activeAudio && activeLi === li) {
    stopActive();
    return;
  }

  stopActive();

  const audio = new Audio(song.previewUrl);
  activeAudio = audio;
  activePlayBtn = playBtn;
  activeProgressFill = progressFill;
  activeLi = li;

  playBtn.textContent = "⏸";
  playBtn.classList.add("playing");
  li.classList.add("is-playing");

  const DURATION = 30;
  let elapsed = 0;
  activeProgressInterval = setInterval(() => {
    elapsed += 0.25;
    const pct = Math.min((elapsed / DURATION) * 100, 100);
    progressFill.style.width = pct + "%";
    if (elapsed >= DURATION) stopActive();
  }, 250);

  audio.addEventListener("ended", stopActive);

  audio.play().catch((err) => {
    console.error("[player] play() failed:", err);
    stopActive();
  });
}

export function showTop10Loading() {
  const listEl = document.getElementById("top10");
  const stateEl = document.getElementById("top10-state");
  stopActive();
  if (listEl) listEl.innerHTML = "";
  if (stateEl) stateEl.textContent = "Loading…";
}

export function renderTop10(songs) {
  const listEl = document.getElementById("top10");
  const stateEl = document.getElementById("top10-state");
  if (!listEl) return;

  stopActive();
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

    if (song.previewUrl) {
      li.classList.add("has-preview");
      li.title = "Click to play 30s preview";
    }

    const imgWrap = document.createElement("div");
    imgWrap.className = "top10-img-wrap";

    if (song.image) {
      const img = document.createElement("img");
      img.src = song.image;
      img.alt = song.title;
      img.width = 44;
      img.height = 44;
      imgWrap.appendChild(img);
    }

    const rankBadge = document.createElement("span");
    rankBadge.className = "top10-rank-badge";
    rankBadge.textContent = `${index + 1}`;
    imgWrap.appendChild(rankBadge);

    li.appendChild(imgWrap);

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

    const progressWrap = document.createElement("div");
    progressWrap.className = "play-progress";
    const progressFill = document.createElement("div");
    progressFill.className = "play-progress-fill";
    progressWrap.appendChild(progressFill);
    textWrapper.appendChild(progressWrap);

    li.appendChild(textWrapper);

    const playBtn = document.createElement("button");
    playBtn.className = "btn-play";
    playBtn.setAttribute("aria-label", `Play preview of ${song.title}`);
    playBtn.textContent = "▶";

    if (song.previewUrl) {
      li.addEventListener("click", (e) => {
        if (e.target === playBtn) return;
        playSong(song, li, playBtn, progressFill);
      });

      playBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        playSong(song, li, playBtn, progressFill);
      });
    } else {
      playBtn.disabled = true;
      playBtn.classList.add("no-preview");
    }

    li.appendChild(playBtn);

    listEl.appendChild(li);
  });
}

export function showTop10Error(message) {
  const listEl = document.getElementById("top10");
  const stateEl = document.getElementById("top10-state");
  stopActive();
  if (listEl) listEl.innerHTML = "";
  if (stateEl) stateEl.textContent = `Error: ${message}`;
}
