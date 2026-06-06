module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      connectionString: env('DATABASE_URL'),
      ssl: { rejectUnauthorized: false }, // Bắt buộc với Supabase
    },
    pool: { min: 0, max: 10 },
  },
});