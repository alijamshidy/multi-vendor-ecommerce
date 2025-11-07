<<<<<<< HEAD
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { get_products } from "../store/Reducers/homeReducer";

const NewProducts = () => {
  const dispatch = useDispatch();

  const { products } = useSelector(state => state.home);
  let showProduct = [];
  for (let i = 0; i < products?.results?.length && i < 6; i++) {
    showProduct.push(products?.results?.[i]);
  }
  console.log(showProduct, products);
  useEffect(() => {
    dispatch(get_products());
  }, []);

  const sliderRef = useRef(null);

  const scroll = dir => {
    if (!sliderRef.current) return;
    const amount = 340;
    sliderRef.current.scrollLeft += dir === "right" ? amount : -amount;
  };

  return (
    <div className="w-full flex justify-center min-[500px]:px-20 px-10 items-center mt-7 overflow-hidden">
      <div className="w-full py-5">
        <div className="w-full flex flex-col gap-5 justify-center items-center">
          <div className="w-full flex justify-center items-center px-7">
            <div className="mb-10 border-b-2 border-black border-t-2 py-4">
              <h2 className="text-[25px] font-bold">محصولات جدید</h2>
            </div>
          </div>
          <div className="w-full justify-center flex relative items-center">
            <button
              onClick={() => scroll("left")}
              className="bg-[#EDEEF4] z-40 absolute left-0 shadow-md shadow-gray-500 text-black text-[20px] rounded-full w-10 h-10 flex items-center justify-center">
              ‹
            </button>
            <div
              dir="rtl"
              ref={sliderRef}
              className="w-[300] min-[800px]:w-[100%] px-3 flex scroll-smooth slider-container justify-start py-2 gap-10 items-center overflow-x-auto">
              {showProduct?.map((i, j) => (
                <Link
                  dir="ltr"
                  className="bg-white min-w-[300px] min-[800px]:min-w-[250px] group hover:-translate-y-3 duration-500 shadow-md pb-6 cursor-pointer rounded-md flex justify-center gap-5 items-center flex-col">
                  <div className="w-full relative flex flex-col justify-center items-center">
                    <img
                      src={i.images?.[0].image}
                      className="w-[300px] h-[250px] rounded-t-md"
                      alt="product img"
                    />
                    <span
                      className="absolute bg-[#111111] text-[#EDEEF4] w-[40px] rounded-full flex
                  items-center justify-center top-2 right-2 h-[40px] font-bold text-[14px]">
                      جدید
                    </span>
                  </div>
                  <div className="flex w-full justify-center px-8 gap-4 text-start items-start flex-col">
                    <div className="w-full flex justify-end items-center">
                      <p className="font-semibold">{i.title}</p>
                    </div>
                    <div className="w-full flex justify-end items-center">
                      <span
                        dir="ltr"
                        className={`text-[13px] ${
                          5 > 6 ? "text-black" : "text-red-700"
                        }`}>
                        {5 > 6
                          ? "موجود در انبار"
                          : "تنها ۱ عدد در انبار باقی مانده"}
                      </span>
                    </div>
                    <span dir="rtl">{i.unit_price} تومان</span>
                  </div>
                </Link>
              ))}
            </div>
            <button
              onClick={() => scroll("right")}
              className="bg-[#EDEEF4] text-black text-[20px] absolute right-0 shadow-md shadow-gray-500 rounded-full w-10 h-10 flex items-center justify-center">
              ›
            </button>
          </div>
          <div className="w-full flex mt-5 font-semibold justify-center items-center">
            <Link to={`/display-products/product`}>مشاهد محصولات بیشتر</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProducts;
=======
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { get_products } from "../store/Reducers/homeReducer";

const NewProducts = () => {
  const dispatch = useDispatch();
  const getTextBetweenLastSlashes = str => {
    const regex = /\/([^\/]+)\/[^\/]*$/;
    const match = str.match(regex);
    return match ? match[1] : null; // اگر چیزی پیدا شد، بخش بین دو اسلش را برمی‌گرداند
  };
  const { products } = useSelector(state => state.home);
  let showProduct = [];

  for (let i = 0; i < products?.length && i < 6; i++) {
    showProduct.push(products?.[i]);
  }
  useEffect(() => {
    dispatch(get_products());
  }, []);

  const sliderRef = useRef(null);

  const scroll = dir => {
    if (!sliderRef.current) return;
    const amount = 340;
    sliderRef.current.scrollLeft += dir === "right" ? amount : -amount;
  };

  return (
    <div className="w-full flex justify-center min-[500px]:px-20 px-10 items-center mt-7 overflow-hidden">
      <div className="w-full py-5">
        <div className="w-full flex flex-col gap-5 justify-center items-center">
          <div className="w-full flex justify-center items-center px-7">
            <div className="mb-10 border-b-2 border-black border-t-2 py-4">
              <h2 className="text-[25px] font-bold">محصولات جدید</h2>
            </div>
          </div>
          <div className="w-full justify-center flex relative items-center">
            <button
              onClick={() => scroll("left")}
              className="bg-[#EDEEF4] z-40 absolute left-0 shadow-md shadow-gray-500 text-black text-[20px] rounded-full w-10 h-10 flex items-center justify-center">
              ‹
            </button>
            <div
              dir="rtl"
              ref={sliderRef}
              className="w-[300] min-[800px]:w-[100%] px-3 flex scroll-smooth slider-container justify-start py-2 gap-10 items-center overflow-x-auto">
              {showProduct?.map((i, j) => (
                <Link
                  to={"/product/" + getTextBetweenLastSlashes(i.url)}
                  dir="ltr"
                  className="bg-white min-w-[300px] min-[800px]:min-w-[250px] group hover:-translate-y-3 duration-500 shadow-md pb-6 cursor-pointer rounded-md flex justify-center gap-5 items-center flex-col">
                  <div className="w-full relative flex flex-col justify-center items-center">
                    <img
                      src={i.images?.[0].image}
                      className="w-[300px] h-[250px] rounded-t-md"
                      alt="product img"
                    />
                    <span
                      className="absolute bg-[#111111] text-[#EDEEF4] w-[40px] rounded-full flex
                  items-center justify-center top-2 right-2 h-[40px] font-bold text-[14px]">
                      جدید
                    </span>
                  </div>
                  <div className="flex w-full justify-center px-8 gap-4 text-start items-start flex-col">
                    <div className="w-full flex justify-end items-center">
                      <p className="font-semibold">{i.title}</p>
                    </div>
                    <div className="w-full flex justify-end items-center">
                      <span
                        dir="ltr"
                        className={`text-[13px] ${
                          5 > 6 ? "text-black" : "text-red-700"
                        }`}>
                        {5 > 6
                          ? "موجود در انبار"
                          : "تنها ۱ عدد در انبار باقی مانده"}
                      </span>
                    </div>
                    <span dir="rtl">{i.unit_price} تومان</span>
                  </div>
                </Link>
              ))}
            </div>
            <button
              onClick={() => scroll("right")}
              className="bg-[#EDEEF4] text-black text-[20px] absolute right-0 shadow-md shadow-gray-500 rounded-full w-10 h-10 flex items-center justify-center">
              ›
            </button>
          </div>
          <div className="w-full flex mt-5 font-semibold justify-center items-center">
            <Link to={`/display-products/product`}>مشاهد محصولات بیشتر</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProducts;
>>>>>>> 86be6a8 (.)
