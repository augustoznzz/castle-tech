# Next.js Troubleshooting Script for Windows
# Run this script in PowerShell

Write-Host "=== Next.js Connection Troubleshooting ===" -ForegroundColor Green

# Step 1: Check Node.js and npm
Write-Host "`n1. Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green
    Write-Host "✓ npm: $npmVersion" -ForegroundColor Green
}
catch {
    Write-Host "✗ Node.js not found. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Step 2: Check if we're in the right directory
Write-Host "`n2. Checking project directory..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    Write-Host "✓ Found package.json" -ForegroundColor Green
    $packageContent = Get-Content "package.json" | ConvertFrom-Json
    Write-Host "✓ Project: $($packageContent.name)" -ForegroundColor Green
}
else {
    Write-Host "✗ No package.json found. Make sure you're in the project root directory." -ForegroundColor Red
    exit 1
}

# Step 3: Install dependencies
Write-Host "`n3. Installing dependencies..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "✓ Dependencies installed successfully" -ForegroundColor Green
}
catch {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Step 4: Check if port 3002 is in use
Write-Host "`n4. Checking port 3002..." -ForegroundColor Yellow
$portInUse = Get-NetTCPConnection -LocalPort 3002 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "⚠ Port 3002 is in use by PID: $($portInUse.OwningProcess)" -ForegroundColor Yellow
    $process = Get-Process -Id $portInUse.OwningProcess -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "Process: $($process.ProcessName)" -ForegroundColor Yellow
        $kill = Read-Host "Do you want to kill this process? (y/n)"
        if ($kill -eq "y" -or $kill -eq "Y") {
            Stop-Process -Id $portInUse.OwningProcess -Force
            Write-Host "✓ Process killed" -ForegroundColor Green
        }
    }
}
else {
    Write-Host "✓ Port 3002 is available" -ForegroundColor Green
}

# Step 5: Check firewall rules
Write-Host "`n5. Checking Windows Firewall..." -ForegroundColor Yellow
$firewallRules = Get-NetFirewallRule -DisplayName "*Node*" -ErrorAction SilentlyContinue
if ($firewallRules) {
    Write-Host "✓ Found Node.js firewall rules" -ForegroundColor Green
}
else {
    Write-Host "⚠ No Node.js firewall rules found" -ForegroundColor Yellow
    $addFirewall = Read-Host "Do you want to add a firewall rule for Node.js? (y/n)"
    if ($addFirewall -eq "y" -or $addFirewall -eq "Y") {
        try {
            New-NetFirewallRule -DisplayName "Node.js Development" -Direction Inbound -Protocol TCP -LocalPort 3002 -Action Allow
            Write-Host "✓ Firewall rule added" -ForegroundColor Green
        }
        catch {
            Write-Host "✗ Failed to add firewall rule. Run PowerShell as Administrator." -ForegroundColor Red
        }
    }
}

# Step 6: Test localhost resolution
Write-Host "`n6. Testing localhost resolution..." -ForegroundColor Yellow
try {
    $ping = Test-NetConnection -ComputerName localhost -Port 3002 -InformationLevel Quiet
    if ($ping) {
        Write-Host "✓ localhost:3002 is reachable" -ForegroundColor Green
    }
    else {
        Write-Host "⚠ localhost:3002 is not reachable (this is expected if server is not running)" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "⚠ Could not test localhost connectivity" -ForegroundColor Yellow
}

# Step 7: Start the development server
Write-Host "`n7. Starting development server..." -ForegroundColor Yellow
Write-Host "Starting Next.js development server..." -ForegroundColor Cyan
Write-Host "If successful, you should see output like:" -ForegroundColor Cyan
Write-Host "  ▲ Next.js 14.2.32" -ForegroundColor Cyan
Write-Host "  - Local: http://localhost:3002" -ForegroundColor Cyan
Write-Host "  ✓ Ready in X.Xs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Cyan
Write-Host ""

# Start the server on port 3002
npm run dev:3002
