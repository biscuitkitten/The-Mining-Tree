function treeStyle(data,id) {
	var bgColor = "#006622"
	var borderColor = "#004C19"
	let treeType = woods[data[0]]
	if (treeType == woods.oak) {
		bgColor = "#805E47"
		borderColor = "#386633"
	}
	if (treeType == woods.ash) {
		bgColor = "#6F452C"
		borderColor = "#0F4C23"	
	}
	if (treeType == woods.pine) {
		bgColor = "#71462D"
		borderColor = "#3C612D"
	}
	if (treeType == woods.birch) {
		bgColor = "#D5D5D5"
		borderColor = "#9BBF8F"
	}
	if (treeType == woods.cinderbark) {
		bgColor = "#525152"
		borderColor = "#6B5850"
	}
	if (treeType == woods.silverwood) {
		bgColor = "#F0EED7"
		borderColor = "#3F007F"
	}
	if (treeType == woods.goldbranch) {
		bgColor = "#D8C877"
		borderColor = "#992316"
	}
	if (treeType == woods.witchwood) {
		bgColor = "#3C2131"
		borderColor = "#0F1419"
	}
	return {"cursor":(data[0]?"pointer":"default"),"height":"150px","width":"150px","margin":"15px","font-size":"12px","line-height":"1.5","background-color":bgColor,"border":`15px solid ${borderColor}`,
	"box-shadow":(data[0]?"":"none"),"transform":(data[0]?"":"scale(1,1)")}
}

function forestUpdate() {
	// Attempt to grow up to 10% trees
	// fails if choosing a space that already has a tree
	let ids = {}
	for (let i=1;i<=layers.forest.grid.cols();i++) {
		for (let j=1;j<=layers.forest.grid.rows();j++) {
			ids[i+j*100] = player.forest.grid[i+j*100]
		}		
	}
	let keys = Object.keys(ids)
	let updates = Math.floor(keys.length/10)
	//updates = Math.min(updates,5)
	for (let i=0;i<updates;i++) {
		let pickId = pickRandom(keys)
		let pickSpace = ids[pickId]
		// skip spaces with trees already
		if (pickSpace[0]) continue
		// place a tree in this space
		player.forest.grid[pickId] = spawnTree()
	}	
}

function allTreesPine() {
	// Return true if EVERY possible tree is a pine tree
	for (let i=1;i<=layers.forest.grid.cols();i++) {
		for (let j=1;j<=layers.forest.grid.rows();j++) {
			if(player.forest.grid[i+j*100][0] != "pine") return false
		}		
	}
	return true
}

function spawnTree() {
	// Create a tree for the forest

	let luckBonus = 1+tmp.mod.playerLuck
	
	let weightedList = [
		["oak",			1],
		["ash",			0.7],
		["pine",		0.6],
		["birch",		0.3],
		["cinderbark",	0.1*luckBonus],
		["silverwood",	0.05*luckBonus],
		["goldbranch",	0.01*luckBonus],
		["witchwood",	0.001*luckBonus],
	]
	
	var treeType = pickWeightedRandom(weightedList)
	var treeSize = 2
	if (treeType == "oak") treeSize = pickRandom([2,2,3,3,4])
	if (treeType == "ash") treeSize = pickRandom([2,2,3,3,4])
	if (treeType == "pine") treeSize = pickRandom([2,3,3,4,4,5])
	if (treeType == "birch") treeSize = pickRandom([2,2,3,3,4])
	if (treeType == "cinderbark") treeSize = pickRandom([2,3])
	if (treeType == "silverwood") treeSize = pickRandom([2,3])
	if (treeType == "goldbranch") treeSize = pickRandom([2,3])
	if (treeType == "witchwood") treeSize = pickRandom([2,2,3])
		
	return [treeType,treeSize]
}

function treeName(key) {
	return woods[key].name
}

function getTreeHealth(tree) {
	return tree[1]*4+((tree[1]-1)*0.1*tmp.mod.cutPower)
}

function getCuttingTreePercent() {
	if (!cuttingTree) return -1
	return Math.max((1-(cuttingTreeDamage/getTreeHealth(cuttingTree)))*100,0)
}

function isCuttingTreeDestroyed() {
	if (!cuttingTree) return false
	
	return cuttingTreeDamage >= getTreeHealth(cuttingTree)
}

// Sawmill
sawmillInputs = {
	"Oak Log": {
		input: "Oak Log",
		output: "Oak Plank",
	},
	"Oak Plank": {
		input: "Oak Plank",
		output: "Oak Stick",
	},
	"Ash Log": {
		input: "Ash Log",
		output: "Ash Plank",
	},
	"Ash Plank": {
		input: "Ash Plank",
		output: "Ash Stick",
	},
	"Pine Log": {
		input: "Pine Log",
		output: "Pine Plank",
	},
	"Pine Plank": {
		input: "Pine Plank",
		output: "Pine Stick",
	},
	"Birch Log": {
		input: "Birch Log",
		output: "Birch Plank",
	},
	"Birch Plank": {
		input: "Birch Plank",
		output: "Birch Stick",
	},
	"Cinderbark Log": {
		input: "Cinderbark Log",
		output: "Cinderbark Plank",
	},
	"Cinderbark Plank": {
		input: "Cinderbark Plank",
		output: "Cinderbark Stick",
	},
	"Silverwood Log": {
		input: "Silverwood Log",
		output: "Silverwood Plank",
	},
	"Silverwood Plank": {
		input: "Silverwood Plank",
		output: "Silverwood Stick",
	},
	"Goldbranch Log": {
		input: "Goldbranch Log",
		output: "Goldbranch Plank",
	},
	"Goldbranch Plank": {
		input: "Goldbranch Plank",
		output: "Goldbranch Stick",
	},
	"Witchwood Log": {
		input: "Witchwood Log",
		output: "Witchwood Plank",
	},
	"Witchwood Plank": {
		input: "Witchwood Plank",
		output: "Witchwood Stick",
	},
}
function usableSawmillInputs() {
	let sawmill = player.forest.sawmill
	if(sawmill.input[0]) return playerHas(sawmill.input[0]) ? [sawmill.input[0]] : []
	let keys = Object.keys(sawmillInputs)
	let inputs = []
    for (let i=0;i<keys.length;i++) {
		let input = keys[i]
		if (playerHas(input)) inputs.push(input)		
	}
	return inputs
}
function usableSawmillFuels() {
	let sawmill = player.forest.sawmill
	if(sawmill.fuel[0]) {
		if (sawmill.fuel[0] == "Wood") return woodFuelsHad()
		return playerHas(sawmill.fuel[0]) ? [sawmill.fuel[0]] : []
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
function updateSawmill(diff) {
	let sawmill = player.forest.sawmill
	if(sawmill.fuel[0]) {
		sawmill.fuelTime += diff
		if (sawmill.fuelTime >= getBurnTime(sawmill.fuel[0])) {
			sawmill.fuel[1]--
			sawmill.fuelTime = 0
		}
		if (sawmill.temperature < 1000) sawmill.temperature += diff*10
		if (sawmill.temperature > 1000) sawmill.temperature = 1000
	}
	else { // no fuel
		if (sawmill.temperature > 0) sawmill.temperature -= diff*10
		if (sawmill.temperature < 0) sawmill.temperature = 0
	}
	if(sawmill.input[0]) {
		if (sawmill.temperature >= 350) {
			if (sawmill.output[0] == null || sawmillInputs[sawmill.input[0]].output == sawmill.output[0]) {
				sawmill.cutTime += diff*getSawmillSpeed()*getSawmillSpeedBonus()
				if (sawmill.cutTime >= 10) {
					player.stats.totalSawmillCuts++
					sawmill.cutTime = 0
					let production = Math.min(sawmill.production,sawmill.input[1])
					sawmill.input[1] -= production
					if (sawmill.output[0] == null) sawmill.output[0] = sawmillInputs[sawmill.input[0]].output
					sawmill.output[1] += production*2 // Sawmill doubles outputs
				}
			}
		}
	}
	if (!sawmill.input[1]) sawmill.input[0] = null
	if (!sawmill.output[1]) sawmill.output[0] = null
	if (!sawmill.fuel[1]) sawmill.fuel[0] = null
}
function getSawmillSpeed() {
	return Math.max(Math.min(player.forest.sawmill.temperature,750)-350,0)/400
}
function increaseSawmillProductionCost() {
	let costs = [2500,25000,250000,Infinity]
	return costs[player.forest.sawmill.production-1]
}
function collectSawmillOutput() {
	let sawmill = player.forest.sawmill
	let item = sawmill.output[0]
	let takeAmt = Math.min(sawmill.output[1], tmp.mod.playerInvLeft)
	sawmill.output[1] -= takeAmt
	addToInventory(item,takeAmt)
}
function sawmillProductionBar(num) {
	return {
		direction: RIGHT,
		width: 240,
		height: 20,
		progress() { 
			let input = sawmillInputs[player.forest.sawmill.input[0]]
			if (!input) return 0
			return player.forest.sawmill.cutTime/10
		},
		baseStyle: {"background-color":"rgba(0,0,0,0.5)"},
		fillStyle: {"background-color": "#FFFFFF"},
		borderStyle: {"border-color": "black", "border-radius": "2px"},
		unlocked() {return player.forest.sawmill.production >= num},
	}
}

// Lumber Shop
lumberShopItems = {
	oakLog: {
		item: "Oak Log",
		value: [10,12,14,16,18,20],
		wood: "oak",
	},
	oakPlank: {
		item: "Oak Plank",
		value: [6,7,8,9,10,11,12],
		wood: "oak",
	},
	oakStick: {
		item: "Oak Stick",
		value: [4,5,6,7,8],
		wood: "oak",
	},
	ashLog: {
		item: "Ash Log",
		value: [15,17,19,21,23,25],
		wood: "ash",
	},
	ashPlank: {
		item: "Ash Plank",
		value: [9,10,11,12,13,14,15],
		wood: "ash",
	},
	ashStick: {
		item: "Ash Stick",
		value: [6,7,8,9,10],
		wood: "ash",
	},
	pineLog: {
		item: "Pine Log",
		value: [20,22,24,26,28,30],
		wood: "pine",
	},
	pinePlank: {
		item: "Pine Plank",
		value: [12,13,14,15,16,17,18],
		wood: "pine",
	},
	pineStick: {
		item: "Pine Stick",
		value: [8,9,10,11,12],
		wood: "pine",
	},
	birchLog: {
		item: "Birch Log",
		value: [25,27,29,31,33,35],
		wood: "birch",
	},
	birchPlank: {
		item: "Birch Plank",
		value: [15,16,17,18,19,20,21],
		wood: "birch",
	},
	birchStick: {
		item: "Birch Stick",
		value: [10,11,12,13,14],
		wood: "birch",
	},
	cinderbarkLog: {
		item: "Cinderbark Log",
		value: [30,35,40,45,50,55,60,65],
		wood: "cinderbark",
	},
	cinderbarkPlank: {
		item: "Cinderbark Plank",
		value: [28,30,32,34,36,38,40],
		wood: "cinderbark",
	},
	cinderbarkStick: {
		item: "Cinderbark Stick",
		value: [12,14,16,18,20,22,24,26],
		wood: "cinderbark",
	},
	silverwoodLog: {
		item: "Silverwood Log",
		value: [80,90,100,110,120],
		wood: "silverwood",
	},
	silverwoodPlank: {
		item: "Silverwood Plank",
		value: [48,52,56,60,64,68,72],
		wood: "silverwood",
	},
	silverwoodStick: {
		item: "Silverwood Stick",
		value: [32,36,40,44,48],
		wood: "silverwood",
	},
	goldbranchLog: {
		item: "Goldbranch Log",
		value: [110,120,130,140,150,160],
		wood: "goldbranch",
	},
	goldbranchPlank: {
		item: "Goldbranch Plank",
		value: [66,71,76,81,86,91,96],
		wood: "goldbranch",
	},
	goldbranchStick: {
		item: "Goldbranch Stick",
		value: [44,48,52,56,60,64],
		wood: "goldbranch",
	},
	witchwoodLog: {
		item: "Witchwood Log",
		value: [30,35,40,45,50],
		wood: "witchwood",
	},
	witchwoodPlank: {
		item: "Witchwood Plank",
		value: [18,21,24,27,30],
		wood: "witchwood",
	},
	witchwoodStick: {
		item: "Witchwood Stick",
		value: [12,14,16,18,20],
		wood: "witchwood",
	},
}
function getWoodPrice(wood) {
	if (!(wood.item in player.forest.woodPrices)) {
		player.forest.woodPrices[wood.item] = pickRandom(wood.value)
	}
	return player.forest.woodPrices[wood.item]
}
function getBuffedWoodPrice(wood) {
	return Math.floor(getWoodPrice(wood) * tmp.mod.woodSellValue)
}
function lumberShopSelectBtn(woodName) {
	let rItem = lumberShopItems[woodName]
	if (!rItem) {
		console.error("lumber item not found "+woodName)
		return {}
	}
	return {
		display() {return `<span style="color: ${itemColor(rItem.item)}">${rItem.item}</span>`},
		style() {return {"min-height":"50px","min-width":"250px","border":"2px solid black","background":"rgba(0,0,0,0.5)","border-radius":"4px","font-size":"18px","color":"white","margin":"2px"}},
		unlocked() {return player.stats.unlockedWoods.includes(rItem.wood)},
		canClick() {return true},
		onClick() {woodSelected = rItem},
		marked() {return playerHas(rItem.item)?"resources/check.png":false}
	}	
}
function lumberShopLeft() {
	display = []
    for (let i=301;i<=399;i++) {
		display.push(["clickable",i])
	}
	return display
}
function lumberShopRight() {
	let wood = woodSelected
	if (wood == null) {
		return []
	}
	let lumberValueMult = tmp.mod.woodSellValue
	return [
		["display-text", `<h1><span style="color: ${itemColor(wood.item)}">${wood.item}</span></h1>`,],
		["display-text", `Price per unit: <span style="color: #D8BD36"><h3>$${getBuffedWoodPrice(wood)}</h3></span> ($${Math.floor(wood.value[0] * lumberValueMult)}-$${Math.floor(wood.value[wood.value.length-1] * lumberValueMult)})`,],
		["display-text", `<h3>${playerHas(wood.item)}</h3> units in inventory`,],
		"blank",
		["clickables",[1,2]]
	]
}
// Lumber Shop market buttons
function sellOneWood() {
	let wood = woodSelected
	let price = getBuffedWoodPrice(wood)
	takeFromInventory(wood.item)
	addMoney(price)
}
function sellAllWood() {
	let wood = woodSelected
	let amt = playerHas(wood.item)
	let price = amt*getBuffedWoodPrice(wood)
	takeFromInventory(wood.item,amt)
	addMoney(price)
}

function lumberShopUpdate() {
	// Change all wood prices
	let keys = Object.keys(lumberShopItems)
    for (let i=0;i<keys.length;i++) {
		let wood = lumberShopItems[keys[i]]
		let min = wood.value[0]
		let max = wood.value[wood.value.length-1]
		let curr = getWoodPrice(wood)
		let index = wood.value.indexOf(curr)
		if (curr == min) {
			// wood is at minimum value
			let move = pickRandom([0,1,1])
			if (move == 1) player.forest.woodPrices[wood.item] = wood.value[index+1]
		}
		else if (curr == max) {
			// wood is at maximum value
			let move = pickRandom([0,1])
			if (move == 0) player.forest.woodPrices[wood.item] = wood.value[index-1]
		}
		else {
			// wood neither minimum nor maximum
			let move = pickRandom([0,1,2])
			if (move == 0) player.forest.woodPrices[wood.item] = wood.value[index-1]
			if (move == 2) player.forest.woodPrices[wood.item] = wood.value[index+1]
		}
	}
}



function carpentryTableLeft() {
	return [
		["display-text", `<h3>Select Tool</h2>`,],
		"blank",
		["clickable",401],
		["clickable",402],
		["clickable",403],
		"blank",
	]	
	
}
function carpentryTableMiddle() {
	let display =  [
		["display-text", `<h3>Select Material</h2>`,],
	]	
    for (let i=421;i<=440;i++) {
		display.push(["clickable",i])
	}
	return display
}
function carpentryTableRight() {
	return [
		["display-text", showCTRTop(),],
		"blank",
		["display-text", getCarpentryTableEffectsStr(),],
		"blank",
		["clickable",showCTRBtn()],
	]	
}
function showCTRTop() {
	return carpentryToolSelected ? `<h3>View and Confirm</h2>` : ""
}
function showCTRBtn() {
	return (carpentryToolSelected && carpentryWoodSelected) ? 499 : ""
}

carpentryTableEffectsStrings = {
	"pickaxe": {
		"oak": ["Nothing"],
		"ash": ["+20% Forge Speed"],
		"pine": ["+1 Move Speed"],
		"birch": ["+10% Luck"],
		"cinderbark": ["+20% Autosmelt Chance"],
		"silverwood": ["+15% Double Drop Chance"],
		"goldbranch": ["+20% Mining Speed"],
		"witchwood": ["+12% Mining Speed","+20% Pump Speed"],
	},
	"axe": {
		"oak": ["Nothing"],
		"ash": ["+20% Sawmill Speed"],
		"pine": ["+1 Move Speed"],
		"birch": ["+10% Luck"],
		"cinderbark": ["+20% Autosaw Chance"],
		"silverwood": ["+15% Log Double Drop Chance"],
		"goldbranch": ["+20% Cutting Speed"],
		"witchwood": ["+12% Cutting Speed","+50% Lumber Value"],
	},
}
function getCarpentryTableChangeCost() {
	return [30,16] // pick/axe, checkpoint
}
function getCarpentryTableEffectsStr() {
	if (!carpentryToolSelected) return ""
	
	let currentWood = null
	if (carpentryToolSelected == "pickaxe") currentWood = player.inv.pickHandle
	if (carpentryToolSelected == "axe") currentWood = player.inv.axeHandle
	if (carpentryToolSelected == "checkpoint") currentWood = player.inv.checkpoint

	let base = ((carpentryToolSelected == "checkpoint") ? "frame" : "handle")
	
	let info = `Current ${carpentryToolSelected}: <span style="color: ${itemColor(woods[currentWood].name)}">${woods[currentWood].name}</span> ${base}`
	
	if (carpentryToolSelected != "checkpoint") {
		let effectsStrs = carpentryTableEffectsStrings[carpentryToolSelected][currentWood]
		for (const str of effectsStrs) {
			info += `<br> - ${str}`
		}
	}
	
	if (carpentryWoodSelected && (carpentryWoodSelected != currentWood)) {
		info += `<br>Modified ${carpentryToolSelected}: <span style="color: ${itemColor(woods[carpentryWoodSelected].name)}">${woods[carpentryWoodSelected].name}</span> ${base}`
		if (carpentryToolSelected != "checkpoint") {
			let effectsStrs = carpentryTableEffectsStrings[carpentryToolSelected][carpentryWoodSelected]
			for (const str of effectsStrs) {
				info += `<br> - ${str}`
			}
		}

		let isPlanks = (carpentryToolSelected == "Checkpoint")
		let item = `${woods[carpentryWoodSelected].name} ${isPlanks ? "Plank" : "Stick"}`
		info += `<br><br>Modify cost: $${carpentryTableCost(item)}<br>`
	}
	
	
	return info
}
function carpentryTableToolBtn(tool) {
	//"box-shadow": (carpentryToolSelected == tool.toLowerCase()) ? "0 0 10px #FFFF77" : ""
	return {
		display() {return `${tool}`},
		style() {return {"min-height":"35px","min-width":"180px","border":(carpentryToolSelected == tool.toLowerCase()) ? "2px solid #777700" : "2px solid black","background":"rgba(0,0,0,0.5)","border-radius":"4px","font-size":"16px","color": this.canClick() ? "white" : "#444444","margin":"2px"}},
		unlocked() {
			if (tool == "Pickaxe" || tool == "Axe") return true
			if (tool == "Checkpoint") return player.inv.checkpoint
		},
		canClick() {
			toolUnlocked = false
			if (tool == "Pickaxe" || tool == "Axe") return true
			if (tool == "Checkpoint") return checkpointInInventory()
		},
		onClick() {carpentryToolSelected = tool.toLowerCase()},
		tooltip() {
			if (tool == "Checkpoint") return checkpointInInventory() ? "" : "<span style='color:red'>Not in inventory!</span>"
		}
	}	
}
function carpentryTableMaterialBtn(woodType) {
	return {
		display() {
			let isPlanks = (carpentryToolSelected == "Checkpoint")
			let changeCost = getCarpentryTableChangeCost()[isPlanks ? 1 : 0]
			let has = Math.min(playerHas(`${woods[woodType].name} ${isPlanks ? "Plank" : "Stick"}`),changeCost)
			return `<span style="color: ${itemColor(woods[woodType].name)}">${woods[woodType].name} [${has}/${changeCost} ${isPlanks ? "Planks" : "Sticks"}]</span>`
		},
		style() {return {"min-height":"30px","min-width":"200px","border":(carpentryWoodSelected == woodType) ? "2px solid #777700" : "2px solid black","background":"rgba(0,0,0,0.5)","border-radius":"4px","font-size":"14px","margin":"2px"}},
		unlocked() {return player.stats.unlockedWoods.includes(woodType)},
		canClick() {
			return this.unlocked()
			/*let isPlanks = (carpentryToolSelected == "Checkpoint")
			let changeCost = getCarpentryTableChangeCost()[isPlanks ? 1 : 0]
			let has = playerHas(`${woods[woodType].name} ${isPlanks ? "Plank" : "Stick"}`)
			return has >= changeCost*/		
		},
		onClick() {carpentryWoodSelected = woodType},
	}		
}

function carpentryTableCost(item) {
	// Upgrading to certain sticks or planks has different costs
	// depending on how good the wood is
	
	if (item == "Oak Stick")		return 1000
	if (item == "Ash Stick") 		return 2000
	if (item == "Pine Stick") 		return 4000
	if (item == "Birch Stick") 		return 6000
	if (item == "Cinderbark Stick") return 8000
	if (item == "Silverwood Stick") return 10000
	if (item == "Goldbranch Stick") return 12000
	if (item == "Witchwood Stick") 	return 14000
	
	if (item == "Oak Plank")		return 0000
	if (item == "Ash Plank") 		return 1000
	if (item == "Pine Plank") 		return 2000
	if (item == "Birch Plank") 		return 3000
	if (item == "Cinderbark Plank") return 6000
	if (item == "Silverwood Plank") return 8000
	if (item == "Goldbranch Plank") return 10000
	if (item == "Witchwood Plank") 	return 10000
	
	return 0
}

function carpentryTableCanAfford() {
	if (!carpentryToolSelected || !carpentryWoodSelected) return false
	let currentWood = null
	if (carpentryToolSelected == "pickaxe") currentWood = player.inv.pickHandle
	if (carpentryToolSelected == "axe") currentWood = player.inv.axeHandle
	if (carpentryToolSelected == "checkpoint") currentWood = player.inv.checkpoint
	if (currentWood == carpentryWoodSelected) return false
	let isPlanks = (carpentryToolSelected == "checkpoint")
	let materialCost = getCarpentryTableChangeCost()[isPlanks ? 1 : 0]
	let woodName = woods[carpentryWoodSelected].name
	let item = `${woodName} ${isPlanks ? "Plank" : "Stick"}`
	return player.inv.money >= carpentryTableCost(item) && playerHas(item) >= materialCost
}
function carpentryTableChangeTool() {
	if (!carpentryToolSelected || !carpentryWoodSelected) return
	let isPlanks = (carpentryToolSelected == "Checkpoint")
	let materialCost = getCarpentryTableChangeCost()[isPlanks ? 1 : 0]
	let woodName = woods[carpentryWoodSelected].name
	let item = `${woodName} ${isPlanks ? "Plank" : "Stick"}`
	
	takeMoney(carpentryTableCost(item))
	takeFromInventory(item,materialCost)
	
	if (carpentryToolSelected == "pickaxe") player.inv.pickHandle = carpentryWoodSelected
	if (carpentryToolSelected == "axe") player.inv.axeHandle = carpentryWoodSelected
	if (carpentryToolSelected == "checkpoint") player.inv.checkpoint = carpentryWoodSelected
	
}

// do not save these settings
var woodSelected = null
var cuttingTree = null
var cuttingTime = 0
var keepCuttingTree = false
var carpentryToolSelected = null
var carpentryWoodSelected = null
addLayer("forest", {
    name: "forest",
    symbol: "🌲",
    position: 2,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
		treeExhaustion: 0,
		needInitTrees: true,
		forestUpdateTime: 0,
		sawmill: {
			input: [null,0],
			output: [null,0],
			fuel: [null,0],
			cutTime: 0,
			fuelTime: 0,
			production: 1,
			temperature: 0,
		},
		// sawmill dropdown
		selectedSawmillInput: "",
		selectedSawmillFuel: "",
		// lumber shop
		lumberShopUpdateTime: 0,
		woodPrices: {},
    }},
    color: "#14662F",
    type: "none",
    row: 0,
    layerShown(){return true},
	tooltip() {return "Forest"},
	tooltipLocked() {return "Currently underground"},
	layerShown() {return !player.mine.inMine},
	tabFormat: {
		"Forest": {
			content: [
				["display-text", "<h1>Forest</h1>",],
				"blank",
				["display-text", function() {return `Trees take longer to cut the more time you spend cutting.<br>If it gets too slow, take a break and do something else!<br>Currently dividing cutting speed by ${format(tmp.mod.cuttingExhPenalty)}`}],
				"blank",
				"grid",
			],
		},
		"Sawmill": {
			content: [
				["display-text", "<h1>Sawmill</h1>",],
				["display-text", "This sawmill can turn logs into planks and planks into sticks.",],
				"blank",
				["row",[
					["column",[
						["display-text", "<h3>Input</h3>",],
						"blank",
						["display-text", function() {
							let item = player.forest.sawmill.input[0]
							let amt = player.forest.sawmill.input[1]
							if (!item || amt == 0) return "Empty"
							return `<span style="color: ${itemColor(item)}">${amt} ${item}</span><br>`
						}],
						"blank",
						["drop-down",function() {return ["selectedSawmillInput",usableSawmillInputs()]}],
						["blank","2px"],
						["clickable",201]
					],{"height":"200px","width":"200px"}],
					["blank",["40px","20px"]],
					["column",[
						["bar","sawmillProduction1"],
						["bar","sawmillProduction2"],
						["bar","sawmillProduction3"],
						["bar","sawmillProduction4"],
						["clickable",204]
					]],
					["blank",["40px","20px"]],
					["column",[
						["display-text", "<h3>Output</h3>",],
						"blank",
						["display-text", function() {
							let item = player.forest.sawmill.output[0]
							let amt = player.forest.sawmill.output[1]
							if (!item || amt == 0) return "Empty"
							return `<span style="color: ${itemColor(item)}">${amt} ${item}</span><br>`
						}],
						"blank",
						["clickable",202]
					],{"height":"200px","width":"200px"}],
					
				]],
				["row",[
					["column",[
						["display-text", "<h3>Sawmill Speed</h3>",],
						["blank","4px"],
						["bar","sawmillSpeed"],
					],{"width":"280px"}],
					["column",[
						["display-text", "<h3>Fuel</h3>",],
						"blank",
						["display-text", function() {
							let item = player.forest.sawmill.fuel[0]
							let amt = player.forest.sawmill.fuel[1]
							if (!item) return "Empty"
							return `<span style="color: ${itemColor(item)}">${amt} ${item}</span><br>`
						}],
						"blank",
						["drop-down",function() {return ["selectedSawmillFuel",usableSawmillFuels()]}],
						["blank","2px"],
						["clickable",203]
					],{"width":"220px"}],
					["bar","sawmillFuelLeft"],
					["blank",["40px","20px"]],
					["column",[
						["bar","sawmillTemperature"],
						["blank","4px"],
						["display-text", function() {return `<span style="color: #ff0000">${Math.round(player.forest.sawmill.temperature)} C</span><br>`},],
					],{"width":"60px"}],
					["blank",["160px","80px"]],
				]],
			],
		},
		"Lumber Shop": {
			content: [
				["display-text", "<h1>Lumber Shop</h1>",],
				"blank",
				["row",[
					["column",function() {return lumberShopLeft()}],
					"blank",
					["column",function() {return lumberShopRight()},{"width":"400px","height":"400px"}],
				],{"height":"600px","justify-content":"left"}],
			],
		},
		"Carpentry Table": {
			content: [
				["display-text", "<h1>Carpentry Table</h1>",],
				["display-text", "Change the wood type on your tools here.",],
				["blank","20px"],
				["row",[
					["column",function() {return carpentryTableLeft()},{"width":"300px","height":"600px"}],
					"blank",
					["column",function() {return carpentryTableMiddle()},{"width":"300px","height":"600px"}],
					"blank",
					["column",function() {return carpentryTableRight()},{"width":"300px","height":"600px"}],
				],{"height":"600px","justify-content":"left"}],
			],
		},
	},
	clickables: {
		// Sawmill
		201: {
			display() {
				return "Add Input"
			},
			style() {return forgeClickable()},
			canClick() {
				return player.forest.selectedSawmillInput != "" && playerHas(player.forest.selectedSawmillInput)
			},
			onClick() {
				if (this.canClick()) {
					let item = player.forest.selectedSawmillInput
					takeFromInventory(item)
					player.forest.sawmill.input[0] = item
					player.forest.sawmill.input[1]++
					if (!playerHas(item)) player.forest.selectedSawmillInput = ""
				}
			},
			tooltip() {
				if (player.forest.selectedSawmillInput == "") return ""
				return "Temperature must be at least 350 C to cut wood"
			},
			unlocked: true,
		},
		202: {
			display() {
				return "Collect Output"
			},
			style() {return forgeClickable()},
			canClick() {
				return !tmp.mod.playerInvIsFull && player.forest.sawmill.output[1] > 0
			},
			onClick() {
				if (this.canClick()) collectSawmillOutput()
			},
			tooltip() {
				return tmp.mod.playerInvIsFull ? `<span style="color:#FF7F7F">No inventory space</span>` : ""
			},
			unlocked: true,	
		},
		203: {
			display() {
				return "Add Fuel"
			},
			style() {return forgeClickable()},
			canClick() {
				return player.forest.selectedSawmillFuel != "" && playerHas(player.forest.selectedSawmillFuel)
			},
			onClick() {
				if (this.canClick()) {
					let item = player.forest.selectedSawmillFuel
					takeFromInventory(item)
					player.forest.sawmill.fuel[0] = (woodFuels.indexOf(item) > -1 ? "Wood" : item)
					player.forest.sawmill.fuel[1]++
					if (!playerHas(item)) player.forest.selectedSawmillFuel = ""
				}
			},
			tooltip() {
				if (player.forest.selectedSawmillFuel == "") return ""
				return "Burning time: "+getBurnTime(player.forest.selectedSawmillFuel)+"s"
			},
			unlocked: true,
		},
		204: {
			display() {
				return `<span style="color:#E5C316">Increase Sawmill Production [$${increaseSawmillProductionCost()}]</span>`
			},
			style() {return {"min-height":"24px","min-width":"244px","border":"2px solid black","background":"rgba(0,0,0,0.5)","border-radius":"2px","font-size":"12px","color":"white","margin":"2px","box-shadow":"none","transform":"scale(1,1)"}},
			canClick() {
				return player.inv.money >= increaseSawmillProductionCost()
			},
			onClick() {
				if (this.canClick()) {
					takeMoney(increaseSawmillProductionCost())
					player.forest.sawmill.production++
				}
			},
			unlocked() {return player.forest.sawmill.production < 4},	
		},
		// Lumber Shop
		11: {
			display() {
				return `Sell 1 [$${getBuffedWoodPrice(woodSelected)}]`
			},
			style() {return oreRefineryBtnStyle(this.canClick())},
			canClick() {
				return woodSelected && playerHas(woodSelected.item)
			},
			onClick() {
				if (this.canClick()) sellOneWood()
			},
			unlocked: true,	
		},
		21: {
			display() {
				return `Sell All [$${playerHas(woodSelected.item)*getBuffedWoodPrice(woodSelected)}]`
			},
			style() {return oreRefineryBtnStyle(this.canClick())},
			canClick() {
				return woodSelected && (playerHas(woodSelected.item) > 1)
			},
			onClick() {
				if (this.canClick()) sellAllWood()
			},
			unlocked: true,	
		},
		301: lumberShopSelectBtn("oakLog"),
		302: lumberShopSelectBtn("oakPlank"),
		303: lumberShopSelectBtn("oakStick"),
		304: lumberShopSelectBtn("ashLog"),
		305: lumberShopSelectBtn("ashPlank"),
		306: lumberShopSelectBtn("ashStick"),
		307: lumberShopSelectBtn("pineLog"),
		308: lumberShopSelectBtn("pinePlank"),
		309: lumberShopSelectBtn("pineStick"),
		310: lumberShopSelectBtn("birchLog"),
		311: lumberShopSelectBtn("birchPlank"),
		312: lumberShopSelectBtn("birchStick"),
		313: lumberShopSelectBtn("cinderbarkLog"),
		314: lumberShopSelectBtn("cinderbarkPlank"),
		315: lumberShopSelectBtn("cinderbarkStick"),
		316: lumberShopSelectBtn("silverwoodLog"),
		317: lumberShopSelectBtn("silverwoodPlank"),
		318: lumberShopSelectBtn("silverwoodStick"),
		319: lumberShopSelectBtn("goldbranchLog"),
		320: lumberShopSelectBtn("goldbranchPlank"),
		321: lumberShopSelectBtn("goldbranchStick"),
		322: lumberShopSelectBtn("witchwoodLog"),
		323: lumberShopSelectBtn("witchwoodPlank"),
		324: lumberShopSelectBtn("witchwoodStick"),
		
		401: carpentryTableToolBtn("Pickaxe"),
		402: carpentryTableToolBtn("Axe"),
		403: carpentryTableToolBtn("Checkpoint"),
		
		421: carpentryTableMaterialBtn("oak"),
		422: carpentryTableMaterialBtn("ash"),
		423: carpentryTableMaterialBtn("pine"),
		424: carpentryTableMaterialBtn("birch"),
		425: carpentryTableMaterialBtn("cinderbark"),
		426: carpentryTableMaterialBtn("silverwood"),
		427: carpentryTableMaterialBtn("goldbranch"),
		428: carpentryTableMaterialBtn("witchwood"),
		
		499: {
			display() {
				return "Change Wood"
			},
			style() {return {"min-height":"30px","min-width":"200px","border":"2px solid black","background":"rgba(0,0,0,0.5)","border-radius":"2px","font-size":"14px","margin":"2px","color": this.canClick() ? "white" : "#444444" }},
			canClick() {
				return carpentryTableCanAfford()
			},
			onClick() {
				carpentryTableChangeTool()
			},
		},
		
	},
	bars: {
		sawmillProduction1: sawmillProductionBar(1),		
		sawmillProduction2: sawmillProductionBar(2),		
		sawmillProduction3: sawmillProductionBar(3),		
		sawmillProduction4: sawmillProductionBar(4),
		sawmillFuelLeft: {
			direction: UP,
			width: 15,
			height: 180,
			progress() { 
				let fuel = forgeFuels[player.forest.sawmill.fuel[0]]
				if (!fuel) return 0
				return 1-(player.forest.sawmill.fuelTime/fuel)
			},
			baseStyle: {"background-color":"rgba(0,0,0,0.5)"},
			fillStyle: {"background-color": "#FFFFFF"},
			borderStyle: {"border-color": "black", "border-radius": "2px"},
		},
		sawmillTemperature: {
			direction: UP,
			width: 25,
			height: 200,
			progress() { 
				return player.forest.sawmill.temperature/1000
			},
			baseStyle: {"background-color":"rgba(0,0,0,0.5)"},
			fillStyle: {"background-color": "#FF0000"},
			borderStyle: {"border-color": "black", "border-radius": "2px"},
		},
		sawmillSpeed: {
			direction: RIGHT,
			width: 240,
			height: 20,
			progress() { 
				return getSawmillSpeed()
			},
			baseStyle: {"background-color":"rgba(0,0,0,0.5)"},
			fillStyle: {"background-color": "#FF0000"},
			borderStyle: {"border-color": "black", "border-radius": "2px"},
			display() {
				return Math.floor(getSawmillSpeed()*100)+"%"
			}
		},
	},
	grid: {
		rows() {return 10},
		maxRows: 50,
		cols() {return 8},
		maxCols: 20,
		getStartData(id) {
			return [null,0,1,1]
		},
		getUnlocked(id) {
			return true
		},
		getCanClick(data, id) {
			return data[0] // cannot click a null space
		},
		onHold(data, id) { 
			keepCuttingTree = true
			if (!cuttingTree) {
				cuttingTree = data
				cuttingTreeDamage = 0
			}
		},
		getDisplay(data, id) {
			player.time*0 // force update
			if (!data) return ""
			//if (data[0] == null) return "<h3>Empty Space</h3><br><br>A tree may grow here!"
			if (data[0] == null) return ""
			// <br>Size ${data[1]}<br>${Math.floor(100*data[2]/data[3])}%
			var percentString = ""
			if (cuttingTree && cuttingTree == data) {
				let percent = getCuttingTreePercent()
				if (percent >= 0 && percent < 100) percentString = `<br>${format(percent,0)}%`
			}
			return `<h3>${treeName(data[0])} Tree</h3><br>Size ${data[1]}${percentString}`
		},
		getStyle(data, id) {
			player.time*0 // force update
			if (!data) return ""
			return treeStyle(data,id)
		},
		getTooltip(data, id) {
			if (!data) return ""
			if (data[0] == null) return "A tree may grow in this space!"
			return ""
		},
	},
	update(diff) {
		if (!keepCuttingTree) {
			cuttingTree = null
		}
		if (cuttingTree) {
			keepCuttingTree = false
						
			cuttingTreeDamage += diff*tmp.mod.cutPower/tmp.mod.cuttingExhPenalty
			
			if(isCuttingTreeDestroyed()) {
				player.stats.totalTreesCut++
				player.forest.treeExhaustion += cuttingTree[1]/2
				let treeType = cuttingTree[0]
				if (player.stats.unlockedWoods.indexOf(treeType) == -1) player.stats.unlockedWoods.push(treeType)
					
				let logName = woods[treeType].name+" Log"
				let treeSize = cuttingTree[1]
				for (let i=0;i<treeSize;i++) {
					
					let itemName = logName
					let itemAmt = 1
					
					if (tmp.mod.autosaw && (Math.random() < tmp.mod.autosaw)) {
						if (sawmillInputs[itemName]) {
							itemName = sawmillInputs[itemName].output
							itemAmt *= 2 // log to plank doubles
						}
					}
					if (tmp.mod.doubleDropWood && (Math.random() < tmp.mod.doubleDropWood)) {
						// Double drop
						itemAmt *= 2
					}
					addToInventory(itemName,itemAmt)
					
				}
				
				cuttingTree[0] = null
				cuttingTree[1] = 0				
			}
		}
		
		if (player.forest.treeExhaustion < 0.01) player.forest.treeExhaustion = 0
		else if (player.forest.treeExhaustion > 0) {
			player.forest.treeExhaustion *= (0.99**diff)
		}
		
		updateSawmill(diff)
		player.forest.lumberShopUpdateTime += diff
		if (player.forest.lumberShopUpdateTime > 300) {
			player.forest.lumberShopUpdateTime = 0
			lumberShopUpdate()
		}
		var growSpeedBonus = 1.0
		if (hasAchievement("badges",25)) growSpeedBonus *= 1.25
		player.forest.forestUpdateTime += diff*growSpeedBonus
		if (player.forest.forestUpdateTime > 30) {
			player.forest.forestUpdateTime = 0
			forestUpdate()
		}
		// When first starting the game, generate the forest
		if (player.forest.needInitTrees) {
			player.forest.needInitTrees = false
			for (let i=0;i<20;i++) {
				forestUpdate()
			}
		}
	},
})

// wood definitions
woods = {
	oak: {
		name: "Oak",
	},
	ash: {
		name: "Ash",
	},
	pine: {
		name: "Pine",
	},
	birch: {
		name: "Birch",
	},
	cinderbark: {
		name: "Cinderbark",
	},
	silverwood: {
		name: "Silverwood",
	},
	goldbranch: {
		name: "Goldbranch",
	},
	witchwood: {
		name: "Witchwood",
	},
}