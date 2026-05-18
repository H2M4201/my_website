// server.js - HTTPS dev server with self-signed cert support
const https = require('https')
const fs = require('fs')
const path = require('path')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = parseInt(process.env.PORT || '3000', 10)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

// For development HTTPS, generate self-signed cert if it doesn't exist
function ensureCertificates() {
  const certDir = path.join(__dirname, '.cert')
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
  const { execSync } = require('child_process')
  try {
    execSync(
      `openssl req -nodes -new -x509 -days 365 -keyout "${keyPath}" -out "${certPath}" -subj "/C=US/ST=State/L=City/O=Org/CN=localhost"`,
      { stdio: 'pipe' }
    )
    console.log('✓ Certificate generated successfully at', certDir)
  } catch (error) {
    console.error('Failed to generate certificate:', error.message)
    console.error('Make sure OpenSSL is installed and available in PATH.')
    process.exit(1)
  }

  return { cert: certPath, key: keyPath }
}

app.prepare().then(() => {
  const { cert: certPath, key: keyPath } = ensureCertificates()

  const options = {
    cert: fs.readFileSync(certPath),
    key: fs.readFileSync(keyPath),
  }

  const server = https.createServer(options, (req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  })

  server.listen(port, hostname, (err) => {
    if (err) throw err
    console.log(`> Ready on https://${hostname}:${port}`)
    console.log('> Press Ctrl+C to stop')
  })
})
