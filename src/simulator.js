function createDevice(deviceId) {
  return {
    deviceId,
    batteryLevel: 100,
    latitude: 37.7749,
    longitude: -122.4194,
    caloriesBurned: 0,
    isSleeping: false,
    activity: 'idle',
    heartRate: 75,
    steps: 0,
    lastStepEmit: Date.now(),
    lastStepUpdate: Date.now(),
  };
}

const devices = [
  createDevice('watch-001'),
  createDevice('watch-002'),
  createDevice('watch-003'),
];

console.log(devices);
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

function generateEvents(device, tick) {
  const now = Date.now();
  const events = [];

  // Heart rate event every tick
  events.push({
    deviceId: device.deviceId,
    type: 'heart_rate',
    timestamp: now,
    value: device.heartRate,
  });

  // Steps event every 3 ticks or if steps have been updated
  if (tick % 3 === 0) {
    events.push({
      deviceId: device.deviceId,
      type: 'steps',
      timestamp: now,
      total: device.steps,
    });
    device.lastStepEmit = now;
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

  devices.forEach((device) => {
    const stateEvents = updateState(device, tick);
    const generatedEvents = generateEvents(device, tick);
    emitEvents([...stateEvents, ...generatedEvents]);
  });
}, 1000);
