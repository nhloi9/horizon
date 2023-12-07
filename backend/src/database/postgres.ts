import { PrismaClient } from '@prisma/client'
import { events } from '../constants'
import { emitter } from '../configs'

const prisma = new PrismaClient()

// async function excludePasswordMiddleware (params: any, next: any): Promise<any> {
//   const result = await next(params)
//   if (params?.model === 'User' && params?.args?.select?.password !== true) {
//     delete result?.password
//   }
//   return result
// }
// prisma.$use(excludePasswordMiddleware)

const connectDb = (): void => {
  emitter.emit(events.POSTGRES_CONNECTED, process.env.DATABASE_URL)
}

export { prisma, connectDb }
