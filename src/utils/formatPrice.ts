export default function formatPrice(number: bigint) {
  return new Intl.NumberFormat("ir-IR", {
    style: "currency",
    currency: "RIs",
  })
    .format(number)
    .replace("RIS", "");
}
