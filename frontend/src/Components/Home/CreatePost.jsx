import React, { useEffect, useRef, useState } from 'react'
import { Button, Form, Input, Modal, Radio, Tooltip } from 'antd'
import { FaCamera } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'
import { toast } from 'react-hot-toast'
import { MdAddPhotoAlternate } from 'react-icons/md'

import EmojiSelect from './EmojiSelect'
import { useDispatch, useSelector } from 'react-redux'
import { createPostAction } from '../../Reduxs/Actions/postAction'

function dataURLtoFile (dataURL, filename) {
  const arr = dataURL.split(',')
  const mimeMatch = arr[0].match(/:(.*?);/)
  const mime = mimeMatch && mimeMatch.length >= 2 ? mimeMatch[1] : 'image/png'

  const byteString = atob(arr[1])
  const arrayBuffer = new ArrayBuffer(byteString.length)
  const uint8Array = new Uint8Array(arrayBuffer)

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i)
  }

  const blob = new Blob([arrayBuffer], { type: mime })
  return new File([blob], filename, { type: mime })
}

const options = [
  {
    label: (
      <Tooltip title='Only  me '>
        <span>Only me</span>
      </Tooltip>
    ),
    value: 'private'
  },
  {
    label: (
      <Tooltip title='Your friends on Horizon'>
        <span>Friends</span>
      </Tooltip>
    ),
    value: 'friend'
  },
  {
    label: (
      <Tooltip title='Any one'>
        <span>Public</span>
      </Tooltip>
    ),
    value: 'public'
  }
]

const CreatePost = ({ open, setOpen }) => {
  const { user } = useSelector(state => state.auth)
  const [form] = Form.useForm()
  const textareRef = useRef()
  const [tracks, setTracks] = useState(null)
  const dispatch = useDispatch()
  const [openCamera, setOpenCamera] = useState(false)
  // const [openPicker, setOpenPicker] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [images, setImages] = useState([])
  const [access, setAccess] = useState('private')

  const imgShow = image => {
    const videoRegex = /video/

    if (videoRegex.test(image.type)) {
      return (
        <video
          controls
          muted
          src={image.url ? image.url : URL.createObjectURL(image)}
          alt=''
          className={`block w-full h-full object-contain`}
        />
      )
    } else
      return (
        <img
          src={image.url ? image.url : URL.createObjectURL(image)}
          alt=''
          className={` block w-full h-full object-cover`}
        />
      )
  }

  const endStream = () => {
    setOpenCamera(false)
    tracks?.forEach(track => track.stop())
  }

  const handeSelectPhoto = e => {
    let imagesArr = [...images, ...Array.from(e.target.files)]
    if (imagesArr.length > 6) {
      imagesArr.splice(6)
      toast.error('Select too many images')
    }
    setImages(imagesArr)
  }
  const handleOpenFrontCamera = e => {
    setOpenCamera(true)
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: 'user', audio: true } })
      .then(mediaStream =>
        // console.log({mediaStream, a: mediaStream.getVideoTracks()})
        {
          videoRef.current.srcObject = mediaStream
          videoRef.current.play()
          videoRef.current.setAttribute('width', 300)
          videoRef.current.setAttribute(
            'height',
            300 / mediaStream.getVideoTracks()[0].getSettings().aspectRatio
          )
          canvasRef.current.setAttribute('width', 300)
          canvasRef.current.setAttribute(
            'height',
            300 / mediaStream.getVideoTracks()[0].getSettings().aspectRatio
          )
          setTracks(mediaStream.getTracks())
          // videoRef.current.setAttribute(
          // 	'width',
          // 	// mediaStream.getVideoTracks()[0].getSettings().aspectRatio * 400 + 'px'
          // 	'390px'
          // );
          // console.log(videoRef.current);
          // console.log(mediaStream.getVideoTracks()[0].getSettings());
        }
      )
      .catch(err => {
        toast.error(err)
      })
  }
  const handleOpenBackCamera = e => {
    setOpenCamera(true)
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { exact: 'environment' } } })
      .then(mediaStream =>
        // console.log({mediaStream, a: mediaStream.getVideoTracks()})
        {
          videoRef.current.srcObject = mediaStream
          videoRef.current.play()
          videoRef.current.setAttribute('width', 300)
          videoRef.current.setAttribute(
            'height',
            300 / mediaStream.getVideoTracks()[0].getSettings().aspectRatio
          )
          canvasRef.current.setAttribute('width', 300)
          canvasRef.current.setAttribute(
            'height',
            300 / mediaStream.getVideoTracks()[0].getSettings().aspectRatio
          )
          setTracks(mediaStream.getTracks())
        }
      )
      .catch(err => {
        console.log(err)
        // toast.error(err)
      })
  }
  const captureImage = () => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.fillStyle = '#AAA'
    context.drawImage(
      videoRef.current,
      0,
      0,
      videoRef.current.width,
      videoRef.current.height
    )

    const data = canvas.toDataURL('image/png')
    const file = dataURLtoFile(data, 'my_image.png')
    // dataURLtoArrayBuffer()
    let imagesArr = [...images, file]
    if (imagesArr.length > 6) {
      imagesArr.splice(6)
      toast.error('Select too many images')
    }
    setImages(imagesArr)
  }

  const handleOk = () => {
    if (images.length === 0) {
      toast.error('please select an image')
    } else {
      endStream()

      dispatch(
        createPostAction({
          content: textareRef.current.value,
          photos: images,
          access
        })
      )

      setOpen(false)
    }
  }

  useEffect(() => {
    textareRef.current.focus()
  }, [])
  return (
    <Modal
      // onOk={handleOk}
      maskClosable={false}
      open={open}
      title='Create a new post'
      okText='Create'
      cancelText='Cancel'
      onCancel={() => {
        endStream()
        setOpen(false)
      }}
      footer={[
        <Button
          type='primary'
          key='back'
          className='w-full '
          onClick={handleOk}
        >
          Post
        </Button>
      ]}
    >
      <form className='create-post '>
        <hr />

        <Radio.Group
          options={options}
          onChange={({ target: { value } }) => {
            setAccess(value)
          }}
          value={access}
        />
        <br />

        <textarea
          onChange={() => {
            console.log(textareRef.current)
          }}
          ref={textareRef}
          name=''
          id=''
          // cols='49'
          rows='6'
          // className='pt-2 outline-none appearance-none resize-none'
          placeholder={`${user?.firstname} ơi, bạn đang nghĩ gì thế ?`}
          className='p-2 w-full outline-none appearance-none resize-none border border-gray-200 hover:border-blue-500'
          maxLength={200}
        ></textarea>
        <div className='flex justify-end'>
          <EmojiSelect css='right-6' textRef={textareRef} />
        </div>

        {images && (
          <div className='flex pt-2 flex-wrap gap-1'>
            {images.map((image, i) => {
              return (
                <div
                  key={i}
                  className='md:h-[100px] md:w-[130px] w-[80px] h-[60px]  border border-blue-300 p-1 relative'
                >
                  {imgShow(image)}
                  <IoMdClose
                    fontSize='medium'
                    className='absolute top-0 right-0 text-red-400 cursor-pointer z-10'
                    onClick={() => {
                      const copy = [...images]
                      copy.splice(i, 1)
                      setImages(copy)
                    }}
                  />
                </div>
              )
            })}
          </div>
        )}
        <br />

        {openCamera && (
          <>
            <div className='relative h-min flex justify-center py-2 border border-blue-400 mb-2'>
              <video
                // className={`${theme ? 'invert' : 'invert-0'}`}
                onCanPlay={e => {
                  // console.log(e.target);
                }}
                ref={videoRef}
                src=''
              ></video>
              <IoMdClose
                fontSize='large'
                className='absolute top-2 right-2  text-red-400 cursor-pointer'
                onClick={() => {
                  // setOpenCamera(false);
                  // console.log(videoRef.current.srcObject);
                  // videoRef?.current?.srcObject
                  // 	?.getTracks()
                  // 	?.forEach((track) => track.stop());
                  endStream()
                }}
              />
              {/* <ChangeCircleIcon
                fontSize='large'
                className='absolute bottom-3 right-3 text-red-400 cursor-pointer'
                onClick={handleOpenBackCamera}
              /> */}
              <canvas className=' hidden ' ref={canvasRef}></canvas>
            </div>
          </>
        )}
        {openCamera ? (
          <div className='flex justify-center gap-3 '>
            <FaCamera
              sx={{ fontSize: '32px' }}
              className='cursor-pointer'
              onClick={captureImage}
            />
          </div>
        ) : (
          <div className='flex justify-center gap-3'>
            <FaCamera
              size={18}
              className='cursor-pointer'
              onClick={handleOpenFrontCamera}
            />
            <label htmlFor='select-photo'>
              <MdAddPhotoAlternate
                size={22}
                className='cursor-pointer  -translate-y-[2px]'
              />
            </label>
            <input
              className='hidden'
              type='file'
              id='select-photo'
              multiple
              onChange={handeSelectPhoto}
              accept='image/*, video/*'
            />
          </div>
        )}
      </form>
    </Modal>
  )
}

export default CreatePost
