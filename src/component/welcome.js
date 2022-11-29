import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
import { useSelector, useDispatch } from 'react-redux'
import { settopbar, setimagedisplay, setroomdetail } from '../store/common'
import { setchat } from '../store/chat'
import DeviceDetector from "device-detector-js";
import Service from '../service/axios'
import moment from 'moment'

import Powered from '../environment/image/Powered.png';
import Headphone from '../environment/image/iconheadphone.png';
import Defaultoa from '../environment/image/defaultOa.png'
import { LoadingOutlined } from '@ant-design/icons';

const Welcome = () => {
  const dispatch = useDispatch()
  const deviceDetector = new DeviceDetector();
  const [loading, setLoading] = useState(false)
  const [setting, setSetting] = useState()
  const [language, setLanguage] = useState()
  const [oaid, setOaid] = useState()
  const [dataforcreate, setDataforcreate] = useState({
  })
  const token = new URLSearchParams(window.location.search).get("token")

  // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkVGltZSI6IjIwMjItMDktMDcgMDk6NTY6MzQiLCJvYUlkIjoiNjMxODZhZDI4NDIyYzQ5MmQwOTk3ZTFkIn0.4FoiEzPWoRCR7GRa6E_LL8jETO3AmtA4kc9snDcn6QM"
  const navigate = useNavigate()
  const getTimeToUtc = () => {
    var utcdate = new Date().toISOString().substr(0, 19).replace('T', ' ');
    return utcdate;
  }
  const getDateUtcDisplay = (value) => {
    var stillUtc = moment.utc(value).toDate();
    return moment(stillUtc).local().format("DD/MM");
  }
  const routeChat = () => {
    setLoading(true)
    Service({
      method: 'post',
      url: '/live-chat/room/create',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: {
        ipAddress: dataforcreate.ipAddress,
        region: dataforcreate.region,
        country: dataforcreate.country,
        city: dataforcreate.city,
        device: dataforcreate.device,
        browser: dataforcreate.browser,
        browserVersion: dataforcreate.browserVersion,
        os: dataforcreate.os,
        osVersion: dataforcreate.osVersion,

      }
    }).then((res) => {


      if (res.data.code === '0000') {

        const getroom = localStorage.getItem('room') ? JSON.parse(localStorage.getItem('room')) : []
        let data = {
          createdTime: res.data.data.createdTime,
          guest: res.data.data.guest,
          id: res.data.data.id,
          isClose: res.data.data.isClose,
          oaId: res.data.data.oaId,
          sessionId: res.data.data.sessionId,
          sessionName: res.data.data.sessionName,
          sessionType: res.data.data.sessionType,
          updatedTime: res.data.data.updatedTime,
          token: token,
          fact: '0',
          count: 0,
          timestamp: res.data.data.createdTime
        }
        getroom.push(data)
        // getroom.push({
        //   createdTime: res.data.data.createdTime,
        //   guest: res.data.data.guest,
        //   id: res.data.data.id,
        //   isClose: res.data.data.isClose,
        //   oaId: res.data.data.oaId,
        //   sessionId: res.data.data.sessionId,
        //   sessionName: res.data.data.sessionName,
        //   sessionType: res.data.data.sessionType,
        //   updatedTime: res.data.data.updatedTime
        // })
        localStorage.setItem('room', JSON.stringify(getroom))
        // localStorage.setItem(`room:${res.data.data.oaId}`, JSON.stringify(data))
        // localStorage.setItem(`token:${res.data.data.oaId}`, token)
        const getmsg = localStorage.getItem('message') ? JSON.parse(localStorage.getItem('message')) : []
        const indexmsg = getmsg.findIndex(dummy => dummy.status === 'WELCOME' && dummy.sessionId === '')
        if (indexmsg !== -1) {
          getmsg[indexmsg].sessionId = res.data.data.sessionId
          dispatch(setchat(getmsg))
          localStorage.setItem('message', JSON.stringify(getmsg))
        }
        dispatch(setroomdetail(data))
        navigate('/livechat', { state: { room: data } })
        setLoading(false)
      }
    })

  }

  const fetchData = () => {
    Service({
      method: 'post',
      url: '/live-chat/data',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => {


      dispatch(settopbar(res.data.data.widget.topBar[res.data.data.language]))
      setLanguage(res.data.data.language)
      setSetting(res.data.data)
      dispatch(setimagedisplay(res.data.data.avatars.source))
      const getmsg = localStorage.getItem('message') ? JSON.parse(localStorage.getItem('message')) : []
      const indexmsg = getmsg.findIndex(dummy => dummy.status === 'WELCOME' && dummy.sessionId === '')

      if (indexmsg === -1) {
        const welcomemessage = {
          id: "",
          groupMessageId: "",
          sessionId: "",
          messageId: "",
          referenceKey: "",
          senderId: "",
          oaId: res.data.data.oaId,
          displayName: res.data.data.displayName,
          avatar: "",
          rename: "null",
          readCount: 0,
          contentType: "TEXT",
          content: res.data.data.widget.welcomeMsg[res.data.data.language],
          createdTime: getTimeToUtc(),
          createdTimedisplay: getDateUtcDisplay(getTimeToUtc()),
          dummyfile: "",
          media: [{
            id: "",
            imageSource: "",
            imageMedium: "",
            imageThumbnail: "",
            type: "",
            mediaRefKey: "",
            width: 0,
            height: 0,
            cancelMedia: false,
            createdTime: "",
            indexMedia: 0,
            timeStamp: 0
          }],
          cancelMessage: false,
          strangerMessage: false,
          blockMessage: false,
          status: 'WELCOME',
          destructTime: 0,
          disappearTime: "",
          replymsgId: "",
          uniqueIds: ["null"],
          updatedTime: ""
        }
        getmsg.push(welcomemessage)
        dispatch(setchat(getmsg))
        localStorage.setItem('message', JSON.stringify(getmsg))

      }

      // if (localStorage.getItem(`token:${res.data.data.oaId}`)) {
      //   if (localStorage.getItem(`token:${res.data.data.oaId}`) !== token) {
      //     localStorage.removeItem('fact')
      //     localStorage.removeItem('timestamp')
      //     localStorage.removeItem('count')
      //     // localStorage.removeItem('room')
      //     // localStorage.removeItem('message')
      //     localStorage.setItem(`token:${res.data.data.oaId}`, token)
      //     navigate(`/login?token=${token}`)
      //   }
      // } else {
      //   localStorage.setItem(`token:${res.data.data.oaId}`, token)
      // }

      // if (token && localStorage.getItem(`room:${res.data.data.oaId}`)) {

      //   navigate('/livechat', { state: JSON.parse(localStorage.getItem(`room:${res.data.data.oaId}`)), token: token })
      // }

    })
  }
  useEffect(() => {
    const getroom = localStorage.getItem('room') ? JSON.parse(localStorage.getItem('room')) : []
    const index = getroom.findIndex((data) => data.token === token)

    if (index !== -1) {
      navigate('/livechat', { state: { room: getroom[index] } })
      dispatch(setroomdetail(getroom[index]))
    }
    // console.log(token);
    // localStorage.debug = '*';

    if (window.location !== window.parent.location) {
      // console.log("The page is in an iFrame");
    }
    else {
      // console.log("The page is not in an iFrame");
      // window.location.href = "https://official.goochat.net"
    }

    fetchData()
    setDataforcreate((prevState) => ({
      ipAddress: '',
      region: '',
      country: '',
      city: '',
      device: '',
      browser: '',
      browserVersion: '',
      os: '',
      osVersion: ''
    }))
    // fetch('https://ipapi.co/json/').then(
    //   r => r.text()
    // ).then((res) => {
    //   let converttojson = JSON.parse(res)
    //   console.log(res);
    //   console.log(converttojson);
    //   const device = deviceDetector.parse(navigator.userAgent);
    //   console.log(device);
    //   setDataforcreate((prevState) => ({
    //     ipAddress: converttojson.ip ? converttojson.ip : '',
    //     region: converttojson.timezone ? converttojson.timezone : '',
    //     country: converttojson.country_name ? converttojson.country_name : '',
    //     city: converttojson.country_capital ? converttojson.country_capital : '',
    //     device: device.device.type,
    //     browser: device.client.name,
    //     browserVersion: device.client.version,
    //     os: device.os.name,
    //     osVersion: device.os.version
    //   }))

    // });

  }, [])
  return (
    <>{setting && language &&
      <>
        <div className="container">
          <div style={{ height: '153px', background: '#2A2A54', position: 'relative' }}>
            <div style={{ height: '125px', background: 'white', width: '266px', position: 'absolute', bottom: '-30px', marginLeft: '27px', borderRadius: '5px' }}>
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <img src={Headphone} style={{ width: '100px', height: '100px', position: 'absolute', top: '-50px', left: '86px' }} />
                <div style={{ position: 'absolute', bottom: '24px', padding: '0 34px', textAlign: 'center', lineHeight: '1', width: '100%' }}>
                  {/* <span style={{ fontSize: '20px', fontWeight: '600' }}>Please Click to Start Chat to talk to us.</span> */}
                  <span style={{ fontSize: '20px', fontWeight: '600' }}>{setting.widget.header[language]}</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{
            height: '100%',
            paddingTop: '46px',
            paddingLeft: '8px',
            overflow: 'hidden'
          }}>
            <div style={{ maxHeight: '265px', overflowY: 'auto', paddingBottom: '30px' }}>

              <div style={{ display: 'flex' }}>
                <div style={{ width: '20px', height: '20px', marginRight: '3px', backgroundImage: `url(${setting.avatars.source ? setting.avatars.source : Defaultoa})`, backgroundSize: 'cover', borderRadius: '3px' }}>
                  {/* <img src={Headphone} style={{ width: '100%', height: '100%' }} /> */}
                </div>
                <div style={{ flex: '1' }}>

                  <div className="chat-content">

                    <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-start' }}>
                      <div style={{ width: 0, height: 0, borderStyle: 'solid', borderWidth: '0 10px 10px 10px', borderColor: 'transparent transparent #fff transparent', transform: 'rotate(180deg)' }}></div>
                      <p className="reply" style={{ margin: '0', marginLeft: '-14px' }}>
                        {setting.widget.welcomeMsg[language]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer">
          <div style={{ textAlign: 'center', marginBottom: '10.5px' }}>
            <button style={{ height: '36px', background: '#5353C9', width: '210px', color: '#fff', fontSize: '20px', border: '0', borderRadius: '6px', cursor: 'pointer' }}
              onClick={routeChat}
            >{loading ? <LoadingOutlined /> : `${setting.widget.buttonStart[language]}`}</button>
          </div>
          <div style={{ height: '36px', fontSize: '13px', fontWeight: '400', textAlign: 'center' }}>
            <span >By continuing as a guest, you agree to <br />
              <a href="https://official.goochat.net/termsOfUse" target="_blank" style={{ color: '#5353C9', textDecoration: 'underline', cursor: 'pointer' }}>GooChat Terms</a>, <a href="https://terms.goochat.net/privacypolicy" target="_blank" style={{ color: '#5353C9', textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</a> and <a href={language === 'th' ? 'https://livechats.goochat.net/cookiepolicyTH.html' : 'https://livechats.goochat.net/cookiepolicyEN.html'} target="_blank" style={{ color: '#5353C9', textDecoration: 'underline', cursor: 'pointer' }}>Cookies Policy</a>.</span>
          </div>
          <div className="powerByGoochat">
            <div className="hoverPowered">
              <img src={Powered} />
            </div>
          </div>
        </div>
      </>
    }

    </>
  )
}

export default Welcome;