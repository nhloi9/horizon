import { Avatar } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { MdCallEnd } from 'react-icons/md'
import { PiPhoneCallBold } from 'react-icons/pi'
import { useDispatch, useSelector } from 'react-redux'
import Peer from 'peerjs'

import {
  getImageOfConversation,
  getNameOfConversation
} from '../../utils/conversation'
import { defaulAvatar } from '../../Constants'
import { socket } from '../../socket'

const CallModal = () => {
  const callData = useSelector(state => state.call)
  const { user } = useSelector(state => state.auth)
  const [peers, setPeers] = useState([])
  const dispatch = useDispatch()

  const userVideo = useRef()
  const myPeer = useRef()

  const [answere, setAnswere] = useState(false)

  const timerRef = useRef(null)

  const handleAnswere = () => {
    createStream()

    // setAnswere(true)
    // socket.emit('answere', callData.sender)
    // navigator.mediaDevices
    //   .getUserMedia({ video: callData.video, audio: true })
    //   .then(stream => {
    //     const call = window.peer.call(callData.peerId, stream)
    //     call.on('stream', remoteStream => {
    //       // Show stream in some <video> element.
    //     })
    //   })
  }

  // console.log({ abs: getImageOfConversation(callData, user?.id) })

  const handleEndCall = () => {
    // socket.emit('endCall', callData)
    // dispatch({ type: CALL_TYPES.CALL, payload: null })
  }
  useEffect(() => {
    // const timeout = setTimeout(() => {
    //   dispatch({ type: CALL_TYPES.CALL, payload: null })
    // }, 15000)
    // timerRef.current = timeout
    // return () => clearTimeout(timeout)
  }, [dispatch])

  useEffect(() => {
    if (answere) {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [answere])

  useEffect(() => {
    // window.peer.on('call', call => {
    //   navigator.mediaDevices
    //     .getUserMedia({ video: call.video, audio: true })
    //     .then(stream => {
    //       call.answer(stream)
    //     })
    //     .catch(err => {
    //       console.error('Failed to get local stream', err)
    //     })
    //   return () => window.peer.removeListener('call')
    // })
  }, [])

  useEffect(() => {
    const handleSetAnswer = () => {
      setAnswere(true)
    }
    // socket.on('answere', handleSetAnswer)
    // return () => socket.off('answer', handleSetAnswer)
  }, [])

  console.log(user?.avatar?.url ?? defaulAvatar)

  function createStream () {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(stream => {
        // userVideo.current.srcObject = stream
        socket.emit('joinRoom', callData?.conversation?.id)
        socket.on('allUsers', ids => {
          const peers = []
          ids.forEach(id => {
            console.log({ id, peer: myPeer.current })
            peers.push({
              peerID: id,
              peer: myPeer.current?.call(id, stream)
            })
          })
          setPeers(peers)
        })
        // socket.on('userJoined', payload => {
        //   console.log('==', payload)
        //   const peer = addPeer(payload.signal, payload.callerID, stream)
        //   peersRef.current.push({
        //     peerID: payload.callerID,
        //     peer
        //   })
        //   const peerObj = {
        //     peer,
        //     peerID: payload.callerID
        //   }
        //   setPeers(users => [...users, peerObj])
        // })

        // socketRef.current.on('user left', id => {
        //   const peerObj = peersRef.current.find(p => p.peerID === id)
        //   if (peerObj) {
        //     peerObj.peer.destroy()
        //   }
        //   const peers = peersRef.current.filter(p => p.peerID !== id)
        //   peersRef.current = peers
        //   setPeers(peers)
        // })

        // socketRef.current.on('receiving returned signal', payload => {
        //   const item = peersRef.current.find(p => p.peerID === payload.id)
        //   item.peer.signal(payload.signal)
        // })

        // socketRef.current.on('change', payload => {
        //   setUserUpdate(payload)
        // })
      })
    console.log({ peers })
  }

  useEffect(() => {
    const peer = new Peer(socket.socket.id, {
      host: 'localhost',
      port: 9000,
      path: '/'
      // secure: true,
    })

    peer.on('call', function (call) {
      console.log('receive call')
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(stream => {
          call.answer(stream) // Answer the call with an A/V stream.
          call.on('stream', function (remoteStream) {
            // Show stream in some video/canvas element.
          })
          // setPeers(pre=>[...pre,])
        })
    })
    myPeer.current = peer

    peer.on('open', id => {
      console.log({ id })
    })
    console.log(peer)
    return () => {
      peer?.destroy()
    }
  }, [])

  useEffect(() => {
    // socket.on('userBusy', () => {
    //   dispatch({ type: CALL_TYPES.CALL, payload: null })
    //   dispatch({
    //     type: GLOBALTYPES.ALERT,
    //     payload: {
    //       error: 'user busy'
    //     }
    //   })
    // })
    // return () => socket.off('userBusy')
  }, [dispatch])
  return (
    <div className=' fixed top-0 bottom-0 left-0 right-0 z-[999999999999999999999] bg-[#00000069] flex justify-center items-center text-gray-200'>
      {!answere && (
        <audio
          hidden
          controls
          autoPlay
          loop
          src={require('../../assets/audio/muzee.mp3')}
        ></audio>
      )}
      <div className=' bg-black w-[90vw] rounded-lg h-[95vh]   shadow-[0_0_5px_gray] flex flex-col items-center justify-between'>
        <div className=' flex flex-col items-center'>
          <div className=' pt-5 pb-2'>
            {getImageOfConversation(callData?.conversation, user?.id).length ===
            1 ? (
              <Avatar
                size={80}
                src={
                  getImageOfConversation(callData?.conversation, user?.id)[0] ??
                  defaulAvatar
                }
              />
            ) : (
              <div className='w-[80px] h-[80px] relative'>
                <img
                  alt=''
                  className='w-[50px] h-[50px] border-white block  rounded-full !absolute bottom-0 left-0 !z-20 !shadow-lg border'
                  src={
                    getImageOfConversation(
                      callData?.conversation,
                      user?.id
                    )[0] ?? defaulAvatar
                  }
                ></img>
                <Avatar
                  size={50}
                  className='!absolute top-0 right-0'
                  src={
                    getImageOfConversation(
                      callData?.conversation,
                      user?.id
                    )[1] ?? defaulAvatar
                  }
                />
              </div>
            )}
          </div>
          <h1 className=' text-[22px] font-[600] text-gray-100'>
            {getNameOfConversation(callData?.conversation, user?.id)}
          </h1>

          <br />
          <span className='text-gray-200 text-sm'>Calling...</span>
        </div>
        {peers.map(peer => (
          <VideoCard peer={peer} key={peer.id} />
        ))}
        <div className=' flex flex-col items-center pb-4'>
          {answere && <Timer />}
          <br />
          <div className='flex gap-6'>
            {callData.receiver === user._id && !answere && (
              <div
                className=' rounded-full  bg-green-500 w-11 h-11 flex items-center justify-center cursor-pointer'
                onClick={handleAnswere}
              >
                <PiPhoneCallBold size={30} color='green' />
              </div>
            )}
            <div
              className=' rounded-full  bg-gray-300 w-11 h-11 flex items-center justify-center cursor-pointer'
              onClick={handleEndCall}
            >
              <MdCallEnd size={30} color='red' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Timer = () => {
  const [minute, setMinute] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [time, setTime] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(time => time + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  useEffect(() => {
    if (time) {
      setMinute(Math.floor(time / 60))
      setSeconds(time % 60)
    }
  }, [time])
  return (
    <div className='text-white  text-[12px]'>
      {minute < 10 ? '0' + minute : minute}:
      {seconds < 10 ? '0' + seconds : seconds}
    </div>
  )
}

const VideoCard = ({ peer }) => {
  const videoRef = useRef(null)
  const [stream, setStream] = useState()
  useEffect(() => {
    peer?.peer?.on('stream', function (remoteStream) {
      console.log({ remoteStream })
      // Show stream in some video/canvas element.
      // setStream(remoteStream)
      videoRef.current.srcObject = remoteStream
      if (videoRef.current?.paused)
        setTimeout(() => {
          videoRef.current.play()
        }, 100)
    })
  }, [])

  return (
    <video ref={videoRef} className='w-[100px] h-[80px] object-cover'></video>
  )
}

export default CallModal
