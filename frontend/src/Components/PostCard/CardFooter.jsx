import React, { useMemo, useRef } from 'react'
import { BsSend, BsChat, BsBookmark } from 'react-icons/bs'
import { SlLike } from 'react-icons/sl'
import { Tooltip } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { Dropdown } from 'antd'

import { reacts } from '../../Constants'
import {
  likePost,
  reactPost,
  removeReactPost
} from '../../Reduxs/Actions/postAction'

const CardFooter = ({ post, setIsModalOpen }) => {
  const { user } = useSelector(state => state.auth)
  const reactRef = useRef()
  const dispatch = useDispatch()

  const myReact = useMemo(
    () => post?.reacts.find(react => react?.user?.id === user.id),
    [post, user]
  )

  const handleLilePost = () => {
    dispatch(reactPost(post.id, 1))
  }

  const handleReact = react => {
    dispatch(reactPost(post.id, react.id))
    reactRef.current && reactRef.current.click()
  }
  const handleRemoveReactPost = () => {
    dispatch(removeReactPost(post.id))
  }

  return (
    <div className='px-5 mt-3'>
      <div className='flex justify-between'>
        <div className='flex flex-col'>
          <div className='group relative'>
            {myReact ? (
              <img
                src={myReact.react.icon}
                alt=''
                className='w-[19px] h-[19px] rounded-full cursor-pointer'
                onClick={handleRemoveReactPost}
              />
            ) : (
              <SlLike
                size={19}
                className='cursor-pointer   '
                onClick={handleLilePost}
              />
            )}
            <div className='hidden group-hover:flex  gap-3  absolute bottom-5 bg-slate-100 shadow-lg p-2 rounded-[15px] z-[100] left-0'>
              {reacts.map((react, index) => (
                <img
                  key={index}
                  src={react.icon}
                  alt=''
                  className={`w-[25px] h-[25px] rounded-full hover:scale-125  hover:animate-none cursor-pointer ${
                    // index % 2 === 0 ? 'animate-spin' : 'animate-bounce'
                    ''
                  }`}
                  onClick={() => {
                    handleReact(react)
                  }}
                />
              ))}
            </div>
          </div>
          <div ref={reactRef} id='react-ref'></div>
          <Dropdown
            menu={{
              items: post.reacts?.map(react => ({
                key: react.id,
                label: react.user?.firstname + ' ' + react.user?.lastname
              }))
            }}
          >
            <div className='flex flex-col items-center'>
              <a
                href='m'
                onClick={e => e.preventDefault()}
                className='text-black no-underline hover:underline'
              >
                <p className='text-sm'>{post?.reacts?.length ?? 0} reacts</p>
              </a>
            </div>
          </Dropdown>
        </div>

        <div className='flex flex-col items-center'>
          <Tooltip
            title='comment'
            onClick={() => {
              setIsModalOpen && setIsModalOpen(true)
            }}
          >
            <BsChat size={19} className='cursor-pointer' />
          </Tooltip>
          <p className='text-sm'>{post?.comments?.length ?? 0} comments</p>
        </div>
        <div className='flex flex-col items-center'>
          <Tooltip title='share'>
            <BsSend size={19} className='cursor-pointer' />
          </Tooltip>
          <p className='text-sm'>10 shares</p>
        </div>
        <Tooltip title='save'>
          <BsBookmark size={19} className='cursor-pointer ' />
        </Tooltip>
      </div>
    </div>
  )
}

export default CardFooter
