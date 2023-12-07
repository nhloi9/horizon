import { Button } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  acceptFriendAction,
  addFriendAction,
  cancelFriendRequestAction,
  rejectFriendAction
} from '../../Reduxs/Actions/friendAction'

const AddFriend = ({ friendInfo }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { friends, sendRequests, receiveRequests, isLoading } = useSelector(
    state => state.friend
  )

  const removeFriend = () => {}

  const cancelFriendRequest = () => {
    dispatch(cancelFriendRequestAction(friendInfo.id))
  }

  const acceptFriendRequest = () => {
    dispatch(acceptFriendAction(friendInfo))
  }

  const rejectFriendRequest = () => {
    dispatch(rejectFriendAction(friendInfo.id))
  }

  const addFriend = () => {
    dispatch(addFriendAction(friendInfo))
  }

  return (
    <div>
      {!isLoading &&
        (friends.find(friend => friend.id === friendInfo.id) ? (
          <Button className='w-full md:w-min bg-red-400' onClick={removeFriend}>
            {t('friend_remove')}
          </Button>
        ) : sendRequests.find(friend => friend.id === friendInfo.id) ? (
          <Button
            className='w-full md:w-min bg-red-400'
            onClick={cancelFriendRequest}
          >
            {t('friend_cancel_request')}
          </Button>
        ) : receiveRequests.find(friend => friend.id === friendInfo.id) ? (
          <div className='flex gap-2'>
            <Button
              className='w-full md:w-min bg-blue-400'
              onClick={acceptFriendRequest}
            >
              {t('friend_accept')}
            </Button>
            <Button
              className='w-full md:w-min bg-red-400'
              onClick={rejectFriendRequest}
            >
              {t('friend_reject')}
            </Button>
          </div>
        ) : (
          <Button className='w-full md:w-min bg-blue-500' onClick={addFriend}>
            {t('friend_add')}
          </Button>
        ))}
      {isLoading && (
        <Button className='!w-[100px] md:w-min bg-gray-200' loading></Button>
      )}
    </div>
  )
}

export default AddFriend
