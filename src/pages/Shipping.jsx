<<<<<<< HEAD
import { useState } from "react";

import Footer from "../components/Footer";
import Header from "../components/Header";
const Shipping = () => {
  const [res, setRes] = useState(true);
  const [state, setState] = useState({
    name: "",
    address: "",
    phone: "",
    post: "",
    province: "",
    city: "",
    area: "",
  });

  const inputHandel = e => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <div className="px-7 pb-6 min-[900px]:px-20 min-[1200px]:px-[150px] w-full relative">
        <div className="w-full absolute left-0 top-0 h-[70px] bg-black"></div>
        <div className="min-[800px]:px-20 pt-8 w-full px-7">
          <Header />
        </div>
        <section className="bg-white">
          <div className="w-full px-7 min-[800px]:px-20 mx-auto py-16">
            <div className="w-full flex flex-wrap">
              <div className="min-[1100px]:w-[67%] w-full">
                <div className="flex flex-col gap-3">
                  <div className="bg-white p-6 shadow-md rounded-md">
                    <h2 className="text-slate-600 font-bold pb-3">
                      اطلاعات خرید
                    </h2>
                    {!res && (
                      <>
                        <form>
                          <div className="flex md:flex-col md:gap-2 w-full gap-5 text-slate-600">
                            <div className="flex flex-col gap-1 mb-2 w-full">
                              <label htmlFor="name">اسم</label>
                              <input
                                onChange={inputHandel}
                                defaultValue={state.name}
                                type="text"
                                className="w-full px-3 py-2 border rounded-md border-slate-200 outline-none focus:border-green-500"
                                name="name"
                                id="name"
                                placeholder="اسم"
                              />
                            </div>
                          </div>
                          <div className="flex md:flex-col md:gap-2 w-full gap-5 text-slate-600">
                            <div className="flex flex-col gap-1 mb-2 w-full">
                              <label htmlFor="address">آدرس</label>
                              <input
                                onChange={inputHandel}
                                defaultValue={state.address}
                                type="text"
                                className="w-full px-3 py-2 border rounded-md border-slate-200 outline-none focus:border-green-500"
                                name="address"
                                id="address"
                                placeholder="ادرس"
                              />
                            </div>
                          </div>
                          <div className="flex md:flex-col md:gap-2 w-full gap-5 text-slate-600">
                            <div className="flex flex-col gap-1 mb-2 w-full">
                              <label htmlFor="phone">شماره موبایل</label>
                              <input
                                onChange={inputHandel}
                                defaultValue={state.phone}
                                type="text"
                                className="w-full px-3 py-2 border rounded-md border-slate-200 outline-none focus:border-green-500"
                                name="phone"
                                id="phone"
                                placeholder="شماره موبایل"
                              />
                            </div>
                          </div>
                          <div className="flex md:flex-col md:gap-2 w-full gap-5 text-slate-600">
                            <div className="flex flex-col gap-1 mb-2 w-full">
                              <label htmlFor="post">کد پستی</label>
                              <input
                                onChange={inputHandel}
                                defaultValue={state.post}
                                type="text"
                                className="w-full px-3 py-2 border rounded-md border-slate-200 outline-none focus:border-green-500"
                                name="post"
                                id="post"
                                placeholder="کد پستی"
                              />
                            </div>
                          </div>
                          <div className="flex md:flex-col md:gap-2 w-full gap-5 text-slate-600">
                            <div className="flex flex-col gap-1 mb-2 w-full">
                              <label htmlFor="province">استان</label>
                              <input
                                onChange={inputHandel}
                                defaultValue={state.province}
                                type="text"
                                className="w-full px-3 py-2 border rounded-md border-slate-200 outline-none focus:border-green-500"
                                name="province"
                                id="province"
                                placeholder="استان"
                              />
                            </div>
                          </div>
                          <div className="flex md:flex-col md:gap-2 w-full gap-5 text-slate-600">
                            <div className="flex flex-col gap-1 mb-2 w-full">
                              <label htmlFor="city">شهر</label>
                              <input
                                onChange={inputHandel}
                                defaultValue={state.city}
                                type="text"
                                className="w-full px-3 py-2 border rounded-md border-slate-200 outline-none focus:border-green-500"
                                name="city"
                                id="city"
                                placeholder="شهر"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-1 mt-7 mb-2 w-full">
                            <button className="px-3 text-white py-3 rounded-md hover:shadow-black hover:shadow-lg bg-[#111111]">
                              ذخیره کردن
                            </button>
                          </div>
                        </form>
                      </>
                    )}
                    {res && (
                      <div className="flex flex-col gap-1">
                        <h2 className="text-slate-600 font-semibold pb-2">
                          تحویل به{" "}
                        </h2>
                        <p>
                          <span className="bg-[#111111] text-white text-sm font-medium mr-2 px-2 py-1 rounded">
                            خانه
                          </span>
                          <span>phone, address province city area</span>
                          <span
                            onClick={() => setRes(false)}
                            className="text-indigo-500 cursor-pointer ml-2">
                            عوض کردن
                          </span>
                        </p>
                        <p className="text-slate-600 mt-5 text-sm">
                          ادرس ایمیل :
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="w-full flex flex-wrap justify-start items-center gap-10">
                    {[1, 2, 3, 4, 5].map((i, j) => (
                      <div
                        key={i}
                        className="w-full flex flex-wrap border border-gray-200 shadow-md rounded-md p-5">
                        <div className="flex sm:w-full gap-2 w-7/12">
                          <div className="flex gap-2 justify-start items-center">
                            <img
                              className="w-[80px] h-[80px]"
                              src="http://localhost:3000/image/banner/2.jpg"
                              alt="img"
                            />
                            <div className="pr-4 text-slate-600">
                              <h2 className="text-md font-semibold">name</h2>
                              <span className="text-sm">Brand: gildur</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between w-5/12 sm:w-full sm:mt-3">
                          <div className="pl-4 sm:pl-0">
                            <h2 className="text-lg text-red-600">۱۵۰ تومان</h2>
                            <p className="line-through">۲۰۰ تومان</p>
                            <p>-۱۰%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="min-[1100px]:w-[33%] w-full">
                <div className="min-[1100px]:ml-5 ml-0 max-[1100px]:mt-5 rounded-md shadow-md">
                  {5 > 0 && (
                    <div className="bg-white p-3 text-slate-600 flex flex-col gap-3">
                      <h2 className="text-xl font-bold">خلاصه خرید</h2>
                      <div className="flex justify-between items-center">
                        <span>تعداد محصولات (۱)</span>
                        <span>۱۰۰ تومان</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>هزینه ارسال</span>
                        <span>50 تومان</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>جمع خرید</span>
                        <span className="text-lg text-[#000000]">
                          ۱۵۰ تومان
                        </span>
                      </div>
                      <button
                        disabled={res ? false : true}
                        className={`px-5 py-3 rounded-md hover:shadow-black/50 ${
                          res ? "bg-black" : "bg-black/50"
                        }
                                        hover:shadow-lg text-sm uppercase text-white`}>
                        پرداخت
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Shipping;
=======
import { useState } from "react";

import Footer from "../components/Footer";
import Header from "../components/Header";
const Shipping = () => {
  const [res, setRes] = useState(true);
  const [state, setState] = useState({
    name: "",
    address: "",
    phone: "",
    post: "",
    province: "",
    city: "",
    area: "",
  });

  const inputHandel = e => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <div className="px-7 pb-6 min-[900px]:px-20 min-[1200px]:px-[150px] w-full relative">
        <div className="w-full absolute left-0 top-0 h-[70px] bg-black"></div>
        <div className="min-[800px]:px-20 pt-8 w-full px-7">
          <Header />
        </div>
        <section className="bg-white">
          <div className="w-full px-7 min-[800px]:px-20 mx-auto py-16">
            <div className="w-full flex flex-wrap">
              <div className="min-[1100px]:w-[67%] w-full">
                <div className="flex flex-col gap-3">
                  <div className="bg-white p-6 shadow-md rounded-md">
                    <h2 className="text-slate-600 font-bold pb-3">
                      اطلاعات خرید
                    </h2>
                    {!res && (
                      <>
                        <form>
                          <div className="flex md:flex-col md:gap-2 w-full gap-5 text-slate-600">
                            <div className="flex flex-col gap-1 mb-2 w-full">
                              <label htmlFor="name">اسم</label>
                              <input
                                onChange={inputHandel}
                                defaultValue={state.name}
                                type="text"
                                className="w-full px-3 py-2 border rounded-md border-slate-200 outline-none focus:border-green-500"
                                name="name"
                                id="name"
                                placeholder="اسم"
                              />
                            </div>
                          </div>
                          <div className="flex md:flex-col md:gap-2 w-full gap-5 text-slate-600">
                            <div className="flex flex-col gap-1 mb-2 w-full">
                              <label htmlFor="address">آدرس</label>
                              <input
                                onChange={inputHandel}
                                defaultValue={state.address}
                                type="text"
                                className="w-full px-3 py-2 border rounded-md border-slate-200 outline-none focus:border-green-500"
                                name="address"
                                id="address"
                                placeholder="ادرس"
                              />
                            </div>
                          </div>
                          <div className="flex md:flex-col md:gap-2 w-full gap-5 text-slate-600">
                            <div className="flex flex-col gap-1 mb-2 w-full">
                              <label htmlFor="phone">شماره موبایل</label>
                              <input
                                onChange={inputHandel}
                                defaultValue={state.phone}
                                type="text"
                                className="w-full px-3 py-2 border rounded-md border-slate-200 outline-none focus:border-green-500"
                                name="phone"
                                id="phone"
                                placeholder="شماره موبایل"
                              />
                            </div>
                          </div>
                          <div className="flex md:flex-col md:gap-2 w-full gap-5 text-slate-600">
                            <div className="flex flex-col gap-1 mb-2 w-full">
                              <label htmlFor="post">کد پستی</label>
                              <input
                                onChange={inputHandel}
                                defaultValue={state.post}
                                type="text"
                                className="w-full px-3 py-2 border rounded-md border-slate-200 outline-none focus:border-green-500"
                                name="post"
                                id="post"
                                placeholder="کد پستی"
                              />
                            </div>
                          </div>
                          <div className="flex md:flex-col md:gap-2 w-full gap-5 text-slate-600">
                            <div className="flex flex-col gap-1 mb-2 w-full">
                              <label htmlFor="province">استان</label>
                              <input
                                onChange={inputHandel}
                                defaultValue={state.province}
                                type="text"
                                className="w-full px-3 py-2 border rounded-md border-slate-200 outline-none focus:border-green-500"
                                name="province"
                                id="province"
                                placeholder="استان"
                              />
                            </div>
                          </div>
                          <div className="flex md:flex-col md:gap-2 w-full gap-5 text-slate-600">
                            <div className="flex flex-col gap-1 mb-2 w-full">
                              <label htmlFor="city">شهر</label>
                              <input
                                onChange={inputHandel}
                                defaultValue={state.city}
                                type="text"
                                className="w-full px-3 py-2 border rounded-md border-slate-200 outline-none focus:border-green-500"
                                name="city"
                                id="city"
                                placeholder="شهر"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-1 mt-7 mb-2 w-full">
                            <button className="px-3 text-white py-3 rounded-md hover:shadow-black hover:shadow-lg bg-[#111111]">
                              ذخیره کردن
                            </button>
                          </div>
                        </form>
                      </>
                    )}
                    {res && (
                      <div className="flex flex-col gap-1">
                        <h2 className="text-slate-600 font-semibold pb-2">
                          تحویل به{" "}
                        </h2>
                        <p>
                          <span className="bg-[#111111] text-white text-sm font-medium mr-2 px-2 py-1 rounded">
                            خانه
                          </span>
                          <span>phone, address province city area</span>
                          <span
                            onClick={() => setRes(false)}
                            className="text-indigo-500 cursor-pointer ml-2">
                            عوض کردن
                          </span>
                        </p>
                        <p className="text-slate-600 mt-5 text-sm">
                          ادرس ایمیل :
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="w-full flex flex-wrap justify-start items-center gap-10">
                    {[1, 2, 3, 4, 5].map((i, j) => (
                      <div
                        key={i}
                        className="w-full flex flex-wrap border border-gray-200 shadow-md rounded-md p-5">
                        <div className="flex sm:w-full gap-2 w-7/12">
                          <div className="flex gap-2 justify-start items-center">
                            <img
                              className="w-[80px] h-[80px]"
                              src="http://localhost:3000/image/banner/2.jpg"
                              alt="img"
                            />
                            <div className="pr-4 text-slate-600">
                              <h2 className="text-md font-semibold">name</h2>
                              <span className="text-sm">Brand: gildur</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between w-5/12 sm:w-full sm:mt-3">
                          <div className="pl-4 sm:pl-0">
                            <h2 className="text-lg text-red-600">۱۵۰ تومان</h2>
                            <p className="line-through">۲۰۰ تومان</p>
                            <p>-۱۰%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="min-[1100px]:w-[33%] w-full">
                <div className="min-[1100px]:ml-5 ml-0 max-[1100px]:mt-5 rounded-md shadow-md">
                  {5 > 0 && (
                    <div className="bg-white p-3 text-slate-600 flex flex-col gap-3">
                      <h2 className="text-xl font-bold">خلاصه خرید</h2>
                      <div className="flex justify-between items-center">
                        <span>تعداد محصولات (۱)</span>
                        <span>۱۰۰ تومان</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>هزینه ارسال</span>
                        <span>50 تومان</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>جمع خرید</span>
                        <span className="text-lg text-[#000000]">
                          ۱۵۰ تومان
                        </span>
                      </div>
                      <button
                        disabled={res ? false : true}
                        className={`px-5 py-3 rounded-md hover:shadow-black/50 ${
                          res ? "bg-black" : "bg-black/50"
                        }
                                        hover:shadow-lg text-sm uppercase text-white`}>
                        پرداخت
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Shipping;
>>>>>>> 86be6a8 (.)
