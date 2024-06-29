const express = require('express');
const { QueueServiceClient, StorageSharedKeyCredential } = require('@azure/storage-queue');
const app = express();
const port = process.env.PORT || 3000;

const account = 'hw3ac';
const accountKey = 'MT0siz+YTGDb0QiXfFiN4DnbaXSmLVuu+8BoaMTic6USKDfFc0zQfA/Q79qXnmqGDvNAQL8phcna+AStlFTXyw==';
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
