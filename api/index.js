import app, { ensureReady } from '../src/app.js';

let readyPromise;

export default async function handler(req, res) {
  try {
    if (!readyPromise) {
      readyPromise = ensureReady();
    }

    await readyPromise;

    return app(req, res);
  } catch (error) {
    console.error('Failed to handle request:', error);
    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
}