import React, { useEffect } from 'react'

const Frequent = () => {

  useEffect(() => {
    const box_frequent = document.querySelectorAll('.box-frequent')
    const frequent = document.querySelectorAll('.frequent')
    const answer = document.querySelectorAll('.answer')
    box_frequent.forEach((btn,i) => {
      btn.addEventListener('click', () => {
        frequent[i].classList.toggle('h-0')
        frequent[i].classList.toggle('py-5')
        box_frequent[i].classList.toggle('rounded-b-md')
        answer[i].classList.toggle('hidden')
      })
    })
  },[])

  return (
    <div className='w-full pb-10 mt-10'>
      <div className='flex w-full justify-start items-center flex-col gap-5'>
        <div className='w-full flex justify-center items-center'>
          <div className='mb-10 border-b-2 border-black border-t-2 py-4'>
              <h2 className='text-[25px] font-bold'>سوالات پرتکرار</h2>
          </div>
        </div>
        <div className='flex w-full justify-start items-center flex-col gap-5'>
          <div className='w-full flex justify-center items-center flex-col'>
            <div className='box-frequent z-50 font-semibold w-full text-end cursor-pointer border border-gray-300 bg-[#fcfcfc] rounded-t-md rounded-b-md py-5 text-black px-8 flex justify-end items-center shadow-sm'>
              <p>Lorem ipsum dolor sit amet, lo consectetur adipisicing elit. Rerum beatae sit sed, ipsa recusandae doloremque provident alias quod laudantium sequi cumque dolor harum, iusto optio consequuntur quo doloribus pariatur quae.</p>
            </div> 
            <div className='frequent rounded-b-md h-0 text-end w-full duration-300 px-8 bg-[#EDEEF4] text-black flex justify-center items-center shadow-sm'>
              <span className='answer hidden'>Lorem ipsum dolor sit amet, consectetur adipisicing Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint explicabo obcaecati ipsam nemo eos commodi perferendis quae, molestiae consequuntur doloremque voluptatum a! Quaerat soluta non minima? Nisi veritatis reiciendis aspernatur. elit. Rerum beatae sit sed, ipsa recusandae doloremque provident alias quod laudantium sequi cumque dolor harum, iusto optio consequuntur quo doloribus pariatur quae.</span>
            </div>
          </div>
          <div className='w-full flex justify-center items-center flex-col'>
            <div className='box-frequent z-50 font-semibold w-full text-end cursor-pointer border border-gray-300 bg-[#fcfcfc] rounded-t-md rounded-b-md py-5 text-black px-8 flex justify-end items-center shadow-sm'>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum beatae sit sed, ipsa recusandae doloremque provident alias quod laudantium sequi cumque dolor harum, iusto optio consequuntur quo doloribus pariatur quae.</p>
            </div> 
            <div className='frequent rounded-b-md h-0 text-end w-full duration-300 px-8 bg-[#EDEEF4] text-black flex justify-center items-center shadow-sm'>
              <span className='answer hidden'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum beatae sit sed, ipsa recusandae doloremque provident alias quod laudantium sequi cumque dolor harum, iusto optio consequuntur quo doloribus pariatur quae.</span>
            </div>
          </div>
          <div className='w-full flex justify-center items-center flex-col'>
            <div className='box-frequent z-50 font-semibold w-full text-end cursor-pointer border border-gray-300 bg-[#fcfcfc] rounded-t-md rounded-b-md py-5 text-black px-8 flex justify-end items-center shadow-sm'>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum beatae sit sed, ipsa recusandae doloremque provident alias quod laudantium sequi cumque dolor harum, iusto optio consequuntur quo doloribus pariatur quae.</p>
            </div> 
            <div className='frequent rounded-b-md h-0 text-end w-full duration-300 px-8 bg-[#EDEEF4] text-black flex justify-center items-center shadow-sm'>
              <span className='answer hidden'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum beatae sit sed, ipsa recusandae doloremque provident alias quod laudantium sequi cumque dolor harum, iusto optio consequuntur quo doloribus pariatur quae.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Frequent
