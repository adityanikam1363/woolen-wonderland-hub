export const BUSINESS = {
  name: "Woolen Decorations",
  phoneDisplay: "+91 878 828 6161",
  phoneTel: "+918788286161",
  whatsapp: "918788286161",
  address: "Main Road, Ulape Mala, Kasaba Bawada, Kolhapur, Maharashtra 416006",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Main Road, Ulape Mala, Kasaba Bawada, Kolhapur, Maharashtra 416006"),
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
