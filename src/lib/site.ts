export const BUSINESS = {
  name: "Woolen Decorations",
  phoneDisplay: "+91 878 828 6161",
  phoneTel: "+918788286161",
  whatsapp: "918788286161",
  address: "Ulape Mala, Kasaba Bawada, near the Rajaram Sugar Factory, Kolhapur, Maharashtra",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Ulape Mala, Kasaba Bawada, near the Rajaram Sugar Factory, Kolhapur, Maharashtra"),
};

export const CATEGORIES = [
  "Decoration Mat",
  "Rangoli Mat",
  "Pooja Mat",
  "Toran",
  "Door Hanging",
  "Custom Design",
];

export function whatsappLink(text: string) {
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(text)}`;
}
