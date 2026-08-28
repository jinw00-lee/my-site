<script setup>
// VitePress resolves a named social icon against simple-icons, which only
// carries brand marks -- there is no generic "mail" there. So the envelope is
// passed in as a literal SVG instead. It is stroked rather than filled, and
// every child needs its own fill="none": the theme sets `fill: currentColor`
// on the <svg>, and children would otherwise inherit it and fill in solid.
const mailIcon = {
  svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" fill="none"/><path d="M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" fill="none"/></svg>'
}
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
-->

<div class="profile-links">
<a class="cv-link" href="/CV_Jinwoo-Lee.pdf" target="_blank" rel="noopener">CV</a>
<span class="profile-divider" aria-hidden="true"></span>
<SocialLinks :links="[
  { icon: mailIcon, link: 'mailto:jil527@ucsd.edu', ariaLabel: 'Email' },
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

I grew up in Incheon, South Korea, and received my B.A. in Psychology and Aesthetics and M.S. in Brain and Cognitive Sciences from Seoul National University. At the [SNU Connectome Lab](http://www.connectomelab.com/en/) (PI: Dr. Jiook Cha), I combined naturalistic neuroimaging with representational geometry and dynamics framework to study the neural basis of complex emotional experiences, including ambivalence ([Lee et al., 2025](https://doi.org/10.1038/s44271-025-00299-2)) and rigid affective updating in depression ([Lee et al., 2026](https://doi.org/10.64898/2026.08.11.744232)).