<<<<<<< HEAD
import Rating from "./Rating";

const ShopProduct = ({ styles, product }) => {
  return (
    <div className={`flex justify-center items-center gap-5 flex-wrap`}>
      {product.map((item, i) => (
        <div
          key={i}
          className={`${
            styles === "grid" ? "w-[340px]" : "w-full"
          } cursor-pointer`}>
          <div
            className={`group ${
              styles === "grid"
                ? "flex-col justify-center items-center pb-5"
                : "items-start justify-start"
            } rounded-md border-[1px] gap-5 shadow-md flex hover:-translate-y-3 duration-500`}>
            <div
              className={`${
                styles === "grid" ? "w-full" : "w-[400px]"
              } flex overflow-hidden flex-col justify-center items-center relative ${
                styles === "grid"
                  ? "after:mt-[-2px] after:mx-auto after:w-full after:h-[1px] after:bg-black"
                  : "relative after:absolute after:right-0 after:h-full after:w-[1px] after:bg-black after:mx-auto"
              }`}>
              <img
                src={item.images?.[0].image}
                alt="img"
                className={`${
                  styles === "grid" ? "h-[350px]" : "h-[250px]"
                } w-full rounded-t-md after:w-full after:h-[1px] after:bg-black`}
              />
              {/* <span className='absolute bg-[#111111] text-[#EDEEF4] w-[40px] rounded-full flex
                          items-center justify-center top-2 right-2 h-[40px] font-bold text-[14px]'>
                              جدید
                          </span> */}
            </div>
            <div className="flex w-full justify-center px-8 gap-4 text-start items-start flex-col">
              <div className="w-full flex justify-end items-center">
                <p className="font-semibold">{item.title}</p>
              </div>
              <div className="w-full flex justify-end items-center">
                <span
                  dir="ltr"
                  className={`text-[13px] ${
                    5 > 6 ? "text-black" : "text-red-700"
                  }`}>
                  {5 > 6 ? "موجود در انبار" : "تنها ۱ عدد در انبار باقی مانده"}
                </span>
              </div>
              <span dir="rtl">{item.unit_price} تومان</span>
              <div className="flex">
                <Rating ratings={item.ratings_summary?.average} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShopProduct;
=======
import Rating from "./Rating";

const ShopProduct = ({ styles, product }) => {
  return (
    <div className={`flex justify-center items-center gap-5 flex-wrap`}>
      {product.map((item, i) => (
        <div
          key={i}
          className={`${
            styles === "grid" ? "w-[340px]" : "w-full"
          } cursor-pointer`}>
          <div
            className={`group ${
              styles === "grid"
                ? "flex-col justify-center items-center pb-5"
                : "items-start justify-start"
            } rounded-md border-[1px] gap-5 shadow-md flex hover:-translate-y-3 duration-500`}>
            <div
              className={`${
                styles === "grid" ? "w-full" : "w-[400px]"
              } flex overflow-hidden flex-col justify-center items-center relative ${
                styles === "grid"
                  ? "after:mt-[-2px] after:mx-auto after:w-full after:h-[1px] after:bg-black"
                  : "relative after:absolute after:right-0 after:h-full after:w-[1px] after:bg-black after:mx-auto"
              }`}>
              <img
                src={item.images?.[0].image}
                alt="img"
                className={`${
                  styles === "grid" ? "h-[350px]" : "h-[250px]"
                } w-full rounded-t-md after:w-full after:h-[1px] after:bg-black`}
              />
              {/* <span className='absolute bg-[#111111] text-[#EDEEF4] w-[40px] rounded-full flex
                          items-center justify-center top-2 right-2 h-[40px] font-bold text-[14px]'>
                              جدید
                          </span> */}
            </div>
            <div className="flex w-full justify-center px-8 gap-4 text-start items-start flex-col">
              <div className="w-full flex justify-end items-center">
                <p className="font-semibold">{item.title}</p>
              </div>
              <div className="w-full flex justify-end items-center">
                <span
                  dir="ltr"
                  className={`text-[13px] ${
                    5 > 6 ? "text-black" : "text-red-700"
                  }`}>
                  {5 > 6 ? "موجود در انبار" : "تنها ۱ عدد در انبار باقی مانده"}
                </span>
              </div>
              <span dir="rtl">{item.unit_price} تومان</span>
              <div className="flex">
                <Rating ratings={item.ratings_summary?.average} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShopProduct;
>>>>>>> 86be6a8 (.)
