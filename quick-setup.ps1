# Gemini CLI Quick Setup
Write-Host "Gemini CLI Setup Starting..." -ForegroundColor Green

# Check Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js not found. Please install from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

Write-Host "Node.js found" -ForegroundColor Green

# Create config directory
$configDir = "$env:USERPROFILE\.gemini"
if (!(Test-Path $configDir)) {
    New-Item -ItemType Directory -Path $configDir -Force | Out-Null
}

# Create settings file
$settings = '{"selectedAuthType":"oauth-personal","theme":"Default"}'
$settings | Out-File -FilePath "$configDir\settings.json" -Encoding UTF8

Write-Host "Config created" -ForegroundColor Green
Write-Host "Starting Gemini CLI..." -ForegroundColor Yellow

# Run Gemini CLI
npx "@google/gemini-cli" -p "Setup test"