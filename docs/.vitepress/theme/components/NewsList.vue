<script setup>
import { computed, createTextVNode, h, ref } from 'vue'
import { news } from '../../data/news'

const props = defineProps({
  /**
   * Show only this many of the most recent posts, with no pager and a link out
   * to the full page instead -- what the News corner on the About page wants.
   * Left at 0, the list is the whole archive, paged.
   */
  limit: { type: Number, default: 0 }
})

// How many posts fit on one page. The pager below only appears once the
// archive is longer than this.
const PER_PAGE = 10

// Which panels are open. Several can be open at once: a reader comparing two
// posts should not have the first one shut on them when they open the second.
const openKeys = ref([])

const page = ref(1)

// Paging scrolls the top of the list back into view, so the component needs a
// handle on its own root element.
const listEl = ref(null)

// String comparison, not Date parsing: `YYYY-MM-DD` sorts correctly as text,
// and it avoids the timezone shift that `new Date('2025-08-14')` introduces.
const items = computed(() => [...news].sort((a, b) => b.date.localeCompare(a.date)))

// A limited list is one page by definition, which is also what switches the
// pager off -- it renders only when this is greater than 1.
const pageCount = computed(() =>
  props.limit ? 1 : Math.max(1, Math.ceil(items.value.length / PER_PAGE))
)

const visible = computed(() => {
  if (props.limit) return items.value.slice(0, props.limit)
  const start = (page.value - 1) * PER_PAGE
  return items.value.slice(start, start + PER_PAGE)
})

// Only worth offering the way out when something is actually being held back.
// With five or fewer posts in total, the About page is already showing the
// whole archive and a link to see it again would be noise.
const hasMore = computed(() => props.limit > 0 && items.value.length > props.limit)

// The first page, the last page, and the current one with a neighbour on each
// side. Everything skipped between two kept numbers collapses into a single
// gap marker, so the row stays about the same width however long the archive
// gets instead of running off the side of the column.
const pageList = computed(() => {
  const last = pageCount.value
  const out = []
  let prev = 0

  for (let p = 1; p <= last; p++) {
    if (p !== 1 && p !== last && Math.abs(p - page.value) > 1) continue
    if (p - prev > 1) out.push({ type: 'gap', key: `gap-${p}` })
    out.push({ type: 'page', key: `page-${p}`, n: p })
    prev = p
  }

  return out
})

function goTo(n) {
  const next = Math.min(Math.max(n, 1), pageCount.value)
  if (next === page.value) return
  page.value = next

  // `nearest` rather than `start`: if the top of the list is already on screen
  // this does nothing, and otherwise it scrolls just far enough to show it --
  // so paging never jumps a reader who is already at the top.
  listEl.value?.scrollIntoView({ block: 'nearest' })
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// The day is kept in the data because it decides the order within a month, but
// only the month is worth showing on a news list.
//
// The string is split rather than handed to `new Date`, which would read a bare
// `YYYY-MM-DD` as UTC midnight and then print it in the reader's timezone --
// west of Greenwich that lands on the previous day, and on the first of a month
// it would show the wrong month entirely.
function yearMonth(date) {
  const [year, month] = date.split('-')
  return `${MONTHS[Number(month) - 1]} ${year}`
}

function isOpen(key) {
  return openKeys.value.includes(key)
}

function toggle(key) {
  const i = openKeys.value.indexOf(key)
  if (i === -1) openKeys.value.push(key)
  else openKeys.value.splice(i, 1)
}

/**
 * A deliberately small subset of markdown, matched in this order:
 * `**bold**`, `*italic*`, `[text](url)`.
 *
 * The bodies in news.ts are prose, not documents, so this covers what they
 * actually need without pulling a markdown parser into the browser bundle.
 * The inner `[^*]` also means the marks do not nest -- `**bold with *italic*
 * inside**` will not work. Write the two separately if it ever comes up.
 */
const INLINE = /\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)\s]+)\)/

// The same minus links, for titles. See titleParts().
const INLINE_NO_LINK = /\*\*([^*]+)\*\*|\*([^*]+)\*/

// Returns the text as a list of pieces for <Inline> to render.
function inlineParts(text, { links = true } = {}) {
  const re = links ? INLINE : INLINE_NO_LINK
  const out = []
  let rest = text

  while (rest) {
    const m = re.exec(rest)

    if (!m) {
      out.push({ type: 'text', text: rest })
      break
    }

    if (m.index > 0) out.push({ type: 'text', text: rest.slice(0, m.index) })

    if (m[1] !== undefined) out.push({ type: 'strong', text: m[1] })
    else if (m[2] !== undefined) out.push({ type: 'em', text: m[2] })
    else out.push({ type: 'link', text: m[3], url: m[4] })

    rest = rest.slice(m.index + m[0].length)
  }

  return out
}

// Blank lines start a new paragraph; every other run of whitespace is just how
// the string was wrapped in news.ts, so it collapses to a single space. The
// collapse happens first, which is what lets a `*...*` span a line break in the
// source and still be one run by the time the inline pass sees it.
function paragraphs(body) {
  return body
    .trim()
    .split(/\n\s*\n/)
    .map((p) => inlineParts(p.replace(/\s+/g, ' ').trim()))
}

// Titles take the same marks as bodies except links: the whole title line is
// already a button, and an anchor inside a button is both invalid HTML and
// ambiguous to click -- one gesture, two things to do. So `[text](url)` in a
// title is left as the literal characters, which makes it obvious on the page
// that it did not take.
function titleParts(title) {
  return inlineParts(title, { links: false })
}

/**
 * Renders what inlineParts() returns as real elements. Deliberately not a
 * string of HTML handed to `v-html`, which is the same reasoning as the
 * author-name bolding in PublicationList.
 *
 * A render function rather than a block of template markup because the title
 * and the body both need it and two copies would drift. It also sheds the
 * whitespace sensitivity that a `v-for` over inline tags has, where a newline
 * between two tags is a text node and whether it survives is up to the
 * compiler's whitespace handling.
 */
const Inline = (props) =>
  props.parts.map((s) => {
    if (s.type === 'strong') return h('strong', s.text)
    if (s.type === 'em') return h('em', s.text)
    if (s.type === 'link') return h('a', { href: s.url, target: '_blank', rel: 'noopener' }, s.text)
    return createTextVNode(s.text)
  })

Inline.props = ['parts']
</script>

<template>
  <div ref="listEl" class="news" :class="{ compact: limit }">
    <article v-for="n in visible" :key="n.key" class="news-item" :class="{ open: isOpen(n.key) }">
      <div class="news-head">
        <h3 class="news-title">
          <!-- The button fills the column, so the empty space to the right of a
               short title is part of the same target as the words themselves -->
          <button
            type="button"
            :aria-expanded="isOpen(n.key)"
            :aria-controls="`news-body-${n.key}`"
            @click="toggle(n.key)"
          >
            <span class="news-caret" aria-hidden="true"></span>
            <span><Inline :parts="titleParts(n.title)" /></span>
          </button>
        </h3>

        <!-- `datetime` keeps the full date the data carries, so the machine
             reading is not lost when the display drops the day -->
        <time class="news-date" :datetime="n.date">{{ yearMonth(n.date) }}</time>
      </div>

      <div v-if="n.tags.length" class="news-tags">
        <span v-for="t in n.tags" :key="t" class="news-tag">#{{ t }}</span>
      </div>

      <!-- Height is animated by the grid row rather than by `max-height`, so the
           panel opens to exactly the height of its content instead of to a
           guessed ceiling. The inner div carries the `overflow: hidden` the
           collapse needs; `visibility` is what keeps the closed body out of the
           tab order and out of a screen reader. -->
      <div class="news-panel">
        <div class="news-panel-clip">
          <div :id="`news-body-${n.key}`" class="news-body">
            <p v-for="(p, i) in paragraphs(n.body)" :key="i"><Inline :parts="p" /></p>

            <p v-if="n.links?.length" class="news-links">
              <a
                v-for="l in n.links"
                :key="l.url"
                class="no-icon"
                :href="l.url"
                target="_blank"
                rel="noopener"
                >{{ l.label }}</a
              >
            </p>
          </div>
        </div>
      </div>
    </article>

    <nav v-if="pageCount > 1" class="news-pager" aria-label="News pages">
      <button type="button" :disabled="page === 1" aria-label="Previous page" @click="goTo(page - 1)">
        &lsaquo;
      </button>

      <template v-for="p in pageList" :key="p.key">
        <span v-if="p.type === 'gap'" class="news-pager-gap" aria-hidden="true">&hellip;</span>
        <button
          v-else
          type="button"
          :class="{ on: p.n === page }"
          :aria-current="p.n === page ? 'page' : undefined"
          @click="goTo(p.n)"
        >
          {{ p.n }}
        </button>
      </template>

      <button
        type="button"
        :disabled="page === pageCount"
        aria-label="Next page"
        @click="goTo(page + 1)"
      >
        &rsaquo;
      </button>
    </nav>

    <!-- `/news` without the extension, matching how themeConfig.nav writes it.
         VitePress's router resolves that on click; only a cold load of the bare
         URL depends on the host, and that is already true of the nav rail. -->
    <p v-if="hasMore" class="more-link"><a href="/news">All news &rarr;</a></p>
  </div>
</template>

<style scoped>
/* Everything here sits inside `.vp-doc`, whose own rules for h3/p/a would
   otherwise apply. Class selectors inside a scoped block outrank `.vp-doc h3`
   and friends, so each element the component renders is styled explicitly. */

/* Sized against the first item's own 14px of padding, not on its own: together
   they put 24px between a heading and the first title, a little airier than the
   16px the theme gives a heading followed by a paragraph, which suits a block
   of list rows. On the News page the list is the first element and style.css
   zeroes this, so only the padding is left there. */
.news {
  margin-top: 10px;
}

.news-item {
  padding: 14px 0;
}

/* Tighter rows in the limited variant. On the News page the list is the whole
   page and can breathe; on About it is a five-row preview wedged between the
   biography and the research highlight, and at that size the same spacing reads
   as five loose fragments rather than one block. Each row pads both edges, so
   10px puts 20px between two rows instead of 28px. */
.news.compact .news-item {
  padding: 10px 0;
}

.news-item + .news-item {
  border-top: 1px solid var(--vp-c-divider);
}

/* Title left, date right. Both line boxes are 22px tall so the two sit on the
   same line however the baselines of the two font sizes work out. */
.news-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: baseline;
  gap: 12px;
}

/* Deliberately not bold, and stated rather than left alone: this is an `h3`,
   and `.vp-doc h3` would otherwise make it 600. The caret and the hover colour
   are what mark the line as something to click. */
.news-title {
  margin: 0;
  font-size: 15px;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: normal;
  color: var(--vp-c-text-1);
}

/* A grid, not inline text: the caret gets a column of its own, so a title that
   wraps to a second line stays flush instead of tucking under the arrow. */
.news-title button {
  display: grid;
  grid-template-columns: 14px minmax(0, 1fr);
  align-items: start;
  width: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  color: inherit;
  text-align: left;
  cursor: pointer;
  transition: color 0.25s;
}

.news-title button:hover {
  color: var(--vp-c-brand-1);
}

/* A border triangle rather than a glyph, so it is exactly the size asked for
   and inherits the hover colour. 7px of top margin centres its 8px height on
   the 22px first line. */
.news-caret {
  width: 0;
  height: 0;
  margin-top: 7px;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  border-left: 5px solid currentColor;
  transition: transform 0.22s ease;
}

.news-item.open .news-caret {
  transform: rotate(90deg);
}

.news-date {
  font-size: 12px;
  line-height: 22px;
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-3);
}

/* Indented to the title's text column, past the caret. Plain `#tag` text rather
   than the coloured chip the Works page uses: there the colour is a filter
   affordance, here the tags are just a quiet label under the title, and they
   should not out-shout the title now that it is no longer bold. */
.news-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 2px 0 0 14px;
}

.news-tag {
  font-size: 12px;
  line-height: 18px;
  color: var(--vp-c-text-3);
}

/* Collapse
   -------------------------------------------------------------------------- */

.news-panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.22s ease;
}

.news-item.open .news-panel {
  grid-template-rows: 1fr;
}

.news-panel-clip {
  overflow: hidden;
  /* Transitioned, not toggled: `visibility` flips to `visible` at the start of
     the opening run and back to `hidden` only at the end of the closing one, so
     the text is never clipped mid-animation. */
  visibility: hidden;
  transition: visibility 0.22s;
}

.news-item.open .news-panel-clip {
  visibility: visible;
}

/* A quote rule, the same 2px divider the theme draws beside a blockquote. It
   sits in the caret's own column, so the line reads as dropping down out of
   the arrow that was just clicked, and 2px + 12px puts the body text at 14px --
   flush with the title above it and with the tag row.
   The 10px gap above is `margin`, not `padding`: padding would be inside the
   border and the rule would start a line-height too high. `.news-panel-clip`
   is an overflow container, so the margin cannot collapse out of the panel and
   still counts toward the height the collapse animates to. */
.news-body {
  margin: 10px 0 0;
  padding-left: 12px;
  border-left: 2px solid var(--vp-c-divider);
}

.news-body p {
  margin: 0;
  font-size: 14px;
  line-height: 23px;
  color: var(--vp-c-text-2);
}

.news-body p + p {
  margin-top: 10px;
}

/* The body sits at `text-2`, and bold at that opacity reads muddy rather than
   emphatic, so `**...**` also steps up to the full text colour. `*...*` needs
   nothing -- the slant carries it on its own. */
.news-body strong {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

/* Scoped by `.news-body` so it outranks the `p + p` rule above, which would
   otherwise be the more specific of the two */
.news-body .news-links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.news-links a {
  font-size: 12px;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

/* Brackets as pseudo-elements so they are not selectable text. Every anchor
   also carries `no-icon`: without it the theme turns its `::after` into a
   masked external-link arrow, which paints over the closing bracket. */
.news-links a::before {
  content: '[';
}

.news-links a::after {
  content: ']';
}

.news-links a:hover {
  text-decoration: underline;
}

/* Pager
   -------------------------------------------------------------------------- */

.news-pager {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px;
  margin-top: 20px;
  padding-top: 14px;
  border-top: 1px solid var(--vp-c-divider);
}

.news-pager button {
  min-width: 26px;
  margin: 0;
  padding: 3px 6px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  font-family: inherit;
  font-size: 13px;
  line-height: 20px;
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: background-color 0.25s, color 0.25s;
}

.news-pager button:hover:not(:disabled) {
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

/* The current page is a button too, so that the row does not reflow when the
   selection moves. It is just inert. */
.news-pager button.on {
  background-color: var(--vp-c-brand-soft);
  font-weight: 700;
  color: var(--vp-c-brand-1);
}

.news-pager button:disabled {
  color: var(--vp-c-text-3);
  cursor: default;
}

.news-pager-gap {
  padding: 0 2px;
  font-size: 13px;
  line-height: 20px;
  color: var(--vp-c-text-3);
}

/* The limited list closes with `.more-link` instead of the pager. That rule is
   in theme/style.css, shared with the Research Highlight below this section. */

/* Nothing here conveys meaning through motion -- the caret and the open panel
   both read the same standing still -- so the whole animation can just go. */
@media (prefers-reduced-motion: reduce) {
  .news-caret,
  .news-panel,
  .news-panel-clip {
    transition: none;
  }
}

/* Narrow screens: the date drops below the title rather than squeezing it, and
   lines up with the title's text column */
@media (max-width: 639px) {
  .news-head {
    grid-template-columns: minmax(0, 1fr);
    gap: 2px;
  }

  .news-date {
    margin-left: 14px;
    line-height: 18px;
  }
}
</style>
