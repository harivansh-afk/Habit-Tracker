import express from 'express';
import cors from 'cors';
import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'habits.db');

let db;
let SQL;

async function initializeDatabase() {
  SQL = await initSqlJs();

  if (existsSync(dbPath)) {
    const data = readFileSync(dbPath);
    db = new SQL.Database(data);
  } else {
    db = new SQL.Database();
    // Initialize tables
    db.run(`
      CREATE TABLE habits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      );

      CREATE TABLE habit_completions (
        habit_id INTEGER,
        completion_date TEXT,
        PRIMARY KEY (habit_id, completion_date),
        FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
      );
    `);
    saveDatabase();
  }
}

function saveDatabase() {
  const data = db.export();
  writeFileSync(dbPath, Buffer.from(data));
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'public'))); // Serve static files from the 'public' directory

// Initialize database before starting server
await initializeDatabase();

// Get all habits with their completion dates
app.get('/api/habits', (req, res) => {
  const habits = db.exec(`
    SELECT 
      h.id,
      h.name,
      GROUP_CONCAT(hc.completion_date) as completedDates
    FROM habits h
    LEFT JOIN habit_completions hc ON h.id = hc.habit_id
    GROUP BY h.id
  `)[0];

  const formattedHabits = habits ? habits.values.map(([id, name, completedDates]) => ({
    id,
    name,
    completedDates: completedDates ? completedDates.split(',') : []
  })) : [];

  res.json(formattedHabits);
});

// Add new habit
app.post('/api/habits', (req, res) => {
  const { name } = req.body;
  db.run('INSERT INTO habits (name) VALUES (?)', [name]);
  const id = db.exec('SELECT last_insert_rowid()')[0].values[0][0];
  saveDatabase();
  res.json({ id, name, completedDates: [] });
});

// Toggle habit completion
app.post('/api/habits/:id/toggle', (req, res) => {
  const { id } = req.params;
  const { date } = req.body;

  const existing = db.exec(
    'SELECT * FROM habit_completions WHERE habit_id = ? AND completion_date = ?',
    [id, date]
  )[0];

  if (existing) {
    db.run(
      'DELETE FROM habit_completions WHERE habit_id = ? AND completion_date = ?',
      [id, date]
    );
  } else {
    db.run(
      'INSERT INTO habit_completions (habit_id, completion_date) VALUES (?, ?)',
      [id, date]
    );
  }

  saveDatabase();
  res.json({ success: true });
});

// Update habit
app.put('/api/habits/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  db.run('UPDATE habits SET name = ? WHERE id = ?', [name, id]);
  saveDatabase();
  res.json({ success: true });
});

// Delete habit
app.delete('/api/habits/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM habits WHERE id = ?', [id]);
  saveDatabase();
  res.json({ success: true });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});