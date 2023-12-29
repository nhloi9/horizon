import React from 'react'
import LeftSide from './LeftSide'

const GroupFeed = () => {
  return (
    <div className='pt-[60px] bg-gray-200 min-h-[200vh]  flex relative'>
      <LeftSide active={1} />
      <div className='w-[calc(100%-35px)]'></div>
    </div>
  )
}

export default GroupFeed
