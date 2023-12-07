import React from 'react'
import Header from '../Components/Layout/Header'
import LeftSide from '../Components/Home/LeftSide'
import RightSide from '../Components/Home/RightSide'
import Status from '../Components/Home/Status'
import Posts from '../Components/Home/Posts'
import { useSelector } from 'react-redux'

const HomePage = () => {
  const { posts } = useSelector(state => state.homePost)

  return (
    <div>
      <Header />

      <div className=' flex justify-center bg-gray-100 mt-[50px]'>
        <div className='hidden fixed h-screen lg:block left-0 w-[25%] max-w-[300px]'>
          <LeftSide></LeftSide>
        </div>
        <div className='w-full  sm:w-[600px] rounded-xl '>
          {/* <div className='w-[80%] mx-auto'> */}
          <Status />
          <br />
          <Posts posts={posts} />
          {/* <CardSection></CardSection> */}
          {/* <Main></Main> */}
          {/* </div> */}
        </div>
        <div className='hidden fixed h-screen lg:block right-0 w-[25%] max-w-[300px]'>
          <RightSide></RightSide>
        </div>
      </div>
    </div>
  )
}

export default HomePage
