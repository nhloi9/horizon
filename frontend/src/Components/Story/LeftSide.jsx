import { Avatar } from 'antd'
import React from 'react'

const LeftSide = ({ stories, current, setCurrent }) => {
  return (
    <div className='!w-[300px]  pt-[70px] px-2 h-screen hidden md:block hover:overflow-y-scroll overflow-y-hidden bg-gray-50 shadow-md'>
      <h1 className='!font-[900] text-[24px]'>Stories</h1>
      <br />
      <h2>All Stories</h2>
      <div className='flex flex-col gap-3'>
        {stories.map((story, index) => (
          <div
            key={index}
            className={`flex px-1 rounded-md gap-2 items-center py-1 cursor-pointer ${
              index === current && 'bg-gray-300'
            }`}
            onClick={() => {
              setCurrent(index)
            }}
          >
            <div className='rounded-full border-[3px] border-blue-600 shadow'>
              <div className='rounded-full border-[3px] border-gray-100 shadow'>
                <Avatar
                  size={'large'}
                  src={story?.user?.avatar?.url}
                  className='shadow'
                />
              </div>
            </div>
            <div>
              <h1 className=''>
                {story?.user?.firstname + ' ' + story?.user?.lastname}
              </h1>
              <p className='text-sm text-gray-500'>6 hours ago</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LeftSide
