function pickWeightedRandom(weightedList) {
	let totalWeight = 0
    for (let i=0;i<weightedList.length;i++) {
		if (weightedList[i][1] < 0) weightedList[i][1] = 0
		totalWeight += weightedList[i][1]
	}
    for (let i=0;i<weightedList.length;i++) {
      if (Math.random() * totalWeight < weightedList[i][1]) {
        return weightedList[i][0]
      }
      else {
        totalWeight -= weightedList[i][1]
      }
    }
	
}

function getMineName(id) {
	if (id == 1) return "Old Mine"
	return "??????"
}
function mineFloorColor(id,depth) {
	if (id == 1) {
		if (depth == 70) return "#000000"
		if (depth > 50) return "#511D1D"
		if (depth == 50) return "#3F3C3F"
		if (depth < 11) return "#492D1D"
		return "#606166"
	}
	return "#FF00FF"
}

// Functions saved to tmp (no arguments and no modifications)
// Recommended to use the tmp.mod variables for these
function getPlayerBlock() {
	if (!player.mine.inMine) return null
	return getBlock(player.mine.inMine,player.mine.depth,player.mine.playerX,player.mine.playerY)
}
function getPlayerNearLava() {
	// player is on a hole above lava or on a block with lava next to it
	if (!tmp.mod.playerBlock) return false
	let mine = player.mine.inMine
	let depth = player.mine.depth
	let x = player.mine.playerX
	let y = player.mine.playerY
	if (getBlockName(mine,depth,x+1,y) == "Lava") return true
	if (getBlockName(mine,depth,x-1,y) == "Lava") return true
	if (getBlockName(mine,depth,x,y+1) == "Lava") return true
	if (getBlockName(mine,depth,x,y-1) == "Lava") return true
	if (tmp.mod.playerBlock.hole) {
		if (getBlockName(mine,depth+1,x,y) == "Lava") return true
	}
	return false
}
function getMineBound() {
	// only bedrock generates past this point
	// if (player.mine.inMine) == 1
	return 200
}

function allMinesBlockAmt() {
	var amt = 0
	for (const id in player.mine.map) {	
		amt += mineBlockAmt(id)
	}
	return amt
}

function mineBlockAmt(id) {
	var amt = 0
	for (const depth in player.mine.map[id]) {	
		amt += mineDepthBlockAmt(id,depth)
	}
	return amt
}

function mineDepthBlockAmt(id,depth) {
	var amt = 0
	for (const x in player.mine.map[id][depth]) {
		for (const y in player.mine.map[id][depth][x]) {
			amt++
		}
	}
	return amt
}

function getRNGBlockType(mine,depth) {
	// Determine what block to generate given mine and depth
	let luckBonus = 1+tmp.mod.playerLuck // TODO should this affect more ores?
	if (mine == 1) {
		// Old Mine
		if (depth <= 50) {
			let dirtWeight = 10
			// decided against new ores in the old mine
			//let clayWeight = (1-((depth**0.5)/(12**0.5)))*1.4062
			let coalWeight = 0.5
			if (depth > 10) coalWeight -= (depth-10)/10
			let copperWeight = 0.2+depth/20
			if (depth > 7) copperWeight -= (depth-7)/5
			let stoneWeight = (depth-1)/2
			stoneWeight = Math.min(stoneWeight,10)
			dirtWeight -= stoneWeight
			let ironWeight = (depth-1)/20
			if (ironWeight > 1) ironWeight = ((ironWeight/1) ** (1/3))*1
			if (depth > 20) ironWeight -= (depth-20)/10
			let silverWeight = (depth-4)/10
			if (silverWeight > 0.5) silverWeight = ((silverWeight/0.5) ** (1/3))*0.5
			silverWeight = Math.min(silverWeight,1)
			let quartzWeight = luckBonus*(5-Math.abs(6-depth))/50
			if (depth > 7) quartzWeight = luckBonus*Math.max(quartzWeight,0.1/(depth**0.25))
			let sulfurWeight = Math.min((depth-6)/10,1)
			if (depth > 20) sulfurWeight = Math.max(sulfurWeight-(depth-20)/5,0.25)
			let emeraldWeight = Math.min((depth-7)/20,0.5)
			let rubyWeight = Math.min((depth-9)/30,0.45)
			let sapphireWeight = Math.min((depth-19)/30,0.4)
			let goldWeight = luckBonus*Math.min((depth-29)/40,0.4)
			let amethystWeight = luckBonus*Math.min((depth-25)/50,0.3)
			let diamondWeight = luckBonus*Math.min((depth-37)/50,0.2)
			
			let weightedList = [
				[blocks.dirt,dirtWeight],
				//[blocks.clay,clayWeight],
				[blocks.coal,coalWeight],
				[blocks.copper,copperWeight],
				[blocks.stone,stoneWeight],
				[blocks.iron,ironWeight],
				[blocks.silver,silverWeight],
				[blocks.quartz,quartzWeight],
				[blocks.sulfur,sulfurWeight],
				[blocks.emerald,emeraldWeight],
				[blocks.ruby,rubyWeight],
				[blocks.sapphire,sapphireWeight],
				[blocks.gold,goldWeight],
				[blocks.amethyst,amethystWeight],
				[blocks.diamond,diamondWeight],
			]
			
			//console.log(weightedList)
			
			return pickWeightedRandom(weightedList)		
		}
		else { // below layer 50 - in hell
			let stoneWeight = 0.2/luckBonus
			let quartzWeight = luckBonus*0.1
			let goldWeight = luckBonus*0.1
			let diamondWeight = luckBonus*0.1
			let hellstoneWeight = 10
			let ignisWeight = 1.5
			let promethiumWeight = luckBonus*((depth-50+20)/120)
			let mithrilWeight = luckBonus*((depth-50+20)/200)
			
			let weightedList = [
				[blocks.stone,stoneWeight],
				[blocks.quartz,quartzWeight],
				[blocks.gold,goldWeight],
				[blocks.diamond,diamondWeight],
				[blocks.hellstone,hellstoneWeight],
				[blocks.ignis,ignisWeight],
				[blocks.promethium,promethiumWeight],
				[blocks.mithril,mithrilWeight],
			]
			
			//console.log(weightedList)
			
			return pickWeightedRandom(weightedList)	
		}
	}
	
	// Return dirt if nothing else can generate
	console.error("no block picked for mine "+mine+" depth "+depth)
	return blocks.dirt
}

function blockExists(id,depth,x,y) {
	return player.mine.map[id] && player.mine.map[id][depth] && player.mine.map[id][depth][x] && player.mine.map[id][depth][x][y]
}
function generateBlock(id,depth,x,y) {
	// generate block if not exists
	if (blockExists(id,depth,x,y)) return // already exists
	
	// Determine what block to generate
	let type = getRNGBlockType(id,depth)
	// Mine bounds
	if (Math.abs(x) > tmp.mod.mineBound || Math.abs(y) > tmp.mod.mineBound) type = blocks.bedrock
	
	setBlock(id,depth,x,y,type)
}
function setBlock(id,depth,x,y,aBlock) {
	// set block in mine "id" at depth
	if (!(depth in player.mine.map[id])) {
		player.mine.map[id][depth] = {}
	}	
	if (!(x in player.mine.map[id][depth])) {
		player.mine.map[id][depth][x] = {}
	}	
	let newBlock = makeBlock(aBlock)
	player.mine.map[id][depth][x][y] = newBlock
}
function revealBlock(id,depth,x,y) {
	if (!blockExists(id,depth,x,y)) return
	player.mine.map[id][depth][x][y].revealed = true
}

function createHole(mine,depth,x,y) {
	player.mine.map[mine][depth][x][y].hole = true
	// setup hole landing block
	let downBlock = getBlock(mine,depth+1,x,y)
	if (downBlock && (downBlock.block.liquid || downBlock.occupied)) {
		player.mine.map[mine][depth+1][x][y].spotlight = true
		return
	}
	playerBreakUpdate(mine,depth+1,x,y,"in")	
}
function createCrack(mine,depth,x,y) {
	player.mine.map[mine][depth][x][y].crack = true	
}
function explodeCrack(mine,depth,x,y) {
	// Blast through a bedrock crack into hell
	if (!player.mine.map[mine][depth][x][y].crack) return
	player.mine.map[mine][depth][x][y].crack = false
	createHole(mine,depth,x,y)	
	if (!hasAchievement("badges",24)) unlockAchievement("badges",24)
}
function checkForDownpoint(mine,depth,x,y) {
	let luckBonus = 1+tmp.mod.playerLuck
	if (mine == 1) {
		// Old Mine
		if (depth == 70) return
		let rarity = (50+depth)/luckBonus
		let rng = Math.random()
		if (rng < 1/rarity) {
			if (depth == 50) {
				createCrack(mine,depth,x,y)
			}
			else {
				createHole(mine,depth,x,y)
			}
		}
	}
}


function depthHardness(mineId,depth) {
	if (mineId == 1) return 4//0.4*(9+depth)
		
	return 4
}

function getBlock(id,depth,x,y) {
	if (!blockExists(id,depth,x,y)) return null
	return player.mine.map[id][depth][x][y]
}
function getBlockName(id,depth,x,y) {
	if (!blockExists(id,depth,x,y)) return null
	return player.mine.map[id][depth][x][y].block.name
}

function playerBreakUpdate(id,depth,x,y,dir) {
	// player has broken at x,y; update
	// replace the block with air since it is broken
	setBlock(id,depth,x,y,blocks.air)

	if (dir) {
		// "in" -- block broken from one layer up (hole)
		if (dir == "in") {
			player.mine.map[id][depth][x][y].spotlight = true

		}
		if (dir != "in") {
			checkForDownpoint(id,depth,x,y)

		}
		if (dir != "explode") {
			// TODO potentially find a way to make explosions able to reveal lakes
			// without causing MASSIVE BUGS regarding there not being a direction
			// (which breaks the lake spawning algorithm)
			checkForLake(id,depth,x,y,dir)
			//console.log(checkForLake(id,depth,x,y,dir))
		}
	}
	
	for (let i = x-1; i <= x+1; i++) {
		for (let j = y-1; j <= y+1; j++) {
			if (i != x && j != y) continue
			generateBlock(id,depth,i,j)
			revealBlock(id,depth,i,j)
		} 
	}
	
	revealPlayerSurroundings()
	
}
function checkForLake(id,depth,x,y,dir) {
	if (id == 1) { 
		// Old Mine
		
		let noneWeight = 100 // Should luck stat affect this?
		if (dir == "in") noneWeight /= 10
		
		let oilWeight = Math.min((depth-5)/10,1)
		if (depth >= 50) oilWeight = 0
		
		let lavaWeight = Math.min((depth-12)/20,1)
		if (depth == 50) lavaWeight = 0
		if (depth > 50) {
			if ((depth == 51 && dir == "in") || depth == 70) lavaWeight = 0
			else lavaWeight = 1+(depth-49)/20
		}

		let weightedList = [
			["",noneWeight],
			["oil",oilWeight],
			["lava",lavaWeight],
		]
		
		//console.log(weightedList)
		
		let liquid = pickWeightedRandom(weightedList)	
		
		if (!liquid) return "no lake (rng)" // No lake generated
		else {
			// Potential to spawn a lake
			// Additional fail conditions:
			// Lakes must be a certain distance from all other lakes on the same layer
			// Lakes also cannot spawn in an area with disturbed blocks (revealed by player)
			let lakeSize = 12+Math.floor(Math.random()*13) // Lakes should be 12-24 blocks in size
			
			let otherLakes = getLakes(id,depth)
			for (const otherLake of otherLakes) {
				let safeDistance = (lakeSize**0.5)+(otherLake.size**0.5)
				if (distance(x,y,otherLake.x,otherLake.y) < safeDistance) return "too close to lake "+JSON.stringify(otherLake) // Too close to another lake
			}

			let s = Math.ceil(lakeSize**0.5)+2 // side length
			let h = Math.floor(s/2) // half side length
			
			/*let checkArea = [0,0,0,0] // X1, X2, Y1, Y2
			if (dir == "in") checkArea = [x-h,x+h,y-h,y+h] // center X, center Y
			if (dir == "right") checkArea = [x,x+s,y-h,y+h] // positive X, center Y
			if (dir == "left") checkArea = [x-s,x,y-h,y+h] // negative X, center Y
			if (dir == "down") checkArea = [x-h,x+h,y,y+s] // positive Y, center X
			if (dir == "up") checkArea = [x-h,x+h,y-s,y] // negative Y, center X
			for (let i = checkArea[0]; i <= checkArea[1]; i++) {
				for (let j = checkArea[2]; j <= checkArea[3]; j++) {
					if (i==x && j==y) continue // ignore what was just revealed
					if (blockExists(id,depth,i,j)) return `disturbed block at (${i}, ${j})` // Disturbed blocks in area
				}	
			}*/
			
			// Generate lake
			let lakeShape = getLakeShape(lakeSize)
			let filledSpaces = lakeShape[0]
			let possibleSpaces = lakeShape[1]
			let anchorPoint = [0,0]
			if (dir != "in") {
				let possibleOffsets = []
				if (dir == "right") { // want point with minimum x as start point
					var minX = Infinity
					for (const pos of filledSpaces) {
						if (pos[0] < minX) minX = pos[0]
					}
					for (const pos of filledSpaces) {
						if (pos[0] == minX) possibleOffsets.push(pos)
					}
				}
				if (dir == "left") { // want point with maximum x as start point
					var maxX = -Infinity
					for (const pos of filledSpaces) {
						if (pos[0] > maxX) maxX = pos[0]
					}
					for (const pos of filledSpaces) {
						if (pos[0] == maxX) possibleOffsets.push(pos)
					}
				}
				if (dir == "down") { // want point with minimum y as start point
					var minY = Infinity
					for (const pos of filledSpaces) {
						if (pos[1] < minY) minY = pos[1]
					}
					for (const pos of filledSpaces) {
						if (pos[1] == minY) possibleOffsets.push(pos)
					}
				}
				if (dir == "up") { // want point with maximum y as start point
					var maxY = -Infinity
					for (const pos of filledSpaces) {
						if (pos[1] > maxY) maxY = pos[1]
					}
					for (const pos of filledSpaces) {
						if (pos[1] == maxY) possibleOffsets.push(pos)
					}
				}
				let offsetPos = pickRandom(possibleOffsets)
				anchorPoint[0] = offsetPos[0]
				anchorPoint[1] = offsetPos[1]
				
				if (dir == "right") anchorPoint[0]--
				if (dir == "left") anchorPoint[0]++
				if (dir == "down") anchorPoint[1]--
				if (dir == "up") anchorPoint[1]++
			}
			
			//console.log("anchor x "+anchorPoint[0])
			//console.log("anchor y "+anchorPoint[1])
			
			let xO = x-anchorPoint[0]
			let yO = y-anchorPoint[1]
			
			//console.log("offset x "+xO)
			//console.log("offset y "+yO)
			
			let centerX = x
			let centerY = y
			if (dir == "right") centerX += h
			if (dir == "left") centerX -= h
			if (dir == "down") centerY += h
			if (dir == "up") centerY -= h
			
			//console.log("center x "+centerX)
			//console.log("center y "+centerY)
			
			// check for disturbed blocks
			for (const pos of filledSpaces) {
				let pX = pos[0]+xO
				let pY = pos[1]+yO
								
				if (x==pX && y==pY) continue // ignore what was just revealed
				if (blockExists(id,depth,pX,pY)) return `disturbed block at (${pX}, ${pY})` // Disturbed blocks in area
				if (Math.abs(pX) > tmp.mod.mineBound || Math.abs(pY) > tmp.mod.mineBound) return `past mine bounds`
			}
			for (const pos of possibleSpaces) {
				let pX = pos[0]+xO
				let pY = pos[1]+yO
								
				if (x==pX && y==pY) continue // ignore what was just revealed
				if (blockExists(id,depth,pX,pY)) return `disturbed block at (${pX}, ${pY})` // Disturbed blocks in area
				if (Math.abs(pX) > tmp.mod.mineBound || Math.abs(pY) > tmp.mod.mineBound) return `past mine bounds`
			}
			
			let lakeId = addLake(id,depth,centerX,centerY,liquid,lakeSize)
			
			for (const pos of filledSpaces) {
				let pX = pos[0]+xO
				let pY = pos[1]+yO
				
				setBlock(id,depth,pX,pY,blocks[liquid])
				player.mine.map[id][depth][pX][pY].lake = lakeId
				
				// TODO: figure out how to only show the hole and add the spotlight once the lake is drained
				//if (dir != "in" || x != pX || y != pY)
				//	checkForDownpoint(id,depth,pX,pY) // can be downpoints under the liquid
			}
			
			// Generate surrounding blocks
			for (const pos of possibleSpaces) {
				generateBlock(id,depth,pos[0]+xO,pos[1]+yO)
			}
			
			return "generated lake "+JSON.stringify(getLakeById(id,depth,lakeId))
		}
	}
	return "no lake logic for mine id "+id // no lake logic for any undefined mine
}
function getLakes(id,depth) {
	// Return info on all lakes in mine with given id at given depth
	if (!(id in player.mine.placedLakes)) player.mine.placedLakes[id] = {}
	if (!(depth in player.mine.placedLakes[id])) player.mine.placedLakes[id][depth] = []
	return player.mine.placedLakes[id][depth]
}
function addLake(id,depth,lX,lY,lLiquid,lSize) {
	getLakes(id,depth) // ensure exists
	
	let lake = {
		x: lX,
		y: lY,
		size: lSize,
		volume: lSize*0.8,
		liquid: lLiquid,
	}
	
	player.mine.placedLakes[id][depth].push(lake)
	
	return player.mine.placedLakes[id][depth].indexOf(lake)
}
function getLakeById(mineId,depth,lakeId) {
	return player.mine.placedLakes[mineId][depth][lakeId]
}

function blockAdjacentToLiquid(mine,depth,x,y) {
	if (!blockExists(mine,depth,x,y)) return null
	if (blockExists(mine,depth,x+1,y) && getBlock(mine,depth,x+1,y).block.liquid) return getBlock(mine,depth,x+1,y).lake
	if (blockExists(mine,depth,x-1,y) && getBlock(mine,depth,x-1,y).block.liquid) return getBlock(mine,depth,x-1,y).lake
	if (blockExists(mine,depth,x,y+1) && getBlock(mine,depth,x,y+1).block.liquid) return getBlock(mine,depth,x,y+1).lake
	if (blockExists(mine,depth,x,y-1) && getBlock(mine,depth,x,y-1).block.liquid) return getBlock(mine,depth,x,y-1).lake
	return null
}

function startMineResetCountdown() {
	player.mine.resetTimer = 0
}
function mineResetString() {
	if (player.mine.resetTimer < 0) return ""
	return `<span style="color: red">The Mine is going to reset in ${formatTime(180-player.mine.resetTimer)}!</span>`
}
function resetMines() {
	player.mine.map = {}
	player.mine.placedLakes = {}
	player.mine.manualHoles = {}
	if (player.mine.inMine) exitMine()
	player.mine.pumpLocation = null
	player.mine.checkpointLocation = null
}

var mineSwitchTimeout = null

function arrowAction(dir) {
	if (!player.tab=="mine" || player.mine.inMine==0) return
	if (dir == "left") {
		layers.mine.clickables[32].onHold(true) 
	}
	if (dir == "right") {
		layers.mine.clickables[34].onHold(true) 
	}
	if (dir == "up") {
		layers.mine.clickables[23].onHold(true) 
	}
	if (dir == "down") {
		layers.mine.clickables[43].onHold(true) 
	}
}

function loadMine(id,depth) {
	if(id < 1 || depth < 1) return
	if (!(id in player.mine.map)) {
		player.mine.map[id] = {}
	}
	if (!(depth in player.mine.map[id])) {
		player.mine.map[id][depth] = {}
		playerBreakUpdate(id,depth,player.mine.playerX,player.mine.playerY,"in")
	}
	setPlayerLocation(player.mine.playerX,player.mine.playerY) // update player location
}

function setPlayerLocation(x,y) {
	// Move player to (X, Y)
	// NOTE: This cannot change a player's depth or the mine they are in.
	if (Math.abs(x) > tmp.mod.mineBound || Math.abs(y) > tmp.mod.mineBound) return
	player.mine.playerX = x
	player.mine.playerY = y
	updatePlayerBlock()
	revealPlayerSurroundings()
}
function revealPlayerSurroundings() {
	let x = player.mine.playerX
	let y = player.mine.playerY
	// Reveal adjacent blocks that the player can now see
	for (let i = x-2; i <= x+2; i++) {
		for (let j = y-2; j <= y+2; j++) {
			if (distance(x,y,i,j) < 3) {
				revealBlock(player.mine.inMine,player.mine.depth,i,j)
			}
		}
	}	
}

function enterMine(id) {
	player.mine.inMine = id
	player.town.unlocked = false
	oreSelected = null
	storeItemSelected = null
	player.forest.unlocked = false
	loadMine(id,1)
}
function exitMine() {
	player.mine.inMine = 0
	player.mine.depth = 0
	player.mine.moveCooldown = 0
	player.mine.manualHoleTime = 0
	player.town.unlocked = true
	player.forest.unlocked = true
	player.tab = "none"
	updatePlayerBlock()
}
function mineInterfaceClickableDisplay(id) {
	let blockX = player.mine.playerX+(id%10)-3
	let blockY = player.mine.playerY+Math.floor(id/10)-3
	let block = getBlock(player.mine.inMine,player.mine.depth,blockX,blockY)
	if (!block) {
		return ""
	}
	var needHeadlamp = (!(player.inv.headlamp && options.headlampOn) && Math.max(Math.abs(Math.floor(id/10)-3),Math.abs((id%10)-3)) > 1)
	if(needHeadlamp) return ""
	if (block.block.name == "Air" || block.block.liquid) {
		let features = ""
		if (block.block.liquid) {
			let lake = getLakeById(player.mine.inMine,player.mine.depth,block.lake)

			let percent = Math.ceil(100*(lake.volume/0.8)/lake.size)
			
			if (percent == 0) {
				// clear out drained liquid
				finishDrainLiquid(player.mine.inMine,player.mine.depth,blockX,blockY,block.block.name)
			}			
			else {
				if (block.spotlight) features += "Spotlight<br>" 
				let percentString = (percent<100) ? `<br>${percent}%<br>` : ""
				features += `<h3>${block.block.name}</h3>${percentString}<br>`
			}
			
		}
		if (block.block.name == "Air") {
			if (block.spotlight) features += "Spotlight, "
			if (block.crack) features += "Crack, "
			if (block.hole) features += "Hole, "
			let loc = player.mine.checkpointLocation
			if (loc && loc[0] == player.mine.inMine && loc[1] == player.mine.depth && loc[2] == blockX && loc[3] == blockY) features += "Checkpoint, "
			loc = player.mine.pumpLocation
			if (loc && loc[0] == player.mine.inMine && loc[1] == player.mine.depth && loc[2] == blockX && loc[3] == blockY) features += "Pump, "
			if (features) features = features.substring(0,features.length - 2) + "<br>"
			if (player.mine.inMine == 1 && player.mine.depth == 70) features = `<span style="color:white">${features}</span>`
		}
		if (blockX == player.mine.playerX && blockY == player.mine.playerY) {
			return features+`<span style="font-size:50px">${playerSymbols[player.mine.playerSymbol]}</span>`
		}
		return features+""
	}
	var percentString = ""
	if (miningBlock && miningBlock.mine == player.mine.inMine && miningBlock.depth == player.mine.depth && miningBlock.x == blockX && miningBlock.y == blockY) {
		let percent = getMiningBlockPercent()
		if (percent >= 0 && percent < 100) percentString = `<br>${format(percent+0.5,0)}%`
	}
	return `<h3>${block.block.name}</h3>${percentString}`
	//return `<h3>${block.block.name}</h3><br>${format(100*block.hp/block.mhp,0)}%`
	//return `<h3>${block.block.name}</h3><br>${format(block.hp,0)}/${format(block.mhp,0)}`
	//return block
}
function mineInterfaceClickableCanClick(id) {
	let blockX = (id%10)-3
	let blockY = Math.floor(id/10)-3
	let block = selectedMineItem ? getBlock(player.mine.inMine,player.mine.depth,player.mine.playerX+blockX,player.mine.playerY+blockY) : null
	
	if (!selectedMineItem) {
		// no item selected then pickaxe is selected
		// pickaxe can only target blocks 1 away from player
		return Math.abs(blockX)+Math.abs(blockY) == 1
	}
	else if (selectedMineItem == "checkpoint") {
		// checkpoint can be placed on air blocks 1 away from player
		return (Math.abs(blockX)+Math.abs(blockY) == 1) && block && (block.block.name == "Air") && !block.occupied
	}
	else if (selectedMineItem == "pump") {
		// pump can be placed on air blocks 1 away from player that border a liquid
		return (Math.abs(blockX)+Math.abs(blockY) == 1) && block && (block.block.name == "Air") && !block.occupied && blockAdjacentToLiquid(player.mine.inMine,player.mine.depth,player.mine.playerX+blockX,player.mine.playerY+blockY)!=null
	}
	else if (selectedMineItem == "dynamite") {
		// dynamite can be placed on air blocks 1 away from player
		return (Math.abs(blockX)+Math.abs(blockY) == 1) && block && (block.block.name == "Air") && !block.occupied
	}
	else if (selectedMineItem == "dCharge") {
		return (Math.abs(blockX)+Math.abs(blockY) == 1) && block && (!block.block.liquid && !block.block.unbreakable) && !block.occupied && !block.hole && !(player.mine.inMine == 1 && player.mine.depth == 70 && block.block.name == "Air")
	}
}
function mineInterfaceClickableStyle(id) {
	let blockX = player.mine.playerX+(id%10)-3
	let blockY = player.mine.playerY+Math.floor(id/10)-3
	let block = getBlock(player.mine.inMine,player.mine.depth,blockX,blockY)
	var blockColor = "black"
	//var spotlight = ""
	var needHeadlamp = (!(player.inv.headlamp && options.headlampOn) && Math.max(Math.abs(Math.floor(id/10)-3),Math.abs((id%10)-3)) > 1)
	if (block) {
		if (block.revealed && !needHeadlamp) {
			if (block.block) {
				if (block.block.name == "Lava") {
					let lake = getLakeById(player.mine.inMine,player.mine.depth,block.lake)
					if (lake.volume <= 0) finishDrainLiquid(player.mine.inMine,player.mine.depth,blockX,blockY,block.block.name)
				}
				if (block.block.name == "Air") {
					blockColor = mineFloorColor(player.mine.inMine,player.mine.depth)
					//if (block.spotlight) {
					//	spotlight = `radial-gradient(rgba(255,255,255,0.6) 0%, ${blockColor} 60%)`
					//}
				}
				if (block.block.color) {
					blockColor = block.block.color
				}
			}
		}
	}
	let side="120px"
	return {"border-radius":"0px","font-size":"12px","height":side,"width":side,"background":blockColor,"box-shadow":"none","transform":"scale(1,1)","opacity":(blockColor=="black")?0:1}
}
function mineInterfaceClickablePress(id,clickType) {
	let blockX = player.mine.playerX+(id%10)-3
	let blockY = player.mine.playerY+Math.floor(id/10)-3
	let block = getBlock(player.mine.inMine,player.mine.depth,blockX,blockY)
	if (!(block && block.revealed)) return

	if (!selectedMineItem || clickType != "click") {
		// no item selected then pickaxe is selected

		if (block.block.name == "Air" || block.block.liquid) {
			// Move player
			if (player.mine.moveCooldown <= 0) {
				player.mine.moveCooldown = 1/tmp.mod.playerSpeed
				player.mine.manualHoleTime = 0
				setPlayerLocation(blockX,blockY)
			}
		}
		else {
			if (block.block.unbreakable) return
			keepMiningBlock = true
			if (!miningBlock || miningBlock.x != blockX || miningBlock.y != blockY) {
				miningBlock = {
					block: block,
					mine: player.mine.inMine,
					depth: player.mine.depth,
					x: blockX,
					y: blockY,
				}
				miningBlockDamage = 0
			}
		}
	}
	else if (selectedMineItem == "checkpoint") {
		if (block.block.name == "Air") {
			// Place checkpoint
			selectedMineItem = ""
			player.mine.checkpointLocation = [player.mine.inMine,player.mine.depth,blockX,blockY]
			block.occupied = true
		}
	}
	else if (selectedMineItem == "pump") {
		let lakeId = blockAdjacentToLiquid(player.mine.inMine,player.mine.depth,blockX,blockY)
		let lake = getLakeById(player.mine.inMine,player.mine.depth,lakeId)
		if (block.block.name == "Air" && lake) {
			// Place pump
			selectedMineItem = ""
			player.mine.pumpLocation = [player.mine.inMine,player.mine.depth,blockX,blockY]
			block.occupied = true
			
			player.mine.pumpData.barrels = 0
			player.mine.pumpData.filled = 0
			player.mine.pumpData.lake = lakeId
		}
	}
	else if (selectedMineItem == "dynamite") {
		selectedMineItem = ""
		if (!takeFromInventory("Dynamite")) return
		// 3x3 hole
		for (let run = 0; run < 2; run++) {
			// run multiple times in case some blocks were not revealed the first time
			for (let i = blockX-1; i <= blockX+1; i++) {
				for (let j = blockY-1; j <= blockY+1; j++) {
					let ijBlock = getBlock(player.mine.inMine,player.mine.depth,i,j)
					if (!ijBlock) continue
					if (ijBlock.block.name == "Air") continue
					if (ijBlock.block.unbreakable) continue
					if (ijBlock.block.liquid) continue
					ijBlock = {
						block: ijBlock,
						mine: player.mine.inMine,
						depth: player.mine.depth,
						x: i,
						y: j,
					}
					playerDestroyBlock(ijBlock,true)
				}
			}
		}
	}
	else if (selectedMineItem == "dCharge") {
		selectedMineItem = ""
		if (!takeFromInventory("Detonation Charge")) return
		if (block.block.name == "Air") {
			if (player.mine.inMine == 1 && player.mine.depth == 50) {
				// Bedrock layer
				if(block.crack) explodeCrack(player.mine.inMine,player.mine.depth,blockX,blockY)
			}
			else {
				createHole(player.mine.inMine,player.mine.depth,blockX,blockY)
			}
		}
		else {
			// 7 block long hole
			if (blockX > player.mine.playerX) {
				for (let i = blockX; i < blockX+7; i++) {
					let ijBlock = getBlock(player.mine.inMine,player.mine.depth,i,player.mine.playerY)
					if (!ijBlock) continue
					if (ijBlock.block.name == "Air") continue
					if (ijBlock.block.unbreakable) continue
					if (ijBlock.block.liquid) continue
					ijBlock = {
						block: ijBlock,
						mine: player.mine.inMine,
						depth: player.mine.depth,
						x: i,
						y: player.mine.playerY,
					}
					playerDestroyBlock(ijBlock,true)
				}
			}
			else if (blockX < player.mine.playerX) {
				for (let i = blockX; i > blockX-7; i--) {
					let ijBlock = getBlock(player.mine.inMine,player.mine.depth,i,player.mine.playerY)
					if (!ijBlock) continue
					if (ijBlock.block.name == "Air") continue
					if (ijBlock.block.unbreakable) continue
					if (ijBlock.block.liquid) continue
					ijBlock = {
						block: ijBlock,
						mine: player.mine.inMine,
						depth: player.mine.depth,
						x: i,
						y: player.mine.playerY,
					}
					playerDestroyBlock(ijBlock,true)
				}
			}
			else if (blockY > player.mine.playerY) {
				for (let j = blockY; j < blockY+7; j++) {
					let ijBlock = getBlock(player.mine.inMine,player.mine.depth,player.mine.playerX,j)
					if (!ijBlock) continue
					if (ijBlock.block.name == "Air") continue
					if (ijBlock.block.unbreakable) continue
					if (ijBlock.block.liquid) continue
					ijBlock = {
						block: ijBlock,
						mine: player.mine.inMine,
						depth: player.mine.depth,
						x: player.mine.playerX,
						y: j,
					}
					playerDestroyBlock(ijBlock,true)
				}
			}
			else if (blockY < player.mine.playerY) {
				for (let j = blockY; j > blockY-7; j--) {
					let ijBlock = getBlock(player.mine.inMine,player.mine.depth,player.mine.playerX,j)
					if (!ijBlock) continue
					if (ijBlock.block.name == "Air") continue
					if (ijBlock.block.unbreakable) continue
					if (ijBlock.block.liquid) continue
					ijBlock = {
						block: ijBlock,
						mine: player.mine.inMine,
						depth: player.mine.depth,
						x: player.mine.playerX,
						y: j,
					}
					playerDestroyBlock(ijBlock,true)
				}
			}
			
		}
	}	
}
function mineInterfaceClickable(id) {
	return {
		display() {return mineInterfaceClickableDisplay(id)},
		style() {return mineInterfaceClickableStyle(id)},
		unlocked() {return player.mine.inMine},
		canClick() {return mineInterfaceClickableCanClick(id)},
		onClick() {return mineInterfaceClickablePress(id,"click")},
		onHold(arrow) {if(!selectedMineItem) return mineInterfaceClickablePress(id,arrow ? "arrow" : "held")},
	}
}
function mineDepthDisplay() {
	if (player.mine.depth < 1) return ""
	return "Depth: "+player.mine.depth
}
function mineXYDisplay() {
	if (player.mine.depth < 1) return ""
	return `(${player.mine.playerX}, ${player.mine.playerY})`
}
function mineMvmtDisplay() {
	if (player.mine.depth < 1) return ""
	return "Movement cooldown: "+format(player.mine.moveCooldown,2)
}

// Manual holes - the player can create holes to deeper depths without finding them, but this takes a while
manualHoleHeld = 0
function getManualHoles(mineId) {
	if (!(mineId in player.mine.manualHoles)) player.mine.manualHoles[mineId] = 0
	return player.mine.manualHoles[mineId]
}
function getManualHoleTime(mineId) {
	let baseHoleTimes = [0,60]
	let totalHolesFactor = 1+(getManualHoles(mineId)/10)
	let depthFactor = 1+((player.mine.depth-1)/10)
	if (mineId == 1 && player.mine.depth > 50) depthFactor *= 2
	let miningSpeedFactor = 1/tmp.mod.minePower
	return baseHoleTimes[mineId]*totalHolesFactor*depthFactor*miningSpeedFactor
}
function getManualHoleTimeLeft(mineId) {
	return getManualHoleTime(1)-player.mine.manualHoleTime
}
function digManualHole(diff) {
	player.mine.manualHoleTime += diff
	if (getManualHoleTimeLeft(manualHoleHeld) <= 0) {
		player.mine.manualHoleTime = 0
		player.mine.manualHoles[manualHoleHeld] += 1
		createHole(manualHoleHeld,player.mine.depth,player.mine.playerX,player.mine.playerY)
	}
}

function pumpInInventory() {
	return player.inv.pump && !player.mine.pumpLocation
}
function checkpointInInventory() {
	return player.inv.checkpoint && !player.mine.checkpointLocation
}

function getBlockHealth(id,depth,x,y) {
	let block = getBlock(id,depth,x,y)
	if (!(block && block.block.hardness)) return null
	return block.block.hardness * depthHardness(id,depth)
}
function getMiningBlockPercent() {
	if (!miningBlock) return -1
	let blockHealth = getBlockHealth(miningBlock.mine,miningBlock.depth,miningBlock.x,miningBlock.y)
	if (blockHealth == null) return -1
	return Math.max((1-(miningBlockDamage/blockHealth))*100,0)
}
function isMiningBlockDestroyed() {
	if (!miningBlock) return false
	if (miningBlock.block.unbreakable || miningBlock.block.name == "Air" || miningBlock.block.liquid) return false
	
	let blockHealth = getBlockHealth(miningBlock.mine,miningBlock.depth,miningBlock.x,miningBlock.y)
	if (blockHealth == null) return false
	
	//console.log(miningBlockDamage, blockHealth)
	return miningBlockDamage >= blockHealth
}



// https://stackoverflow.com/questions/1669190/find-the-min-max-element-of-an-array-in-javascript
function arrayMin(arr) {
  var len = arr.length, min = Infinity;
  while (len--) {
    if (arr[len] < min) {
      min = arr[len];
    }
  }
  return min;
}
function arrayMax(arr) {
  var len = arr.length, max = -Infinity;
  while (len--) {
    if (arr[len] > max) {
      max = arr[len];
    }
  }
  return max;
}

function spacesSurrounding(space) {
	if (space.length != 2) return null
	let x = space[0]
	let y = space[1]
	return [[x+1,y],[x,y+1],[x-1,y],[x,y-1]]
}
function distance(x1,y1,x2,y2) {
	return (((x2-x1)**2)+((y2-y1)**2))**0.5
}
function xyInList(x,y,list) {
	for (let i = 0; i < list.length; i++) {
		if (list[i][0] == x && list[i][1] == y) return true
	}
	return false
}
function getLakeShape(size) {
	// Generate the form of a liquid lake
	if (size < 1) return
	if (size > 100) size = 100
	let filledSpaces = [[0,0]]
	// possible spaces are spaces that border filled spaces and have not yet been filled themselves
	let possibleSpaces = spacesSurrounding([0,0])
	for (let i = 1; i < size; i++) {
		let distances = []
		for (let j = 0; j < possibleSpaces.length; j++) {
			distances.push(distance(0,0,possibleSpaces[j][0],possibleSpaces[j][1]))
		}
		// distances is a list of the distances of possible spaces from the origin (0,0)
		let minDistance = arrayMin(distances)
		let indices = []
		for (let j = 0; j < distances.length; j++) {
			if (distances[j] > minDistance+0.9) continue
			// if (Math.abs(possibleSpaces[j][0]) > sideLength || Math.abs(possibleSpaces[j][1]) > sideLength) continue
			indices.push(j)
		}
		// indices is a list of indices of distances that are not too far away to create a "blob" shape
		let chooseIndex = pickRandom(indices)
		// Add the chosen space to the list of filled spaces and update possible spaces with new bordering spaces
		let chooseSpace = possibleSpaces[chooseIndex]
		filledSpaces.push(chooseSpace)
		possibleSpaces.splice(chooseIndex,1)
		let newSpaces = spacesSurrounding(chooseSpace)
		for (let j = 0; j < newSpaces.length; j++) {
			let newSpace = newSpaces[j]
			if (xyInList(newSpace[0],newSpace[1],filledSpaces)) continue
			if (xyInList(newSpace[0],newSpace[1],possibleSpaces)) continue
			possibleSpaces.push(newSpace)
		}
	}
	
	let sideLength = Math.floor(size**0.5)
	let testStr = ""
	for (let i = -sideLength; i <= sideLength; i++) {
		for (let j = -sideLength; j <= sideLength; j++) {
			testStr += xyInList(i,j,filledSpaces) ? "XX" : "  "
		}
		testStr += "\n"
	}
	//console.log(testStr)
	
	// returning possibleSpaces is useful because it gets all block locations adjacent to the lake
	return [filledSpaces,possibleSpaces]
}

// Lakes should be 12-24 blocks in size
// future mines might have bigger lakes, function supports up to 100 block lakes and that could be increased

function pumpBarrelLimit() {
	// in the future, it might be possible to have more barrels?
	return 4
}
function pumpDisplayColumn() {
	if (!player) return ""
	let loc = player.mine.pumpLocation
	if (!(loc && loc[0] == player.mine.inMine && loc[1] == player.mine.depth && loc[2] == player.mine.playerX && loc[3] == player.mine.playerY)) return ""
	
	let pump = player.mine.pumpData
	let pumpStatus = (pump.barrels == 0) ? "Waiting" : (pump.filled == pump.barrels) ? "Full" : "Pumping"
	let liquidName = blocks[getLakeById(player.mine.inMine,player.mine.depth,pump.lake).liquid].name
	
	return ["column",[
		["blank", "10px"],
		["display-text","<h2>Pump</h2>"],
		["blank","20px"],
		["row",[
			["column",[
				["display-text",`<h3>${pump.barrels}/${pumpBarrelLimit()} Barrels</h3>`,{"font-size":"14px"}],
				["blank","12px"],
				["clickable",4452],
				["clickable",4453],
				["blank","36px"],
				["display-text",pumpStatus], // Pumping / Waiting / Full
				["bar","pumpProgress"],
				["display-text",`${Math.floor(pump.filled*10)/10} Barrels of ${liquidName}`],
				["blank","16px"],
			]],
			["column",[
				["blank", ["40px","40px"]],
			]],
			["column",[
				["blank", "100px"],
				["clickable",4451],
			]],
		]],
	]]
}

function updatePump(diff) {
	if (!player.mine.pumpLocation) return
	if (!player.mine.pumpData == null) return
	
	let barrels = player.mine.pumpData.barrels
	let filled = player.mine.pumpData.filled
	let barrelSpace = barrels-filled
	if (barrelSpace <= 0) return // pump is full
	
	let lake = getLakeById(player.mine.pumpLocation[0],player.mine.pumpLocation[1],player.mine.pumpData.lake)

	if (lake.volume <= 0) return
	
	let pumpAmount = Math.min(diff*tmp.mod.pumpSpeed/10, lake.volume, barrelSpace)
	
	lake.volume -= pumpAmount
	player.mine.pumpData.filled += pumpAmount	
}

function finishDrainLiquid(id,depth,x,y,liquidName) {
	if (liquidName == "Lava") {
		obsidianChance = pickRandom([0,0,0,0,0,1])
		if (obsidianChance) {
			let spotlight = getBlock(id,depth,x,y).spotlight
			setBlock(id,depth,x,y,blocks.obsidian)
			if (spotlight) player.mine.map[id][depth][x][y].spotlight = true
			revealBlock(id,depth,x,y)
			return
		}
	}
	setBlock(id,depth,x,y,blocks.air)
	revealBlock(id,depth,x,y)
}

function playerDestroyBlock(miningBlock,explode=false) {
	let block = miningBlock.block
	let blockName = block.block.name
	let blockX = miningBlock.x
	let blockY = miningBlock.y
	if (blockX == null || blockY == null) return
	if (!explode) {
		player.stats.totalBlocksMined++
		if (!(blockName in player.stats.indivBlocksHarvested))
			player.stats.indivBlocksHarvested[blockName] = 0
		player.stats.indivBlocksHarvested[blockName]++
	}
	if (!(blockName in player.stats.unlockedOres))
		player.stats.unlockedOres[blockName] = true
	
	let amt = 1
	if (!explode && tmp.mod.autosmelt && Math.random() < tmp.mod.autosmelt) {
		if (forgeInputs[blockName]) blockName = forgeInputs[blockName].output
	}
	if (!explode && (Math.random() < tmp.mod.doubleDrop)) {
		// Double drop
		amt *= 2
	}
	addToInventory(blockName,amt)
	
	dir = null
	if (!explode) {
		if (blockX > player.mine.playerX) dir = "right"
		else if (blockX < player.mine.playerX) dir = "left"
		else if (blockY > player.mine.playerY) dir = "down"
		else if (blockY < player.mine.playerY) dir = "up"
	}
	else dir = "explode"
	playerBreakUpdate(player.mine.inMine,player.mine.depth,blockX,blockY,dir)
	if (!explode) {
		player.mine.moveCooldown = 1/tmp.mod.playerSpeed
	}
	player.mine.manualHoleTime = 0
}

// do not save these settings
var selectedMineItem = null
var selectedItemNames = {
	"pump": "Pump",
	"checkpoint": "Checkpoint",
	"dynamite": "Dynamite",
	"dCharge":	"Detonation Charge",
}
var mineEnterClicks = 0
var checkpointWarpClicks = 0
var miningBlock = null
var miningBlockDamage = 0
var keepMiningBlock = false
addLayer("mine", {
    name: "mine",
    symbol: "⛰️",
    position: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
		inMine: 0,
		depth: 0,
		playerX: 0,
		playerY: 0,
		map: {},
		playerSymbol: 1,
		moveCooldown: 0,
		resetTimer: -1,
		manualHoles: {},
		manualHoleTime: 0,
		pumpLocation: null,
		checkpointLocation: null,
		placedLakes: {},
		pumpData: {
			barrels: 0,
			filled: 0,
			lake: null,
		},
    }},
    color: "#898C99",
    type: "none",
    row: 0,
    layerShown(){return true},
	tooltip() {return "Mine"},
	
	tabFormat: {
		"Items": {
			content: [
				["display-text",function() { return (player.mine.inMine && tmp.mod.playerBlock) ? "Click an item to select it then click again to deselect" : "Items cannot be equipped when not in the mine" }],
				"blank",
				["row",[
					["clickable", 4441],
					["clickable", 4442],
					["clickable", 4443],
					["clickable", 4444],
				],],
				function() { return selectedMineItem ? "blank" : "" },
				["display-text",function() { player.timePlayed; return selectedMineItem ? `${selectedItemNames[selectedMineItem]} is selected` : "" }],
			],
			unlocked() {
				return (player.inv.pump || player.inv.checkpoint || playerHas("Dynamite") || playerHas("Detonation Charge"))
			},
		},
		"Old Mine": {
			content: [
				["display-text",function() { return mineResetString() },],
				["display-text",function() { return mineResetString() ? "<br>" : "" },],
				["row",[
					["clickable", 101],
					["clickable", 102],
					["clickable", 103],
					["clickable", 104],
					["clickable", 105],
				],],
				"blank",
				["display-text",function() { player.timePlayed; return selectedMineItem ? `${selectedItemNames[selectedMineItem]} is selected` : "" }],
				function() { return selectedMineItem ? "blank" : "" },
				["row",[
					["column",[["clickable",11],["clickable",21],["clickable",31],["clickable",41],["clickable",51]]],
					["column",[["clickable",12],["clickable",22],["clickable",32],["clickable",42],["clickable",52]]],
					["column",[["clickable",13],["clickable",23],["clickable",33],["clickable",43],["clickable",53]]],	
					["column",[["clickable",14],["clickable",24],["clickable",34],["clickable",44],["clickable",54]]],	
					["column",[["clickable",15],["clickable",25],["clickable",35],["clickable",45],["clickable",55]]],	
				]],
				"blank",
				["row",[
					["display-text",
						function() { return mineDepthDisplay() },
					],
					"blank",
					"blank",
					["display-text",
						function() { return mineXYDisplay() },
					],
				],],
				["display-text",
					function() { return mineMvmtDisplay() },
				],
				function() {return pumpDisplayColumn()},
			],
			unlocked() {
				return (player.mine.inMine == 0 || player.mine.inMine == 1)
			},
		},
	},
	
	clickables: {
		101: {
			display() {player.timePlayed; return (player.mine.inMine ? "Exit the Old Mine" : "Enter the Old Mine") + (mineEnterClicks > 0 ? `<br>${mineEnterClicks}/3 clicks` : "")},
			style() {return pBtnStyle},
			canClick() {
				return player.mine.inMine == 0 || player.mine.inMine == 1
			},
			onClick() {
				checkpointWarpClicks = 0
				clearTimeout(mineSwitchTimeout)
				mineEnterClicks++
				if (mineEnterClicks < 3) {
					mineSwitchTimeout = setTimeout(() => {
					  mineEnterClicks = 0
					  checkpointWarpClicks = 0
					}, 1000)
					return
				}
				mineEnterClicks = 0
				if (player.mine.inMine == 0) {
					player.mine.depth = 1
					enterMine(1)
					setPlayerLocation(0,0)
					updatePlayerBlock()
				}
				else if (player.mine.inMine == 1) {
					exitMine()
				}
			},
		},
		102: {
			display() {
				if (player.mine.inMine != 1) return ""
				if (!tmp.mod.playerBlock) return ""
				return (tmp.mod.playerBlock.hole ? "Delve deeper into the Old Mine" : "Climb to a higher depth in the Old Mine")
			},
			style() {return {"font-size":"12px", "margin-left":"8px"}},
			canClick() {
				return this.unlocked()
			},
			onClick() {
				if (tmp.mod.playerBlock.hole) {
					player.mine.depth++
					updatePlayerBlock()
					tmp.mod.playerBlock.spotlight = true
					loadMine(1,player.mine.depth)
				}
				else if (tmp.mod.playerBlock.spotlight) {
					if (player.mine.depth == 1) exitMine()
					else {
						player.mine.depth--
						updatePlayerBlock()
						loadMine(1,player.mine.depth)
					}
				}
			},
			unlocked() {
				if (player.mine.inMine != 1) return false
				return tmp.mod.playerBlock && (tmp.mod.playerBlock.spotlight || tmp.mod.playerBlock.hole)
			}
		},
		103: {
			display() {
				if (player.mine.inMine != 1) return ""
				if (!tmp.mod.playerBlock) return ""
				return `Dig a tunnel down<br>(Progress is lost when moving)<br><br>${formatTime(getManualHoleTimeLeft(1))} left to complete tunnel`
				// `Dig a tunnel down<br>(Takes longer the more tunnels have been made in this mine, progress is lost when moving)<br><br>${formatTime(getManualHoleTimeLeft(1))} left to complete tunnel`
			},
			style() {return {"font-size":"12px", "width":"180px", "margin-left":"8px"}},
			canClick() {
				return this.unlocked() && !tmp.mod.playerBlock.hole
			},
			onHold() {
				manualHoleHeld = 1
			},
			unlocked() {
				if (!options.showManualHole) return false
				if (player.mine.inMine != 1) return false
				if (player.mine.inMine == 1 && player.mine.depth == 50) return false
				let block = tmp.mod.playerBlock
				if (!block) return false
				if (block.block.liquid) return false
				return true
			}
		},
		104: {
			display() {return "Teleport to Checkpoint" + (checkpointWarpClicks > 0 ? `<br>${checkpointWarpClicks}/3 clicks` : "")},
			style() {return {"font-size":"12px", "margin-left":"8px"}},
			canClick() {
				return this.unlocked()
			},
			onClick() {
				mineEnterClicks = 0
				clearTimeout(mineSwitchTimeout)
				checkpointWarpClicks++
				if (checkpointWarpClicks < 3) {
					mineSwitchTimeout = setTimeout(() => {
					  mineEnterClicks = 0
					  checkpointWarpClicks = 0
					}, 1000)
					return
				}
				let loc = player.mine.checkpointLocation
				checkpointWarpClicks = 0
				player.mine.depth = loc[1]
				if (player.mine.inMine == 0) {
					enterMine(1)
				}
				setPlayerLocation(loc[2],loc[3])
			},
			unlocked() {
				return player.inv.checkpoint && player.mine.checkpointLocation && player.mine.checkpointLocation[0] == 1
			}
		},
		105: {
			display() {return "Pick up Checkpoint"},
			style() {return {"font-size":"12px", "margin-left":"8px"}},
			canClick() {
				return this.unlocked()
			},
			onClick() {
				let loc = player.mine.checkpointLocation
				let block = getBlock(loc[0],loc[1],loc[2],loc[3])

				player.mine.checkpointLocation = null
				delete block.occupied
				
			},
			unlocked() {
				let loc = player.mine.checkpointLocation
				return (loc && loc[0] == player.mine.inMine && loc[1] == player.mine.depth && loc[2] == player.mine.playerX && loc[3] == player.mine.playerY)
			}
		},
		
		11: mineInterfaceClickable(11),
		12: mineInterfaceClickable(12),
		13: mineInterfaceClickable(13),
		14: mineInterfaceClickable(14),
		15: mineInterfaceClickable(15),
		21: mineInterfaceClickable(21),
		22: mineInterfaceClickable(22),
		23: mineInterfaceClickable(23),
		24: mineInterfaceClickable(24),
		25: mineInterfaceClickable(25),
		31: mineInterfaceClickable(31),
		32: mineInterfaceClickable(32),
		33: mineInterfaceClickable(33),
		34: mineInterfaceClickable(34),
		35: mineInterfaceClickable(35),
		41: mineInterfaceClickable(41),
		42: mineInterfaceClickable(42),
		43: mineInterfaceClickable(43),
		44: mineInterfaceClickable(44),
		45: mineInterfaceClickable(45),
		51: mineInterfaceClickable(51),
		52: mineInterfaceClickable(52),
		53: mineInterfaceClickable(53),
		54: mineInterfaceClickable(54),
		55: mineInterfaceClickable(55),

		4441: {
			display() {
				player.timePlayed // stupidity
				return (selectedMineItem == "pump" ? "Unequip Pump" : "Equip Pump")
			},
			canClick() {
				return true
			},
			onClick() {
				selectedMineItem = (selectedMineItem != "pump" ? "pump" : null)
			},
			unlocked() {
				return player.mine.inMine && pumpInInventory()
			},
		},
		4442: {
			display() {
				player.timePlayed // stupidity
				return (selectedMineItem == "checkpoint" ? "Unequip Checkpoint" : "Equip Checkpoint")
			},
			canClick() {
				return true
			},
			onClick() {
				selectedMineItem = (selectedMineItem != "checkpoint" ? "checkpoint" : null)
			},
			unlocked() {
				return player.mine.inMine && checkpointInInventory()
			},
		},
		4443: {
			display() {
				player.timePlayed // stupidity
				return (selectedMineItem == "dynamite" ? "Unequip Dynamite" : "Equip Dynamite")
			},
			canClick() {
				return true
			},
			onClick() {
				selectedMineItem = (selectedMineItem != "dynamite" ? "dynamite" : null)
			},
			unlocked() {
				return player.mine.inMine && playerHas("Dynamite")
			},
		},
		4444: {
			display() {
				player.timePlayed // stupidity
				return (selectedMineItem == "dCharge" ? "Unequip Detonation Charges" : "Equip Detonation Charges")
			},
			canClick() {
				return true
			},
			onClick() {
				selectedMineItem = (selectedMineItem != "dCharge" ? "dCharge" : null)
			},
			unlocked() {
				return player.mine.inMine && playerHas("Detonation Charge")
			},
		},
		4451: {
			display() {
				return `Pick Up Pump`
			},
			canClick() {
				return true
			},
			onClick() {
				let loc = player.mine.pumpLocation
				let block = getBlock(loc[0],loc[1],loc[2],loc[3])

				let fullBarrelNum = Math.floor(player.mine.pumpData.filled)
				let emptyBarrelNum = player.mine.pumpData.barrels-fullBarrelNum
				if (fullBarrelNum+emptyBarrelNum > 0) {
					let liquid = getLakeById(player.mine.inMine,player.mine.depth,player.mine.pumpData.lake).liquid
					let liquidName = blocks[liquid].name
					addLiquidPumped(liquid,fullBarrelNum)
					addToInventory(liquidName+" Barrel", fullBarrelNum)
					addToInventory("Empty Barrel", emptyBarrelNum)
				}

				player.mine.pumpLocation = null
				delete block.occupied				
			},
			style() {return {"min-height":"30px","min-width":"180px","border":"2px solid black","background":"rgba(0,0,0,0.5)","border-radius":"4px","font-size":"16px","color":"white","margin":"2px"}},

		},
		4452: {
			display() {
				return `Add Empty Barrel`
			},
			canClick() {
				return player.mine.pumpData.barrels < pumpBarrelLimit() && playerHas("Empty Barrel")
			},
			onClick() {
				takeFromInventory("Empty Barrel")
				player.mine.pumpData.barrels++
			},
			style() {return {"min-height":"30px","min-width":"160px","border":"2px solid black","background":"rgba(0,0,0,0.5)","border-radius":"4px","font-size":"16px","color":this.canClick() ? "white" : "#444444","margin":"2px"}},
		},
		4453: {
			display() {
				return `Take Full Barrel`
			},
			canClick() {
				return player.mine.pumpData.filled >= 1 && !tmp.mod.playerInvIsFull
			},
			onClick() {
				let liquid = getLakeById(player.mine.inMine,player.mine.depth,player.mine.pumpData.lake).liquid
				let liquidName = blocks[liquid].name
				addLiquidPumped(liquid)
				addToInventory(liquidName+" Barrel")
				player.mine.pumpData.barrels--
				player.mine.pumpData.filled--
			},
			style() {return {"min-height":"30px","min-width":"160px","border":"2px solid black","background":"rgba(0,0,0,0.5)","border-radius":"4px","font-size":"16px","color":this.canClick() ? "white" : "#444444","margin":"2px"}},
		},
	},
	
	bars: {
		pumpProgress: {
			direction: RIGHT,
			width: 180,
			height: 20,
			progress() { 
				if (player.mine.pumpData.barrels <= 0) return 0
				return player.mine.pumpData.filled/player.mine.pumpData.barrels
			},
			baseStyle: {"background-color":"black"},
			fillStyle: {"background-color": "white"},
			borderStyle: {"border-color": "black", "border-radius": "2px","margin":"8px"},
		}
	},
	
	hotkeys: [
        {key: "ArrowLeft", description: "Left arrow key: Left action in mine", onPress(){arrowAction("left")}},
        {key: "ArrowRight", description: "Right arrow key: Right action in mine", onPress(){arrowAction("right")}},
        {key: "ArrowUp", description: "Up arrow key: Up action in mine", onPress(){arrowAction("up")}},
        {key: "ArrowDown", description: "Down arrow key: Down action in mine", onPress(){arrowAction("down")}},
        {key: "h", description: "H: Toggle if your headlamp is active", onPress(){toggleOpt('headlampOn')}},
        {key: "i", description: "I: Toggle expanded inventory display", onPress(){toggleOpt('showInv')}},
        {key: "t", description: "T: Toggle tunnel down button display", onPress(){toggleOpt('showManualHole')}},
    ],
	
	update(diff) {
		if(updateMineTab) {
			updateMineTab = false
			player.subtabs.mine.mainTabs = "Old Mine"
		}
		if (tmp.mod.mineBlockTotal > 30000) {
			startMineResetCountdown()
		}
		if (player.mine.resetTimer > -1) {
			player.mine.resetTimer += diff
			if (player.mine.resetTimer >= 3*60) {
				player.mine.resetTimer = -1
				resetMines()
			}
		}
		
		updatePump(diff)
		
		// rest of these are not run if the player is not in a mine
		if (!player.mine.inMine) return
		
		if (!keepMiningBlock) {
			miningBlock = null
		}
		if (miningBlock) {
			keepMiningBlock = false
			
			miningBlockDamage += diff*tmp.mod.minePower
			
			if(isMiningBlockDestroyed()) {
				playerDestroyBlock(miningBlock)
			}
		}
		
		if (player.mine.moveCooldown > 0) player.mine.moveCooldown -= Math.min(diff,player.mine.moveCooldown)
			
		if (manualHoleHeld) {
			digManualHole(diff)
			manualHoleHeld = 0
		}
		
		// check for lava death
		let playerOnBlock = getBlock(player.mine.inMine,player.mine.depth,player.mine.playerX,player.mine.playerY)
		if (playerOnBlock && playerOnBlock.block.name == "Lava") {
			setTimeout(() => {
				exitMine()
				player.tab = "lavaAlert"
				setTimeout(() => {
					player.tab = "none"
				}, 3000)
			},100)
		}
		
	},
})
updateMineTab = true

addLayer("lavaAlert", {
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    type: "none",
	tabFormat: [
		"blank",
		["display-text", `<span style="color:#BF0000;font-size:40px">You fell in lava and died.</span>`],
	],
})



// block definitions
blocks = {
	// walkable blocks
	air: {
		name: "Air",
	},
	oil: {
		name: "Oil",
		color: "#12222D",
		liquid: true,
	},
	lava: {
		name: "Lava",
		color: "#FFB600",
		liquid: true,
	},
	// mine-able blocks
	dirt: {
		name: "Dirt",
		color: "#76492F", //"#7F3F00",
		hardness: 1,
	},
	stone: {
		name: "Stone",
		color: "#919299", //"#A5A4A5", //"#8E9099",
		hardness: 2,		
	},
	coal: {
		name: "Coal",
		color: "#191B19", //"#242624",
		hardness: 1.5,		
	},
	copper: {
		name: "Copper Ore",
		color: "#C6774F", //"#FF7F00",
		hardness: 2.5,		
	},
	iron: {
		name: "Iron Ore",
		color: "#C16932",
		hardness: 2.25,		
	},
	silver: {
		name: "Silver Ore",
		color: "#EBF7E2",
		hardness: 2.1,		
	},
	sulfur: {
		name: "Sulfur",
		color: "#FBF98F",
		hardness: 2.2,		
	},
	emerald: {
		name: "Emerald",
		color: "#5AAB65",
		hardness: 2.3,		
	},
	ruby: {
		name: "Ruby",
		color: "#DC4135",
		hardness: 2.3,		
	},
	sapphire: {
		name: "Sapphire",
		color: "#1A8AD4",
		hardness: 2.3,		
	},
	gold: {
		name: "Gold Ore",
		color: "#DEB826",
		hardness: 2.1,		
	},
	quartz: {
		name: "Quartz",
		color: "#E1E1E1",
		hardness: 2.4,		
	},
	amethyst: {
		name: "Amethyst",
		color: "#884FA4",
		hardness: 2.3,		
	},
	diamond: {
		name: "Diamond",
		color: "#A3F4FF",
		hardness: 2.5,		
	},
	obsidian: {
		name: "Obsidian",
		color: "#3B1C7F",
		hardness: 8,		
	},
	hellstone: {
		name: "Hellstone",
		color: "#7F2D2D",
		hardness: 4,		
	},
	ignis: {
		name: "Ignis",
		color: "#B7281B",
		hardness: 3.5,		
	},
	promethium: {
		name: "Promethium Ore",
		color: "#4A4638",
		hardness: 8,		
	},
	mithril: {
		name: "Mithril Ore",
		color: "#5B8E9A",
		hardness: 5,		
	},
	sanctite: {
		name: "Sanctite",
		color: "#CAB39E",
		hardness: 6,		
	},
	malachite: {
		name: "Malachite Ore",
		color: "#378151",
		hardness: 10,		
	},
	azurite: {
		name: "Azurite Ore",
		color: "#2F41B4",
		hardness: 9,		
	},
	uranium: {
		name: "Uranium Ore",
		color: "#95B66B",
		hardness: 2.4,		
	},
	slime: {
		name: "Slime block",
		color: "#75F93E",
		hardness: 10,		
	},
	clay: {
		name: "Clay",
		color: "#A55242", //"#B24A35",
		hardness: 1.2,		
	},
	tin: {
		name: "Tin Ore",
		color: "#A4BCC1",
		hardness: 2.3,		
	},
	amber: {
		name: "Amber",
		hardness: 1.8,
		background: "linear-gradient(320deg,hsl(23deg 88% 48%) 0%,hsl(27deg 90% 48%) 20%,hsl(30deg 91% 49%) 40%,hsl(36deg 100% 48%) 60%,hsl(44deg 100% 50%) 80%,hsl(52deg 100% 50%) 100%)"
	},
	// special blocks
	bedrock: {
		name: "Bedrock",
		color: "#666066", //"#443D4C",
		unbreakable: true,		
	},
	end: {
		name: "End Ore",
		color: "#000000",
		unbreakable: true,		
	},
}
function makeBlock(type) {
	return {
		block: type,
		revealed: false,
	}	
}