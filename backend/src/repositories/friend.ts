import { type FriendRequest } from '@prisma/client'
import { prisma } from '../database/postgres'
// import { type IUser } from '../types'

const createFriendRequest = async (
  receiverId: number,
  senderId: number
): Promise<FriendRequest> => {
  const newFriendRequest = await prisma.friendRequest.create({
    data: {
      receiverId,
      senderId
    }
  })
  return newFriendRequest
}

const findFriendRequest = async (
  senderId: number,
  receiverId: number
): Promise<FriendRequest[]> => {
  const friendRequest = await prisma.friendRequest.findMany({
    where: {
      OR: [
        {
          senderId,
          receiverId
        },
        {
          senderId: receiverId,
          receiverId: senderId
        }
      ]
    }
  })
  return friendRequest
}

const deleteFriendRequest = async (
  senderId: number,
  receiverId: number
): Promise<any> => {
  return await prisma.friendRequest.deleteMany({
    where: {
      OR: [
        {
          senderId,
          receiverId
        },
        {
          senderId: receiverId,
          receiverId: senderId
        }
      ]
    }
  })
}

export { createFriendRequest, findFriendRequest, deleteFriendRequest }
