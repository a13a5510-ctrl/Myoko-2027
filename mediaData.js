// mediaData.js
// 這支檔案用於存放「影音回憶錄」區塊的資料。
// 如果你想新增或替換圖片/影片，只需要在這裡修改即可，不需要動到 HTML 檔案。

const mediaData = [
  {
    type: 'image',
    // 請將 src 替換為你的圖片路徑，例如 'assets/my_photo.jpg'
    src: 'assets/snowboarder_1781516514085.png',
    alt: '滑雪英姿'
  },
  {
    type: 'image',
    src: 'assets/onsen_view_1781516529392.png',
    alt: '泡湯放鬆'
  },
  // 若有影片，可以取消下方註解並填寫影片路徑
  // {
  //   type: 'video',
  //   src: 'assets/my_video.mp4',
  //   alt: '滑雪紀錄影片'
  // }
];
