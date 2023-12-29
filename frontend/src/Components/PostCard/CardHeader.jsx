import { Avatar, Dropdown, Space } from 'antd'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { CiEdit } from 'react-icons/ci'
import moment from 'moment'
import { MdDeleteOutline } from 'react-icons/md'
import { FaRegCopy } from 'react-icons/fa'
import { IoIosMore } from 'react-icons/io'
import CreatePost from '../Home/CreatePost'

const CardHeader = ({ post }) => {
  const { user } = useSelector(state => state.auth)
  const [openEditPost, setOpenEditPost] = useState(false)
  const editPost = () => {
    setOpenEditPost(true)
  }

  const handleDeletePost = () => {}

  const handleCopy = () => {
    navigator.clipboard.writeText(`http://localhost:3000/post/${post.id}`)
    window.alert(`Copied `)
  }

  return (
    <div className='p-4 flex justify-between items-center'>
      <div className='flex'>
        <Link to={`/profile/${post.user?._id}`} className=''>
          <Avatar src={post.user?.avatar?.url} size={'large'} />
        </Link>

        <div className='ml-2'>
          <Link
            to={`/profile/${post.user?.id}`}
            className='text-black !no-underline'
          >
            <h1 className='font-[500]  capitalize'>
              {post.user.firstname + ' ' + post.user.lastname}
            </h1>
          </Link>
          <p className='text-gray-500 text-[14px] '>
            {moment(post.createdAt).fromNow()}
          </p>
        </div>
      </div>
      <div>
        {user?.id === post?.user?.id ? (
          <Dropdown
            menu={{
              items: [
                {
                  label: (
                    <div onClick={editPost} className='flex items-center'>
                      <CiEdit size='18px' /> &nbsp;Edit Post
                    </div>
                  ),
                  key: '0'
                },
                {
                  label: (
                    <div
                      onClick={handleDeletePost}
                      className='flex items-center'
                    >
                      <MdDeleteOutline size='18px' />
                      &nbsp;Remove Post
                    </div>
                  ),
                  key: '1'
                },
                {
                  label: (
                    <div onClick={handleCopy} className='flex items-center'>
                      <FaRegCopy size='18px' />
                      &nbsp;Copy Link
                    </div>
                  ),
                  key: '2'
                }
              ]
            }}
            trigger={['click']}
            placement='bottomRight'
          >
            <Space>
              <IoIosMore fontSize='medium' className='cursor-pointer' />
            </Space>
          </Dropdown>
        ) : (
          <Dropdown
            menu={{
              items: [
                {
                  label: (
                    <div onClick={handleCopy} className='flex items-center'>
                      <FaRegCopy size='18px' />
                      &nbsp;Copy Link
                    </div>
                  ),
                  key: '2'
                }
              ]
            }}
            trigger={['click']}
            placement='bottomRight'
          >
            <Space>
              <IoIosMore fontSize='medium' className='cursor-pointer' />
            </Space>
          </Dropdown>
        )}
      </div>
      {openEditPost && (
        <CreatePost open={openEditPost} setOpen={setOpenEditPost} post={post} />
      )}
    </div>
  )
}

export default CardHeader
