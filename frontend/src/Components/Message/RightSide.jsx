import React, { useEffect, useRef, useState } from 'react'
import { BsMessenger, BsPlusCircle } from 'react-icons/bs'
// import TextareaAutosize from 'react-textarea-autosize'
// import EmojiSelect from '../EmojiSelect'
import { useDispatch, useSelector } from 'react-redux'
import { BiSend } from 'react-icons/bi'
import InfiniteScroll from 'react-infinite-scroll-component'
import { IoCall } from 'react-icons/io5'
import { FcVideoCall } from 'react-icons/fc'
import InputEmoji from 'react-input-emoji'
import ReactLoading from 'react-loading'
import { FaCircleInfo } from 'react-icons/fa6'

import { format, startOfWeek } from 'date-fns'
import { useParams } from 'react-router-dom'
import { getApi, postApi } from '../../network/api'
import { Avatar, Spin, Tooltip, message } from 'antd'
import { defaulAvatar } from '../../Constants'
import {
  getImageOfConversation,
  getNameOfConversation
} from '../../utils/conversation'
import {
  addMessage,
  seenConversation
} from '../../Reduxs/Actions/conversationAction '
import { socket } from '../../socket'
// import * as animationData from '../../animation/animation_ll70lfkr.json'
// import Lottie from 'react-lottie'
// import { socket } from '../../socket'
// import { peer } from '../../peer'

const RightSide = ({ id }) => {
  const [messages, setMessages] = useState([])
  const [conversation, setConversation] = useState(null)
  const textRef = useRef(null)
  const { conversations } = useSelector(state => state.conversations)
  const dispatch = useDispatch()

  const [seen, setSeen] = useState(false)
  const [chat, setChat] = useState(null)
  const { user } = useSelector(state => state.auth)
  const [inputMessage, setInputMessage] = useState('')
  const listRef = useRef(null)

  //to force rerender
  const [key, setKey] = useState(0)

  const handleLoadMore = () => {}

  const handleCreateMessage = async e => {
    e.preventDefault()
    try {
      const {
        data: { message }
      } = await postApi('/messages', {
        conversationId: id,
        text: inputMessage
      })
      socket.emit('addMessage', {
        message
      })
      setMessages([message, ...messages])
      const cloneConversation = structuredClone(conversation)
      cloneConversation.members.forEach(member => {
        if (member.userId === user.id) {
          member.isSeen = true
        } else {
          member.isSeen = false
        }
      })
      setConversation(cloneConversation)
      dispatch(addMessage(message))
    } catch (error) {}

    // const message = {
    //   sender: {
    //     _id: user._id,
    //     fullname: user.fullname,
    //     username: user.username,
    //     avatar: user.avatar
    //   },
    //   receiver: active.other,
    //   text: textRef.current.value,
    //   conversation: active._id
    // }
    // dispatch(createMessage(message))
    // textRef.current.value = ''
  }

  //seen messages
  useEffect(() => {
    const onMessage = ({ message }) => {
      try {
        if (message.member.conversationId?.toString() === id) {
          setMessages(messages => [message, ...messages])
          const cloneConversation = structuredClone(conversation)
          cloneConversation.lastMessage = message

          cloneConversation.members?.forEach(item => {
            if (
              item?.userId === message.member?.userId ||
              item?.userId === user.id
            ) {
              item.isSeen = true
            } else item.isSeen = false
          })
          socket.emit('seenConversation', { conversationId: id })
          dispatch(seenConversation(id, user.id, true))
        }
      } catch (error) {}
    }

    if (conversation) socket.on('addMessage', onMessage)
    return () => socket.off('addMessage', onMessage)
  }, [dispatch, id, conversation, user.id])

  useEffect(() => {
    const onSeenConversation = ({ conversationId, userId }) => {
      try {
        if (conversationId.toString() === id) {
          const cloneConversation = structuredClone(conversation)
          console.log('dkdk')
          cloneConversation.members?.forEach(item => {
            if (item?.userId === userId) {
              item.isSeen = true
            }
          })
          setConversation(cloneConversation)
        }
      } catch (error) {}
    }
    if (conversation) socket.on('seenConversation', onSeenConversation)
    return () => socket.off('seenConversation', onSeenConversation)
  }, [conversation, id])
  // useEffect(() => {
  //   if (active?._id) {
  //     const chat = chats.find(item => item._id === active._id)
  //     if (chat) {
  //       // setMessages([...chat.messages].reverse())
  //       setChat(chat)
  //     } else {
  //       dispatch(addChat(active._id))
  //     }
  //   }
  // }, [active?._id, chats, dispatch])

  //scroll to bottom when have a new message
  // const lasteMessageId = chat?.messages[0]?._id
  // useEffect(() => {
  //   listRef.current &&
  //     listRef.current.scrollIntoView({
  //       behavior: 'instant',
  //       // behavior: 'smooth',
  //       block: 'end',
  //       inline: 'nearest'
  //     })
  // }, [lasteMessageId, seen, active?._id])

  // useEffect(() => {
  //   if (active) {
  //     const conversation = conversations.find(item => item._id === active._id)
  //     const indexOfOther = conversation.members.findIndex(
  //       member => member._id === active.other._id
  //     )
  //     setSeen(conversation.seen[indexOfOther])
  //   }
  // }, [active?._id, active?.other._id, conversations, active])

  //delete active chat
  // useEffect(() => {
  //   return () =>
  //     dispatch({
  //       type: CONVERSATION_TYPES.ACTIVE_CONVERSATION,
  //       payload: null
  //     })
  // }, [dispatch])

  // call
  // const handleCall = ({ video }) => {
  //   const msg = {
  //     sender: user._id,
  //     receiver: active.other._id,
  //     other: active.other,
  //     video
  //   }
  //   dispatch({ type: CALL_TYPES.CALL, payload: msg })
  //   const { _id, username, fullname, avatar } = user
  //   if (window.peer?.open) {
  //     socket.emit('call', {
  //       sender: user._id,
  //       receiver: active.other._id,
  //       other: { _id, username, fullname, avatar },
  //       video,
  //       peerId: peer?._id
  //     })
  //   }
  // }

  useEffect(() => {
    if (id) {
      setConversation(null)
      setMessages([])
      dispatch(seenConversation(id, user.id, true))
      getApi('/messages', {
        conversationId: id
      })
        .then(({ data: { messages } }) => {
          setMessages(messages)
        })
        .catch(err => {})

      getApi('/conversations/' + id)
        .then(({ data: { conversation: con } }) => setConversation(con))
        .catch(err => {})
    }
  }, [id, dispatch, user.id])

  return (
    <div className='h-screen w-[calc(100%-350px)] pt-[50px]   right-side-message'>
      {conversation ? (
        //using startofweek to check different weeks
        <div className=' flex flex-col w-full h-full p-3 pr-1 right-side '>
          <div className=' w-full flex justify-between items-center pb-2 my-2 border-b'>
            <div className='flex items-center h-[50px]'>
              {getImageOfConversation(conversation, user?.id).length === 1 ? (
                <Avatar
                  size={40}
                  src={
                    getImageOfConversation(conversation, user?.id)[0] ??
                    defaulAvatar
                  }
                />
              ) : (
                <div className='w-[40px] h-[40px] relative'>
                  <img
                    alt=''
                    className='w-[27px] h-[27px] border-white block  rounded-full !absolute bottom-0 left-0 !z-20 !shadow-lg border'
                    src={
                      getImageOfConversation(conversation, user?.id)[0] ??
                      defaulAvatar
                    }
                  ></img>
                  <Avatar
                    size={26}
                    className='!absolute top-0 right-0'
                    src={
                      getImageOfConversation(conversation, user?.id)[1] ??
                      defaulAvatar
                    }
                  />
                </div>
              )}
              <div className='mx-1 flex flex-col justify-center gap-[-3px]'>
                <h1 className='font-[500]'>
                  {/* {conversation?.isGroup ? conversation?.name : conv} */}
                </h1>
                <p className='text-gray-700 font-[600]'>
                  {conversation && getNameOfConversation(conversation, user.id)}{' '}
                </p>
              </div>
            </div>
            <div className='flex px-2'>
              {' '}
              <Tooltip placement='leftTop' title='Conversation information'>
                <FaCircleInfo
                  size={20}
                  color='blue'
                  className='cursor-pointer'
                />
              </Tooltip>
            </div>
            {/* <div className='flex gap-3 pr-3'>
              <IoCall
                color='green'
                size={23}
                className='cursor-pointer'
                onClick={() => {
                  handleCall({ video: false })
                }}
              />
              <FcVideoCall
                color='green'
                size={23}
                onClick={() => handleCall({ video: true })}
                className=' cursor-pointer'
              />
            </div> */}
          </div>

          {/* display list messages */}
          <div
            className='w-full py-2  h-full  overflow-y-auto   '
            id='scrollableDiv'
            style={{ display: 'flex', flexDirection: 'column-reverse' }}
          >
            <div ref={listRef} className='pt-1'></div>
            <div className='flex justify-end'>
              <Tooltip
                placement='bottomLeft'
                title={
                  'seen by ' +
                  conversation.members
                    .filter(
                      member =>
                        member?.isSeen === true && member?.userId !== user.id
                    )
                    .map(item => item?.user?.firstname)
                    .join(', ')
                }
              >
                <div className='flex justify-end pr-3 gap-1'>
                  {/* {seen && (
                <Avatar url={active.other.avatar} size={'micro-avatar'} />
              )} */}
                  {conversation.members
                    .filter(
                      member =>
                        member?.isSeen === true && member?.userId !== user.id
                    )
                    ?.map(item => (
                      <Avatar
                        src={item?.user?.avatar?.url ?? defaulAvatar}
                        size={16}
                      />
                    ))}
                </div>
              </Tooltip>
            </div>
            <InfiniteScroll
              scrollableTarget='scrollableDiv'
              hasMore={true}
              dataLength={messages.length || 0}
              loader={
                // chat?.cusorTime !== null &&
                <div className='flex w-full  justify-center pointer-events-none  relative'>
                  <ReactLoading
                    type='spin'
                    color='#ccc'
                    height={'30px'}
                    width={'30px'}
                  />
                </div>
              }
              style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
              endMessage={
                <p style={{ textAlign: 'center' }}>
                  <b>Yay! You have seen it all</b>
                </p>
              }
              inverse={true} //
              next={handleLoadMore}
            >
              {messages &&
                messages.map((message, index) => (
                  <MessageCard
                    index={index}
                    key={message.id}
                    message={message}
                    user={user}
                    // other={active.other}
                  >
                    {index === messages.length - 1 ||
                    startOfWeek(new Date(message.createdAt), {
                      weekStartsOn: 1
                    }).getDate() !==
                      startOfWeek(new Date(messages[index + 1].createdAt), {
                        weekStartsOn: 1
                      }).getDate() ? (
                      <div className='w-full flex justify-center'>
                        <p className=' text-[13px] text-gray-500'>
                          {format(
                            new Date(message.createdAt),
                            'MMMM d, h:mm a'
                          )}
                        </p>
                      </div>
                    ) : new Date(message.createdAt).getDate() !==
                      new Date(messages[index + 1].createdAt).getDate() ? (
                      <div className='w-full flex justify-center'>
                        <p className=' text-[13px] text-gray-500'>
                          {format(new Date(message.createdAt), 'EEEE h:mm a')}
                        </p>
                      </div>
                    ) : (
                      // new Date(message.createdAt).getTime() -
                      //   new Date(messages[index - 1].createdAt).getTime() >
                      //   5 * 60 * 1000
                      Math.floor(
                        new Date(message.createdAt).getMinutes() / 15
                      ) !==
                        Math.floor(
                          new Date(messages[index + 1].createdAt).getMinutes() /
                            15
                        ) && (
                        <div className='w-full flex justify-center'>
                          <p className=' text-[13px] text-gray-500'>
                            {format(new Date(message.createdAt), 'h:mm a')}
                          </p>
                        </div>
                      )
                    )}
                  </MessageCard>
                ))}
            </InfiniteScroll>
          </div>

          {/* input message */}
          <form
            className=' w-full h-min flex  items-center gap-1 mt-1 relative '
            onSubmit={handleCreateMessage}
          >
            <BsPlusCircle color='blue' size={20} className='mb-2' />

            {/* <textarea
                onChange={() => setKey(cur => cur + 1)}
                ref={textRef}
                className=' rounded-lg  border-none focus:outline-none  w-full min-h-[30px] my-1 pt-[2px] bg-slate-50 px-[6px] resize-none'
              /> */}
            <InputEmoji
              cleanOnEnter
              placeholder=''
              maxLength={200}
              value={inputMessage}
              onChange={setInputMessage}
              onEnter={() => {
                console.log(3)
              }}
            />
            <button
              type='submit'
              className={`absolute top-[50%] -translate-y-[50%] right-14 p-[1px]  !bg-transparent ${
                inputMessage?.trim()?.length > 0 &&
                'cursor-pointer !text-blue-600'
              } text-gray-500 cursor-default`}
            >
              <BiSend size={20} className={` `} />
            </button>
            {/* <div className='pb-2'> */}
            {/* <EmojiSelect textRef={textRef} css='bottom-6 right-1' /> */}
            {/* </div> */}
          </form>
        </div>
      ) : (
        // <div></div>
        <div className=' flex  w-full h-full  justify-center items-center'>
          <BsMessenger size={35} color='blue' />
        </div>
      )}
    </div>
  )
}

export default RightSide

function MessageCard ({ message, user, children }) {
  if (message?.member?.userId === user.id) {
    return (
      <div className='p-2  w-full'>
        {children}
        <div className='flex justify-end '>
          <div
            className={`${
              message.id ? '' : 'opacity-50 '
            } max-w-[60%] bg-[#f0f0f0] rounded-[10px] py-1 px-2  min-w-[30px]  overflow-hidden`}
          >
            {message.text}
          </div>
        </div>
      </div>
    )
  } else
    return (
      <div>
        {children}
        <div className='flex justify-start my-2  w-full '>
          <Avatar
            src={message.member?.user?.avatar?.url ?? defaulAvatar}
            size='default'
          />
          <div className=' max-w-[60%] !bg-gray-300 rounded-[10px]  py-1 px-2 mx-1 flex  min-w-[30px]  overflow-hidden '>
            <p>{message.text}</p>
          </div>
        </div>
      </div>
    )
}
