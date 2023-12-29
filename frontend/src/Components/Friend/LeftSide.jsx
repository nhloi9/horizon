import { Button } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const LeftSide = ({ active }) => {
  const navigate = useNavigate()
  return (
    <div className='friends-page-left flex flex-col sticky top-[60px] w-[350px]  bg-white h-[calc(100vh-60px)] shadow-lg border-r border-gray-300 p-3 group-left-side'>
      <div className='my-2 border-gray-300'>
        <h1 className='font-[700] text-[24px]'>Friends</h1>
      </div>
      <div className='h-full overflow-hidden hover:overflow-y-scroll scroll-min pt-2'>
        <div>
          <div
            className={`flex gap-2 items-center h-[50px] px-1 rounded-md hover:bg-gray-200 cursor-pointer bg-gray-200 `}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center bg-blue-500`}
            >
              <i className='invert home'></i>
            </div>
            <h1>Home</h1>
          </div>
          <div className='flex gap-2 items-center h-[50px] px-1 rounded-md hover:bg-gray-200 cursor-pointer'>
            <div className='w-9 h-9 rounded-full flex items-center justify-center  bg-gray-300'>
              <i className='request'></i>
            </div>
            <h1>Friend requests</h1>
          </div>
          <div className='flex gap-2 items-center h-[50px] px-1 rounded-md hover:bg-gray-200 cursor-pointer'>
            <div className='w-9 h-9 rounded-full flex items-center justify-center  bg-gray-300'>
              <i className='suggest'></i>
            </div>
            <h1>Suggestions</h1>
          </div>
          <div className='flex gap-2 items-center h-[50px] px-1 rounded-md hover:bg-gray-200 cursor-pointer'>
            <div className='w-9 h-9 rounded-full flex items-center justify-center  bg-gray-300'>
              <i className='friend'></i>
            </div>
            <h1>All friends</h1>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeftSide
