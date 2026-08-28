// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import VPSocialLinks from 'vitepress/dist/client/theme-default/components/VPSocialLinks.vue'
import Layout from './Layout.vue'
import './style.css'

export default {
  extends: DefaultTheme, // inherit the content styles and dark mode palette
  Layout, // replace only the page shell

  enhanceApp({ app }) {
    // Makes <SocialLinks> usable inside any .md file, not just in Layout.vue
    app.component('SocialLinks', VPSocialLinks)
  }
} satisfies Theme