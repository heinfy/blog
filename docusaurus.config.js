// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'heinfy',
  tagline: '一个整理笔记、写博客和展示项目的网站',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://heinfy.top',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  // organizationName: 'facebook', // Usually your GitHub org/user name.
  // projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans']
  },

  plugins: [require.resolve('docusaurus-lunr-search')],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/heinfy/blog/tree/main/docs'
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/heinfy/blog/tree/main/blog'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      })
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'heinfy',
        logo: {
          alt: "heinfy'ss logo",
          src: 'img/logo.svg'
        },
        items: [
          // cli 自带的侧边栏，我把文档放到 docs/docusaurus/
          /* {
            type: 'docSidebar',
            sidebarId: 'docusaurus',
            position: 'left',
            label: 'docusaurus'
          }, */
          // 导航栏链接到侧边栏
          {
            type: 'docSidebar',
            position: 'left',
            sidebarId: 'javascript',
            label: 'JavaScript'
          },
          {
            type: 'docSidebar',
            position: 'left',
            sidebarId: 'react',
            label: 'React'
          },
          {
            type: 'docSidebar',
            position: 'left',
            sidebarId: 'vue',
            label: 'Vue'
          },
          {
            type: 'docSidebar',
            position: 'left',
            sidebarId: 'typescript',
            label: 'Typescript'
          },
          {
            type: 'docSidebar',
            position: 'left',
            sidebarId: 'ebook',
            label: '电子书'
          },
          {
            type: 'docSidebar',
            position: 'left',
            sidebarId: 'mst',
            label: '面试题'
          },
          {
            type: 'docSidebar',
            position: 'left',
            sidebarId: 'liunx',
            label: 'Liunx'
          },
          // { to: '/blog', label: '博客', position: 'left' },
          {
            href: 'https://github.com/heinfy',
            label: 'GitHub',
            position: 'right'
          }
        ]
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '文档',
            items: [
              /* {
                label: 'Tutorial',
                to: '/docs/intro'
              }, */
              {
                label: 'GitHub',
                href: 'https://github.com/heinfy'
              }
            ]
          },
          {
            title: '博客',
            items: [
              {
                label: '我的主页',
                href: 'https://heinfy.top'
              },
              {
                label: 'vue-app',
                href: 'https://heinfy.github.io/vue-app/'
              }
            ]
          },
          {
            title: '更多',
            items: [
              {
                label: '我的简历',
                href: 'https://resume.heinfy.top/'
              }
            ]
          }
        ],
        copyright: `Copyright © ${new Date().getFullYear()} heinfy， 基于 Docusaurus 构建`
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme
      }
    })
};

module.exports = config;
