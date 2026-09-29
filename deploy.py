import os
import subprocess
import sys

# 強制標準輸出使用 utf-8，避免 Windows cmd/powershell cp950 編碼報錯
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

def run_cmd(cmd, check=True):
    print(f"執行: {cmd}")
    res = subprocess.run(cmd, shell=True, text=True, capture_output=True, encoding='utf-8', errors='replace')
    if res.stdout:
        print(res.stdout.strip())
    if res.stderr:
        print(res.stderr.strip(), file=sys.stderr)
    if check and res.returncode != 0:
        raise RuntimeError(f"指令執行失敗: {cmd}")
    return res

def main():
    try:
        import deploy_config
    except ImportError:
        print("❌ 找不到 deploy_config.py 設定檔！")
        return

    user = getattr(deploy_config, "GITHUB_USER", "").strip()
    repo = getattr(deploy_config, "GITHUB_REPO", "").strip()
    token = getattr(deploy_config, "GITHUB_TOKEN", "").strip()
    branch = getattr(deploy_config, "BRANCH", "main").strip()

    if not token or "在此貼上" in token:
        print("❌ 請先在 deploy_config.py 填入正確的 GITHUB_TOKEN (Personal Access Token)！")
        return

    # 1. 檢查並初始化 git
    if not os.path.exists(".git"):
        print("[Git] 正在初始化 Git 儲存庫...")
        run_cmd("git init")
        run_cmd(f"git branch -M {branch}")

    # 2. 設定獨立的遠端倉庫 URL (嵌入 Token，不影響其他全域帳號)
    remote_url = f"https://{token}@github.com/{user}/{repo}.git"
    
    # 檢查是否已設定 remote origin
    res = run_cmd("git remote", check=False)
    if "origin" in res.stdout.split():
        run_cmd(f"git remote set-url origin {remote_url}")
    else:
        run_cmd(f"git remote add origin {remote_url}")

    # 3. 加入檔案並提交
    print("[Git] 正在加入更新檔案...")
    run_cmd("git add .")
    
    # 檢查是否有更動需要 commit
    status_res = run_cmd("git status --porcelain", check=False)
    if status_res.stdout.strip():
        commit_msg = "Update via automated deploy script"
        print(f"[Git] 提交變更: {commit_msg}")
        run_cmd(f'git commit -m "{commit_msg}"')
    else:
        print("[Git] 沒有偵測到新的變更，準備直接推送...")

    # 4. 推送到 GitHub
    print(f"[Git] 正在推送到 GitHub ({branch} 分支)...")
    push_res = run_cmd(f"git push -u origin {branch}", check=False)
    
    if push_res.returncode == 0:
        print("\n🎉 上傳成功！已順利同步至 GitHub。")
    else:
        print("\n⚠️ 推送遇到衝突，嘗試強制覆蓋/同步中...")
        # 若為全新本地倉庫，嘗試以 force 推送
        force_res = run_cmd(f"git push -u origin {branch} --force", check=False)
        if force_res.returncode == 0:
            print("\n🎉 強制同步成功！")
        else:
            print("\n❌ 推送失敗，請確認 Token 權限（需勾選 repo）或 Repository 名稱是否正確。")

if __name__ == "__main__":
    main()
