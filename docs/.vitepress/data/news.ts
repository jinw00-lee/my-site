/**
 * Every entry on the News page.
 *
 * This is the only file to touch when a post is added or edited: NewsList.vue
 * derives the ordering and the rendering from whatever is here.
 */

export interface NewsItem {
  /** Stable id. Used as a render key and to address the collapsible panel. */
  key: string
  /**
   * ISO `YYYY-MM-DD`. Sorted on as a plain string, which is exactly right for
   * this format. Only the `YYYY-MM` part is shown; the day is here because it
   * decides the order of two posts within the same month, so write the real one
   * even though it never appears. `YYYY-MM` alone also sorts and renders, if a
   * post has no particular day.
   */
  date: string
  /**
   * The clickable line. Clicking it opens the body below.
   *
   * Takes the same `**bold**` and `*italic*` as `body`, but not `[text](url)`:
   * the whole line is already a button, so a link inside it would be a second
   * thing for one click to do. A link written here stays literal.
   */
  title: string
  tags: string[]
  /**
   * The short body revealed by the toggle. A blank line starts a new paragraph;
   * single newlines are just wrapping and are ignored, so a sentence can be
   * broken across source lines wherever it reads best.
   *
   * A small subset of markdown works inside it, and in `title` -- only this:
   *
   *   **bold**        ->  bold
   *   *italic*        ->  italic
   *   [text](url)     ->  a link, opened in a new tab
   *
   * The marks may span a source line break. They do not nest, though: write
   * `**bold** and *italic*`, not `**bold with *italic* inside**`. Anything
   * else -- headings, lists, images, code -- renders as the literal characters
   * you typed. See inlineParts() in theme/components/NewsList.vue.
   */
  body: string
  /** Optional. Rendered as a bracketed row at the end of the open body. */
  links?: { label: string; url: string }[]
}

export const news: NewsItem[] = [
  {
    key: '2026-HumanLabTalk',
    date: '2026-07-01',
    title: 'Invited for a Research Talk in SKKU Human Affective Neuroscience Lab',
    tags: ['talk'],
    body: `I gave a research talk at Sungkyunkwan University’s [Human Affective Neuroscience Lab (PI: Dr. Justin Minue Kim)](https://www.affectiveneurosciencelab.com/). 
      I presented my first PhD project, **Differentiable Intersample Modeling (DIM)**, discussing how it complements the Anna Karenina (AnnaK) framework 
      widely used in social and affective neuroscience. Specifically, using the lab's dataset [(Kim & Kim, 2022 PNAS)](https://www.pnas.org/doi/10.1073/pnas.2205162119), 
      we explored how the representational geometry of affective traits can align with that of emotional processing neural circuit morphologies.`
  },
  
  {
    key: '2026-SANSAward',
    date: '2026-04-01',
    title: 'Giving an Oral Presentation at *SANS2026* and Winning a Travel Award',
    tags: ['conference', 'talk', 'prize'],
    body: `I’m excited to share that my first PhD project, **Differentiable Intersample Modeling (DIM)**, 
      has been selected for a Trainee Blitz Talk at [SANS2026](https://socialaffectiveneuro.org/conference/), 
      and I’ve also received a Travel Award! **DIM** is a new toolkit that expands RSA 
      (representational similarity analysis), enabling a flexible learning of intersample geometry
      so that the resultant representation can be maximally aligned to the target representation.
      
      I’d love to connect and chat at SANS2026! Feel free to reach out. See you in San Diego!`
  },
  {
    key: '2026-GuestLecture',
    date: '2026-03-01',
    title: 'Giving a Guest Lecture for UCSD Psych *Social Cognition* Class',
    tags: ['talk'],
    body: `In the previous quarter, I worked as a TA for PSYC137: Social Cognition (taught by [Dr. Piotr Winkielman](https://pages.ucsd.edu/~pwinkiel/)), 
      where I also had the chance to give a guest lecture to about 200 undergrad students. In the lecture, I introduced the ongoing debates 
      in psychology around mixed emotions and shared some critical perspectives on why mixed emotions haven’t been widely studied 
      as a distinct affective experience in experimental psychology so far.`
  },
  {
    key: '2025-ADHDPaper',
    date: '2025-11-01',
    title: 'A New Paper about Childhood Stress and ADHD Published at *Journal of Child Psychology and Psychiatry*',
    tags: ['publication'],
    body: `I have explored some tools that can better analyze individual differences and their underlying factors. About four years ago, 
      I began studying the principles and applications of **causal machine learning**, exploring its potential to address these questions. 
      As part of this effort, I contributed as the second author to this new paper, [Individual differences in effects of stressful life events on childhood ADHD: genetic, neural, and familial contributions](https://acamh.onlinelibrary.wiley.com/doi/10.1111/jcpp.70074).
      
      Through this work, we were able not only to predict *‘individualized'* exposure effects of early-life stress on children’s ADHD symptoms 
      but also to identify key moderators such as parental psychiatric history, the child’s genetic vulnerability, and white matter connectivity 
      within cognitive control networks. These findings allowed us to discuss the possibility of early identification and prevention among vulnerable groups. 
      I believe that psychological/psychiatric works could move from an average treatment–effect paradigm toward a more **individual-centered** framework.`
  },
  {
    key: '2025-UCSDStart',
    date: '2025-09-01',
    title: 'Starting a PhD in Experimental Psychology at UC San Diego',
    tags: ['degree'],
    body: `I’m excited to announce that I start my PhD in [UCSD Psychology](https://psychology.ucsd.edu/)! Since UCSD Psych has long been my dream program because of 
      its research-intensive and interdisciplinary environment, I’m deeply thrilled to have the opportunity to pursue my PhD at this institution.
      
      I will pursue my PhD under the supervision of [Dr. Eshin Jolly](https://sciminds.studio/), whose research focuses on identifying neural representations of social relationships 
      and affective experiences. He explores how these representations function in naturalistic settings through the development and application of 
      innovative tools, which is highly aligned to my theoretical and methodological interests. I hope to make powerful synergy through productive 
      collaboration!`
  },
  {
    key: '2025-RYMPaper',
    date: '2025-08-02',
    title: 'Our Project in the SNU AI×Art Hackathon Presented as an Oral Track in *ACM Multimedia Workshop*',
    tags: ['publication', 'conference'],
    body: `My co-first-authored paper, [Revisiting Your Memory: Reconstruction of Affect-Contextualized Memory via EEG-guided Audiovisual Generation](https://dl.acm.org/doi/10.1145/3746277.3760413), 
      has been officially published as a proceeding in *ACM Multimedia Workshop on Cognition-oriented Multimodal Affective and Empathetic Computing (CogMAEC)*.
      This work originated from my AI × Art Hackathon 2024 project. In this work, my colleagues and I combined EEG-based affect decoding and multi-modal 
      generative AI to reconstruct music videos that depict individuals’ affect-charged autobiographical memory. Through a two-stage user study, 
      we found that the generated videos effectively captured and represented the affective dynamics felt during memory recall. 
      This work was also highlighted in [a blog post](https://www.linkedin.com/posts/neuroelectrics-barcelona-s-l-_eeg-enobio-ai-activity-7301149196890349570-Z4SD/?utm_source=share&utm_medium=member_desktop&rcm=ACoAACobspMBfniRcw4kEoU9Sex3d1ChhAEn8Rg) 
      from Neuroelectrics, whose EEG recording device was utilized in this project.`
  },
  {
    key: '2025-CCN',
    date: '2025-08-01',
    title: 'Giving a Poster Presentation at *CCN2025*',
    tags: ['conference'],
    body: `I presented a poster of one of my post-master’s projects, [Trait depression predicts negatively biased encoding and 
      retrieval of ambivalent movie](https://2025.ccneuro.org/abstract_pdf/Lee_2025_Trait_depression_predicts_negatively_biased_encoding.pdf), 
      at *CCN2025* in Amsterdam, Netherlands. This project elucidates how trait depression is 
      associated with negatively biased encoding and recall of emotionally mixed movie scenes at neurophysiological and verbal 
      levels. Engaging in discussions with researchers from around the world was a wonderful opportunity to refine the conceptual 
      model of this study. My wife, [Janice Min](https://sites.google.com/view/janicemin/), also successfully presented her international 
      collaboration project.
      
      In addition, we took the chance to this travel to Portugal for our honeymoon, where we savored delicious nata, 
      enjoyed Porto wine, and soaked up the refreshing sea breeze everyday!`
  },
  {
    key: '2025-AwePaper',
    date: '2025-07-01',
    title: 'My MS thesis about Awe Published at *Communications Psychology*',
    tags: ['publication'],
    body: `My MS thesis, [Awe is characterized as an ambivalent affect in the human behavior and cortex](https://www.nature.com/articles/s44271-025-00299-2), 
      is finally published at *Communications Psychology*. Although awe has been described in philosophy as a distinct ambivalent experience, 
      modern affective science has struggled to examine whether this ambivalence can be distinguished from simply pleasing or displeasing states 
      (or their fluctuations). Combining VR, EEG, continuous affect rating, and deep representational learning/alignment, 
      we show that subjective awe intensity across diverse scenarios is better predicted by behaviors and distinct neurogeometry 
      associated with ambivalent feelings than by those linked solely to positive or negative affect. I hope my work serves as a 
      case that the complex structure of emotions we experience in daily life can be explored within a scientific framework.
      
      This project was made possible through an interdisciplinary approach. I am grateful to professional filmmaker Seung Yeop Oh 
      for collaborating on the design of VR stimuli, to AI expert Danny Dongyeop Han for planning the analytical framework together, 
      and to my advisor Dr. Jiook Cha, whose expertise bridges psychology, neuroscience, and AI.`
  },
  {
    key: '2024-KHBM',
    date: '2024-11-01',
    title: 'Winning a Best Oral Presenter Award in *KHBM2024*',
    tags: ['conference', 'prize'],
    body: `I presented my master’s thesis, *Awe is characterized as an ambivalent 
      experience in the human behavior and cortex*, at the [Korean Human Brain Mapping (KHBM)](https://www.khbm.org/html/?pmode=english)
      2024 conference and was honored to receive the Best Oral Presenter Award! This experience 
      reaffirmed the recognition of complex emotions like awe as a significant topic in affective neuroscience. 
      I was especially pleased to discuss and refine the rationale behind my focus on using naturalistic 
      paradigms, real-time affect rating, and deep representational learning for systematic study.
      
      Above all, my wife, [Janice Min](https://sites.google.com/view/janicemin/), also received the Best Poster Award 
      for her master’s on-going research. Sharing such a moment of pride with her made it all the more special :)`
  },
  {
    key: '2024-FluencyPaper',
    date: '2024-10-02',
    title: 'My BA thesis about Preference for Displeasing Art Published at *Empirical Studies of the Arts*',
    tags: ['publication'],
    body: `My first paper, [The twofold role of subjective fluency in displeasing but preferable visual artworks: 
      self-report and eye-tracking analysis](https://doi.org/10.1177/02762374241288698), in collaboration with aesthetics researchers from my undergraduate days, 
      is finally published at *Empirical Studies of the Arts*!
      
      We tackled the “paradox of horror,” a philosophical question since 17C, through a lens of cognitive science. 
      Most people hate unpleasant art, but some love it. Why? We tested how art knowledge shapes this difference. 
      Cogsci has claimed that fluency amplifies the valence effect on preference, while art appreciation models argue that 
      art knowledge (expected to shape fluency) reduces its impact. We were motivated to revolve these conflicting findings.
      
      Publishing my first paper has been a rewarding experience, especially in engaging with philosophers to explore how empirical methods 
      can tackle philosophical questions. Special thanks to [Dr. Mijung Kang](https://scholar.google.co.kr/citations?user=WIAVtIIAAAAJ&hl=ko&oi=ao) 
      from SNU Aesthetics for her invaluable support in this collaboration!`
  },
  {
    key: '2024-AIArtHackathon',
    date: '2024-10-01',
    title: 'Winning a Grand Prize at the SNU AI×Art Hackathon',
    tags: ['art','prize'],
    body: `My colleagues and I were awarded the grand prize at the 2024 AI×Art Hackathon at 
      Seoul National University! The event focused on exploring the aesthetic and ethical implications 
      of creative activities using generative AI, as well as contemplating future directions in this 
      field. We proposed a framework that records EEG data while individuals recall cherished memories and 
      emotions they wish to express as art. This data, along with accompanying writings, sketches, and 
      music, is processed by generative AI to create a short music video, blending personal experiences 
      with generated audiovisuals.
      
      Although this is a protocol developed during a brief 9-hour hackathon and still has room for improvement, 
      we plan to update it extensively over the next three weeks. We aim to create an interactive booth where attendees 
      can experience it firsthand at the [Art Diffusion 2024](https://www.tap.or.kr/en/home) event, which will be 
      held at the Seoul National University Museum of Art on October 30th. We appreciate your interest and support!
      
      Thanks for my colleagues, [Joonwoo](https://kwonjoon.info/), 
      [Sooyoung](https://sooyoungkim451.github.io/), Heehwan, and our supervisor, [Dr. Jiook Cha](https://www.connectomelab.com/en/)!`
  },
  {
    key: '2024-MSDegree',
    date: '2024-08-01',
    title: 'Earning a MS Degree in Brain & Cognitive Science at SNU',
    tags: ['degree'],
    body: `After completing a two-year master's program, I earned 
      a MS degree in Brain and Cognitive Science at Seoul National University. 
      For my thesis, I explored the ambivalent nature of awe—traditionally studied as either positive or negative 
      emotion in affective science—by investigating it at both behavioral and neurophysiological 
      levels. Throughout this process, I gained extensive experience in conducting literature reviews, 
      experimental design, VR stimuli design, data collection, EEG preprocessing, statistical analysis, and 
      even deep learning-based representational geometry analysis. 
      
      As I prepare for my Ph.D. studies, 
      I will continue working in the [SNU Connectome lab](https://www.connectomelab.com/en/) as a post-master's 
      researcher, focusing on a new project that examines the relationship between affect dynamics and depression.`
  },
  {
    key: '2024-OHBM',
    date: '2024-06-01',
    title: 'Presenting a Poster of my MS Thesis at *OHBM2024*',
    tags: ['conference'],
    body: `I presented my master’s thesis, *Awe is characterized as an ambivalent 
      experience in the human behavior and cortex*, as a poster at *OHBM2024*. I was 
      delighted to engage in in-depth discussions on topics I hadn’t previously 
      considered, such as cultural differences in experiencing ambivalent emotions 
      and the implications of awe for mental health.`
  }
]
