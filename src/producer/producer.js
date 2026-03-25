const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'device-simulator',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();

async function connectProducer() {
  await producer.connect();
  console.log('Kafka Producer connected');
}

async function sendEvents(events) {
  const messages = events.map((event) => ({
    value: JSON.stringify(event),
  }));

  if (messages.length > 0) {
    await producer.send({
      topic: 'device-events',
      messages,
    });
  }
}

module.exports = { connectProducer, sendEvents };
