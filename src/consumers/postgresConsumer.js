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

// Aggregation buffer: deviceId -> windowStart -> { heartRates, steps }
const buffer = {};
const WINDOW_SIZE = 5000; // 5 seconds

// Calculate start of window for a given timestamp
function getWindowStart(timestamp) {
  return Math.floor(timestamp / WINDOW_SIZE) * WINDOW_SIZE;
}

async function run() {
  await consumer.connect();
  console.log('Kafka Consumer connected');

  await consumer.subscribe({ topic: 'device-events', fromBeginning: false });

  // Message processing
  await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value.toString());
      const device = event.deviceId;
      const windowStart = getWindowStart(event.timestamp);

      if (!buffer[device]) {
        buffer[device] = {};
      }

      if (!buffer[device][windowStart]) {
        buffer[device][windowStart] = { heartRates: [], steps: 0 };
      }

      // Aggregate the event
      if (event.type === 'heart_rate') {
        buffer[device][windowStart].heartRates.push(event.value);
      }

      if (event.type === 'steps') {
        buffer[device][windowStart].steps += event.total;
      }
    },
  });

  setInterval(async () => {
    const now = Date.now();

    for (const device in buffer) {
      for (const windowStart in buffer[device]) {
        // Only flush windows that are complete
        if (now - windowStart < WINDOW_SIZE) continue;

        const data = buffer[device][windowStart];

        if (data.heartRates.length === 0 && data.steps === 0) continue;

        const avgHeartRate =
          data.heartRates.length > 0
            ? data.heartRates.reduce((a, b) => a + b, 0) /
              data.heartRates.length
            : null;

        const query = `
          INSERT INTO watch_metrics_agg
          (device_id, window_start, avg_heart_rate, total_steps)
          VALUES ($1, $2, $3, $4)
        `;
        const values = [
          device,
          parseInt(windowStart),
          avgHeartRate,
          data.steps,
        ];

        try {
          await pool.query(query, values);
          console.log(`Inserted window ${windowStart} for ${device}`);
        } catch (err) {
          console.error('DB insert error:', err);
        }
        delete buffer[device][windowStart];
      }
    }
  }, 2000);
}

run().catch(console.error);
