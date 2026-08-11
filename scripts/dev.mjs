import { spawn } from 'node:child_process'

const children = [
  spawn(
    'uv',
    [
      'run',
      '--system-certs',
      'uvicorn',
      'api.main:app',
      '--reload',
      '--port',
      '3100',
    ],
    { stdio: 'inherit' },
  ),
  spawn(process.execPath, ['node_modules/vite/bin/vite.js'], {
    stdio: 'inherit',
  }),
]

const stop = () => {
  for (const child of children) child.kill('SIGTERM')
}

process.on('SIGINT', stop)
process.on('SIGTERM', stop)
for (const child of children) {
  child.on('error', (error) => {
    console.error(`Failed to start "${child.spawnfile}": ${error.message}`)
    stop()
    process.exit(1)
  })
  child.on('exit', (code) => code && process.exit(code))
}
