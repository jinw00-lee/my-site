import { defineConfigWithTheme } from 'vitepress'
import type { DefaultTheme } from 'vitepress'

// The rail in theme/Layout.vue shows a "last update" line, and the default
// theme's config has no field for it. Widening the type here keeps that field
// type checked instead of smuggling it past defineConfig.
// (`lastUpdated` is taken: the default theme reserves it for git timestamps.)
interface ThemeConfig extends DefaultTheme.Config {
  siteUpdated?: string
}

// https://vitepress.dev/reference/site-config
export default defineConfigWithTheme<ThemeConfig>({
  title: "Jinwoo Lee",
  description: "A Personal Website",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    siteTitle: false,

    nav: [
      { text: 'About', link: '/' },
      { text: 'Works', link: '/works' },
      { text: 'News',  link: '/news' },
      { text: 'Blog',  link: '/blog' }
    ],

    // No socialLinks here on purpose: the rail keeps only the appearance
    // toggle, and the social icons live in the profile block in index.md.

    // Bump this by hand whenever the site content actually changes
    siteUpdated: 'Aug, 2026',

    search: {
      provider: 'local'
    }
  }
})

