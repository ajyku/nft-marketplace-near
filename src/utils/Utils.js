export const displayHash = (hash) => {
  if(!hash) return null
  const _hash = `${hash.substring(0,6)}...${hash.slice(-4)}`
  return _hash
}

export function truncateString(str, n) {
  if(!str) return null
  if (str.length > n) {
    return str.substring(0, n) + "...";
  } else {
    return str;
  }
}