/**
 * The list of posts on the Blog page, built from the markdown files themselves.
 *
 * Unlike news.ts there is nothing to edit here: adding a file to docs/posts/
 * is enough for it to appear. VitePress runs this at build time (and again
 * whenever a post changes in dev) and ships only the result to the browser.
 * https://vitepress.dev/guide/data-loading#createcontentloader
 */
import { createContentLoader } from 'vitepress'
import { isoDay, POSTS_DIR } from '../theme/posts'

export interface PostSummary {
  /** Address of the post, e.g. `/posts/first-post` */
  url: string
  title: string
  /** `YYYY-MM-DD` */
  date: string
}

declare const data: PostSummary[]
export { data }

export default createContentLoader(`${POSTS_DIR}/*.md`, {
  transform(raw): PostSummary[] {
    return (
      raw
        .map(({ url, frontmatter }) => ({
          url,
          // Falls back to the address so a post missing its title is still
          // visible in the list, and obviously so, rather than an empty row
          title: frontmatter.title ?? url,
          date: isoDay(frontmatter.date)
        }))
        // Newest first. `YYYY-MM-DD` sorts correctly as plain text.
        .sort((a, b) => b.date.localeCompare(a.date))
    )
  }
})
