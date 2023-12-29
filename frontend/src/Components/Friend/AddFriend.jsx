import { Button } from 'antd'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  friendCreateRequestAction,
  friendDeleteRequestAction,
  friendUpdateRequestAction
} from '../../Reduxs/Actions/friendAction'

const AddFriend = ({ friendInfo, card }) => {
  const { user } = useSelector(state => state.auth)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { isLoading, requests } = useSelector(state => state.friend)

  const createRequest = () => {
    dispatch(friendCreateRequestAction(friendInfo?.id))
  }
  const deleteRequest = () => {
    myRequest?.id && dispatch(friendDeleteRequestAction(myRequest))
  }
  const updateRequest = () => {
    myRequest?.id && dispatch(friendUpdateRequestAction(myRequest))
  }

  const myRequest = useMemo(() => {
    return requests?.find(
      item =>
        item?.senderId === friendInfo?.id || item?.receiverId === friendInfo?.id
    )
  }, [requests, friendInfo?.id])
  console.log(myRequest)
  return (
    <div>
      {!isLoading &&
        (!myRequest ? (
          <Button
            className='w-full md:w-min bg-blue-500'
            onClick={createRequest}
          >
            {t('friend_add')}
          </Button>
        ) : myRequest?.status === 'accepted' ? (
          <Button
            className='w-full md:w-min bg-red-400'
            onClick={deleteRequest}
          >
            {t('friend_remove')}
          </Button>
        ) : myRequest?.receiverId === user?.id ? (
          <div className={`${card ? 'flex gap-2 flex-col' : 'flex gap-2'}`}>
            <Button
              className={`w-full md:w-min bg-blue-400 ${card && 'md:w-full'}`}
              onClick={updateRequest}
            >
              {t('friend_accept')}
            </Button>
            <Button
              className={`w-full md:w-min bg-red-400 ${card && 'md:w-full'}`}
              onClick={deleteRequest}
            >
              {t('friend_reject')}
            </Button>
          </div>
        ) : (
          <Button
            className='w-full md:w-min bg-red-400'
            onClick={deleteRequest}
          >
            {t('friend_cancel_request')}
          </Button>
        ))}
      {isLoading && (
        <Button
          className={`!w-[100px] md:w-min bg-gray-200 ${card && 'w-full'}`}
          loading
        ></Button>
      )}
    </div>
  )
}

export default AddFriend
/*

{!isLoading &&
  (myRequest&& myRequest?.status ==='accepted' ? (
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
    <div className={`${card ? 'flex gap-2 flex-col' : 'flex gap-2'}`}>
      <Button
        className={`w-full md:w-min bg-blue-400 ${card && 'md:w-full'}`}
        onClick={acceptFriendRequest}
      >
        {t('friend_accept')}
      </Button>
      <Button
        className={`w-full md:w-min bg-red-400 ${card && 'md:w-full'}`}
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

*/
