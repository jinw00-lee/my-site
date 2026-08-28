<script setup>
import { computed, defineAsyncComponent, onMounted, onUnmounted, ref } from 'vue'
import { useData, useRoute } from 'vitepress'
import VPSocialLinks from 'vitepress/dist/client/theme-default/components/VPSocialLinks.vue'
import VPSwitchAppearance from 'vitepress/dist/client/theme-default/components/VPSwitchAppearance.vue'

// The search box ships its own engine (minisearch) and highlighter (mark.js),
// so load it lazily the first time the user actually opens it.
const VPLocalSearchBox = defineAsyncComponent(
  () => import('vitepress/dist/client/theme-default/components/VPLocalSearchBox.vue')
)

// themeConfig values come from .vitepress/config.mts
const { page, theme } = useData()
const route = useRoute()

const nav = computed(() => theme.value.nav ?? [])
const socialLinks = computed(() => theme.value.socialLinks ?? [])
const siteUpdated = computed(() => theme.value.siteUpdated ?? '')

// Treat '/works.html' and '/works' as the same address
function normalize(path) {
  const p = path.replace(/index\.html$/, '').replace(/\.html$/, '')
  return p.length > 1 ? p.replace(/\/$/, '') : p
}

function isActive(link) {
  return normalize(route.path) === normalize(link)
}

// Search
const showSearch = ref(false)

function onKeydown(e) {
  if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
    e.preventDefault()
    showSearch.value = true
  }
  if (e.key === 'Escape') {
    showSearch.value = false
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="site">
    <header class="rail">
      <nav>
        <ul>
          <li v-for="item in nav" :key="item.link">
            <a :href="item.link" :class="{ active: isActive(item.link) }">{{ item.text }}</a>
          </li>
          <li>
            <button type="button" @click="showSearch = true">Search</button>
          </li>
        </ul>
      </nav>

      <div class="rail-icons">
        <VPSocialLinks v-if="socialLinks.length" :links="socialLinks" />
        <VPSwitchAppearance />
      </div>

      <p v-if="siteUpdated" class="rail-updated">last update: {{ siteUpdated }}</p>
    </header>

    <main class="main">
      <div class="vp-doc">
        <!-- The default theme's Layout handled unknown URLs; ours has to do it -->
        <template v-if="page.isNotFound">
          <h2>Page not found</h2>
          <p>That address does not exist. <a href="/">Back to About</a></p>
        </template>
        <Content v-else />
      </div>
    </main>

    <!-- Renders itself into <body> via Teleport, so its position here is irrelevant -->
    <VPLocalSearchBox v-if="showSearch" @close="showSearch = false" />
  </div>
</template>

<style scoped>
.site {
  display: grid;
  grid-template-columns: 160px minmax(0, 688px);
  column-gap: 40px;
  justify-content: center;
  padding: 48px 24px 96px;
}

.rail {
  align-self: start;
  /* Optical nudge. The 15px nav text and the 24px page heading sit in line
     boxes of different heights, so aligning their containers still leaves the
     letters about 2px apart. Set to 0 if the nav ever matches the body size. */
  margin-top: -2px;
  padding-right: 24px;
  border-right: 1px solid var(--vp-c-divider);
}

.rail ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.rail a {
  display: block;
  padding: 3px 0;
  font-size: 15px;
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.25s;
}

.rail a:hover {
  color: var(--vp-c-brand-1);
}

.rail a.active {
  font-weight: 700;
}

/* Keep the `nav` part: without it this would also hit the dark mode toggle */
.rail nav button {
  display: block;
  margin: 0;
  padding: 3px 0;
  border: 0;
  background: transparent;
  font-family: inherit;
  font-size: 15px;
  line-height: inherit;
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: color 0.25s;
}

.rail nav button:hover {
  color: var(--vp-c-brand-1);
}

.rail-icons {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 10px;
}

.rail-updated {
  margin: 16px 0 0;
  font-size: 10px;
  line-height: 1.4;
  color: var(--vp-c-text-3);
}

/* Narrow screens: lay the rail down as a horizontal strip above the content */
@media (max-width: 767px) {
  .site {
    display: block;
    padding: 24px 20px 64px;
  }

  .rail {
    margin-bottom: 28px;
    padding-right: 0;
    padding-bottom: 12px;
    border-right: none;
    border-bottom: 1px solid var(--vp-c-divider);
  }

  .rail ul {
    display: flex;
    flex-wrap: wrap;
    column-gap: 20px;
  }

  .rail-icons {
    margin-top: 6px;
  }

  .rail-updated {
    margin-top: 10px;
  }
}
</style>