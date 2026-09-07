// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import VPSocialLinks from 'vitepress/dist/client/theme-default/components/VPSocialLinks.vue'
import Layout from './Layout.vue'
import './style.css'

declare global {
  interface Window {
    goatcounter?: { count?: (opts: { path: string }) => void }
  }
}

export default {
  extends: DefaultTheme, // inherit the content styles and dark mode palette
  Layout, // replace only the page shell

  enhanceApp({ app, router }) {
    // Makes <SocialLinks> usable inside any .md file, not just in Layout.vue
    app.component('SocialLinks', VPSocialLinks)

    /**
     * Page views for GoatCounter, whose script is loaded in config.mts.
     *
     * This site is a single-page app: after the first load, moving between
     * About and News swaps the content without a page load. An analytics
     * script left to itself would therefore only ever see whichever page the
     * visitor landed on, and every click after that would be invisible.
     *
     * The wrinkle is that VitePress calls `router.go()` once when it mounts,
     * so this hook fires for the landing page too -- and count.js has already
     * counted that one by itself on load. Hence `first`: the opening call is
     * skipped, and everything after it is a real navigation.
     *
     * Skipping rather than turning count.js's own on-load counting off is
     * deliberate. Disabling it would mean counting the landing page from here
     * instead, which races the async <script> tag: if it has not finished
     * loading when this fires, that view is simply lost. Letting count.js
     * count on its own load has no such race.
     */
    if (import.meta.env.PROD) {
      let first = true
      const previous = router.onAfterRouteChange

      router.onAfterRouteChange = (href) => {
        previous?.(href)

        if (first) {
          first = false
          return
        }

        window.goatcounter?.count?.({
          path: location.pathname + location.search + location.hash
        })
      }
    }
  }
} satisfies Theme
