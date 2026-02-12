const express = require('express');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3456;

// Data directory in user's home
const DATA_DIR = path.join(os.homedir(), '.simple-todo-app');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  console.log(`📁 데이터 디렉토리 생성: ${DATA_DIR}`);
}

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper function to get file path for a date
function getDataFilePath(date) {
  return path.join(DATA_DIR, `${date}.json`);
}

// API Routes
// GET /api/todos/:date - Get todos for a specific date
app.get('/api/todos/:date', (req, res) => {
  try {
    const { date } = req.params;
    const filePath = getDataFilePath(date);

    if (!fs.existsSync(filePath)) {
      return res.json([]);
    }

    const data = fs.readFileSync(filePath, 'utf8');
    const todos = JSON.parse(data);
    res.json(todos);
  } catch (error) {
    console.error('Error reading todos:', error);
    res.status(500).json({ error: 'Failed to read todos' });
  }
});

// POST /api/todos/:date - Save todos for a specific date
app.post('/api/todos/:date', (req, res) => {
  try {
    const { date } = req.params;
    const todos = req.body;
    const filePath = getDataFilePath(date);

    fs.writeFileSync(filePath, JSON.stringify(todos, null, 2), 'utf8');
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving todos:', error);
    res.status(500).json({ error: 'Failed to save todos' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Todo App이 실행 중입니다!`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`💾 데이터 저장 위치: ${DATA_DIR}`);
  console.log(`\n종료하려면 Ctrl+C를 누르세요.\n`);

  // Auto-open browser (optional)
  const open = (url) => {
    const start = process.platform === 'darwin' ? 'open' :
                  process.platform === 'win32' ? 'start' : 'xdg-open';
    require('child_process').exec(`${start} ${url}`);
  };

  setTimeout(() => {
    open(`http://localhost:${PORT}`);
  }, 500);
});
