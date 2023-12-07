import React, { useEffect, useRef, useState } from 'react'
import { Image as ImageAntd } from 'antd'
// import Slider from 'react-slick'
// import 'slick-carousel/slick/slick.css'
// import 'slick-carousel/slick/slick-theme.css'
// import { useSelector } from 'react-redux'

const CardBody = ({ post }) => {
  const [readMore, setReadMore] = useState(false)

  return (
    <div className=' card_body'>
      <div className='px-4  '>
        {post.text && (
          <div>
            {post.text.length < 60 ? (
              <p>{post.text}</p>
            ) : (
              <div>
                {readMore ? (
                  <p>
                    {post.text}

                    <span
                      className='ml-2 text-red-400 cursor-pointer'
                      onClick={() => {
                        setReadMore(false)
                      }}
                    >
                      hidden
                    </span>
                  </p>
                ) : (
                  <p>
                    {post.text.slice(0, 60)}
                    <span
                      onClick={() => setReadMore(true)}
                      className='ml-1 text-red-400 cursor-pointer'
                    >
                      ...read more
                    </span>
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <div className='backdrop-contrast-[0.9] shadow-md mt-3 '>
        <ImageAntd.PreviewGroup>
          {/* <div className='dkkd'> */}
          {post.files.length === 1 && (
            <SingleImage image={post.files[0]} alt='' />
          )}
          {post.files.length === 2 && (
            <div className='w-full h-[400px] sm:h-[600px] grid grid-cols-2 gap-1  divide-x-[1px]'>
              {post.files.map((file, index, files) => (
                <div className=' w-full h-full  shadow-md '>
                  <CustomImage url={file.url} />
                </div>
              ))}
            </div>
          )}

          {post.files.length === 3 && (
            <div className='w-full h-[400px] sm:h-[600px] grid grid-rows-2 grid-flow-col gap-1  '>
              <div class='row-span-2 bg-gray-50 shadow-md'>
                <CustomImage
                  list={post.files.map(file => file.url)}
                  url={post.files[0].url}
                />
              </div>
              <div class='col-span-1 bg-red-300'>
                <CustomImage
                  list={post.files.map(file => file.url)}
                  url={post.files[1].url}
                />
              </div>
              <div class='row-span-1 col-span-1 bg-black ...'>
                <CustomImage
                  list={post.files.map(file => file.url)}
                  url={post.files[2].url}
                />
              </div>
            </div>
          )}

          {post.files.length === 4 && (
            <div className='w-full h-[400px] sm:h-[600px] flex flex-wrap gap-1 '>
              {post.files.map((file, index, files) => (
                <div className=' w-[calc(50%-2px)] h-[calc(50%-2px)] shadow-md '>
                  <CustomImage url={file.url} />
                </div>
              ))}
            </div>
          )}

          {post.files.length > 4 && (
            <div className='w-full h-[400px] sm:h-[600px] flex flex-wrap gap-1 '>
              {post.files.map((file, index, files) => (
                <div
                  className={`w-[calc(50%-2px)] h-[calc(50%-2px)] shadow-md ${
                    index === 3 ? 'relative' : ''
                  }  ${index > 3 && 'hidden'}`}
                >
                  <CustomImage url={file.url} />
                  {index === 3 && (
                    <div className='absolute top-[50%] left-[50%] cursor-pointer '>
                      <h1 className='text-lg'>+ {post.files.length - 4}</h1>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ImageAntd.PreviewGroup>
        {/* </div> */}
      </div>
    </div>
  )
}

const SingleImage = ({ image }) => {
  // const [width, setWidth] = useState(1)
  // const [height, setHeight] = useState(1)
  useEffect(() => {
    let img = new Image()
    img.src = image.url

    img.onload = () => {
      setRatio(img.height / img.width)
    }
  })
  const [ratio, setRatio] = useState(1)

  return (
    <div
      className={`w-full ${
        ratio > 1.2
          ? 'h-[700px] sm:h-[800px]'
          : ratio > 1
          ? 'h-[600px]'
          : 'h-[400px] sm:h-[500px]'
      }`}
    >
      <ImageAntd
        src={image.url}
        alt=''
        className={`!w-full !h-full shadow-md ${
          ratio > 1.2 ? 'object-contain' : 'object-cover'
        }`}
      />
    </div>
  )
}

const CustomImage = ({ url }) => (
  // <ImageAntd.PreviewGroup items={list}>
  <ImageAntd
    className='!w-full !h-full !object-cover shadow-[0_0_1px]'
    src={url}
  />
  // </ImageAntd.PreviewGroup>
)
export default CardBody
