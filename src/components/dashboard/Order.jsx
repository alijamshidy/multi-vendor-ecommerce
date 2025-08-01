import React, {useState } from 'react';
import { Link } from 'react-router-dom';

const Orders = () => {
    const [state, setState] = useState('all')

    return (
        <div className='bg-white p-4 rounded-md'>
            <div className='flex justify-between items-center'>
                <h2 className='text-xl font-semibold text-slate-600'>سبد خرید من</h2>
                <select className='outline-none px-3 py-1 border rounded-md text-slate-600' value={state} onChange={(e) => setState(e.target.value)} >
                    <option value="all">--وضعیت خرید--</option>
                    <option value="placed">تحویل به پست</option>
                    <option value="pending">درحال انتظار</option>
                    <option value="cancelled">کنسلی</option>
                    <option value="warehouse">انبار</option>
                </select> 
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
    );
};

export default Orders;