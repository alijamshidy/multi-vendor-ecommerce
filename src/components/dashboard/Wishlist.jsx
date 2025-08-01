import React from 'react'
import { FaEye, FaRegHeart } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import Rating from '../Rating';
import { Link } from 'react-router-dom';


const Wishlist = () => {


  return (
    <div className='w-full flex justify-start items-center flex-wrap gap-6'>
        {
            [1,2,3,4,5].map((i,j) => <Link dir='ltr' className='bg-white w-[300px] min-[800px]:w-[250px] group hover:-translate-y-3 duration-500 shadow-md pb-6 cursor-pointer rounded-md flex justify-center gap-5 items-center flex-col'>
            <div className='w-full relative flex flex-col justify-center items-center'>
              <img src='http://localhost:3000/image/banner/2.jpg' className='w-full h-[250px] rounded-t-md' alt='product img' />
              <span className='absolute bg-[#111111] text-[#EDEEF4] w-[40px] rounded-full flex
              items-center justify-center top-2 right-2 h-[40px] font-bold text-[14px]'>
                  جدید
              </span>
            </div>
            <div className='flex w-full justify-center px-8 gap-4 text-start items-start flex-col'>
              <div className='w-full flex justify-end items-center'>
                <p className='font-semibold'>کت و شلوار ۴ دکمه</p>
              </div>
              <div className='w-full flex justify-end items-center'>
                <span dir='ltr' className={`text-[13px] ${5 > 6 ? 'text-black' : 'text-red-700'}`}>{ 5 > 6 ? 'موجود در انبار' : 'تنها ۱ عدد در انبار باقی مانده'}</span>
              </div>
              <span dir='rtl'>۴۵۰۰۰۰۰۰ تومان</span>
              <div className='flex gap-2 flex-col w-full'>
                <div className='flex rounded-md bg-[#EDEEF4] h-[30px] w-full justify-center items-start text-xl'>
                    <div className='px-3 flex justify-center w-3/12 items-center cursor-pointer'>-</div>
                    <div className='px-3 flex justify-center items-center w-6/12'>1</div>
                    <div className='px-3 flex justify-center items-center w-3/12 cursor-pointer'>+</div>
                </div>
                <button className='px-5 py-[3px] rounded-md bg-[#111111] text-white'>پاک کردن</button>
                </div>
            </div>
            </Link>
            )
        }
    </div>
  )
}

export default Wishlist
