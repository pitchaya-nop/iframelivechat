import React, { useEffect, useState } from 'react'
import autosize from 'autosize';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { setchat, setunread } from '../store/chat'
import { setimagedisplay, settopbar } from '../store/common'
import { Progress } from 'antd';

import Powered from '../environment/image/Powered.png';
import Inputimage from '../environment/image/inputimage.png';
import Emoji from '../environment/image/emoji.png';
import Sendchat from '../environment/image/sendchat.png';
import UnreadIcon from '../environment/image/unreadicon.png';
import ReadIcon from '../environment/image/readicon.png';
import Erroricon from '../environment/image/errorIcon.png';
import Waitimg from '../environment/image/waitimg.png'

import io from 'socket.io-client';
import Service from '../service/axios'
import { v4 as uuid_v4 } from "uuid";
import moment from 'moment'

const socket = io('https://dev.apigochat.com:443', {
  path: "/socket/socket.io",
  transports: ['websocket'],
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity

});

const Livechat = () => {
  const { chatMesage, firstmessageunread } = useSelector((state) => state.chat)
  const { topbarDisplay, imageofficial } = useSelector((state) => state.common)
  const dispatch = useDispatch()
  const location = useLocation();
  const [message, setMessage] = useState('')
  const [errorimagetype, setErrorimagetype] = useState(false)
  const [errormessage, setErrormessage] = useState('')
  const [imagerefkey, setImagerefkey] = useState(null)
  const [percenuploadimage, setPercenuploadimage] = useState(0)
  const createdata = localStorage.getItem('room') ? JSON.parse(localStorage.getItem('room')) : location.state.room
  const token = localStorage.getItem('token') ? localStorage.getItem('token') : location.state.token
  const getTimeToUtc = () => {
    var utcdate = new Date().toISOString().substr(0, 19).replace('T', ' ');
    return utcdate;
  }
  const getTimeToDisplay = (value) => {
    var stillUtc = moment.utc(value).toDate();
    if (
      moment(stillUtc).local().format("DD/MM/YYYY") ==
      moment(new Date()).format("DD/MM/YYYY")
    ) {
      return moment(stillUtc).local().format("HH:mm");
    } else {
      return moment(stillUtc).local().format("DD/MM");
    }
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
      dispatch(setimagedisplay(res.data.data.avatars.source))
    })
  }
  const addDummyMessage = (data) => {
    console.log(data.media);
    if (data.contentType === 'TEXT') {
      const dummymsg = {
        id: "",
        groupMessageId: "",
        sessionId: data.sessionId,
        messageId: "",
        referenceKey: data.referenceKey,
        senderId: data.guestId,
        oaId: "",
        displayName: data.guestUniqueName,
        avatar: "",
        rename: "null",
        readCount: 0,
        contentType: data.contentType,
        content: data.content,
        createdTime: getTimeToUtc(),
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
        status: 'WAITING',
        destructTime: data.destructTime,
        disappearTime: "",
        replymsgId: "",
        uniqueIds: ["null"],
        updatedTime: ""
      }
      const getmsg = localStorage.getItem('message') ? JSON.parse(localStorage.getItem('message')) : []
      getmsg.push(dummymsg)
      dispatch(setchat(getmsg))
      localStorage.setItem('message', JSON.stringify(getmsg))
    } else {
      const dummyimage = {
        id: "",
        groupMessageId: "",
        sessionId: data.sessionId,
        messageId: "",
        referenceKey: data.referenceKey,
        senderId: data.guestId,
        oaId: "",
        displayName: data.guestUniqueName,
        avatar: "",
        rename: "null",
        readCount: 0,
        contentType: data.contentType,
        content: data.content,
        createdTime: getTimeToUtc(),
        dummyfile: "",
        media: data.media,
        cancelMessage: false,
        strangerMessage: false,
        blockMessage: false,
        status: 'WAITING',
        destructTime: data.destructTime,
        disappearTime: "",
        replymsgId: "",
        uniqueIds: ["null"],
        updatedTime: ""
      }
      console.log(dummyimage);
      const getmsg = localStorage.getItem('message') ? JSON.parse(localStorage.getItem('message')) : []
      getmsg.push(dummyimage)
      dispatch(setchat(getmsg))
      localStorage.setItem('message', JSON.stringify(getmsg))
    }

    scrollbottom()
  }
  const readMessage = () => {
    socket.emit(`messages:read`, `{"sessionId":"${createdata.sessionId}","readTime":"${getTimeToUtc()}","guestId":"${createdata.guest.guestId}","isGuest":"true"}`)
  }
  const updateRead = (time) => {
    const getmsg = localStorage.getItem('message') ? JSON.parse(localStorage.getItem('message')) : []
    getmsg.map((msg) => {
      if (msg.createdTime <= time && msg.status === 'SENT') {
        msg.status = 'READ'
      }
    })
    dispatch(setchat(getmsg))
    localStorage.setItem('message', JSON.stringify(getmsg))
  }
  const updateMessage = (msgdata) => {
    const getmsg = localStorage.getItem('message') ? JSON.parse(localStorage.getItem('message')) : []
    msgdata.messages.map((item, index) => {
      item.sessionId = msgdata.sessionId
      item.id = msgdata.id
      const indexmsg = getmsg.findIndex(dummy => dummy.referenceKey === item.referenceKey && dummy.status === 'WAITING')
      if (indexmsg === -1) {
        var container = document.querySelector(".testscroll");
        getmsg.push(item)
        dispatch(setchat(getmsg))
        localStorage.setItem('message', JSON.stringify(getmsg))
        console.log((container.scrollTop + container.clientHeight) - container.scrollHeight);
        if (((container.scrollTop + container.clientHeight) - container.scrollHeight) < 1 && ((container.scrollTop + container.clientHeight) - container.scrollHeight) >= 0) {
          scrollbottom()
        }
      } else {
        if (item.contentType === 'TEXT') {
          getmsg[indexmsg].id = item.id
          getmsg[indexmsg].sessionId = item.sessionId
          getmsg[indexmsg].messageId = item.messageId
          getmsg[indexmsg].senderId = item.senderId
          getmsg[indexmsg].displayName = item.displayName
          getmsg[indexmsg].readCount = item.readCount
          getmsg[indexmsg].contentType = item.contentType
          getmsg[indexmsg].content = item.content
          getmsg[indexmsg].createdTime = item.createdTime
          getmsg[indexmsg].cancelMessage = item.cancelMessage
          getmsg[indexmsg].strangerMessage = item.strangerMessage
          getmsg[indexmsg].blockMessage = item.blockMessage
          getmsg[indexmsg].status = item.status
          getmsg[indexmsg].destructTime = item.destructTime
          getmsg[indexmsg].disappearTime = item.disappearTime
          getmsg[indexmsg].updatedTime = item.updatedTime

        } else {
          getmsg[indexmsg].id = item.id
          getmsg[indexmsg].sessionId = item.sessionId
          getmsg[indexmsg].messageId = item.messageId
          getmsg[indexmsg].senderId = item.senderId
          getmsg[indexmsg].displayName = item.displayName
          getmsg[indexmsg].readCount = item.readCount
          getmsg[indexmsg].contentType = item.contentType
          getmsg[indexmsg].content = item.content
          getmsg[indexmsg].createdTime = item.createdTime
          getmsg[indexmsg].cancelMessage = item.cancelMessage
          getmsg[indexmsg].strangerMessage = item.strangerMessage
          getmsg[indexmsg].blockMessage = item.blockMessage
          getmsg[indexmsg].status = item.status
          getmsg[indexmsg].destructTime = item.destructTime
          getmsg[indexmsg].disappearTime = item.disappearTime
          getmsg[indexmsg].updatedTime = item.updatedTime
          getmsg[indexmsg].media = item.media
        }
        dispatch(setchat(getmsg))
        localStorage.setItem('message', JSON.stringify(getmsg))
      }
    })

  }
  const sendChat = (payload) => {
    console.log('send chat');
    console.log(payload.media);
    Service({
      method: 'post',
      url: '/live-chat/room/send',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: payload
    }).then((res) => {
      console.log(res.data);
    })

  }
  const clickChat = () => {
    if (message !== '') {
      const payload = {
        sessionId: createdata.sessionId,
        referenceKey: uuid_v4(),
        contentType: "TEXT",
        content: message,
        destructTime: 0,
        guestId: createdata.guest.guestId,
        guestUniqueName: createdata.guest.guestUniqueName

      };
      addDummyMessage(payload)
      sendChat(payload)
      setMessage('')
      let ta = document.querySelector('textarea')
      ta.value = ""
      ta.focus()
      autosize.update(ta)
    }
  }
  const enterChat = (e) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      if (message !== '') {
        const payload = {
          sessionId: createdata.sessionId,
          referenceKey: uuid_v4(),
          contentType: "TEXT",
          content: message,
          destructTime: 0,
          guestId: createdata.guest.guestId,
          guestUniqueName: createdata.guest.guestUniqueName
        };
        addDummyMessage(payload)
        sendChat(payload)
        setMessage('')
        e.target.value = ""
        autosize.update(document.querySelector('textarea'));
        e.preventDefault()
      }
    }
  }
  const scrollbottom = () => {
    var container = document.querySelector(".testscroll");
    setTimeout(() => {
      container.scrollTop = container.scrollHeight;
    }, 200);

  }
  const socketEvent = () => {
    socket.emit(`messages`, `{"sessionId":"${createdata.sessionId}","synctime":"${createdata.createdTime}","isGuest":"${true}","guestId":"${createdata.guest.guestId}","oaToken":"Bearer ${token}"}`)

    socket.on(`messages:${createdata.sessionId}`, (data) => {
      console.log('on socket');
      console.log(data);
      // message
    })


    socket.emit(`join:room`, `{"sessionId":"${createdata.sessionId}","userId":"${createdata.guest.guestId}","isGuest":"true"}`)
    socket.on(`messages:update:${createdata.sessionId}`, async (data) => {
      console.log('message update @@@@@@@@@@');
      await updateMessage(data.data[0])
      if (localStorage.getItem('fact') === '1') {
        let count = 0
        const msg = JSON.parse(localStorage.getItem('message'))
        let fintitem = msg.filter((item) => item.status === 'SENT' && item.oaId !== "")
        dispatch(setunread(fintitem[0].messageId))
        for (let i = 0; i < msg.length; i++) {
          if (msg[i].status === 'SENT') {
            count += 1
          }
        }
        localStorage.setItem('count', count)

      } else if (localStorage.getItem('fact') === '0') {
        readMessage()
      }
    })
    socket.on(`messages:read:${createdata.sessionId}`, (data) => {
      //read data
      console.log('read message @@@@@@@@@@@@@@@@@@@@@@');
      updateRead(data.data.lastMsgReadTime)

    })

    // socket.emit(`messages:read:fetch`,`"userId","${guestid}","msgUnreadTime":"${firstunreadtime}","sessionId":"${sessionId}"`)
    // socket.on(`messags:read:fetch:${guestId}`,(data)=>{
    //   // last read
    // })
  }
  const unsubEvent = async () => {
    socket.off(`messages:${createdata.sessionId}`)
    socket.off(`messages:update:${createdata.sessionId}`)
    socket.off(`messages:read:${createdata.sessionId}`)
  }
  const imageDimensions = file =>
    new Promise((resolve, reject) => {
      const img = new Image()

      // the following handler will fire after a successful loading of the image
      img.onload = () => {
        console.log(img);
        const { naturalWidth: width, naturalHeight: height, src: src } = img
        resolve({ width, height, src })
      }
      img.onerror = () => {
        reject('There was some problem with the image.')
      }

      img.src = URL.createObjectURL(file)
    })
  const uploadImage = (dataimg) => {
    return new Promise((resolve, reject) => {
      Service({
        method: 'post',
        url: '/live-chat/room/media/upload',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        data: dataimg,
        onUploadProgress: (progressEvent) => {
          let progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setPercenuploadimage(progress)

        },
      }).then((res) => {
        setPercenuploadimage(0)
        resolve(res.data.data)
        // console.log(payload);

      })
    })
  }
  const onChangeFile = async (event) => {
    if (event.target.files.length) {
      for (let i = 0; i < event.target.files.length; i++) {
        if (event.target.files[i].size > (10 * 1024 * 1024)) {
          setErrorimagetype(true)
          setErrormessage('You can only send up to 10M of file at a time.')
          setTimeout(() => {
            setErrorimagetype(false)
          }, 2500);
          event.target.value = ''
          return false
        }
      }
    }
    if (event.target.files.length > 10) {
      setErrorimagetype(true)
      setErrormessage('You can select no more than 10 items.')
      setTimeout(() => {
        setErrorimagetype(false)
      }, 2500);
    }
    else if (event.target.files.length > 0) {
      const payload = {
        sessionId: createdata.sessionId,
        referenceKey: uuid_v4(),
        contentType: "IMAGE",
        content: "",
        destructTime: 0,
        guestId: createdata.guest.guestId,
        guestUniqueName: createdata.guest.guestUniqueName,
      };

      if (event.target.files.length > 1) {
        let arrayobject = []
        for (let i = 0; i < event.target.files.length; i++) {
          const imagemediarefkey = uuid_v4()
          const dimensions = await imageDimensions(event.target.files[i])
          console.log(dimensions);
          arrayobject.push({
            id: "",
            imageSource: "",
            imageMedium: "",
            imageThumbnail: "",
            type: "",
            mediaRefKey: imagemediarefkey,
            width: dimensions.width,
            height: dimensions.height,
            cancelMedia: false,
            createdTime: getTimeToUtc(),
            indexMedia: 0,
            timeStamp: 0,
            imgdemo: dimensions.src,
            waiting: true
          })
          payload.media = arrayobject
        }
        addDummyMessage(payload)
        let arriamge = []
        for (let i = 0; i < event.target.files.length; i++) {
          const formdata = new FormData()
          formdata.append('sessionId', createdata.sessionId)
          formdata.append('file', event.target.files[i])
          formdata.append('mediaRefKey', payload.media[i].mediaRefKey)
          formdata.append('type', 'IMAGE')
          setImagerefkey(payload.media[i].mediaRefKey)
          const uploadImgData = await uploadImage(formdata)
          // const updatedummyultipleimage = 
          // |.parse(localStorage.getItem('message'))
          // console.log(updatedummyultipleimage);
          // updatedummyultipleimage.filter((item) => {

          // })
          // localStorage.setItem('message', JSON.stringify(updatedummyultipleimage))


          arriamge.push(uploadImgData)
        }
        console.log('out loop');
        console.log(payload);
        payload.media = arriamge

        console.log('multiple dummy');
        console.log(payload);
        console.log(arriamge);

        sendChat(payload)

      } else {
        let arrayobject = []
        const imagemediarefkey = uuid_v4()
        const dimensions = await imageDimensions(event.target.files[0])
        if (dimensions.width === dimensions.height && dimensions.width < 216) {
          console.log('case 1');
          arrayobject.push({
            id: "",
            imageSource: "",
            imageMedium: "",
            imageThumbnail: "",
            type: "",
            mediaRefKey: imagemediarefkey,
            width: 216,
            height: 216,
            cancelMedia: false,
            createdTime: getTimeToUtc(),
            indexMedia: 0,
            timeStamp: 0,
            imgdemo: dimensions.src
            // files: event.target.files[0]
          })
        } else {
          console.log('case2');
          arrayobject.push({
            id: "",
            imageSource: "",
            imageMedium: "",
            imageThumbnail: "",
            type: "",
            mediaRefKey: imagemediarefkey,
            width: dimensions.width,
            height: dimensions.height,
            cancelMedia: false,
            createdTime: getTimeToUtc(),
            indexMedia: 0,
            timeStamp: 0,
            imgdemo: dimensions.src
            // files: event.target.files[0]
          })
        }
        payload.media = arrayobject
        addDummyMessage(payload)

        let arriamge = []
        const formdata = new FormData()
        formdata.append('sessionId', createdata.sessionId)
        formdata.append('file', event.target.files[0])
        formdata.append('mediaRefKey', imagemediarefkey)
        formdata.append('type', 'IMAGE')
        setImagerefkey(imagemediarefkey)
        const uploadImgData = await uploadImage(formdata)

        console.log(uploadImgData);
        arriamge.push(uploadImgData)
        console.log('out loop');
        console.log(payload);
        payload.media = arriamge
        sendChat(payload)

      }
      // let arriamge = []
      // for (let i = 0; i < event.target.files.length; i++) {

      //   const formdata = new FormData()
      //   formdata.append('sessionId', createdata.sessionId)
      //   formdata.append('file', event.target.files[i])
      //   formdata.append('mediaRefKey', imagemediarefkey)
      //   formdata.append('type', 'IMAGE')
      //   setImagerefkey(imagemediarefkey)
      //   const uploadImgData = await uploadImage(formdata)
      //   console.log(uploadImgData);
      //   arriamge.push(uploadImgData)
      // }
      // console.log('out loop');
      // console.log(payload);
      // payload.media = arriamge
      // sendChat(payload)

      event.target.value = ''
    }


  }
  const numcalcHeight = (widthimage, heightimage) => {
    const calcheight = (heightimage * ((216 * 100) / widthimage)) / 100
    return calcheight

  }
  useEffect(() => {
    if (localStorage.getItem('message')) {
      const msg = JSON.parse(localStorage.getItem('message'))
      let fintitem = msg.filter((item) => item.status === 'SENT' && item.oaId !== "")
      if (fintitem.length > 0) {
        dispatch(setunread(fintitem[0].messageId))
      }
    }
    socket.connect()
    autosize(document.querySelector('textarea'));
    if (topbarDisplay === null || imageofficial === null) {
      fetchData()
    }

    socket.on('connect', () => {
      console.log('connect @@@@@@@@@@@@@@@');
    });
    socket.on('disconnect', async () => {
      console.log('disconnect @@@@@@@@@@@@@@@');
      await unsubEvent();
      socketEvent();
    });
    socket.on('reconnect', () => {
      console.log('reconnect @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    })

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
    socketEvent()
    // console.log(getTimeToUtc());
    const handleTabClose = async event => {
      event.preventDefault();
      localStorage.setItem('timestamp', getTimeToUtc())
      localStorage.setItem('fact', '1')
      await unsubEvent()
      socket.disconnect()
    };
    const openLivechatFromEventStorage = (event) => {
      console.log('event storage from livechat.js');
      console.log(event);
      readMessage()
      console.log(document.querySelector(".unreadmessage"));
      if (document.querySelector(".unreadmessage")) {
        console.log('unreadmessage scroll');
        setTimeout(() => {
          var container = document.querySelector(".testscroll");
          container.scrollTop = document.querySelector(".unreadmessage").offsetTop - 100;
        }, 100);
      } else {
        console.log('scroll to bottommmmmmmmmmmmmmm');
        setTimeout(() => {
          var container = document.querySelector(".testscroll");
          container.scrollTop = container.scrollHeight;
        }, 100);

      }


    }
    window.addEventListener('beforeunload', handleTabClose);
    window.addEventListener('storage', openLivechatFromEventStorage)
    var container = document.querySelector(".testscroll");
    container.scrollTop = container.scrollHeight;
    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
      window.removeEventListener('storage', openLivechatFromEventStorage)
    };
  }, [])

  return (
    <>
      <div className="container">
        <div className="chat-content">
          {
            errorimagetype && <div className="animate-this-element" style={{ width: '100%', position: 'absolute', bottom: '10px' }}>
              <div style={{ width: '294px', background: 'white', margin: 'auto', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>
                <img src={Erroricon} style={{ width: '15px', height: '15px' }} /><span style={{ marginLeft: '10px' }}>{errormessage}</span>
              </div>
            </div>
          }

          <div className="testscroll" style={{ padding: '20px 8px', paddingBottom: '0', height: '100%', overflowY: 'auto' }}>

            {chatMesage.map((item, index) => {

              return < div key={index} id={item.messageId}>
                {firstmessageunread && firstmessageunread === item.messageId && <div className="unreadmessage"><p style={{
                  width: '177px',
                  margin: 'auto',
                  marginBottom: '14px',
                  background: 'red',
                  borderRadius: '10px',
                  textAlign: 'center',
                  padding: '0 16px',
                  background: '#9B9DBE',
                  color: '#ffffff'
                }}>Unread message below</p></div>}
                {item.oaId !== '' ?
                  <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-start', borderRadius: '3px', marginBottom: '12px' }}>
                    <div style={{ width: '20px', height: '20px', marginRight: '3px', backgroundImage: `url(${imageofficial})`, backgroundSize: 'cover', borderRadius: '3px' }}>
                      {/* <img src={Headphone} style={{ width: '100%', height: '100%' }} /> */}
                    </div>
                    {/* <div style={{ width: 0, height: 0, borderStyle: 'solid', borderWidth: '0 5.085px 8.12px 5.085px', borderColor: 'transparent transparent #fff transparent', transform: 'rotate(180deg)' }}></div> */}
                    {
                      item.contentType === 'TEXT' ? <div style={{ width: 0, height: 0, borderStyle: 'solid', borderWidth: '0 5.085px 8.12px 5.085px', borderColor: 'transparent transparent #ffffff transparent', transform: 'rotate(180deg)' }}></div>
                        : ''
                    }
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                      {
                        item.contentType === 'TEXT' ?
                          <div className="reply" style={{ marginLeft: '-7px' }}>{item.content}</div> :
                          item.contentType === 'IMAGE' ? item.media.length === 1 ?
                            <div className="reply" style={{
                              backgroundImage: `url(${Waitimg})`, backgroundSize: 'cover',
                              backgroundPosition: '50% 50%', width: item.media[0].width,
                              minHeight: numcalcHeight(item.media[0].width, item.media[0].height),
                              height: numcalcHeight(item.media[0].width, item.media[0].height),
                              padding: 0,
                            }} >
                              <img src={item.media[0].imageSource !== "" ? item.media[0].imageSource : item.media[0].imgdemo} style={{ width: '100%', height: '100%' }} /></div>
                            :
                            <div className="reply" style={{ display: 'flex', flexWrap: 'wrap', padding: 0, background: 'transparent' }}>{item.media.map((mediadata, index) => {
                              return <div key={index} style={{ flex: '1 1 50%', padding: '1px', height: '100px' }}><img src={mediadata.imageSource !== '' ? mediadata.imageSource : mediadata.imgdemo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                            })}</div> : ''
                      }
                      <div style={{ marginLeft: '4px' }}><span style={{ fontSize: '9px' }}>{getTimeToDisplay(item.createdTime)}</span></div>
                    </div>
                  </div> :
                  <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end', borderRadius: '3px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', marginRight: '-7px' }}>
                      <div style={{ color: '#8D92C4', marginRight: '4px' }}>{
                        item.status === 'SENT' ?
                          <img style={{ width: '10px', height: '7px' }} src={UnreadIcon} /> :
                          item.status === 'READ' ?
                            <img style={{ width: '10px', height: '7px' }} src={ReadIcon} /> : ''
                      } <span style={{ fontSize: '9px' }}>{getTimeToDisplay(item.createdTime)}</span></div>
                      {
                        item.contentType === 'TEXT' ?
                          <div className="send">{item.content}</div> :
                          item.contentType === 'IMAGE' ? item.media.length === 1 ?
                            <div className="send" style={{
                              width: item.media[0].width,
                              minHeight: numcalcHeight(item.media[0].width, item.media[0].height),
                              height: numcalcHeight(item.media[0].width, item.media[0].height),
                              position: 'relative',
                              padding: 0,
                              background: 'transparent',
                              border: '1px solid transparent',
                              borderTopLeftRadius: '5px',
                              borderBottomLeftRadius: '5px',
                              borderBottomRightRadius: '5px',
                              overflow: 'hidden'
                            }} >

                              {item.status === 'WAITING' &&
                                <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
                                  <div style={{
                                    margin: 'auto',
                                    width: '38px',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                  }}><Progress type="circle" width={38} strokeWidth={13} percent={item.media[0].mediaRefKey === imagerefkey ? percenuploadimage : 0} trailColor={'#2a2a54'} strokeColor={'#ffffff'} status="exception" /></div>
                                </div>
                              }
                              <img src={item.media[0].imageSource !== "" ? item.media[0].imageSource : item.media[0].imgdemo} style={{ width: '100%', height: '100%' }} /></div>
                            :
                            <div className="send" style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              padding: 0,
                              background: 'transparent',
                              border: '1px solid transparent',
                              borderTopLeftRadius: '8px',
                              borderBottomLeftRadius: '8px',
                              borderBottomRightRadius: '8px',
                              overflow: 'hidden'
                            }}>{item.media.map((mediadata, index) => {
                              return <div key={index} style={{ flex: '1 1 50%', padding: '1px', height: '100px', position: 'relative' }}>
                                {item.status === 'WAITING' && mediadata.waiting &&
                                  <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
                                    <div style={{
                                      margin: 'auto',
                                      width: '38px',
                                      height: '100%',
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}><Progress type="circle" width={38} strokeWidth={13} percent={mediadata.mediaRefKey === imagerefkey ? percenuploadimage : 0} trailColor={'#2a2a54'} strokeColor={'#ffffff'} status="exception" /></div>
                                  </div>
                                }
                                <img src={mediadata.imageSource !== '' ? mediadata.imageSource : mediadata.imgdemo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                            })}</div>
                            // item.media.map((mediadata) => {
                            //  return <div style={{ display: 'flex' }}>{mediadata}</div>
                            // })
                            : ''
                      }
                    </div>
                    {
                      item.contentType === 'TEXT' ? <div style={{ width: 0, height: 0, borderStyle: 'solid', borderWidth: '0 5.085px 8.12px 5.085px', borderColor: 'transparent transparent #2a2a54 transparent', transform: 'rotate(180deg)' }}></div>
                        : <div style={{ width: 0, height: 0, borderStyle: 'solid', borderWidth: '0 5.085px 8.12px 5.085px', borderColor: 'transparent transparent transparent transparent', transform: 'rotate(180deg)' }}></div>
                    }

                  </div>
                }
              </div>
            })}
          </div>
        </div>
      </div>

      <div className="footer">
        <div className="inputMessage">
          <div className="text-space">
            <textarea
              placeholder="Message"
              value={message}
              onChange={(e) => { setMessage(e.target.value) }}
              onKeyDown={enterChat}
            />
          </div>
          <div className="icon-space">
            <div className="icon-action" onClick={() => { document.getElementById('imageinput').click() }}>
              <img src={Inputimage} />
              <input id="imageinput" type="file" onChange={onChangeFile} accept="image/*" hidden multiple />
            </div>
            <div className="icon-action" onClick={() => {
              console.log(percenuploadimage);
            }}>
              <img src={Emoji} />
            </div>
            <div className="icon-action" onClick={clickChat} >
              <img src={Sendchat} />
            </div>
          </div>
        </div>
        <div className="powerByGoochat">
          <div className="hoverPowered">
            <img src={Powered} />
          </div>
        </div>
      </div>
    </>


  )
}

export default Livechat;