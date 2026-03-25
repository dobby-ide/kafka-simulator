const { createDevice } = require('./devices');
const { updateState } = require('./stateUpdater');
const { generateEvents } = require('./eventGenerator');
const { emitEvents } = require('./emitter');

const { connectProducer, sendEvents } = require('../producer/producer');

const devices = [
  createDevice('watch-001'),
  createDevice('watch-002'),
  createDevice('watch-003'),
];

let tick = 0;
async function startSimulator() {
  await connectProducer();

  setInterval(async () => {
    tick++;

    for (const device of devices) {
      const stateEvents = updateState(device, tick);
      const generatedEvents = generateEvents(device, tick);
      const allEvents = [...stateEvents, ...generatedEvents];

      await sendEvents(allEvents);
    }
  }, 1000);
}

startSimulator().catch(console.error);
