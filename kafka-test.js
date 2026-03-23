const {Kafka} = require('kafkajs');

async function run() {
  const kafka = new Kafka({
	clientId: 'test-client',
	brokers: ['localhost:9092']
  });

  const admin = kafka.admin();
  await admin.connect();

  await admin.createTopics({
	topics: [{topic: 'device-events', numPartitions: 1}],
  });
  console.log('Topic created');

  await admin.disconnect();


  //producer test
  const producer = kafka.producer();
  await producer.connect();
  await producer.send({
	topic: 'device-events',
	messages: [
	  {value: 'Hello KafkaJS user!'},
	],
  });
  console.log('Message sent');
  await producer.disconnect();

  //consumer test
  const consumer = kafka.consumer({groupId: 'test-group'});
  await consumer.connect();
  await consumer.subscribe({topic: 'device-events', fromBeginning: true});

  await consumer.run({
	eachMessage: async ({topic, partition, message}) => {
	  console.log({
		value: message.value.toString(),
	  });
	},
  });
}

run().catch(console.error);