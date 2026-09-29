$filepath = "c:\新增資料夾\旅遊專用資料夾\202703 snowboard\script.js"
$content = Get-Content $filepath -Raw -Encoding UTF8

$changed = 0

# 1. Add groceryAssigneeEl variable reference after btnAddGrocery line
$old1 = "        const btnAddGrocery = document.getElementById('add-grocery-btn');  // 對應 HTML #add-grocery-btn"
$new1 = "        const btnAddGrocery = document.getElementById('add-grocery-btn');  // 對應 HTML #add-grocery-btn`r`n        const groceryAssigneeEl = document.getElementById('grocery-assignee');"
if ($content.Contains($old1)) {
    $content = $content.Replace($old1, $new1)
    Write-Host "[1] OK: Added groceryAssigneeEl"
    $changed++
} else {
    Write-Host "[1] SKIP: Pattern not found"
}

# 2. Replace the grocery item innerHTML render to include badge-assignee
# Replace grocery-meta span and grocery-name span
$old2 = '<span class="grocery-name">${item.name}</span>'
$new2 = '<span class="grocery-name">${item.name}${item.assignee ? `''<span class=\\"badge-assignee\\">負責人: '' + item.assignee + ''</span>''` : ''''}</span>'
if ($content.Contains($old2)) {
    $content = $content.Replace($old2, $new2)
    Write-Host "[2] OK: Updated grocery-name span"
    $changed++
} else {
    Write-Host "[2] SKIP: grocery-name pattern not found"
}

# 3. Remove old grocery-meta span (createdBy)
$old3 = '                        <span class="grocery-meta" style="font-size:0.75rem;color:var(--text-secondary);margin-right:0.5rem;">${item.createdBy || ''''}</span>'
if ($content.Contains($old3)) {
    $content = $content.Replace($old3, '')
    Write-Host "[3] OK: Removed old grocery-meta span"
    $changed++
} else {
    Write-Host "[3] SKIP: grocery-meta not found (may already be removed)"
}

# 4. Add assignee read before push - locate by surrounding context
$old4 = "                const name = groceryInput.value.trim();"
$new4 = "                const name = groceryInput.value.trim();`r`n                const assignee = groceryAssigneeEl ? groceryAssigneeEl.value : '';"
if ($content.Contains($old4)) {
    # Only replace first occurrence inside the btnAddGrocery click handler
    $idx = $content.IndexOf($old4)
    $content = $content.Substring(0, $idx) + $new4 + $content.Substring($idx + $old4.Length)
    Write-Host "[4] OK: Added assignee read"
    $changed++
} else {
    Write-Host "[4] SKIP: name pattern not found"
}

# 5. Add assignee field to groceryListRef.push
$old5 = "                    groceryListRef.push({`r`n                        name: name,`r`n                        purchased: false,`r`n                        createdBy: userName,"
$new5 = "                    groceryListRef.push({`r`n                        name: name,`r`n                        purchased: false,`r`n                        assignee: assignee,`r`n                        createdBy: userName,"
if ($content.Contains($old5)) {
    $content = $content.Replace($old5, $new5)
    Write-Host "[5] OK: Added assignee to push"
    $changed++
} else {
    # Try with \n instead
    $old5n = $old5.Replace("`r`n", "`n")
    $new5n = $new5.Replace("`r`n", "`n")
    if ($content.Contains($old5n)) {
        $content = $content.Replace($old5n, $new5n)
        Write-Host "[5] OK: Added assignee to push (LF)"
        $changed++
    } else {
        Write-Host "[5] SKIP: push pattern not found"
        # Debug: show the area around groceryListRef.push
        $pushIdx = $content.IndexOf("groceryListRef.push({")
        if ($pushIdx -ge 0) {
            Write-Host "  Found push at $pushIdx, context:"
            Write-Host $content.Substring($pushIdx, [Math]::Min(200, $content.Length - $pushIdx))
        }
    }
}

Write-Host "Total changes: $changed"
Set-Content -Path $filepath -Value $content -Encoding UTF8 -NoNewline
Write-Host "File saved."
