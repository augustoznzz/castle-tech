# Next.js Connection Troubleshooting Guide - Port 3002

## Quick Start Commands

```powershell
# Navigate to your project
cd E:\projetos\Castle-Tech

# Run the automated troubleshooting script
.\troubleshoot-nextjs.ps1

# Or start manually on port 3002
npm run dev
# This will now start on http://localhost:3002
```

## Step-by-Step Troubleshooting for Port 3002

### Step 1: Verify Node.js Installation and Dependencies

```powershell
# Check Node.js version (should be 18+ for Next.js 14)
node --version

# Check npm version
npm --version

# Navigate to your project directory
cd E:\projetos\Castle-Tech

# Install dependencies (if not already done)
npm install

# Verify dependencies are installed
npm list --depth=0
```

### Step 2: Check if Development Server is Running

```powershell
# Start the development server on port 3002
npm run dev

# Alternative: Use the specific port script
npm run dev:3002

# Alternative: Use yarn if you prefer
# yarn dev
```

**Expected output should show:**

```
▲ Next.js 14.2.32
- Local:        http://localhost:3002
- Environments: .env.local

✓ Ready in 2.3s
```

### Step 3: Check if Port 3002 is Already in Use

```powershell
# Check what's using port 3002
netstat -ano | findstr :3002

# Alternative PowerShell command
Get-NetTCPConnection -LocalPort 3002 -ErrorAction SilentlyContinue
```

**If port 3002 is in use, you'll see output like:**

```
TCP    0.0.0.0:3002    0.0.0.0:0    LISTENING    1234
```

To kill the process using port 3002:

```powershell
# Find the PID (Process ID) from the netstat output above
# Then kill the process (replace 1234 with actual PID)
taskkill /PID 1234 /F

# Or kill all Node.js processes (be careful!)
taskkill /IM node.exe /F
```

### Step 4: Alternative Port Solutions

If port 3002 is problematic, you can run on a different port:

```powershell
# Option 1: Set environment variable
$env:PORT=4000
npm run dev

# Option 2: Use Next.js built-in port flag
npx next dev -p 4000

# Option 3: Create a .env.local file with custom port
echo "PORT=4000" > .env.local
npm run dev
```

### Step 5: Windows Firewall Configuration for Port 3002

```powershell
# Run PowerShell as Administrator
# Check firewall status
Get-NetFirewallProfile | Select-Object Name, Enabled

# Allow Node.js through firewall for port 3002 (run as Administrator)
New-NetFirewallRule -DisplayName "Node.js Development Port 3002" -Direction Inbound -Protocol TCP -LocalPort 3002 -Action Allow

# Or allow all Node.js traffic
New-NetFirewallRule -DisplayName "Node.js All Ports" -Direction Inbound -Protocol TCP -Program "C:\Program Files\nodejs\node.exe" -Action Allow
```

**Manual Firewall Configuration:**

1. Open Windows Defender Firewall
2. Click "Allow an app or feature through Windows Defender Firewall"
3. Click "Change settings" → "Allow another app"
4. Browse to Node.js executable (usually `C:\Program Files\nodejs\node.exe`)
5. Check both "Private" and "Public" boxes
6. Click "OK"

### Step 6: HTTPS Configuration for Port 3002

If you need HTTPS for local development on port 3002:

```powershell
# Install mkcert (using Chocolatey)
choco install mkcert

# Or download from: https://github.com/FiloSottile/mkcert/releases

# Install the local CA
mkcert -install

# Generate certificates for localhost
mkcert localhost 127.0.0.1 ::1

# This creates: localhost+2.pem and localhost+2-key.pem

# Run HTTPS server on port 3002
npm run dev:https
```

Then access your site at `https://localhost:3002`

### Step 7: Network and Host Configuration

```powershell
# Check if localhost resolves correctly
ping localhost

# Test specific port connectivity
Test-NetConnection -ComputerName localhost -Port 3002

# Check hosts file (run as Administrator)
notepad C:\Windows\System32\drivers\etc\hosts

# Ensure this line exists:
# 127.0.0.1       localhost
```

### Step 8: Antivirus Software Check

Some antivirus software blocks development servers:

```powershell
# Temporarily disable real-time protection to test
# (Check your antivirus settings)

# Common antivirus exclusions to add:
# - Node.js folder: C:\Program Files\nodejs\
# - Your project folder: E:\projetos\Castle-Tech\
# - npm cache: %APPDATA%\npm-cache\
```

## Common Solutions Summary for Port 3002

1. **Most Common Fix**: Kill any process using port 3002

   ```powershell
   netstat -ano | findstr :3002
   taskkill /PID <PID_NUMBER> /F
   ```

2. **Use Different Port**:

   ```powershell
   npx next dev -p 4000
   # Then visit http://localhost:4000
   ```

3. **Firewall Issue**: Add Node.js to Windows Firewall exceptions for port 3002

4. **Antivirus Blocking**: Add your project folder to antivirus exclusions

5. **HTTPS Setup**: Use the provided `server.js` and `npm run dev:https`

## Available Scripts (Updated for Port 3002)

- `npm run dev` - Start development server on port 3002
- `npm run dev:3002` - Explicitly start on port 3002
- `npm run dev:https` - Start HTTPS server on port 3002
- `npm run build` - Build for production
- `npm run start` - Start production server

## Files Created

- **`server.js`**: Custom HTTPS server for secure local development on port 3002
- **`troubleshoot-nextjs.ps1`**: Automated troubleshooting script for port 3002

## Troubleshooting Checklist

- [ ] Node.js is installed (version 18+)
- [ ] Dependencies are installed (`npm install`)
- [ ] Port 3002 is not in use by another process
- [ ] Windows Firewall allows Node.js on port 3002
- [ ] Antivirus is not blocking Node.js or the project folder
- [ ] localhost resolves correctly
- [ ] Development server starts without errors

## Next Steps

1. Run `.\troubleshoot-nextjs.ps1` in PowerShell
2. If that doesn't work, try running on port 4000: `npx next dev -p 4000`
3. Check Windows Firewall settings for port 3002
4. Temporarily disable antivirus real-time protection to test

Your Next.js project is now configured to run on port 3002 by default!

