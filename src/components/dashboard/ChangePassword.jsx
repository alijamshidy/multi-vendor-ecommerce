
import React from 'react'

const ChangePassword = () => {
  return (
    <div className='p-4 bg-white'>
        <h2 className='text-xl text-slate-600 pb-5'>تغییر رمز عبور</h2>
        <form>
            <div className='flex flex-col gap-1 mb-2'>
                <label htmlFor='new_password'>پسورد جدید</label>
                <input className='outline-none px-3 py-1 border rounded-md text-slate-600' 
                type='password' name='new_password' id='new_password' placeholder='New Password'/>
            </div>
            <div className='flex flex-col gap-1 mb-2'>
                <label htmlFor='confirm_password'>تایید پسورد</label>
                <input className='outline-none px-3 py-1 border rounded-md text-slate-600' 
                type='password' name='confirm_password' id='confirm_password' placeholder='Confirm Password'/>
            </div>
            <div>
                <button className='px-8 py-2 bg-[#111111] text-white 
                shadow-lg hover:shadow-black mt-5 rounded-md'>اپدیت رمز عبور</button>
            </div>
        </form>
    </div>
  )
}

export default ChangePassword;