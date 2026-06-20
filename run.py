import re

with open("script.js", "r", encoding="utf-8") as f:
    js_content = f.read()

new_housing_data = """const housingData = [
    {
        id: "house1",
        name: "Genki House (距離斜坡7公尺)",
        rating: "5.0 (16則)",
        price: "$125,060 (免費停車)",
        specs: "10人 / 4房8床 / 2.5衛 / 有廚房",
        location: "池之平 (Ikenotaira)",
        coordinates: "36.861228, 138.196546",
        localGuide: [
            "🍽️ 餐廳：<a href='https://www.google.com/maps/search/?api=1&query=LIME+KITCHEN+%E5%A6%99%E9%AB%98' target='_blank'>LIME KITCHEN (池之平特色西餐)</a> — 步行 4 分",
            "🍢 小吃：<a href='https://www.google.com/maps/search/?api=1&query=%E3%83%A9%E3%83%B3%E3%83%89%E3%83%9E%E3%83%BC%E3%82%AF%E5%A6%99%E9%AB%98%E9%AB%98%E5%8E%9F' target='_blank'>Landmark Myokokogen 美食街</a> — 5 分",
            "♨️ 溫泉：<a href='https://www.google.com/maps/search/?api=1&query=%E3%83%A9%E3%82%A4%E3%83%A0%E3%83%AA%E3%82%BE%E3%83%BC%E3%83%88%E5%A6%99%E9%AB%98' target='_blank'>池之平溫泉 (LIME RESORT)</a> — 5 分",
            "🏂 雪具：<a href='https://www.google.com/maps/search/?api=1&query=%E6%B1%A0%E3%81%AE%E5%B9%B3%E6%B8%A9%E6%B3%89%E3%82%A2%E3%83%AB%E3%83%9A%E3%83%B3%E3%83%96%E3%83%AA%E3%83%83%E3%82%AF%E3%82%B9%E3%82%AD%E3%83%BC%E5%A0%B4+%E3%83%AC%E3%83%B3%E3%82%BF%E3%83%AB' target='_blank'>Alpen Blick 專屬租借站</a> — 5 分",
            "🚉 交通：<a href='https://www.google.com/maps/search/?api=1&query=%E5%A6%99%E9%AB%98%E9%AB%98%E5%8E%9F%E9%A7%85' target='_blank'>妙高高原車站</a> — 4 分",
            "📸 景點：<a href='https://www.google.com/maps/search/?api=1&query=%E5%A6%99%E9%AB%98%E9%AB%98%E5%8E%9F%E3%82%A2%E3%83%AB%E3%83%9A%E3%83%B3%E3%83%96%E3%83%AA%E3%83%83%E3%82%AF%E3%83%93%E3%83%BC%E3%83%AB' target='_blank'>妙高高原啤酒廠</a> — 5 分"
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
        specs: "12人 / 5房10床 / 2.5衛 / 未明列廚房",
        location: "赤倉溫泉區 (Akakura Onsen)",
        coordinates: "36.8905, 138.182",
        localGuide: [
            "🍽️ 餐廳：<a href='https://www.google.com/maps/search/?api=1&query=%E3%83%AC%E3%82%B9%E3%83%88%E3%83%A9%E3%83%B3%E6%9F%B4%E7%94%B0+%E8%B5%A4%E5%80%89' target='_blank'>Restaurant Shibata</a> — 步行 2 分",
            "🍢 小吃：<a href='https://www.google.com/maps/search/?api=1&query=%E8%B5%A4%E5%80%89%E6%B8%A9%E6%B3%89%E8%A1%97+%E9%A3%9F%E4%BA%8B' target='_blank'>赤倉溫泉街美食</a> — 3 分",
            "♨️ 溫泉：<a href='https://www.google.com/maps/search/?api=1&query=%E8%B5%A4%E5%80%89%E6%B8%A9%E6%B3%89' target='_blank'>赤倉溫泉</a> — 2 分",
            "🏂 雪具：<a href='https://www.google.com/maps/search/?api=1&query=Myoko+Snowsports' target='_blank'>Myoko Snowsports</a> — 3 分",
            "🚉 交通：<a href='https://www.google.com/maps/search/?api=1&query=%E5%A6%99%E9%AB%98%E9%AB%98%E5%8E%9F%E9%A7%85' target='_blank'>妙高高原車站</a> — 10 分",
            "📸 景點：<a href='https://www.google.com/maps/search/?api=1&query=%E8%B5%A4%E5%80%89%E6%B8%A9%E6%B3%89%E8%A1%97' target='_blank'>赤倉溫泉街中心</a> — 2 分"
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
            "🍽️ 餐廳：<a href='https://www.google.com/maps/search/?api=1&query=%E3%82%84%E3%81%B6%E3%81%9D%E3%81%B0+%E5%A6%99%E9%AB%98' target='_blank'>やぶそば Yabu Soba</a> — 步行 2 分",
            "🍢 小吃：<a href='https://www.google.com/maps/search/?api=1&query=%E5%A6%99%E9%AB%98%E9%AB%98%E5%8E%9F%E9%A7%85+%E3%81%8A%E5%9C%9F%E7%94%A3' target='_blank'>車站前土產小吃街</a> — 1 分",
            "♨️ 溫泉：<a href='https://www.google.com/maps/search/?api=1&query=%E5%A6%99%E9%AB%98%E6%B8%A9%E6%B3%89' target='_blank'>妙高溫泉區</a> — 4 分",
            "🏂 雪具：<a href='https://www.google.com/maps/search/?api=1&query=%E5%A6%99%E9%AB%98%E9%AB%98%E5%8E%9F%E9%A7%85+%E3%82%B9%E3%82%AD%E3%83%BC%E3%83%AC%E3%83%B3%E3%82%BF%E3%83%AB' target='_blank'>車站周邊雪具店</a> — 2 分",
            "🚉 交通：<a href='https://www.google.com/maps/search/?api=1&query=%E5%A6%99%E9%AB%98%E9%AB%98%E5%8E%9F%E9%A7%85' target='_blank'>妙高高原車站</a> — 2 分",
            "📸 景點：<a href='https://www.google.com/maps/search/?api=1&query=%E5%8E%9F%E4%BF%A1+%E5%A6%99%E9%AB%98%E5%BA%97' target='_blank'>原信超市 Harashin 妙高店</a> — 20 分"
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
            "🍽️ 餐廳：<a href='https://www.google.com/maps/search/?api=1&query=%E9%87%9C%E5%8F%B3%E8%A1%9B%E9%96%80+%E5%A6%99%E9%AB%98' target='_blank'>釜右衛門 Kamaemon</a> — 步行 1 分",
            "🍢 小吃：<a href='https://www.google.com/maps/search/?api=1&query=%E5%B1%85%E9%85%92%E5%B1%8B+%E5%85%AB+%E5%A6%99%E9%AB%98%E9%AB%98%E5%8E%9F' target='_blank'>居酒屋 八 Eight</a> — 2 分",
            "♨️ 溫泉：<a href='https://www.google.com/maps/search/?api=1&query=%E5%A6%99%E9%AB%98%E6%B8%A9%E6%B3%89' target='_blank'>妙高溫泉區</a> — 3 分",
            "🏂 雪具：<a href='https://www.google.com/maps/search/?api=1&query=%E5%A6%99%E9%AB%98%E9%AB%98%E5%8E%9F%E9%A7%85+%E3%82%B9%E3%82%AD%E3%83%BC%E3%83%AC%E3%83%B3%E3%82%BF%E3%83%AB' target='_blank'>車站周邊雪具店</a> — 1-10 分",
            "🚉 交通：<a href='https://www.google.com/maps/search/?api=1&query=%E5%A6%99%E9%AB%98%E9%AB%98%E5%8E%9F%E9%A7%85' target='_blank'>妙高高原車站</a> — 步行 1 分",
            "📸 景點：<a href='https://www.google.com/maps/search/?api=1&query=%E5%A6%99%E9%AB%98%E9%AB%98%E5%8E%9F%E3%83%93%E3%82%B8%E3%82%BF%E3%83%BC%E3%82%BB%E3%83%B3%E3%82%BF%E3%83%BC' target='_blank'>妙高高原遊客中心</a> — 6 分"
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
            "🍽️ 餐廳：<a href='https://www.google.com/maps/search/?api=1&query=Panorama+Cafe+%E5%A6%99%E9%AB%98' target='_blank'>Panorama Café & Dining</a> — 步行 4 分",
            "🍢 小吃：<a href='https://www.google.com/maps/search/?api=1&query=%E8%B5%A4%E5%80%89%E8%A6%B3%E5%85%89%E3%83%AA%E3%82%BE%E3%83%BC%E3%83%88+%E3%83%AC%E3%82%B9%E3%83%88%E3%83%A9%E3%83%B3' target='_blank'>赤倉觀光區周邊餐飲</a> — 5 分",
            "♨️ 溫泉：<a href='https://www.google.com/maps/search/?api=1&query=%E6%96%B0%E8%B5%A4%E5%80%89%E6%B8%A9%E6%B3%89' target='_blank'>新赤倉溫泉</a> — 3 分",
            "🏂 雪具：<a href='https://www.google.com/maps/search/?api=1&query=Japan+Snowsports+Myoko' target='_blank'>Japan Snowsports</a> — 4 分",
            "🚉 交通：<a href='https://www.google.com/maps/search/?api=1&query=%E5%A6%99%E9%AB%98%E9%AB%98%E5%8E%9F%E9%A7%85' target='_blank'>妙高高原車站</a> — 8 分",
            "📸 景點：<a href='https://www.google.com/maps/search/?api=1&query=%E5%A6%99%E9%AB%98%E5%B1%B1%E7%99%BB%E5%B1%B1%E5%8F%A3' target='_blank'>妙高山登山口</a> — 10 分"
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
            "🍽️ 餐廳：<a href='https://www.google.com/maps/search/?api=1&query=Two+Pines+Myoko' target='_blank'>Two Pines (知名石窯披薩)</a> — 步行 3 分",
            "🍢 小吃：<a href='https://www.google.com/maps/search/?api=1&query=%E6%9D%89%E9%87%8E%E6%B2%A2+%E9%A3%9F%E5%A0%82' target='_blank'>杉之澤村在地食堂</a> — 4 分",
            "♨️ 溫泉：<a href='https://www.google.com/maps/search/?api=1&query=%E6%9D%89%E9%87%8E%E6%B2%A2%E6%B8%A9%E6%B3%89+%E8%8B%97%E5%90%8D%E3%81%AE%E6%B9%AF' target='_blank'>杉野澤溫泉 苗名之湯</a> — 4 分",
            "🏂 雪具：<a href='https://www.google.com/maps/search/?api=1&query=%E5%A6%99%E9%AB%98%E6%9D%89%E3%83%8E%E5%8E%9F%E3%82%B9%E3%82%AD%E3%83%BC%E5%A0%B4+%E3%83%AC%E3%83%B3%E3%82%BF%E3%83%AB' target='_blank'>杉之原雪場直營租借站</a> — 3 分",
            "🚉 交通：<a href='https://www.google.com/maps/search/?api=1&query=%E5%A6%99%E9%AB%98%E9%AB%98%E5%8E%9F%E9%A7%85' target='_blank'>妙高高原車站</a> — 12 分",
            "📸 景點：<a href='https://www.google.com/maps/search/?api=1&query=%E8%8B%97%E5%90%8D%E6%BB%9D' target='_blank'>苗名瀑布 (Naena Falls)</a>"
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
];"""

new_card_innerhtml = """        card.innerHTML = `
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
                <div class="house-info"><span>⭐</span> ${house.rating}</div>
                <div class="house-info"><span>💰</span> ${house.price}</div>
                <div class="house-info"><span>🏠</span> ${house.specs}</div>
                <div class="house-info"><span>📍</span> ${house.location}</div>
                <details class="local-guide">
                    <summary>🗺️ 周邊機能 Local Guide</summary>
                    <ul>${guideHtml}</ul>
                </details>
                <div class="house-actions">
                    <a href="https://www.google.com/maps/search/?api=1&query=${house.coordinates}" target="_blank" class="btn-secondary">🗺️ 點我導航至房源</a>
                    <a href="#" class="btn-vote">投它一票</a>
                </div>
            </div>
        `;"""

# Replace housingData
js_content = re.sub(r'const housingData = \[[\s\S]*?\n\];', new_housing_data, js_content, count=1)

# Replace card.innerHTML
js_content = re.sub(r'card\.innerHTML = `[\s\S]*?        `;', new_card_innerhtml, js_content, count=1)

with open("script.js", "w", encoding="utf-8") as f:
    f.write(js_content)


with open("style.css", "r", encoding="utf-8") as f:
    css_content = f.read()

new_house_actions = """.house-actions {
    margin-top: auto;
    padding-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    text-align: center;
}

.house-actions .btn-vote,
.house-actions .btn-secondary {
    width: 100%;
    display: block;
    box-sizing: border-box;
}

.btn-secondary {
    background: rgba(255, 255, 255, 0.08);
    color: var(--text-primary);
    border: 1px solid rgba(255, 255, 255, 0.15);
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
}

.btn-secondary:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
}"""

css_content = re.sub(r'\.house-actions \{[\s\S]*?\.house-actions \.btn-vote \{[\s\S]*?\}', new_house_actions, css_content, count=1)

new_guide_links = """.local-guide li {
    font-size: 0.85rem;
    color: var(--text-secondary);
    padding: 0.35rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    line-height: 1.5;
}

.local-guide li a {
    color: #93c5fd;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease, text-decoration 0.3s ease;
}

.local-guide li a:hover {
    color: #ffffff;
    text-decoration: underline;
}"""

css_content = re.sub(r'\.local-guide li \{[\s\S]*?line-height: 1\.5;\n\}', new_guide_links, css_content, count=1)

with open("style.css", "w", encoding="utf-8") as f:
    f.write(css_content)

print("Files updated successfully")
