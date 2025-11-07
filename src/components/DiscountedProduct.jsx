import { useEffect, useRef } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { get_product_display } from "../store/Reducers/productDisplayReducer";

const DiscountedProduct = () => {
  const dispatch = useDispatch();
  const sliderRef = useRef(null);
  useEffect(() => {
    dispatch(get_product_display("products"));
  }, []);

  const { product_display, total_items } = useSelector(
    state => state.productDisplay
  );

  const scroll = dir => {
    if (!sliderRef.current) return;
    const amount = 280;
    sliderRef.current.scrollLeft += dir === "right" ? amount : -amount;
  };
  return (
    <div className="w-full flex justify-center items-center mt-7">
      <div className="w-full py-5 flex justify-center items-center flex-col">
        <div className="w-full flex justify-center items-center px-7 min-[500px]:hidden">
          <div className="mb-10 border-b-2 border-black border-t-2 py-4">
            <h2 className="text-[25px] font-bold">محصولات تخفیف دار</h2>
          </div>
        </div>
        <div className="w-full flex justify-center overflow-hidden">
          <div
            dir="rtl"
            className="min-[500px]:w-[calc(100%-130px)] min-[800px]:w-[calc(100%-250px)] w-full flex justify-start relative gap-10 items-center p-7 bg-[#EDEEF4] rounded-l-md">
            <div className="w-full flex justify-center items-center relative">
              <button
                onClick={() => scroll("left")}
                className="bg-[#ffffff] absolute left-[0] z-50 shadow-gray-500 text-black text-[20px] rounded-full w-10 h-10 flex items-center justify-center shadow-md">
                ›
              </button>
              <div
                ref={sliderRef}
                className="scroll-smooth overflow-x-hidden slider-container flex justify-start items-center gap-10">
                {product_display?.map((i, j) => (
                  <Link
                    to={`/product/${i.url.slice(-4)}`}
                    dir="ltr"
                    className="min-w-[240px] w-[240px] bg-white group hover:-translate-y-3 duration-500 rounded-md shadow-md pb-5 cursor-pointer flex justify-center gap-5 items-center flex-col">
                    <div className="w-full relative flex flex-col overflow-hidden justify-center items-center after:mt-[-2px] after:mx-auto after:h-[1px] after:bg-black after:w-full">
                      <img
                        src={i.images?.[0].image}
                        alt="img product"
                        className="w-full h-[190px] rounded-t-md"
                      />
                      <span
                        className="absolute bg-[#111111] text-[#EDEEF4] w-[40px] rounded-full flex
                        items-center justify-center top-2 right-2 h-[40px] font-bold text-[14px]">
                        {i.promotion?.[0]}%
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
                      <span
                        dir="rtl"
                        className="text-[14px]">
                        {i.unit_price} تومان
                      </span>
                      <span
                        dir="rtl"
                        className="line-through text-[14px] text-gray-600">
                        ۴۵۰۰۰۰۰۰ تومان
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              <button
                onClick={() => scroll("right")}
                className="bg-[#ffffff] text-gray-500 text-[20px] shadow-md shadow-black absolute right-0 rounded-full w-10 h-10 flex items-center justify-center">
                ‹
              </button>
            </div>
          </div>
          <div
            dir="rtl"
            className="min-[800px]:w-[250px] min-[500px]:flex rounded-r-md w-[130px] px-3 min-[800px]:px-7 hidden justify-center items-center bg-[#EDEEF4]">
            <div className="w-full flex flex-col gap-20 justify-center items-center">
              <div className="w-full">
                <h2 className="text-[25px] font-bold">محصولات تخفیف دار</h2>
              </div>
              <div className="w-full">
                <Link
                  to={`/products-discount/products`}
                  className="text-[18px] flex justify-start gap-3 items-center">
                  مشاهده همه
                  <span className="text-[25px]">
                    <IoIosArrowRoundBack />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center mt-5 items-center min-[500px]:hidden">
          <Link
            to={`/products-discount/products`}
            className="text-[18px] flex justify-start gap-3 items-center">
            مشاهده همه
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DiscountedProduct;
