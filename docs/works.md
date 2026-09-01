<script setup>
// Imported here rather than registered globally in theme/index.ts: the list
// pulls in every publication record, and this is the only page that shows it,
// so a local import keeps that weight out of the other pages' bundles.
import PublicationList from './.vitepress/theme/components/PublicationList.vue'
</script>

The papers are sorted by year based on their first online publication date. Click a title to view the paper; †*corresponding author(s)*; **equal contribution*.

<PublicationList />
