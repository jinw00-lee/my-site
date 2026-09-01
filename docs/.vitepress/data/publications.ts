/**
 * Every entry on the Works page.
 *
 * This is the only file to touch when a paper is added, updated or retagged:
 * PublicationList.vue derives the year groups, the tag filter and the search
 * index from whatever is here, so nothing else has to be kept in sync.
 */

export interface Publication {
  /** Stable id. Used as a render key and as the thumbnail filename. */
  key: string
  title: string
  /** Rendered as written. Occurrences of the site owner's name are bolded. */
  authors: string
  /** Journal, conference or preprint server. Shown in italics. */
  venue: string
  /** Volume/issue/pages, if the paper has them yet. */
  detail?: string
  /** Drives both the sort and the year group headings. */
  year: number
  tags: string[]
  /**
   * Path under docs/public, e.g. '/works/lee2025awe.png'. Omit it and the card
   * draws an empty box of exactly the same size, so the column stays aligned
   * whether or not a paper has a figure yet.
   *
   * The slot is 120x80 CSS px (3:2) and the image is fitted with `contain`, so
   * nothing is ever cropped -- an off-ratio image is letterboxed instead.
   * Export at 3:2 to fill the slot edge to edge: 360x240 covers 3x displays.
   */
  thumb?: string
  /** Optional. The `abstract` toggle only appears when this is set. */
  abstract?: string
  /**
   * Only the keys present are rendered, always in the order listed here.
   * `paper` is the canonical published version (a DOI link, normally) and, like
   * `pdf`, also turns the title itself into a link.
   *
   * These keys are mirrored by LINK_LABELS in PublicationList.vue, which is
   * what maps each one to its bracketed label. A key that is not in that map is
   * silently dropped, so add it there first when introducing a new kind.
   */
  links?: {
    paper?: string
    pdf?: string
    code?: string
    osf?: string
    site?: string
  }
}

export const publications: Publication[] = [
  {
    key: 'lee2026cardiac',
    title:
      'Slower cardiac-coupled cortical dynamics link depressive symptoms to inflexible affective updating',
    authors: 'Lee, J.†, Oh, K., Kim, J., & Cha, J.†',
    venue: 'Under review',
    year: 2026,
    tags: ['affect', 'mental health', 'brain-body interaction', 'naturalistic', 'EEG', 'representation geometry'],
    thumb: '/works/lee2026cardiac.png',
    links: {
      paper: 'https://doi.org/10.64898/2026.08.11.744232'
    }
  },
  {
    key: 'pak2026adhd',
    title:
      'Individual differences in the intergenerational transmission of ADHD: the role of genetic and environmental factors',
    authors:
      'Pak, M., Lee, E., Kim, B., Kim, G., Lee, J., Joo, Y.Y., Posner, J., & Cha, J.†',
    venue: 'Under review',
    year: 2026,
    tags: ['mental health', 'big data', 'individual difference', 'gene-environment interaction'],
    thumb: '/works/pak2026adhd.png',
    links: {
      paper: 'https://doi.org/10.21203/rs.3.rs-7405635/v1'
    }
  },
  {
    key: 'lee2025awe',
    title:
      'Awe is characterized as an ambivalent affect in the human behavior and cortex',
    authors: 'Lee, J.†, Han, D.D., Oh, S., & Cha, J.†',
    venue: 'Communications Psychology',
    detail: '3(1), 123',
    year: 2025,
    tags: ['affect', 'aesthetics', 'naturalistic', 'EEG', 'representation geometry'],
    thumb: '/works/lee2025awe.png',
    links: {
      paper: 'https://doi.org/10.1038/s44271-025-00299-2',
      code: 'https://github.com/jinw00-lee/ambivalent-awe'
    }
  },
  {
    key: 'choi2025adhd',
    title:
      'Individual differences in effects of stressful life events on childhood ADHD: genetic, neural, and familial contributions',
    authors:
      'Choi, S.Y., Lee, J., Park, J., Lee, E., Kim, B., Kim, G., Joo, Y.Y., & Cha, J.†',
    venue: 'Journal of Child Psychology and Psychiatry',
    detail: '67(5), 788–800',
    year: 2025,
    thumb: '/works/choi2025adhd.png',
    tags: ['mental health', 'big data', 'individual difference', 'gene-environment interaction'],
    links: {
      paper: 'https://doi.org/10.1111/jcpp.70074'
    }
  },
  {
    key: 'kwon2025memory',
    title:
      'Revisiting your memory: reconstruction of affect-contextualized memory via EEG-guided audiovisual generation',
    authors:
      'Kwon, J.*, Wang, H.*, Lee, J.*, Kim, S.*, Yoo, S., Lin, Y.†, & Cha, J.†',
    venue:
      'ACM Multimedia 2025 Cognition-oriented Multimodal Affective and Empathetic Computing',
    year: 2025,
    tags: ['affect', 'memory', 'generative AI', 'EEG', 'aesthetics'],
    thumb: '/works/kwon2025memory.png',
    links: {
      paper: 'https://doi.org/10.1145/3746277.3760413'
    }
  },
  {
    key: 'lee2024fluency',
    title:
      'The twofold role of subjective fluency in displeasing but preferable visual artworks: self-report and eye-tracking analysis',
    authors: 'Lee, J.†, Choi, D., Eom, J., & Kang, M.',
    venue: 'Empirical Studies of the Arts',
    detail: '43(2), 801–826',
    year: 2024,
    tags: ['affect', 'aesthetics', 'eye tracking', 'individual difference'],
    thumb: '/works/lee2024fluency.png',
    links: {
      paper: 'https://doi.org/10.1177/02762374241288698'
    }
  },
  {
    key: 'lee2024covid',
    title:
      'Stress vulnerability and resilience in children facing COVID-19-related discrimination',
    authors: 'Lee, J., Lee, E., Kim, B., Kim, G., Joo, Y.Y., & Cha, J.†',
    venue: 'medRxiv',
    detail: 'unpublished manuscript',
    year: 2024,
    tags: ['affect', 'mental health', 'big data', 'individual difference', 'gene-environment interaction'],
    thumb: '/works/lee2024covid.png',
    links: {
      paper: 'https://doi.org/10.1101/2024.03.04.24303643'
    }
  }
]
