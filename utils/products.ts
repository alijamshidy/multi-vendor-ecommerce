export type product = {
  _id: string;
  name: string;
  sellerId: string;
  images: string[] | string;
  price: number;
  slug: string;
  discount: number;
  rating: number;
  description: string;
  category: string;
  stock: number;
  brand: string;
  shopName: string;
  createdAt: string;
  updatedAt: string;
};
export const products: product[] = [
  {
    _id: "67f66529bbb26983d2a4cabe",
    sellerId: "680e4a602bfd973455134e48",
    name: "iphone 12 pro max",
    slug: "iphone-12-pro-max",
    category: "Mobiles",
    brand: "iphone",
    price: 1200,
    stock: 10,
    discount: 9,
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio repudiandae architecto ipsum. Dolor, sint. Ex sit facilis maxime adipisci perferendis.",
    shopName: "EasyShop",
    images: [
      "http://res.cloudinary.com/dqv1sbkvs/image/upload/v1744200983/products/hvhuczwng8knlqvfwy6e.png",
      "http://res.cloudinary.com/dqv1sbkvs/image/upload/v1744200984/products/emahrm1etu99sbahr0lw.png",
    ],
    rating: 0,
    createdAt: "2025-04-09T12:16:41.368Z",

    updatedAt: "2025-04-09T12:16:41.368Z",
  },
  {
    _id: "67f66570bbb26983d2a4cac0",

    sellerId: "680e4a602bfd973455134e48",

    name: "iphone 16",
    slug: "iphone-16",
    category: "Mobiles",
    brand: "iphone",
    price: 1999,
    stock: 50,
    discount: 12,
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestias, reiciendis adipisci veritatis eveniet eos enim perferendis laborum aliquam dolor. At nihil sed voluptatibus voluptas ipsam illum officiis omnis eaque maxime?",
    shopName: "EasyShop",
    images: [
      "http://res.cloudinary.com/dqv1sbkvs/image/upload/v1744201054/products/yz2dwbubaskn5f8wph8t.png",
      "http://res.cloudinary.com/dqv1sbkvs/image/upload/v1744201055/products/xbmnhnhit4fb2jffkdl3.png",
    ],
    rating: 0,
    createdAt: "2025-04-09T12:17:52.005Z",
    updatedAt: "2025-04-09T12:17:52.005Z",
  },
  {
    _id: "67f6663cbbb26983d2a4cae4",

    sellerId: "67f6658dbbb26983d2a4cac4",

    name: "speaker 7.1 gaming rapoo",
    slug: "speaker-7.1-gaming-rapoo",
    category: "Speakers",
    brand: "rapoo",
    price: 500,
    stock: 5,
    discount: 6,
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta, at?",
    shopName: "EasyShop",
    images: [
      "http://res.cloudinary.com/dqv1sbkvs/image/upload/v1744201258/products/rqpw2f54equf3h3n0wxo.png",
      "http://res.cloudinary.com/dqv1sbkvs/image/upload/v1744201259/products/j5dpuwmelf7hojifspjw.png",
    ],
    rating: 0,
    createdAt: "2025-04-09T12:21:16.191Z",

    updatedAt: "2025-04-09T12:21:16.191Z",
  },
  {
    _id: "67f6669bbbb26983d2a4cae6",

    sellerId: "67f6658dbbb26983d2a4cac4",

    name: "tuf f516fx asus gaming",
    slug: "tuf-f516fx-asus-gaming",
    category: "Laptops",
    brand: "asus",
    price: 1300,
    stock: 20,
    discount: 10,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error doloribus at aut ducimus repellat quod optio cupiditate, nihil amet iste. Maxime recusandae impedit nam, atque iusto explicabo sint? Ut qui nobis et magni aperiam impedit, consectetur omnis ducimus nemo rerum deleniti quas voluptas doloribus, quis accusamus animi numquam, ab veritatis!",
    shopName: "EasyShop",
    images: [
      "http://res.cloudinary.com/dqv1sbkvs/image/upload/v1744201351/products/xeuung5sdkhkdymrwzhj.png",
      "http://res.cloudinary.com/dqv1sbkvs/image/upload/v1744201354/products/nbyjbanrbohhzy2cpmlw.png",
    ],
    rating: 0,
    createdAt: "2025-04-09T12:22:51.049Z",

    updatedAt: "2025-04-09T12:22:51.049Z",
  },
];
