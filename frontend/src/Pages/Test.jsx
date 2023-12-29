import React, { useState } from 'react'
// import { services } from '@tomtom-international/web-sdk-services'
// import SearchBox from '@tomtom-international/web-sdk-plugin-searchbox'
import SearchBox from 'tomtom-react-searchbox'
import ContentEditable from 'react-contenteditable'
import { useRef } from 'react'
// import faker from 'faker'

// const ttSearchBox = new SearchBox(services, {
//   idleTimePress: 100,
//   minNumberOfCharacters: 0,
//   searchOptions: {
//     key: '<your-tomtom-search-key>',
//     language: 'en-GB'
//   },
//   autocompleteOptions: {
//     key: '<your-tomtom-search-key>',
//     language: 'en-GB'
//   },
//   noResultsMessage: 'No results found.'
// })
// const searchBoxHTML = ttSearchBox.getSearchBoxHTML()
//Attach searchboxHTML to your page

const Test = () => {
  const [texts, setTexts] = useState([])

  const contentEditable = useRef(null)
  const [html, setHtml] = useState('<b>Hello <i>World</i></b>')

  const handleChange = evt => {
    setHtml(evt.target.value)
  }
  console.log(texts)
  return (
    <div className='h-[100px] bg-slate-100'>
      {' '}
      <SearchBox
        onResultChoose={result => console.log(result)}
        searchOptions={{
          key: 'UB1JyOMM8IzEGrYwP2gNjM7mKxP07gaC',
          language: 'vi-VN',
          limit: 5,
          typeahead: true
        }}
      />
      <ContentEditable
        innerRef={contentEditable}
        html={html} // innerHTML of the editable div
        disabled={false} // use true to disable editing
        onChange={handleChange} // handle innerHTML change
        tagName='article' // Use a custom HTML tag (uses a div by default)
      />
      <div
        className='w-[200px] h-[200px] bg-slate-300 relative overflow-hidden'
        onClick={e => {
          const contentedTexts = texts.filter(
            text =>
              document.getElementById(text.id) &&
              document.getElementById(text.id)?.innerText &&
              document.getElementById(text.id)?.innerText?.trim().length > 0
          )
          setTexts(contentedTexts)
          console.log(
            e.clientX,
            e.clientY,
            e.target.getBoundingClientRect().top
          )
          const newText = {
            clientX: e.clientX - e.target.getBoundingClientRect().left,
            clientY: e.clientY - e.target.getBoundingClientRect().top,
            id: Math.random().toString()
          }
          setTexts(pre => [...pre, newText])
          setTimeout(() => {
            document.getElementById(newText.id) &&
              document.getElementById(newText.id)?.focus()
          }, 100)
        }}
      >
        {texts.map(text => (
          <span
            key={text.id}
            contentEditable
            onClick={e => {
              e.stopPropagation()
            }}
            style={{
              top: `${text.clientY}px`,

              maxWidth: `${200 - text.clientX}px`,
              maxHeight: `${200 - text.clientY}px`,
              // width: `min-`,
              left: `${text.clientX}px`
            }}
            type='text'
            id={text.id}
            className={`font-sevil text-[12px] italic absolute outline-none min-h-[10px]  min-w-[10px] overflow-y-scroll scroll-min    `}
          />
        ))}
      </div>
    </div>
  )
}

export default Test
