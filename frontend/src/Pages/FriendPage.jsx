import React from 'react'
import Header from '../Components/Layout/Header'
import LeftSide from '../Components/Friend/LeftSide'
import RightSide from '../Components/Friend/RightSide'

const FriendPage = () => {
  return (
    <div>
      <Header />
      <div className='pt-[60px] bg-gray-200 min-h-[200vh]  flex relative'>
        <LeftSide active={1} />
        <div className='w-[calc(100%-35px)]'>
          <RightSide />
        </div>
      </div>
    </div>
  )
}

export default FriendPage
