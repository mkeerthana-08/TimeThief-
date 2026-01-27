document.addEventListener("DOMContentLoaded", () => {

  let time = 10;
  let score = 0;
  let timerInterval;
  let gameInterval;
  let gameOver = false;

  let selectedAvatar = "🧑‍🚀";
  let playerName = "Player";

  const objects = [
    { emoji: "⏰", time: 2, score: 0 },
    { emoji: "⭐", time: 5, score: 2 },
    { emoji: "💣", time: -3, score: 0 }
  ];

  const body = document.body;
  const startScreen = document.getElementById("startScreen");
  const gameScreen = document.getElementById("gameScreen");
  const popup = document.getElementById("popup");

  const timeEl = document.getElementById("time");
  const scoreEl = document.getElementById("score");
  const objectEl = document.getElementById("object");
  const gameArea = document.getElementById("gameArea");

  const finalScore = document.getElementById("finalScore");
  const leaderboardEl = document.getElementById("leaderboard");

  /* Avatar selection */
  document.querySelectorAll(".avatar").forEach(avatar => {
    avatar.onclick = () => {
      document.querySelectorAll(".avatar").forEach(a => a.classList.remove("selected"));
      avatar.classList.add("selected");
      selectedAvatar = avatar.textContent;
    };
  });

  /* Dark / Light Mode */
  document.getElementById("modeToggle").onchange = e => {
    body.className = e.target.checked ? "dark" : "light";
  };

  /* Start Game */
  document.getElementById("startBtn").onclick = () => {
    playerName = document.getElementById("nickname").value || "Player";
    document.getElementById("playerInfo").textContent =
      `${selectedAvatar} ${playerName}`;

    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    startGame();
  };

  function startGame() {
    gameOver = false;
    time = 10;
    score = 0;

    updateUI();
    spawn();

    clearInterval(timerInterval);
    clearInterval(gameInterval);

    timerInterval = setInterval(() => {
      time--;
      updateUI();
      if (time <= 0 && !gameOver) {
        endGame();
      }
    }, 1000);

    gameInterval = setInterval(spawn, 900);
  }

  function spawn() {
    const obj = objects[Math.floor(Math.random() * objects.length)];
    objectEl.textContent = obj.emoji;
    objectEl.dataset.time = obj.time;
    objectEl.dataset.score = obj.score;

    objectEl.style.left =
      Math.random() * (gameArea.clientWidth - 55) + "px";
    objectEl.style.top =
      Math.random() * (gameArea.clientHeight - 55) + "px";
  }

  objectEl.onclick = e => {
    if (gameOver) return;
    time += Number(e.target.dataset.time);
    score += Number(e.target.dataset.score);
    updateUI();
    spawn();
    e.stopPropagation();
  };

  gameArea.onclick = () => {
    if (gameOver) return;
    time--;
    updateUI();
  };

  function updateUI() {
    timeEl.textContent = time;
    scoreEl.textContent = score;
  }

  function endGame() {
    if (gameOver) return;
    gameOver = true;

    clearInterval(timerInterval);
    clearInterval(gameInterval);

    saveScore();
    showLeaderboard();

    finalScore.textContent = `⭐ Score: ${score}`;
    popup.classList.remove("hidden");
  }

  function saveScore() {
    let data = JSON.parse(localStorage.getItem("timeThiefScores")) || [];
    data.push({ name: playerName, score: score });
    data.sort((a, b) => b.score - a.score);
    data = data.slice(0, 5);
    localStorage.setItem("timeThiefScores", JSON.stringify(data));
  }

  function showLeaderboard() {
    leaderboardEl.innerHTML = "";
    const data = JSON.parse(localStorage.getItem("timeThiefScores")) || [];

    data.forEach((d, i) => {
      const li = document.createElement("li");
      li.textContent = `#${i + 1} ${d.name} – ${d.score}`;
      leaderboardEl.appendChild(li);
    });
  }

  /* 🔁 PLAY AGAIN */
  window.closePopup = function () {
    popup.classList.add("hidden");
    gameScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
  };

  /* 🧹 RESET LEADERBOARD */
  window.resetLeaderboard = function () {
    localStorage.removeItem("timeThiefScores");
    leaderboardEl.innerHTML = "";
    alert("Leaderboard reset successfully!");
  };

});
/* Instruction Continue */
const instructionOverlay = document.getElementById("instructionOverlay");
const continueBtn = document.getElementById("continueBtn");

continueBtn.onclick = () => {
  instructionOverlay.style.display = "none";
};

