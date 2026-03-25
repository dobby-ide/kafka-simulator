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
        deviceId: state.deviceId,
        type: 'activity_change',
        timestamp: Date.now(),
        value: newActivity,
      };
    }
  }
  return null;
}
function updateState(device, tick) {
  const events = [];
  console.log(tick);
  if (tick % 3 === 0) {
    const activityEvent = maybeChangeActivity(device);
    if (activityEvent) {
      events.push(activityEvent);
    }
  }

  //updates heart rate and steps based on activity
  switch (device.activity) {
    case 'idle':
      device.heartRate = randomBetween(60, 80);
      break;
    case 'walking':
      device.heartRate = randomBetween(80, 100);
      break;
    case 'running':
      device.heartRate = randomBetween(100, 140);
      break;
    case 'cycling':
      device.heartRate = randomBetween(90, 120);
      break;
  }
  if (device.activity === 'walking' || device.activity === 'running') {
    const now = Date.now();
    if (now - device.lastStepUpdate > 1000) {
      device.steps +=
        device.activity === 'walking'
          ? randomBetween(1, 3)
          : randomBetween(3, 6);
      device.lastStepUpdate = now;
    }
  }
  return events;
}

module.exports = { updateState };