import type { Server } from 'socket.io'
import jwt from 'jsonwebtoken'

import { prisma } from '../../database/postgres'
import { socketTokenSettings, tokenSettings } from '../../configs'

export const soketRoute = (io: Server): void => {
  io.use(async (socket: any, next) => {
    try {
      const token = socket.handshake.auth?.token

      if (token === undefined) {
        throw new Error()
      }
      const payload = jwt.verify(token, socketTokenSettings.secret)
      const user = await prisma.user.findUnique({
        where: { id: (payload as any).id }
      })
      if (user === null) {
        throw new Error()
      }
      socket.join('user_' + user.id?.toString())
      socket.userId = user.id
      next()
    } catch (error) {
      next(new Error('unAuthorization'))
    }
  })

  io.on('connection', (socket: any) => {
    console.log('user connection established with id', socket.id)
    // const ip = socket.handshake.headers['x-forwarded-for']
    // socket.conn.remoteAddress.split(':')[3]
    // console.log(ip)
    // console.log(socket.request.connection.remoteAddress)
    // console.log(socket.handshake, socket.handshake.address.port)
    // console.log('connection', socket.user)
    socket.on('test', (params: any) => {
      console.log(params)
    })

    socket.on('addMessage', async ({ message }: any) => {
      try {
        const memberRooms = await getUserRoomsOfConversation(
          message?.member?.conversationId
        )
        socket.to(memberRooms).emit('addMessage', { message })
      } catch (error) {
        console.log(error)
      }
    })

    socket.on('seenConversation', async ({ conversationId }: any) => {
      try {
        const memberRooms = await getUserRoomsOfConversation(conversationId)
        console.log(memberRooms)
        socket
          .to(memberRooms)
          .emit('seenConversation', { userId: socket.userId, conversationId })
      } catch (error) {}
    })

    socket.on('addFriendRequest', (request: any) => {
      socket
        .to([
          `user_${request?.senderId as string}`,
          `user_${request?.receiverId as string}`
        ])
        .emit('addFriendRequest', request)
    })

    socket.on('updateFriendRequest', (request: any) => {
      socket
        .to([
          `user_${request?.senderId as string}`,
          `user_${request?.receiverId as string}`
        ])
        .emit('updateFriendRequest', request?.id)
    })

    socket.on('deleteFriendRequest', (request: any) => {
      socket
        .to([
          `user_${request?.senderId as string}`,
          `user_${request?.receiverId as string}`
        ])
        .emit('deleteFriendRequest', request?.id)
    })
    socket.on('disconnect', (resonse: any) => {
      console.log('disconnect', socket.id)
    })
  })
}

const getUserRoomsOfConversation = async (
  conversationId: any
): Promise<any[]> => {
  const members = await prisma.conversationMember.findMany({
    where: {
      conversationId: Number(conversationId)
    }
  })
  const userIds = members.map(member => 'user_' + member.userId?.toString())
  return userIds
}
