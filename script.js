// --------------------------------------------------------------------------
// 1. 導覽列 Navbar 的滾動變化與手機版選單切換
// --------------------------------------------------------------------------
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');

// 監聽滾動事件，為 navbar 加上陰影與背景
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// 手機版選單開關
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// 點擊選單連結後，自動收合手機版選單
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});


// --------------------------------------------------------------------------
// 2. 目標日期倒數計時器 (Target: 2027-03-01 00:00:00)
// --------------------------------------------------------------------------
const targetDate = new Date('2027-03-01T00:00:00').getTime();
const countdownElement = document.getElementById('countdown');

function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    // 如果已經超過目標日期
    if (distance < 0) {
        countdownElement.innerHTML = "<h3>旅行已經開始或結束囉！</h3>";
        return;
    }

    // 計算天、時、分、秒
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // 渲染到畫面上
    countdownElement.innerHTML = `
        <div class="time-box">
            <span class="num">${days}</span>
            <span class="label">Days</span>
        </div>
        <div class="time-box">
            <span class="num">${hours.toString().padStart(2, '0')}</span>
            <span class="label">Hours</span>
        </div>
        <div class="time-box">
            <span class="num">${minutes.toString().padStart(2, '0')}</span>
            <span class="label">Mins</span>
        </div>
        <div class="time-box">
            <span class="num">${seconds.toString().padStart(2, '0')}</span>
            <span class="label">Secs</span>
        </div>
    `;
}

// 初次呼叫並設定每秒更新一次
updateCountdown();
setInterval(updateCountdown, 1000);


// --------------------------------------------------------------------------
// 3. 動態渲染「影音回憶錄」 (讀取 mediaData.js)
// --------------------------------------------------------------------------
// 等待 DOM 載入完成後執行
document.addEventListener('DOMContentLoaded', () => {
    const mediaGrid = document.getElementById('media-grid');
    
    // 檢查 mediaData 是否存在 (來自 mediaData.js)
    if (typeof mediaData !== 'undefined' && mediaData.length > 0) {
        mediaData.forEach(item => {
            // 建立包裹層
            const mediaItem = document.createElement('div');
            mediaItem.classList.add('media-item');

            // 判斷是圖片還是影片
            if (item.type === 'image') {
                const img = document.createElement('img');
                img.src = item.src;
                img.alt = item.alt || '雪季回憶圖片';
                img.loading = 'lazy'; // 提升效能
                mediaItem.appendChild(img);
            } else if (item.type === 'video') {
                const video = document.createElement('video');
                video.src = item.src;
                video.controls = true; // 顯示控制列
                mediaItem.appendChild(video);
            }

            // 將元素加入 grid 容器
            mediaGrid.appendChild(mediaItem);
        });
    } else {
        // 如果沒有資料時的預設文字
        mediaGrid.innerHTML = '<p style="color: var(--text-secondary); grid-column: 1 / -1; text-align: center;">目前還沒有上傳影音，敬請期待！</p>';
    }
});
