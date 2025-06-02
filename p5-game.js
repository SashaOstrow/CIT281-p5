// Import game classes
const {
  Monster,
  GameManager,
  MonsterFactory,
  Weapon,
  Player,
} = require("./p5-class");

// Create the player
const player = new Player("Sasha");

// Define available weapons
const weapons = {
  Sword: new Weapon("The Blade of Bloodlust", 20, 25),
  Bow: new Weapon("The Heartstriker Bow & Arrow", 25, 25),
  Axe: new Weapon("The Warrior's Unholy Battle Axe", 10, 30),
};

// Equip a specific weapon
player.equipWeapon(weapons.Sword);

// Convert weapons object to an array for client use
const weaponsArray = Object.entries(weapons).map(([key, weapon]) => ({
  id: key,
  name: weapon.name,
  minDamage: weapon.minDamage,
  maxDamage: weapon.maxDamage,
}));

// Create game manager and monster factory
const game = new GameManager();
const factory = new MonsterFactory();

// Optional test logic for manual game round (only runs when file is executed directly)
if (require.main === module) {
  const monster = factory.createMonster();
  game.setMonster(monster.name, monster.life, monster.minLife);

  console.log(`A wild ${monster.name} appears with ${monster.life} HP.`);
  console.log(`You are armed with: ${player.weapon.name}`);

  game.round++;

  const playerDamage = player.attack(game.currentMonster);
  console.log(
    `You strike the ${monster.name} and deal ${playerDamage} damage.`
  );

  if (game.currentMonster.isAlive()) {
    const monsterDamage = Math.floor(Math.random() * 30) + 10;
    player.takeDamage(monsterDamage);
    console.log(
      `The ${monster.name} attacks back! You take ${monsterDamage} damage.`
    );
  } else {
    console.log(`You defeated the ${monster.name}.`);
  }

  console.log("Player status:", player.toJSON());
  console.log("Monster status:", game.getStatus());

  if (!player.isAlive()) {
    console.log("You have been defeated.");
  } else if (game.isGameOver()) {
    console.log("You killed the monster.");
  }
}

// Export for use by the server
module.exports = {
  weapons,
  weaponsArray,
  player,
  game,
  factory,
  Player,
  GameManager,
  MonsterFactory,
};
