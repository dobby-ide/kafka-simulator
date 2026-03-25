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

module.exports = { generateEvents };