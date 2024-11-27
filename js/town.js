oreRefineryItems = {
	dirt: {
		item: "Dirt",
		value: [2,3,4],
		canBuy: true,
	},
	clay: {
		item: "Clay",
		value: [6,7,8,9,10],
		canBuy: false, // temp?
	},
	clayBrick: {
		item: "Clay Brick",
		value: [9,11,13,15],
		canBuy: false,
	},
	coal: {
		item: "Coal",
		value: [10,11,12,13,14,15,16],
		canBuy: true,
	},
	copperOre: {
		item: "Copper Ore",
		value: [17,18,19,20,21,22,23],
		canBuy: true,
	},
	copperBar: {
		item: "Copper Bar",
		value: [21,23,25,27,29,31],
		canBuy: false,
	},
	stone: {
		item: "Stone",
		value: [3,4,5,6],
		canBuy: true,
	},
	tinOre: {
		item: "Tin Ore",
		value: [17,18,19,20,21,22,23],
		canBuy: false, // temp?
	},
	tinBar: {
		item: "Tin Bar",
		value: [21,23,25,27,29,31],
		canBuy: false,
	},
	sulfur: {
		item: "Sulfur",
		value: [30,35,40,45,50,55,60,65,70],
		canBuy: true,
	},
	ironOre: {
		item: "Iron Ore",
		value: [27,29,31,33,35,37],
		canBuy: true,
	},
	ironBar: {
		item: "Iron Bar",
		value: [41,44,47,50,53,56],
		canBuy: false,
	},
	silverOre: {
		item: "Silver Ore",
		value: [34,37,40,43,46,49,52],
		canBuy: true,
	},
	silverBar: {
		item: "Silver Bar",
		value: [48,53,58,63,68,73],
		canBuy: false,
	},
	emerald: {
		item: "Emerald",
		value: [55,60,65,70,75],
		canBuy: true,
	},
	ruby: {
		item: "Ruby",
		value: [70,75,80,85,90,95,100],
		canBuy: true,
	},
	sapphire: {
		item: "Sapphire",
		value: [95,100,105,110,115,120,125,130],
		canBuy: true,
	},
	goldOre: {
		item: "Gold Ore",
		value: [130,140,150,160,170],
		canBuy: true,
	},
	goldBar: {
		item: "Gold Bar",
		value: [169,182,195,208,221],
		canBuy: false,
	},
	quartz: {
		item: "Quartz",
		value: [200,220,240,260,280,300],
		canBuy: false,
	},
	amethyst: {
		item: "Amethyst",
		value: [270,283,296,309,322],
		canBuy: false,
	},
	diamond: {
		item: "Diamond",
		value: [350,370,390,410,430,450],
		canBuy: false,
	},
	obsidian: {
		item: "Obsidian",
		value: [250,270,290,310,330,350],
		canBuy: false,
	},
	
	hellstone: {
		item: "Hellstone",
		value: [10,15,20,25,30],
		canBuy: false,
	},
	ignis: {
		item: "Ignis",
		value: [80,90,100,110,120],
		canBuy: false,
	},
	promethium: {
		item: "Promethium Ore",
		value: [250,270,290,310,330,350],
		canBuy: false,
	},
	promethiumBar: {
		item: "Promethium Bar",
		value: [375,400,425,450,475,500,525],
		canBuy: false,
	},
	mithril: {
		item: "Mithril Ore",
		value: [500,550,600,650,700],
		canBuy: false,
	},
	mithrilBar: {
		item: "Mithril Bar",
		value: [750,800,850,900,950,1000,1050],
		canBuy: false,
	},
	
	
	
	
	
	
	// Liquid Refinery items go here too since they are so similar
	emptyBarrel: {
		item: "Empty Barrel",
		value: [80,84,88,92,96,100],
		canBuy: false,
		liquidRefinery: true,
		alwaysShow: true,
	},
	oilBarrel: {
		item: "Oil Barrel",
		value: [125,130,135,140,145,150,155,160,165,170,175,180,185,190,195,200],
		canBuy: false,
		liquidRefinery: true,
		alwaysShow: true,
	},
	lavaBarrel: {
		item: "Lava Barrel",
		value: [250,260,270,280,290,300,310,320,330,340,350],
		canBuy: false,
		liquidRefinery: true,
		alwaysShow: true,
	},
	
}
function pickRandom(list) {
	return list[Math.floor(Math.random() * list.length)]
}
function getOrePrice(ore) {
	if (!(ore.item in player.town.orePrices)) {
		player.town.orePrices[ore.item] = pickRandom(ore.value)
	}
	return player.town.orePrices[ore.item]
}
function getOreStock(ore) {
	if (!(ore.item in player.town.oreStocks)) {
		player.town.oreStocks[ore.item] = 0
	}
	return player.town.oreStocks[ore.item]
}
function canBuyOre(ore) {
	if (!(ore.item in player.town.oreStocks)) {
		return false
	}
	return ore.canBuy
}
function oreRefinerySelectBtn(oreName) {
	let rItem = oreRefineryItems[oreName]
	if (!rItem) {
		console.error("refinery item not found "+oreName)
		return {}
	}
	return {
		display() {return `<span style="color: ${itemColor(rItem.item)}">${rItem.item}</span>`},
		style() {return {"min-height":"50px","min-width":"250px","border":"2px solid black","background":"rgba(0,0,0,0.5)","border-radius":"4px","font-size":"18px","color":"white","margin":"2px"}},
		unlocked() {return rItem.alwaysShow || rItem.canBuy || playerHas(rItem.item) || getOreStock(rItem) > 0},
		canClick() {return true},
		onClick() {oreSelected = rItem},
		marked() {return playerHas(rItem.item)?"resources/check.png":false}
	}	
}
function oreRefineryLeft() {
	display = []
    for (let i=101;i<=199;i++) {
		display.push(["clickable",i])
	}
	return display
}
function oreRefineryRight() {
	let ore = oreSelected
	if (ore == null || ore.liquidRefinery) {
		return []
	}
	return [
		["display-text", `<h1><span style="color: ${itemColor(ore.item)}">${ore.item}</span></h1>`,],
		["display-text", `Price per unit: <span style="color: #D8BD36"><h3>$${getOrePrice(ore)}</h3></span> ($${ore.value[0]}-$${ore.value[ore.value.length-1]})`,],
		["display-text", `<h3>${playerHas(ore.item)}</h3> units in inventory`,],
		["display-text", `<h3>${getOreStock(ore)}</h3> units in stock`,],
		"blank",
		["clickables",[1,2]]
	]
}
function oreRefineryBtnStyle(can) {
	return {
		"cursor":(can?"pointer":"default"),"opacity":(can?"1.0":"0.0"),"min-height":"40px","min-width":"160px","border":"2px solid black","background":"rgba(0,0,0,0.5)","border-radius":"4px","font-size":"16px","color":"white","margin":"2px"
	}
}
// Ore Refinery market buttons
let barrelNames = ["Oil Barrel","Lava Barrel"]
function sellOneOre() {
	let ore = oreSelected
	let price = getOrePrice(ore)
	takeFromInventory(ore.item)
	addMoney(price)
	player.town.oreStocks[ore.item] += 1
	if (barrelNames.includes(ore.item)) addToInventory("Empty Barrel")
}
function sellAllOre() {
	let ore = oreSelected
	let amt = playerHas(ore.item)
	let price = amt*getOrePrice(ore)
	takeFromInventory(ore.item,amt)
	addMoney(price)
	player.town.oreStocks[ore.item] += amt
	if (barrelNames.includes(ore.item)) addToInventory("Empty Barrel",amt)
}
function buyOneOre() {
	let ore = oreSelected
	let price = getOrePrice(ore)
	takeMoney(price)
	addToInventory(ore.item)
	player.town.oreStocks[ore.item] -= 1
}
function buyFiveOre() {
	let ore = oreSelected
	let price = 5*getOrePrice(ore)
	takeMoney(price)
	addToInventory(ore.item,5)
	player.town.oreStocks[ore.item] -= 5
}

function oreRefineryUpdate() {
	// Change all stock prices, reduce stocks, and add to a buyable stock
	let keys = Object.keys(oreRefineryItems)
    for (let i=0;i<keys.length;i++) {
		let ore = oreRefineryItems[keys[i]]
		let min = ore.value[0]
		let max = ore.value[ore.value.length-1]
		let curr = getOrePrice(ore)
		let index = ore.value.indexOf(curr)
		if (curr == min) {
			// ore is at minimum value
			let move = pickRandom([0,1,1])
			if (move == 1) player.town.orePrices[ore.item] = ore.value[index+1]
		}
		else if (curr == max) {
			// ore is at maximum value
			let move = pickRandom([0,1])
			if (move == 0) player.town.orePrices[ore.item] = ore.value[index-1]
		}
		else {
			// ore neither minimum nor maximum
			let move = pickRandom([0,1,2])
			if (move == 0) player.town.orePrices[ore.item] = ore.value[index-1]
			if (move == 2) player.town.orePrices[ore.item] = ore.value[index+1]
		}
		player.town.oreStocks[ore.item] = Math.floor(getOreStock(ore)*0.4)
	}
	/*let times = Math.floor(Math.random()*keys.length)
    for (let i=0;i<times;i++) {
		let stock = pickRandom(keys)
		let ore = oreRefineryItems[stock]
		player.town.oreStocks[ore.item] = Math.floor(player.town.oreStocks[ore.item]/2)
	}*/
	let addStocks = []
    for (let i=0;i<keys.length;i++) {
		let ore = oreRefineryItems[keys[i]]
		if(ore.canBuy) addStocks.push(ore)
	}
	let addStock = pickRandom(addStocks)
	let mMax = 100*(1.5**player.inv.pickLevel)
	let addAmt = Math.floor((Math.random()*mMax)/getOrePrice(addStock))
	if (addAmt == NaN) addAmt = pickRandom([1,2,3])
	if (addAmt > 3) addAmt = Math.floor(3*(addAmt/3)**(1/3))
	player.town.oreStocks[addStock.item] = getOreStock(addStock)+addAmt
}

function getStoreCost() {
	var item = storeItemSelected		
	if (item == null) {
		return [0,{},0]
	}
	var cost = 0
	var reqs = []
	var space = 0
	if (item == "pickaxe") {
		let next = player.inv.pickLevel+1
		cost = pickaxeCosts[next]
		reqs = pickaxeReqs[next]
		let handle = chooseWoodStick()
		if (handle) {
			cost += carpentryTableCost(handle)
		}
	}
	if (item == "axe") {
		let next = player.inv.axeLevel+1
		cost = axeCosts[next]
		reqs = axeReqs[next]
		let handle = chooseWoodStick()
		if (handle) {
			cost += carpentryTableCost(handle)
		}
	}
	if (item == "headlamp") {
		let next = player.inv.headlampLevel+1
		cost = headlampCosts[next]
		reqs = headlampReqs[next]
	}
	if (item == "inventory") {
		//let purchases = (tmp.mod.playerInvLimit - 25 - (hasAchievement("badges",11) ? 75 : 0)) / 25
		cost = 750//600 + 50*purchases
		reqs = {}
	}
	if (item == "pump") {
		cost = 12000
		reqs = {"Iron Bar": 20}
		space = 2
	}
	if (item == "checkpoint") {
		cost = 7500
		reqs = {"chooseWoodPlank": 16}
		let base = chooseWoodPlank()
		if (base) {
			cost += carpentryTableCost(base)
		}
	}
	if (item == "dynamite") {
		cost = 4000
		reqs = {"Sulfur": 5, "Coal": 10}
		space = 10
	}
	if (item == "dCharge") {
		cost = 5000
		reqs = {"Sulfur": 5, "Coal": 10}
		space = 5
	}
	if (item == "barrel") {
		cost = 500
		reqs = {"Iron Bar": 2}
		space = 1
	}
	if (item == "drillsaw") {
		let next = player.inv.drillsawLevel+1
		cost = drillsawCosts[next]
		reqs = drillsawReqs[next]
	}
	if (item == "talisman") {
		let next = player.inv.talismanLevel+1
		cost = talismanCosts[next]
		reqs = talismanReqs[next]
	}
	return [cost,reqs,space]
}

function reqStr(reqs) {
	let keys = Object.keys(reqs)
	var str = ""
    for (let i=0;i<keys.length;i++) {
		let item = keys[i]
		let amt = reqs[item]
		if (item == "chooseWoodStick") item = chooseWoodStick()
		if (item == "chooseWoodPlank") item = chooseWoodPlank()
		if (item == "") continue
		str += `<br>${(playerHas(item) >= amt) ? "✔️" : "❌"} <span style="color: ${itemColor(item)}">${amt} ${item}</span>`
	}	
	return str
}
function woodChoices() {
	let unlockedWoods = player.stats.unlockedWoods
	var woodsChoices = []
    for (let i=0;i<unlockedWoods.length;i++) {
		let woodType = woods[unlockedWoods[i]]
		let gId = 101+i*100
		var doKeep = false
		if (storeItemSelected == "pickaxe") doKeep = (woodType == woods[player.inv.pickHandle])
		if (storeItemSelected == "axe") doKeep = (woodType == woods[player.inv.axeHandle])
		if (storeItemSelected == "checkpoint") doKeep = (woodType == woods[player.inv.checkpoint])
		woodsChoices.push(["row",[
				["gridable", gId, {"background-color":(layers.town.grid.getCanClick(null,gId) ? "#3F3F3F" : "white"), "cursor": (layers.town.grid.getCanClick(null,gId) ? "pointer" : "default")}],
				"blank",
				["display-text", `<span style="color: ${itemColor(woodType.name)}">${doKeep ? "Keep" : "Use"} ${woodType.name}</span>`,]
		]])		
	}
	return ["column",woodsChoices]
}
function storeSelectWood(id) {
	let woodId = (id-101)/100
	let selectedWood = Object.keys(woods)[woodId]
	if (storeItemSelected in chooseWood) 
		chooseWood[storeItemSelected] = selectedWood
	
}

function storeLeft() {
	display = []
	
	if(layers.town.clickables[201].unlocked()) display.push(["clickable",201]) // Pickaxe Upgrade
	if(layers.town.clickables[202].unlocked()) display.push(["clickable",202]) // Axe Upgrade
	if(layers.town.clickables[203].unlocked()) display.push(["clickable",203]) // New Headlamp
	if(layers.town.clickables[204].unlocked()) display.push(["clickable",204]) // Inventory Upgrade
	if(layers.town.clickables[205].unlocked()) display.push(["clickable",205]) // Pump
	if(layers.town.clickables[206].unlocked()) display.push(["clickable",206]) // Checkpoint
	if(layers.town.clickables[207].unlocked()) display.push(["clickable",207]) // Dynamite
	if(layers.town.clickables[208].unlocked()) display.push(["clickable",208]) // Detonation Charges
	if(layers.town.clickables[209].unlocked()) display.push(["clickable",209]) // Empty Barrel

	return display
}
function storeRight() {
	var item = storeItemSelected		
	if (item == null) {
		return []
	}
	var desc = ""
	var doWoodChoose = false
	if (item == "pickaxe") {
		let next = player.inv.pickLevel+1
		item = pickaxeNames[next]
		desc = pickaxeDescs[next]
		doWoodChoose = true
	}
	if (item == "axe") {
		let next = player.inv.axeLevel+1
		item = axeNames[next]
		desc = axeDescs[next]
		doWoodChoose = true
	}
	if (item == "headlamp") {
		let next = player.inv.headlampLevel+1
		item = headlampNames[next]
		desc = headlampDescs[next]
	}
	if (item == "inventory") {
		item = "Inventory Upgrade"
		desc = "Increases the maximum size of your inventory by 25, up to a cap of 10,000."
	}
	if (item == "pump") {
		item = "Pump"
		desc = "A basic pump that allows you to extract liquids from underground pools.<br>Comes with 2 Empty Barrels."
	}
	if (item == "checkpoint") {
		item = `<span style="color: ${itemColor("Pine")}">Checkpoint</span>`
		desc = "Grants you the ability to place a checkpoint anywhere in the mine, allowing you to return to it at any time. Can be reused infinite times."
		doWoodChoose = true
	}
	if (item == "dynamite") {
		item = "Dynamite"
		desc = "A package of 10 dynamite. Instantly creates a 3x3 explosion when used, giving you all destroyed blocks."
	}
	if (item == "dCharge") {
		item = "Detonation Charges"
		desc = "A package of 5 detonation charges. Blasts a 7 block long tunnel in a wall, or instantly creates a hole in the floor."
	}
	if (item == "barrel") {
		item = "Empty Barrel"
		desc = "An empty barrel used to store liquids. Requires a Pump to use."
	}
	let costreq = getStoreCost()
	let cost = costreq[0]
	let reqs = costreq[1]
	let reqInfo = (Object.keys(reqs).length === 0 ? [] : ["display-text", `<br><h3>Requires</h3>${reqStr(reqs)}`])
	return [
		// Name
		["display-text", `<h1><span style="color: ${itemColor(item)}">${item}</span></h1>`,],
		// Cost
		["display-text", `<span style="color: #FFD88C">$${cost}</span>`,],
		// Description
		["display-text", `${desc}`,],
		// Requirements
		["row",[
			(doWoodChoose ? ["column", [ reqInfo ], {"justify-content":"left"}] : reqInfo),
			(doWoodChoose ? ["blank", ["30px","30px"]] : ""),
			(doWoodChoose ? ["column", [
				"blank",
				["display-text", `<br><h3>Choose Wood</h3>`],
				["blank","4px"],
				woodChoices(),
			], {"justify-content":"left"}] : ""),
		],{"justify-content":"left"}],
		["clickable",291],
	]
}
function storeBtnStyle() {
	return {
		"min-height":"50px","min-width":"250px","border":"2px solid black","background":"rgba(0,0,0,0.5)","border-radius":"4px","font-size":"18px","color":"white","margin":"2px"
	}
}

function pickaxeUpgradeStoreBtn() {
	return {
		display() {
			let name = pickaxeNames[player.inv.pickLevel+1]
			return `<span style="color: ${itemColor(name)}">${name}</span>`
		},
		style() {return storeBtnStyle()},
		canClick() {
			return this.unlocked()
		},
		onClick() {
			storeItemSelected = "pickaxe"
		},
		unlocked() {return player.inv.pickLevel < 10},
	}
}
function axeUpgradeStoreBtn() {
	return {
		display() {
			let name = axeNames[player.inv.axeLevel+1]
			return `<span style="color: ${itemColor(name)}">${name}</span>`
		},
		style() {return storeBtnStyle()},
		canClick() {
			return this.unlocked()
		},
		onClick() {
			storeItemSelected = "axe"
		},
		unlocked() {return player.inv.axeLevel < 10},
	}	
}
function headlampUpgradeStoreBtn() {
	return {
		display() {
			let name = headlampNames[player.inv.headlampLevel+1]
			return `<span style="color: ${itemColor(name)}">${name}</span>`
		},
		style() {return storeBtnStyle()},
		canClick() {
			return this.unlocked()
		},
		onClick() {
			storeItemSelected = "headlamp"
		},
		unlocked() {return player.inv.headlampLevel < 1},
	}	
}
function inventoryUpgradeStoreBtn() {
	return {
		display() {
			return `Inventory Upgrade`
		},
		style() {return storeBtnStyle()},
		canClick() {
			return this.unlocked()
		},
		onClick() {
			storeItemSelected = "inventory"
		},
		unlocked() {return player.inv.limit < 10000},
	}
}
function pumpStoreBtn() {
	return {
		display() {
			return `Pump`
		},
		style() {return storeBtnStyle()},
		canClick() {
			return this.unlocked()
		},
		onClick() {
			storeItemSelected = "pump"
		},
		unlocked() {return !player.inv.pump},
	}
}
function checkpointStoreBtn() {
	return {
		display() {
			return `<span style="color: ${itemColor("Oak")}">Checkpoint</span>`
		},
		style() {return storeBtnStyle()},
		canClick() {
			return this.unlocked()
		},
		onClick() {
			storeItemSelected = "checkpoint"
		},
		unlocked() {return !player.inv.checkpoint},
	}
}
function dynamiteStoreBtn() {
	return {
		display() {
			return `Dynamite`
		},
		style() {return storeBtnStyle()},
		canClick() {
			return this.unlocked()
		},
		onClick() {
			storeItemSelected = "dynamite"
		},
		unlocked() {return true},
	}
}
function dChargeStoreBtn() {
	return {
		display() {
			return `Detonation Charges`
		},
		style() {return storeBtnStyle()},
		canClick() {
			return this.unlocked()
		},
		onClick() {
			storeItemSelected = "dCharge"
		},
		unlocked() {return true},
	}
}
function barrelStoreBtn() {
	return {
		display() {
			return `Empty Barrel`
		},
		style() {return storeBtnStyle()},
		canClick() {
			return this.unlocked()
		},
		onClick() {
			storeItemSelected = "barrel"
		},
		unlocked() {return true},
	}
}

function chooseWoodStick() {
	let selectedWood = chooseWood[storeItemSelected]
	if (!selectedWood) return ""
	let current = (storeItemSelected == 'pickaxe') ? player.inv.pickHandle : (storeItemSelected == 'axe') ? player.inv.axeHandle : player.inv.checkpoint
	if (!(current || storeItemSelected == 'checkpoint')) current = 'oak'
	if (current == selectedWood) return ''
	return woods[selectedWood].name+" Stick"

}
function chooseWoodPlank() {
	let selectedWood = chooseWood[storeItemSelected]
	if (!selectedWood) return ""
	let current = (storeItemSelected == 'pickaxe') ? player.inv.pickHandle : (storeItemSelected == 'axe') ? player.inv.axeHandle : player.inv.checkpoint
	if (!(current || storeItemSelected == 'checkpoint')) current = 'oak'
	if (current == selectedWood) return ''
	return woods[selectedWood].name+" Plank"

}
function playerHasReqs(reqs) {
	let keys = Object.keys(reqs)
    for (let i=0;i<keys.length;i++) {
		let item = keys[i]
		let amt = reqs[item]
		if (item == "chooseWoodStick") item = chooseWoodStick()
		if (item == "chooseWoodPlank") item = chooseWoodPlank()
		if (item == "") continue
		if (playerHas(item) < amt) return false
	}
	return true	
}
function takeReqs(reqs) {
	let keys = Object.keys(reqs)
    for (let i=0;i<keys.length;i++) {
		let item = keys[i]
		let amt = reqs[item]
		if (item == "chooseWoodStick") item = chooseWoodStick()
		if (item == "chooseWoodPlank") item = chooseWoodPlank()
		if (item == "") continue
		takeFromInventory(item,amt)
	}
}

pickaxeNames = [
	"Stone Pickaxe",
	"Copper Pickaxe",
	"Iron Pickaxe",
	"Silver Pickaxe",
	"Emerald Pickaxe",
	"Ruby Pickaxe",
	"Sapphire Pickaxe",
	"Gold Pickaxe",
	"Diamond Pickaxe",
	"Obsidian Pickaxe",
	"Mithril Pickaxe",
]
pickaxeCosts = [
	0, // Stone
	800, // Copper
	1500, // Iron
	2000, // Silver
	4000, // Emerald
	6000, // Ruby
	12000, // Sapphire
	18000, // Gold
	25000, // Diamond
	30000, // Obsidian
	60000, // Mithril
]
pickaxeReqs = [
	// TODO rebalance mineral costs? should bars be 10 instead of 15?
	{"Stone": 10}, // Stone
	{"Copper Bar": 10, "chooseWoodStick": 20}, // Copper
	{"Iron Bar": 10, "chooseWoodStick": 20}, // Iron
	{"Silver Bar": 15, "chooseWoodStick": 20}, // Silver
	{"Emerald": 15, "chooseWoodStick": 20}, // Emerald
	{"Ruby": 15, "chooseWoodStick": 20}, // Ruby
	{"Sapphire": 15, "chooseWoodStick": 20}, // Sapphire
	{"Gold Bar": 15, "chooseWoodStick": 20}, // Gold
	{"Diamond": 15, "chooseWoodStick": 20}, // Diamond
	{"Obsidian": 12, "chooseWoodStick": 20}, // Obsidian
	{"Mithril Bar": 15, "chooseWoodStick": 20}, // Mithril
]
pickaxeDescs = [
	"A basic, standard pickaxe. It has a 4s base dig time and a 0% double drop chance.", // Stone
	"An upgrade from the Stone Pickaxe. It has a 3.4s base dig time and a 1.2% double drop chance.", // Copper
	"An upgrade from the Copper Pickaxe. It has a 3s base dig time and a 2.5% double drop chance.", // Iron
	"An upgrade from the Iron Pickaxe. It has a 2s base dig time and a 4% double drop chance.", // Silver
	"An upgrade from the Silver Pickaxe. It has a 1.7s base dig time and a 5.1% double drop chance.", // Emerald
	"An upgrade from the Emerald Pickaxe. It has a 1.5s base dig time and a 6% double drop chance.", // Ruby
	"An upgrade from the Ruby Pickaxe. It has a 1.2s base dig time and a 7% double drop chance.", // Sapphire
	"An upgrade from the Sapphire Pickaxe. It has a 0.9s base dig time and an 8% double drop chance.", // Gold
	"An upgrade from the Gold Pickaxe. It has a 0.7s base dig time and a 9% double drop chance.", // Diamond
	"An upgrade from the Diamond Pickaxe. It has a 0.5s base dig time and a 10% double drop chance.", // Obsidian
	"An upgrade from the Obsidian Pickaxe. It has a 0.3s base dig time and a 12.5% double drop chance.", // Mithril
]
axeNames = [
	"Stone Axe",
	"Copper Axe",
	"Iron Axe",
	"Silver Axe",
	"Emerald Axe",
	"Ruby Axe",
	"Sapphire Axe",
	"Gold Axe",
	"Diamond Axe",
	"Obsidian Axe",
	"Mithril Axe",
]
axeCosts = [
	0, // Stone
	500, // Copper
	900, // Iron
	2000, // Silver
	4000, // Emerald
	6000, // Ruby
	12000, // Sapphire
	18000, // Gold
	25000, // Diamond
	30000, // Obsidian
	50000, // Mithril
]
axeReqs = [
	{"Stone": 10}, // Stone
	{"Copper Bar": 10, "chooseWoodStick": 20}, // Copper
	{"Iron Bar": 15, "chooseWoodStick": 20}, // Iron
	{"Silver Bar": 15, "chooseWoodStick": 20}, // Silver
	{"Emerald": 15, "chooseWoodStick": 20}, // Emerald
	{"Ruby": 15, "chooseWoodStick": 20}, // Ruby
	{"Sapphire": 15, "chooseWoodStick": 20}, // Sapphire
	{"Gold Bar": 15, "chooseWoodStick": 20}, // Gold
	{"Diamond": 15, "chooseWoodStick": 20}, // Diamond
	{"Obsidian": 12, "chooseWoodStick": 20}, // Obsidian
	{"Mithril Bar": 15, "chooseWoodStick": 20}, // Mithril
]
axeDescs = [
	"A basic, standard axe. It has a 4s base cut time and a 100% lumber value multiplier.", // Stone
	"An upgrade from the Stone Axe. It has a 3.5s base cut time and a 125% lumber value multiplier.", // Copper
	"An upgrade from the Copper Axe. It has a 3.2s base cut time and a 150% lumber value multiplier.", // Iron
	"An upgrade from the Iron Axe. It has a 2s base cut time and a 175% lumber value multiplier.", // Silver
	"An upgrade from the Silver Axe. It has a 1.7s base cut time and a 200% lumber value multiplier.", // Emerald
	"An upgrade from the Emerald Axe. It has a 1.5s base cut time and a 225% lumber value multiplier.", // Ruby
	"An upgrade from the Ruby Axe. It has a 1.2s base cut time and a 250% lumber value multiplier.", // Sapphire
	"An upgrade from the Sapphire Axe. It has a 0.9s base cut time and a 275% lumber value multiplier.", // Gold
	"An upgrade from the Gold Axe. It has a 0.7s base cut time and a 300% lumber value multiplier.", // Diamond
	"An upgrade from the Diamond Axe. It has a 0.5s base cut time and a 325% lumber value multiplier.", // Obsidian
	"An upgrade from the Obsidian Axe. It has a 0.3s base cut time and a 350% lumber value multiplier.", // Mithril
]
headlampNames = [
	"N/A",
	"Miner's Headlamp",
]
headlampCosts = [
	0, // None
	600, // Standard
]
headlampReqs = [
	{}, // None
	{}, // Standard
]
headlampDescs = [
	"", // None
	"A handy headlamp for lighting up those dark mines. Never runs out of batteries!", // Standard
]

function buyStoreItem() {
	var item = storeItemSelected		
	if (item == null) return
	
	let costreq = getStoreCost()
	let cost = costreq[0]
	let reqs = costreq[1]
	
	takeMoney(cost)
	takeReqs(reqs)
	
	if (item == "pickaxe") {
		player.inv.pickLevel++
		player.inv.pickHandle = chooseWood['pickaxe']
		storeItemSelected = null
	}
	else if (item == "axe") {
		player.inv.axeLevel++
		player.inv.axeHandle = chooseWood['axe']
		storeItemSelected = null
	}
	else if (item == "headlamp") {
		player.inv.headlampLevel++
		player.inv.headlamps.push(player.inv.headlampLevel)
		if (player.inv.headlamp == 0) {
			player.inv.headlamp = player.inv.headlampLevel
		}
		storeItemSelected = null
	}
	else if (item == "inventory") {
		player.inv.limit += 25
		if (player.inv.limit >= 10000) {
			player.inv.limit = 10000
			storeItemSelected = null
		}
		updateTempInventory()
	}
	else if (item == "pump") {
		player.inv.pump = true
		storeItemSelected = null
		addToInventory("Empty Barrel",2)
	}
	else if (item == "checkpoint") {
		player.inv.checkpoint = chooseWood['checkpoint']
		storeItemSelected = null
	}
	else if (item == "dynamite") {
		addToInventory("Dynamite",10)
	}
	else if (item == "dCharge") {
		addToInventory("Detonation Charge",5)	
	}
	else if (item == "barrel") {
		addToInventory("Empty Barrel")		
	}
	else {
		console.error("oopss")
	}
}

// Forge
forgeInputs = {
	"Clay": {
		input: "Clay",
		output: "Clay Brick",
		time: 30,
		temperature: 900,
	},
	"Copper Ore": {
		input: "Copper Ore",
		output: "Copper Bar",
		time: 30,
		temperature: 1085,
	},
	"Tin Ore": {
		input: "Tin Ore",
		output: "Tin Bar",
		time: 60,
		temperature: 232,
	},
	"Iron Ore": {
		input: "Iron Ore",
		output: "Iron Bar",
		time: 30,
		temperature: 1438,
	},
	"Silver Ore": {
		input: "Silver Ore",
		output: "Silver Bar",
		time: 30,
		temperature: 962,
	},
	"Gold Ore": {
		input: "Gold Ore",
		output: "Gold Bar",
		time: 30,
		temperature: 1064,
	},
	"Promethium Ore": {
		input: "Promethium Ore",
		output: "Promethium Bar",
		time: 30,
		temperature: 1042,
	},
	"Mithril Ore": {
		input: "Mithril Ore",
		output: "Mithril Bar",
		time: 30,
		temperature: 1800,
	},
}
function usableForgeInputs() {
	let forge = player.town.forge
	if(forge.input[0]) return playerHas(forge.input[0]) ? [forge.input[0]] : []
	let keys = Object.keys(forgeInputs)
	let inputs = []
    for (let i=0;i<keys.length;i++) {
		let input = keys[i]
		if (playerHas(input)) inputs.push(input)		
	}
	return inputs
}
forgeFuels = {
	"Wood": 15,
	"Coal": 35,
	"Oil Barrel": 50,
	"Ignis": 55,
	"Lava Barrel": 65,
}
woodFuels = ["Oak Log","Oak Plank","Ash Log","Ash Plank","Pine Log","Pine Plank","Birch Log","Birch Plank","Cinderbark Log","Cinderbark Plank","Silverwood Log","Silverwood Plank","Goldbranch Log","Goldbranch Plank","Witchwood Log","Witchwood Plank"]
function getBurnTime(item) {
	if (item in forgeFuels) return forgeFuels[item]
	for (let i=0;i<woodFuels.length;i++) {
		if (item == woodFuels[i]) return forgeFuels["Wood"]
	}
	return 0
}
function woodFuelsHad() {
	let fuels = []
	for (let i=0;i<woodFuels.length;i++) {
		if (playerHas(woodFuels[i])) fuels.push(woodFuels[i])
	}
	return fuels	
}
function usableForgeFuels() {
	let forge = player.town.forge
	if(forge.fuel[0]) {
		if (forge.fuel[0] == "Wood") return woodFuelsHad()
		return playerHas(forge.fuel[0]) ? [forge.fuel[0]] : []
	}
	let keys = Object.keys(forgeFuels)
	let fuels = []
    for (let i=0;i<keys.length;i++) {
		let fuel = keys[i]
		if (fuel == "Wood") {
			for (let j=0;j<woodFuels.length;j++) {
				if (playerHas(woodFuels[j])) fuels.push(woodFuels[j])
			}
			continue
		}
		if (playerHas(fuel)) fuels.push(fuel)
	}
	return fuels
}
function updateForge(diff) {
	let forge = player.town.forge
	if(forge.fuel[0]) {
		forge.fuelTime += diff
		if (forge.fuelTime >= getBurnTime(forge.fuel[0])) {
			forge.fuel[1]--
			forge.fuelTime = 0
			if (!forge.fuel[1]) forge.fuel[0] = null
		}
		if (forge.temperature < 2000) forge.temperature += diff*10
		if (forge.temperature > 2000) forge.temperature = 2000
	}
	else { // no fuel
		if (forge.temperature > 0) forge.temperature -= diff*10
		if (forge.temperature < 0) forge.temperature = 0
	}
	if(forge.input[0]) {
		if (forge.temperature > forgeInputs[forge.input[0]].temperature) {
			if (forge.output[0] == null || forgeInputs[forge.input[0]].output == forge.output[0]) {
				forge.cookTime += diff*(forge.temperature/forgeInputs[forge.input[0]].temperature)*getForgeSpeedBonus()
				if (forge.cookTime >= forgeInputs[forge.input[0]].time) {
					player.stats.totalForgeSmelts++
					forge.cookTime = 0
					let production = Math.min(forge.production,forge.input[1])
					forge.input[1] -= production
					if (forge.output[0] == null) forge.output[0] = forgeInputs[forge.input[0]].output
					forge.output[1] += production
					if (!forge.input[1]) forge.input[0] = null
				}
			}
		}
	}
}
function increaseForgeProductionCost() {
	let costs = [4000,40000,400000,Infinity]
	return costs[player.town.forge.production-1]
}
function collectForgeOutput() {
	let forge = player.town.forge
	let item = forge.output[0]
	let takeAmt = Math.min(forge.output[1], tmp.mod.playerInvLeft)
	forge.output[1] -= takeAmt
	addToInventory(item,takeAmt)
	if (!forge.output[1]) forge.output[0] = null
}
function forgeProductionBar(num) {
	return {
		direction: RIGHT,
		width: 240,
		height: 20,
		progress() { 
			let input = forgeInputs[player.town.forge.input[0]]
			if (!input) return 0
			return player.town.forge.cookTime/input.time 
		},
		baseStyle: {"background-color":"rgba(0,0,0,0.5)"},
		fillStyle: {"background-color": "#FFFFFF"},
		borderStyle: {"border-color": "black", "border-radius": "2px"},
		unlocked() {return player.town.forge.production >= num},
	}
}
function forgeClickable() {
	return {"min-height":"30px","min-width":"160px","border":"2px solid black","background":"rgba(0,0,0,0.5)","border-radius":"4px","font-size":"14px","color":"white","margin":"2px","box-shadow":"none","transform":"scale(1,1)"}
}

function dirtSifterLeft() {
	return [
		["row",[
			["display-text", `Amount:`,],
			"blank",
			["strict-text-input", "dirtSifterTextInput", {"width": "60px", "border-radius":"1px", "border":"4px solid black", "background":"rgba(0,0,0,0.5)", "color":"white"}],
		],],
		["clickable",401],
		["display-text", player.town.dirtSifterRunning ? `` : `Price: $${getDirtSifterPrice()}`,],
		["display-text", player.town.dirtSifterRunning ? `` : `Time: ${formatTime(getDirtSifterTime()/dirtSifterSpeedup())}`,],
		["blank","10px"],
		["display-text", player.town.dirtSifterRunning ? `Sifting ${player.town.dirtSifterInput} <span style="color: ${itemColor("Dirt")}">Dirt</span>` : ``,],
		["display-text", player.town.dirtSifterRunning ? `${formatTime(getSifterTimeLeft()/dirtSifterSpeedup())} left` : ``,],
		["blank","10px"],
		["bar","dirtSifterProgress"],		
	]
}
function dirtSifterRight() {
	let hasOutput = (Object.keys(player.town.dirtSifterOutput).length > 0)
	return [
		["display-text", `<h3>Results</h3>`],
		"blank",
		["display-text", hasOutput ? dirtSifterResultsString() : ""],
		["clickable",402],
	]
}
function getDirtSifterTextInput() {
	return isNaN(player.town.dirtSifterTextInput) ? 0 : Math.max(Math.min(Math.floor(player.town.dirtSifterTextInput), 1000),0)
}
function getDirtSifterPrice() {
	return player.town.dirtSifterRunning ? player.town.dirtSifterInput*20 : getDirtSifterTextInput()*20
}
function getDirtSifterTime() {
	return player.town.dirtSifterRunning ? player.town.dirtSifterInput*5 : getDirtSifterTextInput()*5
}
function getSifterTimeLeft() {
	if (!player.town.dirtSifterRunning) return 0
	return getDirtSifterTime()-player.town.dirtSifterTime
}
function updateDirtSifter(diff) {
	if (!player.town.dirtSifterRunning) return
	player.town.dirtSifterTime += diff*dirtSifterSpeedup()
	if (getSifterTimeLeft() <= 0) {
		let siftedAmount = player.town.dirtSifterInput
		player.town.dirtSifterInput = 0
		player.town.dirtSifterTime = 0
		player.town.dirtSifterRunning = false
		player.stats.totalDirtSifted += siftedAmount
		player.town.dirtSifterOutput = getDirtSiftRewards(siftedAmount)		
	}
}
function dirtSifterSpeedup() {
	var speedBonus = 1.0
	if (hasAchievement("badges",14)) speedBonus *= 1.25
	return speedBonus	
}
function getDirtSiftRewards(siftedAmount) {
	let rewards = {}
    for (let i=0;i<siftedAmount;i++) {
		// Loot table for each individual piece of dirt
		
		let luckBonus = 1+tmp.mod.playerLuck

		// Yeah -- these numbers are lifted straight from Epic Mining Wiki -- DEAL WITH IT
		let weightedList = [
			["Nothing", (67.96)/luckBonus**3],
			["Coal", 6.57],
			["Copper Ore", 8.21],
			["Sulfur", 4.96],
			["Iron Ore", 3.22],
			["Silver Ore", 2.18],
			["Emerald", 1.49],
			["Ruby", 1.35],
			["Sapphire", 1.71],
			["Gold Ore", 0.94],
			["Amethyst", 0.53],
			["Quartz", 0.37],
			["Diamond", 0.31],
		]

		var reward = pickWeightedRandom(weightedList)
		
		if (reward == "Nothing") continue
		if (!(reward in rewards)) rewards[reward] = 0
		rewards[reward]++
		
	}
	return rewards
}
function dirtSifterResultsString() {
	let resultsString = ""
	for (const item in player.town.dirtSifterOutput) {
		resultsString += `<span style="color: ${itemColor(item)}">${player.town.dirtSifterOutput[item]} ${item}</span><br>`
	}
	return resultsString
}
function takeDirtSifterOutput() {
	let rewards = Object.keys(player.town.dirtSifterOutput)
    for (let i=0;i<rewards.length;i++) {
		let reward = rewards[i]
		let amount = player.town.dirtSifterOutput[rewards[i]]
		let takeAmt = Math.min(amount, tmp.mod.playerInvLeft)
		
		player.town.dirtSifterOutput[rewards[i]] -= takeAmt
		if (player.town.dirtSifterOutput[rewards[i]] == 0) delete player.town.dirtSifterOutput[rewards[i]]
		addToInventory(reward,takeAmt)
	}

}

function liquidRefineryLeft() {
	display = []
    for (let i=1101;i<=1110;i++) {
		display.push(["clickable",i])
	}
	return display
}
function liquidRefineryRight() {
	// this is just an extension of the ore refinery so uses the same variables
	let ore = oreSelected
	if (ore == null || !ore.liquidRefinery) {
		return []
	}
	return [
		["display-text", `<h1><span style="color: ${itemColor(ore.item)}">${ore.item}</span></h1>`,],
		["display-text", `Price per unit: <span style="color: #D8BD36"><h3>$${getOrePrice(ore)}</h3></span> ($${ore.value[0]}-$${ore.value[ore.value.length-1]})`,],
		["display-text", `<h3>${playerHas(ore.item)}</h3> units in inventory`,],
		["display-text", `<h3>${getOreStock(ore)}</h3> units in stock`,],
		"blank",
		["clickables",[1,2]]
	]
}

// do not save these settings
var chooseWood = {'pickaxe':null,'axe':null,'checkpoint':'oak'}
var oreSelected = null
var storeItemSelected = null
addLayer("town", {
    name: "town",
    symbol: "🏠",
    position: 1,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
		oreRefineryUpdateTime: 0,
		orePrices: {},
		oreStocks: {},
		forge: {
			input: [null,0],
			output: [null,0],
			fuel: [null,0],
			cookTime: 0,
			fuelTime: 0,
			production: 1,
			temperature: 0,
		},
		// forge dropdown
		selectedForgeInput: "",
		selectedForgeFuel: "",
		dirtSifterRunning: false,
		dirtSifterTextInput: 1,
		dirtSifterTime: 0,
		dirtSifterInput: 0,
		dirtSifterOutput: {},
    }},
    color: "#CCA37A",
    type: "none",
    row: 0,
    layerShown(){return true},
	tooltip() {return "Town"},
	tooltipLocked() {return "Currently underground"},
	layerShown() {return !player.mine.inMine},
	tabFormat: {
		"Ore Refinery": {
			content: [
				["display-text", "<h1>Refinery</h1>",],
				"blank",
				["row",[
					["column",function() {return oreRefineryLeft()}],
					"blank",
					["column",function() {return oreRefineryRight()},{"width":"400px","height":"400px"}],
				],{"height":"600px","justify-content":"left"}],
				//"blank",
				//["display-text", function() {return `You have $${player.inv.money}`},],
			],
		},
		"Store": {
			content: [
				["display-text", "<h1>Store</h1>",],
				"blank",
				["row",[
					["column",function() {return storeLeft()}],
					"blank",
					["column",function() {return storeRight()},{"width":"400px"}],
				],{"height":"600px","justify-content":"left"}],
			],
		},
		"Forge": {
			content: [
				["display-text", "<h1>Forge</h1>",],
				"blank",
				["row",[
					["column",[
						["display-text", "<h3>Input</h3>",],
						"blank",
						["display-text", function() {
							let item = player.town.forge.input[0]
							let amt = player.town.forge.input[1]
							if (!item || amt == 0) return "Empty"
							return `<span style="color: ${itemColor(item)}">${amt} ${item}</span><br>`
						}],
						"blank",
						["drop-down",function() {return ["selectedForgeInput",usableForgeInputs()]}],
						["blank","2px"],
						["clickable",301]
					],{"height":"200px","width":"200px"}],
					["blank",["40px","20px"]],
					["column",[
						["bar","forgeProduction1"],
						["bar","forgeProduction2"],
						["bar","forgeProduction3"],
						["bar","forgeProduction4"],
						["clickable",304]
					]],
					["blank",["40px","20px"]],
					["column",[
						["display-text", "<h3>Output</h3>",],
						"blank",
						["display-text", function() {
							let item = player.town.forge.output[0]
							let amt = player.town.forge.output[1]
							if (!item || amt == 0) return "Empty"
							return `<span style="color: ${itemColor(item)}">${amt} ${item}</span><br>`
						}],
						"blank",
						["clickable",302]
					],{"height":"200px","width":"200px"}],
					
				]],
				["row",[
					["blank",["120px","100px"]],
					["column",[
						["display-text", "<h3>Fuel</h3>",],
						"blank",
						["display-text", function() {
							let item = player.town.forge.fuel[0]
							let amt = player.town.forge.fuel[1]
							if (!item) return "Empty"
							return `<span style="color: ${itemColor(item)}">${amt} ${item}</span><br>`
						}],
						"blank",
						["drop-down",function() {return ["selectedForgeFuel",usableForgeFuels()]}],
						["blank","2px"],
						["clickable",303]
					],{"width":"220px"}],
					["bar","forgeFuelLeft"],
					["blank",["40px","20px"]],
					["column",[
						["bar","forgeTemperature"],
						["blank","4px"],
						["display-text", function() {return `<span style="color: #ff0000">${Math.round(player.town.forge.temperature)} C</span><br>`},],
					],{"width":"60px"}],
				]],
			],
		},
		"Dirt Sifter": {
			content: [
				["display-text", "<h1>Dirt Sifter</h1>",],
				"blank",
				["display-text", function() {return `Sift your spare <span style="color: ${itemColor("Dirt")}">Dirt</span> here for a chance to find ores and gems.<br>The higher your Luck is, the better the results will be.`},],
				["row",[
					["column",function() {return dirtSifterLeft()},{"width":"300px","height":"300px"}],
					"blank",
					["column",function() {return dirtSifterRight()},{"width":"200px","height":"300px"}],
				],],
			],
		},
		"Liquid Refinery": {
			content: [
				["display-text", "<h1>Liquid Refinery</h1>",],
				"blank",
				["row",[
					["column",function() {return liquidRefineryLeft()}],
					"blank",
					["column",function() {return liquidRefineryRight()},{"width":"400px","height":"200px"}],
				],{"height":"600px","justify-content":"left"}],,
			],
		},
	},
	clickables: {
		// Ore Refinery
		11: {
			display() {
				return `Sell 1 [$${getOrePrice(oreSelected)}]`
			},
			style() {return oreRefineryBtnStyle(this.canClick())},
			canClick() {
				return oreSelected && playerHas(oreSelected.item)
			},
			onClick() {
				if (this.canClick()) sellOneOre()
			},
			unlocked: true,	
		},
		12: {
			display() {
				return `Buy 1 [$${getOrePrice(oreSelected)}]`
			},
			style() {return oreRefineryBtnStyle(this.canClick())},
			canClick() {
				return oreSelected && canBuyOre(oreSelected) && (getOreStock(oreSelected) >= 1 && player.inv.money >= getOrePrice(oreSelected) && tmp.mod.playerInvLeft >= 1)
			},
			onClick() {
				if (this.canClick()) buyOneOre()
			},
			unlocked: true,	
		},
		21: {
			display() {
				return `Sell All [$${playerHas(oreSelected.item)*getOrePrice(oreSelected)}]`
			},
			style() {return oreRefineryBtnStyle(this.canClick())},
			canClick() {
				return oreSelected && (playerHas(oreSelected.item) > 1) && (oreSelected.item != "Empty Barrel")
			},
			onClick() {
				if (this.canClick()) sellAllOre()
			},
			unlocked: true,	
		},
		22: {
			display() {
				return `Buy 5 [$${5*getOrePrice(oreSelected)}]`
			},
			style() {return oreRefineryBtnStyle(this.canClick())},
			canClick() {
				return oreSelected && canBuyOre(oreSelected) && (getOreStock(oreSelected) >= 5 && player.inv.money >= 5*getOrePrice(oreSelected) && tmp.mod.playerInvLeft >= 5)
			},
			onClick() {
				if (this.canClick()) buyFiveOre()
			},
			unlocked: true,	
		},		
		101: oreRefinerySelectBtn("dirt"),
		102: oreRefinerySelectBtn("clay"),
		103: oreRefinerySelectBtn("clayBrick"),
		104: oreRefinerySelectBtn("coal"),
		105: oreRefinerySelectBtn("copperOre"),
		106: oreRefinerySelectBtn("copperBar"),
		107: oreRefinerySelectBtn("stone"),
		108: oreRefinerySelectBtn("tinOre"),
		109: oreRefinerySelectBtn("tinBar"),
		110: oreRefinerySelectBtn("sulfur"),
		111: oreRefinerySelectBtn("ironOre"),
		112: oreRefinerySelectBtn("ironBar"),
		113: oreRefinerySelectBtn("silverOre"),
		114: oreRefinerySelectBtn("silverBar"),
		115: oreRefinerySelectBtn("emerald"),
		116: oreRefinerySelectBtn("ruby"),
		117: oreRefinerySelectBtn("sapphire"),
		118: oreRefinerySelectBtn("goldOre"),
		119: oreRefinerySelectBtn("goldBar"),
		120: oreRefinerySelectBtn("quartz"),
		121: oreRefinerySelectBtn("amethyst"),
		122: oreRefinerySelectBtn("diamond"),
		123: oreRefinerySelectBtn("obsidian"),
		124: oreRefinerySelectBtn("hellstone"),
		125: oreRefinerySelectBtn("ignis"),
		126: oreRefinerySelectBtn("promethium"),
		127: oreRefinerySelectBtn("promethiumBar"),
		128: oreRefinerySelectBtn("mithril"),
		129: oreRefinerySelectBtn("mithrilBar"),
		1101: oreRefinerySelectBtn("emptyBarrel"),
		1102: oreRefinerySelectBtn("oilBarrel"),
		1103: oreRefinerySelectBtn("lavaBarrel"),
		
		// Store
		201: pickaxeUpgradeStoreBtn(),
		202: axeUpgradeStoreBtn(),
		203: headlampUpgradeStoreBtn(),
		204: inventoryUpgradeStoreBtn(),
		205: pumpStoreBtn(),
		206: checkpointStoreBtn(),
		207: dynamiteStoreBtn(),
		208: dChargeStoreBtn(),
		209: barrelStoreBtn(),
		291: {
			display() {
				return `Purchase`
			},
			style() {return {
				"min-height":"30px","min-width":"180px","border":`2px solid #${(this.canClick() ? "286632" : "7F5F5F")}`,"background-color":(this.canClick() ? "#21A53F" : "#BF8F8F"),"border-radius":"2px","font-size":"12px","color":(this.canClick() ? "white" : "black"),"margin-top":"20px"
			}},
			canClick() {
				return (player.inv.money >= getStoreCost()[0]) && (playerHasReqs(getStoreCost()[1])) && (tmp.mod.playerInvLeft >= getStoreCost()[2])
			},
			onClick() {
				if (this.canClick()) buyStoreItem()
			},
			tooltip() {
				if (this.canClick()) return null
				if (player.inv.money < getStoreCost()[0]) return "<span style='color:red'>Not enough money</span>"
				if (!playerHasReqs(getStoreCost()[1])) return "<span style='color:red'>Not enough materials</span>"
				return "<span style='color:red'>Not enough inventory space</span>"
			},
			unlocked: true,				
		},
		// Forge
		301: {
			display() {
				return "Add Input"
			},
			style() {return forgeClickable()},
			canClick() {
				return player.town.selectedForgeInput != "" && playerHas(player.town.selectedForgeInput)
			},
			onClick() {
				if (this.canClick()) {
					let item = player.town.selectedForgeInput
					takeFromInventory(item)
					player.town.forge.input[0] = item
					player.town.forge.input[1]++
					if (!playerHas(item)) player.town.selectedForgeInput = ""
				}
			},
			tooltip() {
				if (player.town.selectedForgeInput == "") return ""
				return "Melting point: "+forgeInputs[player.town.selectedForgeInput].temperature+" C"
			},
			unlocked: true,
		},
		302: {
			display() {
				return "Collect Output"
			},
			style() {return forgeClickable()},
			canClick() {
				return !tmp.mod.playerInvIsFull && player.town.forge.output[1] > 0
			},
			onClick() {
				if (this.canClick()) collectForgeOutput()
			},
			tooltip() {
				return tmp.mod.playerInvIsFull ? `<span style="color:#FF7F7F">No inventory space</span>` : ""
			},
			unlocked: true,	
		},
		303: {
			display() {
				return "Add Fuel"
			},
			style() {return forgeClickable()},
			canClick() {
				return player.town.selectedForgeFuel != "" && playerHas(player.town.selectedForgeFuel)
			},
			onClick() {
				if (this.canClick()) {
					let item = player.town.selectedForgeFuel
					takeFromInventory(item)
					player.town.forge.fuel[0] = (woodFuels.indexOf(item) > -1 ? "Wood" : item)
					player.town.forge.fuel[1]++
					if (!playerHas(item)) player.town.selectedForgeFuel = ""
				}
			},
			tooltip() {
				if (player.town.selectedForgeFuel == "") return ""
				return "Burning time: "+getBurnTime(player.town.selectedForgeFuel)+"s"
			},
			unlocked: true,
		},
		304: {
			display() {
				return `<span style="color:#E5C316">Increase Forge Production [$${increaseForgeProductionCost()}]</span>`
			},
			style() {return {"min-height":"24px","min-width":"244px","border":"2px solid black","background":"rgba(0,0,0,0.5)","border-radius":"2px","font-size":"12px","color":"white","margin":"2px","box-shadow":"none","transform":"scale(1,1)"}},
			canClick() {
				return player.inv.money >= increaseForgeProductionCost()
			},
			onClick() {
				if (this.canClick()) {
					takeMoney(increaseForgeProductionCost())
					player.town.forge.production++
				}
			},
			unlocked() {return player.town.forge.production < 4},	
		},
		401: {
			display() {
				return `Start Sifting`
			},
			style() {return {"min-width": "180px", "min-height": "35px", "border-radius":"1px", "border":"4px solid black", "font-size": "16px", "background":"rgba(0,0,0,0.5)", "margin": "4px", "color":"white"}},
			canClick() {
				return !player.town.dirtSifterRunning && getDirtSifterTextInput() > 0 && player.inv.money >= getDirtSifterPrice() && playerHas("Dirt") >= getDirtSifterTextInput() && Object.keys(player.town.dirtSifterOutput).length == 0
			},
			onClick() {
				if (this.canClick()) {
					takeMoney(getDirtSifterPrice())
					takeFromInventory("Dirt",getDirtSifterTextInput())
					player.town.dirtSifterInput = getDirtSifterTextInput()
					player.town.dirtSifterTime = 0
					player.town.dirtSifterRunning = true
					player.town.dirtSifterTextInput = 1
				}
			},
		},
		402: {
			display() {
				return `Collect`
			},
			style() {return {"min-width": "120px", "min-height": "35px", "border-radius":"1px", "border":"4px solid black", "font-size": "16px", "background":"rgba(0,0,0,0.5)", "margin": "4px", "margin-top":"16px","color":"white"}},
			canClick() {
				return (Object.keys(player.town.dirtSifterOutput).length > 0 && !tmp.mod.playerInvIsFull)
			},
			onClick() {
				if (this.canClick()) {
					takeDirtSifterOutput()
				}
			},
			unlocked() {return Object.keys(player.town.dirtSifterOutput).length > 0}
		},
	},
	grid: {
		rows: 10,
		cols: 1,
		getStartData(id) {
			return null
		},
		getUnlocked(id) {
			return true
		},
		getCanClick(data, id) {
			let woodId = (id-101)/100
			let selectedWood = Object.keys(woods)[woodId]
			if (storeItemSelected in chooseWood) {
				if (chooseWood[storeItemSelected] == null) {
					if (storeItemSelected == 'pickaxe') chooseWood[storeItemSelected] = player.inv.pickHandle
					if (storeItemSelected == 'axe') chooseWood[storeItemSelected] = player.inv.axeHandle
					if (storeItemSelected == 'checkpoint') {
						chooseWood[storeItemSelected] = player.inv.checkpoint
						if (chooseWood[storeItemSelected] == null) chooseWood[storeItemSelected] = 'oak'
					}
				}
				return (chooseWood[storeItemSelected] != selectedWood)
			}
			return false
		},
		onClick(data, id) { 
			if (layers.town.grid.getCanClick(data,id)) storeSelectWood(id)
		},
		getDisplay(data, id) {
			return ""
		},
		getStyle(data, id) {
			return {
				"height":"20px","width":"20px","border":"2px solid #1F1F1F" ,"border-radius":"1px","box-shadow":"none","transform":"scale(1,1)"
			}
		},
	},
	bars: {
		forgeProduction1: forgeProductionBar(1),		
		forgeProduction2: forgeProductionBar(2),		
		forgeProduction3: forgeProductionBar(3),		
		forgeProduction4: forgeProductionBar(4),
		forgeFuelLeft: {
			direction: UP,
			width: 15,
			height: 180,
			progress() { 
				let fuel = forgeFuels[player.town.forge.fuel[0]]
				if (!fuel) return 0
				return 1-(player.town.forge.fuelTime/fuel)
			},
			baseStyle: {"background-color":"rgba(0,0,0,0.5)"},
			fillStyle: {"background-color": "#FFFFFF"},
			borderStyle: {"border-color": "black", "border-radius": "2px"},
		},
		forgeTemperature: {
			direction: UP,
			width: 25,
			height: 200,
			progress() { 
				return player.town.forge.temperature/2000
			},
			baseStyle: {"background-color":"rgba(0,0,0,0.5)"},
			fillStyle: {"background-color": "#FF0000"},
			borderStyle: {"border-color": "black", "border-radius": "2px"},
		},
		dirtSifterProgress: {
			direction: RIGHT,
			width: 200,
			height: 25,
			progress() { 
				return player.town.dirtSifterTime/getDirtSifterTime()
			},
			baseStyle: {"background-color":"rgba(0,0,0,0.5)"},
			fillStyle: {"background-color": itemColor("Dirt")},
			borderStyle: {"border-color": "black", "border-radius": "2px"},
			unlocked() {return player.town.dirtSifterRunning},
		}
	},
	update(diff) {
		player.town.oreRefineryUpdateTime += diff
		if (player.town.oreRefineryUpdateTime > 300) {
			player.town.oreRefineryUpdateTime = 0
			oreRefineryUpdate()
		}
		updateForge(diff)
		updateDirtSifter(diff)
	},
})