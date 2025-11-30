-- Chats table
CREATE TABLE IF NOT EXISTS chats (
  id TEXT PRIMARY KEY,
  name TEXT,
  type TEXT DEFAULT 'direct' CHECK(type IN ('direct', 'group')),
  createdAt TEXT NOT NULL
);

-- Junction table for chat participants (many-to-many)
CREATE TABLE IF NOT EXISTS chat_members (
  chatId TEXT NOT NULL,
  userId TEXT NOT NULL,
  joinedAt TEXT NOT NULL,
  PRIMARY KEY (chatId, userId),
  FOREIGN KEY (chatId) REFERENCES chats(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_chat_members_user ON chat_members(userId);
CREATE INDEX IF NOT EXISTS idx_chat_members_chat ON chat_members(chatId);

