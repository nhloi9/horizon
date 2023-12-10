import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../Components/Layout/Header'
import LeftSide from '../Components/Story/LeftSide'
import RightSide from '../Components/Story/RightSide'

const storiesData = [
  {
    id: 1,
    user: {
      id: 1,
      firstname: 'test',
      lastname: '1',
      avatar: {
        name: '145653.png',
        url: 'https://firebasestorage.googleapis.com/v0/b/netflix-fba01.appspot.com/o/145653.png?alt=media&token=6657c3dd-9f61-4785-9653-2f8a53fde1e4'
      }
    },
    video: {
      id: 5,
      url: 'https://firebasestorage.googleapis.com/v0/b/netflix-fba01.appspot.com/o/Thanh%20Pahm3343.mp4?alt=media&token=238ff17e-9623-4ca2-8878-bafa90a05c5e'
    }
  },
  {
    id: 2,
    user: {
      id: 1,
      firstname: 'test',
      lastname: '1',
      avatar: {
        name: '145653.png',
        url: 'https://firebasestorage.googleapis.com/v0/b/netflix-fba01.appspot.com/o/145653.png?alt=media&token=6657c3dd-9f61-4785-9653-2f8a53fde1e4'
      }
    },
    video: {
      name: 'Y2meta3743.mp4',
      url: 'https://firebasestorage.googleapis.com/v0/b/netflix-fba01.appspot.com/o/Y2meta3743.mp4?alt=media&token=475fda37-1b7f-498f-9e39-3b19fd948a18'
    }
  },
  {
    id: 4,
    user: {
      id: 1,
      firstname: 'test',
      lastname: '1',
      avatar: {
        name: '145653.png',
        url: 'https://firebasestorage.googleapis.com/v0/b/netflix-fba01.appspot.com/o/145653.png?alt=media&token=6657c3dd-9f61-4785-9653-2f8a53fde1e4'
      }
    },
    video: {
      id: 5,
      url: 'https://firebasestorage.googleapis.com/v0/b/netflix-fba01.appspot.com/o/Thanh%20Pahm3343.mp4?alt=media&token=238ff17e-9623-4ca2-8878-bafa90a05c5e'
    }
  },
  {
    id: 6,
    user: {
      id: 1,
      firstname: 'test',
      lastname: '1',
      avatar: {
        name: '145653.png',
        url: 'https://firebasestorage.googleapis.com/v0/b/netflix-fba01.appspot.com/o/145653.png?alt=media&token=6657c3dd-9f61-4785-9653-2f8a53fde1e4'
      }
    },
    video: {
      name: 'Y2meta3743.mp4',
      url: 'https://firebasestorage.googleapis.com/v0/b/netflix-fba01.appspot.com/o/Y2meta3743.mp4?alt=media&token=475fda37-1b7f-498f-9e39-3b19fd948a18'
    }
  },
  {
    id: 7,
    user: {
      id: 1,
      firstname: 'test',
      lastname: '1',
      avatar: {
        name: '145653.png',
        url: 'https://firebasestorage.googleapis.com/v0/b/netflix-fba01.appspot.com/o/145653.png?alt=media&token=6657c3dd-9f61-4785-9653-2f8a53fde1e4'
      }
    },
    video: {
      id: 8,
      url: 'https://firebasestorage.googleapis.com/v0/b/netflix-fba01.appspot.com/o/Thanh%20Pahm3343.mp4?alt=media&token=238ff17e-9623-4ca2-8878-bafa90a05c5e'
    }
  },
  {
    id: 9,
    user: {
      id: 1,
      firstname: 'test',
      lastname: '1',
      avatar: {
        name: '145653.png',
        url: 'https://firebasestorage.googleapis.com/v0/b/netflix-fba01.appspot.com/o/145653.png?alt=media&token=6657c3dd-9f61-4785-9653-2f8a53fde1e4'
      }
    },
    video: {
      id: 1,
      url: 'https://firebasestorage.googleapis.com/v0/b/netflix-fba01.appspot.com/o/Thanh%20Pahm3343.mp4?alt=media&token=238ff17e-9623-4ca2-8878-bafa90a05c5e'
    }
  },
  {
    id: 10,
    user: {
      id: 1,
      firstname: 'test',
      lastname: '1',
      avatar: {
        name: '145653.png',
        url: 'https://firebasestorage.googleapis.com/v0/b/netflix-fba01.appspot.com/o/145653.png?alt=media&token=6657c3dd-9f61-4785-9653-2f8a53fde1e4'
      }
    },
    video: {
      id: 11,
      url: 'https://firebasestorage.googleapis.com/v0/b/netflix-fba01.appspot.com/o/Thanh%20Pahm3343.mp4?alt=media&token=238ff17e-9623-4ca2-8878-bafa90a05c5e'
    }
  },
  {
    id: 12,
    user: {
      id: 1,
      firstname: 'test',
      lastname: '1',
      avatar: {
        name: '145653.png',
        url: 'https://firebasestorage.googleapis.com/v0/b/netflix-fba01.appspot.com/o/145653.png?alt=media&token=6657c3dd-9f61-4785-9653-2f8a53fde1e4'
      }
    },
    video: {
      id: 13,
      url: 'https://firebasestorage.googleapis.com/v0/b/netflix-fba01.appspot.com/o/Thanh%20Pahm3343.mp4?alt=media&token=238ff17e-9623-4ca2-8878-bafa90a05c5e'
    }
  }
]
const StoriesPage = () => {
  const { state } = useLocation()
  const [current, setCurrent] = useState(state?.current)

  console.log(state?.current)

  return (
    <div>
      <Header />
      <div className='flex'>
        <LeftSide
          storiesData={storiesData}
          current={current}
          setCurrent={setCurrent}
        />
        {
          <RightSide
            current={current}
            setCurrent={setCurrent}
            storiesData={storiesData}
          />
        }
      </div>
    </div>
  )
}

export default StoriesPage
