const { Kafka } = require('kafkajs');
const { Pool } = require('pg');

// Kafka setup
const kafka = new Kafka({
  clientId: 'db-consumer',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'db-group' });

// PostgreSQL setup
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'admin',
  password: 'admin',
  database: 'smartwatch',
});

async function run() {
  await consumer.connect();
  console.log('Kafka Consumer connected');

  await consumer.subscribe({ topic: 'device-events', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value.toString());

      // Map simulator fields to table columns
      const value = event.value !== undefined ? event.value : event.total;

      const query = `
        INSERT INTO watch_event_metrics
        (device_id, timestamp, type, value)
        VALUES ($1, $2, $3, $4)
      `;

      const values = [event.deviceId, event.timestamp, event.type, value];

      try {
        await pool.query(query, values);
        console.log(`Inserted ${event.type} for ${event.deviceId}`);
      } catch (err) {
        console.error('DB insert error:', err);
      }
    },
  });
}

run().catch(console.error);
