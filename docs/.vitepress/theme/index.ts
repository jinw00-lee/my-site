// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import VPSocialLinks from 'vitepress/dist/client/theme-default/components/VPSocialLinks.vue'
import Layout from './Layout.vue'
import XPost from './components/XPost.vue'
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

    // Lets a post embed an X (Twitter) post with one line:
    // <XPost url="https://x.com/..." />. Registered globally so posts need no
    // import of their own. X's script loads only on pages that use it.
    app.component('XPost', XPost)

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
