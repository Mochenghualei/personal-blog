let plugins = require("./plugins")
module.exports = {
  plugins,
  title: "mocheng",
  description: "欢迎访问我的随笔杂货店",
  theme: "reco",
  themeConfig: {
    codeTheme: "tomorrow", // default 'tomorrow'
    mode: "auto", // 默认 auto，auto 跟随系统，dark 暗色模式，light 亮色模式
    modePicker: true, // 默认 true，false 不显示模式调节按钮，true 则显示
    subSidebar: "auto",
    logo: "/avatar.jpg",
    authorAvatar: "/avatar.jpg",
    author: "shuai",
    type: "blog",
    // 备案
    // record: "ICP 备案文案",
    // recordLink: "ICP 备案指向链接",
    // cyberSecurityRecord: "公安部备案文案",
    // cyberSecurityLink: "公安部备案指向链接",
    // 项目开始时间，只填写年份
    startYear: "2021",
    // 密钥
    // keyPage: {
    //   keys: ["c5b2cebf15b205503560c4e8e6d1ea78"], // 1.3.0 版本后需要设置为密文
    //   color: "#42b983", // 登录页动画球的颜色
    //   lineColor: "#42b983", // 登录页动画线的颜色
    // },
    // 导航
    nav: [
      { text: "首页", link: "/", icon: "reco-home" },
      { text: "时间线", link: "/timeline/", icon: "reco-date" },
      {
        text: "我的站点",
        icon: "reco-blog",
        items: [
          { text: "掘金", link: "https://juejin.cn/user/233526039432445" },
        ],
      },
      {
        text: "Github",
        link: "https://github.com/Xusssyyy",
        icon: "reco-github",
      },
    ],
    // 博客配置
    blogConfig: {
      category: {
        location: 2, // 在导航栏菜单中所占的位置，默认2
        text: "分类", // 默认文案 “分类”
      },
      tag: {
        location: 3, // 在导航栏菜单中所占的位置，默认3
        text: "标签", // 默认文案 “标签”
      },
      socialLinks: [
        // 信息栏展示社交信息
        { icon: "reco-github", link: "https://github.com/recoluan" },
        { icon: "reco-npm", link: "https://www.npmjs.com/~reco_luan" },
      ],
    },
    // 添加友链
    friendLink: [
      {
        title: "vuepress-theme-reco",
        desc: "A simple and beautiful vuepress Blog & Doc theme.",
        logo: "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
        link: "https://vuepress-theme-reco.recoluan.com",
      },
    ],
  },

  // 多语言
  locales: {
    "/": {
      lang: "zh-CN",
    },
  },
  // 移动端优化
  head: [
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no",
      },
    ],
  ],
}
