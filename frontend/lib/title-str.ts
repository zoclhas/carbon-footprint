export function titleWord(str: string) {
  return str
    .split(" ")
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join(" ");
}
