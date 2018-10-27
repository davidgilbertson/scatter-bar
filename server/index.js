import path from 'path';
import express from 'express';
import compression from 'compression';

const app = express();

app.use(compression());

app.use(express.static(
  path.resolve(__dirname, '../build'),
  { maxAge: '100d' },
));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../build/index.html'));
});

const PORT = process.env.PORT || 3031;

app.listen(PORT, err => {
  if (err) console.error(err);
  console.log(`Server listening on http://localhost:${PORT}`);
});
