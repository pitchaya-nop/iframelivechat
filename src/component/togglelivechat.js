import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Icondark from '../environment/image/iconDarkmode.png'
import { setunread } from '../store/chat'
const Togglelivechat = () => {

  const dispatch = useDispatch()
  const { unreadcount } = useSelector(state => state.chat)
  // const { roomdetail } = useSelector(state => state.common)
  const tokenmode = new URLSearchParams(window.location.search).get("tokenmode")
  const [countunreadmsg, setCountunreadmsg] = useState()
  const openLivechat = () => {
    // alert('qweqwdqmoifqmofimweofmw')
    // dispatch(setlivechatclassname(''))

    let message = JSON.stringify({
      message: 'openlivechat',
      date: Date.now(),
    });
    window.parent.postMessage(message, '*');

  }
  const setFact = () => {
    if (localStorage.getItem('room')) {
      const getroom = JSON.parse(localStorage.getItem('room'))
      const index = getroom.findIndex((data) => data.token === tokenmode)
      getroom[index].fact = '0'
      getroom[index].count = null
      localStorage.setItem('room', JSON.stringify(getroom))

      // const getroom = JSON.parse(localStorage.getItem('room'))
      // const index = getroom.findIndex((data) => data.sessionId === roomdetail.sessionId)
      // console.log(index);
      // console.log(getroom[index]);
      // console.log(roomdetail.sessionId);
      // if (index !== -1) {
      //   getroom[index].fact = '0'
      //   getroom[index].count = null
      //   localStorage.setItem('room', JSON.stringify(getroom))
      // }
    }



    // localStorage.setItem('fact', '0')
    // localStorage.removeItem('count')
  }
  useEffect(() => {

    const countFunc = (event) => {

      // console.log('event storage from togglelivechat');
      // console.log(event.storageArea.count);
      if (localStorage.getItem('room')) {
        const getroom = JSON.parse(localStorage.getItem('room'))
        const index = getroom.findIndex((data) => data.token === tokenmode)
        if (index !== -1) {
          setCountunreadmsg(getroom[index].count)
        }
      }
    }
    window.addEventListener('storage', countFunc)
    return () => {
      window.removeEventListener('storage', countFunc)
    }
  }, [])
  return (
    <div className="container-toggle-icon" onClick={() => { openLivechat(); setFact() }}>
      <div style={{ width: '80px', height: '80px', cursor: 'pointer', boxShadow: '0px 1px 10px 2px rgb(83 83 201 / 70%)', borderRadius: '50%', position: 'relative' }}>
        {
          countunreadmsg > 0 && <span className="unread-count">{countunreadmsg > 99 ? '99+' : countunreadmsg}</span>
        }
        <img style={{ width: '100%', height: '100%' }} src={Icondark} />
      </div>
    </div>
  )
}

export default Togglelivechat

// thongchai0806@icloud.com
// thongchai08
// 0890330588
// 020116317601