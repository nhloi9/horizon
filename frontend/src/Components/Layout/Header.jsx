import React, { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { IoIosNotifications } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'
import { Input, Space, Dropdown, Popconfirm, Avatar, Popover } from 'antd'

import { logoutAction } from '../../Reduxs/Actions/authAction'
import { defaulAvatar } from '../../Constants'
import Notify from './Notify'
import { FaFacebookMessenger } from 'react-icons/fa6'
// import { AudioOutlined } from '@ant-design/icons'
const { Search } = Input

const Header = () => {
  const navigate = useNavigate()
  const { notifies, push, sound } = useSelector(state => state.notifies)
  const dispatch = useDispatch()
  const { isLogin, user } = useSelector(state => state.auth)
  const [openNotify, setOpenNotify] = useState(false)

  const leftNavItems = [
    {
      title: 'Home',
      to: '/'
    },
    {
      title: 'Group',
      to: '/groups/feed'
    },
    {
      title: 'Friends',
      to: '/friends'
    },
    { title: 'Discover', to: '/discover' }
  ]

  const onSearch = (value, _e, info) => console.log(info?.source, value)

  const confirmLogout = e => {
    dispatch(logoutAction())
  }
  const cancelLogout = e => {
    // console.log(e)
    // toast.error('Click on No')
  }

  useEffect(() => {
    console.log('header mount')
    return () => {
      console.log('header unmount')
    }
  })

  return (
    <div className='fixed bg-gray-50  w-full z-[50] top-0 h-[60px] shadow-sm flex justify-between items-center font-robo dark:bg-dark-100 px-5'>
      <div className=' items-center gap-1 p-1 cursor-pointer hidden sm:flex'>
        <img
          src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNv64PGHyyyJkxGRb5g2RSRR93Uwb3snu5ZA&usqp=CAU'
          alt=''
          className='w-[40px] h-[40px] block object-cover rounded-full'
        />
        <h1 className='font-[800] text-[22px]'>Horizon</h1>
      </div>
      <Space>
        <Search
          placeholder='input search text'
          onSearch={onSearch}
          style={{ width: 200 }}
        />
      </Space>
      <div className='md:flex gap-3  hidden '>
        {leftNavItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.to}
            className={({ isActive }) => {
              return isActive
                ? ' text-blue-600   hover:bg-gray-300 py-1 px-2 rounded-2xl !no-underline '
                : ' hover:bg-gray-300 py-1 px-2 rounded-2xl text-black no-underline'
            }}
          >
            <span className='text-[16px] font-[700]'>{item.title}</span>
          </NavLink>
        ))}
      </div>
      <div className='flex items-center gap-2 header-notify'>
        <div
          className='w-[30px] h-[30px] flex items-center justify-center rounded-full bg-gray-200 cursor-pointer'
          onClick={() => {
            navigate('/message')
          }}
        >
          <FaFacebookMessenger />
        </div>
        <Popover
          placement='topLeft'
          destroyPopupOnHide
          content={<Notify />}
          // title="Title"
          trigger='click'
          open={openNotify}
          onOpenChange={newOpen => {
            setOpenNotify(newOpen)
          }}
          className='!relative'
        >
          <div className='w-[30px] h-[30px] flex items-center justify-center rounded-full bg-gray-200 cursor-pointer'>
            <IoIosNotifications size={19} />
          </div>
          <div className='absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center'>
            <p className='text-[12px] text-gray-50 '>
              {notifies.filter(notify => notify.isSeen === false)?.length}
            </p>
          </div>
        </Popover>
        {isLogin ? (
          <div className='h-[40px] w-[40px]'>
            <Dropdown
              menu={{
                items: [
                  {
                    key: '1',
                    label: <Link to={'/profile/' + user?.id}>Profile</Link>
                  },
                  {
                    key: '2',
                    label: (
                      <Popconfirm
                        title='Logout'
                        description='Are you sure to logout?'
                        onConfirm={confirmLogout}
                        onCancel={cancelLogout}
                        okText='Yes'
                        cancelText='No'
                        placement='leftBottom'
                      >
                        Logout
                      </Popconfirm>
                    )
                  }
                ]
              }}
              placement='bottomLeft'
            >
              <img
                // referrerpolicy='no-referrer'
                src={user?.avatar?.url ?? defaulAvatar}
                alt=''
                className='block w-full h-full object-cover rounded-full border-blue-700 shadow border-[1px]'
              />
            </Dropdown>
          </div>
        ) : (
          <Link to={'/signin'} className='h-[40px] w-[40px] '>
            <Avatar src={defaulAvatar} className='' />
          </Link>
        )}
      </div>
    </div>
  )
}

export default Header
