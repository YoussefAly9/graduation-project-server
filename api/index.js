import express from 'express';

let appInstance = null;
let bootError = null;

const loadApp = async () => {
  if (bootError) {
    throw bootError;
  }

  if (!appInstance) {
    try {
      const { default: app, ensureReady } = await import('../src/app.js');
      ensureReady().catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Background initialization failed:', error);
      });
      appInstance = app;
    } catch (error) {
      bootError = error;
      // eslint-disable-next-line no-console
      console.error('Failed to boot API:', error);
      throw error;
    }
  }

  return appInstance;
};

const bootFailureApp = express();
bootFailureApp.all('*', (_req, res) => {
  res.status(500).json({
    message: 'API failed to start',
    error: bootError?.message || 'Unknown boot error'
  });
});

export default async function handler(req, res) {
  try {
    const app = await loadApp();
    return app(req, res);
  } catch (error) {
    return bootFailureApp(req, res);
  }
}
