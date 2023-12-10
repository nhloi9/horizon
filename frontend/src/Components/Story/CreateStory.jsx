import { Avatar, Button, Input, Progress, Tooltip } from 'antd'
import axios from 'axios'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { FaPause, FaPlay, FaVolumeDown, FaVolumeMute } from 'react-icons/fa'
import ReactPlayer from 'react-player'
import { useSelector } from 'react-redux'
import { FiPlusCircle } from 'react-icons/fi'
import { LuMusic } from 'react-icons/lu'
import { IoMdCloseCircleOutline } from 'react-icons/io'
import { IoClose } from 'react-icons/io5'
import { HiOutlineRefresh } from 'react-icons/hi'
import { toast } from 'react-hot-toast'
import { CgPushChevronRight, CgPushChevronUp } from 'react-icons/cg'
import { upload } from '../../utils/imageUpload'

const request = axios.create({
  baseURL: 'https://deezerdevs-deezer.p.rapidapi.com/',
  timeout: 10000,
  headers: {
    'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com',
    'x-rapidapi-key': 'd5fceae384msh08ad0dba50031c7p10982ejsn7f6ae044ce8a'
  }
})

const CreateStory = () => {
  const { user } = useSelector(state => state.auth)
  const [myvideo, setMyvideo] = useState(null)
  const myvideoRef = useRef()
  const [listSongs, setListSongs] = useState([])
  const [selectSong, setSelectSong] = useState(null)
  const [playMyvieo, setPlayMyvideo] = useState(false)
  const [activeSong, setActiveSong] = useState(null)
  let audioRef = useRef(null)
  const [muted, setMuted] = useState(false)
  const [percent, setPercent] = useState(0)

  const handleSelectVideo = e => {
    try {
      const video = document.createElement('video')
      video.preload = 'metadata'

      video.onloadedmetadata = function () {
        // window.URL.revokeObjectURL(video.src);
        var duration = video.duration
        if (duration < 10 || duration > 120) {
          toast.error(
            'Duration of video must be greater than 10s and less than 2 minutes.'
          )
        } else {
          setMyvideo(e.target.files[0])
        }
      }
      video.src = URL.createObjectURL(e.target.files[0])
    } catch (error) {}
  }

  const previewUrl = useMemo(() => {
    return myvideo ? URL.createObjectURL(myvideo) : null
  }, [myvideo])

  const onSearchMusic = async value => {
    if (!value) return setListSongs([])
    setListSongs([])
    try {
      const res = await request.get(`search?q=${value}`)
      setListSongs(res.data?.data)
    } catch (error) {
      setListSongs([])
    }
  }
  useEffect(() => {
    if (playMyvieo) {
      audioRef?.current?.play()
    } else {
      audioRef?.current?.pause()
    }
  }, [playMyvieo])

  useEffect(() => {
    if (!myvideo) {
      setPlayMyvideo(false)
    }
  }, [myvideo])
  useEffect(() => {
    setPercent(0)
    setMuted(false)
  }, [myvideo])

  const refresh = () => {
    myvideoRef.current?.seekTo(0, 'seconds')
    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }
  }

  const handlePostStory = async () => {
    try {
      const [file] = await upload([myvideo])
    } catch (error) {}
  }

  // useEffect(() => {
  //   if (myvideo) {
  //     console.log(myvideoRef.current?.duration)
  //   }
  // }, [myvideo])

  return (
    <div className='flex create-story'>
      {myvideo && selectSong && (
        <audio
          loop={true}
          autoPlay={false}
          ref={audioRef}
          // controls
          className='hidden'
          crossOrigin='anonymous'
          src={selectSong?.preview}
        />
      )}
      <div className='hidden md:block w-[300px] shadow-lg bg-white h-screen pt-[60px] px-2'>
        <div className='border-y-[1px] border-gray-300'>
          <h1 className='!font-[900] text-[24px] my-4'>Your Story</h1>

          <div
            className={`flex px-1 rounded-md gap-2 items-center py-1 cursor-pointer`}
          >
            <div className='rounded-full border-[3px] border-blue-600 shadow mb-4'>
              <div className='rounded-full border-[3px] border-gray-100 shadow'>
                <Avatar
                  size={'large'}
                  src={user?.avatar?.url}
                  className='shadow'
                />
              </div>
            </div>
            <div>
              <h1 className='text-lg text-gray-500'>
                {user?.firstname + ' ' + user?.lastname}
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className='w-full lg:w-[calc(100vw-300px)] bg-gray-100 h-screen pt-[60px] flex  justify-center '>
        <div className='w-[49%] flex flex-col items-center  '>
          <div className='relative w-[220px] mt-8'>
            {myvideo && (
              <div className='w-full px-3 absolute  -top-1 left-0 shadow-lg'>
                <Progress
                  percent={percent * 100}
                  showInfo={false}
                  size={'small'}
                />
              </div>
            )}
            {myvideo && (
              <div className='absolute z-20 top-5 w-full flex justify-between  items-center px-3 gap-2'>
                <div>
                  <Tooltip title='Remove this video' color='red'>
                    <IoMdCloseCircleOutline
                      onClick={() => {
                        setMyvideo(null)
                      }}
                      size={24}
                      className='!text-red-500 shadow-lg cursor-pointer !font-[800]'
                    />
                  </Tooltip>
                </div>
                <div className='flex gap-2 items-center'>
                  <Tooltip title='Replay' color='blue'>
                    <HiOutlineRefresh
                      onClick={() => {
                        refresh()
                        setPlayMyvideo(true)
                      }}
                      size={24}
                      className='!text-white shadow-lg cursor-pointer !font-[800]'
                    />
                  </Tooltip>
                  {muted ? (
                    <Tooltip color='blue' title='Turn on the original sound'>
                      <FaVolumeMute
                        onClick={() => {
                          setMuted(false)
                        }}
                        size={24}
                        className='!text-gray-50 shadow-lg cursor-pointer !font-[800] '
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip color='red' title='Turn off the original sound'>
                      <FaVolumeDown
                        onClick={() => {
                          setMuted(true)
                        }}
                        size={24}
                        className='!text-gray-50 shadow-lg cursor-pointer !font-[800] '
                      />
                    </Tooltip>
                  )}

                  {playMyvieo ? (
                    <FaPause
                      className='!text-gray-50 shadow-lg cursor-pointer !font-[800]  '
                      onClick={() => {
                        setPlayMyvideo(false)
                      }}
                      size={19}
                    />
                  ) : (
                    <FaPlay
                      className='!text-gray-50 shadow-lg cursor-pointer !font-[800] '
                      onClick={() => {
                        setPlayMyvideo(true)
                      }}
                      size={19}
                    />
                  )}
                </div>
              </div>
            )}
            {selectSong && (
              <div className='absolute z-20 bottom-2 w-full group'>
                <div
                  className={`w-full flex justify-center gap-1 ${
                    playMyvieo && 'animate-bounce'
                  }`}
                >
                  <p className='text-gray-100 text-center '>
                    <LuMusic
                      className='!text-gray-100 shadow-md translate-y-1'
                      size={20}
                    />{' '}
                    {selectSong.title_short} (
                    <span className='text-gray-300'>
                      {selectSong?.artist?.name?.length > 15
                        ? selectSong?.artist?.name?.slice(0, 15) + '...'
                        : selectSong?.artist?.name}
                      )
                    </span>
                  </p>
                </div>
                <div className='w-full  justify-center hidden group-hover:flex '>
                  <Tooltip color='red' title='Remove this song'>
                    <IoClose
                      color='red'
                      className='cursor-pointer'
                      onClick={() => {
                        setSelectSong(null)
                      }}
                    />
                  </Tooltip>
                </div>
              </div>
            )}
            {
              <Button
                onClick={handlePostStory}
                disabled={!myvideo}
                type='primary'
                className='absolute right-0  translate-x-[89px] top-[50%]'
              >
                Post <CgPushChevronRight className='!translate-y-[3px]' />
              </Button>
            }
            {!myvideo ? (
              <div
                className='w-[220px]  h-[330px] rounded-2xl flex items-center justify-center'
                style={{
                  backgroundImage:
                    'url(https://static.xx.fbcdn.net/rsrc.php/v3/ye/r/0_etHRYkr4X.png)'
                }}
              >
                <label htmlFor='input-story'>
                  <img
                    src='https://cdn-icons-png.flaticon.com/512/3159/3159331.png'
                    className='w-[30px] h-[30px] object-cover cursor-pointer'
                    alt=''
                  />
                </label>
                <input
                  accept='video/*'
                  type='file'
                  id='input-story'
                  className='hidden'
                  onChange={handleSelectVideo}
                />
              </div>
            ) : (
              <div className='w-[220px]  h-[330px] create-story-preview'>
                <ReactPlayer
                  ref={myvideoRef}
                  muted={muted}
                  // controls
                  loop={false}
                  onProgress={progress => {
                    setPercent(progress.played)
                  }}
                  onEnded={() => {
                    setPlayMyvideo(false)
                    setPercent(0)
                    refresh()
                  }}
                  // controls
                  playing={playMyvieo}
                  autoPlay={false}
                  url={previewUrl}
                  className='!w-full !h-full !object-cover'
                  // onEnded={handleNext}
                ></ReactPlayer>
              </div>
            )}
          </div>
          <div>
            <Input.Search
              className='w-[220xp] mt-4'
              placeholder='Add a music'
              onSearch={onSearchMusic}
              classNames={'!w-[220px]'}
            />
          </div>
          <br />
          <div className='w-[300px]'>
            {listSongs?.length > 0 && (
              <div className='bg-white w-full h-min max-h-[200px] song-card overflow-y-hidden hover:overflow-y-scroll px-1 py-1 rounded-md'>
                <h1 className='text-[18px] text-gray-800'>
                  Song{' '}
                  <span className='!text-sm !text-gray-600'>
                    ({listSongs.length} results found)
                  </span>
                </h1>
                {listSongs.map(song => (
                  <SongCard
                    song={song}
                    key={song?.id}
                    setSelectSong={setSelectSong}
                    activeSong={activeSong}
                    setActiveSong={setActiveSong}
                    refresh={refresh}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const SongCard = ({
  song,
  activeSong,
  setActiveSong,
  setSelectSong,
  refresh
  // currentSong,
  // setCurrentSong,
  // play
}) => {
  console.log(song)
  const songRef = useRef()
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = () => {
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleEnded = () => {
    setIsPlaying(false)
    // Additional logic when the video has ended
  }
  const handleAbort = () => {
    setIsPlaying(false)
    // Additional logic when the video has been aborted
  }

  useEffect(() => {
    if (activeSong?.id !== song.id) {
      songRef?.current?.pause()
    }
  }, [activeSong?.id, song?.id])

  return (
    <div className='w-full group h-[60px] flex items-center relative justify-between hover:bg-gray-300 px-1 rounded-md '>
      <audio
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onAbort={handleAbort}
        // loop={true}
        autoPlay={false}
        ref={songRef}
        //  controls
        className='hidden'
        crossOrigin='anonymous'
        src={song?.preview}
      />
      <div className=' flex gap-1  relative'>
        <img
          crossOrigin='anonymous'
          src={song.artist?.picture_medium}
          className='w-[40px] h-[40px] rounded-md object-cover'
          alt=''
        />
        <div className='absolute hidden group-hover:block left-3 top-3  cursor-pointer'>
          {!isPlaying && (
            <FaPlay
              className='!text-gray-600'
              onClick={() => {
                setActiveSong(song)
                songRef && songRef.current && songRef.current.play()
              }}
            />
          )}
        </div>

        {isPlaying && (
          <div
            className='absolute left-1 top-3  cursor-pointer'
            onClick={() => {
              songRef && songRef.current && songRef.current.pause()
            }}
          >
            (
            <img
              className='w-[20px] h-[20px] object-contain'
              alt=''
              src='https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/icons/icon-playing.gif'
            ></img>
            )
          </div>
        )}
        <div>
          <p className='text-gray-700 text-sm font-[600]'>
            {song?.title_short ?? 'Song'}
          </p>
          <p className='text-sm text-gray-500'>
            {song?.artist?.name ?? 'Artist'}
          </p>
        </div>
      </div>
      <p className='text-sm text-gray-500'>
        {String(Math.floor(song?.duration / 60)).padStart(2, '0')}:
        {String(song?.duration - Math.floor(song?.duration / 60) * 60).padStart(
          2,
          '0'
        )}
      </p>
      <div className='absolute hidden group-hover:block right-9 top-[19px]  cursor-pointer'>
        <Tooltip title='Add this audio' color='blue'>
          {
            <FiPlusCircle
              size={20}
              color='blue'
              onClick={() => {
                setSelectSong(song)
                refresh()
              }}
            />
          }
        </Tooltip>
      </div>
    </div>
  )
}

export default CreateStory
