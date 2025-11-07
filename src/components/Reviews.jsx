/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  AiFillDislike,
  AiFillHeart,
  AiFillLike,
  AiOutlineDislike,
  AiOutlineHeart,
  AiOutlineLike,
} from "react-icons/ai";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { IoMdArrowDropleft } from "react-icons/io";
import RatingReact from "react-rating";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  add_react,
  change_react,
  customer_rating,
  customer_review,
  delete_review,
  get_my_rating,
  get_ratings,
  get_reviews,
  messageClear,
  product_details,
  update_rating,
} from "../store/Reducers/homeReducer";
import Pagination from "./Pagination";
import Rating from "./Rating";
import RatingTemp from "./RatingTemp";

const Reviews = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [parPage, setParPage] = useState(1);
  const [pageNumber, setPageNumber] = useState();
  const [isReplaying, setIsReplaying] = useState(false);
  const { userInfo } = useSelector(state => state.auth);
  const {
    successMessage,
    errorMessage,
    reviews,
    ratings,
    myRating,
    rating,
    totalReview,
    totalRating,
  } = useSelector(state => state.home);
  console.log(myRating);
  const [rat, setRat] = useState();
  const [re, setRe] = useState("");
  const inputRef = useRef(null);

  const submit = e => {
    e.preventDefault();

    if (rat) {
      dispatch(
        update_rating({
          info: { rating: rat },
          slug: product.slug,
          id: myRating.id,
        })
      );
    } else if (isReplaying) {
      // dispatch(add_replay)
      setIsReplaying(false);
      // dispatch(send_review_replay)
      setRe("");
    } else {
      if (re) {
        dispatch(
          customer_review({
            info: {
              customer: userInfo.id,
              title: "best", //this is not completed
              comment: re,
            },
            slug: product.slug,
          })
        );
      }
      if (rat) {
        dispatch(
          customer_rating({ info: { rating: rat }, slug: product.slug })
        );
      }
    }
  };
  const changeReaction = (reviewId, reactionId, reaction) => {
    const info = {
      product_slug: product.slug,
      reviewId: reviewId,
      reactionId: reactionId,
    };
    dispatch(change_react({ info, react: { reaction: reaction } }));
  };
  const addReaction = (reviewId, reaction) => {
    const info = {
      product_slug: product.slug,
      reviewId: reviewId,
    };

    dispatch(add_react({ info, react: { reaction: reaction } }));
  };
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(get_ratings({ product_slug: product.slug }));
      dispatch(product_details(product.slug));
      dispatch(get_my_rating({ product_slug: product.slug }));
      setRat();
      setRe("");
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      setRe("");
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);
  const redirect = () => {
    console.log(!userInfo);
    if (userInfo) {
      navigate("/login");
    }
    return true;
  };
  const reaction = (reid, reactId, react, user) => {
    if (react === "Like" && user) {
      return (
        <div
          key={reid}
          className="flex gap-3 justify-center items-center text-[20px] text-black">
          <span className=" cursor-pointer hover:text-gray-800/50">
            <AiFillLike />
          </span>
          <span className=" cursor-pointer hover:text-gray-800/50">
            <AiOutlineDislike
              onClick={() => {
                changeReaction(reid, reactId, "d");
              }}
            />
          </span>
          <span className=" cursor-pointer hover:text-gray-800/50">
            <AiOutlineHeart
              onClick={() => {
                changeReaction(reid, reactId, "h");
              }}
            />
          </span>
        </div>
      );
    } else if (react === "Dislike" && user) {
      return (
        <div
          key={reid}
          className="flex gap-3 text-[20px]">
          <span className=" cursor-pointer  hover:text-gray-800/50">
            <AiOutlineLike onClick={() => changeReaction(reid, reactId, "l")} />
          </span>
          <span className=" cursor-pointer  hover:text-gray-800/50">
            <AiFillDislike />
          </span>
          <span className=" cursor-pointer  hover:text-gray-800/50">
            <AiOutlineHeart
              onClick={() => changeReaction(reid, reactId, "h")}
            />
          </span>
        </div>
      );
    } else if (react === "Heart" && user) {
      return (
        <div
          key={reid}
          className="flex gap-3 text-[20px]">
          <span className=" cursor-pointer  hover:text-gray-800/50">
            <AiOutlineLike onClick={() => changeReaction(reid, reactId, "l")} />
          </span>
          <span className=" cursor-pointer  hover:text-gray-800/50">
            <AiOutlineDislike
              onClick={() => changeReaction(reid, reactId, "d")}
            />
          </span>
          <span className=" cursor-pointer  hover:text-gray-800/50">
            <AiFillHeart />
          </span>
        </div>
      );
    } else {
      return (
        <div
          key={reid}
          className="flex gap-3 text-[20px]">
          <span
            onClick={() => {
              redirect();
              addReaction(reid, "l");
            }}
            className=" cursor-pointer  hover:text-gray-800/50">
            <AiOutlineLike />
          </span>
          <span
            onClick={() => {
              redirect();
              addReaction(reid, "d");
            }}
            className=" cursor-pointer hover:text-gray-800/50 ">
            <AiOutlineDislike />
          </span>
          <span
            onClick={() => {
              redirect();
              addReaction(reid, "h");
            }}
            className=" cursor-pointer  hover:text-gray-800/50">
            <AiOutlineHeart />
          </span>
        </div>
      );
    }
  };
  useEffect(() => {
    dispatch(
      get_my_rating({
        product_slug: product.slug,
      })
    );
  }, [product]);
  useEffect(() => {
    if (product?.slug) {
      const obj = {
        product_slug: product.slug,
      };
      if (pageNumber) {
        obj.page = pageNumber;
      }
      dispatch(get_reviews(obj));
    }
  }, [product, pageNumber]);
  useEffect(() => {
    if (product?.slug) {
      dispatch(
        get_ratings({
          product_slug: product.slug,
        })
      );
    }
  }, [product]);

  const split_ratings = num => {
    let count = 0;
    ratings?.forEach(rat => {
      if (rat.rating === num) {
        count++;
      }
    });

    return count;
  };

  return (
    <div className="mt-8">
      <div className="flex gap-10 md-lg:flex-col">
        <div className="flex flex-col gap-2 justify-start items-start py-4">
          <div className="">
            <span className="text-6xl font-semibold ">{rating || 0}</span>
            <span className="text-3xl font-semibold text-slate-600">/5</span>
          </div>
          <div className="flex text-3xl ">
            <Rating ratings={rating} />
          </div>
          <p
            className="text-sm text-slate-600"
            dir="rtl">
            {" "}
            {totalRating} بازخورد
          </p>
        </div>
        <div className="flex gap-2 flex-col py-4">
          <div className="flex justify-start items-center gap-5">
            <div className="text-md flex gap-1 w-[93px]">
              <RatingTemp rating={5} />
            </div>
            <div className="w-[200px] h-[14px] bg-slate-200 relative">
              <div
                style={{
                  width: `${Math.floor(
                    (100 * (split_ratings(5) || 0)) / totalRating
                  )}%`,
                }}
                className="h-full bg-[#Edbb0E] "></div>
            </div>
            <p className="text-sm text-slate-600 w-[0%]">{split_ratings(5)}</p>
          </div>
          <div className="flex justify-start items-center gap-5">
            <div className="text-md flex gap-1 w-[93px]">
              <RatingTemp rating={4} />
            </div>
            <div className="w-[200px] h-[14px] bg-slate-200 relative">
              <div
                style={{
                  width: `${Math.floor(
                    (100 * (split_ratings(4) || 0)) / totalRating
                  )}%`,
                }}
                className="h-full bg-[#Edbb0E] "></div>
            </div>
            <p className="text-sm text-slate-600 w-[0%]"> {split_ratings(4)}</p>
          </div>
          <div className="flex justify-start items-center gap-5">
            <div className="text-md flex gap-1 w-[93px]">
              <RatingTemp rating={3} />
            </div>
            <div className="w-[200px] h-[14px] bg-slate-200 relative">
              <div
                style={{
                  width: `${Math.floor(
                    (100 * (split_ratings(3) || 0)) / totalRating
                  )}%`,
                }}
                className="h-full bg-[#Edbb0E] "></div>
            </div>
            <p className="text-sm text-slate-600 w-[0%]"> {split_ratings(3)}</p>
          </div>
          <div className="flex justify-start items-center gap-5">
            <div className="text-md flex gap-1 w-[93px]">
              <RatingTemp rating={2} />
            </div>
            <div className="w-[200px] h-[14px] bg-slate-200 relative">
              <div
                style={{
                  width: `${Math.floor(
                    (100 * (split_ratings(2) || 0)) / totalRating
                  )}%`,
                }}
                className="h-full bg-[#Edbb0E] "></div>
            </div>
            <p className="text-sm text-slate-600 w-[0%]"> {split_ratings(2)}</p>
          </div>
          <div className="flex justify-start items-center gap-5">
            <div className="text-md flex gap-1 w-[93px]">
              <RatingTemp rating={1} />
            </div>
            <div className="w-[200px] h-[14px] bg-slate-200 relative">
              <div
                style={{
                  width: `${Math.floor(
                    (100 * (split_ratings(1) || 0)) / totalRating
                  )}%`,
                }}
                className="h-full bg-[#Edbb0E] w-[10%] "></div>
            </div>
            <p className="text-sm text-slate-600 w-[0%]"> {split_ratings(1)}</p>
          </div>
        </div>
      </div>

      <h2
        className="text-slate-600 text-2xl font-bold py-5"
        dir="rtl">
        تعداد نظرات : {totalReview}نظر
      </h2>
      <div className="flex flex-col gap-8 pb-10 pt-4">
        {reviews?.map((re, i) => (
          <div
            dir="rtl"
            key={i}
            className="flex flex-col gap-1 w-[95%] mx-auto after:w-full after:mt-[10px] after:mx-auto after:h-[1px] after:bg-black">
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-slate-600 text-xl font-bold mb-3">
                  {re.title}
                </span>
                <p className="text-slate-600 text-lg mr-2">{re.comment}</p>
              </div>

              <div className="flex gap-10 justify-center items-end">
                {re.customer.id === userInfo?.id ? (
                  <div className="flex font-semibold text-[16px] justify-center items-end">
                    <button
                      onClick={() =>
                        re.customer.id === userInfo?.id &&
                        dispatch(
                          delete_review({
                            info: { reId: re.id, slug: product.slug },
                          })
                        )
                      }
                      className="hover:font-bold hover:text-[20px]">
                      حذف
                    </button>
                  </div>
                ) : (
                  <div className="flex font-semibold text-[16px] justify-center items-end">
                    <button
                      onClick={() => {
                        if (!userInfo) {
                          navigate("/login");
                        }
                        inputRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                        inputRef.current?.focus();
                        setIsReplaying(true);
                      }}
                      className="hover:font-bold hover:text-[20px]">
                      بازخورد
                    </button>
                  </div>
                )}
                {re.reactions.map((reA, i) =>
                  reaction(
                    re.id,
                    reA.id,
                    reA.reaction,
                    userInfo?.id === reA.customer.id
                  )
                )}
                {!re.reactions.length ? reaction(re.id) : ""}
              </div>
            </div>
            <div className=" flex flex-col w-full justify-end items-end pt-2">
              {re.replies?.map((item, i) => {
                return (
                  <div className="w-[90%] flex justify-start  items-start">
                    <p className="font-bold ">ادمین</p>
                    <span className="mt-[6px] text-[16px]">
                      <IoMdArrowDropleft />
                    </span>
                    <p className="text-sm leading-[24px]">{item.comment}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <div className="flex justify-end ">
          {totalReview > 5 && (
            <Pagination
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              totalItem={totalReview}
              parPage={parPage}
              showItem={Math.floor(totalReview / 3)}
            />
          )}
        </div>
      </div>
      <div>
        {userInfo.id ? (
          <div className="flex flex-col gap-3">
            <div className="flex gap-1">
              <RatingReact
                onChange={e => setRat(e)}
                initialRating={rat || myRating?.rating}
                emptySymbol={
                  <span className="text-[#Edbb0E] text-4xl">
                    <CiStar />
                  </span>
                }
                fullSymbol={
                  <span className="text-[#Edbb0E] text-4xl">
                    <FaStar />
                  </span>
                }
              />
            </div>
            <form
              className="flex flex-col justify-center items-end"
              onSubmit={submit}>
              <textarea
                ref={inputRef}
                dir="rtl"
                value={re}
                onChange={e => setRe(e.target.value)}
                cols={30}
                rows={5}
                className="border outline-0 p-3 w-full pr-6 text-[18px]"
                name=""
                id=""></textarea>
              <div className="mt-2">
                <button
                  disabled={!(rat || re)}
                  className="py-1 px-5 bg-indigo-500 text-white rounded-sm m-3">
                  ارسال
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="mb-4">
            <Link
              to={"/login"}
              className="py-1 px-5 bg-red-500 text-white rounded-sm ml-[calc(100%-135px)]">
              ! وارد شوید
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
