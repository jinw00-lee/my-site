<script setup>
import { data as posts } from '../../data/posts.data.mts'
import { shortDate } from '../posts'
</script>

<template>
  <ul v-if="posts.length" class="post-list">
    <li v-for="p in posts" :key="p.url" class="post-row">
      <a class="post-link" :href="p.url">{{ p.title }}</a>
      <time class="post-date" :datetime="p.date">{{ shortDate(p.date) }}</time>
    </li>
  </ul>

  <p v-else class="post-empty">No posts yet.</p>
</template>

<style scoped>
/* Modelled on the Writing page of todd.gureckislab.org: one flat list, newest
   first, a title and a date and nothing else. No excerpts, tags, or year
   headings. The row rhythm matches the News list so the two pages feel like
   siblings.

   Everything here sits inside `.vp-doc`, whose rules for ul/li/a would
   otherwise apply (bullets, indentation, underlined links), so each is reset
   explicitly. Scoped class selectors outrank `.vp-doc ul` and friends. */

.post-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

/* Title left, date right, on a shared baseline. Same grid as the News rows. */
.post-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: baseline;
  gap: 12px;
  margin: 0;
  padding: 12px 0;
}

/* Restated because `.vp-doc li + li` adds 8px of margin between list items */
.post-row + .post-row {
  margin-top: 0;
  border-top: 1px solid var(--vp-c-divider);
}

.post-row:first-child {
  padding-top: 0;
}

/* Not bold and not underlined, like the News titles: the hover colour is what
   marks the line as a link. `.vp-doc a` would otherwise make it 500 weight,
   brand coloured and underlined. */
.post-link {
  font-size: 15px;
  font-weight: 400;
  line-height: 22px;
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.25s;
}

.post-link:hover {
  color: var(--vp-c-brand-1);
}

.post-date {
  font-size: 12px;
  line-height: 22px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  color: var(--vp-c-text-3);
}

.post-empty {
  margin: 0;
  font-size: 13px;
  color: var(--vp-c-text-3);
}

/* Narrow screens: the date drops below the title rather than squeezing it */
@media (max-width: 639px) {
  .post-row {
    grid-template-columns: minmax(0, 1fr);
    gap: 2px;
  }

  .post-date {
    line-height: 18px;
  }
}
</style>
