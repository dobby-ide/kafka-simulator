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

module.exports = { createDevice };
