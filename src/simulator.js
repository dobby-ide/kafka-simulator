const state = {
  activity: "idle",
  heartRate: 75,
  steps: 0,
  lastStepEmit: Date.now(),
};

function randomBetween(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateState(state) {
	if(Math.random() < 0.05) {
		const activities = ["idle", "walking", "running", "cycling"];
		state.activity = activities[randomBetween(0, activities.length - 1)];
	}

	//updates heart rate and steps based on activity
	switch(state.activity) {
		case "idle":
			state.heartRate = randomBetween(60, 80);
			break;
		case "walking":
			state.heartRate = randomBetween(80, 100);
			break;
		case "running":
			state.heartRate = randomBetween(100, 140);
			break;
		case "cycling":
			state.heartRate = randomBetween(90, 120);
			break;
	}
	if(state.activity === "walking" || state.activity === "running") {
		const now = Date.now();
		if(now - state.lastStepEmit > 1000) {
			state.steps += state.activity === "walking" ? randomBetween(1, 3) : randomBetween(3, 6);
			state.lastStepEmit = now;
		}
	}
}






// Simulate the state of the system
setInterval(() => {
  updateState(state);
  const events = generateEvents(state);
  emitEvents(events);
}, 1000);
