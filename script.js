// 1. 導覽列 Navbar 的滾動變化與手機版選單切換
// --------------------------------------------------------------------------
const isLocalFile = window.location.protocol === 'file:';
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
        id: "house7",
        name: "【歡迎訓練營、團體】最大23人的大型包場小屋／享受大自然的妙高住宿 - Myoko的待客小屋",
        rating: "4.83",
        price: "$54,103 (已付訂金，免費停車)",
        specs: "最多23人 / 8臥室23床 / 1.5衛 / 有廚房",
        location: "妙高 (Myoko)",
        coordinates: "36.89104, 138.18643",
        localGuide: [
            "🍽️ 餐廳：<a href='https://www.google.com/maps/search/?api=1&query=Myoko+Restaurant' target='_blank'>周邊特色餐廳</a>",
            "🍢 小吃：<a href='https://www.google.com/maps/search/?api=1&query=Myoko+Izakaya' target='_blank'>周邊居酒屋</a>",
            "♨️ 溫泉：<a href='https://www.google.com/maps/search/?api=1&query=Myoko+Onsen' target='_blank'>妙高溫泉區</a>",
            "⛷️ 雪場：<a href='https://www.google.com/maps/search/?api=1&query=Akakura+Onsen+Ski+Resort' target='_blank'>赤倉溫泉滑雪場 / 妙高周邊雪場</a>",
            "🏂 雪具：<a href='https://www.google.com/maps/search/?api=1&query=Myoko+Snowsports' target='_blank'>滑雪用具租用場(Myoko Snowsports)</a>",
            "🚉 車站：<a href='https://www.google.com/maps/search/?api=1&query=Myoko+Kogen+Station' target='_blank'>妙高高原車站</a>",
            "🚗 租車：<a href='https://www.google.com/maps/search/?api=1&query=Nippon+Rent-A-Car+Myoko' target='_blank'>Nippon Rent-A-Car (妙高高原站前)</a>"
        ],
        images: [
            "assets/house7/3406741f-bfdf-41ec-859e-234d6a6d471f.jpg",
            "assets/house7/04ba5a3b-67c4-4b6c-9174-11a3c21c32ab.jpeg",
            "assets/house7/0691dc06-593e-4c28-9c19-8461838832da.jpeg",
            "assets/house7/0712ad87-005d-474f-a3a0-4eb109dfa07b.jpg",
            "assets/house7/09c3f680-a0cf-4baf-99ec-71c181e8f8f3.jpeg",
            "assets/house7/0d19c89e-2a1a-427e-9026-52ca71a07472.jpeg",
            "assets/house7/12032ffc-dae6-4d77-8696-254eae89a248.jpg",
            "assets/house7/15dc70a7-65f8-4c0e-a2f2-bfd3712ddbc2.jpeg",
            "assets/house7/1974fa71-e958-49aa-b654-125e25cc2166.jpg",
            "assets/house7/19b237cf-6b3d-454d-be8b-13d74eaa284e.jpeg",
            "assets/house7/19f101fb-00d1-4e8b-97c5-57920d527715.jpg",
            "assets/house7/1c3b0551-ff2d-4919-8d34-eef698e222fb.jpg",
            "assets/house7/1f10bd5a-ffc0-44b8-b5e4-000edc335da8.jpg",
            "assets/house7/1f570727-7e78-4273-9915-f811f664e140.jpeg",
            "assets/house7/25b21121-907a-4009-a019-ed5177de5bd7.jpg",
            "assets/house7/25fc06be-1c61-4b48-a501-1aea930eea0c.jpg",
            "assets/house7/2795b738-0a7e-40b3-ab93-709492eb2476.jpeg",
            "assets/house7/2dfe64aa-05a7-4496-86c0-3f96429e8792.jpeg",
            "assets/house7/2e3e5e11-022d-4e38-9706-e9a5a88a5002.jpg",
            "assets/house7/3676be64-6d8c-4956-b225-a65500dd2c4c.jpg",
            "assets/house7/3d3e15fe-5884-4ae7-ad61-7b541f91cde0.jpeg",
            "assets/house7/3ffb6372-d398-4676-8dce-d50ffe3e98f7.jpeg",
            "assets/house7/40e46d0f-c3e7-402b-bd13-208b82c7f3c9.jpeg",
            "assets/house7/44b3ea9d-8076-4e47-bc0b-e043703afcbb.jpeg",
            "assets/house7/47322baa-2d0c-4e46-b329-29816b67329d.jpeg",
            "assets/house7/47c7732b-ee4e-4234-b25f-c25283fabdd2.jpeg",
            "assets/house7/4889e3b7-5423-4875-ab47-eca8c5f9729f.jpeg",
            "assets/house7/4f065208-77a9-4bdd-83d9-789a1357ceb0.jpeg",
            "assets/house7/5df40fe9-cb47-4dfb-9be7-079a4796685f.jpg",
            "assets/house7/61ffbca9-8489-49b9-abe8-e6f830874426.jpg",
            "assets/house7/6208b522-7452-446c-8451-13a0e19d56dd.jpg",
            "assets/house7/63ff348d-0180-4a52-b3d4-12d95788bab3.jpeg",
            "assets/house7/665aee69-96c8-423c-8c47-6cf3ebf4bef3.jpg",
            "assets/house7/6ce743d4-697a-454b-aff5-704a58ca8f78.jpg",
            "assets/house7/6d7955fe-928c-4728-91cb-9b660571fbba.jpeg",
            "assets/house7/7172cf67-d03e-4e38-8b56-8ee864cedac4.jpeg",
            "assets/house7/72c90793-e5b7-41b0-a65e-136a186a2d08.jpeg",
            "assets/house7/7a3e63bc-dfd7-496f-b2b4-0fde5e1e49cf.jpg",
            "assets/house7/7f0eaed6-1973-4462-8d79-795decc75249.jpg",
            "assets/house7/84858a1c-eccb-4791-8bd3-9418ac3ac65a.jpeg",
            "assets/house7/86cffee1-b54b-4b65-bca3-1f8b96bcbb51.jpg",
            "assets/house7/8c479ff0-4a8d-4211-ae13-2eecf83da603.jpg",
            "assets/house7/911dd792-aa64-41d7-8412-7113cba083d7.jpeg",
            "assets/house7/923b3adb-c56b-4a9f-81c3-da589d34e24a.jpg",
            "assets/house7/92abcd12-0894-4751-b6f2-22afebbd7301.jpeg",
            "assets/house7/966a3920-8baa-4d66-ac03-bc8b71b642fa.jpeg",
            "assets/house7/9d0a3b91-45ad-43eb-ba71-5e417cbb1300.jpeg",
            "assets/house7/a1a8ef09-78cc-4f09-af87-32c4f02a33b5.jpeg",
            "assets/house7/a43ba6b5-e6a7-46b6-90e7-8538ae36493e.jpeg",
            "assets/house7/a450e575-0bec-43be-a58e-9472c7215a99.jpg",
            "assets/house7/a8c9683e-05ed-4ec9-90ec-782f2859e256.jpeg",
            "assets/house7/a8d0d228-a4c7-4dc4-bd3f-0f000746998c.jpeg",
            "assets/house7/abfb1513-30dc-4980-9297-d26b2a0c90a9.jpeg",
            "assets/house7/b4c6a742-7afc-4ead-a27d-2a93e2c6615d.jpg",
            "assets/house7/b58005d1-0744-428a-81ba-93e6eb4ecf89.jpg",
            "assets/house7/b709c743-5f97-4a5e-88bb-26452699dd92.jpeg",
            "assets/house7/ba98d641-04b8-4af4-9b36-63713a0cc359.jpg",
            "assets/house7/c69e76bb-9ec3-43d3-bad1-041c084d317b.jpg",
            "assets/house7/d043502e-4cde-4020-9803-dbec425d26a6.jpg",
            "assets/house7/d2bb3fbe-06b8-4fb9-82fb-3cd821dca408.jpg",
            "assets/house7/d3419290-ddfa-4ea6-8aba-6f9d19f51dbe.jpg",
            "assets/house7/d54013c6-2a2d-4c4f-9bdd-a41b4da6226d.jpeg",
            "assets/house7/d808d695-e694-4d7c-bccb-1981433565d9.jpeg",
            "assets/house7/dc4754fb-de3b-42ee-be7d-b7fb5bc8883c.jpg",
            "assets/house7/dfff0e95-2759-45a6-adf1-ade438c7fd01.jpeg",
            "assets/house7/e30034a3-ad8a-43db-8f52-c79bdb9f1e4a.jpg",
            "assets/house7/e44f79e6-8824-4db5-aac6-ae2b9c3967b9.jpeg",
            "assets/house7/e6b244cb-a340-410b-9e34-e0e8a5b1ab8e.jpeg",
            "assets/house7/e7d150bf-5545-476c-805e-4d23baa744b1.jpg",
            "assets/house7/e81bb4dd-b15d-4201-86ba-0d78242b7d65.jpeg",
            "assets/house7/e8bd07e8-6b87-4fdc-b617-9003395c324f.jpg",
            "assets/house7/eca719bf-c3c7-4bf7-aa75-d5e8aa621a1e.jpeg",
            "assets/house7/ed109a32-8fa9-47b8-a9ab-2fdbd537d598.jpg",
            "assets/house7/edb08d2b-e286-4adc-8c0d-1a050067ee8e.jpeg",
            "assets/house7/ee7d8049-b3eb-49b7-929e-8bf09990f959.jpeg",
            "assets/house7/f1e030b2-d969-466c-93bc-515e771e99c2.jpeg",
            "assets/house7/f240afc0-7fc0-40df-ab07-7bffbec046c9.jpeg",
            "assets/house7/f2f45c82-dc72-45ca-9ab5-d037d92d8534.jpg",
            "assets/house7/f6c2d2fa-c6be-4196-918c-a5a574edf08a.jpg",
            "assets/house7/ff7c5cee-796d-4158-a172-45b609f9471e.jpg",
            "assets/house7/ff986e64-43e7-4502-ac36-082c9e4c5a6d.jpeg"
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
            
            // 偵測雪具，自動在第二行插入價格表按鈕
            if (processedItem.includes('🏂 雪具')) {
                return `<li class="guide-pill" style="display: flex; flex-direction: column; align-items: flex-start; gap: 0.5rem;">
                            <span>${processedItem}</span>
                            <button class="gear-price-btn" onclick="event.stopPropagation(); openGearPriceModal()">❄️ 雪具價格詳細列表圖</button>
                        </li>`;
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
            <div class="house-hero-layout">
                <div class="bento-gallery">
                    <div class="bento-main">
                        <a href="${house.images[0]}" target="_blank" style="display: block; width: 100%; height: 100%;">
                            <img src="${house.images[0]}" alt="Main" loading="lazy">
                        </a>
                    </div>
                    <div class="bento-side">
                        <div class="bento-item"><a href="${house.images[1]}" target="_blank" style="display: block; width: 100%; height: 100%;"><img src="${house.images[1]}" loading="lazy"></a></div>
                        <div class="bento-item"><a href="${house.images[2]}" target="_blank" style="display: block; width: 100%; height: 100%;"><img src="${house.images[2]}" loading="lazy"></a></div>
                        <div class="bento-item"><a href="${house.images[3]}" target="_blank" style="display: block; width: 100%; height: 100%;"><img src="${house.images[3]}" loading="lazy"></a></div>
                        <div class="bento-item more-photos">
                            <a href="${house.images[4]}" target="_blank" style="display: block; width: 100%; height: 100%;">
                                <img src="${house.images[4]}" loading="lazy">
                                <div class="more-overlay">
                                    <span>+${house.images.length - 4} 張照片</span>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="house-content">
                    <h4 class="house-title" style="font-size: 1.8rem; margin-bottom: 1rem;">${house.name}</h4>
                    <div class="house-info"><span>⭐</span> ${house.rating} <span class="badge-airbnb">via Airbnb</span></div>
                    <div class="house-info price-main" style="font-size: 1.4rem;"><span>💰</span> 總價 NT$ ${totalTWD.toLocaleString()} <span style="font-size: 0.9rem; color: var(--text-secondary);">(共4晚)</span> <span class="badge-parking">${parkingNote}</span></div>
                    <div class="price-breakdown">
                        <span class="badge-hkd">≈ HK$ ${totalHKD.toLocaleString()}</span>
                    </div>
                    <div class="price-breakdown" style="margin-top: 1rem;">
                        <span class="badge-split" style="font-size: 1rem; padding: 0.5rem 1rem;">6人均攤：NT$ ${per6TWD.toLocaleString()} / HK$ ${per6HKD.toLocaleString()} (每人/晚)</span>
                    </div>
                    <div class="price-breakdown">
                        <span class="badge-split" style="font-size: 1rem; padding: 0.5rem 1rem;">8人均攤：NT$ ${per8TWD.toLocaleString()} / HK$ ${per8HKD.toLocaleString()} (每人/晚)</span>
                    </div>
                    <div class="house-info" style="margin-top: 1rem; font-size: 1.1rem;"><span>🏠</span> ${house.specs}</div>
                    <div class="house-info" style="font-size: 1.1rem;"><span>📍</span> ${house.location}</div>
                    
                    <div class="route-infographic" style="margin-top: 2rem; padding: 1.2rem; background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; box-shadow: inset 0 2px 10px rgba(0,0,0,0.5);">
                        <p style="font-size: 1rem; font-weight: bold; color: var(--accent); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;"><span style="font-size: 1.2rem;">🗺️</span> 距離重點設施</p>
                        
                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.8rem; background: rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 0.8rem; position: relative;">
                            <span style="font-weight: 500; font-size: 0.9rem; z-index: 2;">🏠 大本營</span>
                            <div style="flex-grow: 1; border-top: 2px dashed var(--color-success); margin: 0 1rem; position: relative; display: flex; justify-content: center; z-index: 1;">
                                <span style="background: var(--bg-dark); color: var(--color-success); padding: 0 0.5rem; font-size: 0.75rem; transform: translateY(-50%); border-radius: 10px; font-weight: bold;">🚗 開車 6 分鐘</span>
                            </div>
                            <span style="font-weight: 500; font-size: 0.9rem; z-index: 2;">🏂 滑雪用具租用場(Myoko Snowsports)</span>
                        </div>

                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.8rem; background: rgba(255,255,255,0.05); border-radius: 8px; position: relative;">
                            <span style="font-weight: 500; font-size: 0.9rem; z-index: 2;">🏠 大本營</span>
                            <div style="flex-grow: 1; border-top: 2px dashed #60A5FA; margin: 0 1rem; position: relative; display: flex; justify-content: center; z-index: 1;">
                                <span style="background: var(--bg-dark); color: #60A5FA; padding: 0 0.5rem; font-size: 0.75rem; transform: translateY(-50%); border-radius: 10px; font-weight: bold;">🚗 開車 7 分鐘</span>
                            </div>
                            <span style="font-weight: 500; font-size: 0.9rem; z-index: 2;">⛷️ 赤倉溫泉滑雪場</span>
                        </div>

                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.8rem; background: rgba(255,255,255,0.05); border-radius: 8px; margin-top: 0.8rem; position: relative;">
                            <span style="font-weight: 500; font-size: 0.9rem; z-index: 2;">🏠 大本營</span>
                            <div style="flex-grow: 1; border-top: 2px dashed #F87171; margin: 0 1rem; position: relative; display: flex; justify-content: center; z-index: 1;">
                                <span style="background: var(--bg-dark); color: #F87171; padding: 0 0.5rem; font-size: 0.75rem; transform: translateY(-50%); border-radius: 10px; font-weight: bold;">🚗 開車 8 分鐘</span>
                            </div>
                            <span style="font-weight: 500; font-size: 0.9rem; z-index: 2;">♨️ 赤倉溫泉街</span>
                        </div>
                    </div>
                                        <div class="house-actions" style="margin-top: 1rem; justify-content: center; display: flex; gap: 1rem; flex-wrap: wrap;">
                        <a href="https://www.google.com/maps/dir/?api=1&origin=${house.coordinates}&destination=Myoko+Snowsports" target="_blank" class="btn-secondary" style="flex: 1; min-width: 200px; text-align: center; padding: 1rem; font-size: 1.1rem; background: rgba(16, 185, 129, 0.2); border-color: rgba(16, 185, 129, 0.5); color: #A7F3D0;">🗺️ 導航至 滑雪用具租用場</a>
                        <a href="https://www.google.com/maps/dir/?api=1&origin=${house.coordinates}&destination=Akakura+Onsen+Ski+Resort" target="_blank" class="btn-secondary" style="flex: 1; min-width: 200px; text-align: center; padding: 1rem; font-size: 1.1rem; background: rgba(96, 165, 250, 0.2); border-color: rgba(96, 165, 250, 0.5); color: #BFDBFE;">🗺️ 導航至 赤倉溫泉滑雪場</a>
                        <a href="https://www.google.com/maps/dir/?api=1&origin=${house.coordinates}&destination=Akakura+Onsen" target="_blank" class="btn-secondary" style="flex: 1; min-width: 200px; text-align: center; padding: 1rem; font-size: 1.1rem; background: rgba(248, 113, 113, 0.2); border-color: rgba(248, 113, 113, 0.5); color: #FECACA;">🗺️ 導航至 赤倉溫泉街</a>
                    </div>
                </div>
            </div>
            
                        <div class="local-guide-section">
                <h4 class="local-guide-title">🧭 鄰近機能大補帖 Local Guide</h4>
                <div class="local-guide-grid">
                    
                    <!-- Card 1: Ski Resort -->
                    <div class="flip-card" onclick="this.classList.toggle('active')">
                        <div class="flip-card-inner">
                            <div class="flip-card-front">
                                <img src="images/guide_ski.png" alt="赤倉溫泉滑雪場">
                                <div class="flip-card-front-title">⛷️ 赤倉溫泉滑雪場</div>
                            </div>
                            <div class="flip-card-back">
                                <h5>⛷️ 赤倉溫泉滑雪場</h5>
                                <p>全日本唯一可直接夜滑到溫泉街的粉雪天堂，雪道超寬適合熱身！從大本營出發超級近。</p>
                                <span class="route-badge">🚗 車程 7 分鐘</span>
                            </div>
                        </div>
                    </div>

                    <!-- Card 2: Gear Shop -->
                    <div class="flip-card" onclick="this.classList.toggle('active')">
                        <div class="flip-card-inner">
                            <div class="flip-card-front">
                                <img src="images/guide_shop.png" alt="滑雪用具租用場(Myoko Snowsports)">
                                <div class="flip-card-front-title">🏂 滑雪用具租用場(Myoko Snowsports)</div>
                            </div>
                            <div class="flip-card-back" style="border-color: rgba(56, 189, 248, 0.8);">
                                <h5>🏂 滑雪用具租用場(Myoko Snowsports)</h5>
                                <p>專業雪具租借站！提供高品質的裝備，我們預計將在此租賃。</p>
                                <button class="gear-price-btn" onclick="event.stopPropagation(); openGearPriceModal()" style="margin-top: auto; padding: 0.5rem; width: 100%;">❄️ 點擊查看價格表</button>
                            </div>
                        </div>
                    </div>

                    <!-- Card 3: Tonkatsu -->
                    <div class="flip-card" onclick="this.classList.toggle('active')">
                        <div class="flip-card-inner">
                            <div class="flip-card-front">
                                <img src="images/guide_tonkatsu.png" alt="Restaurant Shibata">
                                <div class="flip-card-front-title">🥩 Restaurant Shibata</div>
                            </div>
                            <div class="flip-card-back">
                                <h5>🥩 Restaurant Shibata</h5>
                                <p>赤倉特搜美食！傳奇爆量炸豬排飯、招牌漢堡排，滑雪後補足熱量的終極大魔王。</p>
                                <span class="route-badge">🚗 車程 8 分鐘</span>
                            </div>
                        </div>
                    </div>

                    <!-- Card 4: Soba -->
                    <div class="flip-card" onclick="this.classList.toggle('active')">
                        <div class="flip-card-inner">
                            <div class="flip-card-front">
                                <img src="images/guide_soba.png" alt="Yabu Soba">
                                <div class="flip-card-front-title">🍜 やぶそば (Yabu Soba)</div>
                            </div>
                            <div class="flip-card-back">
                                <h5>🍜 やぶそば (Yabu Soba)</h5>
                                <p>高原車站前老字號手工蕎麥麵與酥脆天婦羅，搭配在地地酒絕配，滑雪完必吃。</p>
                                <span class="route-badge">🚗 車程 10 分鐘</span>
                            </div>
                        </div>
                    </div>

                    <!-- Card 5: Onsen -->
                    <div class="flip-card" onclick="this.classList.toggle('active')">
                        <div class="flip-card-inner">
                            <div class="flip-card-front">
                                <img src="images/guide_onsen.png" alt="赤倉溫泉">
                                <div class="flip-card-front-title">♨️ 赤倉溫泉 (美人湯)</div>
                            </div>
                            <div class="flip-card-back">
                                <h5>♨️ 赤倉溫泉 (美人湯)</h5>
                                <p>妙高山直引的天然硫酸鹽「美人湯」，專治全身滑雪酸痛！歷史悠久的江戶開湯名泉。</p>
                                <span class="route-badge">🚗 車程 8 分鐘</span>
                            </div>
                        </div>
                    </div>

                    <!-- Card 6: Village -->
                    <div class="flip-card" onclick="this.classList.toggle('active')">
                        <div class="flip-card-inner">
                            <div class="flip-card-front">
                                <img src="images/guide_village.png" alt="鄰近住宿聚落">
                                <div class="flip-card-front-title">🏪 鄰近住宿聚落</div>
                            </div>
                            <div class="flip-card-back">
                                <h5>🏪 鄰近住宿聚落</h5>
                                <p>地圖上周邊有旅館おかやま、JAPOWHOUSE 等知名住宿，機能完善不愁吃穿。</p>
                                <span class="route-badge">🚶 步行範圍內</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        `;

        grid.appendChild(card);
        
        // FOOLPROOF EVENT BINDING FOR LIGHTBOX
        const mainBento = card.querySelector(".bento-main");
        if (mainBento) {
            mainBento.style.cursor = "pointer";
            mainBento.addEventListener("click", (e) => {
                e.preventDefault();
                if(window.openLightbox) window.openLightbox(0);
            });
        }
        const bentoItems = card.querySelectorAll(".bento-side .bento-item");
        bentoItems.forEach((item, idx) => {
            item.style.cursor = "pointer";
            item.addEventListener("click", (e) => {
                e.preventDefault();
                if(window.openLightbox) window.openLightbox(idx + 1);
            });
        });
    });
});

// --------------------------------------------------------------------------
// --------------------------------------------------------------------------\n// 6. 投票系統與 Firebase 整合
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
        const groceryInput = document.getElementById('grocery-input');         // 對齊 HTML #grocery-input
        const groceryAssigneeEl = document.getElementById('grocery-assignee'); // 採買負責人下拉
        const btnAddGrocery = document.getElementById('btn-add-grocery');       // 對齊 HTML #btn-add-grocery

        if (groceryListEl && groceryInput && btnAddGrocery) {
            // 監聽清單變更並渲染
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

                    // 若有負責人，顯示專屬徽章
                    const assigneeBadge = (item.assignee && item.assignee !== '')
                        ? `<span class="badge-assignee" style="margin-left: 10px; font-size: 0.75rem; background: rgba(56, 189, 248, 0.2); color: #38BDF8; padding: 2px 8px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.4);">負責人: ${item.assignee}</span>`
                        : '';
                    
                    itemEl.innerHTML = `
                        <span class="grocery-name">${item.name}${assigneeBadge}</span>
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

            // 新增品項（含負責人）
            btnAddGrocery.addEventListener('click', () => {
                const name = groceryInput.value.trim();
                const assignee = groceryAssigneeEl ? groceryAssigneeEl.value : '';
                const userName = (typeof currentGearUser !== 'undefined' && currentGearUser) ? currentGearUser : "當前旅伴";
                if (name) {
                    groceryListRef.push({
                        name: name,
                        assignee: assignee,
                        purchased: false,
                        createdBy: userName,
                        timestamp: firebase.database.ServerValue.TIMESTAMP
                    });
                    groceryInput.value = '';
                    if (groceryAssigneeEl) groceryAssigneeEl.value = '';
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
        // API ѮɫOw]ơAܿ~ϥΪ
        console.warn('[Weather] Ѯ API LkoAOw]ƾڡC', err);
    }
}

// JߧYѮAC 15// JߧYѮAC 15 ۰ʨs
document.addEventListener('DOMContentLoaded', function() {
    fetchMyokoWeather();
    setInterval(fetchMyokoWeather, 15 * 60 * 1000);
});

// --------------------------------------------------------------------------
// 17. 雪具價格詳細列表 Modal 控制
// --------------------------------------------------------------------------
function openGearPriceModal() {
    const modal = document.getElementById('gear-price-modal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('gear-price-modal');
    const closeBtn = document.getElementById('close-gear-price-modal');

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        // 點擊背景關閉
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }
});







// --------------------------------------------------------------------------
// 18. 降雪特效 (Snow Effect)
// --------------------------------------------------------------------------









// --- Lightbox Logic ---
let currentLightboxIndex = 0;
let lightboxImages = [];

window.openLightbox = function(index) {
    try {
        if (housingData.length > 0) {
            lightboxImages = housingData[0].images;
            currentLightboxIndex = index;
            updateLightbox();
            
            const modal = document.getElementById("lightbox-modal");
            if (modal) {
                modal.classList.remove("hidden");
                modal.style.display = "flex";
                modal.style.opacity = "1";
                modal.style.visibility = "visible";
                modal.style.pointerEvents = "auto";
                document.body.style.overflow = "hidden";
            } else {
                alert("Lightbox Modal 元素遺失，請聯絡開發者！");
            }
        }
    } catch (e) {
        alert("Lightbox 發生錯誤: " + e.message);
    }
};

window.closeLightbox = function() {
    const modal = document.getElementById("lightbox-modal");
    if (modal) {
        modal.classList.add("hidden");
        modal.style.opacity = "0";
        modal.style.visibility = "hidden";
        modal.style.pointerEvents = "none";
    }
    document.body.style.overflow = "";
};

window.lightboxNext = function() {
    currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
    updateLightbox();
};

window.lightboxPrev = function() {
    currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    updateLightbox();
};

window.setLightboxImage = function(index) {
    currentLightboxIndex = index;
    updateLightbox();
}

function updateLightbox() {
    const imgEl = document.getElementById("lightbox-img");
    const counter = document.getElementById("lightbox-counter");
    const thumbContainer = document.getElementById("lightbox-thumbnails");
    
    imgEl.style.opacity = 0;
    setTimeout(() => {
        imgEl.src = lightboxImages[currentLightboxIndex];
        imgEl.style.opacity = 1;
    }, 150);
    
    counter.textContent = `${currentLightboxIndex + 1} / ${lightboxImages.length}`;
    
    if (thumbContainer.children.length === 0) {
        thumbContainer.innerHTML = lightboxImages.map((img, idx) => 
            `<img src="${img}" onclick="setLightboxImage(${idx})" style="height: 60px; width: 80px; object-fit: cover; cursor: pointer; border-radius: 4px; opacity: 0.5; transition: opacity 0.3s; flex-shrink: 0;" class="lb-thumb" id="lb-thumb-${idx}">`
        ).join("");
    }
    
    document.querySelectorAll(".lb-thumb").forEach((th, idx) => {
        th.style.opacity = idx === currentLightboxIndex ? "1" : "0.4";
        th.style.border = idx === currentLightboxIndex ? "2px solid white" : "none";
    });
}






