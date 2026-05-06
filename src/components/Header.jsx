import { useEffect, useState } from "react";
import { AiOutlineWhatsApp } from "react-icons/ai";
import { BsCart2 } from "react-icons/bs";
import { FaInstagram, FaPhoneAlt, FaTelegram } from "react-icons/fa";
import { HiOutlineMenu } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { IoSearchSharp } from "react-icons/io5";
import { TbLogin } from "react-icons/tb";
import { TfiMenuAlt } from "react-icons/tfi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { get_card_products } from "../store/Reducers/cardReducer";

const Header = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(get_card_products(userInfo?.id));
  }, []);
  const { userInfo } = useSelector(state => state.auth);
  const { card_product_count } = useSelector(state => state.card);

  const { categorys } = useSelector(state => state.home);

  const [showCategory, setShowCategory] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="w-full relative flex-col flex justify-center items-center">
      <div className="w-full bg-[#EDEEF4] shadow-md flex justify-between rounded-md px-7 items-center py-1">
        <div className="flex min-[600px]:w-5/12 justify-start items-center gap-5">
          <div
            onClick={() => setShowMenu(true)}
            className="min-[700px]:hidden flex cursor-pointer justify-center items-center rounded-md
           p-2 text-[#111111]">
            <span className="text-[21px]">
              <HiOutlineMenu />
            </span>
          </div>
          <Link
            to="/card"
            className="relative cursor-pointer hidden min-[700px]:flex justify-center items-center rounded-md
           p-2 text-[#111111]">
            <span className="text-[20px] items-center justify-center gap-3 flex font-bold">
              <BsCart2 />
            </span>
            <div className="absolute -top-1 -right-2 bg-black p-1 text-white w-[22px] flex justify-center items-center text-wh h-[22px] text-[12px] rounded-full">
              {card_product_count}
            </div>
          </Link>
          <div className="w-[1px] h-[30px] hidden min-[700px]:block bg-gray-500"></div>
          {userInfo.id ? (
            <Link to={"/dashboard"}>
              <span> {userInfo.first_name} </span>
              <span> {userInfo.last_name} </span>
            </Link>
          ) : (
            <div
              className="hidden min-[700px]:flex shadow-md border border-gray-500 px-5 cursor-pointer justify-center items-center rounded-md
           py-2 text-[#111111]">
              <Link
                to="/login"
                className="text-[18px] items-center justify-center gap-3 flex font-bold">
                <span className="text-[15px]">ورود</span>
                <TbLogin />
              </Link>
            </div>
          )}
        </div>
        <div className="min-[700px]:flex w-4/12 gap-10 hidden justify-center min-[1050px]:pr-[20%] items-center">
          <Link className="text-[22px] hover:-translate-y-1 duration-300 text-[#111111]">
            <AiOutlineWhatsApp />
          </Link>

          <Link className="text-[22px] hover:-translate-y-1 duration-300 text-[#111111]">
            <FaTelegram />
          </Link>

          <Link className="text-[22px] hover:-translate-y-1 duration-300 text-[#111111]">
            <FaInstagram />
          </Link>
        </div>
        <div className="flex min-[700px]:w-3/12 justify-end items-center">
          <Link to="/">
            <img
              src="http://localhost:3000/logo.jpg"
              className="w-[100px] h-[50px]"
              alt="icon site"
            />
          </Link>
        </div>
      </div>
      <div className="w-full flex justify-around mt-8 gap-5 items-center">
        <div className="w-4/12 hidden min-[700px]:flex justify-start items-center">
          <div className="w-[300px] relative">
            <div
              onClick={() => setShowCategory(!showCategory)}
              className="w-full shadow-md border border-gray-200 rounded-md cursor-pointer relative z-50 py-2 bg-[#EDEEF4] text-black h-[45px] flex justify-between px-5 items-center">
              <span className="text-black text-[20px]">
                <TfiMenuAlt />
              </span>
              <span className="text-black font-bold">همه محصولات</span>
            </div>
            <div
              className={`w-full absolute ${
                showCategory ? "h-[400px]" : "h-[0]"
              } duration-500 bg-[#ffffff] border-gray-200 border shadow-md rounded-b-md top-10 z-30 left-0`}>
              <div
                className={`${
                  !showCategory
                    ? "hidden"
                    : "flex justify-end items-end flex-col"
                } text-black p-5 cursor-pointer`}>
                {categorys.map((cat, i) => (
                  <span key={i}>{cat.title}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <form className="min-[800px]:w-5/12 min-[700px]:w-8/12 w-full relative flex justify-end items-center">
          <div className="w-full relative flex justify-center items-center">
            <input
              className="w-full shadow-md bg-[#EDEEF4] h-[45px] outline-none rounded-md
              placeholder:text-black placeholder:font-semibold pr-5 pl-11"
              placeholder="جستوجو محصولات"
              dir="rtl"
            />
          </div>
          <button className="absolute left-4 top-[12px] text-[#111111] text-[23px]">
            <IoSearchSharp />
          </button>
        </form>
        <div className="w-3/12 min-[800px]:flex hidden gap-3 justify-end items-center">
          <span className="border-[1px] p-3 rounded-full border-black">
            <FaPhoneAlt />
          </span>
          <div className="font-bold">
            <span>0912554648789</span>
            <br />
            <span>7/24</span>
          </div>
        </div>
      </div>
      <div
        className={`fixed w-full z-[999] bg-[#EDEEF4]/50 min-h-screen top-0 duration-300  ${
          showMenu
            ? "min-[700px]:hidden left-0"
            : "-left-[1000px] min-[700px]:hidden "
        }`}>
        <div className="w-[60%] relative z-[999] bg-white min-h-screen">
          <div className="w-full text-start px-5 py-2">
            <span
              onClick={() => setShowMenu(false)}
              className="w-[30px] h-[30px] cursor-pointer absolute right-2 top-5">
              <IoMdClose />
            </span>
          </div>
          <div className="w-full text-end flex flex-col gap-6 p-5 mt-5">
            <hr />
            <h2 className="font-bold text-[18px]">اطلاعات</h2>
            <div className="flex flex-col gap-5">
              <span className="font-semibold text-[15px] cursor-pointer">
                ورود
              </span>
              <span className="font-semibold text-[15px] cursor-pointer">
                سبد خرید
              </span>
            </div>
            <hr />
            <h2 className="font-bold text-[18px]">دستبندی ها</h2>
            <div className="flex flex-col gap-5">
              <span className="font-semibold text-[15px] cursor-pointer">
                لباس
              </span>
            </div>
            <hr />
            <h2 className="font-bold text-[18px]">راه های ارتباطی</h2>
            <div className="w-full flex justify-end items-center gap-3">
              <Link className="text-[22px] text-[#111111]">
                <AiOutlineWhatsApp />
              </Link>

              <Link className="text-[22px] text-[#111111]">
                <FaTelegram />
              </Link>

              <Link className="text-[22px]  text-[#111111]">
                <FaInstagram />
              </Link>

              <Link className="text-[20px] text-[#111111]">
                <FaPhoneAlt />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
