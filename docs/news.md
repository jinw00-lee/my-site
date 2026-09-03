<script setup>
// Imported here rather than registered globally in theme/index.ts, the same as
// on the About page, which shows a limited copy of this list. Works and Blog do
// not show it, and a local import keeps the posts out of their bundles.
import NewsList from './.vitepress/theme/components/NewsList.vue'
</script>

<NewsList />
