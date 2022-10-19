import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Icondark from '../environment/image/iconDarkmode.png'
import { setunread } from '../store/chat'
const Togglelivechat = () => {
  const dispatch = useDispatch()
  const { unreadcount } = useSelector(state => state.chat)
  const [countunreadmsg, setCountunreadmsg] = useState(localStorage.getItem('count') ? localStorage.getItem('count') : null)
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
    localStorage.setItem('fact', '0')
    localStorage.removeItem('count')
  }
  useEffect(() => {

    const countFunc = (event) => {
      console.log('event storage from togglelivechat');
      console.log(event.storageArea.count);
      setCountunreadmsg(event.storageArea.count)
    }
    window.addEventListener('storage', countFunc)
    return () => {
      window.removeEventListener('storage', countFunc)
    }
  }, [])
  return (
    <div className="container-toggle-icon" onClick={() => { openLivechat(); setFact() }}>
      <div style={{ width: '80px', height: '80px', cursor: 'pointer', boxShadow: '0px 1px 10px 4px rgb(83 83 201 / 70%)', borderRadius: '50%', position: 'relative' }}>
        {
          countunreadmsg && <span className="unread-count">{countunreadmsg > 99 ? '99+' : countunreadmsg}</span>
        }
        <img style={{ width: '100%', height: '100%' }} src={Icondark} />
      </div>
    </div>
  )
}

export default Togglelivechat