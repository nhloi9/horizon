import React, { useMemo, useRef, useState } from 'react'
import { BsSend, BsChat, BsBookmark, BsBookmarkFill } from 'react-icons/bs'
import { SlLike } from 'react-icons/sl'
import { Avatar, Modal, Popover, Tooltip } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { Dropdown } from 'antd'
import { PiShareFatLight } from 'react-icons/pi'

import { reacts } from '../../Constants'
import {
  likePost,
  reactPost,
  removeReactPost,
  savePostsAction,
  sharePostAction,
  unsavePostsAction
} from '../../Reduxs/Actions/postAction'
import { Link, useNavigate } from 'react-router-dom'
import ShowReacts from './ShowReacts'
import { MdOutlinePublic } from 'react-icons/md'
import { FaLock } from 'react-icons/fa'
import { CiLock } from 'react-icons/ci'
import moment from 'moment'

const CardFooter = ({ post, setIsModalOpen }) => {
  const savePosts = useSelector(state => state.save)
  const { ownGroups, requests } = useSelector(state => state.group)
  const [isOpenShareToGroup, setIsOpenShareToGroup] = useState(false)
  const [openShowReacts, setOpenShowReacts] = useState(false)
  const { user } = useSelector(state => state.auth)
  const reactRef = useRef()
  const dispatch = useDispatch()

  const myReact = useMemo(
    () => post?.reacts.find(react => react?.user?.id === user.id),
    [post, user]
  )

  const myGroups = [
    ...(ownGroups ?? []),
    ...(requests
      ?.filter(item => item?.status === 'accepted')
      ?.map(item => item.group) ?? [])
  ]

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
  const handleShare = groupId => {
    dispatch(
      sharePostAction({
        postId: post?.shareId ? post.shareId : post?.id,
        groupId
      })
    )
    setIsOpenShareToGroup(false)
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
                label: (
                  <Link to={'/profile/' + react?.user?.id}>
                    {react.user?.firstname + ' ' + react.user?.lastname}
                  </Link>
                )
              }))
            }}
          >
            <div className='flex flex-col items-center'>
              {/* <a
                href='m'
                onClick={e => e.preventDefault()}
                className='text-black no-underline hover:underline'
              > */}
              <p
                className='text-sm cursor-pointer hover:underline'
                onClick={() => setOpenShowReacts(true)}
              >
                {post?.reacts?.length ?? 0} reacts
              </p>
              {/* </a> */}
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
          <Dropdown
            trigger={'click'}
            menu={{
              items: [
                {
                  key: '1',
                  label: (
                    <div onClick={() => handleShare()}>
                      <PiShareFatLight /> Share now (Friends)
                    </div>
                  )
                },
                {
                  key: '2',
                  label: (
                    <div onClick={() => setIsOpenShareToGroup(true)}>
                      <PiShareFatLight /> Share to a group
                    </div>
                  )
                }
              ]
            }}
          >
            <Tooltip title='share'>
              <BsSend
                // onClick={() => setIsOpenShare(true)}
                size={19}
                className='cursor-pointer'
              />
            </Tooltip>
          </Dropdown>
          <Dropdown
            className='!max-h-[100px]'
            menu={{
              items: post.shareBys?.map((post, index) => ({
                key: index,
                label: (
                  <Link to={'/profile/' + post?.user?.id}>
                    <div className='flex justify-between'>
                      {post.user?.firstname + ' ' + post.user?.lastname}{' '}
                      <span className=' text-gray-500'>
                        {' '}
                        {post?.createdAt && moment(post.createdAt).fromNow()}
                      </span>
                    </div>
                  </Link>
                )
              }))
            }}
          >
            <div className='flex flex-col items-center'>
              {/* <a
                href='m'
                onClick={e => e.preventDefault()}
                className='text-black no-underline hover:underline'
              > */}
              {post?.shareId ? (
                ''
              ) : (
                <p className='text-sm cursor-pointer hover:underline'>
                  {post?.shareBys?.length ?? 0} shares
                </p>
              )}
              {/* </a> */}
            </div>
          </Dropdown>
        </div>
        {savePosts?.find(item => item?.id === post?.id) ? (
          <Tooltip title='unsave'>
            <BsBookmarkFill
              onClick={() => {
                dispatch(unsavePostsAction(post?.id))
              }}
              size={19}
              className='cursor-pointer !text-blue-300 '
            />
          </Tooltip>
        ) : (
          <Tooltip title='save'>
            <BsBookmark
              size={19}
              className='cursor-pointer '
              onClick={() => {
                dispatch(savePostsAction(post))
              }}
            />
          </Tooltip>
        )}
      </div>
      {/* {isOpenShare && (
        <Modal
          title='Basic Modal'
          open={isOpenShare}
          onCancel={() => setIsOpenShare(false)}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      )} */}

      {openShowReacts && (
        <ShowReacts
          reactsArray={post?.reacts}
          open={openShowReacts}
          onCancel={() => {
            setOpenShowReacts(false)
          }}
        />
      )}
      {isOpenShareToGroup && (
        <Modal
          title='Share post to a group'
          open={isOpenShareToGroup}
          onCancel={() => setIsOpenShareToGroup(false)}
          footer={[]}
        >
          <div className='max-h-[60vh] overflow-y-scroll scroll-min'>
            {myGroups.map(group => (
              <div
                key={group?.id}
                className='flex gap-2 my-2 p-2 cursor-pointer rounded-md hover:bg-gray-200'
                onClick={() => handleShare(group?.id)}
              >
                <img
                  src={group?.image?.url}
                  alt=''
                  className='w-10 h-10 rounded object-cover'
                />
                <div className='flex flex-col justify-center gap-[1px]'>
                  <span className='font-[500] leading-3'>{group?.name}</span>

                  <span className='text-gray-500 text-sm leading-3'>
                    <span>
                      {group?.privacy === 'public' ? (
                        <MdOutlinePublic className='!translate-y-[3px]' />
                      ) : (
                        <CiLock className='!translate-y-[2px]' />
                      )}
                    </span>{' '}
                    {group?.privacy + ' group'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  )
}

// export const ShowReacts = ({ reactsArray, open, onCancel }) => {
//   const navigate = useNavigate()
//   const [type, setType] = useState('all')
//   return (
//     <Modal
//       destroyOnClose={true}
//       open={open}
//       onCancel={onCancel}
//       footer={[]}
//       maskClosable={true}
//     >
//       <div className='flex py-1 border-b mb-2 items-center gap-3'>
//         <div
//           className={`w-14 h-14 flex items-center justify-center hover:bg-gray-100  cursor-pointer ${
//             type === 'all' && 'border-b-[2px] border-blue-500 '
//           }`}
//           onClick={() => setType('all')}
//         >
//           <span
//             className={`${
//               type !== 'all' ? 'text-gray-400' : 'text-blue-500'
//             } font-[500]`}
//           >
//             All
//           </span>
//         </div>

//         {Object.keys(classifyReacts(reactsArray))
//           ?.sort((a, b) => {
//             return (
//               classifyReacts(reactsArray)[b]?.length -
//               classifyReacts(reactsArray)[a]?.length
//             )
//           })
//           .map(item => (
//             <div
//               className={`w-14 h-14 flex items-center justify-center hover:bg-gray-100  cursor-pointer ${
//                 type === item && 'border-b-[2px] border-blue-500 '
//               }`}
//               onClick={() => {
//                 setType(item)
//                 console.log(item)
//               }}
//             >
//               <img
//                 src={
//                   reacts.find(i => i.id.toString() === item?.toString())?.icon
//                 }
//                 alt=''
//                 className={`w-[20px] h-[20px] rounded-full  right-0 bottom-0`}
//               />
//             </div>
//           ))}
//       </div>
//       <div className='h-[50vh] overflow-y-scroll scroll-min flex flex-col gap-1'>
//         {(type === 'all'
//           ? reactsArray
//           : classifyReacts(reactsArray)[type]
//         )?.map(react => (
//           <div className='flex gap-2 items-center '>
//             <Link to={`/profile/${react?.user?.id}`} className=' relative'>
//               <Avatar src={react?.user?.avatar?.url} size={'large'} />
//               <img
//                 src={react?.react?.icon}
//                 alt=''
//                 className={`absolute w-[15px] h-[15px] rounded-full  right-0 bottom-0`}
//               />
//             </Link>

//             <span
//               onClick={() => navigate('/profile/' + react?.user?.id)}
//               className='cursor-pointer'
//             >
//               {react?.user?.firstname + ' ' + react?.user?.lastname}
//             </span>
//           </div>
//         ))}
//       </div>
//     </Modal>
//   )
// }

// function classifyReacts (reactsArray) {
//   let reactsTop = {}
//   reactsArray.forEach(item => {
//     if (reactsTop[item?.react?.id]) {
//       reactsTop[item?.react?.id].push(item)
//     } else reactsTop[item?.react?.id] = [item]
//   })

//   // let reactsTopSorted = Object.keys(reactsTop).sort((a, b) => {
//   //   return reactsArray[b] - reactsTop[a]
//   // })
//   // const array = reactsTopSorted?.map(item=>(
//   //   return {
//   //     icon:
//   //   }
//   // ))

//   return reactsTop
// }

export default CardFooter
