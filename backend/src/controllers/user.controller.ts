import { type Request, type Response, type NextFunction } from 'express'
import httpStatus from 'http-status'
import CryptoJS from 'crypto-js'
import bcrypt from 'bcrypt'

import { userRepo } from '../repositories'
import { generateToken, getApiResponse } from '../utils'
import { messages } from '../constants'
import { userMail } from '../mail'
import { tokenSettings } from '../configs'
import type { RequestPayload } from '../types'

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstname, lastname, email, password } = req.body
    const existingUser = await userRepo.findUser({
      email
      // active: true
    })
    if (existingUser !== null) {
      res
        .status(httpStatus.CONFLICT)
        .json(getApiResponse(messages.USER_EXISTED, res, 'USER_EXISTED'))
    } else {
      // const user = await userRepo.createUser({ ...req.body, active: false })
      const ciphertext = CryptoJS.AES.encrypt(
        JSON.stringify({
          email,
          firstname,
          lastname,
          password: bcrypt.hashSync(password, 5)
        }),
        process.env.ACTIVE_CIPHER_SECRET ?? 'kjdkj'
      )
        .toString()
        .replace(/\+/g, 'p1L2u3S')
        .replace(/\//g, 's1L2a3S4h')
        .replace(/=/g, 'e1Q2u3A4l')
      const mjmlContent = `
      <mjml>
        <mj-body>
          <mj-container>
            <mj-section>
              <mj-column>
                <mj-text font-size="20px" color="#333">Welcome to Our Service</mj-text>
                <mj-text font-size="16px" color="#666">Thank you for signing up for our service. To activate your account, please click the button below:</mj-text>
                <mj-button href="${
                  process.env.CLIENT_URL as string
                }/active-email/${ciphertext}" background-color="#007BFF" color="#fff">Activate Account</mj-button>
              </mj-column>
            </mj-section>
          </mj-container>
        </mj-body>
      </mjml>
    `
      userMail.sendActivateMail({
        from: 'nguyenhuuloi23052001@gmail.com',
        to: req.body.email,
        subject: 'Test mail',
        html: mjmlContent
      })

      res
        .status(httpStatus.OK)
        .json(
          getApiResponse(
            messages.USER_REGISTERED_SUCCESS,
            res,
            'USER_REGISTERED_SUCCESS'
          )
        )
    }
  } catch (error) {
    next(error)
  }
}

export const activeAcount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ciphertext = req.params.ciphertext
      .replace(/p1L2u3S/g, '+')
      .replace(/s1L2a3S4h/g, '/')
      .replace(/e1Q2u3A4l/g, '=')
    const decode = CryptoJS.AES.decrypt(
      ciphertext,
      process.env.ACTIVE_CIPHER_SECRET ?? 'kjdkj'
    ).toString(CryptoJS.enc.Utf8)
    if (decode === '') {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(getApiResponse(messages.USER_INVALID_ACTIVE_TOKEN))
    }
    const userData = JSON.parse(decode)
    const existingUser = await userRepo.findUser({ email: userData.email })
    if (existingUser != null) {
      res
        .status(httpStatus.CONFLICT)
        .json(getApiResponse(messages.USER_EXISTED, res, 'USER_EXISTED'))
    } else {
      await userRepo.createUser(userData)
      res
        .status(httpStatus.CREATED)
        .json(
          getApiResponse(
            messages.USER_ACTIVE_SUCCESS,
            res,
            'USER_ACTIVE_SUCCESS'
          )
        )
    }
  } catch (error) {
    next(error)
  }
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body
    const user = await userRepo.findUser({ email })
    // if (user?.birthday !== null && user?.birthday !== undefined) {
    //   console.log(user?.birthday.getHours())
    // }

    if (user == null) {
      res
        .status(httpStatus.NOT_FOUND)
        .json(
          getApiResponse(
            messages.USER_INCORECT_EMAIL_PASSWORD,
            res,
            'USER_INCORECT_EMAIL_PASSWORD'
          )
        )
    } else {
      const matchPassword = bcrypt.compareSync(password, user.password ?? '')
      if (!matchPassword) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .json(
            getApiResponse(
              messages.USER_INCORECT_EMAIL_PASSWORD,
              res,
              'USER_INCORECT_EMAIL_PASSWORD'
            )
          )
      }

      const { id, role } = user
      const token = generateToken({
        data: {
          id,
          role
        },
        secret: tokenSettings.secret,
        exp: tokenSettings.expireTime
      })

      res
        .status(httpStatus.OK)
        .cookie('token', token, {
          maxAge: tokenSettings.expireTime * 1000,
          secure: true
        })
        .json(
          getApiResponse({
            data: {
              user: { ...user, password: undefined }
            }
          })
        )
    }
  } catch (error) {
    next(error)
  }
}

export const getUser = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userRepo.findUser({ id: (req.payload as any).id })
    if (user === null) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json(getApiResponse(messages.USER_NOT_FOUND, res, 'USER_NOT_FOUND'))
    }
    const token = generateToken({
      data: { id: user.id, role: user.role },
      secret: tokenSettings.secret,
      exp: tokenSettings.expireTime
    })
    res
      .status(httpStatus.OK)
      .cookie('token', token, {
        maxAge: tokenSettings.expireTime * 1000,
        httpOnly: true
      })
      .json({
        data: {
          user
        }
      })
  } catch (error) {
    next(error)
  }
}
