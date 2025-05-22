const { Pool } = require('pg');


const pool = new Pool({
  connectionString: `postgresql://paystack_user:BolwnSaxlYNfWeVcvu7YYPY69weiB27Q@dpg-d0nip0mmcj7s73e2blhg-a.oregon-postgres.render.com/paystack`,
  ssl:{ rejectUnauthorized: false },
});

// Optional: test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('PostgreSQL connection error:', err.stack);
    process.exit(1);
  } else {
    console.log('Connected to PostgreSQL at', res.rows[0].now);
  }
});

// Global error handlers
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

module.exports = pool;
