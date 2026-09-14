/**
 * اجرای هم‌زمان بک‌اند امن (Express) و فرانت‌اند (Vite) در حالت توسعه
 * ------------------------------------------------------------------
 *   • بک‌اند : http://0.0.0.0:8787  (همه مسیرهای /api)
 *   • فرانت  : http://0.0.0.0:3000  (پروکسی /api به بک‌اند)
 *
 * با Ctrl+C هر دو فرآیند به‌صورت تمیز خاتمه می‌یابند.
 */
import { spawn } from 'node:child_process';
import process from 'node:process';

const API_PORT = process.env.API_PORT || process.env.PORT || '8787';
const WEB_PORT = process.env.WEB_PORT || '3000';

const children = [];

function run(name, command, args, env = {}) {
  const child = spawn(command, args, {
    stdio: 'inherit',
    env: { ...process.env, ...env },
    shell: process.platform === 'win32',
  });
  child.on('exit', (code, signal) => {
    if (shuttingDown) return;
    console.log(`[dev] فرآیند «${name}» با کد ${code ?? signal} پایان یافت.`);
    shutdown();
  });
  children.push(child);
  return child;
}

let shuttingDown = false;
function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    try { child.kill('SIGTERM'); } catch { /* ignore */ }
  }
  setTimeout(() => process.exit(0), 500);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

console.log('\n🛡️  حالت توسعه اتاق جنگ — بک‌اند امن + فرانت‌اند\n');

run('api', process.execPath, ['server/index.js'], { PORT: API_PORT, HOST: '0.0.0.0' });

// کمی تأخیر تا بک‌اند بالا بیاید، سپس Vite
setTimeout(() => {
  run('vite', 'npx', ['vite', '--port', WEB_PORT, '--host', '0.0.0.0'], {
    API_PORT,
    VITE_API_PROXY_TARGET: `http://127.0.0.1:${API_PORT}`,
  });
}, 600);
