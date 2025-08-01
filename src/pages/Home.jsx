import Footer from "../components/Footer";
import Header from "../components/Header";
import Banner from "./../components/Banner";
import Categories from "./../components/Categories";
import DiscountedProduct from "./../components/DiscountedProduct";
import Frequent from "./../components/Frequent";
import NewProducts from "./../components/NewProducts";
import SeasonCollection from "./../components/SeasonCollection";

const Home = () => {
  return (
    <div>
      <div className="w-full relative bg-white flex min-[1200px]:px-[150px] flex-col justify-center items-center">
        <div className="w-full absolute left-0 top-0 h-[70px] bg-black"></div>
        <div className="min-[800px]:px-20 pt-8 w-full px-7">
          <Header />
        </div>
        <Banner />
        <div className="w-full flex justify-center flex-col items-center gap-5">
          <div className="flex flex-col w-full justify-center items-center px-7 min-[800px]:px-20">
            <div className="w-full flex mt-5 justify-center items-center">
              <div className="w-full flex justify-end px-5 items-center text-[#000000] bg-[#EDEEF4] py-6 rounded-lg">
                <span className="text-[18px] font-bold">
                  چرا از جلدوور خرید کنیم ؟
                </span>
              </div>
            </div>
            <DiscountedProduct />
            <Categories />
          </div>
          <NewProducts />
          <div className="w-full px-7 min-[800px]:px-20">
            <SeasonCollection />
            <Frequent />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
