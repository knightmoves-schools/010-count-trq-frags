const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

function runScript(db, script) {
  const sql = fs.readFileSync(script, 'utf8');
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function getAllFromEmployees(db) {
  const sql = `SELECT * FROM Employee`;
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if(err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function countDenver(results) {
  let denver = 0;
  results.forEach((row) => {
    if(row.LOCATION == "Denver")
      denver++;
  });
  return denver;
}

describe('the SQL in the `exercise.sql` file', () => {
  let db;
  let scriptPath;

  beforeAll(() => {
    const dbPath = path.resolve(__dirname, '..', 'lesson10.db');
    db = new sqlite3.Database(dbPath);
    scriptPath = path.resolve(__dirname, '..', 'exercise.sql');
  });

  afterAll(() => {
    db.close();
  });

  it('should return a count of employees with a location of `Denver` titled `Colorado Employees`', async () => {
    const results = await runScript(db, scriptPath);
    const employees = await getAllFromEmployees(db); 
  
    expect(results[0]['Colorado Employees']).toBe(countDenver(employees)); 
  });
});
