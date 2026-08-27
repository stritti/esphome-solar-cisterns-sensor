import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Solar Cistern Sensor',
  description: 'ESPHome documentation for the solar-powered cistern level sensor',
  base: '/esphome-solar-cisterns-sensor/',
  cleanUrls: true,
  lastUpdated: true,
  sitemap: {
    hostname: 'https://stritti.github.io/esphome-solar-cisterns-sensor/'
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en'
    },
    de: {
      label: 'Deutsch',
      lang: 'de',
      link: '/de/'
    }
  },
  themeConfig: {
    logo: '/logo.svg',
    search: {
      provider: 'local'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/stritti/esphome-solar-cisterns-sensor' }
    ],
    locales: {
      root: {
        nav: [
          { text: 'Overview', link: '/' },
          { text: 'Wiring', link: '/WIRING' }
        ],
        sidebar: [
          {
            text: 'Documentation',
            items: [
              { text: 'Overview', link: '/' },
              { text: 'Wiring and power', link: '/WIRING' }
            ]
          }
        ],
        outlineTitle: 'On this page',
        lastUpdatedText: 'Last updated'
      },
      de: {
        nav: [
          { text: 'Übersicht', link: '/de/' },
          { text: 'Verkabelung', link: '/VERKABELUNG' }
        ],
        sidebar: [
          {
            text: 'Dokumentation',
            items: [
              { text: 'Übersicht', link: '/de/' },
              { text: 'Verkabelung und Energie', link: '/VERKABELUNG' }
            ]
          }
        ],
        outlineTitle: 'Auf dieser Seite',
        lastUpdatedText: 'Zuletzt aktualisiert'
      }
    },
    footer: {
      message: 'ESPHome · FireBeetle 2 ESP32-C6 · A02YYUW',
      copyright: 'Open-source hardware documentation'
    }
  }
})
