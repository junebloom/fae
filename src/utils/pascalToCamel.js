// Does not account for unicode identifiers, but what monster uses those?
const re = /^[A-Z](?:[A-Z](?![a-z]))*/
export default function pascalToCamel (string) {
  return string.replace(re, match => match.toLowerCase())
}
