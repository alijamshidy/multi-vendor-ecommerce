import { useState } from "react";

import { FaHeart, FaList } from "react-icons/fa";
import { FaBorderAll } from "react-icons/fa6";
import { IoIosHome } from "react-icons/io";
import { RiLockPasswordLine, RiLogoutCircleRLine } from "react-icons/ri";
import { Link, Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Dashboard() {
  const [filterShow, setFilterShow] = useState(false);
  return (
    <div className="min-h-screen w-full">
      <div className="px-7 pb-6 min-[900px]:px-20 min-h-screen min-[1200px]:px-[150px] w-full relative">
        <div className="w-full absolute left-0 top-0 h-[70px] bg-black"></div>
        <div className="min-[800px]:px-20 pt-8 w-full px-7">
          <Header />
        </div>
        <div className="bg-white mt-5 min-[800px]:px-20 px-7">
          <div className="w-full mx-auto block min-[1000px]:hidden">
            <div>
              <button
                onClick={() => setFilterShow(!filterShow)}
                className="text-center py-3 px-3 rounded-md bg-black text-white">
                <FaList />
              </button>
            </div>
          </div>
          <div className="h-full mx-auto">
            <div className="py-5 flex max-[1000px]:w-[90%] mx-auto relative">
              <div
                className={`rounded-md shadow-md z-50 max-[1000px]:absolute border border-gray-200 ${
                  filterShow ? "-left-12" : "-left-[1000px]"
                } w-[270px] ml-4 bg-white`}>
                <ul className="py-2 text-slate-600 px-4">
                  <li className="flex justify-start items-center gap-2 py-2">
                    <span className="text-xl">
                      <IoIosHome />
                    </span>
                    <Link
                      to="/dashboard"
                      className="block">
                      داشبورد
                    </Link>
                  </li>
                  <li className="flex justify-start items-center gap-2 py-2">
                    <span className="text-xl">
                      <FaBorderAll />
                    </span>
                    <Link
                      to="/dashboard/my-orders"
                      className="block">
                      سبد خرید من
                    </Link>
                  </li>
                  <li className="flex justify-start items-center gap-2 py-2">
                    <span className="text-xl">
                      <FaHeart />
                    </span>
                    <Link
                      to="/dashboard/my-wishlist"
                      className="block">
                      محصولات مورد علاقه
                    </Link>
                  </li>
                  <li className="flex justify-start items-center gap-2 py-2">
                    <span className="text-xl">
                      <RiLockPasswordLine />
                    </span>
                    <Link
                      to="/dashboard/change-password"
                      className="block">
                      تغییر رمز عبور
                    </Link>
                  </li>
                  <li className="flex cursor-pointer justify-start items-center gap-2 py-2">
                    <span className="text-xl">
                      <RiLogoutCircleRLine />
                    </span>
                    <div className="block">خروج</div>
                  </li>
                </ul>
              </div>
              <div className="w-[calc(100%-270px)] max-[1000px]:w-full">
                <div className="mx-4 max-[1000px]:mx-0">
                  <Outlet />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
