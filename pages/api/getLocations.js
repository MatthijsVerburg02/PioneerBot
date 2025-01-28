import { Pool } from "pg";

// Connect to the database
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

// This function fetches the locations from the database
export default async function handler(req, res) {
  try {
    const query = `
      SELECT latitude, longitude, point_id
      FROM points
    `;
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}