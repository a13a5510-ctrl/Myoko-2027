$filepath = "c:\新增資料夾\旅遊專用資料夾\202703 snowboard\script.js"
$content = [System.IO.File]::ReadAllText($filepath, [System.Text.Encoding]::UTF8)

# 1. Add groceryAssigneeEl variable reference
$pattern1 = "        const btnAddGrocery = document.getElementById('add-grocery-btn');  // " + [char]0x5C + [char]0x75 + "5C0D" + [char]0x5C + [char]0x75 + "61C9 HTML #add-grocery-btn"
# Actually let us search for a simpler pattern
$old1 = "const btnAddGrocery = document.getElementById('add-grocery-btn');"
$pos1 = $content.IndexOf($old1)
Write-Host "Pattern 1 pos: $pos1"

# Find the grocery push of name/purchased
$old_push_marker = "groceryListRef.push({"
$pos_push = $content.IndexOf($old_push_marker)
Write-Host "Push marker pos: $pos_push"

# Find item.name in the render section
$old_name_marker = '<span class="grocery-name">${item.name}</span>'
$pos_name = $content.IndexOf($old_name_marker)
Write-Host "Name marker pos: $pos_name"

Write-Host "Content length: $($content.Length)"
