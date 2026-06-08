type NavLink = {
  href: string;
  labelKey:
    | "home"
    | "about"
    | "products"
    | "wishlist"
    | "reviews"
    | "cart"
    | "orders"
    | "contact"
    | "dashboard"
    | "sales"
    | "myProducts"
    | "createProduct"
    | "createCategory"
    | "shopContent";
};

export const visitorLinks: NavLink[] = [
  { href: "/", labelKey: "home" },
  { href: "/about", labelKey: "about" },
  { href: "/products", labelKey: "products" },
  { href: "/wishlist", labelKey: "wishlist" },
  { href: "/reviews", labelKey: "reviews" },
  { href: "/cart", labelKey: "cart" },
  { href: "/orders", labelKey: "orders" },
  { href: "/contact", labelKey: "contact" },
  { href: "/customer/dashboard", labelKey: "dashboard" },
];

export const customerLinks: NavLink[] = [
  { href: "/", labelKey: "home" },
  { href: "/about", labelKey: "about" },
  { href: "/products", labelKey: "products" },
  { href: "/wishlist", labelKey: "wishlist" },
  { href: "/reviews", labelKey: "reviews" },
  { href: "/cart", labelKey: "cart" },
  { href: "/orders", labelKey: "orders" },
  { href: "/contact", labelKey: "contact" },
  { href: "/customer/dashboard", labelKey: "dashboard" },
];

export const adminLinks: NavLink[] = [
  { href: "/admin/dashboard", labelKey: "dashboard" },
  { href: "/admin/sales", labelKey: "sales" },
  { href: "/admin/products", labelKey: "myProducts" },
  { href: "/admin/products/create", labelKey: "createProduct" },
  { href: "/admin/categories/create", labelKey: "createCategory" },
  { href: "/admin/content", labelKey: "shopContent" },
];

export const sellerLinks: NavLink[] = [
  { href: "/seller/dashboard", labelKey: "dashboard" },
  { href: "/seller/sales", labelKey: "sales" },
  { href: "/seller/products", labelKey: "myProducts" },
  { href: "/seller/products/create", labelKey: "createProduct" },
];
