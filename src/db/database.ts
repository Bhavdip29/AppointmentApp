import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'Appointments.db',
    location: 'default',
  },
  () => console.log('Database opened'),
  (err) => console.error('Error opening database:', err)
);

export const initializeDatabase = () => {
  db.transaction((tx) => {
    // Create Appointments table
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        contact TEXT,
        date TEXT,
        time TEXT,
        reason TEXT,
        status TEXT DEFAULT 'Pending'
      );`
    );

    // Create Feedback table
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rating INTEGER NOT NULL
      );`
    );
  });
};

export const getDatabase = () => db;
