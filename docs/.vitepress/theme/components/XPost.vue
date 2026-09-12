<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useData } from 'vitepress'

/**
 * An embedded post from X (Twitter), video included, for use in markdown:
 *
 *   <XPost url="https://x.com/alright_mark/status/2098085928489177142" />
 *
 * Uses X's own embed script rather than copying the video onto this site, so
 * the post plays, credits and links back exactly as its author published it,
 * and disappears from here if they delete it.
 *
 * Until the embed has rendered, and permanently if it never does (a content
 * blocker, X being down, a deleted post), a plain link to the post is shown in
 * its place. That is also what is in the static HTML, for readers without JS.
 */

const props = defineProps({
  /** The address as copied from x.com or twitter.com; `?s=20` and the like are fine */
  url: { type: String, required: true }
})

const { isDark } = useData()

// The numeric id is all the embed needs
const id = computed(() => props.url.match(/status(?:es)?\/(\d+)/)?.[1] ?? '')

const slot = ref(null)
const state = ref('loading') // 'loading' | 'ready' | 'failed'

// Each render gets a number, so a render that finishes after a newer one has
// started (the theme toggled twice in quick succession) can tell it is stale
let latest = 0
let alive = true

async function render() {
  const run = ++latest

  if (!id.value) {
    state.value = 'failed'
    return
  }

  try {
    const twttr = await loadWidgets()
    if (!alive || run !== latest || !slot.value) return

    slot.value.replaceChildren()
    const el = await twttr.widgets.createTweet(id.value, slot.value, {
      theme: isDark.value ? 'dark' : 'light',
      align: 'center',
      // No reply thread above the post, just the post itself
      conversation: 'none',
      // Asks X not to use the embed to personalise suggestions for readers
      dnt: true
    })

    if (run !== latest) {
      el?.remove()
      return
    }
    if (alive) state.value = el ? 'ready' : 'failed'
  } catch {
    if (alive && run === latest) state.value = 'failed'
  }
}

onMounted(render)
onBeforeUnmount(() => {
  alive = false
})

// The embed is an iframe drawn by X, so the site's own dark palette cannot
// reach inside it. Switching the theme redraws it in the matching one.
watch(isDark, () => {
  if (state.value === 'failed') return
  state.value = 'loading'
  render()
})
</script>

<script>
// Module scope, shared by every <XPost> on a page and across page changes, so
// X's script is fetched at most once per visit, and only on pages that embed.
let widgets = null

function loadWidgets() {
  if (window.twttr?.widgets) return Promise.resolve(window.twttr)

  if (!widgets) {
    widgets = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://platform.twitter.com/widgets.js'
      script.async = true
      script.onload = () =>
        window.twttr?.ready ? window.twttr.ready(resolve) : reject(new Error('widgets.js did not define twttr'))
      script.onerror = () => {
        // Forget the failure so a later page can try again, e.g. after the
        // reader turns their content blocker off
        widgets = null
        script.remove()
        reject(new Error('widgets.js failed to load'))
      }
      document.head.append(script)
    })
  }

  return widgets
}
</script>

<template>
  <figure class="x-post">
    <div ref="slot" class="x-post-slot"></div>

    <p v-if="state !== 'ready'" class="x-post-fallback">
      <a class="no-icon" :href="url" target="_blank" rel="noopener">View this post on X</a>
    </p>
  </figure>
</template>

<style scoped>
/* Everything here sits inside `.vp-doc`, whose rules for p and a would
   otherwise apply. Scoped class selectors outrank `.vp-doc p` and friends. */

/* The same breathing room as a display equation. X's embed sizes itself, up to
   550px wide, and adds 10px above and below of its own. */
.x-post {
  margin: 24px 0;
}

/* Collapses before the embed arrives, and for good if it never does, so the
   fallback link is not pushed down by an empty box */
.x-post-slot:empty {
  display: none;
}

/* The bracketed link style of the News and Works lists. `no-icon` on the
   anchor stops the theme drawing its external-link arrow over the `]`. */
.x-post-fallback {
  margin: 0;
  font-size: 13px;
  line-height: 20px;
  text-align: center;
}

.x-post-fallback a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.x-post-fallback a::before {
  content: '[';
}

.x-post-fallback a::after {
  content: ']';
}

.x-post-fallback a:hover {
  text-decoration: underline;
}
</style>
