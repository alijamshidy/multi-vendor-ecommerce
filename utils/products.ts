type image = {
  url: string;
  id: string;
};

export type productType = {
  id: string;
  href: string;
  label: string;
  images: image[];
  /** Current selling price (discounted when applicable). */
  price: number;
  /** Original price before discount. */
  originalPrice: number;
  category: string;
  description: string;
  sellerId?: string;
  shopName?: string;
  isOutOfStock?: boolean;
  stock?: number;
};

const heroImages = [
  "/images/hero1.jpg",
  "/images/hero2.jpg",
  "/images/hero3.jpg",
  "/images/hero4.jpg",
];

const catalog = [
  {
    label: "Wireless Headphones",
    category: "Speaker",
    price: 129,
    description: "Premium noise-cancelling headphones with 30-hour battery life.",
  },
  {
    label: "Smart LED TV 55\"",
    category: "TV",
    price: 649,
    description: "4K UHD display with HDR support and built-in streaming apps.",
  },
  {
    label: "Flagship Smartphone",
    category: "SmartPhone",
    price: 899,
    description: "Fast performance, triple camera system, and all-day battery.",
  },
  {
    label: "Bluetooth Speaker",
    category: "Speaker",
    price: 79,
    description: "Portable speaker with deep bass and waterproof design.",
  },
  {
    label: "Classic Cotton Hat",
    category: "Hat",
    price: 24,
    description: "Lightweight everyday hat with adjustable fit.",
  },
  {
    label: "Premium Cotton T-Shirt",
    category: "Tshirt",
    price: 32,
    description: "Soft breathable fabric available in multiple colors.",
  },
  {
    label: "Running Shoes",
    category: "Shoes",
    price: 119,
    description: "Comfortable cushioning designed for daily training.",
  },
  {
    label: "Budget Smartphone",
    category: "Mobile",
    price: 299,
    description: "Reliable mobile phone with great value for everyday use.",
  },
  {
    label: "Studio Monitor Speaker",
    category: "Speaker",
    price: 199,
    description: "Clear balanced sound for music lovers and creators.",
  },
];

export const Products: productType[] = catalog.map((item, index) => ({
  id: String(index + 1),
  href: item.label.toLowerCase().replace(/\s+/g, "-"),
  label: item.label,
  images: [{ id: "0", url: heroImages[index % heroImages.length] }],
  price: item.price,
  originalPrice: item.price,
  category: item.category,
  description: item.description,
}));
