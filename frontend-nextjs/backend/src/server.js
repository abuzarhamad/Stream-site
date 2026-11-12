import net from 'node:net';
import app from './app.js';
import { config } from './config.js';

const getAvailablePort = (port) =>
  new Promise((resolve, reject) => {
    const server = net.createServer();

    server.once('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        resolve(getAvailablePort(port + 1));
        return;
      }

      reject(error);
    });

    server.listen(port, () => {
      const { port: actualPort } = server.address();
      server.close(() => resolve(actualPort));
    });
  });

const startServer = async () => {
  const port = Number(process.env.PORT || config.port || 5000);
  const availablePort = await getAvailablePort(port);

  app.listen(availablePort, () => {
    console.log(`Streamify backend running on http://localhost:${availablePort}`);
  });
};

startServer();
