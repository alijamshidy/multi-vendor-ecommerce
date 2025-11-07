<<<<<<< HEAD
import React from 'react'
import { Link } from 'react-router-dom'

const OrderDetails = () => {

  return (
    <div className='bg-white p-5'>
      <h2 className='text-slate-600 font-semibold'>#1 , <span className='pl-1'>1382/5/6</span></h2>
      <div className='flex flex-wrap justify-between items-center'>
        <div className='flex flex-col gap-5'>
            <h2 className='text-slate-600 font-semibold font-sans'>
            تحویل به : name
            </h2>
            <p>
                <span className='bg-black text-white text-xs cursor-pointer font-medium mr-2 px-2 py-2 rounded'>خانه</span>
                <span className='text-slate-600 text-sm'>
                address
                </span>
            </p>
            <p className='text-slate-600 text-md font-semibold'>
                Email To : email@gmial.com
            </p>
        </div>
        <div className='text-slate-600 flex flex-col gap-5 justify-center items-center'>
            <h2 className='font-medium'>قیمت : ۱۰۰۰تومان (شامل حمل و نقل)</h2>
            <p className='text-[18px] font-medium'> وضعیت پرداخت : <span className={`py-[1px] text-xs px-3 
                ${'paid' === 'paid' ? 'bg-green-300 text-green-800' : 'bg-rose-300 text-red-800'}
                rounded-md`}>درحال \رداخت</span>
            </p>
            <p className='font-medium'> وضعیت سفارش : <span className={`py-[1px] text-xs px-3 
                ${'sadasd' === 'paid' ? 'bg-green-300 text-green-800' : 'bg-rose-300 text-red-800'}
                rounded-md`}>در حال انتظار</span>
            </p>
        </div>
      </div>
      <div className='mt-4'>
        <h2 className='text-slate-600 text-lg pb-2 font-sans font-bold'>محصولات خریده شده</h2>
        <div className='flex gap-5 flex-col'>
            {
                [1,2,3,4,5,6].map((p,i) => <div key={i}>
                    <div className='flex gap-5 justify-start items-center text-slate-600'>
                        <div className='flex gap-2'>
                            <img className='w-[55px] h-[55px]' alt='' />
                            <div className='flex text-sm flex-col justify-start items-start'>
                                <Link >name</Link>
                                <p>
                                    <span>Brand : brand</span>
                                </p>
                                <p>
                                    <span>Quantity : Quantity</span>
                                </p>
                            </div>
                        </div>
                        <div className='pl-4 flex flex-col'>
                            <h2 className='text-md text-green-800'>$150</h2>
                            <p className='line-through'>100</p>
                            <p>-5%</p>
                        </div>
                    </div>
                </div>)
            }
        </div>
      </div>
    </div>
  )
}

export default OrderDetails
=======
import React from 'react'
import { Link } from 'react-router-dom'

const OrderDetails = () => {

  return (
    <div className='bg-white p-5'>
      <h2 className='text-slate-600 font-semibold'>#1 , <span className='pl-1'>1382/5/6</span></h2>
      <div className='flex flex-wrap justify-between items-center'>
        <div className='flex flex-col gap-5'>
            <h2 className='text-slate-600 font-semibold font-sans'>
            تحویل به : name
            </h2>
            <p>
                <span className='bg-black text-white text-xs cursor-pointer font-medium mr-2 px-2 py-2 rounded'>خانه</span>
                <span className='text-slate-600 text-sm'>
                address
                </span>
            </p>
            <p className='text-slate-600 text-md font-semibold'>
                Email To : email@gmial.com
            </p>
        </div>
        <div className='text-slate-600 flex flex-col gap-5 justify-center items-center'>
            <h2 className='font-medium'>قیمت : ۱۰۰۰تومان (شامل حمل و نقل)</h2>
            <p className='text-[18px] font-medium'> وضعیت پرداخت : <span className={`py-[1px] text-xs px-3 
                ${'paid' === 'paid' ? 'bg-green-300 text-green-800' : 'bg-rose-300 text-red-800'}
                rounded-md`}>درحال \رداخت</span>
            </p>
            <p className='font-medium'> وضعیت سفارش : <span className={`py-[1px] text-xs px-3 
                ${'sadasd' === 'paid' ? 'bg-green-300 text-green-800' : 'bg-rose-300 text-red-800'}
                rounded-md`}>در حال انتظار</span>
            </p>
        </div>
      </div>
      <div className='mt-4'>
        <h2 className='text-slate-600 text-lg pb-2 font-sans font-bold'>محصولات خریده شده</h2>
        <div className='flex gap-5 flex-col'>
            {
                [1,2,3,4,5,6].map((p,i) => <div key={i}>
                    <div className='flex gap-5 justify-start items-center text-slate-600'>
                        <div className='flex gap-2'>
                            <img className='w-[55px] h-[55px]' alt='' />
                            <div className='flex text-sm flex-col justify-start items-start'>
                                <Link >name</Link>
                                <p>
                                    <span>Brand : brand</span>
                                </p>
                                <p>
                                    <span>Quantity : Quantity</span>
                                </p>
                            </div>
                        </div>
                        <div className='pl-4 flex flex-col'>
                            <h2 className='text-md text-green-800'>$150</h2>
                            <p className='line-through'>100</p>
                            <p>-5%</p>
                        </div>
                    </div>
                </div>)
            }
        </div>
      </div>
    </div>
  )
}

export default OrderDetails
>>>>>>> 86be6a8 (.)
