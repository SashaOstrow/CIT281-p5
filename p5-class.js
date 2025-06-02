//the blueprint
class Monster {
  //setting up the bio of the moster
  constructor(name, life = 100, minLife = 10) {
    this.name = name;
    this.life = life;
    this.minLife = minLife;
  }
  //checks monsters health and sees if its still alive
  isAlive() {
    return this.life > this.minLife;
  }

  toJSON() {
    return {
      name: this.name,
      life: this.life,
      minLife: this.minLife,
      //if else statemnt true: alive, false: dead
      status: this.isAlive() ? "Alive" : "Dead",
    };
  }
}

class GameManager {
  constructor() {
    this.currentMonster = null; //noting yet
    this.round = 0; //tracks number of rounds
  }
  // takes the name, life and minLife of the generated monster
  setMonster(name, life = 100, minLife = 10) {
    //creates new monster using monster class
    //curretn monster saves it as the active monster
    //makes a full object
    this.currentMonster = new Monster(name, life, minLife);
  }
  //returns clean summary of currt monsters stats or null if no monster
  getStatus() {
    //this.currentMonster ? = checks if monster exits
    //current monster.toJSON() converts it to a plain object using .toJSON
    return this.currentMonster ? this.currentMonster.toJSON() : null;
  }
  //checks if monster is dead
  isGameOver() {
    //!this.currentMonster means if theres no monster then game is over
    // || means or
    //the game is over if theres no monster OR the monster is not alive z
    return !this.currentMonster || !this.currentMonster.isAlive();
  }
  //resets game
  resetGame() {
    this.currentMonster = null;
    this.round = 0;
  }
}

class MonsterFactory {
  constructor() {
    //defines each monster and its stats
    this.types = {
      Goblin: { min: 30, max: 50, minLife: 25 },
      Centaur: { min: 60, max: 90, minLife: 15 },
      Dragon: { min: 90, max: 130, minLife: 10 },
    };
  }
  createMonster() {
    const typeNames = Object.keys(this.types); //stores the monster types which will be used to randomly pick one
    //randomly selects monster
    // Math.random gets number 0-1,
    // .length gives # in range of index and math.floor rounds to whole index
    const randomType = typeNames[Math.floor(Math.random() * typeNames.length)];
    const config = this.types[randomType]; //looks at the stats of each monster

    //picks random starting life between monsters min and max
    //config.max - config.min + 1 --> size of the range
    //math.random gernernates the random number 0-1
    //math.floor rounds to nearest whole number
    const life =
      Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;

    //puts everything together
    return new Monster(randomType, life, config.minLife);
  }
}

class Weapon {
  constructor(name, minDamage, maxDamage) {
    this.name = name;
    this.minDamage = minDamage;
    this.maxDamage = maxDamage;
  }
  //math.random generates random # 0-1
  //his.maxDamage - this.minDamage +1 calcualtes number of possible damage values by taking the min and max
  //math.floor rounds number
  getDamage() {
    return (
      Math.floor(Math.random() * (this.maxDamage - this.minDamage + 1)) +
      this.minDamage
    );
  }
  toJSON() {
    return {
      name: this.name,
      minDamage: this.minDamage,
      maxDamage: this.maxDamage,
    };
  }
}

class Player {
  constructor(name = "Sasha", health = 100) {
    this.name = name;
    this.health = health;
    this.weapon = null; //null means nothing is equipped yet
  }
  //assigns weopon object to player
  equipWeapon(weapon) {
    this.weapon = weapon;
  }

  attack(monster) {
    if (!this.weapon) return 0; //if player has no weapon, attack fail and turn 0 damage
    const damage = this.weapon.getDamage(); // calls weapon method to return random number within min-max dmange range
    monster.life -= damage; //subtracts damage from mosnter life
    if (monster.life < 0) monster.life = 0; //makes sure number doesnt go into the megatives
    return damage; //shows the damnage that is done
  }

  takeDamage(amount) {
    this.health -= amount; //subtracts current health
    if (this.health < 0) this.health = 0; // makes sure number doesnt go into the megatives
  }

  isAlive() {
    return this.health > 0; //checks if still alive. if health is greater than 0, returns true otherise, false
  }

  toJSON() {
    return {
      name: this.name,
      health: this.health,
      weapon: this.weapon ? this.weapon.toJSON() : null,
      status: this.isAlive() ? "Alive" : "Dead",
    };
  }
}

module.exports = {
  Monster,
  GameManager,
  MonsterFactory,
  Weapon,
  Player,
};
