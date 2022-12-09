export function humanize(number) {
  return new Intl.NumberFormat().format(number);
}
