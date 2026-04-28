<<<<<<< HEAD
type NavLink = {
=======
type Link = {
>>>>>>> 872b5acfd427e94fbe17bcfabec14c1342fd95b7
  href: string;
  label: string;
};

<<<<<<< HEAD
export const visitorLinks: NavLink[] = [
  { href: "/", label: "home" },
  { href: "/about", label: "about" },
  { href: "/products", label: "products" },
  { href: "/favorites", label: "favorites" },
  { href: "/reviews", label: "reviews" },
  { href: "/cart", label: "cart" },
  { href: "/orders", label: "orders" },
  { href: "/customer/dashboard", label: "dashboard" },
];
export const customerLinks: NavLink[] = [
  { href: "/", label: "home" },
  { href: "/about", label: "about" },
  { href: "/products", label: "products" },
  { href: "/favorites", label: "favorites" },
  { href: "/reviews", label: "reviews" },
  { href: "/cart", label: "cart" },
  { href: "/orders", label: "orders" },
  { href: "/customer/sales", label: "dashboard" },
];

export const adminLinks: NavLink[] = [
=======
export const links: Link[] = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/blog", label: "products" },
  { href: "/about_Us", label: "About us" },
  { href: "/contact_Us", label: "Contact us" },
];

export const adminLinks: Link[] = [
>>>>>>> 872b5acfd427e94fbe17bcfabec14c1342fd95b7
  { href: "/admin/sales", label: "sales" },
  { href: "/admin/products", label: "my products" },
  { href: "/admin/products/create", label: "create product" },
];

<<<<<<< HEAD
export const sellerLinks: NavLink[] = [
  { href: "/seller/sales", label: "sales" },
  { href: "/seller/products", label: "my products" },
  { href: "/seller/products/create", label: "create product" },
=======
export const categorys: Link[] = [
  { href: "mobile", label: "mobile" },
  { href: "speaker", label: "speaker" },
  { href: "television", label: "television" },
  { href: "smart watch", label: "smart watch" },
>>>>>>> 872b5acfd427e94fbe17bcfabec14c1342fd95b7
];
