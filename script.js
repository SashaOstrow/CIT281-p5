//const weaponSelect = document.getElementById("weaponSelect");
const startGameBtn = document.getElementById("startGameBtn");
const playRoundBtn = document.getElementById("playRoundBtn");
const restartBtn = document.getElementById("restartBtn");
const playerNameInput = document.getElementById("playerName");
const gameLog = document.getElementById("gameLog");
const gameArea = document.getElementById("gameArea");

const weaponSelect = document.getElementById("weaponSelect");
//displays the weapons with the drop down
fetch("/weapons")
  .then((res) => res.json())
  .then((data) => {
    console.log("Weapons loaded:", data);
    data.weapons.forEach((weapon) => {
      const option = document.createElement("option");
      option.value = weapon.id;
      option.textContent = `${weapon.name} (${weapon.minDamage}-${weapon.maxDamage} dmg)`;
      weaponSelect.appendChild(option);
    });
  })
  //error
  .catch((err) => {
    console.error("Error loading weapons:", err);
  });
//listens for click event on the start game button
startGameBtn.addEventListener("click", async () => {
  //grabs the value the user typed into the input box for their name
  const playerName = playerNameInput.value;
  //this gets the selected weapon option from the dropdown menu
  const weaponName = weaponSelect.value;
  //sneds POST reuest to the /start-game API route on server
  const response = await fetch("/start-game", {
    method: "POST",
    //tells the server that your sending JSON in the request body
    headers: {
      "Content-Type": "application/json",
    },
    //coverts the JS object into a JSON string
    body: JSON.stringify({ playerName, weaponName }),
  });
  //waits for the server to respond with JSON
  const data = await response.json();
  //displays the message from the server in the browser by putting it into the gameLgo element
  gameLog.innerHTML = `<p>${data.message}</p>`;
  //makes the main game area visible
  gameArea.classList.remove("hidden");
  //re-enables the play round buttom
  playRoundBtn.disabled = false;
});
//adds click listenr to Play Round buttom
playRoundBtn.addEventListener("click", async () => {
  const response = await fetch("/play-round", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  //waits for the server to respond with JSON
  const data = await response.json();
  //loops through each log entry in the returned log array
  data.log.forEach((line) => {
    //<p> element, fills with message and appends it to the gameLog
    const p = document.createElement("p");
    p.textContent = line;
    gameLog.appendChild(p);
  });
  //after the round, check if either the player or the monster is dead
  //if yes, disable the button
  if (data.player.status === "Dead" || data.monster.status === "Dead") {
    playRoundBtn.disabled = true;
  }
});

restartBtn.addEventListener("click", async () => {
  await fetch("/restart", { method: "POST" });
  gameLog.innerHTML = "<p>Game reset. Start a new battle!</p>";
  gameArea.classList.add("hidden");
});
