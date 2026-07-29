import { execFileSync, spawn } from 'node:child_process';

const port = 8040;

function isPortAvailable(targetPort) {
  try {
    const output = execFileSync('lsof', ['-nP', `-tiTCP:${targetPort}`, '-sTCP:LISTEN'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });

    return output.trim().length === 0;
  } catch {
    return true;
  }
}

const available = isPortAvailable(port);

if (!available) {
  console.error(`Error: el puerto ${port} ya está en uso. Libéralo y vuelve a ejecutar npm run dev.`);
  process.exit(1);
}

const child = spawn('npx', ['vite', 'dev', '--port', String(port), '--strictPort'], {
  stdio: 'inherit',
  shell: false,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});