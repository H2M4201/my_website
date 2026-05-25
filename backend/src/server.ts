// server.ts - HTTPS server for backend API with self-signed cert support
import https from 'https'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import 'dotenv/config'
import { createApp } from './app'
import { fileURLToPath } from 'url'

// ESM compatibility
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const port = Number(process.env.PORT || 4000)
const hostname = 'localhost'

// For development HTTPS, generate self-signed cert if it doesn't exist
function ensureCertificates() {
  const certDir = path.join(__dirname, '..', '.cert')
  const certPath = path.join(certDir, 'localhost+2.pem')
  const keyPath = path.join(certDir, 'localhost+2-key.pem')

  if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
    console.log('Using existing certificates.')
    return { cert: certPath, key: keyPath }
  }

  if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir, { recursive: true })
  }

  console.log('Generating self-signed certificate for development...')
  try {
    execSync(
      `openssl req -nodes -new -x509 -days 365 -keyout "${keyPath}" -out "${certPath}" -subj "/C=US/ST=State/L=City/O=Org/CN=localhost"`,
      { stdio: 'pipe' }
    )
    console.log('✓ Certificate generated successfully at', certDir)
  } catch (error) {
    console.error('Failed to generate certificate:', (error as Error).message)
    console.error('Make sure OpenSSL is installed and available in PATH.')
    process.exit(1)
  }

  return { cert: certPath, key: keyPath }
}

const app = createApp()
const { cert: certPath, key: keyPath } = ensureCertificates()

const options = {
  cert: fs.readFileSync(certPath),
  key: fs.readFileSync(keyPath),
}

const server = https.createServer(options, app)

server.listen(port, hostname, () => {
  console.log(`Backend API ready on https://${hostname}:${port}`)
  console.log('> Press Ctrl+C to stop')
})
