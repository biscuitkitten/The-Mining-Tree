// Fake prestige button clickable
let pBtnStyle = {
	'height': '120px',
	'width': '180px',
	'border-radius': '25%',
	'border': '4px solid',
	'border-color': 'rgba(0, 0, 0, 0.125)',
	//'font-weight': 'bold',
	'font-size': '13px',
}

// radial-gradient(red, yellow, green)
let testLight = false
function updateGameBackground() {
	let lavaTint = document.getElementById("lavaTint")
	let darkTint = document.getElementById("darkTint")
	let areaTint = document.getElementById("areaTint")
	let aboveLava = tmp.mod.nearLava
	let headlampOn = (player.inv.headlamp && options.headlampOn)
	let depth = player.mine.inMine ? player.mine.depth : 0
	let inHell = (player.mine.inMine == 1 && player.mine.depth > 50)
	

	if (player.mine.inMine && !headlampOn) {
		darkTint.style.opacity = Math.min((depth+1)/10,0.5)
	}
	else {
		darkTint.style.opacity = 0	
	}
	
	if (aboveLava) {
		lavaTint.style.background = "#FF0000"
		lavaTint.style.opacity = headlampOn ? 0.02 : 0.04
	}
	else {
		lavaTint.style.background = "#FF0000"
		lavaTint.style.opacity = 0	
	}
	
	if (inHell) {
		areaTint.style.background = "#7F0000"
		areaTint.style.opacity = 1/16
	}
	else {
		areaTint.style.background = "black"
		areaTint.style.opacity = 0	
	}


	// Update background
	// Background is based on current tab and headlamp
	if (player.tab == "town") {
		return "#191311"
	}
	if (player.tab == "forest") {
		return "#0C190D"
	}
	
	if(player.mine.inMine && !headlampOn) {
		if (inHell) {
			return "#070000"
		}
		return "#000000"
	}
	if (headlampOn) {
		if (player.inv.headlamp == 1) {
			if (inHell) {
				return "#170f0f"
			}
			return "#0f0f0f"
		}
	}
	if (player.tab == "mine") {
		return "#131319"
	}
	return "#0f0f0f"
}