let modInfo = {
	name: "The Mining Tree",
	author: "Steve (I am Steve)",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js", "mine.js", "town.js", "forest.js", "player.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 0,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0",
	name: "Diggy Diggy Hole",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Added the Mine.<br>
		- Added the Town.<br>
		- Added the Forest.<br>
		`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

function getTopDisplayText() {
	var m = ""
	if (!player.mine.inMine) m = "You are on the surface."	
	else m = `You are in the ${getMineName(player.mine.inMine)} at depth ${player.mine.depth}.`	
	return m//"<span style='line-height:1.5;'>"+`You have <h3>$${player.inv.money}.</h3><br>`+m+"</span>"
}
// Display extra things at the top of the page
var displayThings = [
	//function() {return "TPS: "+format(tmp.mod.tps)},
	function() {return mineResetString()},
	function() {return mineResetString() ? "<br>" : ""},
	function() {return getTopDisplayText()},
]
// Displays player money
var displayMoney = [
	function() {return getDisplayMoney()}
]
// Displays player inventory
var displayInv = [
	function() {return getDisplayInv()}
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}

// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}


// Custom calculations to the tmp object
function modUpdateTemp() {
	if (!tmp.mod) tmp.mod = {}
	
	tmp.mod.tps = getTps()
	
	updatePlayerBlock()
	tmp.mod.mineBlockTotal = allMinesBlockAmt()
	tmp.mod.mineBound = getMineBound()
	updateTempInventory()
	
	tmp.mod.playerLuck = getPlayerLuck()
	tmp.mod.minePower = getPlayerBlockDamage()
	tmp.mod.doubleDrop = getPlayerBlockDoubleChance()
	tmp.mod.cutPower = getPlayerTreeDamage()
	tmp.mod.doubleDropWood = getPlayerTreeDoubleChance()
	tmp.mod.woodSellValue = getPlayerTreeSellMult()
	tmp.mod.playerSpeed = getPlayerSpeed()
	tmp.mod.forgeSpeed = getForgeSpeedBonus()
	tmp.mod.sawmillSpeed = getSawmillSpeedBonus()
	tmp.mod.pumpSpeed = getPlayerPumpSpeed()
	tmp.mod.autosmelt = getPlayerAutosmeltChance()
	tmp.mod.autosaw = getPlayerAutosawChance()
	
}
function updatePlayerBlock() {
	tmp.mod.playerBlock = getPlayerBlock()
	tmp.mod.nearLava = getPlayerNearLava()
}
function updateTempInventory() {
	tmp.mod.playerInvLimit = player.inv.limit
	tmp.mod.playerInvFilled = playerInvFilled()
	tmp.mod.playerInvLeft = tmp.mod.playerInvLimit-tmp.mod.playerInvFilled
	tmp.mod.playerInvIsFull = (tmp.mod.playerInvLeft <= 0)
}






function itemColor(item) {
	
	if (item == "Miner's Headlamp") return "#E5C316"
	if (item == "Lava Barrel") return "#B20000"
	
	// ore
	if (item.includes("Dirt")) return "#966546"
	if (item.includes("Clay")) return "#B24A35"
	if (item.includes("Copper")) return "#A05F35"
	if (item.includes("Stone")) return "#A3A2A5"
	if (item.includes("Sulfur")) return "#FDEA8D"
	if (item.includes("Iron Ore")) return "#A54200"
	if (item.includes("Iron")) return "#A2A19E"
	if (item.includes("Silver")) return "#E5E4DF"
	if (item.includes("Emerald")) return "#4B974B"
	if (item.includes("Ruby")) return "#C4281C"
	if (item.includes("Sapphire")) return "#0D69AC"
	if (item.includes("Gold")) return "#F5CD30"
	if (item.includes("Amethyst")) return "#6B327C"
	if (item.includes("Quartz")) return "#E7E7EC"
	if (item.includes("Diamond")) return "#80BBDB"
	if (item.includes("Obsidian")) return "#4C2CB6"
	if (item.includes("Hellstone")) return "#A34B4B"
	if (item.includes("Stone")) return "#A3A2A5"
	if (item.includes("Ignis")) return "#C4281C"
	if (item.includes("Promethium")) return "#957977"
	if (item.includes("Mithril")) return "#6E99CA"
	
	// wood
	if (item.includes("Oak")) return "#956665"
	if (item.includes("Ash")) return "#957977"
	if (item.includes("Pine")) return "#7c5c46"
	if (item.includes("Birch")) return "#d7c59a"
	if (item.includes("Cinderbark")) return "#ff5959"
	if (item.includes("Silverwood")) return "#a3a2a5"
	if (item.includes("Goldbranch")) return "#f5cd30"
	if (item.includes("Witchwood")) return "#8c5b9f"
	
	return "#DDDDDD"
}