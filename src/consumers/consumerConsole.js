//runs independently, consuming events from the "device-events" topic and logging them to the console
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'console-consumer',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'console-group' });

async function run() {
	await consumer.connect();
	console.log('Kafka Consumer connected');
	await consumer.subscribe({ topic: 'device-events', fromBeginning: true });

	await consumer.run({
		eachMessage: async ({ topic, partition, message }) => {
			console.log({
				value: message.value.toString(),
			});
		},
	});
}

run().catch(console.error);