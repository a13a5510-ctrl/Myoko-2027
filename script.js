// --------------------------------------------------------------------------
// 0. 環境防呆偵測機制
// --------------------------------------------------------------------------
const isLocalFile = window.location.protocol === 'file:';

if (isLocalFile) {
    document.addEventListener('DOMContentLoaded', () => {
        const overlay = document.createElement('div');
        overlay.className = 'env-error-overlay';
        overlay.innerHTML = `
            <div class="env-error-content">
                <h2>⚠️ 環境錯誤</h2>
                <p>請勿直接點擊 HTML 檔案 (file://) 開啟。</p>
                <p>為了讓 Firebase 投票系統正常運作，<br>請使用 Live Server 或 Localhost 啟動網頁。</p>
            </div>
        `;
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
    });
}

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

// --------------------------------------------------------------------------
// 4. 動態渲染房源候選清單 (Slider) + 匯率常數
// --------------------------------------------------------------------------
const twdToHkdRate = 0.24; // TWD → HKD 匯率
const nights = 4; // 行程晚數

function parsePriceNumber(priceStr) {
    const match = priceStr.match(/[\d,]+/);
    return match ? parseInt(match[0].replace(/,/g, ''), 10) : 0;
}

const housingData = [
    {
        id: "house1",
        name: "Genki House (距離斜坡7公尺)",
        rating: "5.0 (16則)",
        price: "$125,060 (免費停車)",
        specs: "10人 / 4房8床 / 2.5衛 / 有廚房",
        location: "池之平 (Ikenotaira)",
        coordinates: "36.861228, 138.196546",
        localGuide: [
            "🍽️ 餐廳：<a href='https://www.google.com/maps/search/?api=1&query=LIME+KITCHEN+%E5%A6%99%E9%AB%98' target='_blank'>LIME KITCHEN (池之平特色西餐)</a> — 約 4 分 (2.5 公里)",
            "🍢 小吃：<a href='https://www.google.com/maps/search/?api=1&query=%E3%83%A9%E3%83%B3%E3%83%89%E3%83%9E%E3%83%BC%E3%82%AF%E5%A6%99%E9%AB%98%E9%AB%98%E5%8E%9F' target='_blank'>Landmark Myokokogen 美食街</a> — 約 5 分 (3 公里)",
            "♨️ 溫泉：<a href='https://www.google.com/maps/search/?api=1&query=%E3%83%A9%E3%82%A4%E3%83%A0%E3%83%AA%E3%82%BE%E3%83%BC%E3%83%88%E5%A6%99%E9%AB%98' target='_blank'>池之平溫泉 (LIME RESORT 黑泥溫泉)</a> — 約 5 分 (3 公里)",
            "⛷️ 雪場：<a href='https://www.google.com/maps/search/?api=1&query=%E6%B1%A0%E3%81%AE%E5%B9%B3%E6%B8%A9%E6%B3%89%E3%82%A2%E3%83%AB%E3%83%9A%E3%83%B3%E3%83%96%E3%83%AA%E3%83%83%E3%82%AF%E3%82%B9%E3%82%AD%E3%83%BC%E5%A0%B4' target='_blank'>池之平溫泉滑雪場 (Alpen Blick)</a> — 約 5 分 (3 公里)",
            "🏂 雪具：<a href='https://www.google.com/maps/search/?api=1&query=%E6%B1%A0%E3%81%AE%E5%B9%B3%E6%B8%A9%E6%B3%89%E3%82%B9%E3%82%AD%E3%83%BC%E5%A0%B4+%E3%83%AC%E3%83%B3%E3%82%BF%E3%83%AB' target='_blank'>Alpen Blick 專屬租借站</a> — 約 5 分 (3 公里)",
            "🚉 車站：<a href='https://www.google.com/maps/search/?api=1&query=%E5%A6%99%E9%AB%98%E9%AB%98%E5%8E%9F%E9%A7%85' target='_blank'>妙高高原車站</a> — 約 4 分 (1.8 公里)",
            "🚗 租車：<a href='https://www.google.com/maps/search/?api=1&query=%E3%83%8B%E3%83%83%E3%83%9D%E3%83%B3%E3%83%AC%E3%83%B3%E3%82%BF%E3%82%AB%E3%83%BC+%E5%A6%99%E9%AB%98%E9%AB%98%E5%8E%9F%E9%A7%85%E5%89%8D%E5%96%B6%E6%A5%AD%E6%89%80' target='_blank'>Nippon Rent-A-Car (妙高高原站前)</a> — 約 4 分 (1.8 公里)",
            "📸 景點：<a href='https://www.google.com/maps/search/?api=1&query=%E5%A6%99%E9%AB%98%E9%AB%98%E5%8E%9F%E3%82%A2%E3%83%AB%E3%83%9A%E3%83%B3%E3%83%96%E3%83%AA%E3%83%83%E3%82%AF%E3%83%93%E3%83%BC%E3%83%AB' target='_blank'>妙高高原啤酒廠 (Alpen Blick 內)</a> — 約 5 分 (3 公里)"
        ],
        images: [
            "assets/house1/0b4b309b-f0e5-4a6d-9e04-810683e541fc.jpeg",
            "assets/house1/53edafcf-cb74-42ec-a69a-b6cd0ea908ec.jpeg",
            "assets/house1/54410718-dd8e-41f1-9f5f-a97bef760a2e.jpeg",
            "assets/house1/e6534bf3-4aa0-4d81-8fec-b6fd81ce7a4b.jpeg",
            "assets/house1/fe9b79e3-8e21-46cf-af34-eac674dfe645.jpeg"
        ]
    },
    {
        id: "house2",
        name: "可容納最多 12 人的 5 房 2 客廳奢華別墅",
        rating: "5.0 (5則)",
        price: "$93,918 (免費停車)",
        specs: "12人 / 5房10床 / 2.5衛 / 有廚房",
        location: "赤倉溫泉區 (Akakura Onsen)",
        coordinates: "36.8905, 138.182",
        localGuide: [
            "🍽️ 餐廳：<a href='https://www.google.com/maps/search/?api=1&query=%E3%83%AC%E3%82%B9%E3%83%88%E3%83%A9%E3%83%B3%E6%9F%B4%E7%94%B0+%E8%B5%A4%E5%80%89' target='_blank'>Restaurant Shibata (高人氣洋食定食)</a> — 約 2 分 (600 公尺)",
            "🍢 小吃：<a href='https://www.google.com/maps/search/?api=1&query=%E8%B5%A4%E5%80%89%E6%B8%A9%E6%B3%89%E8%A1%97+%E9%A3%9F%E4%BA%8B' target='_blank'>赤倉溫泉街美食</a> — 約 3 分 (800 公尺)",
            "♨️ 溫泉：<a href='https://www.google.com/maps/search/?api=1&query=%E8%B5%A4%E5%80%89%E6%B8%A9%E6%B3%89' target='_blank'>赤倉溫泉 (Akakura Onsen)</a> — 約 2 分 (500 公尺)",
            "⛷️ 雪場：<a href='https://www.google.com/maps/search/?api=1&query=%E8%B5%A4%E5%80%89%E6%B8%A9%E6%B3%89%E3%82%B9%E3%82%AD%E3%83%BC%E5%A0%B4' target='_blank'>赤倉溫泉滑雪場</a> — 約 2 分 (500 公尺)",
            "🏂 雪具：<a href='https://www.google.com/maps/search/?api=1&query=Myoko+Snowsports' target='_blank'>Myoko Snowsports</a> — 約 3 分 (800 公尺)",
            "🚉 車站：<a href='https://www.google.com/maps/search/?api=1&query=%E5%A6%99%E9%AB%98%E9%AB%98%E5%8E%9F%E9%A7%85' target='_blank'>妙高高原車站</a> — 約 10 分 (5 公里)",
            "🚗 租車：<a href='https://www.google.com/maps/search/?api=1&query=%E3%82%AA%E3%83%AA%E3%83%83%E3%82%AF%E3%82%B9%E3%83%AC%E3%83%B3%E3%82%BF%E3%82%AB%E3%83%BC+%E4%B8%8A%E8%B6%8A%E5%A6%99%E9%AB%98%E9%A7%85%E5%89%8D%E5%BA%97' target='_blank'>Orix Rent-A-Car (上越妙高大站)</a> — 約 35 分 (30 公里，適合大型休旅)",
            "📸 景點：<a href='https://www.google.com/maps/search/?api=1&query=%E8%B5%A4%E5%80%89%E6%B8%A9%E6%B3%89%E8%A1%97' target='_blank'>赤倉溫泉街中心</a> — 約 2 分 (500 公尺)"
        ],
        images: [
            "assets/house2/28160ea0-cb4f-4fc1-aa0b-4957b8af5de8.png",
            "assets/house2/3fe4c824-0ca0-4468-a210-36e472f84873.jpeg",
            "assets/house2/5e9ea3b5-d866-46aa-b7c9-886a84dc95c9.jpeg",
            "assets/house2/64ab1b42-c107-4e1b-bfb6-c4cf99e006c7.jpeg",
            "assets/house2/72b5b34a-5105-4a6c-a7fe-1706e4e39648.jpeg",
            "assets/house2/865a6352-8208-4bb4-b1e9-87f0380bfee9.jpeg",
            "assets/house2/952289ec-6e09-4335-9a7a-a01219691d4a.jpeg",
            "assets/house2/d39eb235-826b-4531-84e2-0262354cf823.jpeg",
            "assets/house2/d8da23a7-6d05-4fe6-b5cc-22413bcec116.jpeg",
            "assets/house2/e624c9a8-a52d-4a49-bed3-d10b1aacc75e.jpeg"
        ]
    },
    {
        id: "house3",
        name: "Myoko by kokomyoko的獨立客用住房",
        rating: "5.0 (7則)",
        price: "$90,774 (免費停車)",
        specs: "8人 / 4房6床 / 1.5衛 / 有廚房",
        location: "鄰近滑雪勝地",
        coordinates: "36.8753, 138.21",
        localGuide: [
            "🍽️ 餐廳：<a href='https://www.google.com/maps/search/?api=1&query=%E3%82%84%E3%81%B6%E3%81%9D%E3%81%B0+%E5%A6%99%E9%AB%98' target='_blank'>やぶそば Yabu Soba (老字號蕎麥麵)</a> — 約 2 分 (1 公里)",
            "🍢 小吃：<a href='https://www.google.com/maps/search/?api=1&query=%E5%A6%99%E9%AB%98%E9%AB%98%E5%8E%9F%E9%A7%85+%E3%81%8A%E5%9C%9F%E7%94%A3' target='_blank'>車站前土產小吃街</a> — 約 1 分 (500 公尺)",
            "♨️ 溫泉：<a href='https://www.google.com/maps/search/?api=1&query=%E5%A6%99%E9%AB%98%E6%B8%A9%E6%B3%89' target='_blank'>妙高溫泉區</a> — 約 4 分 (2 公里)",
            "⛷️ 雪場：<a href='https://www.google.com/maps/search/?api=1&query=%E8%B5%A4%E5%80%89%E8%A6%B3%E5%85%89%E3%83%AA%E3%82%BE%E3%83%BC%E3%83%88%E3%82%B9%E3%82%AD%E3%83%BC%E5%A0%B4' target='_blank'>赤倉觀光度假滑雪場 (Akakan)</a> — 約 8 分 (4.5 公里)",
            "🏂 雪具：<a href='https://www.google.com/maps/search/?api=1&query=%E5%A6%99%E9%AB%98%E9%AB%98%E5%8E%9F%E9%A7%85+%E3%82%B9%E3%82%AD%E3%83%BC%E3%83%AC%E3%83%B3%E3%82%BF%E3%83%AB' target='_blank'>車站周邊雪具店</a> — 約 2 分 (1 公里以內)",
            "🚉 車站：<a href='https://www.google.com/maps/search/?api=1&query=%E5%A6%99%E9%AB%98%E9%AB%98%E5%8E%9F%E9%A7%85' target='_blank'>妙高高原車站</a> — 約 2 分 (500 公尺)",
            "🚗 租車：<a href='https://www.google.com/maps/search/?api=1&query=%E3%83%8B%E3%83%83%E3%83%9D%E3%83%B3%E3%83%AC%E3%83%B3%E3%82%BF%E3%82%AB%E3%83%BC+%E5%A6%99%E9%AB%98%E9%AB%98%E5%8E%9F%E9%A7%85%E5%89%8D%E5%96%B6%E6%A5%AD%E6%89%80' target='_blank'>Nippon Rent-A-Car (妙高高原站前)</a> — 約 2 分 (500 公尺)",
            "📸 景點：<a href='https://www.google.com/maps/search/?api=1&query=%E5%8E%9F%E4%BF%A1+%E5%A6%99%E9%AB%98%E5%BA%97' target='_blank'>原信超市 Harashin 妙高店 (採買首選)</a> — 約 20 分 (18 公里)"
        ],
        images: [
            "assets/house3/0083f4f9-56ff-4b36-a136-37329ae846af.jpeg",
            "assets/house3/1da62436-90fd-4527-a612-fc604a85b732.jpeg",
            "assets/house3/2b980f79-f40f-4de9-bd85-6684e160a67e.jpeg",
            "assets/house3/57e54a54-06de-4c69-bf6d-f4d0f7eeac2a.jpeg",
            "assets/house3/5e40d0b9-d8b1-4889-9c85-5def9a59e481.jpeg",
            "assets/house3/66c6398f-53f8-4942-a526-8a8fc413de07.jpeg",
            "assets/house3/6a95409b-359c-4e2e-abd3-27b1d6a6a56c.jpeg",
            "assets/house3/7ecf23ac-d02d-4214-90b2-c704917dcefa.jpeg",
            "assets/house3/83bdf8d9-f360-4c90-bf68-eccd433d2f1f.jpeg",
            "assets/house3/846a5374-6877-4c81-8f81-114c30226498.jpeg",
            "assets/house3/8b61da83-cf08-4773-b0db-071c310b3b17.jpeg",
            "assets/house3/a1b82473-3baa-43b0-b02e-8fbab16bdca8.jpeg",
            "assets/house3/aa5cea53-e640-47c1-9bc1-85db4fb08ef6.jpeg",
            "assets/house3/ad072cd5-d140-472a-95d6-b9b09edaaaca.jpeg",
            "assets/house3/ca0ed149-02b3-44cd-bae3-ed54d5180f19.jpeg",
            "assets/house3/cd60bca8-ae03-4363-8d53-4e3191607cb8.jpeg",
            "assets/house3/d3cdb5be-a679-4c72-a78b-32bc91768fa9.jpeg",
            "assets/house3/d660015c-9528-4fb9-81fe-2c21f77ccc1c.jpeg",
            "assets/house3/e12e47e5-20f0-47d8-9ea0-deaa850701de.jpeg",
            "assets/house3/e39ddaef-25f4-46b2-9e33-6b99a3a752bd.jpeg",
            "assets/house3/e5db67de-e0ff-46e4-ac2c-031d12dce906.jpeg",
            "assets/house3/ed9462ab-5344-43d8-8a03-d7de49be95fc.jpeg",
            "assets/house3/f4d92218-5176-40c7-89dd-44329711d28a.jpeg",
            "assets/house3/fb30a554-1293-46ec-a9d0-07640155f0f7.jpeg",
            "assets/house3/fdce4607-d414-4146-a91f-8a02990c22e4.jpeg"
        ]
    },
    {
        id: "house4",
        name: "步行 30 秒即可抵達妙高高原站",
        rating: "5.0 (8則)",
        price: "$88,416 (免費停車)",
        specs: "8人 / 3房6床 / 1衛 / 有廚房",
        location: "赤倉、杉之原、斑尾、樂天新井",
        coordinates: "36.8726, 138.2114",
        localGuide: [
            "🍽️ 餐廳：<a href='https://www.google.com/maps/search/?api=1&query=%E9%87%9C%E5%8F%B3%E8%A1%9B%E9%96%80+%E5%A6%99%E9%AB%98' target='_blank'>釜右衛門 Kamaemon (在地餐廳)</a> — 約 1 分 (200 公尺)",
            "🍢 小吃：<a href='https://www.google.com/maps/search/?api=1&query=%E5%B1%85%E9%85%92%E5%B1%8B+%E5%85%AB+%E5%A6%99%E9%AB%98%E9%AB%98%E5%8E%9F' target='_blank'>居酒屋 八 Eight</a> — 約 2 分 (500 公尺)",
            "♨️ 溫泉：<a href='https://www.google.com/maps/search/?api=1&query=%E5%A6%99%E9%AB%98%E6%B8%A9%E6%B3%89' target='_blank'>妙高溫泉區</a> — 約 3 分 (1.5 公里)",
            "⛷️ 雪場：<a href='https://www.google.com/maps/search/?api=1&query=%E8%B5%A4%E5%80%89%E6%B8%A9%E6%B3%89%E3%82%B9%E3%82%AD%E3%83%BC%E5%A0%B4' target='_blank'>赤倉溫泉滑雪場</a> — 約 10 分 (5 公里)",
            "🏂 雪具：<a href='https://www.google.com/maps/search/?api=1&query=%E5%A6%99%E9%AB%98%E9%AB%98%E5%8E%9F%E9%A7%85+%E3%82%B9%E3%82%AD%E3%83%BC%E3%83%AC%E3%83%B3%E3%82%BF%E3%83%AB' target='_blank'>車站周邊雪具店</a> — 約 1-10 分",
            "🚉 車站：<a href='https://www.google.com/maps/search/?api=1&query=%E5%A6%99%E9%AB%98%E9%AB%98%E5%8E%9F%E9%A7%85' target='_blank'>妙高高原車站</a> — 約 1 分 (50 公尺，步行即達)",
            "🚗 租車：<a href='https://www.google.com/maps/search/?api=1&query=%E3%83%8B%E3%83%83%E3%83%9D%E3%83%B3%E3%83%AC%E3%83%B3%E3%82%BF%E3%82%AB%E3%83%BC+%E5%A6%99%E9%AB%98%E9%AB%98%E5%8E%9F%E9%A7%85%E5%89%8D%E5%96%B6%E6%A5%AD%E6%89%80' target='_blank'>Nippon Rent-A-Car (妙高高原站前)</a> — 約 1 分 (50 公尺)",
            "📸 景點：<a href='https://www.google.com/maps/search/?api=1&query=%E5%A6%99%E9%AB%98%E9%AB%98%E5%8E%9F%E3%83%93%E3%82%B8%E3%82%BF%E3%83%BC%E3%82%BB%E3%83%B3%E3%82%BF%E3%83%BC' target='_blank'>妙高高原遊客中心</a> — 約 6 分 (4 公里)"
        ],
        images: [
            "assets/house4/1ff321b1-9fc0-4422-8a20-812409637874.jpeg",
            "assets/house4/72fef5d4-3bab-4528-97b6-8289e2eb8a7d.jpeg",
            "assets/house4/7daa0bb7-f4bc-42e6-a5f9-6672176c26a0.jpeg",
            "assets/house4/a3a6d199-8445-4b66-9b6b-a4c5d3355a44.jpeg",
            "assets/house4/d054d464-93f4-4c36-9455-85973a4a8412.jpeg"
        ]
    },
    {
        id: "house5",
        name: "【最多12人】可與愛犬一起放鬆的整棟度假木屋",
        rating: "5.0 (5則)",
        price: "$75,448 (免費停車)",
        specs: "12人 / 4房11床 / 1衛 / 有廚房",
        location: "赤倉、杉之原、長尾",
        coordinates: "36.88091, 138.18479",
        localGuide: [
            "🍽️ 餐廳：<a href='https://www.google.com/maps/search/?api=1&query=Panorama+Cafe+%E5%A6%99%E9%AB%98' target='_blank'>Panorama Café & Dining</a> — 約 4 分 (2 公里)",
            "🍢 小吃：<a href='https://www.google.com/maps/search/?api=1&query=%E8%B5%A4%E5%80%89%E8%A6%B3%E5%85%89%E3%83%AA%E3%82%BE%E3%83%BC%E3%83%88+%E3%83%AC%E3%82%B9%E3%83%88%E3%83%A9%E3%83%B3' target='_blank'>赤倉觀光區周邊餐飲</a> — 約 5 分 (2.5 公里)",
            "♨️ 溫泉：<a href='https://www.google.com/maps/search/?api=1&query=%E6%96%B0%E8%B5%A4%E5%80%89%E6%B8%A9%E6%B3%89' target='_blank'>新赤倉溫泉</a> — 約 3 分 (1.5 公里)",
            "⛷️ 雪場：<a href='https://www.google.com/maps/search/?api=1&query=%E8%B5%A4%E5%80%89%E8%A6%B3%E5%85%89%E3%83%AA%E3%82%BE%E3%83%BC%E3%83%88%E3%82%B9%E3%82%AD%E3%83%BC%E5%A0%B4' target='_blank'>赤倉觀光度假滑雪場 (Akakan)</a> — 約 4 分 (2 公里)",
            "🏂 雪具：<a href='https://www.google.com/maps/search/?api=1&query=Japan+Snowsports+Myoko' target='_blank'>Japan Snowsports</a> — 約 4 分 (2 公里)",
            "🚉 車站：<a href='https://www.google.com/maps/search/?api=1&query=%E5%A6%99%E9%AB%98%E9%AB%98%E5%8E%9F%E9%A7%85' target='_blank'>妙高高原車站</a> — 約 8 分 (4.5 公里)",
            "🚗 租車：<a href='https://www.google.com/maps/search/?api=1&query=%E3%83%8B%E3%83%83%E3%83%9D%E3%83%B3%E3%83%AC%E3%83%B3%E3%82%BF%E3%82%AB%E3%83%BC+%E5%A6%99%E9%AB%98%E9%AB%98%E5%8E%9F%E9%A7%85%E5%89%8D%E5%96%B6%E6%A5%AD%E6%89%80' target='_blank'>Nippon Rent-A-Car (妙高高原站前)</a> — 約 8 分 (4.5 公里)",
            "📸 景點：<a href='https://www.google.com/maps/search/?api=1&query=%E5%A6%99%E9%AB%98%E5%B1%B1%E7%99%BB%E5%B1%B1%E5%8F%A3' target='_blank'>妙高山登山口</a> — 約 10 分 (5 公里)"
        ],
        images: [
            "assets/house5/1a8180ee-990d-4cf3-b526-40fcbfcd60d6.jpeg",
            "assets/house5/3e8ec512-2ea7-470b-a2fc-f8606c45732c.jpeg",
            "assets/house5/4fffd217-67e3-49c5-a8d1-186aaeca20d8.jpeg",
            "assets/house5/57746c97-b86a-4e85-8d96-5d32ed72e670.jpeg",
            "assets/house5/a8990ea6-780f-4787-a2e1-f4c59e06e78c.jpeg",
            "assets/house5/b4f5c15e-0fb7-428c-b136-39f3ae9ca1c2.jpeg",
            "assets/house5/c8788810-d5cc-444b-92f9-417033e4e413.jpeg",
            "assets/house5/d97eaee6-66d5-46ac-aae9-05545a5930a1.jpeg"
        ]
    },
    {
        id: "house6",
        name: "Hinode 小木屋 • 妙高島的獨棟房屋",
        rating: "4.9 (16則)",
        price: "$73,701 (免費停車)",
        specs: "6人 / 3房5床 / 1.5衛 / 有廚房",
        location: "杉之原、Alpen Blick",
        coordinates: "36.86063, 138.16632",
        localGuide: [
            "🍽️ 餐廳：<a href='https://www.google.com/maps/search/?api=1&query=Two+Pines+Myoko' target='_blank'>Two Pines (知名石窯披薩)</a> — 約 3 分 (1 公里)",
            "🍢 小吃：<a href='https://www.google.com/maps/search/?api=1&query=%E6%9D%89%E9%87%8E%E6%B2%A2+%E9%A3%9F%E5%A0%82' target='_blank'>杉之澤村在地食堂</a> — 約 4 分 (1.5 公里)",
            "♨️ 溫泉：<a href='https://www.google.com/maps/search/?api=1&query=%E6%9D%89%E9%87%8E%E6%B2%A2%E6%B8%A9%E6%B3%89+%E8%8B%97%E5%90%8D%E3%81%AE%E6%B9%AF' target='_blank'>杉野澤溫泉 苗名之湯</a> — 約 4 分 (1.5 公里)",
            "⛷️ 雪場：<a href='https://www.google.com/maps/search/?api=1&query=%E5%A6%99%E9%AB%98%E6%9D%89%E3%83%8E%E5%8E%9F%E3%82%B9%E3%82%AD%E3%83%BC%E5%A0%B4' target='_blank'>妙高杉之原滑雪場</a> — 約 3 分 (1.2 公里)",
            "🏂 雪具：<a href='https://www.google.com/maps/search/?api=1&query=%E5%A6%99%E9%AB%98%E6%9D%89%E3%83%8E%E5%8E%9F%E3%82%B9%E3%82%AD%E3%83%BC%E5%A0%B4+%E3%83%AC%E3%83%B3%E3%82%BF%E3%83%AB' target='_blank'>杉之原雪場直營租借站</a> — 約 3 分 (1.2 公里)",
            "🚉 車站：<a href='https://www.google.com/maps/search/?api=1&query=%E5%A6%99%E9%AB%98%E9%AB%98%E5%8E%9F%E9%A7%85' target='_blank'>妙高高原車站</a> — 約 12 分 (6 公里)",
            "🚗 租車：<a href='https://www.google.com/maps/search/?api=1&query=%E3%83%8B%E3%83%83%E3%83%9D%E3%83%B3%E3%83%AC%E3%83%B3%E3%82%BF%E3%82%AB%E3%83%BC+%E5%A6%99%E9%AB%98%E9%AB%98%E5%8E%9F%E9%A7%85%E5%89%8D%E5%96%B6%E6%A5%AD%E6%89%80' target='_blank'>Nippon Rent-A-Car (妙高高原站前)</a> — 約 12 分 (6 公里)",
            "📸 景點：<a href='https://www.google.com/maps/search/?api=1&query=%E8%8B%97%E5%90%8D%E6%BB%9D' target='_blank'>苗名瀑布 (Naena Falls)</a> — 約 8 分 (4 公里)"
        ],
        images: [
            "assets/house6/01acdbda-8506-4f3b-a739-f1a2d359b746 (1).jpeg",
            "assets/house6/1d2ced4a-3a67-4bf0-a9a0-71c380534367 (1).jpeg",
            "assets/house6/26de4aa7-c8f0-449a-b89a-5e65ae81ccc5 (1).jpeg",
            "assets/house6/43b2b3a6-5dc6-4656-91fe-3e12da19e2f7.jpeg",
            "assets/house6/43e7cc56-0cd6-4634-bd17-a21f8fa74d64.jpeg",
            "assets/house6/49337be8-78e5-4b76-b595-bfad03ce56d8.jpeg",
            "assets/house6/6e008380-8f99-4e38-8f87-94f2b5d6582f.jpeg",
            "assets/house6/759f7ecd-3806-44e5-835e-81820acd5015.jpeg",
            "assets/house6/8460026f-1ff9-42e9-887c-cd4e2c8a51aa.jpeg",
            "assets/house6/918c31ed-19c6-42c5-ae27-be6b399aad30.jpeg",
            "assets/house6/934aa782-dd92-46da-92f8-236e6fd51724.jpeg",
            "assets/house6/a89b88e5-b67a-4ca9-9b04-02fc98692076 (1).jpeg",
            "assets/house6/c8cb93b8-379f-4a31-8a51-3ada4585ca02.jpeg",
            "assets/house6/de5cadc4-6179-4aa8-89b1-05a9ffdad9d9.jpeg",
            "assets/house6/edda3f49-ca75-4299-824e-ffe1fc2eb943.jpeg"
        ]
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('housing-grid');
    if (!grid) return;

    housingData.forEach(house => {
        const card = document.createElement('div');
        card.className = 'glass-card house-card';

        // --- 圖片輪播 ---
        let imagesHtml = house.images.map(img => `<img src="${img}" alt="${house.name}" loading="lazy">`).join('');
        let dotsHtml = house.images.map((_, idx) => `<div class="dot ${idx === 0 ? 'active' : ''}"></div>`).join('');

        // --- 周邊機能：橫向滑動 Pill ---
        let guideHtml = (house.localGuide || []).map(item => {
            let processedItem = item;
            if (processedItem.includes('步行')) {
                processedItem = processedItem.replace('步行', '🚶 步行');
            } else if (processedItem.includes('— 約')) {
                processedItem = processedItem.replace('— 約', '— 🚗 開車約');
            }
            return `<li class="guide-pill">${processedItem}</li>`;
        }).join('');

        // --- 價格拆分計算 ---
        const totalTWD = parsePriceNumber(house.price);
        const parkingNote = house.price.includes('免費停車') ? '免費停車' : '';
        const per6TWD = Math.round((totalTWD / 6) / nights);
        const per8TWD = Math.round((totalTWD / 8) / nights);
        const per6HKD = Math.round(per6TWD * twdToHkdRate);
        const per8HKD = Math.round(per8TWD * twdToHkdRate);
        const totalHKD = Math.round(totalTWD * twdToHkdRate);

        card.innerHTML = `
            <div class="slider-container">
                <div class="slider-images">
                    ${imagesHtml}
                </div>
                <button class="slider-btn prev">&#10094;</button>
                <button class="slider-btn next">&#10095;</button>
                <div class="slider-dots">
                    ${dotsHtml}
                </div>
            </div>
            <div class="house-content">
                <h4 class="house-title">${house.name}</h4>
                <div class="house-info"><span>⭐</span> ${house.rating} <span class="badge-airbnb">via Airbnb</span></div>
                <div class="house-info price-main"><span>💰</span> 總價 NT$ ${totalTWD.toLocaleString()} (2027/03/03~03/07 共4晚) <span class="badge-parking">${parkingNote}</span></div>
                <div class="price-breakdown">
                    <span class="badge-hkd">≈ HK$ ${totalHKD.toLocaleString()}</span>
                </div>
                <div class="price-breakdown">
                    <span class="badge-split">6人均攤：NT$ ${per6TWD.toLocaleString()} / HK$ ${per6HKD.toLocaleString()} (每人/晚)</span>
                </div>
                <div class="price-breakdown">
                    <span class="badge-split">8人均攤：NT$ ${per8TWD.toLocaleString()} / HK$ ${per8HKD.toLocaleString()} (每人/晚)</span>
                </div>
                <div class="house-info"><span>🏠</span> ${house.specs}</div>
                <div class="house-info"><span>📍</span> ${house.location}</div>
                <div class="guide-section">
                    <p class="guide-title">🗺️ 周邊機能 Local Guide <span style="font-size: 0.75rem; color: var(--text-secondary); font-weight: normal;">(🚗 預設為駕車預估)</span></p>
                    <ul class="scrollable-guide">
                        ${guideHtml}
                    </ul>
                </div>
                <div class="vote-results" id="votes-${house.id}"></div>
                <div class="house-actions">
                    <a href="https://www.google.com/maps/search/?api=1&query=${house.coordinates}" target="_blank" class="btn-secondary">🗺️ 點我導航至房源</a>
                    <a href="#" class="btn-vote" data-id="${house.id}" data-name="${house.name}">投它一票</a>
                </div>
            </div>
        `;

        grid.appendChild(card);
        setupSlider(card.querySelector('.slider-container'));
    });

    // --- 為所有 slider 圖片綁定 Lightbox 事件 ---
    document.querySelectorAll('.slider-images img').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            const container = img.closest('.slider-container');
            const allImgs = Array.from(container.querySelectorAll('.slider-images img'));
            const srcs = allImgs.map(i => i.src);
            const idx = allImgs.indexOf(img);
            openLightbox(srcs, idx);
        });
    });
});

function setupSlider(container) {
    const imagesContainer = container.querySelector('.slider-images');
    const images = container.querySelectorAll('.slider-images img');
    const prevBtn = container.querySelector('.prev');
    const nextBtn = container.querySelector('.next');
    const dots = container.querySelectorAll('.dot');

    let currentIndex = 0;
    const total = images.length;
    if (total === 0) return;

    function updateSlider() {
        imagesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex === 0) ? total - 1 : currentIndex - 1;
        updateSlider();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex === total - 1) ? 0 : currentIndex + 1;
        updateSlider();
    });

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            currentIndex = idx;
            updateSlider();
        });
    });
}


// --------------------------------------------------------------------------
// 5. Lightbox 圖片放大檢視
// --------------------------------------------------------------------------
let lightboxImages = [];
let lightboxIndex = 0;
// Lightbox DOM \u7de9\u5b58\u2014\u9867\u540d\u601d\u7fa9\uff0c\u907f\u514d\u6bcf\u6b21\u4ea4\u4e92\u90fd getElementById
let _lbOverlay = null;
let _lbImg = null;
let _lbCounter = null;

function createLightbox() {
    if (_lbOverlay) return; // \u5df2\u5efa\u7acb\u5247\u8df3\u904e
    _lbOverlay = document.createElement('div');
    _lbOverlay.id = 'lightbox-overlay';
    _lbOverlay.innerHTML = `
        <button class="lb-close" aria-label="\u95dc\u9589">&times;</button>
        <button class="lb-prev" aria-label="\u4e0a\u4e00\u5f35">&#10094;</button>
        <img class="lb-img" src="" alt="Lightbox">
        <button class="lb-next" aria-label="\u4e0b\u4e00\u5f35">&#10095;</button>
        <div class="lb-counter"></div>
    `;
    document.body.appendChild(_lbOverlay);

    // \u5b50\u5143\u7d20\u7de9\u5b58
    _lbImg = _lbOverlay.querySelector('.lb-img');
    _lbCounter = _lbOverlay.querySelector('.lb-counter');

    _lbOverlay.querySelector('.lb-close').addEventListener('click', closeLightbox);
    _lbOverlay.querySelector('.lb-prev').addEventListener('click', () => navigateLightbox(-1));
    _lbOverlay.querySelector('.lb-next').addEventListener('click', () => navigateLightbox(1));
    _lbOverlay.addEventListener('click', (e) => {
        if (e.target === _lbOverlay) closeLightbox();
    });

    document.addEventListener('keydown', handleLightboxKey);
}

function handleLightboxKey(e) {
    if (!_lbOverlay || !_lbOverlay.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
}

function openLightbox(images, startIndex) {
    createLightbox();
    lightboxImages = images;
    lightboxIndex = startIndex;
    _lbOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateLightboxImage();
}

function closeLightbox() {
    if (_lbOverlay) {
        _lbOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function navigateLightbox(direction) {
    lightboxIndex += direction;
    if (lightboxIndex < 0) lightboxIndex = lightboxImages.length - 1;
    if (lightboxIndex >= lightboxImages.length) lightboxIndex = 0;
    updateLightboxImage();
}

function updateLightboxImage() {
    if (!_lbImg || !_lbCounter) return;
    _lbImg.src = lightboxImages[lightboxIndex];
    _lbCounter.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
}

// --------------------------------------------------------------------------
// 6. 投票系統與 Firebase 整合
// --------------------------------------------------------------------------
// TODO: 請替換為您的 Firebase 專案設定
const firebaseConfig = {
  apiKey: "AIzaSyCBQ0J-lnpf4dnqMWk0Hy6GwOUGH_VRzvI",
  authDomain: "myoko-snowboard-2027.firebaseapp.com",
  // 👇 就是這行！請務必把它加進去 👇
  databaseURL: "https://myoko-snowboard-2027-default-rtdb.asia-southeast1.firebasedatabase.app",
  // 👆 就是這行！請務必把它加進去 👆
  projectId: "myoko-snowboard-2027",
  storageBucket: "myoko-snowboard-2027.firebasestorage.app",
  messagingSenderId: "174950028588",
  appId: "1:174950028588:web:cd54a1b24b51e46dc9c889"
};// 初始化 Firebase
// 全局層 Firebase db 宊告，防止後續使用 db 時區影極錯導致骨牌效應
let db = null;

if (!isLocalFile && typeof firebase !== 'undefined' && firebaseConfig.apiKey !== "YOUR_API_KEY") {
    firebase.initializeApp(firebaseConfig);
    db = firebase.database(); // 赋値到全局 db
    
    // 即時監聽所有投票資料
    const votesRef = db.ref('votes');
    votesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        renderAllVotes(data);
    });
}

// 綁定 Modal 相關 DOM
const voteModal = document.getElementById('vote-modal');
const closeVoteModal = document.getElementById('close-vote-modal');
const voteModalTitle = document.getElementById('vote-modal-title');
const voterNameInput = document.getElementById('voter-name');
const voterReasonInput = document.getElementById('voter-reason');
const voteHouseIdInput = document.getElementById('vote-house-id');
const submitVoteBtn = document.getElementById('submit-vote');
const quickReasonBtns = document.querySelectorAll('.btn-quick-reason');

// 開啟 Modal 事件 (使用事件委派)
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-vote')) {
        e.preventDefault();
        const houseId = e.target.getAttribute('data-id');
        const houseName = e.target.getAttribute('data-name');
        
        voteHouseIdInput.value = houseId;
        voteModalTitle.textContent = `投給: ${houseName}`;
        voterNameInput.value = '';
        voterReasonInput.value = '';
        
        voteModal.classList.remove('hidden');
        voteModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
});

// 關閉 Modal
function hideVoteModal() {
    voteModal.classList.remove('active');
    setTimeout(() => voteModal.classList.add('hidden'), 300);
    document.body.style.overflow = '';
}
closeVoteModal?.addEventListener('click', hideVoteModal);
voteModal?.addEventListener('click', (e) => {
    if (e.target === voteModal) hideVoteModal();
});

// 快捷原因按鈕邏輯
quickReasonBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const reason = btn.textContent;
        const currentText = voterReasonInput.value.trim();
        if (currentText) {
            voterReasonInput.value = currentText + '，' + reason;
        } else {
            voterReasonInput.value = reason;
        }
    });
});

// 送出投票
submitVoteBtn?.addEventListener('click', () => {
    const houseId = voteHouseIdInput.value;
    const name = voterNameInput.value.trim();
    const reason = voterReasonInput.value.trim();
    
    if (!name || !reason) {
        alert('請填寫姓名與原因！');
        return;
    }
    
    // 如果 Firebase 已初始化，寫入資料庫；否則僅顯示警示
    if (!isLocalFile && typeof firebase !== 'undefined' && firebaseConfig.apiKey !== "YOUR_API_KEY") {
        const newVoteRef = firebase.database().ref('votes/' + houseId).push();
        newVoteRef.set({
            name: name,
            reason: reason,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
            hideVoteModal();
        }).catch((error) => {
            alert('投票失敗: ' + error.message);
        });
    } else {
        alert(`(模擬投票成功)\n姓名: ${name}\n原因: ${reason}\n\n注意：請至 script.js 替換 firebaseConfig 以啟用真實資料庫！`);
        hideVoteModal();
    }
});

// --- 取得專屬頭像與顏色 ---
function getVoterStyle(name) {
    const avatars = ['🏂', '⛄', '🐧', '❄️', '🦊', '🎿', '🏔️'];
    const colors = ['#38BDF8', '#7DD3FC', '#A78BFA', '#6EE7B7', '#FDBA74'];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash += name.charCodeAt(i);
    }
    
    return {
        avatar: avatars[hash % avatars.length],
        color: colors[hash % colors.length]
    };
}

// 渲染投票結果至卡片
function renderAllVotes(votesData) {
    if (!votesData) return;
    
    // 清空現有所有卡片的投票區塊與區隔線
    document.querySelectorAll('.vote-results').forEach(el => {
        el.innerHTML = '';
        if (el.previousElementSibling && el.previousElementSibling.classList.contains('vote-separator')) {
            el.previousElementSibling.remove();
        }
    });
    
    Object.keys(votesData).forEach(houseId => {
        const houseVotes = votesData[houseId];
        const resultContainer = document.getElementById(`votes-${houseId}`);
        if (!resultContainer) return;
        
        const voteIds = Object.keys(houseVotes);
        const voteCount = voteIds.length;
        
        if (voteCount > 0) {
            resultContainer.insertAdjacentHTML('beforebegin', `<div class="vote-separator"><span>📊 旅伴投票結果 (共 ${voteCount} 票)</span></div>`);
        }
        
        let html = '';
        voteIds.forEach(voteId => {
            const vote = houseVotes[voteId];
            const style = getVoterStyle(vote.name);
            html += `
                <div class="vote-tag">
                    <span class="vote-tag-name" style="color: ${style.color};">${style.avatar} ${vote.name}</span>
                    <span class="vote-tag-reason">${vote.reason}</span>
                </div>
            `;
        });
        resultContainer.innerHTML = html;
    });
}
// --------------------------------------------------------------------------
// 7. 影音回憶錄專屬密碼鎖 (is-locked 物理斷絕機制)
// --------------------------------------------------------------------------
const gallerySection = document.getElementById('gallery');
const galleryAuthOverlay = document.getElementById('gallery-auth-overlay');
const galleryContent = document.getElementById('gallery-content');
const galleryPasswordInput = document.getElementById('gallery-password');
const btnUnlockGallery = document.getElementById('btn-unlock-gallery');
const galleryAuthError = document.getElementById('gallery-auth-error');

/**
 * 解鎖 Gallery 的共用函式：
 * 1. 移除 #gallery 的 .is-locked（CSS 物理斷絕解除）
 * 2. 隱藏密碼鎖遮罩
 * 3. 顯示相簿內容
 */
function unlockGallery(animate) {
    if (animate) {
        galleryAuthOverlay.style.opacity = '0';
        galleryAuthOverlay.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            galleryAuthOverlay.style.display = 'none';
            galleryContent.classList.remove('hidden');
            gallerySection.classList.remove('is-locked');
        }, 300);
    } else {
        galleryAuthOverlay.style.display = 'none';
        galleryContent.classList.remove('hidden');
        gallerySection.classList.remove('is-locked');
    }
}

// 檢查是否已解鎖（Session 記憶）
if (sessionStorage.getItem('galleryUnlocked') === 'true') {
    if (galleryAuthOverlay && galleryContent && gallerySection) {
        unlockGallery(false);
    }
} else {
    // 確保未解鎖時物理斷絕生效
    if (gallerySection) {
        gallerySection.classList.add('is-locked');
    }
}

// 點擊解鎖按鈕
btnUnlockGallery?.addEventListener('click', () => {
    if (galleryPasswordInput.value === 'myoko2027') {
        sessionStorage.setItem('galleryUnlocked', 'true');
        galleryAuthError.classList.add('hidden');
        unlockGallery(true);
    } else {
        galleryAuthError.classList.remove('hidden');
        // 輸入框震動動畫
        galleryPasswordInput.style.animation = 'none';
        galleryPasswordInput.offsetHeight; // trigger reflow
        galleryPasswordInput.style.animation = 'shake 0.4s ease';
    }
});

// Enter 鍵觸發解鎖
galleryPasswordInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        btnUnlockGallery.click();
    }
});

// --------------------------------------------------------------------------
// 8. 影音回憶錄 Firebase 上傳與渲染邏輯
// --------------------------------------------------------------------------
if (!isLocalFile && typeof firebase !== 'undefined' && firebaseConfig.apiKey !== "YOUR_API_KEY") {
    // 初始化 Storage
    const storage = firebase.storage();
    const db = firebase.database();
    
    const fileInput = document.getElementById('upload-file-input');
    const categorySelect = document.getElementById('upload-category');
    const uploaderNameInput = document.getElementById('upload-uploader-name');
    const btnUploadMedia = document.getElementById('btn-upload-media');
    const progressContainer = document.getElementById('upload-progress-container');
    const progressBar = document.getElementById('upload-progress-bar');
    const progressText = document.getElementById('upload-progress-text');
    const mediaGridDynamic = document.getElementById('media-grid');
    
    // 上傳邏輯
    btnUploadMedia?.addEventListener('click', async () => {
        if (!fileInput || !fileInput.files.length) {
            alert('請選擇至少一個檔案！');
            return;
        }
        
        const files = fileInput.files;
        const category = categorySelect.value;
        const uploaderName = uploaderNameInput.value.trim() || '匿名旅伴';
        
        progressContainer.classList.remove('hidden');
        btnUploadMedia.disabled = true;
        
        let successCount = 0;
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileName = `${Date.now()}_${file.name}`;
            const storageRef = storage.ref(`gallery/${fileName}`);
            const fileType = file.type.startsWith('video') ? 'video' : 'image';
            
            try {
                const uploadTask = storageRef.put(file);
                
                await new Promise((resolve, reject) => {
                    uploadTask.on('state_changed', 
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            progressBar.style.width = progress + '%';
                            progressText.textContent = `上傳中... 第 ${i+1}/${files.length} 個 (${Math.round(progress)}%)`;
                        }, 
                        (error) => reject(error), 
                        async () => {
                            const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                            await db.ref('galleryData').push({
                                url: downloadURL,
                                type: fileType,
                                category: category,
                                uploader: uploaderName,
                                timestamp: firebase.database.ServerValue.TIMESTAMP
                            });
                            successCount++;
                            resolve();
                        }
                    );
                });
            } catch (error) {
                console.error("Upload error:", error);
                alert(`檔案 ${file.name} 上傳失敗: ${error.message}`);
            }
        }
        
        progressText.textContent = `上傳完成！成功上傳 ${successCount} 個檔案。`;
        progressBar.style.width = '100%';
        fileInput.value = '';
        setTimeout(() => {
            progressContainer.classList.add('hidden');
            progressBar.style.width = '0%';
            btnUploadMedia.disabled = false;
        }, 3000);
    });
    
    // 即時監聽渲染邏輯
    const galleryDataRef = db.ref('galleryData').orderByChild('timestamp');
    galleryDataRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (!data) {
            if (mediaGridDynamic) mediaGridDynamic.innerHTML = '<p style="color: var(--text-secondary); grid-column: 1 / -1; text-align: center;">目前還沒有上傳影音，快來分享你的回憶！</p>';
            return;
        }
        
        const categorizedData = { '滑雪英姿': [], '沿途風景': [], '美食與住宿': [] };
        
        Object.keys(data).forEach(key => {
            const item = data[key];
            if (categorizedData[item.category]) {
                categorizedData[item.category].push(item);
            } else {
                if (!categorizedData['其他']) categorizedData['其他'] = [];
                categorizedData['其他'].push(item);
            }
        });
        
        let html = '';
        Object.keys(categorizedData).forEach(cat => {
            const items = categorizedData[cat];
            if (items.length === 0) return;
            
            // gallery-category-title 的 grid-column:1/-1 已由 CSS 處理，移除 style 屬性
            html += `<h3 class="gallery-category-title">${cat}</h3>`;
            
            items.forEach(item => {
                // media-item 的 position:relative 已由 CSS 處理
                html += `<div class="media-item">`;
                if (item.type === 'image') {
                    html += `<img src="${item.url}" alt="${cat}" loading="lazy">`;
                } else if (item.type === 'video') {
                    html += `<video src="${item.url}" controls></video>`;
                }
                // 上傳者標籤改用 CSS class
                html += `<div class="media-uploader-badge">📸 ${item.uploader}</div>`;
                html += `</div>`;
            });
        });
        
        if (mediaGridDynamic) mediaGridDynamic.innerHTML = html;
    });
}

// --------------------------------------------------------------------------
// 9. 通用模組化頁籤切換 (Universal Tab Switching)
//    支援多組獨立頁籤 (data-tab-group) 與巢狀頁籤
// --------------------------------------------------------------------------
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;

    const group = btn.closest('.tab-group');
    if (!group) return;

    const targetId = btn.getAttribute('data-tab-target');
    if (!targetId) return;

    const nav = btn.closest('.tab-nav');
    if (nav) {
        nav.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    }

    // 只影響同一 tab-group 層級的 panel，不干擾巢狀 group
    group.querySelectorAll('.tab-panel').forEach(p => {
        if (p.closest('.tab-group') === group) {
            p.classList.remove('active');
        }
    });

    btn.classList.add('active');
    const targetPanel = document.getElementById(targetId);
    if (targetPanel) targetPanel.classList.add('active');
});

// --------------------------------------------------------------------------
// 10. 雪場與周邊卡片互動特效 — 事件委派版 (Event Delegation)
//     改為在父容器監聽，不在每張卡片上綁定 N 個 listener
// --------------------------------------------------------------------------
(function initResortCards() {
    const resortSection = document.getElementById('resort');
    if (!resortSection) return;

    // 點擊展開/收合（委派至 section 層）
    resortSection.addEventListener('click', (e) => {
        const card = e.target.closest('.resort-card');
        if (!card) return;
        const isActive = card.classList.contains('active');
        // 先收合全部
        resortSection.querySelectorAll('.resort-card').forEach(c => c.classList.remove('active'));
        // 若原本未展開，則展開此卡
        if (!isActive) card.classList.add('active');
    });

    // 滑鼠離開整個 resort section 才全部收合（避免移到展開面板時誤觸）
    resortSection.addEventListener('mouseleave', () => {
        resortSection.querySelectorAll('.resort-card').forEach(c => c.classList.remove('active'));
    });
})();

// --------------------------------------------------------------------------
// 11. 動態記帳與終極清算系統 (Firebase Expenses & AA Split)
// --------------------------------------------------------------------------

// UI Elements (全局快取 DOM—防止重複 querySelector)
const fabAddExpense = document.getElementById('fab-add-expense');
const ledgerModal = document.getElementById('ledger-modal');
const closeLedgerModal = document.getElementById('close-ledger-modal');
const payerSelector = document.getElementById('payer-selector');
const expensePayerInput = document.getElementById('expense-payer');
const submitExpenseBtn = document.getElementById('submit-expense');
const transactionList = document.getElementById('transaction-list');
const settlementList = document.getElementById('settlement-list');

  // expensesRef 只在 Firebase 已就緒時初始化，否則屬於 null
let expensesRef = null;

if (!isLocalFile && typeof firebase !== 'undefined' && firebaseConfig.apiKey !== "YOUR_API_KEY") {
    if (db) expensesRef = db.ref('expenses');

    // 即時監聽花費資料
    expensesRef.on('value', (snapshot) => {
        const data = snapshot.val() || {};
        const expenses = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        expenses.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        if (transactionList && settlementList) {
            renderTransactions(expenses);
            calculateAndRenderSettlements(expenses);
        }
    });
}

// Modal Toggles
if (fabAddExpense && ledgerModal) {
    fabAddExpense.addEventListener('click', () => {
        ledgerModal.classList.remove('hidden');
        // Reset form
        document.getElementById('edit-expense-id').value = '';
        document.getElementById('expense-amount').value = '';
        document.getElementById('expense-item').value = '';
        
        // 預設為當前時間
        const tzoffset = (new Date()).getTimezoneOffset() * 60000;
        const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 16);
        document.getElementById('expense-time').value = localISOTime;

        // 重設幣別為 JPY
        const currencyBtn = document.getElementById('currency-toggle');
        if (currencyBtn) {
            currencyBtn.setAttribute('data-currency', 'JPY');
            currencyBtn.textContent = '🇯🇵 JPY';
            currencyBtn.classList.remove('twd');
        }

        // Reset checkboxes (default checked)
        document.querySelectorAll('#participant-selector input[type="checkbox"]').forEach(cb => {
            cb.checked = true;
        });

        // Reset payer selection
        expensePayerInput.value = '';
        if (payerSelector) {
            payerSelector.querySelectorAll('.avatar-btn').forEach(b => b.classList.remove('selected'));
        }
    });

    // --- Quick Buttons Logic ---
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const offset = parseInt(btn.getAttribute('data-offset')) || 0;
            const targetTime = Date.now() + (offset * 60000);
            const tzoffset = (new Date()).getTimezoneOffset() * 60000;
            const localISOTime = (new Date(targetTime - tzoffset)).toISOString().slice(0, 16);
            document.getElementById('expense-time').value = localISOTime;
        });
    });

    document.querySelectorAll('.quick-category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // 提取 Emoji 後的文字
            const text = btn.textContent.split(' ')[1] || btn.textContent;
            document.getElementById('expense-item').value = text;
        });
    });

    const currencyToggle = document.getElementById('currency-toggle');
    if (currencyToggle) {
        currencyToggle.addEventListener('click', () => {
            if (currencyToggle.getAttribute('data-currency') === 'JPY') {
                currencyToggle.setAttribute('data-currency', 'TWD');
                currencyToggle.textContent = '🇹🇼 TWD';
                currencyToggle.classList.add('twd');
            } else {
                currencyToggle.setAttribute('data-currency', 'JPY');
                currencyToggle.textContent = '🇯🇵 JPY';
                currencyToggle.classList.remove('twd');
            }
        });
    }

    closeLedgerModal.addEventListener('click', () => {
        ledgerModal.classList.add('hidden');
    });

    // 點擊 Modal 黑色半透明背景關閉
    ledgerModal.addEventListener('click', (e) => {
        if (e.target === ledgerModal) {
            ledgerModal.classList.add('hidden');
        }
    });
}

// Payer Selection
if (payerSelector) {
    payerSelector.addEventListener('click', (e) => {
        const btn = e.target.closest('.avatar-btn');
        if (!btn) return;
        payerSelector.querySelectorAll('.avatar-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        expensePayerInput.value = btn.dataset.name;
    });
}

    // Submit Expense
if (submitExpenseBtn) {
    submitExpenseBtn.addEventListener('click', async () => {
        const creator = document.getElementById('expense-creator').value;
        const payer = expensePayerInput.value;
        
        let amountInput = parseFloat(document.getElementById('expense-amount').value) || 0;
        const item = document.getElementById('expense-item').value.trim();
        const timeInput = document.getElementById('expense-time').value;
        const currencyBtn = document.getElementById('currency-toggle');
        const currency = currencyBtn ? currencyBtn.getAttribute('data-currency') : 'JPY';
        const editId = document.getElementById('edit-expense-id').value;
        
        let finalAmount = amountInput;
        let originalJPY = null;
        if (currency === 'JPY') {
            originalJPY = amountInput;
            finalAmount = Math.round(amountInput * 0.22);
        }

        const checkboxes = document.querySelectorAll('#participant-selector input[type="checkbox"]:checked');
        const participants = Array.from(checkboxes).map(cb => cb.value);

        if (!payer) return alert('請選擇付款人！');
        if (finalAmount <= 0) return alert('金額必須大於 0！');
        if (!item) return alert('請填寫品項名稱！');
        if (!timeInput) return alert('請填寫時間！');
        if (participants.length === 0) return alert('至少需要一名參與均攤的成員！');

        if (!expensesRef) {
            alert('記帳功能需要連線 Firebase！請使用 Live Server 不要直接開檔。');
            return;
        }

        const timestamp = new Date(timeInput).getTime();

        const newExpense = {
            createdBy: creator,
            payer,
            amount: finalAmount,
            item,
            participants,
            timestamp: timestamp
        };
        if (originalJPY !== null) {
            newExpense.originalJPY = originalJPY;
        }

        try {
            if (editId) {
                await expensesRef.child(editId).update(newExpense);
            } else {
                await expensesRef.push(newExpense);
            }
            ledgerModal.classList.add('hidden');
            setTimeout(() => {
                alert(editId ? '修改成功！' : '記帳成功！');
            }, 300);
        } catch (err) {
            console.error('Error saving expense:', err);
            alert('操作失敗，請檢查網路連線。');
        }
    });
}

// Listen to Expenses Data — 此監聽已移至上方 Firebase 初始化區塊

window.editTransaction = function(id) {
    if (!expensesRef) return;
    expensesRef.child(id).once('value').then(snapshot => {
        const exp = snapshot.val();
        if (!exp) return;
        
        ledgerModal.classList.remove('hidden');
        document.getElementById('edit-expense-id').value = id;
        document.getElementById('expense-creator').value = exp.createdBy || 'Bonnie';
        
        // Payer
        expensePayerInput.value = exp.payer;
        if (payerSelector) {
            payerSelector.querySelectorAll('.avatar-btn').forEach(b => {
                b.classList.toggle('selected', b.dataset.name === exp.payer);
            });
        }

        // Amount & Currency
        const currencyBtn = document.getElementById('currency-toggle');
        if (exp.originalJPY) {
            if (currencyBtn) {
                currencyBtn.setAttribute('data-currency', 'JPY');
                currencyBtn.textContent = '🇯🇵 JPY';
                currencyBtn.classList.remove('twd');
            }
            document.getElementById('expense-amount').value = exp.originalJPY;
        } else {
            if (currencyBtn) {
                currencyBtn.setAttribute('data-currency', 'TWD');
                currencyBtn.textContent = '🇹🇼 TWD';
                currencyBtn.classList.add('twd');
            }
            document.getElementById('expense-amount').value = exp.amount;
        }

        document.getElementById('expense-item').value = exp.item;

        // Time
        if (exp.timestamp) {
            const tzoffset = (new Date()).getTimezoneOffset() * 60000;
            const localISOTime = (new Date(exp.timestamp - tzoffset)).toISOString().slice(0, 16);
            document.getElementById('expense-time').value = localISOTime;
        }

        // Participants
        const participants = exp.participants || [];
        document.querySelectorAll('#participant-selector input[type="checkbox"]').forEach(cb => {
            cb.checked = participants.includes(cb.value);
        });
    });
};

window.deleteTransaction = function(id) {
    if (!confirm('確定要刪除這筆花費紀錄嗎？\n刪除後清算帳本將會自動重新結算。')) return;
    if (expensesRef) {
        expensesRef.child(id).remove().catch(err => alert('刪除失敗: ' + err.message));
    }
};

function renderTransactions(expenses) {
    if (expenses.length === 0) {
        transactionList.innerHTML = '<div class="empty-state">尚未有任何花費紀錄</div>';
        return;
    }

    transactionList.innerHTML = expenses.map(exp => {
        const date = exp.timestamp
            ? new Date(exp.timestamp).toLocaleDateString('zh-TW', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
            : '';
        const jpyDisplay = exp.originalJPY ? `<div class="tx-amount-jpy">(¥${exp.originalJPY.toLocaleString()})</div>` : '';
        const creatorDisplay = exp.createdBy ? ` · 建立者: ${exp.createdBy}` : '';

        return `
            <div class="transaction-item">
                <div class="tx-content">
                    <div class="tx-title">${exp.item}</div>
                    <div class="tx-meta">${date} · 由 ${exp.payer} 付款${creatorDisplay}</div>
                </div>
                <div class="tx-amount-group">
                    <div class="tx-amount">NT$ ${exp.amount.toLocaleString()}</div>
                    ${jpyDisplay}
                </div>
                <div class="tx-actions">
                    <button class="btn-edit-tx" onclick="window.editTransaction('${exp.id}')">✏️</button>
                    <button class="btn-delete-tx" onclick="window.deleteTransaction('${exp.id}')">🗑️</button>
                </div>
            </div>
        `;
    }).join('');
}

const avatarMap = {
    'Bonnie': '🐰',
    'Leo': '🦁',
    'Yuk': '🐻',
    'Dino': '🦖',
    'Ian': '🐺',
    'TaiwanBL': '👑'
};
let currentAvatarFilter = null;

// 在 global scope 加上過濾函數
window.toggleAvatarFilter = function(name) {
    if (currentAvatarFilter === name) {
        currentAvatarFilter = null; // 取消過濾
    } else {
        currentAvatarFilter = name;
    }
    // 重新渲染清算清單
    if (expensesRef) {
        expensesRef.once('value').then(snapshot => {
            const data = snapshot.val() || {};
            const expenses = Object.keys(data).map(key => ({ id: key, ...data[key] }));
            expenses.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
            calculateAndRenderSettlements(expenses);
        });
    }
};

function renderAvatarFilters() {
    const container = document.getElementById('avatar-filter-container');
    if (!container) return;
    container.innerHTML = Object.keys(avatarMap).map(name => `
        <div class="filter-avatar-btn ${currentAvatarFilter === name ? 'active' : ''}" onclick="window.toggleAvatarFilter('${name}')" title="${name}">
            ${avatarMap[name]}
        </div>
    `).join('');
}

window.toggleDebtDetails = function(index) {
    const detailsDiv = document.getElementById(`debt-details-${index}`);
    if (detailsDiv) {
        detailsDiv.classList.toggle('open');
    }
};

function calculateAndRenderSettlements(expenses) {
    renderAvatarFilters();
    const balances = {
        'Bonnie': 0,
        'Leo': 0,
        'Yuk': 0,
        'Dino': 0,
        'Ian': 0,
        'TaiwanBL': 0
    };
    
    expenses.forEach(exp => {
        // 付款人餘額增加 (別人欠他)
        if (balances[exp.payer] !== undefined) {
            balances[exp.payer] += exp.amount;
        }
        
        // 應攤金額：參與者餘額減少 (他欠別人)
        if (exp.participants && exp.participants.length > 0) {
            const splitAmount = exp.amount / exp.participants.length;
            exp.participants.forEach(p => {
                if (balances[p] !== undefined) {
                    balances[p] -= splitAmount;
                }
            });
        }
    });

    // AA 清算演算法 (Greedy)
    let creditors = [];
    let debtors = [];
    for (let person in balances) {
        if (balances[person] > 0.01) creditors.push({ name: person, amount: balances[person] });
        else if (balances[person] < -0.01) debtors.push({ name: person, amount: -balances[person] });
    }

    creditors.sort((a,b) => b.amount - a.amount);
    debtors.sort((a,b) => b.amount - a.amount);

    let settlements = [];
    let i = 0; let j = 0;

    while (i < debtors.length && j < creditors.length) {
        let debtor = debtors[i];
        let creditor = creditors[j];
        
        let amount = Math.min(debtor.amount, creditor.amount);
        
        settlements.push({
            from: debtor.name,
            to: creditor.name,
            amount: Math.round(amount)
        });

        debtor.amount -= amount;
        creditor.amount -= amount;

        if (debtor.amount < 0.01) i++;
        if (creditor.amount < 0.01) j++;
    }

    if (settlements.length === 0) {
        settlementList.innerHTML = '<div class="empty-state">目前無任何欠款 🎉</div>';
    } else {
        // 如果有 Filter，則過濾
        if (currentAvatarFilter) {
            settlements = settlements.filter(s => s.from === currentAvatarFilter || s.to === currentAvatarFilter);
        }

        if (settlements.length === 0) {
            settlementList.innerHTML = `<div class="empty-state">目前與 ${currentAvatarFilter} 無任何相關欠款 🎉</div>`;
            return;
        }

        settlementList.innerHTML = settlements.map((s, index) => {
            // 找出相關交易：A替B付 或 B替A付
            const relatedExpenses = expenses.filter(e => 
                (e.payer === s.to && e.participants && e.participants.includes(s.from)) ||
                (e.payer === s.from && e.participants && e.participants.includes(s.to))
            );
            
            let detailsHtml = '';
            if (relatedExpenses.length > 0) {
                detailsHtml = relatedExpenses.map(e => {
                    const date = e.timestamp ? new Date(e.timestamp).toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' }) : '';
                    const share = Math.round(e.amount / e.participants.length);
                    return `
                        <div class="debt-history-item">
                            <span>${date} ${e.item} (${e.payer}付)</span>
                            <span>均攤 NT$ ${share}</span>
                        </div>
                    `;
                }).join('');
            } else {
                detailsHtml = `<div class="debt-history-item">無直接交易紀錄 (可能經由演算法合併)</div>`;
            }

            return `
            <div class="settlement-item" onclick="window.toggleDebtDetails(${index})">
                <div class="settlement-header">
                    <div>
                        <strong>${avatarMap[s.from] || ''} ${s.from}</strong> 應給 <strong>${avatarMap[s.to] || ''} ${s.to}</strong>
                        <div class="tx-meta">點擊展開溯源明細 · 點右側可結清還款</div>
                    </div>
                    <div class="settle-row" onclick="event.stopPropagation()">
                        <span class="settle-amount">NT$ ${s.amount.toLocaleString()}</span>
                        <button class="btn-settle" onclick="window.settleDebt('${s.from}', '${s.to}', ${s.amount})">確認結清</button>
                    </div>
                </div>
                <div class="debt-details" id="debt-details-${index}" onclick="event.stopPropagation()">
                    ${detailsHtml}
                </div>
            </div>
            `;
        }).join('');
    }
}

/* -------------------------------------------------------------------------- */
/*  💬 雪地對講機 (Walkie-Talkie Chat) 邏輯                                    */
/* -------------------------------------------------------------------------- */
// chatMessagesRef 防咑：db 可能為 null（非 Firebase 環境），加 null 檢查避免骨牌效應
const chatMessagesRef = db ? db.ref('chatMessages') : null;
let chatCurrentUser = localStorage.getItem('snowboard_chat_user') || null;

const chatModal = document.getElementById('chat-modal');
const fabChat = document.getElementById('fab-chat');
const closeChatModal = document.getElementById('close-chat-modal');
const chatIdentitySetup = document.getElementById('chat-identity-setup');
const chatMessagesArea = document.getElementById('chat-messages');
const chatInputArea = document.getElementById('chat-input-area');
const stickerPanel = document.getElementById('sticker-panel');
const btnSaveIdentity = document.getElementById('btn-save-identity');
const chatIdentitySelect = document.getElementById('chat-identity-select');
const btnToggleSticker = document.getElementById('btn-toggle-sticker');
const btnSendChat = document.getElementById('btn-send-chat');
const chatInput = document.getElementById('chat-input');

// 打開聊天室
if (fabChat) {
    fabChat.addEventListener('click', () => {
        chatModal.classList.remove('hidden');
        if (!chatCurrentUser) {
            chatIdentitySetup.classList.remove('hidden');
            chatMessagesArea.classList.add('hidden');
            chatInputArea.classList.add('hidden');
        } else {
            chatIdentitySetup.classList.add('hidden');
            chatMessagesArea.classList.remove('hidden');
            chatInputArea.classList.remove('hidden');
            scrollToChatBottom();
        }
    });
}

// 關閉聊天室
if (closeChatModal) {
    closeChatModal.addEventListener('click', () => {
        chatModal.classList.add('hidden');
        stickerPanel.classList.add('hidden');
    });
}

// 點擊 Modal 黑色半透明背景關閉 (聊天室)
if (chatModal) {
    chatModal.addEventListener('click', (e) => {
        if (e.target === chatModal) {
            chatModal.classList.add('hidden');
            stickerPanel.classList.add('hidden');
        }
    });
}

// 儲存身分
if (btnSaveIdentity) {
    btnSaveIdentity.addEventListener('click', () => {
        chatCurrentUser = chatIdentitySelect.value;
        localStorage.setItem('snowboard_chat_user', chatCurrentUser);
        chatIdentitySetup.classList.add('hidden');
        chatMessagesArea.classList.remove('hidden');
        chatInputArea.classList.remove('hidden');
        scrollToChatBottom();
    });
}

// 貼圖面板開關
if (btnToggleSticker) {
    btnToggleSticker.addEventListener('click', () => {
        stickerPanel.classList.toggle('hidden');
        scrollToChatBottom();
    });
}

// 送出訊息 (共用邏輯)
function sendChatMessage(text, type = 'text') {
    if (!chatCurrentUser) return;
    if (type === 'text' && text.trim() === '') return;

    const newMsg = {
        sender: chatCurrentUser,
        text: text,
        type: type, // 'text' 或 'sticker'
        timestamp: firebase.database.ServerValue.TIMESTAMP
    };

    chatMessagesRef.push(newMsg);
    
    if (type === 'text') {
        chatInput.value = '';
    }
    if (type === 'sticker') {
        stickerPanel.classList.add('hidden');
    }
}

// 點擊發送按鈕
if (btnSendChat) {
    btnSendChat.addEventListener('click', () => {
        sendChatMessage(chatInput.value, 'text');
    });
}

// Enter 鍵發送
if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage(chatInput.value, 'text');
        }
    });
}

// 點擊貼圖發送
document.querySelectorAll('.sticker-option').forEach(img => {
    img.addEventListener('click', () => {
        const stickerId = img.getAttribute('data-sticker');
        sendChatMessage(stickerId, 'sticker');
    });
});

// 監聽新訊息
if (chatMessagesRef) {
    chatMessagesRef.on('child_added', (snapshot) => {
        const msg = snapshot.val();
        renderSingleMessage(msg);
    });
}

// 渲染單筆訊息
function renderSingleMessage(msg) {
    if (!chatMessagesArea) return;
    
    const isMine = (msg.sender === chatCurrentUser);
    const alignClass = isMine ? 'message-mine' : 'message-others';
    
    let contentHtml = '';
    if (msg.type === 'sticker') {
        // 貼圖
        contentHtml = `<img src="./assets/stickers/${msg.text}.png" class="chat-sticker" alt="Sticker">`;
    } else {
        // 文字
        contentHtml = `<div class="chat-bubble">${escapeHtml(msg.text)}</div>`;
    }

    const msgHtml = `
        <div class="chat-message ${alignClass}">
            <div class="message-sender">${avatarMap[msg.sender] || '👤'} ${msg.sender}</div>
            ${contentHtml}
        </div>
    `;

    chatMessagesArea.insertAdjacentHTML('beforeend', msgHtml);
    scrollToChatBottom();
}

function scrollToChatBottom() {
    if (chatMessagesArea) {
        // 確保 DOM 渲染完畢再捲動，增加一點延遲以防貼圖尚未載入
        setTimeout(() => {
            chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;
        }, 150);
        setTimeout(() => {
            chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;
        }, 500); // 二次防錯捲動
    }
}

function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return String(unsafe)
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

// 結清欠款 (自動寫入一筆還款交易)
window.settleDebt = async function(from, to, amount) {
    if (!confirm(`確定 ${from} 已經給了 ${to} ${amount} 元嗎？\n這將會自動新增一筆結清紀錄。`)) return;
    
    if (!expensesRef) {
        alert('連線 Firebase 後才能結清。');
        return;
    }

    const newExpense = {
        payer: from,
        amount: amount,
        item: `結清欠款 (給 ${to})`,
        participants: [to],
        timestamp: firebase.database.ServerValue.TIMESTAMP
    };

    try {
        await expensesRef.push(newExpense);
    } catch (err) {
        console.error('Error settling debt:', err);
        alert('結清失敗，請檢查網路連線。');
    }
};

// 12. 多旅伴裝備清單實時同步 (Firebase Gear Sync)
document.addEventListener('DOMContentLoaded', () => {
    const gearUserBtns = document.querySelectorAll('.gear-user-btn');
    const gearCards = document.querySelectorAll('.gear-card');
    if(gearUserBtns.length === 0 || gearCards.length === 0) return;
    
    let currentGearUser = 'Bonnie'; // 預設使用者
    
    // 初始化 Firebase Reference
    let gearRef = null;
    if (!isLocalFile && typeof firebase !== 'undefined' && typeof firebaseConfig !== 'undefined' && firebaseConfig.apiKey !== "YOUR_API_KEY") {
        gearRef = firebase.database().ref('gearData');
    }

    // 更新卡片發光效果與打勾
    const updateCardState = (card, checked, status) => {
        // 先移除所有狀態 class
        card.classList.remove('status-self', 'status-reserved', 'status-rental');
        
        card.classList.add(`status-${status}`);
        
        const checkbox = card.querySelector('.gear-checkbox');
        if (checkbox && checkbox.checked !== checked) {
            checkbox.checked = checked;
        }
        
        const select = card.querySelector('.gear-status-select');
        if (select && select.value !== status) {
            select.value = status;
        }
    };

    // 讀取特定使用者的裝備狀態
    const loadUserGear = (userName) => {
        if (!gearRef) {
            // 在沒有 Firebase 的情況下，至少在前端重置狀態，讓切換看起來有反應
            gearCards.forEach(card => updateCardState(card, false, 'self'));
            return;
        }
        
        gearRef.child(userName).once('value').then((snapshot) => {
            const data = snapshot.val() || {};
            
            gearCards.forEach(card => {
                const gearId = card.getAttribute('data-gear-id');
                let checked = false;
                let status = 'self';
                
                if (data[gearId]) {
                    checked = data[gearId].checked || false;
                    status = data[gearId].status || 'self';
                }
                
                updateCardState(card, checked, status);
            });
        }).catch(err => console.error("Error loading gear data:", err));
        
        // 即時監聽
        gearRef.child(userName).on('value', (snapshot) => {
            if(currentGearUser !== userName) return; // 確保只更新當前選中使用者
            const data = snapshot.val() || {};
            gearCards.forEach(card => {
                const gearId = card.getAttribute('data-gear-id');
                let checked = false;
                let status = 'self';
                
                if (data[gearId]) {
                    checked = data[gearId].checked || false;
                    status = data[gearId].status || 'self';
                }
                
                updateCardState(card, checked, status);
            });
        });
    };

    // 寫入特定裝備狀態到 Firebase
    const updateGearState = (gearId, checked, status) => {
        if (!gearRef) {
            console.warn("Firebase not connected. Gear state not saved.");
            return;
        }
        gearRef.child(currentGearUser).child(gearId).set({
            checked: checked,
            status: status,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
    };

    // 綁定使用者切換按鈕事件
    gearUserBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // 移除所有按鈕的 .active 狀態
            gearUserBtns.forEach(b => b.classList.remove('active'));
            // 為當前點擊的按鈕加上 .active
            btn.classList.add('active');
            
            // 移除舊使用者的監聽器
            if(gearRef) {
                gearRef.child(currentGearUser).off('value');
            }
            
            // 更新 currentGearUser 並觸發 Firebase 讀取邏輯
            currentGearUser = btn.getAttribute('data-user');
            loadUserGear(currentGearUser);
        });
    });

    // 綁定 Checkbox 與 Select 變更事件
    gearCards.forEach(card => {
        const gearId = card.getAttribute('data-gear-id');
        const checkbox = card.querySelector('.gear-checkbox');
        const select = card.querySelector('.gear-status-select');
        
        if (checkbox) {
            checkbox.addEventListener('change', () => {
                updateGearState(gearId, checkbox.checked, select.value);
                updateCardState(card, checkbox.checked, select.value);
            });
        }
        
        if (select) {
            select.addEventListener('change', () => {
                updateGearState(gearId, checkbox.checked, select.value);
                updateCardState(card, checkbox.checked, select.value);
            });
            
            // 阻止冒泡，避免點擊 select 時觸發 label 的 checkbox
            select.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    });

    // 初次載入
    loadUserGear(currentGearUser);
});

// --------------------------------------------------------------------------
// 12. 雪地對講機 (Chat FAB & Modal)
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const fabChat = document.getElementById('fab-chat');
    const chatModal = document.getElementById('chat-modal');
    const closeChatModal = document.getElementById('close-chat-modal');

    if (fabChat && chatModal) {
        fabChat.addEventListener('click', () => {
            chatModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeChatModal && chatModal) {
        closeChatModal.addEventListener('click', () => {
            chatModal.classList.add('hidden');
            document.body.style.overflow = '';
        });
    }

    // 點擊遠罩關閉對講機 modal
    if (chatModal) {
        chatModal.addEventListener('click', (e) => {
            if (e.target === chatModal) {
                chatModal.classList.add('hidden');
                document.body.style.overflow = '';
            }
        });
    }
});

// --------------------------------------------------------------------------
// 13. 高解析雪道圖與戰術廣播
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const btnSkiMap = document.getElementById('btn-ski-map');
    const resortMapModal = document.getElementById('resort-map-modal');
    const closeResortMapModal = document.getElementById('close-resort-map-modal');
    
    if (btnSkiMap && resortMapModal) {
        btnSkiMap.addEventListener('click', () => {
            resortMapModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeResortMapModal && resortMapModal) {
        closeResortMapModal.addEventListener('click', () => {
            resortMapModal.classList.add('hidden');
            document.body.style.overflow = '';
        });
    }

    const btnTacticalPin = document.getElementById('btn-tactical-pin');
    const chatInput = document.getElementById('chat-input');
    const btnSendChat = document.getElementById('btn-send-chat');
    
    if (btnTacticalPin && chatInput && btnSendChat) {
        btnTacticalPin.addEventListener('click', () => {
            const location = prompt("請輸入要廣播的集合點 (例如: 居酒屋 或 Gondola 底部)");
            if (location) {
                chatInput.value = `📍 [戰術廣播] 大家注意！請於【${location}】集合會合！`;
                btnSendChat.click();
            }
        });
    }
});

// --------------------------------------------------------------------------
// 14. 求生資訊 (Emergency SOS)
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const navEmergency = document.getElementById('nav-emergency');
    const emergencyModal = document.getElementById('emergency-modal');
    const closeEmergencyModal = document.getElementById('close-emergency-modal');
    const emergencyModalCard = document.getElementById('emergency-modal-card');
    const btnToggleBright = document.getElementById('btn-toggle-bright');

    if (navEmergency && emergencyModal) {
        navEmergency.addEventListener('click', (e) => {
            e.preventDefault();
            emergencyModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            if (window.innerWidth < 768) {
                const navLinks = document.querySelector('.nav-links');
                if (navLinks) navLinks.classList.remove('active');
            }
        });
    }

    if (closeEmergencyModal && emergencyModal) {
        closeEmergencyModal.addEventListener('click', () => {
            emergencyModal.classList.add('hidden');
            if (emergencyModalCard) emergencyModalCard.classList.remove('bright-mode');
            document.body.style.overflow = '';
        });
    }

    // 點擊遠罩關閉求生資訊 modal
    if (emergencyModal) {
        emergencyModal.addEventListener('click', (e) => {
            if (e.target === emergencyModal) {
                emergencyModal.classList.add('hidden');
                if (emergencyModalCard) emergencyModalCard.classList.remove('bright-mode');
                document.body.style.overflow = '';
            }
        });
    }

    if (btnToggleBright && emergencyModalCard) {
        btnToggleBright.addEventListener('click', () => {
            emergencyModalCard.classList.toggle('bright-mode');
            if (emergencyModalCard.classList.contains('bright-mode')) {
                btnToggleBright.textContent = "🌙 關閉高亮度";
            } else {
                btnToggleBright.textContent = "☀️ 切換最高亮度 (給司機看)";
            }
        });
    }
});

// --------------------------------------------------------------------------
// 15. 實時共用採買清單 (Firebase Grocery List)
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    if (!isLocalFile && typeof firebase !== 'undefined' && firebaseConfig.apiKey !== "YOUR_API_KEY") {
        const groceryListRef = firebase.database().ref('groceryData');
        const groceryListEl = document.getElementById('grocery-list');
        const groceryInput = document.getElementById('grocery-item-input'); // 對齊 HTML #grocery-item-input
        const btnAddGrocery = document.getElementById('add-grocery-btn');  // 對齊 HTML #add-grocery-btn

        if (groceryListEl && groceryInput && btnAddGrocery) {
            // 監聽清單變更
            groceryListRef.on('value', (snapshot) => {
                const data = snapshot.val();
                groceryListEl.innerHTML = '';
                
                if (!data) {
                    groceryListEl.innerHTML = '<div class="empty-state">目前清單空空如也</div>';
                    return;
                }
                
                Object.keys(data).forEach(key => {
                    const item = data[key];
                    const itemEl = document.createElement('div');
                    itemEl.className = `grocery-item ${item.purchased ? 'purchased' : ''}`;
                    
                    itemEl.innerHTML = `
                        <span class="grocery-name">${item.name}</span>
                        <span class="grocery-meta" style="font-size:0.75rem;color:var(--text-secondary);margin-right:0.5rem;">${item.createdBy || ''}</span>
                        <input type="checkbox" class="grocery-check" ${item.purchased ? 'checked' : ''} data-key="${key}">
                    `;
                    groceryListEl.appendChild(itemEl);
                });

                // 綁定勾選事件
                document.querySelectorAll('.grocery-check').forEach(check => {
                    check.addEventListener('change', (e) => {
                        const key = e.target.getAttribute('data-key');
                        groceryListRef.child(key).update({
                            purchased: e.target.checked
                        });
                    });
                });
            });

            // 新增品項
            btnAddGrocery.addEventListener('click', () => {
                const name = groceryInput.value.trim();
                const userName = (typeof currentGearUser !== 'undefined' && currentGearUser) ? currentGearUser : "當前旅伴";
                if (name) {
                    groceryListRef.push({
                        name: name,
                        purchased: false,
                        createdBy: userName,
                        timestamp: firebase.database.ServerValue.TIMESTAMP
                    });
                    groceryInput.value = '';
                    groceryInput.focus();
                }
            });

            // Enter 鍵新增
            groceryInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    btnAddGrocery.click();
                }
            });
        }
    }
});

// --------------------------------------------------------------------------
// 16. �����Y�ɤѮ�걵 (Real Weather API - wttr.in)
// --------------------------------------------------------------------------
async function fetchMyokoWeather() {
    try {
        const response = await fetch('https://wttr.in/Myoko?format=j1');
        if (!response.ok) throw new Error('Weather API not OK: ' + response.status);
        const data = await response.json();

        const cc = data.current_condition && data.current_condition[0];
        if (!cc) return;

        const tempC = cc.temp_C;
        const feelsLikeC = cc.FeelsLikeC;

        // ��s�Ѯ�ݪO�G�� 1 �� = ���e��šA�� 2 �� = ��P�ū�
        const weatherItems = document.querySelectorAll('#weather-widget .weather-item');
        if (weatherItems.length >= 2) {
            const tempEl = weatherItems[0].querySelector('.weather-value');
            if (tempEl) tempEl.textContent = tempC + String.fromCharCode(176) + 'C';

            const feelsEl = weatherItems[1].querySelector('.weather-value');
            if (feelsEl) feelsEl.textContent = feelsLikeC + String.fromCharCode(176) + 'C';
        }

        console.log('[Weather] �����Y�ɤѮ�w��s �X ���: ' + tempC + '�XC�A��P: ' + feelsLikeC + '�XC');
    } catch (err) {
        // API ���ѮɫO���w�]������ơA����ܿ��~���ϥΪ�
        console.warn('[Weather] �Ѯ� API �L�k���o�A�O���w�]�����ƾڡC', err);
    }
}

// �������J��ߧY��Ѯ�A�C 15 �����۰ʨ�s
document.addEventListener('DOMContentLoaded', function() {
    fetchMyokoWeather();
    setInterval(fetchMyokoWeather, 15 * 60 * 1000);
});
