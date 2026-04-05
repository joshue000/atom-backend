import app from './infrastructure/app';

const PORT = parseInt(process.env['PORT'] ?? '3000', 10);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[dev-server] running on http://localhost:${PORT}`);
});
