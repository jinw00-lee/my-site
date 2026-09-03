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

  // This is the <meta name="description">, which is what Google prints under
  // the title in a search result and what Slack, Bluesky and LinkedIn show when
  // someone pastes the link. Kept under about 160 characters, since search
  // engines truncate around there, and led with the name so the snippet still
  // identifies the person when it is cut short.
  description:
    "Jinwoo Lee — doctoral student at UC San Diego studying the paradoxical nature of human emotion through affective and social neuroscience.",

  // Anything added to every page's <head>. `/favicon.png` resolves to
  // docs/public/favicon.png, which VitePress copies to the root of the build.
  head: [['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }]],

  // Every internal link on this site is written without the extension -- the
  // nav in themeConfig, and the "All news"/"All works" links. Without this the
  // router still resolved them on click, but a cold load of jinwoo-lee.com/news
  // would 404, since the built file is news.html. This tells VitePress the host
  // resolves an extensionless path to the .html file, which GitHub Pages,
  // Netlify, Vercel and Cloudflare Pages all do.
  cleanUrls: true,

  // `base` is deliberately left at its default '/'. The site is served from the
  // root of jinwoo-lee.com, so that is correct -- but it also means the same
  // build looks broken at jinw00-lee.github.io/my-site/, where every asset is
  // requested from the root and 404s. That is expected, not a bug: do not
  // "fix" it by setting base to '/my-site/', which would break the real domain.

  markdown: {
    // Drop the "#" permalink VitePress hangs off every markdown heading, which
    // fades in on hover. This removes the element itself rather than hiding it
    // with CSS, so there is no invisible link left in the tab order.
    //
    // A no-op generator rather than `permalink: false`: false does work at
    // runtime, but markdown-it-anchor's types declare this field as a generator
    // function, so it fails the type check. A function that renders nothing is
    // the same result and stays typed.
    //
    // The headings keep their `id` -- markdown-it-anchor assigns that
    // separately -- so /#biography still works as an address, and the local
    // search still resolves its results to the right heading.
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

    // No socialLinks here on purpose: the rail keeps only the appearance
    // toggle, and the social icons live in the profile block in index.md.

    // Bump this by hand whenever the site content actually changes
    siteUpdated: 'Sep, 2026',

    search: {
      provider: 'local'
    }
  }
})

