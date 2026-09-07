<script setup>
// The two corners at the bottom of this page. Imported here rather than
// registered globally in theme/index.ts so that the pages which do not show
// them do not carry the posts and papers in their bundles.
import NewsList from './.vitepress/theme/components/NewsList.vue'
import ResearchHighlight from './.vitepress/theme/components/ResearchHighlight.vue'
</script>

<div class="profile">
<img class="profile-photo" src="/pic.png" alt="Jinwoo Lee">
<div class="profile-body">

## Jinwoo Lee

Doctoral Student   
[SciMinds](https://www.sciminds.studio) (PI: Dr. Eshin Jolly)      
UC San Diego, Department of Psychology

---

**Research Interest**   
*Theories, Methods,* and *Applications* of affective/social neuroscience

<!--
  SOCIAL LINKS

  Nothing below may be separated by a blank line until the closing </div>. A
  blank line ends a raw HTML block in markdown, and the rest would be parsed as
  prose, leaving that </div> without an opening tag and failing the build.

  The envelope is a hand-written anchor rather than a <SocialLinks> entry.
  VPSocialLink puts target="_blank" on every link it renders, and on a mailto:
  that makes the browser open an empty tab first and only then hand the address
  to the mail client -- so the reader is left looking at a blank page. A
  same-tab link hands off to the mail client cleanly and leaves nothing behind.

  simple-icons, which VitePress resolves named icons against, carries only
  brand marks and has no generic envelope, so that SVG is written out inline.
  It is stroked rather than filled, and each child needs its own fill="none"
  so it draws as an outline instead of a solid block.
-->

<div class="profile-links">
<a class="cv-link" href="/CV_Jinwoo-Lee.pdf" target="_blank" rel="noopener">CV</a>
<span class="profile-divider" aria-hidden="true"></span>
<a class="mail-link" href="mailto:jil527@ucsd.edu" aria-label="Email"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" fill="none"/><path d="M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" fill="none"/></svg></a>
<SocialLinks :links="[
  { icon: 'github', link: 'https://github.com/jinw00-lee', ariaLabel: 'GitHub' },
  { icon: 'googlescholar', link: 'https://scholar.google.com/citations?hl=ko&user=Yqz7ozoAAAAJ&view_op=list_works', ariaLabel: 'Google Scholar' },
  { icon: 'orcid', link: 'https://orcid.org/0009-0005-3811-0015', ariaLabel: 'ORCID' },
  { icon: 'bluesky', link: 'https://bsky.app/profile/aesciemo.bsky.social', ariaLabel: 'Bluesky' },
  { icon: 'linkedin', link: 'https://www.linkedin.com/in/jinwoo-lee-017712178/', ariaLabel: 'LinkedIn' },
  { icon: 'x', link: 'https://x.com/aesciemo', ariaLabel: 'X' }
]" />
</div>
</div>
</div>

<!--
  BIOGRAPHY
-->

### Biography
I am the 2nd-year PhD student in [UCSD SciMinds](https://www.sciminds.studio) (PI: Dr. Eshin Jolly). I study the **paradoxical nature of human emotion**: its idiosyncrasy and commonality. Specifically, I investigate (1) which and how psychological profiles shape individual differences in emotion-related neural representations and subjective feelings, and (2) how people nevertheless come to share and align emotions. To this end, I am also developing new computational tools. Ultimately, I aim to explore implications of affective science across related fields such as mental health, aesthetics, and social robotics.

I grew up in South Korea, and received my B.A. in Psychology and Aesthetics and M.S. in Brain and Cognitive Sciences from [SNU Connectome Lab](https://www.connectomelab.com/en/) (PI: Dr. Jiook Cha), Seoul National University. 

<!--
  NEWS
  The five most recent posts from .vitepress/data/news.ts. Nothing to keep in
  sync here -- add a post there and it appears in both places.
-->

### News

<NewsList :limit="5" />

<!--
  RESEARCH HIGHLIGHT
  Hand-picked from .vitepress/data/publications.ts by key, shown in the order
  listed here. Swap a key to feature a different paper; the card itself is
  built from whatever that entry already says on the Works page.
-->

### Research Highlight

During my master's studies, I investigated how subjective feelings in daily life intertwine over time and shift across contexts, as well as what these complex dynamics reveal about an individual's traits and resultant emotional experience. To this end, I combined naturalistic neuroimaging with computational approaches (e.g., representational geometry and dynamics, predictive modeling). Stay tuned for my upcoming PhD work!

<ResearchHighlight :keys="['lee2026cardiac', 'lee2025awe']" />