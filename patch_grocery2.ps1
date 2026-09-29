$filepath = "c:\新增資料夾\旅遊專用資料夾\202703 snowboard\script.js"

# Read using line array, then join (this works in older PS versions)
$lines = Get-Content $filepath
$content = $lines -join "`r`n"
Write-Host "Read $($content.Length) chars, $($lines.Count) lines"

$changed = 0

# 1. Add groceryAssigneeEl variable reference after btnAddGrocery
$old1 = "const btnAddGrocery = document.getElementById('add-grocery-btn');"
$idx1 = $content.IndexOf($old1)
Write-Host "Pattern 1 at: $idx1"
if ($idx1 -ge 0) {
    $endOfLine = $content.IndexOf("`n", $idx1)
    $insertionPoint = $endOfLine + 1
    $addition = "        const groceryAssigneeEl = document.getElementById('grocery-assignee');`r`n"
    $content = $content.Substring(0, $insertionPoint) + $addition + $content.Substring($insertionPoint)
    Write-Host "[1] OK: Added groceryAssigneeEl declaration"
    $changed++
} else {
    Write-Host "[1] SKIP"
}

# 2. Replace the grocery-name span to include badge-assignee
$old2 = '<span class="grocery-name">${item.name}</span>'
$idx2 = $content.IndexOf($old2)
Write-Host "Pattern 2 at: $idx2"
if ($idx2 -ge 0) {
    $new2 = '<span class="grocery-name">${item.name}${item.assignee ? ''<span class=\"badge-assignee\">` + String.fromCharCode(36) + `{item.assignee}</span>'' : ''''}</span>'
    # Simpler approach - build the new span directly
    $new2Simple = '<span class="grocery-name">${item.name}${item.assignee ? ' + "'" + '<span class="badge-assignee">' + "'" + ' + item.assignee + ' + "'" + '</span>' + "'" + ' : ' + "''" + '}</span>'
    $content = $content.Substring(0, $idx2) + $new2Simple + $content.Substring($idx2 + $old2.Length)
    Write-Host "[2] OK: Updated grocery-name span"
    $changed++
} else {
    Write-Host "[2] SKIP"
}

# 3. Remove old grocery-meta span
$old3 = '                        <span class="grocery-meta" style="font-size:0.75rem;color:var(--text-secondary);margin-right:0.5rem;">${item.createdBy || ' + "''" + '}</span>'
$idx3 = $content.IndexOf('<span class="grocery-meta"')
Write-Host "Pattern 3 (grocery-meta) at: $idx3"
if ($idx3 -ge 0) {
    # Find end of this span
    $endTag = '</span>'
    $endIdx = $content.IndexOf($endTag, $idx3)
    if ($endIdx -ge 0) {
        $lineEnd = $content.IndexOf("`n", $endIdx)
        $lineStart = $content.LastIndexOf("`n", $idx3) + 1
        $content = $content.Substring(0, $lineStart) + $content.Substring($lineEnd + 1)
        Write-Host "[3] OK: Removed grocery-meta line"
        $changed++
    }
} else {
    Write-Host "[3] SKIP: grocery-meta already removed"
}

# 4. Add assignee read in btnAddGrocery handler
$old4 = "                const name = groceryInput.value.trim();"
$idx4 = $content.IndexOf($old4)
Write-Host "Pattern 4 at: $idx4"
if ($idx4 -ge 0) {
    $endOfLine4 = $content.IndexOf("`n", $idx4)
    $addition4 = "`r`n                const assignee = groceryAssigneeEl ? groceryAssigneeEl.value : '';"
    $content = $content.Substring(0, $endOfLine4) + $addition4 + $content.Substring($endOfLine4)
    Write-Host "[4] OK: Added assignee read"
    $changed++
} else {
    Write-Host "[4] SKIP"
}

# 5. Add assignee to groceryListRef.push
$old5Start = "groceryListRef.push({"
$idx5 = $content.IndexOf($old5Start)
Write-Host "Pattern 5 (push) at: $idx5"
if ($idx5 -ge 0) {
    # Find "purchased: false," after push
    $purchasedMarker = "                        purchased: false,"
    $idxPurchased = $content.IndexOf($purchasedMarker, $idx5)
    Write-Host "  purchased marker at: $idxPurchased"
    if ($idxPurchased -ge 0) {
        $endOfPurchasedLine = $content.IndexOf("`n", $idxPurchased)
        $addition5 = "`r`n                        assignee: assignee,"
        $content = $content.Substring(0, $endOfPurchasedLine) + $addition5 + $content.Substring($endOfPurchasedLine)
        Write-Host "[5] OK: Added assignee to push"
        $changed++
    }
} else {
    Write-Host "[5] SKIP"
}

Write-Host "Total changes: $changed"

# Write back to file using Out-File with UTF8 encoding
$content | Out-File -FilePath $filepath -Encoding UTF8
Write-Host "File saved."
