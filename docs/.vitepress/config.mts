import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Solar Cistern Sensor',
  description: 'ESPHome documentation for the solar-powered cistern level sensor',
  base: '/esphome-solar-cisterns-sensor/',
  cleanUrls: true,
  lastUpdated: true,
  srcExclude: ['VERKABELUNG.md'],
  sitemap: {
    hostname: 'https://stritti.github.io/esphome-solar-cisterns-sensor/'
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
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
        outline: { label: 'On this page' },
        lastUpdated: { text: 'Last updated' }
      }
    },
    de: {
      label: 'Deutsch',
      lang: 'de',
      link: '/de/',
      themeConfig: {
        nav: [
          { text: 'Übersicht', link: '/de/' },
          { text: 'Verkabelung', link: '/de/WIRING' }
        ],
        sidebar: [
          {
            text: 'Dokumentation',
            items: [
              { text: 'Übersicht', link: '/de/' },
              { text: 'Verkabelung und Energie', link: '/de/WIRING' }
            ]
          }
        ],
        outline: { label: 'Auf dieser Seite' },
        lastUpdated: { text: 'Zuletzt aktualisiert' },
        returnToTopLabel: 'Nach oben'
      }
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
    footer: {
      message: 'ESPHome · FireBeetle 2 ESP32-C6 · A02YYUW',
      copyright: 'Open-source hardware documentation'
    }
  }
})
