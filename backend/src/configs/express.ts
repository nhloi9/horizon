import express, { type Express, type Request, type Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import timeout from 'connect-timeout'
import methodOverride from 'method-override'
import morgan from 'morgan'
import { I18n } from 'i18n'
import path from 'path'
import cookieParser from 'cookie-parser'

import { emitter } from './event-emitter'
import { vars } from './vars'
import { events } from '../constants'
import database from '../database'
import routerV1 from '../routers/v1'
import { notFound, errorConverter } from '../middlewares'

const app: Express = express()
const haltOnTimedout = (req: Request, _res: Response, next: any): void => {
  if (!req.timedout) {
    next()
  }
}
const i18n = new I18n()

i18n.configure({
  locales: ['en', 'vi'],
  directory: path.join(__dirname, '../constants/locales'),
  defaultLocale: 'en'
})

const initApp = (app: express.Express): void => {
  app.use(timeout('50s'))
  app.use(morgan('dev'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(methodOverride())
  app.use(helmet())
  app.use(
    cors({
      credentials: true,
      origin: 'http://localhost:3000'
    })
  )
  app.use(cookieParser())
  app.use(i18n.init)

  app.get('/health', (_req: Request, res: Response) => {
    console.log(_req.headers['accept-language'])
    // res.send('OK')
    res.send(res.__('hello'))
  })

  app.use('/', routerV1)
  app.use(notFound)
  app.use(haltOnTimedout)
  app.use(errorConverter)
}

export const start = (): void => {
  emitter.on(events.DB_CONNECTED, () => {
    initApp(app)
    app.listen(vars.port, () => {
      console.info(`[server] listen on port ${vars.port}`)
    })
  })
  database.connect()
}
