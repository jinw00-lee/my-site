/**
 * Splits an author string so the site owner's name can be bolded without
 * handing raw HTML to `v-html`. Trailing daggers and asterisks are part of the
 * match, so those marks stay attached to the bolded name.
 *
 * Shared by the Works list and the Research Highlight on the About page: the
 * owner's name is marked the same way wherever a paper is shown, and the
 * pattern that recognises it lives in exactly one place.
 */
export function authorParts(authors: string) {
  // Built per call rather than hoisted to module scope. It is a /g regex, so a
  // shared instance would carry `lastIndex` from the previous author string
  // into the next one and start matching partway through.
  const me = /Lee, J\.[†*]*/g

  const parts: { text: string; me: boolean }[] = []
  let last = 0
  let m

  while ((m = me.exec(authors)) !== null) {
    if (m.index > last) parts.push({ text: authors.slice(last, m.index), me: false })
    parts.push({ text: m[0], me: true })
    last = m.index + m[0].length
  }

  if (last < authors.length) parts.push({ text: authors.slice(last), me: false })
  return parts
}
