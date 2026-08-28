<script setup>
import { computed, ref } from 'vue'
import { publications } from '../../data/publications'

// Sorting and filtering all happen in the browser over the full list. That is
// fine at this size -- a few dozen entries -- and it keeps every control
// instant and shareable-free. If the list ever grows past a few hundred, this
// is the place to switch to a prebuilt index.

const SORTS = [
  { value: 'year_desc', label: 'Year' },
  { value: 'year_asc', label: 'Year (reverse)' },
  { value: 'title', label: 'Title' }
]

// Only the keys present on a paper's `links` are rendered, in this order.
const LINK_LABELS = {
  pdf: 'pdf',
  doi: 'doi',
  code: 'code',
  osf: 'osf materials',
  site: 'project website'
}

const sort = ref('year_desc')
const query = ref('')
const activeTags = ref([])
const openAbstracts = ref([])

// Built once at setup rather than inside the filter, so typing in the search
// box does not re-concatenate every record on every keystroke.
const haystacks = new Map(
  publications.map((p) => [
    p.key,
    [p.title, p.authors, p.venue, p.detail, p.year, p.abstract, p.tags.join(' ')]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
  ])
)

// Most-used tags first so the filter bar leads with the broad themes
const allTags = computed(() => {
  const counts = new Map()
  for (const p of publications) {
    for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1)
  }
  return [...counts]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name, count]) => ({ name, count }))
})

const results = computed(() => {
  let list = publications

  // Multiple tags narrow rather than widen: a paper has to carry all of them
  if (activeTags.value.length) {
    list = list.filter((p) => activeTags.value.every((t) => p.tags.includes(t)))
  }

  const terms = query.value.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (terms.length) {
    list = list.filter((p) => {
      const hay = haystacks.get(p.key)
      return terms.every((t) => hay.includes(t))
    })
  }

  const out = [...list]
  if (sort.value === 'title') {
    out.sort((a, b) => a.title.localeCompare(b.title))
  } else {
    const dir = sort.value === 'year_asc' ? -1 : 1
    out.sort((a, b) => dir * (b.year - a.year) || a.title.localeCompare(b.title))
  }
  return out
})

// One render path for both modes: sorting by title collapses to a single
// untitled section, sorting by year splits into one section per year.
const sections = computed(() => {
  if (sort.value === 'title') return [{ year: null, items: results.value }]

  const out = []
  for (const p of results.value) {
    const last = out[out.length - 1]
    if (last && last.year === p.year) last.items.push(p)
    else out.push({ year: p.year, items: [p] })
  }
  return out
})

const isFiltered = computed(() => activeTags.value.length > 0 || query.value.trim() !== '')

function toggleTag(tag) {
  const i = activeTags.value.indexOf(tag)
  if (i === -1) activeTags.value.push(tag)
  else activeTags.value.splice(i, 1)
}

function resetFilters() {
  activeTags.value = []
  query.value = ''
}

function toggleAbstract(key) {
  const i = openAbstracts.value.indexOf(key)
  if (i === -1) openAbstracts.value.push(key)
  else openAbstracts.value.splice(i, 1)
}

// Split the author string so the site owner's name can be bolded without
// handing raw HTML to v-html. Trailing daggers and asterisks are part of the
// match so the marks stay attached to the bolded name.
function authorParts(authors) {
  const re = /Lee, J\.[†*]*/g
  const parts = []
  let last = 0
  let m
  while ((m = re.exec(authors)) !== null) {
    if (m.index > last) parts.push({ text: authors.slice(last, m.index), me: false })
    parts.push({ text: m[0], me: true })
    last = m.index + m[0].length
  }
  if (last < authors.length) parts.push({ text: authors.slice(last), me: false })
  return parts
}

// Driven by the key order of LINK_LABELS rather than by each record's own key
// order, so the row reads the same across papers however the data was typed.
function linkList(paper) {
  const links = paper.links ?? {}
  return Object.keys(LINK_LABELS)
    .filter((kind) => links[kind])
    .map((kind) => ({ kind, url: links[kind], label: LINK_LABELS[kind] }))
}

// Deterministic so a tag keeps its colour between reloads and between the
// filter bar and the cards. The exact bucket does not matter, only stability.
function tagColor(tag) {
  let h = 0
  for (let i = 0; i < tag.length; i++) h = (h * 31 + tag.charCodeAt(i)) >>> 0
  return `tag-c${h % 5}`
}
</script>

<template>
  <div class="pubs">
    <div class="pub-controls">
      <label class="pub-field">
        <span class="pub-field-label">Sort by:</span>
        <select v-model="sort">
          <option v-for="o in SORTS" :key="o.value" :value="o.value">{{ o.label }}</option>
        </select>
      </label>

      <label class="pub-field">
        <span class="pub-field-label">Search:</span>
        <input v-model="query" type="search" placeholder="titles, authors, venues, tags" />
      </label>
    </div>

    <div class="pub-tagbar">
      <button
        v-for="t in allTags"
        :key="t.name"
        type="button"
        class="tag"
        :class="[tagColor(t.name), { on: activeTags.includes(t.name) }]"
        :aria-pressed="activeTags.includes(t.name)"
        @click="toggleTag(t.name)"
      >
        {{ t.name }}<span class="tag-count">{{ t.count }}</span>
      </button>
    </div>

    <p v-if="isFiltered" class="pub-status">
      {{ results.length }} of {{ publications.length }} papers
      <button type="button" class="pub-reset" @click="resetFilters">clear filters</button>
    </p>

    <p v-if="!results.length" class="pub-empty">No papers match that.</p>

    <section v-for="section in sections" :key="section.year ?? 'all'" class="pub-section">
      <h2 v-if="section.year !== null" class="pub-year">{{ section.year }}</h2>

      <article v-for="p in section.items" :key="p.key" class="pub">
        <div class="pub-thumb">
          <img v-if="p.thumb" :src="p.thumb" alt="" loading="lazy" />
          <span v-else class="pub-thumb-empty" aria-hidden="true"></span>
        </div>

        <div class="pub-body">
          <div class="pub-tags">
            <button
              v-for="t in p.tags"
              :key="t"
              type="button"
              class="tag"
              :class="[tagColor(t), { on: activeTags.includes(t) }]"
              :aria-pressed="activeTags.includes(t)"
              @click="toggleTag(t)"
            >
              {{ t }}
            </button>
          </div>

          <h3 class="pub-title">
            <a v-if="p.links?.doi || p.links?.pdf" :href="p.links.doi || p.links.pdf" target="_blank" rel="noopener">{{ p.title }}</a>
            <template v-else>{{ p.title }}</template>
          </h3>

          <p class="pub-authors">
            <template v-for="(part, i) in authorParts(p.authors)" :key="i"
              ><strong v-if="part.me">{{ part.text }}</strong><template v-else>{{ part.text }}</template></template
            >
          </p>

          <p class="pub-venue">
            <em>{{ p.venue }}</em><template v-if="p.detail">, {{ p.detail }}</template> ({{ p.year }})
          </p>

          <p v-if="p.abstract || linkList(p).length" class="pub-links">
            <button v-if="p.abstract" type="button" @click="toggleAbstract(p.key)">
              {{ openAbstracts.includes(p.key) ? 'hide abstract' : 'abstract' }}
            </button>
            <a v-for="l in linkList(p)" :key="l.kind" :href="l.url" target="_blank" rel="noopener">{{ l.label }}</a>
          </p>

          <p v-if="p.abstract && openAbstracts.includes(p.key)" class="pub-abstract">{{ p.abstract }}</p>
        </div>
      </article>
    </section>

    <p class="pub-legend">† corresponding author &nbsp;·&nbsp; * equal contribution</p>
  </div>
</template>

<style scoped>
/* Everything here sits inside `.vp-doc`, whose own rules for h2/h3/p/a/em would
   otherwise apply. Class selectors inside a scoped block outrank `.vp-doc h3`
   and friends, so each element the component renders is styled explicitly. */

.pubs {
  margin-top: 24px;
}

/* Controls
   -------------------------------------------------------------------------- */

.pub-controls {
  display: grid;
  grid-template-columns: 160px minmax(0, 1fr);
  gap: 12px;
}

.pub-field {
  display: block;
  min-width: 0;
}

.pub-field-label {
  display: block;
  margin-bottom: 4px;
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.pubs select,
.pubs input {
  width: 100%;
  padding: 5px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background-color: var(--vp-c-bg);
  font-family: inherit;
  font-size: 13px;
  line-height: 20px;
  color: var(--vp-c-text-1);
  transition: border-color 0.25s;
}

.pubs select:hover,
.pubs input:hover {
  border-color: var(--vp-c-brand-1);
}

.pubs select:focus,
.pubs input:focus {
  outline: 1px solid var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

/* Tags
   -------------------------------------------------------------------------- */

.pub-tagbar {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 14px;
}

/* One hue per bucket, applied through a channel so light and dark can share a
   single set of rules. Only the hue changes between buckets. */
.tag-c0 { --tag-h: 212; }
.tag-c1 { --tag-h: 152; }
.tag-c2 { --tag-h: 38; }
.tag-c3 { --tag-h: 350; }
.tag-c4 { --tag-h: 272; }

.tag {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  margin: 0;
  padding: 2px 7px;
  border: 0;
  border-radius: 4px;
  background-color: hsl(var(--tag-h) 62% 94%);
  font-family: inherit;
  font-size: 11px;
  line-height: 16px;
  color: hsl(var(--tag-h) 48% 30%);
  cursor: pointer;
  transition: box-shadow 0.25s;
}

.dark .tag {
  background-color: hsl(var(--tag-h) 30% 20%);
  color: hsl(var(--tag-h) 52% 76%);
}

.tag:hover {
  box-shadow: inset 0 0 0 1px currentColor;
}

/* Selected tags keep their hue and gain a ring, so the filter state reads the
   same on the bar and on the cards without introducing a sixth colour. */
.tag.on {
  box-shadow: inset 0 0 0 1px currentColor;
  font-weight: 700;
}

.tag-count {
  font-size: 10px;
  opacity: 0.65;
}

/* Status line
   -------------------------------------------------------------------------- */

.pub-status,
.pub-empty {
  margin: 14px 0 0;
  font-size: 12px;
  line-height: 18px;
  color: var(--vp-c-text-2);
}

.pub-reset {
  margin-left: 8px;
  padding: 0;
  border: 0;
  background: transparent;
  font-family: inherit;
  font-size: 12px;
  color: var(--vp-c-brand-1);
  cursor: pointer;
}

.pub-reset:hover {
  text-decoration: underline;
}

/* Entries
   -------------------------------------------------------------------------- */

.pub-year {
  margin: 30px 0 0;
  padding: 0 0 6px;
  border-top: 0;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 13px;
  font-weight: 700;
  line-height: 20px;
  letter-spacing: 0.04em;
  color: var(--vp-c-text-2);
}

.pub {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  gap: 16px;
  padding: 16px 0;
}

.pub + .pub {
  border-top: 1px solid var(--vp-c-divider);
}

/* Fixed box, not an intrinsic one: every card reserves the same slot whether
   or not a figure exists, so the text column never shifts between rows. */
.pub-thumb {
  width: 120px;
  aspect-ratio: 3 / 2;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background-color: var(--vp-c-bg-soft);
}

.pub-thumb img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pub-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 6px;
}

.pub-title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  line-height: 22px;
  letter-spacing: normal;
  color: var(--vp-c-text-1);
}

.pub-title a {
  color: inherit;
  text-decoration: none;
  transition: color 0.25s;
}

.pub-title a:hover {
  color: var(--vp-c-brand-1);
}

.pub-authors,
.pub-venue {
  margin: 3px 0 0;
  font-size: 13px;
  line-height: 20px;
  color: var(--vp-c-text-2);
}

.pub-links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 7px 0 0;
  font-size: 12px;
  line-height: 18px;
}

.pub-links a,
.pub-links button {
  padding: 0;
  border: 0;
  background: transparent;
  font-family: inherit;
  font-size: 12px;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  cursor: pointer;
}

.pub-links a::before,
.pub-links button::before {
  content: '[';
}

.pub-links a::after,
.pub-links button::after {
  content: ']';
}

.pub-links a:hover,
.pub-links button:hover {
  text-decoration: underline;
}

.pub-abstract {
  margin: 8px 0 0;
  padding-left: 10px;
  border-left: 2px solid var(--vp-c-divider);
  font-size: 13px;
  line-height: 20px;
  color: var(--vp-c-text-2);
}

.pub-legend {
  margin: 28px 0 0;
  padding-top: 10px;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 11px;
  line-height: 16px;
  color: var(--vp-c-text-3);
}

/* Narrow screens: the controls stack, and the thumbnail shrinks rather than
   moving above the text, so the list keeps its scannable single-column rhythm */
@media (max-width: 639px) {
  .pub-controls {
    grid-template-columns: minmax(0, 1fr);
  }

  .pub {
    grid-template-columns: 84px minmax(0, 1fr);
    gap: 12px;
  }

  .pub-thumb {
    width: 84px;
  }
}
</style>
