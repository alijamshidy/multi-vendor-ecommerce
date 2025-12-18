type Link = {
  href: string;
  label: string;
};

export const links: Link[] = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/blog", label: "products" },
  { href: "/about_Us", label: "About us" },
  { href: "/contact_Us", label: "Contact us" },
];

export const adminLinks: Link[] = [
  { href: "/admin/sales", label: "sales" },
  { href: "/admin/products", label: "my products" },
  { href: "/admin/products/create", label: "create product" },
];

export const categorys: Link[] = [
  { href: "mobile", label: "mobile" },
  { href: "speaker", label: "speaker" },
  { href: "television", label: "television" },
  { href: "smart watch", label: "smart watch" },
];
