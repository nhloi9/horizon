import { type User } from '@prisma/client'
import { prisma } from '../database/postgres'
// import { type IUser } from '../types'

const createUser = async (data: any): Promise<User> => {
  console.log(data)
  const newUser = await prisma.user.create({
    data
  })
  return newUser
}

const findUser = async (filter: any): Promise<User | null> => {
  const user = await prisma.user.findFirst({
    where: filter
  })
  return user
}

export { createUser, findUser }
