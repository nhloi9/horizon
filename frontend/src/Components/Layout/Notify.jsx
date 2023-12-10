import React from 'react'
// import { FiMoreHorizontal } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { IoSettingsOutline } from 'react-icons/io5'

import { BsFillBellFill, BsFillBellSlashFill } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom'
import { Avatar, Popover, Switch, Tooltip } from 'antd'

const Notify = () => {
  // const { data } = useSelector(state => state.notify)
  // const { sound } = useSelector(state => state.notify)
  // const dispatch = useDispatch()

  const openSoundNotify = () => {
    // dispatch({ type: NOTIFY_TYPES.SOUND, payload: true })
    // localStorage.setItem('sound', 'true')
  }
  const closeSoundNotify = () => {
    // dispatch({ type: NOTIFY_TYPES.SOUND, payload: false })
    // localStorage.setItem('sound', 'false')
  }
  const handleDeleteAllNotifications = () => {
    // const notReads = data.filter(notification => notification.isRead === false)
    // if (
    //   window.confirm(
    //     (notReads.length > 0
    //       ? `You have not read ${notReads.length} notifications`
    //       : '') + `, Are you sure you want to delete all notifications`
    //   )
    // ) {
    //   dispatch(deleteAllNotifies())
    // }
  }
  return (
    <div className='notify scroll-min w-[350px] min-h-[50vh] max-h-[80vh]   rounded-md !opacity-[1] hover:overflow-y-scroll overflow-y-hidden  cursor-default'>
      <div className=' flex justify-between items-center pb-1'>
        <h1 className='font-[500] text-[18px]'>Notifications</h1>
        {true ? (
          <Popover
            placement='topLeft'
            content={
              <div className='bg-slate-100 rounded-md p-1'>
                <div className='flex justify-between'>
                  <span>Sound</span>
                  <Switch />
                </div>
                <div className='flex justify-between'>
                  <Tooltip title='Receive notifications on your device'>
                    Push
                  </Tooltip>
                  <Switch />
                </div>
              </div>
            }
            title='Setting'
            destroyTooltipOnHide
          >
            <IoSettingsOutline
              className='cursor-pointer'
              onClick={closeSoundNotify}
            />
          </Popover>
        ) : (
          <BsFillBellSlashFill
            onClick={openSoundNotify}
            className='cursor-pointer'
          />
        )}
      </div>
      <hr />
      <br />
      {/* {data.map(notify => (
        <NotifyCard key={notify._id} notify={notify} />
      ))} */}

      {/* {data.length > 0 ? (
        <div className='sticky bottom-0 h-[40px]  bg-slate-50 border-t border-t-red-500 flex justify-end items-center text-red-400'>
          <span
            className='cursor-pointer'
            onClick={handleDeleteAllNotifications}
          >
            delete all
          </span>
        </div>
      ) : (
        <div className='w-full h-max  flex items-center justify-center'>
          You have no notifications
        </div>
      )} */}
    </div>
  )
}

const NotifyCard = ({ notify }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  return (
    <Link
      to={notify.url}
      className={` cursor-pointer flex w-full  px-1 py-2 hover:bg-gray-300 rounded-md justify-between ${
        notify.isRead ? 'opacity-[0.6]' : ''
      }`}
      onClick={() => {
        // dispatch(readNotify(notify))
        // navigate(notify.url)
      }}
    >
      <div className='flex  w-full'>
        <Avatar url={notify.sender.avatar} size={'big-avatar'} />
        <div className='pl-1 w-full overflow-hidden'>
          <p className=' text-[16px] '>
            <span className='font-[500] mr-1'>{notify.sender.username}</span>
            {' ' + notify.text}
          </p>
          <p className='leading-[16px] text-[14px]'>
            {notify.content?.length > 15
              ? notify.content.slice(0, 15) + '...'
              : notify.content}
          </p>
          <p className='leading-[16px] text-[14px]'>
            {moment(notify.createdAt).fromNow()}
          </p>
        </div>
      </div>
      <div className='w-[40px] flex items-center'>
        <Avatar url={notify.image} size={'medium-avatar'} />
      </div>
    </Link>
  )
}
export default Notify
