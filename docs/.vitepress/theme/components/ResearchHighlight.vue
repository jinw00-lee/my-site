<script setup>
import { computed } from 'vue'
import { publications } from '../../data/publications'
import { authorParts } from '../authors'

const props = defineProps({
  /** Publication keys from data/publications.ts, in the order to show them. */
  keys: { type: Array, required: true }
})

// Ordered by the prop, not by publications.ts: this is a hand-picked selection,
// so the page decides which paper leads rather than the year sort.
const papers = computed(() =>
  props.keys
    .map((k) => {
      const p = publications.find((x) => x.key === k)
      // A key that no longer matches -- a paper renamed or removed in
      // publications.ts -- would otherwise just make the card silently vanish
      // from a page nobody is currently editing.
      if (!p) console.warn(`[ResearchHighlight] no publication with key "${k}"`)
      return p
    })
    .filter(Boolean)
)

// `paper` is the canonical published version, `pdf` the fallback. Same order as
// the Works list uses when it decides whether a title is a link.
function paperLink(p) {
  return p.links?.paper || p.links?.pdf
}
</script>

<template>
  <div class="highlight">
    <article v-for="p in papers" :key="p.key" class="hl">
      <div class="hl-thumb">
        <img v-if="p.thumb" :src="p.thumb" alt="" loading="lazy" />
        <span v-else aria-hidden="true"></span>
      </div>

      <div class="hl-body">
        <h4 class="hl-title">
          <a
            v-if="paperLink(p)"
            class="no-icon"
            :href="paperLink(p)"
            target="_blank"
            rel="noopener"
            >{{ p.title }}</a
          >
          <template v-else>{{ p.title }}</template>
        </h4>

        <p class="hl-authors">
          <template v-for="(part, i) in authorParts(p.authors)" :key="i"
            ><strong v-if="part.me">{{ part.text }}</strong
            ><template v-else>{{ part.text }}</template></template
          >
        </p>

        <p class="hl-venue">
          <em>{{ p.venue }}</em
          ><template v-if="p.detail">, {{ p.detail }}</template> ({{ p.year }})
        </p>
      </div>
    </article>

    <!-- `/works` without the extension, matching how themeConfig.nav writes it -->
    <p class="more-link"><a href="/works">All works &rarr;</a></p>
  </div>
</template>

<style scoped>
/* Everything here sits inside `.vp-doc`, whose own rules for h4/p/a/em would
   otherwise apply, so each element is styled explicitly.

   This is a summary, not a copy of the Works card. It drops the tag chips --
   on Works those are filter buttons, and there is nothing to filter here -- and
   the abstract toggle, keeping only what identifies a paper at a glance. What
   it does keep from PublicationList is the 120px 3:2 thumbnail slot, so a
   figure is framed identically on both pages. */

.highlight {
  margin-top: 10px;
}

.hl {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  gap: 16px;
  padding: 14px 0;
}

.hl + .hl {
  border-top: 1px solid var(--vp-c-divider);
}

/* Fixed box, not an intrinsic one: every card reserves the same slot whether or
   not a figure exists, so the text column never shifts between rows. */
.hl-thumb {
  width: 120px;
  aspect-ratio: 3 / 2;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background-color: var(--vp-c-bg-soft);
}

/* `contain`, not `cover`: a figure is information, so it is letterboxed inside
   the fixed box rather than having its edges cut off to fill it. */
.hl-thumb img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Not bold, unlike the same title on the Works page. On About it sits directly
   below the News list, and matching that weight keeps the two sections reading
   as one page rather than two pasted-together lists. */
.hl-title {
  margin: 0;
  font-size: 15px;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: normal;
  color: var(--vp-c-text-1);
}

/* `font-weight` has to be restated: the theme's `.vp-doc a` sets 500 on the
   anchor itself, which beats the 400 inherited from the heading. Without this,
   a linked title would be heavier than an unlinked one. */
.hl-title a {
  font-weight: inherit;
  color: inherit;
  text-decoration: none;
  transition: color 0.25s;
}

.hl-title a:hover {
  color: var(--vp-c-brand-1);
}

.hl-authors,
.hl-venue {
  margin: 3px 0 0;
  font-size: 13px;
  line-height: 20px;
  color: var(--vp-c-text-2);
}

/* Narrow screens: the thumbnail shrinks rather than moving above the text, so
   the list keeps its scannable single-column rhythm. Same as the Works list. */
@media (max-width: 639px) {
  .hl {
    grid-template-columns: 84px minmax(0, 1fr);
    gap: 12px;
  }

  .hl-thumb {
    width: 84px;
  }
}
</style>
