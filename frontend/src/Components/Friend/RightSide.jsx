import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import FriendCard from './FriendCard'

const RightSide = () => {
  const { requests } = useSelector(state => state.friend)
  const { user } = useSelector(state => state.auth)

  const receives = useMemo(() => {
    const receiveRequests = requests?.filter(
      req => req?.status === 'waiting' && req?.senderId !== user?.id
    )
    return receiveRequests.map(req => {
      return req?.senderId === user?.id ? req.receiver : req.sender
    })
  }, [requests, user?.id])
  return (
    <div className=' min-h-screen bg-gray-100 pt-[30px] px-[20px]'>
      <h1 className='font-[600] text-[22px]'>Friend Requests</h1>
      <div className='my-2 grid grid-cols-3 gap-2'>
        {receives?.map(item => (
          <FriendCard friend={item} key={item?.id} />
        ))}
      </div>
    </div>
  )
}

export default RightSide
