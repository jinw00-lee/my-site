import { defineConfigWithTheme } from 'vitepress'
import type { DefaultTheme } from 'vitepress'

interface ThemeConfig extends DefaultTheme.Config {
  siteUpdated?: string
}

// https://vitepress.dev/reference/site-config
export default defineConfigWithTheme<ThemeConfig>({
  title: "Jinwoo Lee",

  description:
    "Jinwoo Lee — doctoral student at UC San Diego studying the paradoxical nature of human emotion through affective and social neuroscience.",
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    [
      'script',
      {
        async: '',
        src: '//gc.zgo.at/count.js',
        'data-goatcounter': "https://jinwoo-lee.goatcounter.com/count"
      }
    ]
  ],

  cleanUrls: true,

  markdown: {
    anchor: { permalink: () => {} }
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    siteTitle: false,

    nav: [
      { text: 'About', link: '/' },
      { text: 'Works', link: '/works' },
      { text: 'News',  link: '/news' },
      { text: 'Blog',  link: '/blog' }
    ],

    siteUpdated: 'Sep, 2026',

    search: {
      provider: 'local'
    }
  }
})

