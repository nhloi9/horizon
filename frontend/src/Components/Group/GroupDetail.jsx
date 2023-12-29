import React, { useEffect, useMemo, useState } from 'react'
import { MdOutlinePublic } from 'react-icons/md'
import { FaLock } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, Button, Modal, Popover, Select } from 'antd'
import { CiSearch } from 'react-icons/ci'
import { LuClock5 } from 'react-icons/lu'
import { MdGroups } from 'react-icons/md'
import { MultiSelect } from 'react-multi-select-component'
import { GroupInvite } from '../../Reduxs/Actions/groupAction'
import { deleteApi, getApi, postApi, putApi } from '../../network/api'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FaBook } from 'react-icons/fa6'
import { globalTypes, updateToArray } from '../../Reduxs/Types/globalType'
import UserCard from '../Home/UserCard'
import PostCard from '../PostCard/PostCard'
import moment from 'moment'
import { groupTypes } from '../../Reduxs/Types/groupType'
import { defaulAvatar } from '../../Constants'
import CreatePost from '../Home/CreatePost'
import toast from 'react-hot-toast'
import CardHeader from '../PostCard/CardHeader'
import CardBody from '../PostCard/CardBody'

const GroupDetail = () => {
  const navigate = useNavigate()
  const [groupData, setGroupData] = useState(null)
  const [pendingPosts, setPendingPosts] = useState([])

  const { id, type } = useParams()

  const [openInvite, setOpenInvite] = useState(false)
  const [openCreatePost, setOpenCreatePost] = useState(false)
  const { requests } = useSelector(state => state.friend)
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()

  const friends = useMemo(() => {
    const acceptedRequests = requests?.filter(req => req?.status === 'accepted')
    return acceptedRequests.map(req => {
      return req?.senderId === user?.id ? req.receiver : req.sender
    })
  }, [requests, user?.id])

  const handleInvite = async invites => {
    try {
      dispatch({ type: globalTypes.ALERT, payload: { loading: true } })
      await postApi('groups/requests/invite', {
        groupId: groupData?.id,
        invites
      })
      dispatch({
        type: globalTypes.ALERT,
        payload: { success: 'Invite friend success' }
      })
    } catch (error) {
      dispatch({ type: globalTypes.ALERT, payload: { error } })
    }
  }

  const members = useMemo(() => {
    if (groupData)
      return [
        ...groupData.requests
          ?.filter(request => request.status === 'accepted')
          ?.map(item => item.user),
        groupData.admin
      ]
  }, [groupData])

  const joins = useMemo(() => {
    if (groupData)
      return groupData.requests?.filter(
        request => request.status === 'waiting' && request.type === 'join'
      )
    // ?.map(item => item.user) ?? []
  }, [groupData])

  const invites = useMemo(() => {
    if (groupData)
      return (
        groupData.requests
          ?.filter(
            request => request.status === 'waiting' && request.type === 'invite'
          )
          ?.map(item => item.user) ?? []
      )
  }, [groupData])

  const updateRequest = async request => {
    try {
      dispatch({
        type: globalTypes.ALERT,
        payload: {
          loading: true
        }
      })

      await putApi('/groups/requests/' + request?.id)

      setGroupData({
        ...groupData,
        requests: updateToArray(groupData.requests, {
          ...request,
          status: 'accepted'
        })
      })
      if (request?.id === myRequest?.id)
        dispatch({ type: groupTypes.UPDATE_REQUEST, payload: myRequest?.id })
      dispatch({
        type: globalTypes.ALERT,
        payload: {
          loading: false
        }
      })
    } catch (error) {
      dispatch({
        type: globalTypes.ALERT,
        payload: {
          loading: false
        }
      })
    }
  }

  const createRequest = async () => {
    try {
      dispatch({
        type: globalTypes.ALERT,
        payload: {
          loading: true
        }
      })

      const {
        data: { request }
      } = await postApi('/groups/requests', {
        groupId: groupData?.id
      })

      setGroupData({
        ...groupData,
        requests: [...groupData.requests, request]
      })

      dispatch({ type: groupTypes.CREATE_REQUEST, payload: request })
      dispatch({
        type: globalTypes.ALERT,
        payload: {
          loading: false
        }
      })
    } catch (error) {
      dispatch({
        type: globalTypes.ALERT,
        payload: {
          error
        }
      })
    }
  }

  const deleteRequest = async request => {
    try {
      dispatch({
        type: globalTypes.ALERT,
        payload: {
          loading: true
        }
      })

      await deleteApi('/groups/requests/' + request?.id)

      setGroupData({
        ...groupData,
        requests: groupData.requests.filter(item => item.id !== request?.id)
      })

      if (request?.id === myRequest?.id)
        dispatch({ type: groupTypes.DELETE_REQUEST, payload: myRequest?.id })
      dispatch({
        type: globalTypes.ALERT,
        payload: {
          loading: false
        }
      })
    } catch (error) {
      dispatch({
        type: globalTypes.ALERT,
        payload: {
          error
        }
      })
    }
  }

  const declinePost = postIds => {
    putApi(`/groups/${groupData?.id}/decline-post`, {
      postIds
    })
      .then(() => {
        setPendingPosts(pre => pre?.filter(post => !postIds.includes(post.id)))
      })
      .catch(error => toast.error(error))
  }

  const approvePost = postIds => {
    putApi(`/groups/${groupData?.id}/approve-post`, {
      postIds
    })
      .then(() => {
        setPendingPosts(pre => pre?.filter(post => !postIds.includes(post.id)))
      })
      .catch(error => toast.error(error))
  }

  const myRequest = useMemo(() => {
    return groupData?.requests.find(req => req.userId === user.id)
  }, [groupData, user?.id])

  useEffect(() => {
    setGroupData(null)
    getApi('/groups/' + id)
      .then(({ data: { group } }) => {
        setGroupData(group)
      })
      .catch(err => {})
  }, [id])

  useEffect(() => {
    if (
      groupData &&
      groupData?.adminId !== user?.id &&
      groupData?.privacy === 'private' &&
      !(myRequest?.status === 'accepted')
    ) {
      navigate('/groups/' + id + '/about')
    }
  }, [
    id,
    groupData,
    navigate,
    user?.id,
    myRequest?.status
    // groupData?.adminId,
    // groupData?.id,
    // groupData?.privacy,
    // myRequest?.status,
    // navigate,
    // user?.id,
    // type
  ])

  //get pending posts
  useEffect(() => {
    if (groupData?.adminId === user?.id) {
      getApi('/groups/' + groupData?.id + '/pending-posts')
        .then(({ data: { posts } }) => setPendingPosts(posts))
        .catch(err => {
          setPendingPosts([])
        })
    }
  }, [groupData?.adminId, user?.id, groupData?.id])

  return (
    groupData && (
      <div className='pt-[60px] flex h-[100vh] group-detail '>
        {/* left side */}
        <div className='hidden lg:block w-[350px] h-full shadow-lg border-r border-gray-200'>
          <div className='p-3'>
            <div className='flex gap-2 items-center'>
              <div
                className='w-11 h-11 rounded-md cursor-pointer '
                onClick={() => {
                  navigate('/groups/' + groupData?.id)
                }}
              >
                <img
                  src={groupData?.image?.url}
                  alt=''
                  className='w-full h-full object-cover rounded-md'
                />
              </div>
              <div className='flex flex-col justify-center'>
                <Link
                  to={'/groups/' + groupData?.id}
                  className='text-[18px] font-[500] appearance-none !text-black no-underline'
                >
                  {groupData?.name}
                </Link>
                <span className='text-gray-500 text-sm'>
                  <span>
                    {groupData?.privacy === 'public' ? (
                      <MdOutlinePublic className='!translate-y-[3px]' />
                    ) : (
                      <FaLock className='!translate-y-[3px]' />
                    )}
                  </span>
                  {' ' + groupData?.privacy + ' group  . '}
                  <span className='font-[600] text-sm'>
                    {members.length + ' members'}
                  </span>
                </span>
              </div>
            </div>

            {groupData?.adminId === user?.id ? (
              <Button
                type='primary'
                className='!w-full !my-6'
                onClick={() => {
                  setOpenInvite(true)
                }}
              >
                <span className='font-[500] '>+ Invite</span>
              </Button>
            ) : (
              myRequest?.status === 'accepted' && (
                <Popover
                  placement='bottomRight'
                  content={
                    <div
                      className='w-[300px]  flex items-center gap-2 cursor-pointer hover:bg-gray-200 p-1 rounded-md'
                      onClick={() => {
                        deleteRequest(myRequest)
                      }}
                    >
                      <i className='leave-group'></i> <span>Leave group</span>
                    </div>
                  }
                  trigger='click'
                  // open={open}
                  // onOpenChange={handleOpenChange}
                >
                  <Button type='default' className='!w-full !my-6 !bg-gray-200'>
                    <div className='font-[500] flex items-center justify-center gap-1'>
                      <MdGroups size={20} /> <span>Joined</span>
                    </div>
                  </Button>
                </Popover>
              )
            )}
          </div>
          {groupData.adminId === user.id && (
            <div className=' p-3  border-t border-gray-300'>
              <p className='font-[600] text-gray-500'> Admin tools</p>
              <div
                className={`flex items-center gap-2 px-1 my-3 py-2 rounded-md hover:bg-gray-200 cursor-pointer ${
                  type === 'member-requests' && 'bg-gray-200'
                }`}
                onClick={() => {
                  navigate('/groups/' + id + '/member-requests')
                }}
              >
                <img
                  src='https://static.xx.fbcdn.net/rsrc.php/v3/yN/r/3pvrsbqwH_6.png'
                  alt=''
                  className='h-5 w-5 object-cover'
                />
                <div className={`flex flex-col justify-center `}>
                  <h1>Member requests</h1>
                  <p className='text-gray-400'> {joins?.length} new today</p>
                </div>
              </div>

              <div
                className={`flex items-center gap-2 px-1 my-3 py-2 rounded-md hover:bg-gray-200 cursor-pointer ${
                  type === 'pending_posts' && 'bg-gray-200'
                }`}
                onClick={() => {
                  navigate('/groups/' + id + '/pending_posts')
                }}
              >
                <FaBook size={20} className='!text-gray-600' />
                <div className='flex flex-col justify-center  '>
                  <h1>Pending approvals</h1>
                  <p className='text-gray-400'>
                    {' '}
                    {pendingPosts?.length ?? 0} new today
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* left side */}

        {/* right side */}
        <div className='w-full h-full overflow-y-scroll lg:w-[calc(100%-350px)] bg-[#f0f2f5] '>
          {type === 'member-requests' && groupData?.adminId === user?.id ? (
            <MemberRequests
              joins={joins}
              updateRequest={updateRequest}
              deleteRequest={deleteRequest}
            />
          ) : type === 'about' || type === undefined ? (
            <div>
              {/* header */}
              <div className='relative'>
                <img
                  src={groupData?.image?.url}
                  alt=''
                  className='w-full h-[240px] object-cover'
                />
                <div className='absolute  w-[calc(100%-20px)] min-h-[150px] -bottom-[50px] right-2 bg-white rounded-md p-3 pt-7 '>
                  <div className='flex flex-col gap-1'>
                    <p className='text-[28px] font-[700]'>{groupData?.name}</p>
                    <span className='text-gray-500 '>
                      <span>
                        {groupData?.privacy === 'public' ? (
                          <MdOutlinePublic className='!translate-y-[3px]' />
                        ) : (
                          <FaLock className='!translate-y-[3px]' />
                        )}
                      </span>
                      {' ' + groupData?.privacy + ' group  . '}
                      <span className='font-[600] '>
                        {members?.length + ' members'}
                      </span>
                    </span>
                  </div>
                  <br />
                  <div className='flex justify-between'>
                    <div className='flex gap-[1px]'>
                      {members?.map((member, index) => (
                        <div
                          className='!border rounded-full flex items-center justify-center'
                          key={index}
                        >
                          <Avatar src={member?.avatar?.url ?? defaulAvatar} />
                        </div>
                      ))}
                    </div>
                    {user.id === groupData.adminId ? (
                      <Button type='primary'>
                        <span
                          className='font-[500]'
                          onClick={() => {
                            setOpenInvite(true)
                          }}
                        >
                          + Invite
                        </span>
                      </Button>
                    ) : !myRequest ? (
                      <Button
                        className='w-full md:w-min bg-blue-400'
                        onClick={createRequest}
                      >
                        Join Group
                      </Button>
                    ) : myRequest?.status === 'accepted' ? (
                      <Button type='primary'>
                        <span
                          className='font-[500]'
                          onClick={() => {
                            setOpenInvite(true)
                          }}
                        >
                          + Invite
                        </span>
                      </Button>
                    ) : myRequest?.status === 'waiting' &&
                      myRequest?.type === 'join' ? (
                      <div>
                        Your request to join the group is waiting for admin
                        approval
                      </div>
                    ) : (
                      <div className='flex gap-2'>
                        <Button
                          className='w-full md:w-min bg-blue-400'
                          onClick={() => updateRequest(myRequest)}
                        >
                          Join Group
                        </Button>
                        <Button
                          className='w-full md:w-min bg-red-400'
                          onClick={() => deleteRequest(myRequest)}
                        >
                          Decline invite
                        </Button>
                      </div>
                    )}
                  </div>
                  <br />
                  <hr className='h-[1px] bg-gray-200' />
                  <div className='flex justify-between items-center p-3'>
                    <div className='flex gap-5 items-center'>
                      <Link
                        to={`/groups/${groupData?.id}`}
                        className={`text-[18px] font-[500]  no-underline ${
                          type === undefined ? 'text-blue-400' : 'text-black'
                        }`}
                      >
                        Discussion
                      </Link>
                      <Link
                        to={`/groups/${groupData?.id}/members`}
                        className=' no-underline text-[18px] text-black font-[500]'
                      >
                        Members
                      </Link>
                      <Link
                        to={`/groups/${groupData?.id}/files`}
                        className=' no-underline  text-black text-[18px] font-[500]'
                      >
                        Files
                      </Link>
                    </div>
                    <div>
                      <CiSearch size={20} />
                    </div>
                  </div>
                </div>
              </div>

              {/* about */}
              {type === 'about' && (
                <>
                  <div className='flex w-full justify-center'>
                    <div className='w-[70%] mt-[70px] bg-white p-3 rounded-md '>
                      <h1 className='!text-[18px]'>About this group</h1>
                      <hr className='bg-gray-400 h-[1px] w-full mt-3 mb-2' />
                      <div className='flex items-start gap-1'>
                        <div>
                          {groupData?.privacy === 'public' ? (
                            <MdOutlinePublic className='!translate-y-[3px] !text-gray-500' />
                          ) : (
                            <FaLock className='!translate-y-[3px]' />
                          )}
                        </div>

                        <div>
                          <h1 className='capitalize'> {groupData?.privacy}</h1>
                          <span className='text-sm text-gray-500'>
                            {groupData?.privacy === 'public'
                              ? "Any one can see who's in the group and what they post."
                              : "Only members can see who's in the group and what they post."}
                          </span>
                        </div>
                      </div>
                      <div className='flex items-start gap-1 mt-3'>
                        <div>
                          <LuClock5 className='!translate-y-[3px] !text-gray-500' />
                        </div>

                        <div>
                          <h1 className='capitalize'> History</h1>
                          <span className='text-sm text-gray-500'>
                            Group create on {groupData?.createdAt?.slice(0, 10)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='flex justify-center'>
                    <div className='w-[70%] mt-4 bg-white p-3 rounded-md '>
                      <h1 className='!text-[18px]'>Members </h1>
                      <hr className='bg-gray-400 h-[1px] w-full mt-3 mb-2' />
                    </div>
                  </div>
                </>
              )}

              {/* home */}
              {type === undefined && (
                <div className='flex w-full justify-center gap-4'>
                  {/* left */}
                  <div className='flex w-[80%] lg:w-[55%] mt-[70px] flex-col py-4  bg-white rounded-xl shadow-lg'>
                    <div className='flex items-center border-b-2   border-blue-400 pb-4 pl-4 w-full'>
                      <Avatar
                        size='large'
                        variant='circular'
                        src={user.avatar?.url ?? defaulAvatar}
                        alt='avatar'
                      ></Avatar>

                      <div className='flex w-full justify-between items-center'>
                        <div className='w-full ml-4'>
                          <input
                            type='text'
                            name='text'
                            placeholder={`Write something...`}
                            className='outline-none w-full bg-gray-200 py-2 px-3 rounded-3xl cursor-pointer '
                            readOnly={true}
                            onClick={() => {
                              if (
                                groupData?.adminId !== user?.id &&
                                myRequest?.status !== 'accepted'
                              ) {
                                toast.error(
                                  'Only members of this group can post'
                                )
                              } else {
                                setOpenCreatePost(true)
                              }
                            }}
                            // ref={text}
                          ></input>
                        </div>
                        <div className='mx-4'>
                          {/* {image && (
                          <img
                            className='h-24 rounded-xl'
                            src={image}
                            alt='previewImage'
                          ></img>
                        )} */}
                        </div>
                        <div className='mr-4'>
                          <Button variant='text' type='submit'>
                            Share
                          </Button>
                        </div>
                      </div>
                      {/* </form> */}
                    </div>

                    <div className='flex justify-around items-center pt-4'>
                      <div className='flex items-center'>
                        <div className='cursor-pointer flex items-center'>
                          <img
                            className='h-6 w-6 object-cover mr-4'
                            src={
                              'https://static.xx.fbcdn.net/rsrc.php/v3/y-/r/WpZH_PxfuYV.png?_nc_eui2=AeEEsXViRBNHPBHANX1dAM91WdnC3Zi7PPBZ2cLdmLs88OYGM15Sf8aA6slNPP9t1DbiPmG92cD9epqCzigzstCF'
                            }
                            alt='addImage'
                          ></img>
                          <p>Anonymous post</p>
                        </div>
                      </div>
                      <div className='cursor-pointer flex items-center'>
                        <img
                          className='h-6 w-6 object-cover mr-4'
                          src={
                            'https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/a6OjkIIE-R0.png?_nc_eui2=AeFGzBWABkVgcqWhkTneuinsfK5Z1qDG7FV8rlnWoMbsVezNRPuu5wN0QcxQOaduofuemh1Q7l3tIcrG3mcLTQ9w'
                          }
                          alt='addImage'
                        ></img>
                        <p> Photo/video</p>
                      </div>
                    </div>

                    {/* {open && <CreatePost open={open} setOpen={setOpen} />} */}
                  </div>

                  {/* right */}
                  <div className='hidden lg:block w-[35%] mt-[70px] bg-white p-3 rounded-md '>
                    <h1 className='!text-[18px]'>About this group</h1>
                    <hr className='bg-gray-400 h-[1px] w-full mt-3 mb-2' />
                    <div className='flex items-start gap-1'>
                      <div>
                        {groupData?.privacy === 'public' ? (
                          <MdOutlinePublic className='!translate-y-[3px] !text-gray-500' />
                        ) : (
                          <FaLock className='!translate-y-[3px]' />
                        )}
                      </div>

                      <div>
                        <h1 className='capitalize'> {groupData?.privacy}</h1>
                        <span className='text-sm text-gray-500'>
                          {groupData?.privacy === 'public'
                            ? "Any one can see who's in the group and what they post."
                            : "Only members can see who's in the group and what they post."}
                        </span>
                      </div>
                    </div>
                    <div className='flex items-start gap-1 mt-3'>
                      <div>
                        <LuClock5 className='!translate-y-[3px] !text-gray-500' />
                      </div>

                      <div>
                        <h1 className='capitalize'> History</h1>
                        <span className='text-sm text-gray-500'>
                          Group create on {groupData?.createdAt?.slice(0, 10)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {openCreatePost && (
                    <CreatePost
                      open={openCreatePost}
                      setOpen={setOpenCreatePost}
                      groupId={groupData.id}
                    />
                  )}
                </div>
              )}
            </div>
          ) : type === 'pending_posts' && groupData?.adminId === user?.id ? (
            <PendingPosts
              posts={pendingPosts}
              approve={approvePost}
              decline={declinePost}
            />
          ) : (
            <div></div>
          )}
        </div>
        {/* right side */}

        <Invite
          handleInvite={handleInvite}
          friends={
            user.id === groupData.adminId
              ? friends.filter(
                  item =>
                    !members.find(member => member.id === item.id) &&
                    !joins.find(item => item.id === user.id)
                )
              : friends.filter(
                  item => !members.find(member => member.id === item.id)
                )
          }
          isModalOpen={openInvite}
          handleCancel={() => setOpenInvite(false)}
        />
      </div>
    )
  )
}

const Invite = ({ isModalOpen, handleCancel, friends, handleInvite }) => {
  const [selected, setSelected] = useState([])

  const options = friends?.map(friend => ({
    label: friend.firstname + ' ' + friend.lastname,
    value: friend.id
  }))
  return (
    <Modal
      title='Invite friends to this group'
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button
          key='submit'
          type='primary'
          // loading={loading}
          disabled={selected?.length === 0}
          onClick={() => {
            handleInvite(selected.map(item => item?.value))
            setSelected([])
          }}
        >
          Invite
        </Button>
      ]}
    >
      <div className='min-h-[50vh]'>
        <br />
        <MultiSelect
          overrideStrings={{
            selectSomeItems: 'Search for friends by name'
          }}
          ItemRenderer={({ checked, option, onClick, disabled }) => (
            <div
              className={`item-renderer ${
                disabled ? 'disabled' : ''
              } !flex !items-center`}
            >
              <input
                type='checkbox'
                onChange={onClick}
                checked={checked}
                tabIndex={-1}
                disabled={disabled}
              />

              {option.value ? (
                <div className='flex gap-1 items-center'>
                  <Avatar
                    src={
                      friends.find(item => item.id === option.value)?.avatar
                        ?.url
                    }
                  />
                  <p>{option.label}</p>
                </div>
              ) : (
                <span>{'Slect all friends'}</span>
              )}
            </div>
          )}
          valueRenderer={(selected, _options) => {
            return selected.length
              ? selected.map(({ label }, i) =>
                  i === selected.length - 1 ? ' ' + label : ' ' + label + ','
                )
              : ''
          }}
          className=''
          // placeholder='Invite friends( optional)'

          options={options}
          value={selected}
          onChange={setSelected}
          labelledBy='Select'
        />
      </div>
    </Modal>
  )
}

const renderPage = type => {
  switch (type) {
    case 'member-requests':
      return <div></div>
    default:
      return <div></div>
  }
}

const MemberRequests = ({ joins, deleteRequest, updateRequest }) => {
  return (
    <div className='relative'>
      <div className='top-0 w-full p-10 bg-white shadow-md sticky'>
        <h1 className='font-[700] text-[23px]'>Member requests</h1>
        <input
          className='block w-full mt-7 mb-3 px-4 py-2 bg-gray-200 rounded-2xl !border-none focus:outline-none'
          placeholder='🔍 Search by name'
        ></input>
        <div className='flex gap-4'>
          <Button className='bg-gray-200'>Clear filter</Button>
          <Select
            className='!w-[170px] !bg-gray-200'
            placeholder='Join Horizon date'
            // defaultValue='lucy'
            style={{
              width: 120
            }}
            // onChange={handleChange}
            options={[
              {
                value: 'Less than 3 months ago',
                label: 'Less than 3 months ago'
              },
              {
                value: 'Less than 6 months ago',
                label: 'Less than 6 months ago'
              },
              {
                value: 'Over  a year ago',
                label: 'Over  a year ago'
              },
              {
                value: 'Over two year ago',
                label: 'Over two year ago'
              }
            ]}
          />

          <Select
            placeholder='Request age'
            // defaultValue='lucy'
            style={{
              width: 140
            }}
            // onChange={handleChange}
            options={[
              {
                value: 'Less than 3 months ago',
                label: 'Less than 3 months ago'
              },
              {
                value: 'Less than 6 months ago',
                label: 'Less than 6 months ago'
              },
              {
                value: 'Over  a year ago',
                label: 'Over  a year ago'
              },
              {
                value: 'Over two year ago',
                label: 'Over two year ago'
              }
            ]}
          />

          <Select
            placeholder='Gender'
            // defaultValue='lucy'
            style={{
              width: 120
            }}
            className='!w-[100px]'
            // onChange={handleChange}
            options={[
              {
                value: 'Less than 3 months ago',
                label: 'Male'
              },
              {
                value: 'Less than 6 months ago',
                label: 'Female'
              },
              {
                value: 'Over  a year ago',
                label: 'Other'
              },
              {
                value: 'Over two year ago',
                label: 'Unknown'
              }
            ]}
          />
        </div>
      </div>
      <div>
        {joins?.length === 0 && (
          <div className='w-full h-[50vh] flex items-center justify-center'>
            <img
              src={require('../../assets/images/member_request_no.png')}
              alt=''
              className='block w-[300px] h-[150px] object-contain'
            />
          </div>
        )}
        {joins?.length > 0 && (
          <div className='pt-5 px-10 flex flex-col gap-3'>
            {joins.map(req => (
              <div className='p-4 rounded-md bg-white shadow flex justify-between '>
                <div>
                  <UserCard
                    userInfo={req?.user}
                    text={
                      'Request ' +
                      moment(
                        req.createdAt ?? new Date().toISOString()
                      ).fromNow()
                    }
                  />
                </div>
                <div className='flex gap-2'>
                  <Button
                    className='w-full md:w-min bg-blue-400'
                    onClick={() => updateRequest(req)}
                  >
                    Approve
                  </Button>
                  <Button
                    className='w-full md:w-min bg-red-400'
                    onClick={() => deleteRequest(req)}
                  >
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const PendingPosts = ({ posts = [], approve, decline }) => {
  return (
    <div className='relative'>
      <div className='top-0 w-full z-10 p-10 bg-white shadow-md sticky'>
        <h1 className='font-[700] text-[23px]'>Pending approvals</h1>
        <input
          className='block w-full mt-7 mb-3 px-4 py-2 bg-gray-200 rounded-2xl !border-none focus:outline-none'
          placeholder='🔍 Search by name'
        ></input>
        <div className='flex gap-4'>
          <Button className='bg-gray-200'>Clear filter</Button>
          <Select
            className='!w-[170px] !bg-gray-200'
            placeholder='Join Horizon date'
            // defaultValue='lucy'
            style={{
              width: 120
            }}
            // onChange={handleChange}
            options={[
              {
                value: 'Less than 3 months ago',
                label: 'Less than 3 months ago'
              },
              {
                value: 'Less than 6 months ago',
                label: 'Less than 6 months ago'
              },
              {
                value: 'Over  a year ago',
                label: 'Over  a year ago'
              },
              {
                value: 'Over two year ago',
                label: 'Over two year ago'
              }
            ]}
          />

          <Select
            placeholder='Request age'
            // defaultValue='lucy'
            style={{
              width: 140
            }}
            // onChange={handleChange}
            options={[
              {
                value: 'Less than 3 months ago',
                label: 'Less than 3 months ago'
              },
              {
                value: 'Less than 6 months ago',
                label: 'Less than 6 months ago'
              },
              {
                value: 'Over  a year ago',
                label: 'Over  a year ago'
              },
              {
                value: 'Over two year ago',
                label: 'Over two year ago'
              }
            ]}
          />

          <Select
            placeholder='Gender'
            // defaultValue='lucy'
            style={{
              width: 120
            }}
            className='!w-[100px]'
            // onChange={handleChange}
            options={[
              {
                value: 'Less than 3 months ago',
                label: 'Male'
              },
              {
                value: 'Less than 6 months ago',
                label: 'Female'
              },
              {
                value: 'Over  a year ago',
                label: 'Other'
              },
              {
                value: 'Over two year ago',
                label: 'Unknown'
              }
            ]}
          />
        </div>
      </div>
      <div>
        {posts?.length === 0 && (
          <div className='w-full h-[50vh] flex items-center justify-center'>
            <img
              src={require('../../assets/images/post_pendding_no.png')}
              alt=''
              className='block w-[300px] h-[150px] object-contain'
            />
          </div>
        )}
        {posts?.length > 0 && (
          <div className='pt-5 w-full flex justify-center'>
            {posts.map(post => (
              <div className='w-[95%] bg-white rounded-md md:w-[600px]'>
                <div className='px-3 pb-3'>
                  {' '}
                  <UserCard
                    size='sm'
                    userInfo={post?.user}
                    text={
                      'Request ' +
                      moment(
                        post?.createdAt ?? new Date().toISOString()
                      ).fromNow()
                    }
                  />
                </div>
                <CardBody
                  post={{
                    text: post.text ?? '',
                    files: post.files ?? [],
                    user: post.user
                  }}
                />
                <div className='flex gap-2 p-4'>
                  <Button
                    className='w-full md:w-min bg-blue-400'
                    onClick={() => approve([post?.id])}
                  >
                    Approve
                  </Button>
                  <Button
                    className='w-full md:w-min bg-red-400'
                    onClick={() => decline([post?.id])}
                  >
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default GroupDetail
