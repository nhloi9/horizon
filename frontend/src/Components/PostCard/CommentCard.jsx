import React, { useContext, useEffect, useRef, useState } from 'react'
import { BsHeart, BsHeartFill } from 'react-icons/bs'
import moment from 'moment'
import { BiDislike, BiLike } from 'react-icons/bi'
import InputComment from './InputComment'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, Button, Dropdown, Tooltip } from 'antd'
import { AiOutlineMore } from 'react-icons/ai'
import { CiEdit } from 'react-icons/ci'
import { MdDeleteOutline } from 'react-icons/md'
import { updateComment } from '../../Reduxs/Actions/postAction'

// import EditIcon from '@mui/icons-material/Edit'
// import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
// import {
//   deleteComment,
//   likeComment,
//   unlikeComment,
//   updateComment
// } from '../../redux/actions/postAction'

const CommentCard = ({ comment, post }) => {
  const editRef = useRef(null)
  const navigate = useNavigate()
  const likeRef = useRef(null)
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()

  const [onEdit, setOnEdit] = useState(false)
  const [openReply, setOpenReply] = useState(false)
  const [readMore, setReadMore] = useState(false)
  const [isLike, setIsLike] = useState(false)

  //update comment
  const handleUpdateComment = () => {
    if (
      editRef?.current?.value &&
      editRef.current?.value?.trim() &&
      editRef.current?.value?.trim() !== comment.value
    ) {
      dispatch(
        updateComment({
          commentId: comment?.id,
          postId: post?.id,
          content: editRef.current?.value?.trim()
        })
      )
      setOnEdit(false)
    }
  }

  //like comment
  const handleLikeComment = () => {
    setIsLike(true)
    // dispatch(likeComment(comment, post))
  }

  //unlike comment
  const handleUnlikeComment = () => {
    setIsLike(false)
    // dispatch(unlikeComment(comment, post))
  }

  // delete comment
  const handleDelete = () => {
    // dispatch(deleteComment(comment, post))
  }

  // useEffect(() => {
  //   if (comment.likes.find(item => item._id === user._id)) {
  //     setIsLike(true)
  //   } else setIsLike(false)
  // }, [setIsLike, user?._id, comment?.likes])
  return (
    <div
      className={`my-2 ${
        !comment.id && 'opacity-30 pointer-events-none'
      } group ${comment.updating ? 'opacity-40 pointer-events-none' : ''}`}
    >
      <div className='flex gap-1'>
        <Avatar src={comment.sender?.avatar?.url} size='small' />
        <p className=' translate-y-[-3px] font-[500]  capitalize'>
          {comment.sender?.firstname + ' ' + comment.sender?.lastname}
          <span className='text-gray-400 text-[13px] font-[300]'>
            {' '}
            {moment(comment.createdAt).fromNow()}
          </span>
        </p>
      </div>
      <div className=' mt-[1px] p-2 w-full rounded-b-md rounded-tr-md bg-gray-200 min-h-[30px] flex items-center justify-between gap-2'>
        {onEdit ? (
          <div className='w-[calc(100%-30px)]'>
            <textarea
              rows={2}
              ref={editRef}
              contentEditable
              name=''
              id=''
              className=' w-full outline-none p-2 resize-none bg-transparent'
            ></textarea>

            <div className='flex justify-end gap-4 text-[14px]  '>
              <span
                className='text-red-400 cursor-pointer'
                onClick={() => {
                  setOnEdit(false)
                }}
              >
                cancel
              </span>
              <span
                className=' cursor-pointer text-green-500'
                onClick={handleUpdateComment}
              >
                update
              </span>
            </div>
          </div>
        ) : (
          <div className='w-[calc(100%-30px)]'>
            <p>
              {comment.receiverId && comment.receiverId !== comment.senderId ? (
                <span
                  className='font-[500] mr-1 cursor-pointer capitalize'
                  onClick={() => navigate(`/profile/${comment.tag._id}`)}
                >
                  @{comment.receiver.firstname + comment.receiver.lastname}
                </span>
              ) : (
                ''
              )}
              {comment.content.length > 45 && !readMore
                ? comment.content.slice(0, 45)
                : comment.content}
              {comment.content.length > 45 ? (
                readMore ? (
                  <span
                    className='text-red-500 cursor-pointer'
                    onClick={() => setReadMore(false)}
                  >
                    hidden
                  </span>
                ) : (
                  <span
                    className='text-red-500 cursor-pointer'
                    onClick={() => setReadMore(true)}
                  >
                    ...read more
                  </span>
                )
              ) : (
                ''
              )}
            </p>
            <div className='flex items-center gap-7 text-[12px] mt-1'>
              <div className='flex gap-1 items-center'>
                <Tooltip title='Like' placement='bottomRight'>
                  <BiLike className='!cursor-pointer' />
                </Tooltip>
                <span className='text-sm text-gray-400'>12</span>
              </div>
              <div className='flex gap-1 items-center'>
                <Tooltip title='Dislike' placement='bottomLeft'>
                  <BiDislike className='!cursor-pointer' />
                </Tooltip>
                <span className='text-sm text-gray-400'>12</span>
              </div>

              <p className='font-[500]'>
                {/* {comment.likes.length} <span>likes</span> */}
              </p>
              <Button
                size='small'
                // className='font-[500] cursor-pointer'
                onClick={() => {
                  setOpenReply(!openReply)
                }}
                type={'link'}
                danger={openReply}
                className={openReply ? 'text-red-400 ' : ''}
              >
                <span className='text-sm'>
                  {' '}
                  {openReply ? 'Cancel' : 'Reply'}
                </span>
              </Button>
            </div>
          </div>
        )}
        {/* <div className='flex justify-end gap-2 w-[50px]'> */}
        <div className='hidden  group-hover:block'>
          {comment.senderId === user.id ? (
            <Dropdown
              menu={{
                items: [
                  {
                    label: (
                      <div
                        onClick={() => {
                          setOnEdit(true)
                          setTimeout(() => {
                            if (editRef.current)
                              editRef.current.value = comment.content
                            editRef.current?.focus()
                          }, 100)
                        }}
                      >
                        <CiEdit /> Edit Comment
                      </div>
                    ),
                    key: '0'
                  },
                  {
                    label: (
                      <div onClick={handleDelete}>
                        <MdDeleteOutline /> Remove Comment
                      </div>
                    ),
                    key: '1'
                  }
                ]
              }}
            >
              <AiOutlineMore size={18} className='cursor-pointer' />
            </Dropdown>
          ) : post.id === user.id ? (
            <Dropdown
              menu={{
                items: [
                  {
                    label: (
                      <div onClick={handleDelete}>
                        <MdDeleteOutline /> Remove Comment
                      </div>
                    ),
                    key: '1'
                  }
                ]
              }}
            >
              <AiOutlineMore size={18} className='cursor-pointer' />
            </Dropdown>
          ) : (
            ''
          )}
        </div>
        {/* <div
            className=''
            ref={likeRef}
            onClick={() => {
              likeRef.current.classList.add('pointer-events-none')
              setTimeout(() => {
                likeRef.current.classList.remove('pointer-events-none')
              }, 1000)
            }}
          >
            {isLike ? (
              <BsHeartFill
                color='red'
                size={19}
                className='cursor-pointer'
                onClick={handleUnlikeComment}
              />
            ) : (
              <BsHeart
                size={19}
                className='cursor-pointer '
                onClick={handleLikeComment}
              />
            )}
          </div> */}
        {/* </div> */}
      </div>
      {openReply && (
        <InputComment post={post} comment={comment} setOpen={setOpenReply} />
      )}
    </div>
  )
}

export default CommentCard
