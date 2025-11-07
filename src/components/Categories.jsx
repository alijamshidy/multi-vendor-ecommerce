<<<<<<< HEAD
import { useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { get_category } from "../store/Reducers/homeReducer";

const Categories = () => {
  const dispatch = useDispatch();

  const { categorys } = useSelector(state => state.home);

  useEffect(() => {
    dispatch(get_category());
  }, []);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 2200 },
      items: 6,
    },
    desktop: {
      breakpoint: { max: 2200, min: 1700 },
      items: 5,
    },
    tablet: {
      breakpoint: { max: 1700, min: 1400 },
      items: 4,
    },
    mdTablet: {
      breakpoint: { max: 1400, min: 1130 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 1130, min: 860 },
      items: 3,
    },
    smMobile: {
      breakpoint: { max: 860, min: 600 },
      items: 2,
    },
    xsMobile: {
      breakpoint: { max: 600, min: 0 },
      items: 1,
    },
  };

  return (
    <div className="w-full flex mt-5 justify-center items-center">
      <div className="w-full flex flex-col gap-5 justify-center items-center">
        <div className="w-full flex justify-center items-center px-7">
          <div className="mb-10 border-b-2 border-black border-t-2 py-4">
            <h2 className="text-[25px] font-bold">دسته بندی ها</h2>
          </div>
        </div>
        <div className="w-full">
          <Carousel
            responsive={responsive}
            autoPlay={true}
            swipeable={true}
            draggable={true}
            arrows={true}
            infinite={true}
            partialVisible={false}
            dotListClass="custom-dot-list-style">
            {categorys.map((cate, i) => (
              <div className="w-full relative px-3 cursor-pointer h-[150px] rounded-md">
                <Link to={`/search/categories/${cate.id}`}>
                  <img
                    className="w-full  h-full rounded-md"
                    src={cate.image}
                    alt=""
                  />
                  <div
                    className="absolute bg-[#111111] text-[#EDEEF4] top-10 right-8 px-7 flex justify-center items-center 
                          rounded-tl-2xl py-1 font-semibold rounded-br-2xl">
                    <span>شلوار</span>
                  </div>
                </Link>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Categories;
=======
import { useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { get_category } from "../store/Reducers/homeReducer";

const Categories = () => {
  const dispatch = useDispatch();

  const { categorys } = useSelector(state => state.home);

  useEffect(() => {
    dispatch(get_category());
  }, []);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 2200 },
      items: 6,
    },
    desktop: {
      breakpoint: { max: 2200, min: 1700 },
      items: 5,
    },
    tablet: {
      breakpoint: { max: 1700, min: 1400 },
      items: 4,
    },
    mdTablet: {
      breakpoint: { max: 1400, min: 1130 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 1130, min: 860 },
      items: 3,
    },
    smMobile: {
      breakpoint: { max: 860, min: 600 },
      items: 2,
    },
    xsMobile: {
      breakpoint: { max: 600, min: 0 },
      items: 1,
    },
  };

  return (
    <div className="w-full flex mt-5 justify-center items-center">
      <div className="w-full flex flex-col gap-5 justify-center items-center">
        <div className="w-full flex justify-center items-center px-7">
          <div className="mb-10 border-b-2 border-black border-t-2 py-4">
            <h2 className="text-[25px] font-bold">دسته بندی ها</h2>
          </div>
        </div>
        <div className="w-full py-4 px-3">
          <Carousel
            responsive={responsive}
            autoPlay={true}
            swipeable={true}
            draggable={true}
            arrows={true}
            infinite={true}
            partialVisible={false}
            dotListClass="custom-dot-list-style">
            {categorys.map((cate, i) => (
              <div className="w-full relative cursor-pointer p-3 h-[150px] rounded-md overflow-hidden hover:scale-105 duration-300">
                <Link to={`/search/categories/${cate.id}`}>
                  <img
                    className="w-full h-full object-cover"
                    src={cate.image||''}
                    alt=""
                  />
                  <div
                    className="absolute bg-[#111111] text-[#EDEEF4] top-10 right-8 px-7 flex justify-center items-center 
                          rounded-tl-2xl py-1 font-semibold rounded-br-2xl">
                    <span>{cate.title}</span>
                  </div>
                </Link>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Categories;
>>>>>>> 86be6a8 (.)
