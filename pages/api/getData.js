import { Pool } from "pg";

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

function replaceUnderscoreWithSpace(str) {
  return str.replace(/_/g, ' ').replace(/\^/g, ' ');
}

export default async function handler(req, res) {
  try {
    // Haal sensor en limit op uit de queryparameters
    const { sensor, location, timestamp1, timestamp2 } = req.query;
    if (!sensor ||  !location || !timestamp1 || !timestamp2) {
      return res.status(400).json({ error: "Missing required parameters" });
    }
    const timestamp_1 = replaceUnderscoreWithSpace(timestamp1);
    const timestamp_2 = replaceUnderscoreWithSpace(timestamp2);
    const query = `
      SELECT  "${sensor}", timestamp, point_id
      FROM datapoints
      WHERE point_id = ${location}
      AND timestamp BETWEEN '${timestamp_1}' AND '${timestamp_2}'
      ORDER BY timestamp ASC
    `;
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: `Failed to fetch data: ${error.message}` });
  }
}

