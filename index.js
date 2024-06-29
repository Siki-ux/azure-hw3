const express = require('express');
const { QueueServiceClient, StorageSharedKeyCredential } = require('@azure/storage-queue');
const app = express();
const port = process.env.PORT || 3000;

const account = 'pa200hw3adde';
const accountKey = 'o7LQowJgwMtPpwU/H/6cVQrVLF611NQ99rG8nzUdb3LXsAD/DENi1P2jmG0ca/KlkKvS4tgjTeMG+ASt7cb6ag==';
const queueName = 'meas-queue';

const queueServiceClient = new QueueServiceClient(
  `https://${account}.queue.core.windows.net`,
  new StorageSharedKeyCredential(account, accountKey)
);

app.use(express.json());

app.post('/measurement', async (req, res) => {
  const { sensorId, value, timestamp } = req.body;

  const queueClient = queueServiceClient.getQueueClient(queueName);
  const message = JSON.stringify({ sensorId, value, timestamp });
  await queueClient.sendMessage(Buffer.from(message).toString('base64'));

  res.send('Measurement enqueued');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
