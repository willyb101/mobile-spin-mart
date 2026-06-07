export type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  ram: number;
  storage: number;
  os: "iOS" | "Android";
  rating: number;
  reviews: number;
  stock: number;
  tags: ("featured" | "new" | "bestseller")[];
  color: string;
  image: string; // gradient color stops
  specs: { label: string; value: string }[];
  description: string;
};

const grad = (a: string, b: string) => `linear-gradient(135deg, ${a}, ${b})`;

export const products: Product[] = [
  {
    id: "iphone-15-pro",
    name: "iPhone 15 Pro",
    brand: "Apple",
    price: 27999,
    oldPrice: 29999,
    ram: 8, storage: 256, os: "iOS",
    rating: 4.8, reviews: 1284, stock: 24,
    tags: ["featured", "bestseller"],
    color: "Titanium Black",
    image: grad("#3a3a3a", "#0f0f10"),
    description: "Titanium. A17 Pro chip. The most powerful iPhone yet.",
    specs: [
      { label: "Display", value: "6.1\" Super Retina XDR" },
      { label: "Chip", value: "Apple A17 Pro" },
      { label: "Camera", value: "48MP triple system" },
      { label: "Battery", value: "Up to 23 hrs video" },
    ],
  },
  {
    id: "galaxy-s24-ultra",
    name: "Galaxy S24 Ultra",
    brand: "Samsung",
    price: 32499,
    ram: 12, storage: 512, os: "Android",
    rating: 4.7, reviews: 942, stock: 18,
    tags: ["featured", "new"],
    color: "Titanium Violet",
    image: grad("#6b46c1", "#1a1147"),
    description: "200MP camera. Built-in S Pen. Galaxy AI.",
    specs: [
      { label: "Display", value: "6.8\" Dynamic AMOLED 2X" },
      { label: "Chip", value: "Snapdragon 8 Gen 3" },
      { label: "Camera", value: "200MP main + 50MP tele" },
      { label: "Battery", value: "5000 mAh" },
    ],
  },
  {
    id: "pixel-8-pro",
    name: "Pixel 8 Pro",
    brand: "Google",
    price: 22499,
    oldPrice: 24999,
    ram: 12, storage: 256, os: "Android",
    rating: 4.6, reviews: 612, stock: 31,
    tags: ["bestseller"],
    color: "Bay Blue",
    image: grad("#3b82f6", "#0c1e3f"),
    description: "Google AI photography. Tensor G3 chip.",
    specs: [
      { label: "Display", value: "6.7\" LTPO OLED 120Hz" },
      { label: "Chip", value: "Google Tensor G3" },
      { label: "Camera", value: "50MP triple system" },
      { label: "Battery", value: "5050 mAh" },
    ],
  },
  {
    id: "oneplus-12",
    name: "OnePlus 12",
    brand: "OnePlus",
    price: 19999,
    ram: 16, storage: 512, os: "Android",
    rating: 4.5, reviews: 388, stock: 12,
    tags: ["new"],
    color: "Flowy Emerald",
    image: grad("#10b981", "#062c22"),
    description: "Hasselblad camera. 100W SuperVOOC charging.",
    specs: [
      { label: "Display", value: "6.82\" LTPO AMOLED" },
      { label: "Chip", value: "Snapdragon 8 Gen 3" },
      { label: "Camera", value: "50MP Hasselblad" },
      { label: "Battery", value: "5400 mAh" },
    ],
  },
  {
    id: "iphone-15",
    name: "iPhone 15",
    brand: "Apple",
    price: 19999,
    ram: 6, storage: 128, os: "iOS",
    rating: 4.6, reviews: 2102, stock: 40,
    tags: ["bestseller"],
    color: "Pink",
    image: grad("#fbcfe8", "#7a2a4a"),
    description: "Dynamic Island. 48MP main camera. USB-C.",
    specs: [
      { label: "Display", value: "6.1\" Super Retina XDR" },
      { label: "Chip", value: "Apple A16 Bionic" },
      { label: "Camera", value: "48MP dual" },
      { label: "Battery", value: "Up to 20 hrs video" },
    ],
  },
  {
    id: "galaxy-a55",
    name: "Galaxy A55",
    brand: "Samsung",
    price: 11249,
    ram: 8, storage: 128, os: "Android",
    rating: 4.3, reviews: 506, stock: 60,
    tags: ["new"],
    color: "Awesome Iceblue",
    image: grad("#67e8f9", "#0e3a4a"),
    description: "5G. Triple camera. Bright Super AMOLED.",
    specs: [
      { label: "Display", value: "6.6\" Super AMOLED" },
      { label: "Chip", value: "Exynos 1480" },
      { label: "Camera", value: "50MP triple" },
      { label: "Battery", value: "5000 mAh" },
    ],
  },
  {
    id: "xiaomi-14",
    name: "Xiaomi 14",
    brand: "Xiaomi",
    price: 17499,
    ram: 12, storage: 256, os: "Android",
    rating: 4.4, reviews: 271, stock: 22,
    tags: ["featured"],
    color: "Jade Green",
    image: grad("#84cc16", "#1f3408"),
    description: "Leica optics. Snapdragon 8 Gen 3.",
    specs: [
      { label: "Display", value: "6.36\" LTPO OLED" },
      { label: "Chip", value: "Snapdragon 8 Gen 3" },
      { label: "Camera", value: "50MP Leica triple" },
      { label: "Battery", value: "4610 mAh" },
    ],
  },
  {
    id: "nothing-phone-2",
    name: "Nothing Phone (2)",
    brand: "Nothing",
    price: 14999,
    oldPrice: 16999,
    ram: 12, storage: 256, os: "Android",
    rating: 4.4, reviews: 198, stock: 15,
    tags: ["featured", "new"],
    color: "Dark Grey",
    image: grad("#374151", "#0a0a0a"),
    description: "Glyph interface. Transparent design.",
    specs: [
      { label: "Display", value: "6.7\" LTPO OLED 120Hz" },
      { label: "Chip", value: "Snapdragon 8+ Gen 1" },
      { label: "Camera", value: "50MP dual" },
      { label: "Battery", value: "4700 mAh" },
    ],
  },
  {
    id: "iphone-14",
    name: "iPhone 14",
    brand: "Apple",
    price: 17499,
    ram: 6, storage: 128, os: "iOS",
    rating: 4.5, reviews: 3120, stock: 50,
    tags: ["bestseller"],
    color: "Midnight",
    image: grad("#1f2937", "#000000"),
    description: "A15 Bionic. Cinematic mode. Crash detection.",
    specs: [
      { label: "Display", value: "6.1\" Super Retina XDR" },
      { label: "Chip", value: "Apple A15 Bionic" },
      { label: "Camera", value: "12MP dual" },
      { label: "Battery", value: "Up to 20 hrs video" },
    ],
  },
  {
    id: "pixel-8a",
    name: "Pixel 8a",
    brand: "Google",
    price: 12499,
    ram: 8, storage: 128, os: "Android",
    rating: 4.5, reviews: 311, stock: 28,
    tags: ["new", "bestseller"],
    color: "Aloe",
    image: grad("#86efac", "#14532d"),
    description: "Google AI features at a great price.",
    specs: [
      { label: "Display", value: "6.1\" OLED 120Hz" },
      { label: "Chip", value: "Google Tensor G3" },
      { label: "Camera", value: "64MP dual" },
      { label: "Battery", value: "4492 mAh" },
    ],
  },
  {
    id: "oneplus-nord-4",
    name: "OnePlus Nord 4",
    brand: "OnePlus",
    price: 10749,
    ram: 12, storage: 256, os: "Android",
    rating: 4.2, reviews: 142, stock: 33,
    tags: ["new"],
    color: "Mercurial Silver",
    image: grad("#9ca3af", "#111827"),
    description: "Metal unibody. 100W fast charging.",
    specs: [
      { label: "Display", value: "6.74\" AMOLED 120Hz" },
      { label: "Chip", value: "Snapdragon 7+ Gen 3" },
      { label: "Camera", value: "50MP dual" },
      { label: "Battery", value: "5500 mAh" },
    ],
  },
  {
    id: "xiaomi-redmi-note-13",
    name: "Redmi Note 13 Pro",
    brand: "Xiaomi",
    price: 8249,
    ram: 8, storage: 256, os: "Android",
    rating: 4.3, reviews: 887, stock: 80,
    tags: ["bestseller"],
    color: "Forest Green",
    image: grad("#22c55e", "#0a1f12"),
    description: "200MP camera. 67W turbo charging.",
    specs: [
      { label: "Display", value: "6.67\" AMOLED 120Hz" },
      { label: "Chip", value: "Snapdragon 7s Gen 2" },
      { label: "Camera", value: "200MP triple" },
      { label: "Battery", value: "5100 mAh" },
    ],
  },
];

export const brands = Array.from(new Set(products.map((p) => p.brand))).sort();
export const oses = ["iOS", "Android"] as const;
export const ramOptions = Array.from(new Set(products.map((p) => p.ram))).sort((a, b) => a - b);
export const storageOptions = Array.from(new Set(products.map((p) => p.storage))).sort((a, b) => a - b);

export const getProduct = (id: string) => products.find((p) => p.id === id);
export const related = (id: string) => {
  const p = getProduct(id);
  if (!p) return [];
  return products.filter((x) => x.id !== id && (x.brand === p.brand || x.os === p.os)).slice(0, 4);
};
