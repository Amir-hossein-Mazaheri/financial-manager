export default function formatPrice(number: number) {
  return new Intl.NumberFormat("ir-IR", {
    style: "currency",
    currency: "RIs",
  })
    .format(number)
    .replace("RIS", "");
}
