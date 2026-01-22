#!/usr/bin/env pwsh
# Aleaqrab System Health Check & Auto-Fix Script

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   ALEAQRAB SYSTEM HEALTH CHECK" -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$ErrorCount = 0
$WarningCount = 0
$FixedCount = 0

# 1. Check critical files existence
Write-Host "[1] Checking Critical Files..." -ForegroundColor White
$CriticalFiles = @(
    "components/views/StudentView.tsx",
    "components/views/TeacherView.tsx",
    "components/views/ParentView.tsx",
    "components/views/AdminView.tsx",
    "components/views/AccountantView.tsx",
    "components/views/SuperAdminView.tsx",
    "components/views/SecretaryView.tsx",
    "components/DashboardLayout.tsx",
    "context/AppContext.tsx",
    "types.ts",
    "App.tsx"
)

foreach ($file in $CriticalFiles) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ MISSING: $file" -ForegroundColor Red
        $ErrorCount++
    }
}

# 2. Check for common TypeScript errors
Write-Host "`n[2] Checking for Common Issues..." -ForegroundColor White

# Check for missing imports
$FilesToCheck = Get-ChildItem -Path "components/views" -Filter "*.tsx" -Recurse
foreach ($file in $FilesToCheck) {
    $content = Get-Content $file.FullName -Raw
    
    # Check if SmartAnalytic is used but not imported
    if ($content -match "<SmartAnalytic" -and $content -notmatch "import.*SmartAnalytic") {
        Write-Host "  ⚠ Missing SmartAnalytic import in $($file.Name)" -ForegroundColor Yellow
        $WarningCount++
    }
    
    # Check if useAppContext is used but not imported
    if ($content -match "useAppContext" -and $content -notmatch "import.*useAppContext") {
        Write-Host "  ⚠ Missing useAppContext import in $($file.Name)" -ForegroundColor Yellow
        $WarningCount++
    }
}

# 3. Check package.json dependencies
Write-Host "`n[3] Checking Dependencies..." -ForegroundColor White
if (Test-Path "package.json") {
    $pkg = Get-Content "package.json" | ConvertFrom-Json
    $requiredDeps = @("react", "react-dom", "react-router-dom", "lucide-react")
    
    foreach ($dep in $requiredDeps) {
        if ($pkg.dependencies.$dep) {
            Write-Host "  ✓ $dep installed" -ForegroundColor Green
        } else {
            Write-Host "  ✗ Missing dependency: $dep" -ForegroundColor Red
            $ErrorCount++
        }
    }
}

# 4. Check for console.log statements (bad practice)
Write-Host "`n[4] Checking for Debug Statements..." -ForegroundColor White
$AllTsxFiles = Get-ChildItem -Path "." -Filter "*.tsx" -Recurse -Exclude "node_modules"
$consoleCount = 0
foreach ($file in $AllTsxFiles) {
    $consoleMatches = Select-String -Path $file.FullName -Pattern "console\.(log|warn|error)" -AllMatches
    if ($consoleMatches) {
        $consoleCount += $consoleMatches.Matches.Count
    }
}
if ($consoleCount -gt 0) {
    Write-Host "  ⚠ Found $consoleCount console statements (consider removing for production)" -ForegroundColor Yellow
    $WarningCount++
}

# 5. Check tsconfig.json
Write-Host "`n[5] Checking TypeScript Configuration..." -ForegroundColor White
if (Test-Path "tsconfig.json") {
    try {
        $tsconfig = Get-Content "tsconfig.json" -Raw | ConvertFrom-Json
        Write-Host "  ✓ tsconfig.json is valid JSON" -ForegroundColor Green
    } catch {
        Write-Host "  ✗ tsconfig.json has syntax errors" -ForegroundColor Red
        $ErrorCount++
    }
}

# 6. Summary
Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "   SUMMARY" -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Errors:   $ErrorCount" -ForegroundColor $(if ($ErrorCount -eq 0) { "Green" } else { "Red" })
Write-Host "Warnings: $WarningCount" -ForegroundColor $(if ($WarningCount -eq 0) { "Green" } else { "Yellow" })
Write-Host "Fixed:    $FixedCount" -ForegroundColor Green
Write-Host ""

if ($ErrorCount -eq 0 -and $WarningCount -eq 0) {
    Write-Host "✅ All checks passed! System is healthy." -ForegroundColor Green
} elseif ($ErrorCount -eq 0) {
    Write-Host "⚠️  System is functional but has warnings." -ForegroundColor Yellow
} else {
    Write-Host "❌ System has critical errors that need attention." -ForegroundColor Red
}

Write-Host ""
