import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

const Card = () => {
  return (
    <>
      <div className="px-7 pb-6 min-[900px]:px-20 min-[1200px]:px-[150px] w-full relative">
        <div className="w-full absolute left-0 top-0 h-[70px] bg-black"></div>
        <div className="min-[800px]:px-20 pt-8 w-full px-7">
          <Header />
        </div>
        <section className="bg-white w-full min-[800px]:px-20 px-7 pt-10">
          <div className="w-full">
            {5 > 0 || 5 > 0 ? (
              <div className="flex flex-wrap">
                <div className="min-[800px]:w-[55%] w-full min-[1200px]:w-[65%]">
                  <div className="pr-3">
                    <div className="flex flex-col gap-3">
                      {5 > 0 && (
                        <div className="bg-white p-4">
                          <h2 className="text-md text-[#111111] font-semibold">
                            محصولات موجود 5
                          </h2>
                        </div>
                      )}
                      <div className="w-full flex flex-wrap justify-start items-center gap-10">
                        {[1, 2, 3, 4, 5].map((i, j) => (
                          <Link
                            dir="ltr"
                            className="bg-white w-[300px] min-[800px]:w-[250px] group hover:-translate-y-3 duration-500 shadow-md pb-6 cursor-pointer rounded-md flex justify-center gap-5 items-center flex-col">
                            <div className="w-full relative flex flex-col justify-center items-center">
                              <img
                                src="http://localhost:3000/image/banner/2.jpg"
                                className="w-full h-[250px] rounded-t-md"
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
                                <p className="font-semibold">
                                  کت و شلوار ۴ دکمه
                                </p>
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
                              <span dir="rtl">۴۵۰۰۰۰۰۰ تومان</span>
                              <div className="flex gap-2 flex-col w-full">
                                <div className="flex rounded-md bg-[#EDEEF4] h-[30px] w-full justify-center items-start text-xl">
                                  <div className="px-3 flex justify-center w-3/12 items-center cursor-pointer">
                                    -
                                  </div>
                                  <div className="px-3 flex justify-center items-center w-6/12">
                                    1
                                  </div>
                                  <div className="px-3 flex justify-center items-center w-3/12 cursor-pointer">
                                    +
                                  </div>
                                </div>
                                <button className="px-5 py-[3px] rounded-md bg-[#111111] text-white">
                                  پاک کردن
                                </button>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>

                      {5 > 0 && (
                        <div className="flex flex-col gap-3">
                          <div className="bg-white p-4">
                            <h2 className="text-md text-red-500 font-semibold">
                              محصولات ناموجود 5
                            </h2>
                          </div>
                          <div className="w-full flex flex-wrap justify-start items-center gap-10">
                            {[1, 2, 3, 4, 5].map((i, j) => (
                              <Link
                                dir="ltr"
                                className="bg-white w-[300px] min-[800px]:w-[250px] group hover:-translate-y-3 duration-500 shadow-md pb-6 cursor-pointer rounded-md flex justify-center gap-5 items-center flex-col">
                                <div className="w-full relative flex flex-col justify-center items-center">
                                  <img
                                    src="http://localhost:3000/image/banner/2.jpg"
                                    className="w-full h-[250px] rounded-t-md"
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
                                    <p className="font-semibold">
                                      کت و شلوار ۴ دکمه
                                    </p>
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
                                  <span dir="rtl">۴۵۰۰۰۰۰۰ تومان</span>
                                  <div className="flex gap-2 flex-col w-full">
                                    <div className="flex bg-[#EDEEF4] h-[30px] w-full rounded-md justify-center items-start text-xl">
                                      <div className="px-3 flex justify-center w-3/12 items-center cursor-pointer">
                                        -
                                      </div>
                                      <div className="px-3 flex justify-center items-center w-6/12">
                                        1
                                      </div>
                                      <div className="px-3 flex justify-center items-center w-3/12 cursor-pointer">
                                        +
                                      </div>
                                    </div>
                                    <button className="px-5 py-[3px] bg-[#111111] text-white rounded-md">
                                      پاک کردن
                                    </button>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="min-[800px]:w-[45%] w-full min-[1200px]:w-[35%]">
                  <div
                    dir="rtl"
                    className="min-[800px]:pl-3 pl-0 max-[800px]:mt-5">
                    {5 > 0 && (
                      <div className="bg-white p-3 text-slate-600 flex flex-col gap-3">
                        <h2 className="text-xl font-bold">فاکتور خرید</h2>
                        <div className="flex justify-between items-center">
                          <span dir="ltr">۱ تعداد</span>
                          <span>۵۰۰ تومان</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>هزینه ارسال</span>
                          <span>120 تومان</span>
                        </div>
                        <div className="flex gap-2">
                          <input
                            className="w-full px-3 py-2 border border-slate-200 outline-none 
                                            focus:border-[#111111] rounded-md"
                            type="text"
                            placeholder="کد تخفیف"
                          />
                          <button className="px-5 py-[1px] bg-[#111111] text-white rounded-md flex justify-center items-center uppercase text-sm">
                            اعمال
                          </button>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>مجموع</span>
                          <span className="text-lg text-[#111111]">600</span>
                        </div>
                        <button
                          className="px-5 py-[10px] rounded-md hover:shadow-black
                                            hover:shadow-lg bg-[#111111] text-sm uppercase text-white">
                          ارسال 5 محصول برای پرداخت
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <Link
                  className="px-4 py-1 bg-[#111111] text-white"
                  to="/">
                  Home
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Card;
