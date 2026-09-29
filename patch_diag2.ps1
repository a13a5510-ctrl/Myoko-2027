$filepath = "c:\新增資料夾\旅遊專用資料夾\202703 snowboard\script.js"

# Read file using StreamReader with UTF8
$sr = New-Object System.IO.StreamReader($filepath, [System.Text.Encoding]::UTF8)
$content = $sr.ReadToEnd()
$sr.Close()
$sr.Dispose()

Write-Host "Read $($content.Length) chars"
Write-Host "Contains grocery-item-input: $($content.Contains('grocery-item-input'))"
Write-Host "Contains add-grocery-btn: $($content.Contains('add-grocery-btn'))"
Write-Host "Contains grocery-name: $($content.Contains('grocery-name'))"
Write-Host "Contains btnAddGrocery: $($content.Contains('btnAddGrocery'))"

$changed = 0

# 1. Add groceryAssigneeEl variable reference
$old1 = "const btnAddGrocery = document.getElementById('add-grocery-btn');"
$idx1 = $content.IndexOf($old1)
Write-Host "Pattern 1 at index: $idx1"

# 2. Check for grocery-name span
$old2 = "grocery-name"
$idx2 = $content.IndexOf($old2)
Write-Host "Pattern 2 (grocery-name) at index: $idx2"

# 3. Check for the push pattern
$idx3 = $content.IndexOf("groceryListRef.push(")
Write-Host "Pattern 3 (groceryListRef.push) at index: $idx3"
if ($idx3 -ge 0) {
    Write-Host "Context around push:"
    Write-Host ($content.Substring($idx3, [Math]::Min(300, $content.Length - $idx3)))
}
