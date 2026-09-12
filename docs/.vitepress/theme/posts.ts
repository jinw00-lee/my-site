/**
 * Everything the blog needs to agree on in one place.
 *
 * Used from both sides of the build: Node (config.mts, data/posts.data.ts) and
 * the browser (Layout.vue, BlogList.vue, BlogPost.vue). Nothing here may import
 * a Node module, or the browser bundle breaks.
 */

/**
 * The folder under docs/ that holds one markdown file per post. A file at
 * docs/posts/first-post.md is served at /posts/first-post.
 *
 * Deliberately not `blog/`. The Blog list is blog.md, which builds to
 * blog.html, and a `blog/` folder beside it would give the host two answers
 * for `/blog`: some static hosts pick the folder, redirect to `/blog/`, find no
 * index page there, and serve a 404 instead of the list.
 */
export const POSTS_DIR = 'posts'

/** The nav rail entry a post belongs to, so it stays highlighted while reading. */
export const BLOG_PAGE = '/blog'

/** `relativePath` is VitePress's path of a page's source file, e.g. `posts/first-post.md`. */
export function isPostFile(relativePath: string): boolean {
  return relativePath.startsWith(`${POSTS_DIR}/`)
}

/**
 * Normalises a front matter date to `YYYY-MM-DD`.
 *
 * The YAML parser turns an unquoted `date: 2026-09-12` into a Date at UTC
 * midnight, while a quoted one stays a string. Reading the Date back in UTC
 * gives the day exactly as written; local time would shift it a day earlier
 * anywhere west of Greenwich.
 */
export function isoDay(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value ?? '').slice(0, 10)
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

// Split rather than handed to `new Date`, for the same timezone reason as above.
// Anything that is not a valid `YYYY-MM-DD` is returned as typed, so a typo in
// the front matter shows up on the page instead of rendering as "undefined".
function dateParts(iso: string) {
  const [year, month, day] = iso.split('-').map(Number)
  if (!year || !MONTHS[month - 1] || !day) return null
  return { year, month: MONTHS[month - 1], day }
}

/** `September 12, 2026`, for the byline and footer of a post. */
export function longDate(iso: string): string {
  const p = dateParts(iso)
  return p ? `${p.month} ${p.day}, ${p.year}` : iso
}

/** `Sep 12, 2026`, for the Blog list, where the column is narrower. */
export function shortDate(iso: string): string {
  const p = dateParts(iso)
  return p ? `${p.month.slice(0, 3)} ${p.day}, ${p.year}` : iso
}

// A common estimate for adult silent reading of non-fiction prose.
const WORDS_PER_MINUTE = 225

/**
 * Rough minutes to read a post, from its raw markdown source.
 *
 * The front matter and HTML comments are dropped first so that authoring notes
 * do not count. Markdown punctuation that remains (link targets, `**`) adds a
 * few stray "words", which is well inside the error of the estimate itself.
 */
export function readingMinutes(src: string): number {
  const text = src
    .replace(/^---\r?\n[\s\S]*?\r?\n---/, '')
    .replace(/<!--[\s\S]*?-->/g, '')
  const words = text.match(/\S+/g)?.length ?? 0
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}
