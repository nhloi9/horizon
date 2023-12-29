import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Facebook } from 'react-content-loader'
import { FaRegImage } from 'react-icons/fa'

import { getApi } from '../network/api'
import Header from '../Components/Layout/Header'
import Intro from '../Components/Profile/Intro'
import { Modal } from 'antd'
import { updateCoverImageAction } from '../Reduxs/Actions/authAction'
import toast from 'react-hot-toast'
import { upload } from '../utils/imageUpload'

const ProfilePage = () => {
  const dispatch = useDispatch()
  const { id } = useParams()
  const { user: me } = useSelector(state => state.auth)
  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [coverImage, setCoverImage] = useState(null)
  const [showUpdateCoverImage, setShowUpdateCoverImage] = useState(false)

  const handleChangeCoverImage = e => {
    setCoverImage(e.target.files[0])
    setShowUpdateCoverImage(true)
  }

  const confirm = () => {
    upload([coverImage])
      .then(images => {
        dispatch(updateCoverImageAction(images[0]))
        setShowUpdateCoverImage(false)
      })
      .catch(err => {
        toast.error(err)
        setShowUpdateCoverImage(false)
        setCoverImage(me.detail?.coverImage.url)
      })
  }

  useEffect(() => {
    if (id !== me.id.toString()) {
      setLoading(true)
      getApi('/users/info/' + id)
        .then(data => {
          setUserInfo(data.data.user)
          setLoading(false)
        })
        .catch(err => {})
    } else setUserInfo(me)
  }, [me, id])

  useEffect(() => {
    if (userInfo) setCoverImage(userInfo?.detail?.coverImage?.url)
  }, [userInfo])

  return (
    <div>
      <Header />
      {loading && <Facebook />}
      {!loading && userInfo && (
        <div className='min-h-screen '>
          <div className='w-full h-[120px] md:h-[350px] bg-[#e4d8d8] relative'>
            {coverImage && (
              <img
                src={
                  typeof coverImage === 'string'
                    ? coverImage
                    : coverImage instanceof File
                    ? window.URL.createObjectURL(coverImage)
                    : ''
                }
                className='block w-full h-full object-cover'
                alt={userInfo.fullname}
              />
            )}
            {id === me.id.toString() && (
              <label
                htmlFor='input-cover-image'
                className='absolute z-10 top-[50%] left-[50%] -translate-x-[50%] flex cursor-pointer'
              >
                <FaRegImage /> &nbsp;
                <p>add a cover image</p>
              </label>
            )}
            <input
              type='file'
              id='input-cover-image'
              className='hidden'
              onChange={handleChangeCoverImage}
              accept='image/png, image/gif, image/jpeg'
            />
          </div>
          {userInfo && (
            <Intro userInfo={userInfo} own={id === me.id.toString()} />
          )}
        </div>
      )}
      <Modal
        title='Update cover image'
        open={showUpdateCoverImage}
        onOk={confirm}
        onCancel={() => {
          setShowUpdateCoverImage(false)
          setCoverImage(userInfo?.detail?.coverImage?.url)
        }}
        maskClosable={false}
      ></Modal>
    </div>
  )
}

export default ProfilePage
