let playerSymbols = [
	"🙂",
	"👷",
]

function toolsDisplay() {
	var display = ""
	let tools = []
	tools.push(["Pick",pickaxeNames[player.inv.pickLevel],player.inv.pickHandle])
	tools.push(["Axe",axeNames[player.inv.axeLevel],player.inv.axeHandle])
	for (const index in tools) {
		let tool = tools[index]
		display += `${tool[0]}: <h3><span style="color: ${itemColor(tool[1])}">${tool[1]}</span></h3>, <h3><span style="color: ${itemColor(woods[tool[2]].name)}">${woods[tool[2]].name}</span></h3> handle<br>`
	}
	//tools.push(["Headlamp",headlampName(player.inv.pickLevel)])
	if (player.inv.checkpoint) display += `Checkpoint: <h3><span style="color: ${itemColor(woods[player.inv.checkpoint].name)}">${woods[player.inv.checkpoint].name}</span></h3> frame${checkpointInInventory() ? "" : " (placed in mine)"}<br>`
	return display
}

pickaxeParams = [
	// [dig power, double drop chance]
	[4/4.0, 0/80], // Stone
	[4/3.4, 1/80], // Copper
	[4/3.0, 2/80], // Iron
	[4/2.0, 3/80], // Silver
	[4/1.7, 4/80], // Emerald
	[4/1.5, 6/100], // Ruby
	[4/1.2, 7/100], // Sapphire
	[4/0.9, 8/100], // Gold
	[4/0.7, 9/100], // Diamond
	[4/0.5, 10/100], // Obsidian
	[4/0.3, 10/80], // Mithril
]
axeParams = [
	// [cut power, sell multiplier]
	[4/4, 100/100], // Stone
	[4/3.5, 125/100], // Copper
	[4/3.2, 150/100], // Iron
	[4/2.0, 175/100], // Silver
	[4/1.7, 200/100], // Emerald
	[4/1.5, 225/100], // Ruby
	[4/1.2, 250/100], // Sapphire
	[4/0.9, 275/100], // Gold
	[4/0.7, 300/100], // Diamond
	[4/0.5, 325/100], // Obsidian
	[4/0.3, 350/100], // Mithril
]


function playerInvFilled() {
	sum = 0
	for (const item in player.inv.inventory) {
		sum += player.inv.inventory[item]
	}
	return sum
}

function addMoney(price) {
	if (price < 1) return
	player.inv.money += price
	player.stats.totalMoney += price
}
function takeMoney(price) {
	if (price < 1) return
	player.inv.money -= price
}

function inventoryDisplay() {
	var display = ""
	let keys = Object.keys(player.inv.inventory)
	keys.sort((a, b) => getItemInvSortIndex(a) > getItemInvSortIndex(b))
    for (let i=0;i<keys.length;i++) {
		let item = keys[i]
		display += `<span style="color: ${itemColor(item)}">${player.inv.inventory[item]} ${item}</span><br>`
	}
	return display
}
function playerHas(item) {
	if(!(item in player.inv.inventory)) {
		return 0
	}
	return player.inv.inventory[item]
}
function addToInventory(item,amt=1) {
	if (amt < 1) return
	amt = Math.min(amt,tmp.mod.playerInvLeft)
	if(amt <= 0) return
	if(!(item in player.inv.inventory)) {
		player.inv.inventory[item] = 0
	}
	player.inv.inventory[item] += amt
	updateTempInventory()
}
function takeFromInventory(item,amt=1) {
	if (amt < 1) return true
	if(playerHas(item) < amt) {
		console.error("couldn't take item "+item)
		return false
	}
	player.inv.inventory[item] -= amt
	if (player.inv.inventory[item] == 0) delete player.inv.inventory[item]
	updateTempInventory()
	return true
}
// function itemColor was here but had to be moved earlier
addLayer("inv", {
    name: "inventory",
    symbol: "🎒",
    position: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
		money: 0,
		limit: 25,
		inventory: {},
		pickLevel: 0,
		pickHandle: 'oak',
		axeLevel: 0,
		axeHandle: 'oak',
		headlampLevel: 0,
		headlamps: [0], // all headlamps that are unlocked and equippable
		headlamp: 0, // can equip older headlamps
		pump: null,
		checkpoint: null, // null if nonexistent otherwise a wood type string
		drillsawLevel: 0,
		talismanLevel: 0,
    }},
    color: "#DDDDDD",
    type: "none",
    row: "side",
    layerShown(){return true},
	tooltip() {return "Inventory"},
	tabFormat: {
		"Inventory": {
			content: [
				["display-text", function() {return `Money: $${player.inv.money}`},{"min-width":"300px","display":"inline-block"}],
				"blank",
				"h-line",
				"blank",
				["display-text",
					function() { return toolsDisplay() },
					{ "font-size": "16px", "line-height":"1.3"}
				],
				"blank",
				"h-line",
				"blank",
				["display-text",
					function() { return `${tmp.mod.playerInvFilled} / ${tmp.mod.playerInvLimit} space filled` },
				],
				"blank",
				"h-line",
				"blank",
				["display-text",
					function() { return inventoryDisplay() },
					{ "font-size": "20px", "line-height":"1.3"}
				],
			],
		},
	},
})

let sortId = 0
invSortIds = {
	"Empty Barrel": sortId++,
	"Oil Barrel": sortId++,
	"Lava Barrel": sortId++,
	"Dirt": sortId++,
	"Clay": sortId++,
	"Clay Brick": sortId++,
	"Coal": sortId++,
	"Copper Ore": sortId++,
	"Copper Bar": sortId++,
	"Stone": sortId++,
	"Sulfur": sortId++,
	"Iron Ore": sortId++,
	"Iron Bar": sortId++,
	"Silver Ore": sortId++,
	"Silver Bar": sortId++,
	"Emerald": sortId++,
	"Ruby": sortId++,
	"Sapphire": sortId++,
	"Gold Ore": sortId++,
	"Gold Bar": sortId++,
	"Quartz": sortId++,
	"Amethyst": sortId++,
	"Diamond": sortId++,
	"Obsidian": sortId++,
	"Hellstone": sortId++,
	"Ignis": sortId++,
	"Promethium Ore": sortId++,
	"Promethium Bar": sortId++,
	"Mithril Ore": sortId++,
	"Mithril Bar": sortId++,
	"Oak Log": sortId++,
	"Oak Plank": sortId++,
	"Oak Stick": sortId++,
	"Ash Log": sortId++,
	"Ash Plank": sortId++,
	"Ash Stick": sortId++,
	"Pine Log": sortId++,
	"Pine Plank": sortId++,
	"Pine Stick": sortId++,
	"Birch Log": sortId++,
	"Birch Plank": sortId++,
	"Birch Stick": sortId++,
	"Cinderbark Log": sortId++,
	"Cinderbark Plank": sortId++,
	"Cinderbark Stick": sortId++,
	"Silverwood Log": sortId++,
	"Silverwood Plank": sortId++,
	"Silverwood Stick": sortId++,
	"Goldbranch Log": sortId++,
	"Goldbranch Plank": sortId++,
	"Goldbranch Stick": sortId++,
	"Witchwood Log": sortId++,
	"Witchwood Plank": sortId++,
	"Witchwood Stick": sortId++,
	"Dynamite": sortId++,
	"Detonation Charge": sortId++,
}
function getItemInvSortIndex(itemname) {
	if (itemname in invSortIds) return invSortIds[itemname]
	return Infinity // should always be at the bottom
}

function getDisplayMoney() {
	return `<span style="color: #D8BD36"><h3>$${player.inv.money}</h3></span>`
}
function getDisplayInv() {
	let inv = `<h3>Inventory</h3><br>${tmp.mod.playerInvFilled} / ${tmp.mod.playerInvLimit}`
	if (options.showInv && tmp.mod.playerInvFilled > 0) inv = inventoryDisplay()+"<br>"+inv
	return inv
}

function getPlayerBlockDamage() {
	var damage = 1
	
	damage *= pickaxeParams[player.inv.pickLevel][0]

	if (player.inv.pickHandle == "goldbranch") damage *= 1.20
	if (player.inv.pickHandle == "witchwood") damage *= 1.12
	
	//if (hasAchievement("badges",33)) damage *= 1.1
	
	return damage
}
function getPlayerBlockDoubleChance() {
	var chance = pickaxeParams[player.inv.pickLevel][1]

	if (player.inv.pickHandle == "silverwood") chance += 0.15 // might nerf this

	chance *= 1+tmp.mod.playerLuck
	
	return chance
}
function getPlayerTreeDamage() {
	var damage = 1
	
	damage *= axeParams[player.inv.axeLevel][0]

	if (player.inv.axeHandle == "goldbranch") damage *= 1.20
	if (player.inv.axeHandle == "witchwood") damage *= 1.12

	//if (hasAchievement("badges",33)) damage *= 1.1
	
	return damage
}
function getPlayerTreeDoubleChance() {
	var chance = 0
	
	if (player.inv.axeHandle == "silverwood") chance += 0.15
	
	chance *= 1+tmp.mod.playerLuck

	return chance
}
function getPlayerTreeSellMult() {
	var mult = axeParams[player.inv.axeLevel][1]
	
	if (player.inv.axeHandle == "witchwood") mult += 0.5
	
	return mult
}
function getPlayerSpeed() {
	var speed = 2

	// Move speed buff from pine tool handles
	if (player.inv.pickHandle == "pine") speed += 1
	if (player.inv.axeHandle == "pine") speed += 1
	
	return speed
}
function getPlayerPumpSpeed() {
	var speed = 1
	
	if (hasAchievement("badges",21)) speed *= 1.25
	if (player.inv.pickHandle == "witchwood") speed *= 1.20
	
	return speed
}
function getPlayerLuck() {
	var luck = 0
	
	// Luck buff from birch tool handles
	if (player.inv.pickHandle == "birch") luck += 0.1
	if (player.inv.axeHandle == "birch") luck += 0.1
	
	return luck
}
function getPlayerAutosmeltChance() {
	var chance = 0
	
	if (player.inv.pickHandle == "cinderbark") chance += 0.2
	
	return chance
}
function getPlayerAutosawChance() {
	var chance = 0
	
	if (player.inv.axeHandle == "cinderbark") chance += 0.2
	
	return chance	
}
/*function getBonusJumps() {
	// NOTE: This is currently useless due to "jumping" not being a mechanic in this game like in Epic Mining 2. For this reason, these tool handles also buff forge and sawmill efficiency.
	var bonusJumps = 0
	
	// Extra jumps from ash tool handles
	if (player.inv.pickHandle == "ash") bonusJumps += 1
	if (player.inv.axeHandle == "ash") bonusJumps += 1
	
	return bonusJumps
}*/
function getForgeSpeedBonus() {
	speed = 1
	
	if (hasAchievement("badges",13)) speed *= 1.25

	// Due to lack of jumping in this game, ash pickaxe handle boosts forge speed
	if (player.inv.pickHandle == "ash") speed *= 1.20
	
	return speed	
}
function getSawmillSpeedBonus() {
	speed = 1

	// Due to lack of jumping in this game, ash axe handle boosts sawmill speed
	if (player.inv.axeHandle == "ash") speed *= 1.20
	
	return speed
}
function statsDisplay() {
	let display = ""
	
	display += `Your mining power is <h3>${format(tmp.mod.minePower)}</h3>.`
	display += `<br>Your double drop chance is <h3>${Math.floor(tmp.mod.doubleDrop*1000)/10}%</h3>.`
	display += `<br>Your cutting power is <h3>${format(tmp.mod.cutPower)}</h3>.`
	display += `<br>Your wood sell value multiplier is <h3>${format(tmp.mod.woodSellValue)}x</h3>.`
	display += `<br>Your movement speed is <h3>${format(tmp.mod.playerSpeed)}</h3> blocks per second.`
	display += `<br>You have mined <h3>${format(player.stats.totalBlocksMined,0)}</h3> total blocks.`
	display += `<br>You have cut down <h3>${format(player.stats.totalTreesCut,0)}</h3> total trees.`
	display += `<br>You have made a total of <h3>$${format(player.stats.totalMoney,0)}</h3>.`
	display += `<br><br>Your luck is <h3>${format(tmp.mod.playerLuck)}</h3>. (This number improves most mechanics based on randomness to be more in your favor.)`
	
	return display
}

function addLiquidPumped(liquid,amt=1) {
	player.stats.totalBarrelsPumped += amt
	if (!(liquid in player.stats.indivBarrelsPumped)) player.stats.indivBarrelsPumped[liquid] = 0
	player.stats.indivBarrelsPumped[liquid] += amt
}

addLayer("stats", {
    name: "stats",
    symbol: "📊",
    position: 1,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
		totalBlocksMined: 0,
		totalTreesCut: 0,
		totalForgeSmelts: 0,
		totalSawmillCuts: 0,
		totalDirtSifted: 0,
		totalBarrelsPumped: 0,
		totalMoney: 0,
		unlockedWoods: ["oak","ash","pine","birch"],
		unlockedOres: [],
		indivBlocksHarvested: {},
		indivBarrelsPumped: {},
    }},
    color: "#DDDDDD",
    type: "none",
    row: "side",
    layerShown(){return true},
	tooltip() {return "Player Stats"},
	tabFormat: {
		"Player Stats": {
			content: [
				["display-text",
					function() { return statsDisplay() },
					{"font-size": "20px", "line-height":"2.0"}
				],
			],
		},
	},
})

badgeStyle = {
	"width":"120px","height":"120px",
}
addLayer("badges", {
    name: "badges",
    symbol: "🏅",
    position: 2,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#DDDDDD",
    type: "none",
    row: "side",
    layerShown(){return true},
	tooltip() {return "Badges"},
	tabFormat: {
		"Badges": {
			content: [
				["blank","20px"],
				"achievements"
			],
		},
	},
	achievements: {
		11: {
			name: "From Humble Beginnings",
			done() {return player.stats.totalBlocksMined >= 1000},
			tooltip: "Mine 1000 blocks in the mine.<br>Reward: 75 inventory space plus $2000",
			onComplete() {
				player.inv.limit += 75
				if (player.inv.limit >= 10000) {
					player.inv.limit = 10000
				}
				updateTempInventory()
				addMoney(2000)
			},
			style: badgeStyle,
		},
		12: {
			name: "Deforestation",
			done() {return player.stats.totalTreesCut >= 200},
			tooltip: "Cut down 200 trees in the forest.<br>Reward: 10 Silverwood Logs and $2000",
			onComplete() {
				addToInventory("Silverwood Log",10)
				addMoney(2000)
			},
			style: badgeStyle,
		},
		13: {
			name: "Blacksmith",
			done() {return player.stats.totalForgeSmelts >= 100},
			tooltip: "Smelt 100 items in the Forge.<br>Reward: +25% Forge speed",
			style: badgeStyle,
		},
		14: {
			name: "Forever Hopeful",
			done() {return player.stats.totalDirtSifted >= 200},
			tooltip: "Sift 200 dirt at the Dirt Sifter.<br>Reward: $3000 and +25% Dirt Sifter speed",
			onComplete() {
				addMoney(3000)
			},
			style: badgeStyle,
		},
		15: {
			name: "Dedication",
			done() {return player.timePlayed >= 60*60*8},
			tooltip: "Play this game for 8 hours!<br>Reward: $3000 and 3 Gold Bars",
			onComplete() {
				addMoney(3000)
				addToInventory("Gold Bar",3)
			},
			style: badgeStyle,
		},
		21: {
			name: "Black Gold",
			done() {return player.stats.indivBarrelsPumped["oil"] >= 50},
			tooltip: "Pump 50 barrels of oil.<br>Reward: +25% Pump speed",
			onComplete() {},
			style: badgeStyle,
		},
		22: {
			name: "Magma Mastery",
			done() {return player.stats.indivBarrelsPumped["lava"] >= 100},
			tooltip: "Pump 100 barrels of lava.<br>Reward: 10 Empty Barrels", // original game Reward: 5 Speed Potions, potions are not in game as of writing this and will not be obtainable until later once added
			onComplete() {
				addToInventory("Empty Barrel",10)
				
			},
			style: badgeStyle,
		},
		23: {
			name: "Diamond Miner",
			done() {return player.stats.indivBlocksHarvested["Diamond"] >= 10 },
			tooltip: "Mine 10 Diamonds to get this achievement!<br>Reward: 3 bonus Diamonds!",
			onComplete() {
				addToInventory("Diamond",3)
			},
			style: badgeStyle,
		},
		24: {
			name: "Brave Explorer",
			done() {return false}, // given manually in explode function
			tooltip: "Be careful when mining too deep...<br>Reward: 10 Dynamite",
			onComplete() {
				addToInventory("Dynamite",10)
			},
			style: badgeStyle,
		},
		25: {
			name: "Queen Bumps Back",
			done() {return allTreesPine()},
			tooltip: "Have a pine tree in every space of the forest.<br>Reward: +25% tree growth speed",
			onComplete() {},
			style: badgeStyle,
		},
		/*31: {
			name: "Mythic",
			done() {return player.inv.pickLevel >= 10 && player.inv.axeLevel >= 10},
			tooltip: "Obtain a Mithril Pickaxe and a Mithril Axe.<br>Reward: 5 Mithril Bars and $10000",
			onComplete() {
				addToInventory("Mithril Bar",5)
				addMoney(10000)
			},
			style: badgeStyle,
		},
		32: {
			name: "The End?",
			done() {return (player.mine.inMine == 1 && player.mine.depth == 70)},
			tooltip: "Reach the bottom of the Old Mine.<br>Reward: Unlock the Mining Association",
			onComplete() {},
			style: badgeStyle,
		},
		33: {
			name: "Serious Power",
			done() {return (tmp.mod.minePower + tmp.mod.cutPower) > 30},
			tooltip: "Have your combined mining and cutting power exceed 30.<br>Reward: +10% mining and cutting power",
			onComplete() {},
			style: badgeStyle,
		},
		35: {
			name: "Deepest Pockets",
			done() {return tmp.mod.playerInvLimit >= 10000},
			tooltip: "Max out your inventory limit.<br>Reward: TBA",
			onComplete() {
				
			},
			style: badgeStyle,
		},*/
	},
})