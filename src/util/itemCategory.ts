export function getCategorySectionDisplayString(categorySection: string) {
  const categorySectionParts = (categorySection || '').split('-')
  categorySectionParts.shift()
  return categorySectionParts.map((part: string) => { return (part || '').trim() }).join(' - ')
}
