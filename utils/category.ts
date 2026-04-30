export type category = {
  id: string;
  href: string;
  label: string;
  image: string;
};
export const Categorys: category[] = [
  {
    id: "0",
    href: "mobile",
    label: "Mobile",
    image: "/images/hero1.jpg",
  },
  { id: "1", href: "TV", label: "TV", image: "/images/hero4.jpg" },
  {
    id: "2",
    href: "smartPhone",
    label: "SmartPhone",
    image: "/images/hero2.jpg",
  },
  { id: "3", href: "speaker", label: "Speaker", image: "/images/hero4.jpg" },
  { id: "4", href: "hat", label: "Hat", image: "/images/hero3.jpg" },
  { id: "5", href: "tshirt", label: "Tshirt", image: "/images/hero2.jpg" },
  {
    id: "6",
    href: "shoes",
    label: "Shoes",
    image: "/images/hero1.jpg",
  },
];
