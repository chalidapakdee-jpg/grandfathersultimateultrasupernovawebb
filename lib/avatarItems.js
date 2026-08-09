// Catalog for the Profile avatar builder (Duolingo-style). Index 0 in
// every category is the free starter option; the rest cost points and
// must be bought once before they can be equipped.
const PRICE_LADDER = [0, 500, 1200, 2200];

export const AVATAR_CATEGORIES = [
  {
    key: "skin",
    label: "ร่างกาย",
    options: [
      { name: "อ่อน", color: "#EFC8A0" },
      { name: "แทน", color: "#D9A06B" },
      { name: "เข้ม", color: "#9C6B44" },
      { name: "มัทฉะ", color: "#8FA876" },
    ],
  },
  {
    key: "hair",
    label: "ทรงผม",
    options: [
      { name: "ศีรษะล้าน", color: "transparent" },
      { name: "ผมสั้นเทา", color: "#B9B4A8" },
      { name: "ผมสั้นดำ", color: "#3A3229" },
      { name: "มวยผม", color: "#6B5B4A" },
    ],
  },
  {
    key: "face",
    label: "สีหน้า",
    options: [
      { name: "ยิ้ม", color: "#2E2A22" },
      { name: "อารมณ์ดี", color: "#2E2A22" },
      { name: "ขยิบตา", color: "#2E2A22" },
      { name: "แว่นตา", color: "#2E2A22" },
    ],
  },
  {
    key: "outfit",
    label: "ชุด",
    options: [
      { name: "เสื้อมัทฉะ", color: "#8FA876" },
      { name: "เสื้อมัสตาร์ด", color: "#E8D9A0" },
      { name: "เสื้ออาซึกิ", color: "#A13D3D" },
      { name: "เสื้อฟ้า", color: "#7C93B0" },
    ],
  },
  {
    key: "accessory",
    label: "เครื่องประดับ",
    options: [
      { name: "ไม่มี", color: "transparent" },
      { name: "หมวกแก๊ป", color: "#C9B36F" },
      { name: "แว่นกันแดด", color: "#3A3229" },
      { name: "ผ้าพันคอ", color: "#A13D3D" },
    ],
  },
];

export function priceFor(optionIndex) {
  return PRICE_LADDER[optionIndex] ?? PRICE_LADDER[PRICE_LADDER.length - 1];
}

export function itemKey(categoryKey, optionIndex) {
  return `${categoryKey}-${optionIndex}`;
}
