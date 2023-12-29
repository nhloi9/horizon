import React from 'react'
import { defaulAvatar } from '../../Constants'
import AddFriend from './AddFriend'

const FriendCard = ({ friend }) => {
  return (
    <div className='h-[300px] bg-white rounded-md shadow-md'>
      <img
        src={friend?.avatar?.url ?? defaulAvatar}
        alt=''
        className='block w-full h-[60%] object-cover rounded-t-md'
      />
      <div className='p-2'>
        <p className='font-[600] mb-2'>
          {friend.firstname + ' ' + friend.lastname}
        </p>
        <AddFriend friendInfo={friend} card={true} />
      </div>
    </div>
  )
}

export default FriendCard
