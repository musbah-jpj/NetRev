
//Generate the key first
const OMDB_API_KEY = "3fd65e10";

//Find insertion and title now
let lastTitle = null;
function getVisibleTitle() {
  if (document.title && document.title.includes("Netflix")) {
    return document.title.replace(" - Netflix", "").trim();
  }
  return null;
}

async function fetchImdbRating(title) {
  const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${OMDB_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.Response === "True" && data.imdbRating !== "N/A") {
    return (parseFloat(data.imdbRating) / 2).toFixed(1);
  }
  return "N/A";
}

// Update the rating
async function updateRating() {
  const controls = document.querySelector('[data-uia="mini-modal-controls"]');
  if (!controls) return; // wait until controls exist

  const title = getVisibleTitle();
  if (!title) return;
  if (title === lastTitle) return;
  lastTitle = title;

  console.log("Netflix title →", title);

  const oldStar = document.getElementById("netrev-star");
  if (oldStar) oldStar.remove();

  const star = document.createElement("div");
  star.id = "netrev-star";
  star.textContent = "⭐ loading...";
  star.style.color = "white";
  star.style.fontSize = "14px";
  star.style.marginLeft = "10px";
  star.style.display = "flex";
  star.style.alignItems = "center";

  controls.appendChild(star);

  const rating = await fetchImdbRating(title);
  star.textContent = rating === "N/A" ? "⭐ N/A" : `⭐ ${rating} / 5`;
}

setInterval(updateRating, 800);