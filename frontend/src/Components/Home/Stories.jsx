import { Avatar } from 'antd'
import React from 'react'
import SwipeableViews from 'react-swipeable-views'
import { AiFillPlusCircle } from 'react-icons/ai'
import { Link, useNavigate } from 'react-router-dom'
import useSelection from 'antd/es/table/hooks/useSelection'
import { useSelector } from 'react-redux'
import { defaulAvatar } from '../../Constants'

const storiesData = [
  {
    id: 1,
    user: {
      id: 1,
      firstname: 'test',
      lastname: '1',
      avatar: {
        name: '145653.png',
        url: 'https://firebasestorage.googleapis.com/v0/b/netflix-fba01.appspot.com/o/145653.png?alt=media&token=6657c3dd-9f61-4785-9653-2f8a53fde1e4'
      }
    },
    video: {
      id: 1,
      url: 'https://firebasestorage.googleapis.com/v0/b/netflix-fba01.appspot.com/o/Thanh%20Pahm3343.mp4?alt=media&token=238ff17e-9623-4ca2-8878-bafa90a05c5e'
    }
  },
  {
    id: 2,
    user: {
      id: 1,
      firstname: 'test',
      lastname: '1',
      avatar: {
        name: '145653.png',
        url: 'https://firebasestorage.googleapis.com/v0/b/netflix-fba01.appspot.com/o/145653.png?alt=media&token=6657c3dd-9f61-4785-9653-2f8a53fde1e4'
      }
    },
    video: {
      name: 'Y2meta3743.mp4',
      url: 'https://firebasestorage.googleapis.com/v0/b/netflix-fba01.appspot.com/o/Y2meta3743.mp4?alt=media&token=475fda37-1b7f-498f-9e39-3b19fd948a18'
    }
  },
  {
    id: 4,
    user: {
      id: 1,
      firstname: 'test',
      lastname: '1',
      avatar: {
        name: '145653.png',
        url: 'https://firebasestorage.googleapis.com/v0/b/netflix-fba01.appspot.com/o/145653.png?alt=media&token=6657c3dd-9f61-4785-9653-2f8a53fde1e4'
      }
    },
    video: {
      id: 5,
      url: 'https://firebasestorage.googleapis.com/v0/b/netflix-fba01.appspot.com/o/Thanh%20Pahm3343.mp4?alt=media&token=238ff17e-9623-4ca2-8878-bafa90a05c5e'
    }
  },
  {
    id: 6,
    user: {
      id: 1,
      firstname: 'test',
      lastname: '1',
      avatar: {
        name: '145653.png',
        url: 'https://firebasestorage.googleapis.com/v0/b/netflix-fba01.appspot.com/o/145653.png?alt=media&token=6657c3dd-9f61-4785-9653-2f8a53fde1e4'
      }
    },
    video: {
      name: 'Y2meta3743.mp4',
      url: 'https://firebasestorage.googleapis.com/v0/b/netflix-fba01.appspot.com/o/Y2meta3743.mp4?alt=media&token=475fda37-1b7f-498f-9e39-3b19fd948a18'
    }
  },
  {
    id: 7,
    user: {
      id: 1,
      firstname: 'test',
      lastname: '1',
      avatar: {
        name: '145653.png',
        url: 'https://firebasestorage.googleapis.com/v0/b/netflix-fba01.appspot.com/o/145653.png?alt=media&token=6657c3dd-9f61-4785-9653-2f8a53fde1e4'
      }
    },
    video: {
      id: 8,
      url: 'https://firebasestorage.googleapis.com/v0/b/netflix-fba01.appspot.com/o/Thanh%20Pahm3343.mp4?alt=media&token=238ff17e-9623-4ca2-8878-bafa90a05c5e'
    }
  },
  {
    id: 9,
    user: {
      id: 1,
      firstname: 'test',
      lastname: '1',
      avatar: {
        name: '145653.png',
        url: 'https://firebasestorage.googleapis.com/v0/b/netflix-fba01.appspot.com/o/145653.png?alt=media&token=6657c3dd-9f61-4785-9653-2f8a53fde1e4'
      }
    },
    video: {
      id: 1,
      url: 'https://firebasestorage.googleapis.com/v0/b/netflix-fba01.appspot.com/o/Thanh%20Pahm3343.mp4?alt=media&token=238ff17e-9623-4ca2-8878-bafa90a05c5e'
    }
  },
  {
    id: 10,
    user: {
      id: 1,
      firstname: 'test',
      lastname: '1',
      avatar: {
        name: '145653.png',
        url: 'https://firebasestorage.googleapis.com/v0/b/netflix-fba01.appspot.com/o/145653.png?alt=media&token=6657c3dd-9f61-4785-9653-2f8a53fde1e4'
      }
    },
    video: {
      id: 11,
      url: 'https://firebasestorage.googleapis.com/v0/b/netflix-fba01.appspot.com/o/Thanh%20Pahm3343.mp4?alt=media&token=238ff17e-9623-4ca2-8878-bafa90a05c5e'
    }
  },
  {
    id: 12,
    user: {
      id: 1,
      firstname: 'test',
      lastname: '1',
      avatar: {
        name: '145653.png',
        url: 'https://firebasestorage.googleapis.com/v0/b/netflix-fba01.appspot.com/o/145653.png?alt=media&token=6657c3dd-9f61-4785-9653-2f8a53fde1e4'
      }
    },
    video: {
      id: 13,
      url: 'https://firebasestorage.googleapis.com/v0/b/netflix-fba01.appspot.com/o/Thanh%20Pahm3343.mp4?alt=media&token=238ff17e-9623-4ca2-8878-bafa90a05c5e'
    }
  }
]

const Stories = () => {
  const { user } = useSelector(state => state.auth)
  const navigate = useNavigate()
  return (
    <div className='home-story mt-7 w-full '>
      <SwipeableViews>
        <div className=' w-max  gap-3 flex overflow-hidden '>
          <div
            className='w-[140px]  relative h-[250px] shadow-xl rounded-lg  cursor-pointer hover:opacity-70 '
            onClick={() => navigate('/stories/create')}
          >
            <img
              src={user?.avatar?.url ?? defaulAvatar}
              alt=''
              className='w-full h-full object-cover rounded-lg'
            />
            <div className='absolute w-full flex justify-center bottom-[15%] translate-y-4 z-30'>
              <AiFillPlusCircle
                size={30}
                color='blue'
                className=' !text-[30px]'
              />
            </div>
            <div className='absolute shadow-md bottom-0 h-[15%] rounded-b-lg left-0 w-full bg-gray-50  px-3 flex justify-end  flex-col items-center py-1 '>
              <h1 className='text-gray-700'>Create story</h1>
            </div>
            <div className='absolute top-3 left-0 w-full  px-3 '>
              <Avatar className='border-[3px] border-blue-500' />
            </div>
          </div>
          {storiesData.map((story, index) => (
            // <Link
            //   to={{
            //     pathname: '/stories',
            //     state: 1
            //   }}
            // >
            <div
              className='w-[140px]  relative h-[250px] rounded-md  cursor-pointer'
              key={story.id}
              onClick={() => {
                navigate('/stories', {
                  state: { current: index }
                })
              }}
            >
              <video
                src={story.video.url}
                className='w-full h-full object-cover rounded-lg shadow'
              ></video>
              <div className='absolute bottom-3 left-0 w-full  px-3'>
                <h1 className='text-gray-50'>
                  {story.user.firstname + ' ' + story.user.lastname}
                </h1>
              </div>
              <div className='absolute top-3 left-0 w-full  px-3'>
                <Avatar
                  className='border-[3px] border-blue-500'
                  src={story.user?.avatar?.url}
                />
              </div>
            </div>
            // </Link>
          ))}
        </div>
      </SwipeableViews>
    </div>
  )
}

export default Stories
