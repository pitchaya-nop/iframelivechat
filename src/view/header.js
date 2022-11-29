import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setunread } from '../store/chat'
import { Button, message, Modal, Space } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons'
import Service from '../service/axios'
import { useNavigate } from 'react-router-dom';

import Closeicon from '../environment/image/close.png'
import Toggleicon from '../environment/image/toggle.png'
const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [confirmclose, setConfirmClose] = useState(false)
  const { topbarDisplay, livechatClassname, roomdetail } = useSelector(state => state.common)
  const [pathname, setPathname] = useState(window.location.pathname)
  // const createdata = localStorage.getItem('room') ? JSON.parse(localStorage.getItem('room')) : null
  // const token = localStorage.getItem('token') ? localStorage.getItem('token') : null
  // const token = new URLSearchParams(window.location.search).get("token")
  const closeLivechat = () => {
    let message = JSON.stringify({
      message: 'closelivechat',
      date: Date.now(),
    });
    window.parent.postMessage(message, '*');

  }
  const setFact = () => {
    const getroom = JSON.parse(localStorage.getItem('room'))
    const index = getroom.findIndex((data) => data.sessionId === roomdetail.sessionId)
    getroom[index].fact = '1'
    localStorage.setItem('room', JSON.stringify(getroom))
    dispatch(setunread(null))
  }
  const destroyLivechat = () => {
    setConfirmClose(true);
  };

  const handleOk = () => {
    setConfirmClose(false);
    Service({
      method: 'post',
      url: '/live-chat/room/close',
      headers: {
        'Authorization': `Bearer ${roomdetail.token}`
      },
      data: {
        sessionId: roomdetail.sessionId
      }
    }).then((res) => {
      if (res.data.code === '0000') {
        const getroom = JSON.parse(localStorage.getItem('room'))
        const getmsg = JSON.parse(localStorage.getItem('message'))
        let datafilter = getmsg.filter((item) => item.sessionId !== roomdetail.sessionId)
        localStorage.setItem('message', JSON.stringify(datafilter))
        // for (let i = 0; i < getmsg.length; i++) {
        //   console.log(getmsg[i].sessionId);
        //   console.log(roomdetail.sessionId);
        //   console.log(getmsg[i].sessionId === roomdetail.sessionId);
        // }
        // console.log('filterroom @@@@@@@@@@@@@@@@@@@');
        // console.log(datafilter);
        // console.log(roomdetail.sessionId);
        // localStorage.setItem('message', JSON.stringify(getmsg))
        // console.log(getmsg);
        const index = getroom.findIndex((data) => data.sessionId === roomdetail.sessionId)
        if (index !== -1) {
          getroom.splice(index, 1)
          localStorage.setItem('room', JSON.stringify(getroom))
        }
        // localStorage.removeItem('fact')
        // localStorage.removeItem('timestamp')
        // localStorage.removeItem('count')
        // localStorage.removeItem('room')
        // localStorage.removeItem('message')
        navigate(`/login?token=${roomdetail.token}`)
        // navigate('/login')
      }
    })
  };

  const handleCancel = () => {
    setConfirmClose(false);
  };

  return (
    <>
      <div className="header">
        {topbarDisplay && <h1>{topbarDisplay}</h1>}
        <div className="close-position">

          <a className="close-icon" style={{ backgroundImage: `url(${Toggleicon})` }} onClick={() => { closeLivechat(); setFact() }}>
            {/* <img src={Closeicon} /> */}
          </a>
          {pathname !== '/login' && <a className="close-icon" style={{ backgroundImage: `url(${Closeicon})`, marginLeft: '11px' }} onClick={destroyLivechat}></a>}
        </div>
      </div>
      <Modal open={confirmclose} maskClosable={false} closeIcon={true} footer={null}>
        <div style={{ display: 'flex', width: 192, margin: 'auto', alignItems: 'center', marginBottom: '24px' }}>
          <a style={{ marginRight: '16px' }}><InfoCircleOutlined style={{ fontSize: '22px', color: 'red' }} /></a>
          <span style={{ fontSize: '16px', fontWeight: '600' }}>Do you really want to leave current chat ?</span>
        </div>
        <div style={{ display: 'flex', width: 192, margin: 'auto', alignItems: 'center' }}>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button style={{ backgroundColor: '#FF4D4F', color: '#ffffff', marginLeft: '8px' }} onClick={handleOk} >Stop Chat</Button>
        </div>
      </Modal>
    </>

  )
}


export default Header