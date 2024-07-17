export function sortBy(objectA: any, objectB: any, key: string) {
  const a = objectA[key] ?? -1
  const b = objectB[key] ?? -1

  if (a < b) return -1
  if (a > b) return 1
  return 0
}

export function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
