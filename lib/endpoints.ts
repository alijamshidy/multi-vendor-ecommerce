/** API path segments (base: `/api` in browser, `http://localhost:5000/api` on server). */

export const apiEndpoints = {
  auth: {
    adminLogin: "/admin-login",
    sellerRegister: "/seller-register",
    sellerLogin: "/seller-login",
    getUser: "/get-user",
    profileImageUpload: "/profile-image-upload",
    profileInfoAdd: "/profile-info-add",
    logout: "/logout",
  },
  customerAuth: {
    register: "/customer/customer-register",
    login: "/customer/customer-login",
    sendOtp: "/customer/send-otp",
    verifyOtp: "/customer/verify-otp",
    logout: "/customer/logout",
  },
  categories: {
    add: "/category-add",
    list: "/category-get",
  },
  products: {
    add: "/product-add",
    list: "/products-get",
    get: (productId: string) => `/product-get/${productId}`,
    update: "/product-update",
    delete: (productId: string) => `/product-delete/${productId}`,
    imageUpdate: "/product-image-update",
  },
  sellers: {
    pending: "/request-seller-get",
    get: (sellerId: string) => `/get-seller/${sellerId}`,
    statusUpdate: "/seller-status-update",
    active: "/get-sellers",
    deactive: "/get-deactive-sellers",
  },
  storefront: {
    categories: "/home/get-category",
    homeProducts: "/home/get-product",
    priceRangeProducts: "/home/price-range-latest-product",
    queryProducts: "/home/query-products",
    productDetails: (slug: string) => `/home/product-details/${slug}`,
    submitReview: "/home/customer/submit-review",
    getReviews: (productId: string) => `/home/customer/get-review/${productId}`,
  },
  cart: {
    add: "/home/product/add-to-card",
    list: (userId: string) => `/home/product/get-card-products/${userId}`,
    remove: (cardId: string) => `/home/product/delete-card-product/${cardId}`,
    increment: (cardId: string) => `/home/product/quantity-inc/${cardId}`,
    decrement: (cardId: string) => `/home/product/quantity-dec/${cardId}`,
  },
  wishlist: {
    add: "/home/product/add-to-wishlist",
    list: (userId: string) => `/home/product/get-wishlist-products/${userId}`,
    remove: (wishlistId: string) =>
      `/home/product/remove-wishlist-product/${wishlistId}`,
  },
  orders: {
    place: "/home/order/place-order",
    customerDashboard: (userId: string) =>
      `/home/customer/get-dashboard-data/${userId}`,
    customerByStatus: (customerId: string, status: string) =>
      `/home/customer/get-orders/${customerId}/${status}`,
    customerDetails: (orderId: string) =>
      `/home/customer/get-order-details/${orderId}`,
    adminList: "/admin-orders",
    adminDetails: (orderId: string) => `/admin/order/${orderId}`,
    adminStatusUpdate: (orderId: string) =>
      `/admin/order-status/update/${orderId}`,
    sellerList: (sellerId: string) => `/seller/orders/${sellerId}`,
    sellerDetails: (orderId: string) => `/seller/order/${orderId}`,
    sellerStatusUpdate: (orderId: string) =>
      `/seller/order-status/update/${orderId}`,
  },
  chat: {
    customerAddFriend: "/chat/customer/add-customer-friend",
    customerSendMessage: "/chat/customer/send-message-to-seller",
    sellerCustomers: (sellerId: string) => `/chat/seller/get-customers/${sellerId}`,
    sellerMessages: (customerId: string) =>
      `/chat/seller/get-customer-message/${customerId}`,
    sellerSendMessage: "/chat/seller/send-message-to-customer",
    adminSellers: "/chat/admin/get-sellers",
    sellerAdminMessage: "/chat/message-send-seller-admin",
    adminMessages: (receiverId: string) => `/chat/get-admin-message/${receiverId}`,
    sellerAdminInbox: "/chat/get-seller-message",
  },
  payments: {
    stripeConnect: "/payment/create-stripe-connect-account",
  },
} as const;
