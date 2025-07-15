# 🚀 PowerShell One-Line Gemini CLI Setup

## ⚡ Quick Setup Commands

### Method 1: Script Execution (Recommended)
```powershell
iex (iwr https://raw.githubusercontent.com/muumuu8181/claude-gemini-cli-guide/main/quick-setup.ps1 -UseBasicParsing).Content
```

### Method 2: Direct One-Line Execution
```powershell
if (Get-Command node -ErrorAction SilentlyContinue) { if (!(Test-Path "$env:USERPROFILE\.gemini")) { New-Item -ItemType Directory -Path "$env:USERPROFILE\.gemini" -Force | Out-Null }; '{"selectedAuthType":"oauth-personal","theme":"Default"}' | Out-File -FilePath "$env:USERPROFILE\.gemini\settings.json" -Encoding UTF8; Write-Host "Starting Gemini CLI..."; npx "@google/gemini-cli" -p "Setup complete" } else { Write-Host "Install Node.js from https://nodejs.org/" }
```

## 📋 What This Does

This command automatically:

1. ✅ **Checks Node.js installation**
2. ✅ **Creates ~/.gemini directory**
3. ✅ **Creates OAuth settings file**
4. ✅ **Runs Gemini CLI for first time**

## 🔐 Authentication Process

- **Browser opens automatically**
- **Login with Google account**
- **One-time authentication** (auto-login afterwards)

## ⚠️ Troubleshooting

### "Execution Policy" Error
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
```

### "Node.js not found" Error
1. Install Node.js from https://nodejs.org/
2. Restart PowerShell
3. Run command again

## 🎯 Usage After Setup

```powershell
# Basic question
npx @google/gemini-cli -p "Your question"

# Model specification
npx @google/gemini-cli -m gemini-2.5-pro -p "Your question"
npx @google/gemini-cli -m gemini-2.5-flash -p "Your question"

# File reading (under 3500 chars)
npx @google/gemini-cli -p "$(Get-Content filename -TotalCount 100)" + "question"
```

## 📊 Limitations

- **Character limit**: 3500 characters or less recommended
- **Usage limit**: 1,000 requests/day (completely free)
- **Authentication**: Personal Google account required

## 🔗 Related Links

- [GitHub Repository](https://github.com/muumuu8181/claude-gemini-cli-guide)
- [Detailed Usage Guide](https://github.com/muumuu8181/claude-gemini-cli-guide/blob/main/CLAUDE.md)
- [Node.js Official Site](https://nodejs.org/)