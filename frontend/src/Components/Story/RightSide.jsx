import React, { useEffect, useMemo, useState } from 'react'
import ReactPlayer from 'react-player'
import { Avatar, Button, Input, Progress } from 'antd'
import { BiSolidSend } from 'react-icons/bi'
import {
  FaGooglePlay,
  FaPause,
  FaPlay,
  FaVolumeDown,
  FaVolumeMute
} from 'react-icons/fa'
import SwipeableViews from 'react-swipeable-views'
import { FcNext, FcPrevious } from 'react-icons/fc'
import { reacts } from '../../Constants'

const RightSide = ({ current, storiesData, setCurrent }) => {
  const [percent, setPercent] = useState(0)
  const [play, setPlay] = useState(true)
  const [muted, setMuted] = useState(false)

  const handleNext = () => {
    setCurrent(Math.min(current + 1, storiesData.length - 1))
  }

  const handlePre = () => {
    setCurrent(Math.max(current - 1, 0))
  }

  const story = useMemo(() => {
    if (current !== undefined && current !== null) {
      return storiesData[current]
    } else return null
  }, [current, storiesData])

  useEffect(() => {
    setPercent(0)
    setPlay(true)
  }, [current])

  return (
    <div className=' w-full  md:w-[calc(100vw-300px)] relative h-screen pt-[60px] flex justify-center items-center bg-black '>
      {story && (
        <>
          <div className='w-[300px] h-[80%] relative story-video rounded-lg'>
            <ReactPlayer
              muted={muted}
              loop={false}
              onProgress={progress => {
                setPercent(progress.played)
              }}
              // controls
              playing={play}
              autoPlay
              url={story.video.url}
              className='!w-full !h-full !object-cover'
              onEnded={handleNext}
            ></ReactPlayer>

            <div className='w-full px-3 absolute  top-0 left-0 shadow-lg'>
              <Progress
                percent={percent * 100}
                showInfo={false}
                size={'small'}
              />
            </div>
            <div className='absolute top-7 w-full flex justify-between px-3'>
              <div className='flex gap-1 items-center'>
                <Avatar
                  src={story.user?.avatar?.url}
                  size={'default'}
                  className='shadow-lg'
                />
                <h1 className='text-white shadow'>
                  {story?.user?.firstname + ' ' + story?.user?.lastname}
                </h1>
              </div>
              <div className='flex gap-2 items-center'>
                {play ? (
                  <FaPause
                    className='!text-gray-50 shadow-lg cursor-pointer !font-[800] '
                    onClick={() => {
                      if (percent < 0.99) setPlay(false)
                    }}
                    size={19}
                  />
                ) : (
                  <FaPlay
                    className='!text-gray-50 shadow-lg cursor-pointer !font-[800] '
                    onClick={() => {
                      if (percent < 0.99) setPlay(true)
                    }}
                    size={19}
                  />
                )}
                {muted ? (
                  <FaVolumeMute
                    onClick={() => {
                      setMuted(false)
                    }}
                    size={24}
                    className='!text-gray-50 shadow-lg cursor-pointer !font-[800] '
                  />
                ) : (
                  <FaVolumeDown
                    onClick={() => {
                      setMuted(true)
                    }}
                    size={24}
                    className='!text-gray-50 shadow-lg cursor-pointer !font-[800] '
                  />
                )}
              </div>
            </div>
          </div>
          {current > 0 && (
            <div
              className='absolute flex justify-center items-center top-[50%] left-2 md:left-[20%] !rounded-full !w-14 !h-14 bg-[#999999] shadow cursor-pointer hover:bg-gray-50'
              onClick={handlePre}
            >
              <FcPrevious size={20} color='gray' />
            </div>
          )}
          {current < storiesData.length - 1 && (
            <div
              className='absolute flex justify-center items-center top-[50%] right-2 md:right-[20%] !rounded-full !w-14 !h-14 bg-[#999999] shadow cursor-pointer hover:bg-gray-50'
              onClick={handleNext}
            >
              <FcNext size={20} color='gray' />
            </div>
          )}
        </>
      )}
      <div className=' react-story absolute bottom-3 w-full h-[50px] flex justify-center gap-2 items-center'>
        <div className='relative'>
          <Input
            placeholder='Reply...'
            className='peer bg-transparent w-[300px] rounded-2xl !text-white placeholder:text-gray-200 lg:focus:w-[500px] focus:pr-[40px] '
          />
          <div className='hidden absolute peer-focus:block top-[6px] right-2 text-white cursor-pointer'>
            <BiSolidSend size={20} />
          </div>
        </div>
        <SwipeableViews>
          <div className='  flex h-[40px]  items-center pl-1   gap-3  '>
            {reacts.map((react, index) => (
              <img
                key={index}
                src={react.icon}
                alt=''
                className={`w-[25px] h-[25px] rounded-full hover:scale-125  hover:animate-none cursor-pointer `}
              />
            ))}
          </div>
        </SwipeableViews>
      </div>
    </div>
  )
}

export default RightSide
