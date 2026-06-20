import type { AuthRole } from "@/lib/auth-cookie";
import {
  CircleDollarSign,
  FileText,
  FolderOpen,
  Heart,
  Home,
  Info,
  Layers,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Package,
  PackagePlus,
  ShoppingBag,
  ShoppingCart,
  Star,
  Store,
  User,
  Users,
  LogOut,
  LogIn,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

export type NavLabelKey =
  | "home"
  | "about"
  | "blog"
  | "products"
  | "categories"
  | "collections"
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
  | "createCollection"
  | "shopContent"
  | "sellers"
  | "profile"
  | "messages"
  | "payments"
  | "discountProducts"
  | "paymentRequests"
  | "changePassword";

export type NavLink = {
  href: string;
  labelKey: NavLabelKey;
  icon: LucideIcon;
};

export type AccountMenuItem = {
  href: string;
  labelKey: NavLabelKey | "login" | "register" | "registerAsSeller" | "logout";
  icon: LucideIcon;
};

/** Public storefront links for guests (matches proxy.ts public paths). */
export const publicVisitorLinks: NavLink[] = [
  { href: "/", labelKey: "home", icon: Home },
  { href: "/about", labelKey: "about", icon: Info },
  { href: "/blog", labelKey: "blog", icon: FileText },
  { href: "/products", labelKey: "products", icon: Package },
  { href: "/categories", labelKey: "categories", icon: FolderOpen },
  { href: "/collections", labelKey: "collections", icon: Layers },
  { href: "/reviews", labelKey: "reviews", icon: Star },
  { href: "/contact", labelKey: "contact", icon: Mail },
];

/** @deprecated Use publicVisitorLinks */
export const visitorLinks = publicVisitorLinks;

const customerShopLinks: NavLink[] = [
  { href: "/", labelKey: "home", icon: Home },
  { href: "/about", labelKey: "about", icon: Info },
  { href: "/products", labelKey: "products", icon: Package },
  { href: "/customer/categories", labelKey: "categories", icon: FolderOpen },
  { href: "/customer/collections", labelKey: "collections", icon: Layers },
  { href: "/wishlist", labelKey: "wishlist", icon: Heart },
  { href: "/reviews", labelKey: "reviews", icon: Star },
  { href: "/cart", labelKey: "cart", icon: ShoppingCart },
  { href: "/contact", labelKey: "contact", icon: Mail },
];

const staffShopLinks: NavLink[] = publicVisitorLinks;

/** Admin console — only routes that exist under app/.../admin/ */
export const adminAccountLinks: NavLink[] = [
  { href: "/admin/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
  { href: "/admin/sales", labelKey: "orders", icon: ShoppingBag },
  { href: "/admin/sellers", labelKey: "sellers", icon: Users },
  { href: "/admin/products", labelKey: "myProducts", icon: Package },
  { href: "/admin/categories", labelKey: "categories", icon: FolderOpen },
  { href: "/admin/content", labelKey: "shopContent", icon: Layers },
  { href: "/admin/payment-request", labelKey: "paymentRequests", icon: CircleDollarSign },
  { href: "/admin/chat", labelKey: "messages", icon: MessageSquare },
];

const customerAccountLinks: NavLink[] = [
  { href: "/customer/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
  { href: "/orders", labelKey: "orders", icon: ShoppingBag },
  { href: "/customer/chat", labelKey: "messages", icon: MessageSquare },
  { href: "/profile", labelKey: "profile", icon: User },
  { href: "/profile/change-password", labelKey: "changePassword", icon: User },
];

export const sellerAccountLinks: NavLink[] = [
  { href: "/seller/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
  { href: "/seller/sales", labelKey: "sales", icon: Store },
  { href: "/seller/orders", labelKey: "orders", icon: ShoppingBag },
  { href: "/seller/products", labelKey: "myProducts", icon: Package },
  { href: "/seller/products/create", labelKey: "createProduct", icon: PackagePlus },
  { href: "/seller/discount-products", labelKey: "discountProducts", icon: Package },
  { href: "/seller/payments", labelKey: "payments", icon: CircleDollarSign },
  { href: "/seller/chat", labelKey: "messages", icon: MessageSquare },
  { href: "/profile", labelKey: "profile", icon: User },
  { href: "/profile/change-password", labelKey: "changePassword", icon: User },
];

/** @deprecated Use getSidebarNav instead */
export const customerLinks: NavLink[] = [
  ...customerShopLinks,
  ...customerAccountLinks,
];

/** @deprecated Use adminAccountLinks */
export const adminLinks = adminAccountLinks;

/** @deprecated Use sellerAccountLinks */
export const sellerLinks = sellerAccountLinks;

function shopLinksForRole(role: AuthRole | null, isAuthenticated: boolean): NavLink[] {
  if (role === "admin") return [];
  if (!isAuthenticated || role === "customer") {
    return role === "customer" ? customerShopLinks : publicVisitorLinks;
  }
  return staffShopLinks;
}

function accountLinksForRole(role: AuthRole | null): NavLink[] {
  if (role === "admin") return adminAccountLinks;
  if (role === "seller") return sellerAccountLinks;
  if (role === "customer") return customerAccountLinks;
  return [];
}

export function getSidebarNav(
  role: AuthRole | null,
  isAuthenticated: boolean,
): { shop: NavLink[]; account: NavLink[]; accountGroupKey: "account" | "adminPanel" } {
  return {
    shop: shopLinksForRole(role, isAuthenticated),
    account: isAuthenticated ? accountLinksForRole(role) : [],
    accountGroupKey: role === "admin" ? "adminPanel" : "account",
  };
}

export function isSidebarNavItemActive(
  pathname: string,
  href: string,
  siblings: NavLink[],
): boolean {
  const normalizedPath = pathname.replace(/\/$/, "") || "/";
  const normalizedHref = href.replace(/\/$/, "") || "/";

  if (normalizedHref === "/") {
    return normalizedPath === "/";
  }

  const matches =
    normalizedPath === normalizedHref ||
    normalizedPath.startsWith(`${normalizedHref}/`);

  if (!matches) return false;

  const hasMoreSpecificSibling = siblings.some(item => {
    if (item.href === href) return false;
    const siblingHref = item.href.replace(/\/$/, "") || "/";
    if (siblingHref.length <= normalizedHref.length) return false;
    return (
      normalizedPath === siblingHref ||
      normalizedPath.startsWith(`${siblingHref}/`)
    );
  });

  return !hasMoreSpecificSibling;
}

function dashboardHrefForRole(role: AuthRole): string {
  if (role === "admin") return "/admin/dashboard";
  if (role === "seller") return "/seller/dashboard";
  return "/customer/dashboard";
}

export function getDashboardHref(role?: AuthRole | null): string {
  if (!role) return "/customer/dashboard";
  return dashboardHrefForRole(role);
}

export const sellerRegisterHref = "/register?type=seller";

export function getAccountMenuItems(
  role: AuthRole | null,
  isAuthenticated: boolean,
): AccountMenuItem[] {
  if (!isAuthenticated || !role) {
    return [
      { href: "/login", labelKey: "login", icon: LogIn },
      { href: "/register", labelKey: "register", icon: UserPlus },
      {
        href: "/register?type=seller",
        labelKey: "registerAsSeller",
        icon: Store,
      },
    ];
  }

  const items: AccountMenuItem[] = [
    {
      href: dashboardHrefForRole(role),
      labelKey: "dashboard",
      icon: LayoutDashboard,
    },
  ];

  if (role === "customer" || role === "seller") {
    items.push({ href: "/profile", labelKey: "profile", icon: User });
  }

  items.push({ href: "#logout", labelKey: "logout", icon: LogOut });

  return items;
}
