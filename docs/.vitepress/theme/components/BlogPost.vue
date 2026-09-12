<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import { longDate } from '../posts'

// Wraps the rendered markdown of a post (passed in as the slot by Layout.vue)
// with the parts every post shares, so a post file holds only its front matter
// and its prose. Modelled on a post page of todd.gureckislab.org:
//
//   title
//   author · date · N minutes to read
//   ...body, footnotes...
//   date · #tags                                [discuss]
//
// `date` and `readingTime` arrive already normalised: transformPageData in
// config.mts rewrites them before the page reaches the browser.

const { frontmatter, site } = useData()

const tags = computed(() => frontmatter.value.tags ?? [])
const minutes = computed(() => frontmatter.value.readingTime ?? 0)
const date = computed(() => frontmatter.value.date ?? '')
</script>

<template>
  <article class="post">
    <header class="post-header">
      <h1 class="post-title">{{ frontmatter.title }}</h1>

      <p class="post-byline">
        <a class="post-author" href="/">{{ site.title }}</a>
        <template v-if="date">
          <span class="post-sep" aria-hidden="true">·</span>
          <time :datetime="date">{{ longDate(date) }}</time>
        </template>
        <template v-if="minutes">
          <span class="post-sep" aria-hidden="true">·</span>
          <span>{{ minutes }} {{ minutes === 1 ? 'minute' : 'minutes' }} to read</span>
        </template>
      </p>
    </header>

    <!-- Styled from theme/style.css, not from this file: slotted markdown
         carries the parent's scope id, so scoped rules here cannot reach it -->
    <div class="post-body">
      <slot />
    </div>

    <footer class="post-footer">
      <p class="post-meta">
        <time v-if="date" :datetime="date">{{ longDate(date) }}</time>
        <template v-if="tags.length">
          <span v-if="date" class="post-sep" aria-hidden="true">·</span>
          <span v-for="t in tags" :key="t" class="post-tag">#{{ t }}</span>
        </template>
      </p>

      <!-- Optional. Comments live off-site, e.g. under a Bluesky post announcing
           this one, the same way the reference site handles discussion. -->
      <a
        v-if="frontmatter.discuss"
        class="post-discuss no-icon"
        :href="frontmatter.discuss"
        target="_blank"
        rel="noopener"
        >discuss</a
      >
    </footer>
  </article>
</template>

<style scoped>
/* Everything here sits inside `.vp-doc`, whose own rules for h1/p/a would
   otherwise apply. Scoped class selectors outrank `.vp-doc h1` and friends, so
   each element is styled explicitly. */

.post-header {
  margin-bottom: 28px;
}

/* 24px, not the theme's 28px for an h1: the same size as the name heading on
   the About page, which the nav rail's optical alignment was tuned against */
.post-title {
  margin: 0;
  font-size: 24px;
  line-height: 32px;
}

/* Quiet metadata: small, grey, regular weight. Only the author name, which is
   a link, gets a colour change, and only on hover. */
.post-byline {
  margin: 6px 0 0;
  font-size: 13px;
  line-height: 20px;
  color: var(--vp-c-text-3);
}

.post-author {
  font-weight: 400;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.25s;
}

.post-author:hover {
  color: var(--vp-c-brand-1);
}

.post-sep {
  margin: 0 6px;
}

/* Same closing shape as `.more-link` and the News pager: a divider, then a
   small line of text */
.post-footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
  gap: 4px 12px;
  margin-top: 40px;
  padding-top: 14px;
  border-top: 1px solid var(--vp-c-divider);
}

/* A wrapping flex row, so a narrow screen can only break the line between the
   date, the separator and each tag. As plain inline text the tags have no
   spaces between them and form one unbreakable run, which pushed the break
   into the middle of the date instead ("September 12," / "2026"). */
.post-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  /* Spacing as a gap rather than margins on the items, so a tag that wraps
     onto a new line starts flush left instead of 8px in */
  column-gap: 8px;
  margin: 0;
  font-size: 12px;
  line-height: 18px;
  color: var(--vp-c-text-3);
}

/* Plain `#tag` text, as on the News list: a label, not a filter button. The
   footer row spaces its items with `column-gap`, so the separator drops the
   margins it keeps in the byline, which is ordinary inline text. */
.post-meta .post-sep {
  margin: 0;
}

/* The bracketed link style used by the News and Works lists. `no-icon` on the
   anchor stops the theme drawing its external-link arrow over the `]`. */
.post-discuss {
  font-size: 12px;
  line-height: 18px;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.post-discuss::before {
  content: '[';
}

.post-discuss::after {
  content: ']';
}

.post-discuss:hover {
  text-decoration: underline;
}
</style>
