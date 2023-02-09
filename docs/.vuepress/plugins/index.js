module.exports = [
  [
    "@vuepress-reco/vuepress-plugin-bgm-player",
    {
      audios: [
        {
          name: "강남역 4번 출구",
          artist: "Plastic / Fallin` Dild",
          url: "https://assets.smallsunnyfox.com/music/2.mp3",
          cover: "https://assets.smallsunnyfox.com/music/3.jpg",
        },
        {
          name: "팔베개",
          artist: "최낙타",
          url: "https://assets.smallsunnyfox.com/music/3.mp3",
          cover:
            "https://p1.music.126.net/qTSIZ27qiFvRoKj-P30BiA==/109951165895951287.jpg?param=200y200",
        },
      ],
      // 是否默认缩小
      autoShrink: true,
      // 缩小时缩为哪种模式
      shrinkMode: "float",
      // 悬浮窗样式
      floatStyle: { bottom: "20px", "z-index": "999999" },
    },
  ],
  [
    "@vuepress-reco/vuepress-plugin-kan-ban-niang",
    {
      theme: [
        "blackCat",
        "whiteCat",
        "haru1",
        "haru2",
        "haruto",
        "koharu",
        "izumi",
        "shizuku",
        "wanko",
        "miku",
        "z16",
      ],
      // 是否显示按钮
      clean: false,
      messages: {
        welcome: "欢迎来到我的博客",
        home: "心里的花，我想要带你回家。",
        theme: "好吧，希望你能喜欢我的其他小伙伴。",
        close: "你知道我喜欢吃什么吗？痴痴地望着你。",
      },
      // 自定义消息框样式
      messageStyle: {
        right: "68px",
        bottom: "190px",
      },
      // 自定义模型样式
      modelStyle: {
        position: "fixed",
        zIndex: 99999,
        pointerEvents: "none",
        right: "90px",
        bottom: "0px",
        opacity: "0",
      },
      // 自定义按钮样式
      btnStyle: {
        right: "90px",
        bottom: "40px",
      },
      // 模型宽高
      width: 150,
      height: 220,
    },
  ],
]
