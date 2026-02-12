#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

const PORT = process.env.PORT || 3456;
const serverPath = path.join(__dirname, '..', 'server.js');

console.log('\n✨ Simple Todo App 시작 중...\n');

const server = spawn('node', [serverPath], {
  stdio: 'inherit',
  env: { ...process.env, PORT }
});

server.on('error', (err) => {
  console.error('서버 시작 실패:', err);
  process.exit(1);
});

server.on('exit', (code) => {
  if (code !== 0) {
    console.error(`서버가 비정상적으로 종료되었습니다 (코드: ${code})`);
  }
  process.exit(code);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Todo App을 종료합니다...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  server.kill('SIGTERM');
});
