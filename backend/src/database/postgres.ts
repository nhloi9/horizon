import { PrismaClient } from '@prisma/client'
import { events } from '../constants'
import { emitter } from '../configs'

const prisma = new PrismaClient()

const connectDb = (): void => {
  emitter.emit(events.POSTGRES_CONNECTED, process.env.DATABASE_URL)
}

export { prisma, connectDb }
