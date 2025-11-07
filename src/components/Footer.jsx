import React from "react";
import { AiOutlineWhatsApp } from "react-icons/ai";
import { FaInstagram, FaPhoneAlt, FaTelegram } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="w-full h-full flex justify-center items-center bg-[#e4bba9] pb-4">
      <div className="md:flex  grid justify-center md:justify-between items-center gap-3 text-black w-[90%] md:w-[97%] mx-auto">
        <div className="flex flex-1 flex-col mt-4 md:mt-0 justify-center items-center md:items-start gap-4 order-last md:order-first">
          <span>Contact Info : </span>
          <div className="flex justify-center items-center gap-1">
            <span>Phone Number : </span>
            <span>09xxxxxxxx</span>
          </div>
          <div className="flex justify-center items-center gap-6 md:gap-4 mt-1">
            <Link className="text-[22px] text-gray-900">
              <FaPhoneAlt />
            </Link>
            <Link className="text-[27px] text-green-600/80">
              <AiOutlineWhatsApp />
            </Link>

            <Link className="text-[25px] text-blue-600/80">
              <FaTelegram />
            </Link>

            <Link className="text-[25px]  text-red-600/80 ">
              <FaInstagram />
            </Link>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-end md:justify-center items-center">
          <span>Wear Free, Look Pretty</span>
          <img
            className="-mt-3 -mb-8"
            src="http://localhost:3000/images/footer.svg"
            alt=""
          />
          <span>𝒎𝒂𝒅𝒆 𝒃𝒚 𝒎𝒂𝒅 𝒘𝒆𝒃 𝒕𝒆𝒂𝒎</span>
        </div>
        <div className="md:flex flex-1 justify-end items-start gap-12 hidden">
          <div className="flex flex-col justify-center items-end gap-2">
            <span className="mb-4">categories</span>
            <Link className="hover:font-medium">Pants</Link>
            <Link className="hover:font-medium">Scarfs</Link>
            <Link className="hover:font-medium">Shumizes</Link>
            <Link className="hover:font-medium">Tank Tops</Link>
          </div>
          <div className="flex flex-col justify-start items-end gap-2">
            <span className="mb-4">useful Links</span>
            <Link className="hover:font-medium">About us</Link>
            <Link className="hover:font-medium">Contact</Link>
            <Link className="hover:font-medium">Co-Op</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
