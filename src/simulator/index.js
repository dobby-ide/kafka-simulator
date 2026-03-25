const { createDevice } = require('./devices');
const { updateState } = require('./stateUpdater');
const { generateEvents } = require('./eventGenerator');
const { emitEvents } = require('./emitter');

const devices = [
  createDevice('watch-001'),
  createDevice('watch-002'),
  createDevice('watch-003'),
];

let tick = 0;

setInterval(() => {
  tick++;

  devices.forEach((device) => {
    const stateEvents = updateState(device, tick);
    const generatedEvents = generateEvents(device, tick);
    emitEvents([...stateEvents, ...generatedEvents]);
  });
}, 1000);
