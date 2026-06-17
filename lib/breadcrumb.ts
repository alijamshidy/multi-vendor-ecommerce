export type BreadcrumbConfigItem =
  | { type: "link"; href: string; labelKey: string }
  | { type: "page"; labelKey: string }
  | {
      type: "dynamic";
      dynamicType: "product" | "category" | "collection";
    };

const ROLE_PREFIXES = new Set(["admin", "seller", "customer"]);

const SEGMENT_LABEL_KEYS: Record<string, string> = {
  products: "nav.products",
  categories: "nav.categories",
  collections: "nav.collections",
  cart: "nav.cart",
  checkout: "cart.checkout",
  wishlist: "nav.wishlist",
  reviews: "nav.reviews",
  orders: "nav.orders",
  contact: "nav.contact",
  dashboard: "nav.dashboard",
  sales: "nav.sales",
  sellers: "nav.sellers",
  login: "nav.login",
  register: "nav.register",
  reset_password: "auth.resetPassword",
};

const STATIC_ROOT_SEGMENTS = new Set([
  ...Object.keys(SEGMENT_LABEL_KEYS),
  ...ROLE_PREFIXES,
  "create",
]);

export function stripLocaleFromPathname(
  pathname: string,
  locales: readonly string[],
): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && locales.includes(segments[0])) {
    return `/${segments.slice(1).join("/")}`;
  }
  return pathname || "/";
}

export function getPathSegments(pathname: string): string[] {
  return pathname.split("/").filter(Boolean);
}

export function getBreadcrumbConfig(segments: string[]): BreadcrumbConfigItem[] {
  if (segments.length === 0) return [];

  const home: BreadcrumbConfigItem = {
    type: "link",
    href: "/",
    labelKey: "nav.home",
  };

  const role = ROLE_PREFIXES.has(segments[0]) ? segments[0] : null;
  const rest = role ? segments.slice(1) : segments;
  const roleBase = role ? `/${role}` : "";

  if (!role && rest.length === 1 && !STATIC_ROOT_SEGMENTS.has(rest[0])) {
    return [home, { type: "dynamic", dynamicType: "category" }];
  }

  if (rest[0] === "products" && rest.length === 2) {
    return [
      home,
      { type: "link", href: "/products", labelKey: "nav.products" },
      { type: "dynamic", dynamicType: "product" },
    ];
  }

  if (rest[0] === "categories" && rest.length === 2) {
    return [
      home,
      {
        type: "link",
        href: role ? `${roleBase}/categories` : "/categories",
        labelKey: "nav.categories",
      },
      { type: "dynamic", dynamicType: "category" },
    ];
  }

  if (rest[0] === "collections" && rest.length === 2) {
    return [
      home,
      {
        type: "link",
        href: role ? `${roleBase}/collections` : "/collections",
        labelKey: "nav.collections",
      },
      { type: "dynamic", dynamicType: "collection" },
    ];
  }

  if (rest[0] === "categories" && rest.length === 1) {
    return [
      home,
      { type: "page", labelKey: "nav.categories" },
    ];
  }

  if (rest[0] === "collections" && rest.length === 1) {
    return [
      home,
      { type: "page", labelKey: "nav.collections" },
    ];
  }

  if (rest[0] === "checkout" && rest.length === 1) {
    return [
      home,
      { type: "link", href: "/cart", labelKey: "nav.cart" },
      { type: "page", labelKey: "cart.checkout" },
    ];
  }

  if (rest[0] === "products" && rest[1] === "create" && role) {
    return [
      home,
      {
        type: "link",
        href: `${roleBase}/dashboard`,
        labelKey: "nav.dashboard",
      },
      {
        type: "link",
        href: `${roleBase}/products`,
        labelKey: "nav.myProducts",
      },
      { type: "page", labelKey: "nav.createProduct" },
    ];
  }

  if (rest[0] === "categories" && rest[1] === "create" && role) {
    return [
      home,
      {
        type: "link",
        href: `${roleBase}/dashboard`,
        labelKey: "nav.dashboard",
      },
      {
        type: "link",
        href: `${roleBase}/categories`,
        labelKey: "nav.categories",
      },
      { type: "page", labelKey: "nav.createCategory" },
    ];
  }

  if (role && rest[0] === "dashboard" && rest.length === 1) {
    return [home, { type: "page", labelKey: "nav.dashboard" }];
  }

  if (role && rest[0] === "sales" && rest.length === 1) {
    return [
      home,
      {
        type: "link",
        href: `${roleBase}/dashboard`,
        labelKey: "nav.dashboard",
      },
      { type: "page", labelKey: "nav.sales" },
    ];
  }

  if (role && rest[0] === "products" && rest.length === 1) {
    return [
      home,
      {
        type: "link",
        href: `${roleBase}/dashboard`,
        labelKey: "nav.dashboard",
      },
      { type: "page", labelKey: "nav.myProducts" },
    ];
  }

  if (rest.length === 1) {
    const labelKey = SEGMENT_LABEL_KEYS[rest[0]];
    if (labelKey) {
      return [home, { type: "page", labelKey }];
    }
  }

  return [home];
}
