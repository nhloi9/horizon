import React, { useState } from 'react'
import Header from '../Components/Layout/Header'
import { Avatar, Button, Input, Select, Tooltip } from 'antd'
import { useSelector } from 'react-redux'
import { MdOutlinePublic } from 'react-icons/md'
import { FaLock } from 'react-icons/fa'
import { MultiSelect } from 'react-multi-select-component'
import { defaulAvatar } from '../Constants'

const CreateGroupPage = () => {
  const { friends } = useSelector(state => state.friend)
  const { user } = useSelector(state => state.auth)
  const [selected, setSelected] = useState([])

  // const optionss = [
  //   { label: 'Grapes 🍇', value: 'grapes' },
  //   { label: 'Mango 🥭', value: 'mango' },
  //   { label: 'Strawberry 🍓', value: 'strawberry', disabled: true }
  // ]
  const options = friends?.map(friend => ({
    label: friend.firstname + ' ' + friend.lastname,
    value: friend.id
  }))

  return (
    <div>
      <Header />
      <div className='flex create-group'>
        <div className='w-full flex flex-col justify-between h-screen md:w-[400px] md:border-r-[1px] border-gray-300 pt-[60px] '>
          <div className='px-3'>
            <h1 className='text-[23px] my-5 '>Create group</h1>
            <div className='flex gap-2'>
              <Avatar
                size={'large'}
                className='!border-[1px] !shadow-md border-gray-200'
                src={user?.avatar?.url}
              />
              <div>
                <h3>{user?.firstname + ' ' + user?.lastname}</h3>
                <p className='text-gray-500'>Admin</p>
              </div>
            </div>
            <Input placeholder='Group name ' className='!h-[60px] !my-6' />
            <Select
              placeholder='Choose privacy'
              // defaultValue={null}
              style={{
                width: '100%'
              }}
              className='!h-[60px]'
              // onChange={handleChange}
              options={[
                {
                  value: 'public',
                  label: (
                    <Tooltip title=" Any one can see who's in group and what they post">
                      <div className='flex items-center gap-2 !h-[50px]'>
                        <MdOutlinePublic size={18} className='!text-lg' />
                        <p>Public</p>
                      </div>
                    </Tooltip>
                  )
                },
                {
                  value: 'private',
                  label: (
                    <Tooltip title="Only members can see who's in group and what they post">
                      <div className='flex items-center gap-2 !h-[50px]'>
                        <FaLock size={17} className='!text-lg !text-gray-700' />
                        <p>Private</p>
                      </div>
                    </Tooltip>
                  )
                }
              ]}
            />
            <label className='block mt-6 text-gray-400'>
              Invite friends( optional)
            </label>
            <MultiSelect
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
                  ? selected.map(({ label }) => ' ' + label + ',')
                  : ''
              }}
              className=''
              placeholder='Invite friends( optional)'
              options={options}
              value={selected}
              onChange={setSelected}
              labelledBy='Select'
            />
          </div>
          <div className='w-full shadow-lg  px-3 border-t-[1px] border-gray-100'>
            <Button type='primary' className='!my-4 !w-full'>
              Create
            </Button>
          </div>
        </div>
        <div className='hidden md:block px-7 py-7 h-screen pt-[90px]  w-full  bg-gray-100'>
          <div className=' w-full h-full rounded-md shadow-lg bg-white p-4 '>
            <p className='font-bold'>Group preview</p>
            <div className='w-full h-[calc(100%-30px)] mt-2 overflow-y-scroll'>
              <GroupPreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const GroupPreview = () => {
  return (
    <div className='w-full h-full border rounded-md'>
      <img
        src={require('../assets/images/create_group_preview.png')}
        className='w-full'
        alt=''
      />
      <div className='px-4 pt-5 pb-7 shadow-md'>
        <h1 className='text-[24px] font-[900] text-gray-500 pb-2'>
          Group name
        </h1>
        <p className='text-gray-600 mb-7'>
          Group privacy <span>. 1 member</span>
        </p>
        <div className='flex px-3 text-gray-600 font-[600] py-4 border-t-[1px] border-gray-300 gap-5'>
          <p>About</p>
          <p>Posts</p>
          <p>Members</p>
        </div>
      </div>
      <div className='bg-gray-100 p-4 flex justify-between  pointer-events-none'>
        <div className=' bg-[#f9f9f9] rounded-md w-full xl:w-[60%] px-2 pt-4 shadow-md'>
          <div className='flex gap-2 items-center'>
            <Avatar src={defaulAvatar} size={'large'} />
            <input
              type='text'
              placeholder='What is on your mind?'
              className='block w-full px-4 py-2 rounded-3xl bg-gray-200'
            />
          </div>
          <img
            src={require('../assets/images/create_group_2.png')}
            alt=''
            className='w-full'
          />
        </div>
        <div className='hidden xl:block w-[35%] h-min bg-white rounded-md shadow-md px-4 py-7'>
          <h1 className='text-gray-400'>About</h1>
        </div>
      </div>
    </div>
  )
}

export default CreateGroupPage
