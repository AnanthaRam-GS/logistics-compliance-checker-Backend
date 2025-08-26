const http = require('http');
const app = require('./src/app');
const { connectDB } = require('./src/config/db');
require('dotenv').config();

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await connectDB();
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(' Failed to start server:', err);
    process.exit(1);
  }
})();
