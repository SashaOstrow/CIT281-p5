const express = require("express");
const app = express();

const {
  weapons,
  weaponsArray,
  Player,
  GameManager,
  MonsterFactory,
} = require("./p5-game");

const game = new GameManager();
const factory = new MonsterFactory();

app.use(express.json());
app.use(express.static("public"));

let currentPlayer = null;

// GET route to return available weapons
app.get("/weapons", (req, res) => {
  res.json({ weapons: weaponsArray });
});

// POST route to start a new game
app.post("/start-game", (req, res) => {
  const { playerName, weaponName } = req.body;

  const weapon = weapons[weaponName];
  if (!weapon) {
    return res.status(400).json({ error: "Invalid weapon selected." });
  }

  currentPlayer = new Player(playerName || "You");
  currentPlayer.equipWeapon(weapon);

  const monster = factory.createMonster();
  game.setMonster(monster.name, monster.life, monster.minLife);

  res.json({
    message: `With ${weapon.name}. Get ready to fight a ${monster.name}, good luck! You might need it...`,
    player: currentPlayer.toJSON(),
    monster: game.getStatus(),
  });
});

// POST route to simulate one round of combat
app.post("/play-round", (req, res) => {
  if (!currentPlayer || !game.currentMonster) {
    return res.status(400).json({ error: "Game has not started." });
  }

  const result = {
    log: [],
  };

  const playerDamage = currentPlayer.attack(game.currentMonster);
  result.log.push(
    `You strike the ${game.currentMonster.name}. ${playerDamage} damage was dealt.`
  );

  if (!game.currentMonster.isAlive()) {
    result.log.push(`You killed the ${game.currentMonster.name}.`);
  } else {
    const monsterDamage = Math.floor(Math.random() * 30) + 10;
    currentPlayer.takeDamage(monsterDamage);
    result.log.push(
      `The ${game.currentMonster.name} attacks back! You take ${monsterDamage} damage.`
    );
  }

  if (!currentPlayer.isAlive()) {
    result.log.push("You have been defeated.");
  }

  result.log.push(`Your health: ${currentPlayer.health}`);
  result.log.push(`Monster life: ${game.currentMonster.life}`);

  res.json({
    player: currentPlayer.toJSON(),
    monster: game.getStatus(),
    log: result.log,
  });
});

// POST route to restart the game
app.post("/restart", (req, res) => {
  currentPlayer = null;
  game.resetGame();
  res.json({ message: "Game has been reset." });
});

// Start server on port 4000
app.listen(4000, () => {
  console.log("Server running at http://localhost:4000");
});
