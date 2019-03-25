

// ------------ MECHANICS SECTION ----------///
function diceRoll() {
    return (Math.floor(Math.random() * Math.floor(6)) + 1);
    //D6 Roll essentially. it rolls between 0 to 5, therefore you add a +1 to result;
}

function scoreCount() {
    var score = player.stamina + player.health + (player.defeated * 3);
    battleResult.innerHTML = `Your total score is ${score}!`
    attackButton.removeEventListener('click', attack);
    speedAttackButton.removeEventListener('click', speedAttack);
    potionButton.removeEventListener('click', potionUse);
    staminaButton.removeEventListener('click', staminaUse);
    return score;
} // this is called at the end of the game or when player.health === 0, buttons cannot be clicked after game ends.


function checkEnemies() {
    remainingEnemies = enemyArray.filter(function (arr) {
        if (arr.status === 'alive') {
            return arr
        } ;
    }); // this filters out enemies that are dead.
}
// -------- END OF MECHANICS SECTION ---------- //


//--------------- PLAYER CHARACTER SECTION ------------- //
var player = {
    name: "player",
    health: 5,
    stamina: 7,
    potions: 2,
    defeated: 0,
    score: 0,
    roll: 0,

    attack: function() {
        if (player.stamina > 0){
            player.roll = diceRoll();
            this.stamina--;
            return player.roll;
        } else {
            player.roll = diceRoll();
            this.health--;
            return player.roll;
            player.checkDead();
        } // if there's not enough stam, player uses health as resource
    },

    speedAttack: function() {
        if (player.stamina > 1 ) {
            player.roll = (2 * diceRoll());
            this.stamina-=2;
            return player.roll;
        } else {
            player.roll = (2 * diceRoll());
            this.health-=2;
            return player.rolll;
            player.checkDead();
        } // if there's not enough stam, player uses health as resource

    }, //uses 2 stamina to roll 2D6

    restoreHealth: function() {
        if (player.potions === 0) {
           battleResult.innerHTML = `You don't have any potions left!`;
           return;
        } else {
            this.potions --;
            battleResult.innerHTML = `You restored 1 health!`;
            this.health++;
        }

        if (this.health > 3) {
            this.health = 3;
        } //this sets a max cap on health
    },

    restoreStamina: function() {
        if (player.potions === 0) {
           battleResult.innerHTML = `You don't have any potions left!`;
           return;
        } else {
            this.potions --;
            var potBoost = (Math.floor(Math.random() * Math.floor(3)) + 2) //ensures minimum stam is 2, max stam is 5.
            battleResult.innerHTML = `You restored ${potBoost} stamina!`;
            this.stamina+=potBoost;
        }

        if (this.stamina > 7) {
            this.stamina = 7;
        } //this sets a max cap on stamina
    },

    checkDead: function() {
        if (this.health <= 0) {
            var youDied = document.getElementById('title');
            youDied.innerHTML = "YOU DIED";
            youDied.style.fontSize = "100px";
            youDied.style.position = "relative";
            youDied.style.top = "300px";
            youDied.style.zIndex = "5";
            scoreCount();
        } // this is called after every event where health is deducted, it stops the game.
    },

};
// -------------- END OF PLAYER CHARACTER SECTION --------------//


// ---------------MONSTER SECTIION------------- //

var monsterDescription = document.getElementById('monster-ability');
var battleResult = document.getElementById('battle-result');

// this is the blue print for the monsters in the dungeon
class Monster {
    constructor(name,difficulty, image) {
        this.name = name;
        this.difficulty = difficulty;
        this.image = image;
        this.status = 'alive';
    }

    attack() {
        if (player.attack() >= this.difficulty) {
            battleResult.innerHTML = `You rolled a ${player.roll}! ${this.name} defeated! A new monster blocks your path!`;
            this.status = 'dead';
            enemyCount--;
            player.defeated++;
            spawnMonster();
        } else {
            battleResult.innerHTML = `You rolled a ${player.roll} but failed to defeat it! You took 1 damage!`;
            player.health--;
            player.checkDead();
        }
    }

    speedAttack() {
         if (player.speedAttack() >= this.difficulty) {
            battleResult.innerHTML = `You rolled a ${player.roll}! ${this.name} defeated! A new monster blocks your path!`;
            this.status = 'dead';
            enemyCount--;
            player.defeated++;
            spawnMonster();
        } else {
            battleResult.innerHTML = `You rolled a ${player.roll} but failed to defeat it! You took 1 damage!`;
            player.health--;
            player.checkDead();
        }
    }
}

// generates monsters from classes by giving them names and difficulty
const goblin = new Monster('Goblin', 1, "images/goblin.png");
const goblin2 = new Monster('Goblin2', 1, "images/goblin.png");
const orc = new Monster('Orc', 3, "images/orc.png");
const orc2 = new Monster('Orc2', 3, "images/orc.png");
const minotaur = new Monster('Minotaur', 4, "images/minotaur.png");
const minotaur2 = new Monster('Minotaur2', 4, "images/minotaur.png");
const mimic = new Monster('Mimic', 2, "images/mimic.png");
const mimic2 = new Monster('Mimic2', 2, "images/mimic.png");
const slime = new Monster('Slime', 6, "images/slime.png");
const slime2 = new Monster('Slime2', 6, "images/slime.png");
const tortoise = new Monster('Tortoise', 5, "images/tortoise.png");
const tortoise2 = new Monster('Tortoise2', 5, "images/tortoise.png");


var enemyArray = [goblin, goblin2, orc, orc2, minotaur, minotaur2, mimic, mimic2, slime, slime2, tortoise, tortoise2];
var enemyCount = enemyArray.length;

let remainingEnemies = enemyArray.filter(function (arr) {
    if (arr.status === 'alive') {
        return arr
    } ;
}); // this filters out enemies that are dead.

var currentEnemy = remainingEnemies[Math.floor(Math.random() * remainingEnemies.length)];
// chooses from monsters that are still alive.

//---------------END OF MONSTER SECTION------------------//


// --------------THIS IS BUTTON SECTIONS------------------ //
function playerStatsWeb() {
  var playerHealth = document.getElementById('player-health');
  playerHealth.innerHTML = "Health: " + player.health;

  var playerStamina = document.getElementById('player-stamina');
  playerStamina.innerHTML = "Stamina: " + player.stamina;

  var playerPots = document.getElementById('player-potion');
  playerPots.innerHTML = "Potions: " + player.potions;

  var playerMonsters = document.getElementById('remaining-monsters');
  playerMonsters.innerHTML = "Remaining: " + (remainingEnemies.length - 1); // game ends when there's only 1 monster left.
} //this is run after every scene to update the screen.
playerStatsWeb();

// this section buttons have a removeEventListener that's tagged to scoreCount()

var attack = function() {
    currentEnemy.attack();
    playerStatsWeb();
}
var attackButton = document.getElementById('atk-btn');
attackButton.addEventListener('click', attack);

var speedAttack = function() {
    currentEnemy.speedAttack();
    playerStatsWeb();
};
var speedAttackButton = document.getElementById('spd-atk-btn')
speedAttackButton.addEventListener('click', speedAttack);

var potionUse = function() {
    player.restoreHealth();
    playerStatsWeb();
}
var potionButton = document.getElementById('pot-btn');
potionButton.addEventListener('click', potionUse);

var staminaUse = function() {
    player.restoreStamina();
    playerStatsWeb();
}
var staminaButton = document.getElementById('stam-btn');
staminaButton.addEventListener('click', staminaUse);

var fleeButton = document.getElementById('flee-btn');
fleeButton.addEventListener('click', function() {
    playerStatsWeb();
});
//------------END OF BUTTONS SECTION------------------- //


//------------GAME STARTING ------------//

function spawnMonster() {
    var monsterName = document.getElementById('monster-name');
    var monsterImage = document.getElementById('monster-image');
    checkEnemies();
    currentEnemy = remainingEnemies[Math.floor(Math.random() * remainingEnemies.length)]; // this refactors the variable so that it only chooses from the new filtered array.
    console.log(remainingEnemies);
    monsterName.innerHTML = currentEnemy.name;
    monsterImage.src = currentEnemy.image
    if (remainingEnemies.length === 1) {
    monsterDescription.innerHTML = "Dungeon Cleared!";
    scoreCount();
    } // spawn monster is called each time a monster is killed.
}

spawnMonster();