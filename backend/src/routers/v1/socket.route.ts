import type { Server } from 'socket.io'
import jwt from 'jsonwebtoken'

import { prisma } from '../../database/postgres'
import { socketTokenSettings, tokenSettings } from '../../configs'
import { number } from 'joi'

let onlineUsers: number[] = []
const users: any = {}
const calls: any = {}
const userToCall: any = {}

// const checkBusyCall = (io: any, userId: number): boolean => {
//   return (
//     io?.sockets?.adapter?.rooms?.get('user_' + userId.toString())?.call !==
//     undefined
//   )
// }

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
    if (!onlineUsers.includes(socket?.userId)) {
      onlineUsers.push(socket?.userId)
      socket.broadcast.emit('online', socket?.userId)
    }

    if (users[socket.userId] !== undefined) {
      users[socket.userId].push(socket.id)
    } else users[socket.userId] = [socket.id]

    // const ip = socket.handshake.headers['x-forwarded-for']
    // socket.conn.remoteAddress.split(':')[3]
    // console.log(ip)
    // console.log(socket.request.connection.remoteAddress)
    // console.log(socket.handshake, socket.handshake.address.port)
    console.log('connection', socket.id)
    console.log({ users })
    // socket.emit('onlineUsers', onlineUsers)
    const onlineUsers = Object.keys(users).filter(
      (item: any) => users[item] !== un
    )
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

    // calll
    socket.on('call', async (payload: any) => {
      const { type, conversation }: any = payload
      if (userToCall[socket?.userId] === undefined) {
        return socket.emit('meBusy')
      }
      const otherMemberIds = (
        await prisma.conversationMember.findMany({
          where: {
            conversationId: Number(conversation?.id)
          }
        })
      )
        .map((member: any) => member?.userId)
        .filter((item: number) => item !== socket?.userId)

      if (
        otherMemberIds?.every(
          (memberId: number) => userToCall[memberId] !== undefined
        )
      ) {
        socket.emit('otherBusy')
      } else {
        calls[conversation?.id] = [socket.id]

        for (const id of otherMemberIds) {
          if (userToCall[id] !== undefined) {
            socket.to('user_' + (id as string)).emit('call', payload)
          }
        }
      }
    })

    socket.on('joinRoom', (conversationId: number) => {
      if (calls[conversationId] !== undefined) {
        const length = calls[conversationId].length
        if (length === 4) {
          socket.emit('roomFull')
          return
        }
        calls[conversationId].push(socket.id)
      } else {
        // users[roomID] = [socket.id]
      }
      userToCall[socket.userId] = conversationId
      const usersInThisRoom = calls[conversationId].filter(
        (id: string) => id !== socket.id
      )

      console.log({ calls })
      socket.emit('allUsers', usersInThisRoom)
    })

    socket.on('disconnect', (resonse: any) => {
      console.log('disconnect', socket.id)

      if (users[socket.userId] !== undefined) {
        users[socket.userId] = users[socket.userId].filter(
          (item: string) => item !== socket.id
        )
        if (users[socket.userId].length === 0) users[socket.userId] = undefined
      }
      console.log({ users })
      if (
        io.sockets.adapter.rooms.get('user_' + (socket?.userId as string)) ===
        undefined
      ) {
        onlineUsers = onlineUsers.filter((id: number) => id !== socket?.userId)
        socket.broadcast.emit('offline', socket?.userId)
      }
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
