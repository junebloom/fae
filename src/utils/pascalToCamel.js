const re = /^[A-Z](?:[A-Z](?![a-z]))*/

// Return a camelCase version of a PascalCase identifier
export default function pascalToCamel (string) {
  return string.replace(re, match => match.toLowerCase())
}
