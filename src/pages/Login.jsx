import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaInstagram, FaTelegram } from "react-icons/fa";
import { LiaEyeSlash, LiaEyeSolid } from "react-icons/lia";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  get_customer,
  login,
  messageClear,
  send_otp_code,
  verify_otp_code,
} from "../store/Reducers/AuthReducer";
import { create_card } from "../store/Reducers/cardReducer";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, successMessage, errorMessage, loader } = useSelector(
    state => state.auth
  );
  if (userInfo.id) {
    navigate("/");
  }
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [lWOtp, setLWOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit_otp = e => {
    e.preventDefault();
    if (confirm) {
      dispatch(verify_otp_code({ phone_number: number, otp_code: otp }));
    } else {
      setConfirm(true);
      dispatch(send_otp_code({ phone_number: number }));
    }
  };
  const submit = e => {
    e.preventDefault();
    dispatch(login({ phone_number: number, password: password }));
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(create_card(userInfo.id));
      dispatch(get_customer());
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (userInfo.id) {
      navigate("/");
    }
  }, [successMessage, errorMessage]);

  return (
    <div className="min-h-screen rounded-lg flex justify-center items-center mx-auto bg-white">
      <div className="flex w-full h-full justify-center px-5 mt-[60px]">
        <div
          className="w-full min-[700px]:w-[60%] min-[1024px]:w-[40%] min-[1300px]:w-[30%] min-[1500px]:w-[22%] flex justify-end flex-col items-end bg-white shadow-md
        border-[1px] text-white p-7 rounded-tl-lg rounded-bl-lg">
          <div className="flex justify-center items-center gap-6 md:gap-4 mt-1">
            <Link className="text-[25px] text-[#a3a3a3] border-[1px] p-2 rounded-full">
              <FaTelegram />
            </Link>
            <Link className="text-[25px] text-[#a3a3a3] border-[1px] p-2 rounded-full">
              <FaInstagram />
            </Link>
          </div>
          {!lWOtp && (
            <form
              onSubmit={submit_otp}
              className="flex flex-col pt-10 pb-5 w-full justify-center items-end">
              {!confirm ? (
                <div className="w-full flex flex-col gap-1 items-end">
                  <label
                    htmlFor="number"
                    className="w-full mr-1 text-black font-semibold flex justify-end">
                    {" "}
                    شماره همراه{" "}
                  </label>
                  <input
                    className="mt-4 w-full py-2 px-5 rounded-lg bg-[#EDEEF4] text-black outline-none"
                    value={number}
                    dir="rtl"
                    onChange={e => {
                      setNumber(e.target.value);
                    }}
                    type="number"
                    inputMode="numeric"
                    id="number"
                    name="number"
                    placeholder="شماره"
                  />
                  <button
                    className="px-5 bg-[#111111] w-full py-2 text-white flex mt-5 justify-center items-center gap-2 font-semibold rounded-md"
                    disabled={!number ? true : false}>
                    {loader ? "در حال بررسی ..." : "ارسال کد تایید"}
                  </button>
                </div>
              ) : (
                !lWOtp && (
                  <div className="w-full flex flex-col gap-1 items-end">
                    <label
                      htmlFor="number"
                      className="w-full mr-1 text-black font-semibold flex justify-end">
                      کد تایید
                    </label>
                    <input
                      className="w-full py-2 px-5 rounded-lg bg-[#EDEEF4] text-black outline-none"
                      value={otp}
                      dir="rtl"
                      onChange={e => {
                        setOtp(e.target.value);
                      }}
                      type="number"
                      inputMode="numeric"
                      id="otp"
                      name="otp"
                      placeholder="کد تایید"
                    />
                    <button
                      className="px-5 bg-[#111111] w-full py-2 flex justify-center mt-5 items-center gap-2 text-black font-semibold rounded-md"
                      disabled={!otp ? true : false}>
                      <div className="w-[20px] h-[3px] mt-1 bg-black"></div>
                      {loader ? "در حال بررسی ..." : "تایید"}
                    </button>
                  </div>
                )
              )}
            </form>
          )}
          {lWOtp && (
            <form
              onSubmit={submit}
              className="flex flex-col pt-10 pb-5 w-full justify-center items-end">
              <div className="w-full flex flex-col gap-4 items-end">
                <label
                  htmlFor="number"
                  className="w-full mr-1 text-black font-semibold flex justify-end">
                  {" "}
                  شماره همراه{" "}
                </label>
                <input
                  className="w-full py-2 px-5 rounded-lg bg-[#EDEEF4] text-black outline-none"
                  value={number}
                  dir="rtl"
                  onChange={e => {
                    setNumber(e.target.value);
                  }}
                  type="number"
                  inputMode="numeric"
                  id="number"
                  name="number"
                  placeholder="شماره"
                />
                <label
                  htmlFor="password"
                  className="w-full mr-1 text-black font-semibold flex justify-end">
                  رمز عبور
                </label>
                <div className="w-full relative flex justify-center items-center">
                  <input
                    className="w-full py-2 pr-5 pl-10 rounded-lg bg-[#EDEEF4] text-black outline-none"
                    value={password}
                    dir="rtl"
                    onChange={e => {
                      setPassword(e.target.value);
                    }}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="رمز عبور"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-[11px] cursor-pointer left-4 text-[20px] text-black">
                    {!showPassword ? <LiaEyeSolid /> : <LiaEyeSlash />}
                  </span>
                </div>
                <button
                  className="px-5 bg-[#111111] w-full py-2 text-white flex mt-5 justify-center items-center gap-2 font-semibold rounded-md"
                  disabled={!number ? true : false}>
                  {loader ? "در حال بررسی ..." : "ورود"}
                </button>
              </div>
            </form>
          )}
          <div
            onClick={() => setLWOtp(!lWOtp)}
            className="text-[16px] font-semibold text-black w-full min-[700px]:hidden cursor-pointer px-5 flex justify-center items-center rounded-lg">
            {lWOtp ? (
              <span>ورود با کد تایید</span>
            ) : (
              <span>ورود با رمز عبور</span>
            )}
          </div>
        </div>
        <div
          className="w-full text-white hidden min-[700px]:w-[60%] min-[1024px]:w-[40%]
         min-[1300px]:w-[30%] min-[1500px]:w-[22%] shadow-md text-[25px] rounded-tr-lg rounded-br-lg font-bold bg-[#111111] flex-col min-[700px]:flex justify-center items-center">
          <h2>فروشگاه لباس</h2>
          <span>جلدور</span>
          <div
            onClick={() => setLWOtp(!lWOtp)}
            className="text-[18px] cursor-pointer mt-8 border-[2px] px-5 py-2 flex justify-center items-center rounded-lg">
            {lWOtp ? (
              <span>ورود با کد تایید</span>
            ) : (
              <span>ورود با رمز عبور</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
