/* eslint-disable no-console */
const { spawn, execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const isWin = process.platform === 'win32';

function quoteArg(s) {
  // Very small quoting helper for Windows + shell mode.
  const str = String(s);
  return `"${str.replaceAll('"', '\\"')}"`;
}

function resolveAdbPath() {
  const candidates = [];
  const sdkRoot = process.env.ANDROID_SDK_ROOT || process.env.ANDROID_HOME;
  if (sdkRoot) {
    candidates.push(path.join(sdkRoot, 'platform-tools', isWin ? 'adb.exe' : 'adb'));
  }
  if (process.env.LOCALAPPDATA && isWin) {
    candidates.push(
      path.join(process.env.LOCALAPPDATA, 'Android', 'Sdk', 'platform-tools', 'adb.exe'),
    );
  }

  // Fallback to whatever is on PATH.
  candidates.push(isWin ? 'adb.exe' : 'adb');

  for (const c of candidates) {
    // If it's a real path, ensure it exists. If it's just a command name, return it.
    const looksLikePath = c.includes('\\') || c.includes('/') || c.includes(':');
    if (!looksLikePath || fs.existsSync(c)) return c;
  }

  return isWin ? 'adb.exe' : 'adb';
}

function tryGetPreferredAndroidDeviceId() {
  const adb = resolveAdbPath();
  try {
    const cmd = `${quoteArg(adb)} devices`;
    const out = execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'], shell: true }).toString();

    const lines = out.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    // Skip header: "List of devices attached"
    const deviceLines = lines.filter((l) => !l.toLowerCase().startsWith('list of devices'));

    const deviceIds = deviceLines
      .map((l) => l.split(/\s+/))
      .filter((parts) => parts.length >= 2 && parts[1] === 'device')
      .map((parts) => parts[0]);

    if (deviceIds.length === 0) return null;

    // Prefer emulator if present.
    const emulator = deviceIds.find((id) => id.startsWith('emulator-'));
    return emulator || deviceIds[0];
  } catch {
    return null;
  }
}

function run(cmd, args, opts = {}) {
  return spawn(cmd, args, { stdio: 'inherit', shell: true, ...opts });
}

function runWithCapture(cmd, args, opts = {}) {
  const child = spawn(cmd, args, { shell: true, stdio: ['inherit', 'pipe', 'pipe'], ...opts });
  let combined = '';

  child.stdout?.on('data', (chunk) => {
    process.stdout.write(chunk);
    combined += chunk.toString();
    if (combined.length > 200_000) combined = combined.slice(-200_000);
  });
  child.stderr?.on('data', (chunk) => {
    process.stderr.write(chunk);
    combined += chunk.toString();
    if (combined.length > 200_000) combined = combined.slice(-200_000);
  });

  child.__combinedOutput = () => combined;
  return child;
}

function tryGetListeningPids(port) {
  try {
    const out = execSync(`netstat -ano | findstr ":${port}" | findstr LISTENING`, {
      stdio: ['ignore', 'pipe', 'ignore'],
    }).toString();

    const pids = new Set();
    for (const line of out.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const parts = trimmed.split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && /^\d+$/.test(pid)) pids.add(Number(pid));
    }
    return [...pids];
  } catch {
    return [];
  }
}

function isPortFree(port) {
  return tryGetListeningPids(port).length === 0;
}

function tryFreePort(port) {
  const pids = tryGetListeningPids(port);
  if (pids.length === 0) return true;

  console.log(`[dev:android] Port ${port} is in use (PID(s): ${pids.join(', ')}). Trying to stop them...`);
  for (const pid of pids) {
    try {
      execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
    } catch {
      // ignore
    }
  }
  return isPortFree(port);
}

function startMetro(port) {
  const resetCache =
    process.env.RCT_METRO_RESET_CACHE === '1' ||
    process.env.METRO_RESET_CACHE === '1' ||
    process.env.RESET_METRO_CACHE === '1';

  console.log(`[dev:android] Starting Metro on port ${port}...`);
  const args = ['react-native', 'start', '--port', String(port)];
  if (resetCache) args.push('--reset-cache');

  const metro = spawn('npx', args, {
    shell: true,
  });

  metro.stdout?.on('data', (chunk) => process.stdout.write(chunk));
  metro.stderr?.on('data', (chunk) => process.stderr.write(chunk));

  return metro;
}

async function waitForMetroReady(metroProc, timeoutMs = 120000) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error('Timed out waiting for Metro to be ready'));
    }, timeoutMs);

    function onData(buf) {
      const s = buf.toString();
      if (s.includes('Dev server ready') || s.includes('Starting dev server on')) {
        cleanup();
        resolve();
      }
    }

    function onExit(code) {
      cleanup();
      reject(new Error(`Metro exited early with code ${code}`));
    }

    function cleanup() {
      clearTimeout(timeout);
      metroProc.stdout?.off('data', onData);
      metroProc.stderr?.off('data', onData);
      metroProc.off('exit', onExit);
    }

    metroProc.stdout?.on('data', onData);
    metroProc.stderr?.on('data', onData);
    metroProc.on('exit', onExit);
  });
}

async function main() {
  const preferredPort = 8081;
  const fallbackPort = 8082;

  let port = preferredPort;
  if (!isPortFree(port) && !tryFreePort(port)) {
    port = fallbackPort;
  }

  const metro = startMetro(port);
  let android = null;

  // Ensure we shut Metro down when the script exits
  const stop = () => {
    try {
      if (android && !android.killed) android.kill();
    } catch {
      // ignore
    }
    try {
      if (!metro.killed) metro.kill();
    } catch {
      // ignore
    }
  };
  process.on('SIGINT', () => {
    stop();
    process.exit(130);
  });
  process.on('SIGTERM', () => {
    stop();
    process.exit(143);
  });
  process.on('exit', stop);

  try {
    await waitForMetroReady(metro);
  } catch (e) {
    console.error(`[dev:android] ${e.message}`);
    stop();
    process.exit(1);
  }

  console.log(`[dev:android] Running Android app (port ${port})...`);

  const deviceId = tryGetPreferredAndroidDeviceId();
  const androidArgs = ['react-native', 'run-android', '--port', String(port)];
  if (deviceId) {
    console.log(`[dev:android] Using device: ${deviceId}`);
    // RN CLI renamed `--deviceId` to `--device` (keep up to date to avoid warnings).
    androidArgs.push('--device', deviceId);
  } else {
    console.log('[dev:android] No Android device detected via adb yet (will let CLI handle it).');
  }

  android = runWithCapture('npx', androidArgs);
  const code = await new Promise((resolve) => android.on('exit', resolve));

  // Keep Metro running if install succeeds; stop it on failure.
  if ((code ?? 0) !== 0) {
    const out = typeof android.__combinedOutput === 'function' ? android.__combinedOutput() : '';
    const storageError =
      out.includes('INSTALL_FAILED_INSUFFICIENT_STORAGE') ||
      out.includes('Requested internal only, but not enough space') ||
      out.includes('not enough space');
    if (storageError) {
      console.error('');
      console.error('[dev:android] Android install failed: not enough internal storage on device/emulator.');
      console.error('[dev:android] Fix (emulator): Android Studio → Device Manager → (⋮) → Wipe Data → restart emulator.');
      console.error('[dev:android] Or: Edit the AVD → Show Advanced Settings → increase Internal Storage (e.g. 2048 MB+).');
      console.error('[dev:android] To free space now: adb uninstall <package> for apps you don\'t need, or wipe AVD data.');
      console.error('');
    }
    stop();
    process.exit(code ?? 1);
  }

  console.log(`[dev:android] Android app launched. Metro is still running on port ${port}.`);
  console.log('[dev:android] Press Ctrl+C to stop Metro and exit.');
  await new Promise(() => {});
}

main();

