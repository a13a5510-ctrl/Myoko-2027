import re

filepath = r'c:\新增資料夾\旅遊專用資料夾\202703 snowboard\script.js'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add groceryAssigneeEl variable reference after btnAddGrocery declaration
old_decl = "        const btnAddGrocery = document.getElementById('add-grocery-btn');  // 對應 HTML #add-grocery-btn"
new_decl = (
    "        const btnAddGrocery = document.getElementById('add-grocery-btn');  // 對應 HTML #add-grocery-btn\r\n"
    "        const groceryAssigneeEl = document.getElementById('grocery-assignee');"
)
if old_decl in content:
    content = content.replace(old_decl, new_decl)
    print("[1] Added groceryAssigneeEl declaration")
else:
    print("[1] WARN: could not find old_decl")

# 2. Update render to include badge-assignee
old_render = (
    "                    itemEl.innerHTML = `\r\n"
    "                        <span class=\"grocery-name\">${item.name}</span>\r\n"
    "                        <span class=\"grocery-meta\" style=\"font-size:0.75rem;color:var(--text-secondary);margin-right:0.5rem;\">${item.createdBy || ''}</span>\r\n"
    "                        <input type=\"checkbox\" class=\"grocery-check\" ${item.purchased ? 'checked' : ''} data-key=\"${key}\">\r\n"
    "                    `;"
)
new_render = (
    "                    itemEl.innerHTML = `\r\n"
    "                        <span class=\"grocery-name\">${item.name}${item.assignee ? '<span class=\"badge-assignee\">負責人: ' + item.assignee + '</span>' : ''}</span>\r\n"
    "                        <input type=\"checkbox\" class=\"grocery-check\" ${item.purchased ? 'checked' : ''} data-key=\"${key}\">\r\n"
    "                    `;"
)
if old_render in content:
    content = content.replace(old_render, new_render)
    print("[2] Updated itemEl.innerHTML to include badge-assignee")
else:
    # Try LF line endings
    old_render_lf = old_render.replace('\r\n', '\n')
    new_render_lf = new_render.replace('\r\n', '\n')
    if old_render_lf in content:
        content = content.replace(old_render_lf, new_render_lf)
        print("[2] Updated itemEl.innerHTML (LF) to include badge-assignee")
    else:
        print("[2] WARN: could not find old_render - trying partial match")
        # Try a simpler targeted replacement
        old_simple = '<span class="grocery-name">${item.name}</span>'
        new_simple = '<span class="grocery-name">${item.name}${item.assignee ? \'<span class="badge-assignee">負責人: \' + item.assignee + \'</span>\' : \'\'}</span>'
        if old_simple in content:
            content = content.replace(old_simple, new_simple)
            # Also remove the old createdBy meta span
            old_meta = '<span class="grocery-meta" style="font-size:0.75rem;color:var(--text-secondary);margin-right:0.5rem;">${item.createdBy || \'\'}</span>'
            content = content.replace(old_meta, '')
            print("[2] Updated via simple match")
        else:
            print("[2] WARN: could not find simple match either")

# 3. Add assignee read before push - inside btnAddGrocery click handler
old_click = "                const name = groceryInput.value.trim();\r\n                const userName"
new_click = "                const name = groceryInput.value.trim();\r\n                const assignee = groceryAssigneeEl ? groceryAssigneeEl.value : '';\r\n                const userName"
if old_click in content:
    content = content.replace(old_click, new_click)
    print("[3] Added assignee read from select")
else:
    old_click_lf = old_click.replace('\r\n', '\n')
    new_click_lf = new_click.replace('\r\n', '\n')
    if old_click_lf in content:
        content = content.replace(old_click_lf, new_click_lf)
        print("[3] Added assignee read (LF)")
    else:
        print("[3] WARN: could not find old_click")

# 4. Add assignee to push object
old_push = "                    groceryListRef.push({\r\n                        name: name,\r\n                        purchased: false,\r\n                        createdBy: userName,"
new_push = "                    groceryListRef.push({\r\n                        name: name,\r\n                        purchased: false,\r\n                        assignee: assignee,\r\n                        createdBy: userName,"
if old_push in content:
    content = content.replace(old_push, new_push)
    print("[4] Added assignee to Firebase push")
else:
    old_push_lf = old_push.replace('\r\n', '\n')
    new_push_lf = new_push.replace('\r\n', '\n')
    if old_push_lf in content:
        content = content.replace(old_push_lf, new_push_lf)
        print("[4] Added assignee to Firebase push (LF)")
    else:
        print("[4] WARN: could not find old_push")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Done - file written")
