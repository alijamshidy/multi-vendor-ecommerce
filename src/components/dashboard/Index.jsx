<<<<<<< HEAD
import React from 'react'
import { IoCart } from "react-icons/io5";
import { Link } from 'react-router-dom';

const Index = () => {


  return (
    <div>
      <div className='grid min-[1200px]:grid-cols-3 grid-cols-1 gap-5'>
        <div className='flex justify-center shadow-md border border-gray-200 items-center p-5 bg-white rounded-md gap-5'>
          <div className='bg-black w-[47px] h-[47px] rounded-full flex justify-center items-center text-xl'>
            <span className='text-xl text-white'><IoCart /></span>
          </div>
          <div className='flex flex-col justify-start items-start text-slate-600'>
            <h2 className='text-3xl font-bold'>۵</h2>
            <span>خرید ها</span>
          </div>
        </div>
        <div className='flex justify-center items-center shadow-md border border-gray-200 p-5 bg-white rounded-md gap-5'>
          <div className='bg-black w-[47px] h-[47px] rounded-full flex justify-center items-center text-xl'>
            <span className='text-xl text-white'><IoCart /></span>
          </div>
          <div className='flex flex-col justify-start items-start text-slate-600'>
            <h2 className='text-3xl font-bold'>۴</h2>
            <span>در انتظار پرداخت</span>
          </div>
        </div>
        <div className='flex justify-center shadow-md border border-gray-200 items-center p-5 bg-white rounded-md gap-5'>
          <div className='bg-black w-[47px] h-[47px] rounded-full flex justify-center items-center text-xl'>
            <span className='text-xl text-white'><IoCart /></span>
          </div>
          <div className='flex flex-col justify-start items-start text-slate-600'>
            <h2 className='text-3xl font-bold'>۷</h2>
            <span>کنسلی ها</span>
          </div>
        </div>
      </div>
      <div className='bg-white shadow-md border border-gray-200 p-5 mt-5 rounded-md'>
        <h2>خرید های اخیر</h2>
        <div className='pt-4'>
          <div className='relative overflow-x-auto rounded-md'>
            <table className='w-full text-sm text-left text-gray-500'>
              <thead className='text-xs text-gray-700 uppercase bg-gray-200'>
                <tr>
                  <th scope='col' className='px-6 py-3'>ایدی محصول</th>
                  <th scope='col' className='px-6 py-3'>قیمت</th>
                  <th scope='col' className='px-6 py-3'>وضعیت پرداخت</th>
                  <th scope='col' className='px-6 py-3'>وضعیت محصول</th>
                  <th scope='col' className='px-6 py-3'>اقدام</th>
                </tr>
              </thead>
              <tbody>
                {
                  [1,2,3,4,5,6].map((o,i) => <tr className='bg-white border-b'>
                  <td scope='row' className='px-6 py-4 font-medium whitespace-nowrap'>1</td>
                  <td scope='row' className='px-6 py-4 font-medium whitespace-nowrap'>۱۰۰۰ تومان</td>
                  <td scope='row' className='px-6 py-4 font-medium whitespace-nowrap'>درحال پرداخت</td>
                  <td scope='row' className='px-6 py-4 font-medium whitespace-nowrap'>درحال پرداخت</td>
                  <td scope='row' className='px-6 py-4 font-medium whitespace-nowrap'>
                    <Link to={`/dashboard/order/details/1`}><span className='bg-black text-white text-md font-semibold 
                    mr-2 px-3 py-[2px] rounded'>مشاهده</span></Link>
                    {
                      o.payment_status !== 'paid' &&
                      <span className='bg-black text-white text-md font-semibold 
                      mr-2 px-3 py-[2px] cursor-pointer rounded'>پرداخت</span>
                    }
                  </td>
                </tr>)
                }
                
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
=======
import React from 'react'
import { IoCart } from "react-icons/io5";
import { Link } from 'react-router-dom';

const Index = () => {


  return (
    <div>
      <div className='grid min-[1200px]:grid-cols-3 grid-cols-1 gap-5'>
        <div className='flex justify-center shadow-md border border-gray-200 items-center p-5 bg-white rounded-md gap-5'>
          <div className='bg-black w-[47px] h-[47px] rounded-full flex justify-center items-center text-xl'>
            <span className='text-xl text-white'><IoCart /></span>
          </div>
          <div className='flex flex-col justify-start items-start text-slate-600'>
            <h2 className='text-3xl font-bold'>۵</h2>
            <span>خرید ها</span>
          </div>
        </div>
        <div className='flex justify-center items-center shadow-md border border-gray-200 p-5 bg-white rounded-md gap-5'>
          <div className='bg-black w-[47px] h-[47px] rounded-full flex justify-center items-center text-xl'>
            <span className='text-xl text-white'><IoCart /></span>
          </div>
          <div className='flex flex-col justify-start items-start text-slate-600'>
            <h2 className='text-3xl font-bold'>۴</h2>
            <span>در انتظار پرداخت</span>
          </div>
        </div>
        <div className='flex justify-center shadow-md border border-gray-200 items-center p-5 bg-white rounded-md gap-5'>
          <div className='bg-black w-[47px] h-[47px] rounded-full flex justify-center items-center text-xl'>
            <span className='text-xl text-white'><IoCart /></span>
          </div>
          <div className='flex flex-col justify-start items-start text-slate-600'>
            <h2 className='text-3xl font-bold'>۷</h2>
            <span>کنسلی ها</span>
          </div>
        </div>
      </div>
      <div className='bg-white shadow-md border border-gray-200 p-5 mt-5 rounded-md'>
        <h2>خرید های اخیر</h2>
        <div className='pt-4'>
          <div className='relative overflow-x-auto rounded-md'>
            <table className='w-full text-sm text-left text-gray-500'>
              <thead className='text-xs text-gray-700 uppercase bg-gray-200'>
                <tr>
                  <th scope='col' className='px-6 py-3'>ایدی محصول</th>
                  <th scope='col' className='px-6 py-3'>قیمت</th>
                  <th scope='col' className='px-6 py-3'>وضعیت پرداخت</th>
                  <th scope='col' className='px-6 py-3'>وضعیت محصول</th>
                  <th scope='col' className='px-6 py-3'>اقدام</th>
                </tr>
              </thead>
              <tbody>
                {
                  [1,2,3,4,5,6].map((o,i) => <tr className='bg-white border-b'>
                  <td scope='row' className='px-6 py-4 font-medium whitespace-nowrap'>1</td>
                  <td scope='row' className='px-6 py-4 font-medium whitespace-nowrap'>۱۰۰۰ تومان</td>
                  <td scope='row' className='px-6 py-4 font-medium whitespace-nowrap'>درحال پرداخت</td>
                  <td scope='row' className='px-6 py-4 font-medium whitespace-nowrap'>درحال پرداخت</td>
                  <td scope='row' className='px-6 py-4 font-medium whitespace-nowrap'>
                    <Link to={`/dashboard/order/details/1`}><span className='bg-black text-white text-md font-semibold 
                    mr-2 px-3 py-[2px] rounded'>مشاهده</span></Link>
                    {
                      o.payment_status !== 'paid' &&
                      <span className='bg-black text-white text-md font-semibold 
                      mr-2 px-3 py-[2px] cursor-pointer rounded'>پرداخت</span>
                    }
                  </td>
                </tr>)
                }
                
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
>>>>>>> 86be6a8 (.)
