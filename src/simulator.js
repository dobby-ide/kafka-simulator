const state = {
  activity: 'idle',
  heartRate: 75,
  steps: 0,
  lastStepEmit: Date.now(),
  lastStepUpdate: Date.now(),
};
let tick = 0;

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function maybeChangeActivity(state) {
  console.log('Checking for activity change...');
  if (Math.random() < 0.05) {
    const activities = ['idle', 'walking', 'running', 'cycling'];
    const newActivity = activities[randomBetween(0, activities.length - 1)];

    if (newActivity !== state.activity) {
      console.log(`Activity changed from ${state.activity} to ${newActivity}`);
      state.activity = newActivity;
      return {
        type: 'activity_change',
        timestamp: Date.now(),
        value: newActivity,
      };
    }
  }
  return null;
}

function updateState(state, tick) {
  const events = [];
  console.log(tick);
  if (tick % 3 === 0) {
    const activityEvent = maybeChangeActivity(state);
    if (activityEvent) {
      events.push(activityEvent);
    }
  }

  //updates heart rate and steps based on activity
  switch (state.activity) {
    case 'idle':
      state.heartRate = randomBetween(60, 80);
      break;
    case 'walking':
      state.heartRate = randomBetween(80, 100);
      break;
    case 'running':
      state.heartRate = randomBetween(100, 140);
      break;
    case 'cycling':
      state.heartRate = randomBetween(90, 120);
      break;
  }
  if (state.activity === 'walking' || state.activity === 'running') {
    const now = Date.now();
    if (now - state.lastStepUpdate > 1000) {
      state.steps +=
        state.activity === 'walking'
          ? randomBetween(1, 3)
          : randomBetween(3, 6);
      state.lastStepUpdate = now;
    }
  }
  return events;
}

function generateEvents(state, tick) {
  const now = Date.now();
  const events = [];

  // Heart rate event every tick
  events.push({
    type: 'heart_rate',
    timestamp: now,
    value: state.heartRate,
  });

  // Steps event every 3 ticks or if steps have been updated
  if (tick % 3 === 0) {
    events.push({
      type: 'steps',
      timestamp: now,
      total: state.steps,
    });
    state.lastStepEmit = now;
  }

  return events;
}

function emitEvents(events) {
  events.forEach((e) => {
    console.log(e);
  });
}

// Simulate the state of the system
setInterval(() => {
  tick++;
  const stateEvents = updateState(state, tick);
  const generatedEvents = generateEvents(state, tick);
  emitEvents([...stateEvents, ...generatedEvents]);
}, 1000);
