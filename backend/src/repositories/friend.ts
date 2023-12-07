import { type FriendRequest } from '@prisma/client'
import { prisma } from '../database/postgres'
// import { type IUser } from '../types'

const createFriendRequest = async (
  senderId: number,
  receiverId: number
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

const acceptedFriendRequest = async (
  senderId: number,
  receiverId: number
): Promise<any> => {
  return await prisma.friendRequest.updateMany({
    where: { senderId, receiverId },
    data: { status: 'accepted' }
  })
}

export {
  createFriendRequest,
  findFriendRequest,
  deleteFriendRequest,
  acceptedFriendRequest
}

export const findAllFriends = async (userId: number): Promise<any> => {
  return await prisma.friendRequest.findMany({
    where: {
      OR: [
        {
          senderId: userId
        },
        {
          receiverId: userId
        }
      ],
      status: 'accepted'
    }
  })
}

export const findSendRequests = async (senderId: number): Promise<any> => {
  return await prisma.friendRequest.findMany({
    where: {
      senderId,
      status: 'waiting'
    },
    include: {
      receiver: {
        select: {
          lastname: true,
          firstname: true,
          id: true,
          avatar: true
        }
      }
    }
  })
}

export const findReceiveRequests = async (receiverId: number): Promise<any> => {
  return await prisma.friendRequest.findMany({
    where: {
      receiverId,
      status: 'waiting'
    },
    include: {
      sender: {
        select: {
          lastname: true,
          firstname: true,
          id: true,
          avatar: true
        }
      }
    }
  })
}
