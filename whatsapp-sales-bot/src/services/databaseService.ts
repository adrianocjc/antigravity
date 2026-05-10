import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure data directory exists
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(path.join(dataDir, 'bot.db'));

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    phoneId TEXT PRIMARY KEY,
    state TEXT NOT NULL,
    data TEXT
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phoneId TEXT NOT NULL,
    customerName TEXT,
    items TEXT NOT NULL,
    totalPrice REAL NOT NULL,
    deliveryDate TEXT NOT NULL,
    status TEXT NOT NULL, -- 'PENDING', 'PAID', 'DELIVERED', etc.
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS scheduled_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phoneId TEXT NOT NULL,
    orderId INTEGER NOT NULL,
    messageType TEXT NOT NULL, -- 'REMINDER_24H' or 'FEEDBACK_2D'
    scheduledFor DATETIME NOT NULL,
    sent INTEGER DEFAULT 0,
    FOREIGN KEY(orderId) REFERENCES orders(id)
  );
`);

export interface Session {
  phoneId: string;
  state: string;
  data: any;
}

export const dbService = {
  getSession(phoneId: string): Session | null {
    const row = db.prepare('SELECT * FROM sessions WHERE phoneId = ?').get(phoneId) as any;
    if (row) {
      return {
        phoneId: row.phoneId,
        state: row.state,
        data: row.data ? JSON.parse(row.data) : {}
      };
    }
    return null;
  },

  setSession(phoneId: string, state: string, data: any) {
    db.prepare('INSERT OR REPLACE INTO sessions (phoneId, state, data) VALUES (?, ?, ?)')
      .run(phoneId, state, JSON.stringify(data));
  },

  clearSession(phoneId: string) {
    db.prepare('DELETE FROM sessions WHERE phoneId = ?').run(phoneId);
  },

  createOrder(phoneId: string, customerName: string, items: any[], totalPrice: number, deliveryDate: string) {
    const stmt = db.prepare('INSERT INTO orders (phoneId, customerName, items, totalPrice, deliveryDate, status) VALUES (?, ?, ?, ?, ?, ?)');
    const info = stmt.run(phoneId, customerName, JSON.stringify(items), totalPrice, deliveryDate, 'PENDING');
    return info.lastInsertRowid;
  },
  
  scheduleMessage(phoneId: string, orderId: number | bigint, messageType: string, scheduledFor: string) {
    db.prepare('INSERT INTO scheduled_messages (phoneId, orderId, messageType, scheduledFor) VALUES (?, ?, ?, ?)')
      .run(phoneId, orderId, messageType, scheduledFor);
  },

  getPendingScheduledMessages(currentTime: string) {
    return db.prepare('SELECT * FROM scheduled_messages WHERE sent = 0 AND scheduledFor <= ?').all(currentTime) as any[];
  },

  markMessageAsSent(id: number) {
    db.prepare('UPDATE scheduled_messages SET sent = 1 WHERE id = ?').run(id);
  }
};
