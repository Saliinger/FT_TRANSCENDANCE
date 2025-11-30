CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  displayName TEXT NOT NULL,
  oauthProvider TEXT,
  oauthId TEXT,
  twoFactorEnabled INTEGER DEFAULT 0,
  twoFactorSecret TEXT,
  status TEXT DEFAULT 'offline' CHECK(status IN ('online', 'offline', 'in-game')),
  lastSeen TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_oauth ON users(oauthProvider, oauthId);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
