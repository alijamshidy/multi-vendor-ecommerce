<<<<<<< HEAD
import { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { BsFillGridFill } from "react-icons/bs";
import { CiStar } from "react-icons/ci";
import { FaThList } from "react-icons/fa";
import { Range } from "react-range";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Pagination from "../components/Pagination";
import ShopProduct from "./../components/ShopProduct";
import {
  get_featured_product,
  get_product_display,
} from "./../store/Reducers/productDisplayReducer";

const ProductsDisplay = () => {
  const { id, slug } = useParams();
  const dispatch = useDispatch();
  const [styles, setStyles] = useState("grid");
  const location = useLocation();
  const [sortPrice, setSortPrice] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [filter, setFilter] = useState(true);
  const [state, setState] = useState({ values: [5, 50] });
  const [rating, setRating] = useState("");
  const { product_display, total_items, featured_product } = useSelector(
    state => state.productDisplay
  );

  const parts = location.pathname.split("/").filter(Boolean);
  const url =
    id || slug ? parts.slice(-2).join("/") : parts.slice(-1).join("/");

  // const { categorys } = useSelector(state => state.home);
  // console.log(categorys);

  console.log(url);

  useEffect(() => {
    if (url) {
      dispatch(get_product_display(url));
    }
  }, [url]);
  useEffect(() => {
    if (featured_product) {
      dispatch(get_featured_product(featured_product));
    }
  }, [featured_product, url]);

  return (
    <div className="w-full relative">
      <div className="w-full absolute left-0 top-0 h-[70px] bg-black"></div>
      <div className="w-full flex flex-col px-7 min-[900px]:px-20 min-[1200px]:px-[150px] justify-center items-center">
        <div className="min-[800px]:px-20 pt-8 w-full px-7">
          <Header />
        </div>

        <div className="w-full mt-14">
          <div
            className={`block min-[1200px]:hidden ${
              !filter ? "mb-6" : "mb-0"
            }`}>
            <button
              onClick={() => setFilter(!filter)}
              className="text-center w-full py-2 px-3 bg-[#111111] rounded-md text-white">
              فیلتر محصولات
            </button>
          </div>
          <div className="flex flex-wrap">
            <div
              className={`min-[1200px]:w-3/12 w-full pr-7 ${
                filter
                  ? "max-[1200px]:h-0 max-[1200px]:overflow-hidden max-[1200px]:mb-6"
                  : "max-[1200px]:h-auto max-[1200px]:pl-2 max-[1200px]:overflow-auto max-[1200px]:mb-0"
              }`}>
              <div className="py-2 flex flex-col gap-5">
                <h2 className="text-3xl font-bold mb-3 text-slate-600">قیمت</h2>
                <Range
                  step={5}
                  min={5}
                  max={50}
                  values={state.values}
                  onChange={values => setState({ values })}
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      className="w-full h-[6px] bg-slate-200 rounded-full cursor-pointer">
                      {children}
                    </div>
                  )}
                  renderThumb={({ props }) => (
                    <div
                      className="w-[15px] h-[15px] bg-[#111111] rounded-full"
                      {...props}
                    />
                  )}
                />
              </div>
              <span className="text-slate-800 font-bold text-lg">
                ${Math.floor(state.values[0])} - ${Math.floor(state.values[1])}
              </span>
              <div className="py-3 flex flex-col gap-4">
                <h2 className="text-3xl font-bold mb-3 text-slate-600">
                  Rating
                </h2>
                <div className="flex flex-col gap-3">
                  <div
                    onClick={() => setRating(5)}
                    className="text-yellow-500 flex justify-start items-start gap-2 text-xl cursor-pointer">
                    <span>
                      <AiFillStar />
                    </span>
                    <span>
                      <AiFillStar />
                    </span>
                    <span>
                      <AiFillStar />
                    </span>
                    <span>
                      <AiFillStar />
                    </span>
                    <span>
                      <AiFillStar />
                    </span>
                  </div>
                  <div
                    onClick={() => setRating(4)}
                    className="text-yellow-500 flex justify-start items-start gap-2 text-xl cursor-pointer">
                    <span>
                      <AiFillStar />
                    </span>
                    <span>
                      <AiFillStar />
                    </span>
                    <span>
                      <AiFillStar />
                    </span>
                    <span>
                      <AiFillStar />
                    </span>
                    <span>
                      <CiStar />
                    </span>
                  </div>
                  <div
                    onClick={() => setRating(3)}
                    className="text-yellow-500 flex justify-start items-start gap-2 text-xl cursor-pointer">
                    <span>
                      <AiFillStar />
                    </span>
                    <span>
                      <AiFillStar />
                    </span>
                    <span>
                      <AiFillStar />
                    </span>
                    <span>
                      <CiStar />
                    </span>
                    <span>
                      <CiStar />
                    </span>
                  </div>
                  <div
                    onClick={() => setRating(2)}
                    className="text-yellow-500 flex justify-start items-start gap-2 text-xl cursor-pointer">
                    <span>
                      <AiFillStar />
                    </span>
                    <span>
                      <AiFillStar />
                    </span>
                    <span>
                      <CiStar />
                    </span>
                    <span>
                      <CiStar />
                    </span>
                    <span>
                      <CiStar />
                    </span>
                  </div>
                  <div
                    onClick={() => setRating(1)}
                    className="text-yellow-500 flex justify-start items-start gap-2 text-xl cursor-pointer">
                    <span>
                      <AiFillStar />
                    </span>
                    <span>
                      <CiStar />
                    </span>
                    <span>
                      <CiStar />
                    </span>
                    <span>
                      <CiStar />
                    </span>
                    <span>
                      <CiStar />
                    </span>
                  </div>
                  <div className="text-yellow-500 flex justify-start items-start gap-2 text-xl cursor-pointer">
                    <span>
                      <CiStar />
                    </span>
                    <span>
                      <CiStar />
                    </span>
                    <span>
                      <CiStar />
                    </span>
                    <span>
                      <CiStar />
                    </span>
                    <span>
                      <CiStar />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="min-[1200px]:w-9/12 w-full">
              <div className="py-4 bg-[#ffffff] mb-10 px-3 rounded-md flex justify-between items-center border">
                <h2
                  dir="rtl"
                  className="text-lg font-medium">
                  <span>{total_items}</span>محصول
                </h2>
                <div className="flex justify-center items-center gap-3">
                  <select
                    onChange={e => setSortPrice(e.target.value)}
                    name=""
                    id=""
                    className="p-2 bg-transparent cursor-pointer text-[14px] border outline-none font-semibold">
                    <option value="">به ترتیب</option>
                    <option value="low-to-high">قیمت از کم به زیاد</option>
                    <option value="high-to-low">قیمت از زیاد به کم</option>
                  </select>
                  <div className="flex justify-center items-start gap-4 max-[991px]:hidden">
                    <div
                      onClick={() => setStyles("grid")}
                      className={`p-2 ${
                        styles === "grid" && "bg-[#b5b6bb]"
                      } text-slate-600 hover:bg-white cursor-pointer
                        rounded-sm`}>
                      <BsFillGridFill />
                    </div>
                    <div
                      onClick={() => setStyles("list")}
                      className={`p-2 ${
                        styles === "list" && "bg-[#b5b6bb]"
                      } text-slate-600 hover:bg-white cursor-pointer
                        rounded-sm`}>
                      <FaThList />
                    </div>
                  </div>
                </div>
              </div>
              <div className="pb-8">
                <ShopProduct
                  styles={styles}
                  product={product_display}
                />
              </div>
              <div className="py-10 w-full flex justify-center items-center">
                {total_items > 5 && (
                  <Pagination
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                    totalItem={total_items}
                    parPage={3}
                    showItem={Math.floor(30 / 3)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductsDisplay;
=======
import { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { BsFillGridFill } from "react-icons/bs";
import { CiStar } from "react-icons/ci";
import { FaThList } from "react-icons/fa";
import { Range } from "react-range";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Pagination from "../components/Pagination";
import ShopProduct from "./../components/ShopProduct";
import {
  get_featured_product,
  get_product_display,
} from "./../store/Reducers/productDisplayReducer";

const ProductsDisplay = () => {
  const { id, slug } = useParams();
  const dispatch = useDispatch();
  const [styles, setStyles] = useState("grid");
  const location = useLocation();
  const [sortPrice, setSortPrice] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [filter, setFilter] = useState(true);
  const [state, setState] = useState({ values: [5, 50] });
  const [rating, setRating] = useState("");
  const { product_display, total_items, featured_product } = useSelector(
    state => state.productDisplay
  );

  const parts = location.pathname.split("/").filter(Boolean);
  const url =
    id || slug ? parts.slice(-2).join("/") : parts.slice(-1).join("/");

  // const { categorys } = useSelector(state => state.home);
  // console.log(categorys);

  console.log(url);

  useEffect(() => {
    if (url) {
      dispatch(get_product_display(url));
    }
  }, [url]);
  useEffect(() => {
    if (featured_product) {
      dispatch(get_featured_product(featured_product));
    }
  }, [featured_product, url]);

  return (
    <div className="w-full relative">
      <div className="w-full absolute left-0 top-0 h-[70px] bg-black"></div>
      <div className="w-full flex flex-col px-7 min-[900px]:px-20 min-[1200px]:px-[150px] justify-center items-center">
        <div className="min-[800px]:px-20 pt-8 w-full px-7">
          <Header />
        </div>

        <div className="w-full mt-14">
          <div
            className={`block min-[1200px]:hidden ${
              !filter ? "mb-6" : "mb-0"
            }`}>
            <button
              onClick={() => setFilter(!filter)}
              className="text-center w-full py-2 px-3 bg-[#111111] rounded-md text-white">
              فیلتر محصولات
            </button>
          </div>
          <div className="flex flex-wrap">
            <div
              className={`min-[1200px]:w-3/12 w-full pr-7 ${
                filter
                  ? "max-[1200px]:h-0 max-[1200px]:overflow-hidden max-[1200px]:mb-6"
                  : "max-[1200px]:h-auto max-[1200px]:pl-2 max-[1200px]:overflow-auto max-[1200px]:mb-0"
              }`}>
              <div className="py-2 flex flex-col gap-5">
                <h2 className="text-3xl font-bold mb-3 text-slate-600">قیمت</h2>
                <Range
                  step={5}
                  min={5}
                  max={50}
                  values={state.values}
                  onChange={values => setState({ values })}
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      className="w-full h-[6px] bg-slate-200 rounded-full cursor-pointer">
                      {children}
                    </div>
                  )}
                  renderThumb={({ props }) => (
                    <div
                      className="w-[15px] h-[15px] bg-[#111111] rounded-full"
                      {...props}
                    />
                  )}
                />
              </div>
              <span className="text-slate-800 font-bold text-lg">
                ${Math.floor(state.values[0])} - ${Math.floor(state.values[1])}
              </span>
              <div className="py-3 flex flex-col gap-4">
                <h2 className="text-3xl font-bold mb-3 text-slate-600">
                  Rating
                </h2>
                <div className="flex flex-col gap-3">
                  <div
                    onClick={() => setRating(5)}
                    className="text-yellow-500 flex justify-start items-start gap-2 text-xl cursor-pointer">
                    <span>
                      <AiFillStar />
                    </span>
                    <span>
                      <AiFillStar />
                    </span>
                    <span>
                      <AiFillStar />
                    </span>
                    <span>
                      <AiFillStar />
                    </span>
                    <span>
                      <AiFillStar />
                    </span>
                  </div>
                  <div
                    onClick={() => setRating(4)}
                    className="text-yellow-500 flex justify-start items-start gap-2 text-xl cursor-pointer">
                    <span>
                      <AiFillStar />
                    </span>
                    <span>
                      <AiFillStar />
                    </span>
                    <span>
                      <AiFillStar />
                    </span>
                    <span>
                      <AiFillStar />
                    </span>
                    <span>
                      <CiStar />
                    </span>
                  </div>
                  <div
                    onClick={() => setRating(3)}
                    className="text-yellow-500 flex justify-start items-start gap-2 text-xl cursor-pointer">
                    <span>
                      <AiFillStar />
                    </span>
                    <span>
                      <AiFillStar />
                    </span>
                    <span>
                      <AiFillStar />
                    </span>
                    <span>
                      <CiStar />
                    </span>
                    <span>
                      <CiStar />
                    </span>
                  </div>
                  <div
                    onClick={() => setRating(2)}
                    className="text-yellow-500 flex justify-start items-start gap-2 text-xl cursor-pointer">
                    <span>
                      <AiFillStar />
                    </span>
                    <span>
                      <AiFillStar />
                    </span>
                    <span>
                      <CiStar />
                    </span>
                    <span>
                      <CiStar />
                    </span>
                    <span>
                      <CiStar />
                    </span>
                  </div>
                  <div
                    onClick={() => setRating(1)}
                    className="text-yellow-500 flex justify-start items-start gap-2 text-xl cursor-pointer">
                    <span>
                      <AiFillStar />
                    </span>
                    <span>
                      <CiStar />
                    </span>
                    <span>
                      <CiStar />
                    </span>
                    <span>
                      <CiStar />
                    </span>
                    <span>
                      <CiStar />
                    </span>
                  </div>
                  <div className="text-yellow-500 flex justify-start items-start gap-2 text-xl cursor-pointer">
                    <span>
                      <CiStar />
                    </span>
                    <span>
                      <CiStar />
                    </span>
                    <span>
                      <CiStar />
                    </span>
                    <span>
                      <CiStar />
                    </span>
                    <span>
                      <CiStar />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="min-[1200px]:w-9/12 w-full">
              <div className="py-4 bg-[#ffffff] mb-10 px-3 rounded-md flex justify-between items-center border">
                <h2
                  dir="rtl"
                  className="text-lg font-medium">
                  <span>{total_items}</span>محصول
                </h2>
                <div className="flex justify-center items-center gap-3">
                  <select
                    onChange={e => setSortPrice(e.target.value)}
                    name=""
                    id=""
                    className="p-2 bg-transparent cursor-pointer text-[14px] border outline-none font-semibold">
                    <option value="">به ترتیب</option>
                    <option value="low-to-high">قیمت از کم به زیاد</option>
                    <option value="high-to-low">قیمت از زیاد به کم</option>
                  </select>
                  <div className="flex justify-center items-start gap-4 max-[991px]:hidden">
                    <div
                      onClick={() => setStyles("grid")}
                      className={`p-2 ${
                        styles === "grid" && "bg-[#b5b6bb]"
                      } text-slate-600 hover:bg-white cursor-pointer
                        rounded-sm`}>
                      <BsFillGridFill />
                    </div>
                    <div
                      onClick={() => setStyles("list")}
                      className={`p-2 ${
                        styles === "list" && "bg-[#b5b6bb]"
                      } text-slate-600 hover:bg-white cursor-pointer
                        rounded-sm`}>
                      <FaThList />
                    </div>
                  </div>
                </div>
              </div>
              <div className="pb-8">
                <ShopProduct
                  styles={styles}
                  product={product_display}
                />
              </div>
              <div className="py-10 w-full flex justify-center items-center">
                {total_items > 5 && (
                  <Pagination
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                    totalItem={total_items}
                    parPage={3}
                    showItem={Math.floor(30 / 3)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductsDisplay;
>>>>>>> 86be6a8 (.)
