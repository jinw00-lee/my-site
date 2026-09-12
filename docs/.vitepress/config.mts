import fs from 'node:fs'
import path from 'node:path'
import { defineConfigWithTheme } from 'vitepress'
import type { DefaultTheme, MarkdownRenderer } from 'vitepress'
import footnote from 'markdown-it-footnote'
import { isoDay, isPostFile, readingMinutes } from './theme/posts'

/**
 * Keeps inline math attached to the punctuation touching it.
 *
 * Each `$...$` is rendered as an inline SVG, and browsers are willing to wrap a
 * line on either side of one. At some column widths that leaves a comma or a
 * full stop alone at the start of the next line, or an opening bracket
 * stranded at the end of the previous one. Wrapping the math and any
 * punctuation directly next to it in a `.math-nobreak` span (white-space:
 * nowrap, in theme/style.css) removes exactly those wrap points and no others.
 *
 * Registered last among the core rules, so it sees the final text tokens after
 * markdown-it has finished joining and typographically replacing them.
 */
function mathNoBreak(md: MarkdownRenderer) {
  const LEADING = /[(\[“‘]+$/
  const TRAILING = /^[,.;:!?)\]’”]+/

  md.core.ruler.push('math_nobreak', (state) => {
    for (const block of state.tokens) {
      if (block.type !== 'inline' || !block.children) continue

      const kids = block.children
      const out: typeof kids = []

      const html = (content: string) => {
        const t = new state.Token('html_inline', '', 0)
        t.content = content
        return t
      }
      const text = (content: string) => {
        const t = new state.Token('text', '', 0)
        t.content = content
        return t
      }

      for (let i = 0; i < kids.length; i++) {
        const tok = kids[i]
        if (tok.type !== 'math_inline') {
          out.push(tok)
          continue
        }

        // `prev` is read from `out`, not `kids`, so a text token that already
        // lost its leading punctuation to an earlier math span is seen as it
        // now is
        const prev = out[out.length - 1]
        const next = kids[i + 1]
        const lead = prev?.type === 'text' ? (LEADING.exec(prev.content)?.[0] ?? '') : ''
        const trail = next?.type === 'text' ? (TRAILING.exec(next.content)?.[0] ?? '') : ''

        if (!lead && !trail) {
          out.push(tok)
          continue
        }

        if (lead) prev.content = prev.content.slice(0, -lead.length)
        if (trail) next.content = next.content.slice(trail.length)

        out.push(html('<span class="math-nobreak">'))
        if (lead) out.push(text(lead))
        out.push(tok)
        if (trail) out.push(text(trail))
        out.push(html('</span>'))
      }

      block.children = out
    }
  })
}

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
    anchor: { permalink: () => {} },

    // TeX math: `$...$` inline and `$$...$$` on lines of their own for a
    // display block. Rendered to SVG at build time by markdown-it-mathjax3, so
    // no math library is shipped to the browser. The theme already makes a
    // display block scroll sideways when it is wider than the column.
    // A literal dollar sign in prose must be written as `\$`.
    math: true,

    // `[^1]` markers and their notes, collected at the end of a page. Blog
    // posts use them; styles are in theme/style.css under "Footnotes".
    config: (md) => {
      md.use(footnote)
      // The math plugin is already registered by `math: true` above: VitePress
      // applies it before calling this function
      md.use(mathNoBreak)
    }
  },

  /**
   * Fills in what a blog post's header needs but its author should not have to
   * write by hand. Runs on the server for every page, in dev and in the build,
   * before the page data is sent to the browser. Other pages pass through.
   */
  transformPageData(pageData, { siteConfig }) {
    if (!isPostFile(pageData.relativePath)) return

    const fm = pageData.frontmatter

    // YAML reads `date: 2026-09-12` as a Date, which would reach the browser as
    // a full ISO timestamp. See isoDay() in theme/posts.ts.
    fm.date = isoDay(fm.date)

    const src = fs.readFileSync(path.join(siteConfig.srcDir, pageData.relativePath), 'utf-8')
    fm.readingTime = readingMinutes(src)
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

