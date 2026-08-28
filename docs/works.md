<script setup>
// Imported here rather than registered globally in theme/index.ts: the list
// pulls in every publication record, and this is the only page that shows it,
// so a local import keeps that weight out of the other pages' bundles.
import PublicationList from './.vitepress/theme/components/PublicationList.vue'
</script>

# Works

Use the controls to sort or search the list, and click any tag to narrow it.
Selecting more than one tag shows only the papers carrying all of them.

<PublicationList />
