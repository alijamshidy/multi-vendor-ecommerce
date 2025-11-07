<<<<<<< HEAD
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaFacebookF,
  FaGithub,
  FaHeart,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import {
  add_to_card,
  add_to_wishlist,
  messageClear,
} from "../store/Reducers/cardReducer";
import { product_details } from "../store/Reducers/homeReducer";
import Footer from "./Footer";
import Header from "./Header";
import Rating from "./Rating";
import Reviews from "./Reviews";

const ProductDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { slug } = useParams();

  const { product } = useSelector(state => state.home);
  const { userInfo } = useSelector(state => state.auth);
  const { successMessage, errorMessage } = useSelector(state => state.card);
  const [images, setImages] = useState([]);
  useEffect(() => {
    dispatch(product_details(slug));
  }, [slug]);
  useEffect(() => {
    setImages(product?.images);
  }, [product, slug]);

  const [color, setColor] = useState(0);
  const [size, setSize] = useState(0);
  const [state, setState] = useState("reviews");

  const [quantity, setQuantity] = useState(1);
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mdtablet: {
      breakpoint: { max: 991, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const CustomDotWrapper = props => {
    const { index, active } = props;
    return (
      <CustomDot
        {...props}
        image={images[index].image}
      />
    );
  };
  const CustomDot = ({ onClick, active, image }) => {
    return (
      <img
        onClick={onClick}
        src={image}
        alt=""
        style={{
          width: 60,
          height: 60,
          objectFit: "contain",
          padding: "3px",
          margin: "0 2.5px -0px 2.5px",
          border: active ? "1px solid black" : "none",
          borderRadius: "2px",
          cursor: "pointer",
          opacity: active ? 1 : 0.6,
          transition: "all 0.3s ease",
        }}
      />
    );
  };

  const CustomRightArrow = ({ onClick }) => {
    return (
      <button
        onClick={onClick}
        style={{
          position: "absolute",
          right: "3%",
          top: "40%",
          background: "transparent",
          border: "none",
          padding: "10px",
          zIndex: 2,
          cursor: "pointer",
          fontSize: "25px",
        }}>
        <FaArrowRightLong />
      </button>
    );
  };
  const CustomLeftArrow = ({ onClick }) => {
    return (
      <button
        onClick={onClick}
        style={{
          position: "absolute",
          left: "3%",
          top: "40%",
          background: "transparent",
          border: "none",
          padding: "10px",
          zIndex: 2,
          cursor: "pointer",
          fontSize: "25px",
        }}>
        <FaArrowLeftLong />
      </button>
    );
  };
  const inc = () => {
    if (quantity >= product.inventory) {
      toast.error("! مقدار بیشتر قابل قبول نیست");
    } else {
      setQuantity(quantity + 1);
    }
  };
  const dec = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const add_card = () => {
    if (userInfo) {
      dispatch(
        add_to_card({
          userId: userInfo.id,
          quantity,
          color: color,
          size: size,
          productId: product.id,
        })
      );
    } else {
      navigate("/login");
    }
  };
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);
  const add_wishlist = () => {
    if (userInfo) {
      dispatch(
        add_to_wishlist({
          product: [product.id],
        })
      );
    } else {
      navigate("/login");
    }
  };
  const buynow = () => {
    let price = 0;
    price = product.discounted_price;
    const obj = [
      {
        price: price * quantity,
        products: [
          {
            quantity,
            productInfo: product,
          },
        ],
      },
    ];
    navigate("/shipping", {
      state: {
        products: obj,
        price: price * quantity,
        shipping_fee: 50,
        items: quantity,
      },
    });
  };
  return (
    <div>
      <Header />

      <section>
        <div className="w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto pb-[62px] mt-5">
          <div className="grid grid-cols-2 md-lg:grid-cols-1 gap-8 md-lg:justify-center items-center">
            <div className="md-lg:flex md-lg:flex-col md-lg:justify-center md-lg:items-center">
              <div className="p-5 overflow-hidden w-full relative px-9 border flex justify-center items-center gap-[2px]">
                <div className="w-full h-[470px]">
                  {product?.images && (
                    <Carousel
                      customDot={<CustomDotWrapper />}
                      customLeftArrow={<CustomLeftArrow />}
                      customRightArrow={<CustomRightArrow />}
                      autoPlay={false}
                      infinite={true}
                      showDots
                      arrows
                      transitionDuration={500}
                      responsive={responsive}>
                      {product.images.map((img, i) => {
                        return (
                          <img
                            className="h-[400px] mb-[80px]"
                            key={i}
                            src={img.image}
                            alt=""
                          />
                        );
                      })}
                    </Carousel>
                  )}
                </div>

                <span className="rotate-45 absolute top-10 -right-24 px-32 py-[6px] bg-red-500">
                  {product?.promotion?.[0]}
                </span>
              </div>
            </div>
            <div
              className="flex flex-col gap-5"
              dir="rtl">
              <div className="text-3xl text-slate-600 font-bold">
                <h3>{product?.title}</h3>
              </div>

              <div className="text-2xl text-red-500 font-bold flex gap-3">
                {product?.promotion?.[0] !== undefined ? (
                  <>
                    <h2 className="flex gap-3">
                      قیمت :
                      {Math.round(product?.discounted_price * 100000) / 100000}$
                    </h2>
                  </>
                ) : (
                  <h2>قیمت : {product?.discounted_price}$</h2>
                )}
              </div>

              <div className="text-slate-600 ">
                <span className="flex gap-3 justify-start items-center mb-2">
                  رنگ :
                  {product?.color?.map((c, i) => {
                    return (
                      <h1
                        onClick={() => setColor(i)}
                        className={`${
                          color === i ? "bg-gray-400 text-white" : ""
                        } p-[6px] rounded-md cursor-pointer `}
                        key={i}>
                        {c}
                      </h1>
                    );
                  })}
                </span>
                <span className="flex gap-3 justify-start items-center">
                  سایز :
                  {product?.size?.map((s, i) => {
                    // i === 0 && setSize(s.size_number);
                    return (
                      <h1
                        onClick={() => setSize(i)}
                        className={`${
                          size === i ? "bg-gray-400 text-white" : ""
                        } p-[6px] rounded-md cursor-pointer`}
                        key={i}>
                        {s}
                      </h1>
                    );
                  })}
                </span>
              </div>
              <div className="text-slate-600 ">
                <p className="leading-relaxed font-bold">
                  <span className="font-normal">توضیحات : </span>
                  {product?.description?.split(/\s+/).slice(0, 40).join(" ")} .
                  . .
                </p>
              </div>
              <div className="flex gap-3 pb-6 border-b ">
                {product?.inventory ? (
                  <>
                    <div className="flex rounded-md bg-slate-200 h-[50px] justify-center items-center text-xl">
                      <div
                        onClick={dec}
                        className="px-6 cursor-pointer">
                        -
                      </div>
                      <div className="px-6 ">{quantity}</div>
                      <div
                        onClick={inc}
                        className="px-6 cursor-pointer">
                        +
                      </div>
                    </div>
                    <div className="">
                      <button
                        onClick={add_card}
                        className="px-8 w-max py-3 h-[50px] rounded-md cursor-pointer hover:shadow-lg hover:shadow-green-500/40 bg-[#059473] text-black">
                        افزودن به سبد خرید
                      </button>
                    </div>
                  </>
                ) : (
                  ""
                )}
                <div className="">
                  <div
                    onClick={add_wishlist}
                    className="h-[50px] w-[50px] rounded-md flex justify-center items-center cursor-pointer hover:shadow-lg hover:shadow-cyan-500/40 bg-cyan-500 text-white">
                    <FaHeart />
                  </div>
                </div>
              </div>
              <div className="flex py-5 gap-5">
                <div className="w-[150px] text-black font-bold text-xl flex flex-col gap-5">
                  <span>در دسترس</span>
                  <span>اشتراک گذاری در</span>
                </div>
                <div className="flex flex-col gap-5">
                  <span
                    className={`${
                      product?.inventory ? "text-green-500" : "text-red-500"
                    }`}>
                    {product?.inventory
                      ? `(${product.inventory})عدد`
                      : "اتمام موجودی"}
                  </span>
                  <ul className="flex justify-start items-center gap-3">
                    <li>
                      <a
                        className="w-[38px] h-[38px] hover:bg-[#059473] hover:text-white flex justify-center items-center bg-indigo-500 rounded-full text-white"
                        href="#">
                        <FaFacebookF />
                      </a>
                    </li>
                    <li>
                      <a
                        className="w-[38px] h-[38px] hover:bg-[#059473] hover:text-white flex justify-center items-center bg-cyan-500 rounded-full text-white"
                        href="#">
                        <FaTwitter />
                      </a>
                    </li>
                    <li>
                      <a
                        className="w-[38px] h-[38px] hover:bg-[#059473] hover:text-white flex justify-center items-center bg-purple-500 rounded-full text-white"
                        href="#">
                        <FaLinkedin />
                      </a>
                    </li>
                    <li>
                      <a
                        className="w-[38px] h-[38px] hover:bg-[#059473] hover:text-white flex justify-center items-center bg-blue-500 rounded-full text-white"
                        href="#">
                        <FaGithub />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3 ">
                {product?.inventory ? (
                  <button
                    onClick={buynow}
                    className="px-8 py-3 h-[50px] cursor-pointer hover:shadow-lg rounded-md hover:shadow-green-500/40 bg-[#247462] text-white">
                    خرید همین الان
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto pb-16">
          <div className="flex flex-wrap ">
            <div className="w-[72%] md-lg:w-full ">
              <div className="pr-4 md-lg:pr-0">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setState("reviews")}
                    className={`py-1 hover:text-white px-5 hover:bg-[#059473] ${
                      state === "reviews"
                        ? "bg-[#059473] text-white"
                        : "bg-slate-200 text-slate-700"
                    } rounded-sm`}>
                    نظرات
                  </button>
                  <button
                    onClick={() => setState("description")}
                    className={`py-1 hover:text-white px-5 hover:bg-[#059473] ${
                      state === "description"
                        ? "bg-[#059473] text-white"
                        : "bg-slate-200 text-slate-700"
                    } rounded-sm`}>
                    توضیحات
                  </button>
                </div>
                <div className="">
                  {state === "reviews" ? (
                    <Reviews product={product} />
                  ) : (
                    <p
                      className="py-5 text-slate-600 w-[95%] ml-[calc(5%-8px)]"
                      dir="rtl">
                      {product?.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="w-[28%] md-lg:w-full">
              <div className="pl-4 md-lg:pl-0">
                <div className="px-3 py-2 text-slate-600 bg-slate-200">
                  <h2 className="font-bold text-right">محصولات مرتبط</h2>
                </div>
                <div className="flex flex-col gap-5 mt-3 border p-3 ">
                  {[1, 2, 3].map((p, i) => {
                    return (
                      <Link
                        className="block"
                        key={i}>
                        <div className="relative h-[270px]">
                          <img
                            className="w-full h-full"
                            src={`http://localhost:3000/images/products/${p}.webp`}
                            alt=""
                          />
                          {product?.promotion?.[0] !== 0 && (
                            <div className="flex justify-center items-center absolute text-white w-[38px] h-[38px] rounded-full bg-red-500 font-semibold text-xs left-2 top-2">
                              {product?.promotion?.[0]}%
                            </div>
                          )}
                        </div>
                        <h2 className="text-slate-600 py-1 font-bold ">
                          Product Name
                        </h2>
                        <div className="flex gap-2 ">
                          <h2 className="text-lg font-bold text-slate-600">
                            $434
                          </h2>
                          <div className="flex items-center gap-2 ">
                            <Rating ratings={4.5} />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetails;
=======
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  FaFacebookF,
  FaGithub,
  FaHeart,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { IoIosCheckmark, IoIosClose } from "react-icons/io";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import {
  add_to_card,
  add_to_wishlist,
  messageClear,
} from "../store/Reducers/cardReducer";
import { product_details } from "../store/Reducers/homeReducer";
import Footer from "./Footer";
import Header from "./Header";
import Rating from "./Rating";
import Reviews from "./Reviews";

const ProductDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { slug } = useParams();

  const { product } = useSelector(state => state.home);
  const { userInfo } = useSelector(state => state.auth);
  const { successMessage, errorMessage } = useSelector(state => state.card);
  const [images, setImages] = useState([]);
  useEffect(() => {
    dispatch(product_details(slug));
  }, [slug]);
  useEffect(() => {
    setImages(product?.images);
  }, [product, slug]);

  const [color, setColor] = useState(0);
  const [size, setSize] = useState(0);
  const [state, setState] = useState("reviews");
  const textRef = useRef(null);
  const [quantity, setQuantity] = useState(1);
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mdtablet: {
      breakpoint: { max: 991, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const CustomDotWrapper = props => {
    const { index, active } = props;
    return (
      <CustomDot
        {...props}
        image={images[index].image}
      />
    );
  };
  const CustomDot = ({ onClick, active, image }) => {
    return (
      <img
        onClick={onClick}
        src={image}
        alt=""
        style={{
          width: 60,
          height: 60,
          objectFit: "contain",
          padding: "3px",
          margin: "0 2.5px -0px 2.5px",
          border: active ? "1px solid black" : "none",
          borderRadius: "2px",
          cursor: "pointer",
          opacity: active ? 1 : 0.6,
          transition: "all 0.3s ease",
        }}
      />
    );
  };

  const CustomRightArrow = ({ onClick }) => {
    return (
      <button
        onClick={onClick}
        style={{
          position: "absolute",
          right: "3%",
          top: "40%",
          background: "transparent",
          border: "none",
          padding: "10px",
          zIndex: 2,
          cursor: "pointer",
          fontSize: "25px",
        }}>
        <FaArrowRightLong />
      </button>
    );
  };
  const CustomLeftArrow = ({ onClick }) => {
    return (
      <button
        onClick={onClick}
        style={{
          position: "absolute",
          left: "3%",
          top: "40%",
          background: "transparent",
          border: "none",
          padding: "10px",
          zIndex: 2,
          cursor: "pointer",
          fontSize: "25px",
        }}>
        <FaArrowLeftLong />
      </button>
    );
  };
  const inc = () => {
    if (quantity >= product.inventory) {
      toast.error("! مقدار بیشتر قابل قبول نیست");
    } else {
      setQuantity(quantity + 1);
    }
  };
  const dec = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const add_card = () => {
    if (userInfo) {
      dispatch(
        add_to_card({
          userId: userInfo.id,
          quantity,
          color: color,
          size: size,
          productId: product.id,
        })
      );
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);
  const add_wishlist = () => {
    if (userInfo) {
      dispatch(
        add_to_wishlist({
          product: [product.id],
        })
      );
    } else {
      navigate("/login");
    }
  };
  const buynow = () => {
    let price = 0;
    price = product.discounted_price;
    const obj = [
      {
        price: price * quantity,
        products: [
          {
            quantity,
            productInfo: product,
          },
        ],
      },
    ];
    navigate("/shipping", {
      state: {
        products: obj,
        price: price * quantity,
        shipping_fee: 50,
        items: quantity,
      },
    });
  };
  const HandleClick = () => {
    setState("description");
    setTimeout(() => {
      if (textRef.current) {
        textRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 0);
  };
  return (
    <div>
      <div className="w-full relative bg-white flex min-[1200px]:px-[150px] flex-col justify-center items-center">
        <div className="w-full absolute left-0 top-0 h-[70px] bg-black"></div>
        <div className="min-[800px]:px-20 pt-8 w-full px-7">
          <Header />
        </div>
      </div>

      <section>
        <div className="w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto pb-[62px] mt-5">
          <div className="grid grid-cols-2 md-lg:grid-cols-1 gap-8 md-lg:justify-center items-center">
            <div className="md-lg:flex md-lg:flex-col md-lg:justify-center md-lg:items-center">
              <div className="p-5 overflow-hidden w-full relative px-9 border flex justify-center items-center gap-[2px]">
                <div
                  className={`w-full  ${
                    product.images?.length > 1 ? "h-[470px]" : "h-[380px]"
                  }`}>
                  {product.images?.length > 1 ? (
                    <Carousel
                      customDot={<CustomDotWrapper />}
                      customLeftArrow={<CustomLeftArrow />}
                      customRightArrow={<CustomRightArrow />}
                      autoPlay={false}
                      infinite={true}
                      showDots
                      arrows
                      transitionDuration={500}
                      responsive={responsive}>
                      {product.images.map((img, i) => {
                        return (
                          <img
                            className="h-[400px] mb-[80px]"
                            key={i}
                            src={img.image}
                            alt=""
                          />
                        );
                      })}
                    </Carousel>
                  ) : (
                    <img
                      src={product.images?.[0].image}
                      alt=""></img>
                  )}
                </div>

                <span
                  className="absolute bg-[#111111] text-[#EDEEF4] w-[45px] rounded-full flex
                        items-center justify-center top-4 right-4 h-[45px] font-bold text-[14px]">
                  {product.promotion?.[0]}%
                </span>
              </div>
            </div>
            <div
              className="flex flex-col gap-5"
              dir="rtl">
              <div className="text-3xl text-slate-600 font-bold">
                <h3>{product?.title}</h3>
              </div>

              <div className="text-2xl text-red-500 font-bold flex gap-3">
                {product?.promotion?.[0] !== undefined ? (
                  <>
                    <h2 className="flex gap-3">
                      قیمت :
                      {Math.round(product?.discounted_price * 100000) / 100000}$
                    </h2>
                  </>
                ) : (
                  <h2>قیمت : {product?.discounted_price}$</h2>
                )}
              </div>

              <div className="text-slate-600 ">
                <span className="flex gap-3 justify-start items-center mb-2">
                  رنگ :
                  {product?.color?.map((c, i) => {
                    return (
                      <h1
                        onClick={() => setColor(i)}
                        className={`${
                          color === i ? "bg-gray-400 text-white" : ""
                        } p-[6px] rounded-md cursor-pointer `}
                        key={i}>
                        {c}
                      </h1>
                    );
                  })}
                </span>
                <span className="flex gap-3 justify-start items-center">
                  سایز :
                  {product?.size?.map((s, i) => {
                    // i === 0 && setSize(s.size_number);
                    return (
                      <h1
                        onClick={() => setSize(i)}
                        className={`${
                          size === i ? "bg-gray-400 text-white" : ""
                        } p-[6px] rounded-md cursor-pointer`}
                        key={i}>
                        {s}
                      </h1>
                    );
                  })}
                </span>
              </div>
              <div className="text-slate-600 ">
                <p className="leading-relaxed font-bold">
                  <span className="font-normal">توضیحات : </span>
                  {product?.description
                    ?.split(/\s+/)
                    .slice(0, 40)
                    .join(" ")}{" "}
                  <span
                    onClick={() => {
                      HandleClick();
                    }}
                    className="text-black font-semibold cursor-pointer">
                    ادامه مطلب
                  </span>
                </p>
              </div>
              <div className="flex gap-3 pb-6 border-b ">
                {product?.inventory ? (
                  <>
                    <div className="flex rounded-md bg-slate-200 h-[50px] justify-center items-center text-xl">
                      <div
                        onClick={dec}
                        className="px-6 cursor-pointer">
                        -
                      </div>
                      <div className="px-6 ">{quantity}</div>
                      <div
                        onClick={inc}
                        className="px-6 cursor-pointer">
                        +
                      </div>
                    </div>
                    <div className="">
                      <button
                        onClick={add_card}
                        className="px-8 w-max py-3 h-[50px] rounded-md cursor-pointer hover:shadow-lg  hover:shadow-black/40 bg-black text-white">
                        افزودن به سبد خرید
                      </button>
                    </div>
                  </>
                ) : (
                  ""
                )}
                <div className="">
                  <div
                    onClick={add_wishlist}
                    className="h-[50px] w-[50px] rounded-md flex justify-center items-center cursor-pointer hover:shadow-lg hover:shadow-black/40 bg-white text-black">
                    <FaHeart />
                  </div>
                </div>
              </div>
              <div className="flex py-5 gap-5 justify-start items-start">
                <div className="w-[150px] text-black font-bold text-xl flex flex-col gap-5 ">
                  <span>در دسترس</span>
                  <span>اشتراک گذاری در</span>
                </div>
                <div className="flex flex-col gap-4">
                  {product.inventory ? (
                    <span
                      className={`text-[38px] hover:text-white flex justify-center items-center bg-black rounded-full text-white w-fit`}>
                      <IoIosCheckmark />
                    </span>
                  ) : (
                    <span
                      className={`text-[38px] hover:text-white flex justify-center items-center bg-black rounded-full text-white w-fit`}>
                      <IoIosClose />
                    </span>
                  )}
                  <ul className="flex justify-start items-center gap-3">
                    <li>
                      <a
                        className="w-[38px] h-[38px] hover:bg-[#059473] hover:text-white flex justify-center items-center bg-black rounded-full text-white"
                        href="#">
                        <FaFacebookF />
                      </a>
                    </li>
                    <li>
                      <a
                        className="w-[38px] h-[38px] hover:bg-[#059473] hover:text-white flex justify-center items-center bg-black rounded-full text-white"
                        href="#">
                        <FaTwitter />
                      </a>
                    </li>
                    <li>
                      <a
                        className="w-[38px] h-[38px] hover:bg-[#059473] hover:text-white flex justify-center items-center bg-black rounded-full text-white"
                        href="#">
                        <FaLinkedin />
                      </a>
                    </li>
                    <li>
                      <a
                        className="w-[38px] h-[38px] hover:bg-[#059473] hover:text-white flex justify-center items-center bg-black rounded-full text-white"
                        href="#">
                        <FaGithub />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3 ">
                {product?.inventory ? (
                  <button
                    onClick={buynow}
                    className="px-8 py-3 h-[50px] cursor-pointer hover:shadow-lg rounded-md hover:shadow-green-500/40 bg-[#247462] text-white">
                    خرید همین الان
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto pb-16">
          <div className="flex flex-wrap ">
            <div className="w-[72%] md-lg:w-full ">
              <div className="pr-4 md-lg:pr-0">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setState("reviews")}
                    className={`py-1 hover:text-white px-5 hover:bg-[#059473] ${
                      state === "reviews"
                        ? "bg-[#059473] text-white"
                        : "bg-slate-200 text-slate-700"
                    } rounded-sm`}>
                    نظرات
                  </button>
                  <button
                    onClick={() => setState("description")}
                    className={`py-1 hover:text-white px-5 hover:bg-[#059473] ${
                      state === "description"
                        ? "bg-[#059473] text-white"
                        : "bg-slate-200 text-slate-700"
                    } rounded-sm`}>
                    توضیحات
                  </button>
                </div>
                <div className="">
                  {state === "reviews" ? (
                    <Reviews product={product} />
                  ) : (
                    <p
                      ref={textRef}
                      className="py-5 text-slate-600 w-[95%] ml-[calc(5%-8px)]"
                      dir="rtl">
                      {product?.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="w-[28%] md-lg:w-full">
              <div className="pl-4 md-lg:pl-0">
                <div className="px-3 py-2 text-slate-600 bg-slate-200">
                  <h2 className="font-bold text-right">محصولات مرتبط</h2>
                </div>
                <div className="flex flex-col gap-5 mt-3 border p-3 ">
                  {[1, 2, 3].map((p, i) => {
                    return (
                      <Link
                        className="block"
                        key={i}>
                        <div className="relative h-[270px]">
                          <img
                            className="w-full h-full"
                            src={`http://localhost:3000/images/products/${p}.webp`}
                            alt=""
                          />
                          {product?.promotion?.[0] !== 0 && (
                            <div className="flex justify-center items-center absolute text-white w-[38px] h-[38px] rounded-full bg-red-500 font-semibold text-xs left-2 top-2">
                              {product?.promotion?.[0]}%
                            </div>
                          )}
                        </div>
                        <h2 className="text-slate-600 py-1 font-bold ">
                          Product Name
                        </h2>
                        <div className="flex gap-2 ">
                          <h2 className="text-lg font-bold text-slate-600">
                            $434
                          </h2>
                          <div className="flex items-center gap-2 ">
                            <Rating ratings={4.5} />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetails;
>>>>>>> 86be6a8 (.)
