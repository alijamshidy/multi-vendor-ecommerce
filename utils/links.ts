type NavLink = {
  href: string;
  label: string;
};

export const visitorLinks: NavLink[] = [
  { href: "/", label: "home" },
  { href: "/about", label: "about" },
  { href: "/products", label: "products" },
  { href: "/wishlist", label: "wishlist" },
  { href: "/reviews", label: "reviews" },
  { href: "/cart", label: "cart" },
  { href: "/orders", label: "orders" },
  { href: "/contact", label: "contact" },
  { href: "/customer/dashboard", label: "dashboard" },
];
export const customerLinks: NavLink[] = [
  { href: "/", label: "home" },
  { href: "/about", label: "about" },
  { href: "/products", label: "products" },
  { href: "/wishlist", label: "wishlist" },
  { href: "/reviews", label: "reviews" },
  { href: "/cart", label: "cart" },
  { href: "/orders", label: "orders" },
  { href: "/contact", label: "contact" },
  { href: "/customer/dashboard", label: "dashboard" },
];

export const adminLinks: NavLink[] = [
  { href: "/admin/dashboard", label: "dashboard" },
  { href: "/admin/sales", label: "sales" },
  { href: "/admin/products", label: "my products" },
  { href: "/admin/products/create", label: "create product" },
  { href: "/admin/categories/create", label: "create category" },
];

export const sellerLinks: NavLink[] = [
  { href: "/seller/dashboard", label: "dashboard" },
  { href: "/seller/sales", label: "sales" },
  { href: "/seller/products", label: "my products" },
  { href: "/seller/products/create", label: "create product" },
];
