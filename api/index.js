import app, { ensureReady } from '../src/app.js';

// Kick off DB connect/seed once per container, but NEVER block a request on it.
// A hanging Atlas connection must not be able to time out the function.
ensureReady().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Background initialization failed:', error);
});

export default function handler(req, res) {
  try {
    return app(req, res);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to handle request:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}