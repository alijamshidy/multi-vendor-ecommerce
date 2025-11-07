<<<<<<< HEAD
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { get_collection } from "../store/Reducers/homeReducer";

const SeasonCollection = () => {
  const dispatch = useDispatch();

  const { collections } = useSelector(state => state.home);

  useEffect(() => {
    dispatch(get_collection());
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
    <div className="w-full flex justify-center items-center mt-7">
      <div className="w-full py-5 ">
        <div className="w-full flex flex-col gap-5 justify-center items-center">
          <div className="w-full flex justify-center items-center px-7">
            <div className="mb-10 border-b-2 border-black border-t-2 py-4">
              <h2 className="text-[25px] font-bold">مجموعه ها</h2>
            </div>
          </div>
          <div className="w-full flex justify-center flex-wrap gap-10 items-center">
            {collections.map((col, i) => (
              <Link
                to={`/search/collections/${col.id}`}
                className=" bg-white min-[800px]:w-[450px] w-full rounded-md hover:-translate-y-3 duration-500 cursor-pointer shadow-md flex justify-center gap-5 items-center flex-col">
                <div className="w-full relative flex flex-col justify-center items-center">
                  <img
                    src={col.image}
                    className="w-full h-[300px] rounded-md"
                    alt="collection"
                  />
                  <div className="px-7 py-3 bg-black flex justify-center items-center rounded-md absolute bottom-10">
                    <span className="text-white text-[20px]">{col.title}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonCollection;
=======
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { get_collection } from "../store/Reducers/homeReducer";

const SeasonCollection = () => {
  const dispatch = useDispatch();

  const { collections } = useSelector(state => state.home);

  useEffect(() => {
    dispatch(get_collection());
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
    <div className="w-full flex justify-center items-center mt-7">
      <div className="w-full py-5 ">
        <div className="w-full flex flex-col gap-5 justify-center items-center">
          <div className="w-full flex justify-center items-center px-7">
            <div className="mb-10 border-b-2 border-black border-t-2 py-4">
              <h2 className="text-[25px] font-bold">مجموعه ها</h2>
            </div>
          </div>
          <div className="w-full flex justify-center flex-wrap gap-10 items-center">
            {collections.map((col, i) => (
              <Link
                key={i}
                to={`/search/collections/${col.id}`}
                className=" bg-white min-[800px]:w-[450px] w-full rounded-md hover:-translate-y-3 duration-500 cursor-pointer shadow-md flex justify-center gap-5 items-center flex-col">
                <div className="w-full relative flex flex-col justify-center items-center">
                  <img
                    src={col.image}
                    className="w-full h-[300px] rounded-md"
                    alt="collection"
                  />
                  <div className="px-7 py-3 bg-black flex justify-center items-center rounded-md absolute bottom-10">
                    <span className="text-white text-[20px]">{col.title}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonCollection;
>>>>>>> 86be6a8 (.)
