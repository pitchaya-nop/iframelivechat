import React, { useEffect, useState } from 'react'
import autosize from 'autosize';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { setchat, setunread } from '../store/chat'
import { setimagedisplay, settopbar } from '../store/common'
import { Progress, Popover } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import EmojiPicker, { Categories } from "emoji-picker-react";
import Linkify from 'react-linkify';

import Defaultoa from '../environment/image/defaultOa.png'
import Powered from '../environment/image/Powered.png';
import Inputimage from '../environment/image/inputimage.png';
import Emojiimg from '../environment/image/emoji.png';
import Sendchat from '../environment/image/sendchat.png';
import UnreadIcon from '../environment/image/unreadicon.png';
import ReadIcon from '../environment/image/readicon.png';
import Erroricon from '../environment/image/errorIcon.png';
import Waitimg from '../environment/image/waitimg.png'

import io from 'socket.io-client';
import Service from '../service/axios'
import { v4 as uuid_v4 } from "uuid";
import moment from 'moment'
import Previewimg from '../view/previewimg';

const socket = io('https://' + process.env.REACT_APP_SOCKET + '.apigochat.com:443', {
  path: "/socket/socket.io",
  transports: ['websocket'],
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity

});

const Livechat = () => {
  const { chatMesage, firstmessageunread } = useSelector((state) => state.chat)
  const { topbarDisplay, imageofficial } = useSelector((state) => state.common)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation();
  const [offline, setOffline] = useState(false)
  const [message, setMessage] = useState('')
  const [errorimagetype, setErrorimagetype] = useState(false)
  const [errormessage, setErrormessage] = useState('')
  const [imagerefkey, setImagerefkey] = useState(null)
  const [percenuploadimage, setPercenuploadimage] = useState(0)
  const [indexupload, setIndexupload] = useState(null)
  const [failedresendimage, setFailedresendimage] = useState([])
  const [pathuploadresend, setPathuploadresend] = useState([])
  const [open, setOpen] = useState(false)
  const createdata = location.state.room
  const token = location.state.room.token

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
  const getDateUtcDisplay = (value) => {
    var stillUtc = moment.utc(value).toDate();
    return moment(stillUtc).local().format("DD/MM");
  }
  const checkDisplaytime = (value) => {
    if (value === moment(new Date()).format("DD/MM")) {
      return 'Today'
    } else if (value === moment().subtract(1, 'days').format("DD/MM")) {
      return 'Yesterday'
    } else {
      return value
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
      // setCreatedata(localStorage.getItem(`room:${res.data.data.oaId}`) ? JSON.parse(localStorage.getItem(`room:${res.data.data.oaId}`)) : location.state.room)
      // setToken(localStorage.getItem(`token:${res.data.data.oaId}`) ? localStorage.getItem(`token:${res.data.data.oaId}`) : location.state.token)
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
        createdTimedisplay: getDateUtcDisplay(getTimeToUtc()),
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
        updatedTime: "",
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
  const updateRead = (data) => {
    // data.data.lastMsgReadTime, data.data.sessionId
    const getmsg = localStorage.getItem('message') ? JSON.parse(localStorage.getItem('message')) : []
    for (let i = 0; i < getmsg.length; i++) {
      console.log(getmsg[i].createdTime <= data.lastMsgReadTime);
      console.log(getmsg[i].status === 'SENT');
      console.log(getmsg[i].sessionId === data.sessionId);
      if (getmsg[i].createdTime <= data.lastMsgReadTime && getmsg[i].status === 'SENT' && getmsg[i].sessionId === data.sessionId) {
        getmsg[i].status = 'READ'
      }
    }
    // getmsg.filter((msg) => {
    //   if (msg.createdTime <= data.lastMsgReadTime && msg.status === 'SENT' && msg.sessionId === data.sessionId) {
    //     msg.status = 'READ'
    //   }
    // })
    // console.log('new item @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    // console.log(newitem);
    // getmsg.map((msg) => {
    //   // console.log('sessionid');
    //   // console.log(msg.sessionId);
    //   // console.log(data.sessionId);
    //   // console.log('time');
    //   // console.log(msg.createdTime);
    //   // console.log(data.lastMsgReadTime);
    //   // console.log('status');
    //   // console.log(msg.status);
    //   // console.log(msg.createdTime <= data.lastMsgReadTime);
    //   // console.log(msg.status === 'SENT');
    //   // console.log(msg.sessionId === data.sessionId);
    //   if ((msg.createdTime <= data.lastMsgReadTime) && (msg.status === 'SENT') && (msg.sessionId === data.sessionId)) {
    //     console.log('Update readdddddddd@@@@@@@@@@@@@@@@@@');
    //     console.log(data.sessionId);
    //     console.log(data.lastMsgReadTime);
    //     console.log(msg);
    //     msg.status = 'READ'
    //   }

    // })
    // console.log(getmsg);
    // setTimeout(() => {
    localStorage.setItem('message', JSON.stringify(getmsg))
    dispatch(setchat(getmsg))
    // }, 100);

  }
  const updateMessage = (msgdata) => {
    const getmsg = localStorage.getItem('message') ? JSON.parse(localStorage.getItem('message')) : []
    // console.log(msgdata);
    msgdata.messages.map((item, index) => {

      item.sessionId = msgdata.sessionId
      item.id = msgdata.id
      item.createdTimedisplay = getDateUtcDisplay(msgdata.createdTime)
      // console.log(item);
      const indexmsg = getmsg.findIndex(dummy => dummy.referenceKey === item.referenceKey && dummy.status === 'WAITING')
      console.log(indexmsg);
      if (indexmsg === -1) {
        var container = document.querySelector(".testscroll");
        console.log('message length' + getmsg.length);
        if (getmsg.length > 199) {
          getmsg.shift()
        }
        getmsg.push(item)
        dispatch(setchat(getmsg))
        localStorage.setItem('message', JSON.stringify(getmsg))
        console.log((container.scrollTop + container.clientHeight) - container.scrollHeight);
        console.log(item);
        if (((container.scrollTop + container.clientHeight) - container.scrollHeight) < 1 && ((container.scrollTop + container.clientHeight) - container.scrollHeight) >= -10) {
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
          getmsg[indexmsg].createdTimedisplay = getDateUtcDisplay(item.createdTime)
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
          getmsg[indexmsg].createdTimedisplay = getDateUtcDisplay(item.createdTime)
          getmsg[indexmsg].cancelMessage = item.cancelMessage
          getmsg[indexmsg].strangerMessage = item.strangerMessage
          getmsg[indexmsg].blockMessage = item.blockMessage
          getmsg[indexmsg].status = item.status
          getmsg[indexmsg].destructTime = item.destructTime
          getmsg[indexmsg].disappearTime = item.disappearTime
          getmsg[indexmsg].updatedTime = item.updatedTime
          getmsg[indexmsg].media = item.media

        }
        if (getmsg.length > 199) {
          getmsg.shift()
        }

        if (indexmsg !== getmsg.length) {
          getmsg.push(getmsg[indexmsg])
          getmsg.splice(indexmsg, 1);
          localStorage.setItem('message', JSON.stringify(getmsg))
          dispatch(setchat(getmsg))
        } else {
          dispatch(setchat(getmsg))
          localStorage.setItem('message', JSON.stringify(getmsg))
        }


      }

    })

  }
  const sendChat = (payload) => {
    console.log('send chat');
    console.log(payload);
    setOpen(false)
    Service({
      method: 'post',
      url: '/live-chat/room/send',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: payload
    }).then((res) => {
      if (res.data.code !== '0000') {
        if (payload.contentType === 'IMAGE') {
          pathuploadresend.push({ referenceKey: payload.referenceKey, path: payload.media })
        }
        // payload.referenceKey
        console.log('failed');
        const getmsg = localStorage.getItem('message') ? JSON.parse(localStorage.getItem('message')) : []
        getmsg.find(dummy => {
          if (dummy.referenceKey === payload.referenceKey) {
            dummy.status = 'FAILED'
          }
        })
        dispatch(setchat(getmsg))
        localStorage.setItem('message', JSON.stringify(getmsg))
      }
      // else {
      //   const getmsg = localStorage.getItem('message') ? JSON.parse(localStorage.getItem('message')) : []
      //   console.log(payload.referenceKey);
      //   const index = getmsg.findIndex(dummy => dummy.referenceKey === payload.referenceKey)
      //   console.log('success');
      //   console.log(index);
      //   if (index !== -1) {
      //     getmsg.splice(index, 1);
      //     dispatch(setchat(getmsg))
      //     localStorage.setItem('message', JSON.stringify(getmsg))
      //   }
      // }
    })

  }
  const resendFailedmsg = async (resendmsg) => {
    if (resendmsg.status === 'FAILED') {
      if (resendmsg.contentType === 'TEXT') {
        const payload = {
          sessionId: createdata.sessionId,
          referenceKey: resendmsg.referenceKey,
          contentType: "TEXT",
          content: resendmsg.content,
          destructTime: 0,
          guestId: createdata.guest.guestId,
          guestUniqueName: createdata.guest.guestUniqueName
        };
        const getmsg = localStorage.getItem('message') ? JSON.parse(localStorage.getItem('message')) : []
        const indexmsg = getmsg.findIndex(dummy => dummy.referenceKey === resendmsg.referenceKey)
        getmsg[indexmsg].status = 'WAITING'
        dispatch(setchat(getmsg))
        localStorage.setItem('message', JSON.stringify(getmsg))
        sendChat(payload)
      } else if (resendmsg.contentType === 'IMAGE') {
        console.log(resendmsg);
        const payload = {
          sessionId: createdata.sessionId,
          referenceKey: resendmsg.referenceKey,
          contentType: "IMAGE",
          content: "",
          destructTime: 0,
          guestId: createdata.guest.guestId,
          guestUniqueName: createdata.guest.guestUniqueName,
        };
        if (resendmsg.media.length > 1) {

        } else {
          // const imagemediarefkey = uuid_v4()
          // console.log(resendmsg.media[0]['mediaRefKey']);
          const index = failedresendimage.findIndex(data => data.referenceKey === resendmsg.referenceKey)
          const indexpath = pathuploadresend.findIndex(data => data.referenceKey === resendmsg.referenceKey)
          if (indexpath !== -1) {
            const getmsg = localStorage.getItem('message') ? JSON.parse(localStorage.getItem('message')) : []
            const indexmsg = getmsg.findIndex(dummy => dummy.referenceKey === resendmsg.referenceKey)
            getmsg[indexmsg].status = 'WAITING'
            dispatch(setchat(getmsg))
            localStorage.setItem('message', JSON.stringify(getmsg))
            payload.media = pathuploadresend[indexpath].path
            sendChat(payload)
          }
          if (index !== -1) {
            const getmsg = localStorage.getItem('message') ? JSON.parse(localStorage.getItem('message')) : []
            const indexmsg = getmsg.findIndex(dummy => dummy.referenceKey === resendmsg.referenceKey)
            getmsg[indexmsg].status = 'WAITING'
            dispatch(setchat(getmsg))
            localStorage.setItem('message', JSON.stringify(getmsg))
            let arriamge = []
            const formdata = new FormData()
            formdata.append('sessionId', createdata.sessionId)
            formdata.append('file', failedresendimage[index].files)
            formdata.append('mediaRefKey', resendmsg.media[0]['mediaRefKey'])
            formdata.append('type', 'IMAGE')
            setImagerefkey(resendmsg.media[0]['mediaRefKey'])
            const uploadImgData = await uploadImage(formdata)
            console.log(uploadImgData);
            if (uploadImgData === 'failed') {
              const getmsg = localStorage.getItem('message') ? JSON.parse(localStorage.getItem('message')) : []
              getmsg.find(dummy => {
                if (dummy.referenceKey === payload.referenceKey) {
                  dummy.status = 'FAILED'
                }
              })
              dispatch(setchat(getmsg))
              localStorage.setItem('message', JSON.stringify(getmsg))
            } else {
              console.log(uploadImgData);
              arriamge.push(uploadImgData)
              console.log('out loop');
              console.log(payload);
              payload.media = arriamge
              sendChat(payload)
            }
          }
        }



      }

    }
  }
  const previewImage = (path, item) => {
    if (item.status !== 'FAILED' && item.status !== 'WAITING') {
      // window.open(`/preview?path=${path}`, '_blank')
      window.open(`${path}`, '_blank')
    }

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
  const addMessageComback = (msgdata) => {
    for (let i = 0; i < msgdata.length; i++) {
      for (let j = 0; j < msgdata[i].messages.length; j++) {
        const getmsg = localStorage.getItem('message') ? JSON.parse(localStorage.getItem('message')) : []
        const indexmsg = getmsg.findIndex(dummy => dummy.referenceKey === msgdata[i].messages[j].referenceKey)
        if (getmsg.length > 199) {
          getmsg.shift()
        }
        if (indexmsg === -1) {
          var container = document.querySelector(".testscroll");
          getmsg.push(msgdata[i].messages[j])
          dispatch(setchat(getmsg))
          localStorage.setItem('message', JSON.stringify(getmsg))
          console.log((container.scrollTop + container.clientHeight) - container.scrollHeight);
          if (((container.scrollTop + container.clientHeight) - container.scrollHeight) < 1 && ((container.scrollTop + container.clientHeight) - container.scrollHeight) >= 0) {
            scrollbottom()
          }
        }
      }
    }
  }
  const socketEvent = () => {
    socket.emit(`messages`, `{"sessionId":"${createdata.sessionId}","synctime":"${createdata.timestamp}","isGuest":"${true}","guestId":"${createdata.guest.guestId}","oaToken":"Bearer ${token}"}`)

    socket.on(`messages:${createdata.sessionId}`, (data) => {
      if (data.data !== null) {
        addMessageComback(data.data)
      }
    })


    socket.emit(`join:room`, `{"sessionId":"${createdata.sessionId}","userId":"${createdata.guest.guestId}","isGuest":"true"}`)
    socket.on(`messages:update:${createdata.sessionId}`, async (data) => {
      console.log('message update @@@@@@@@@@');
      await updateMessage(data.data[0])
      const getroom = JSON.parse(localStorage.getItem('room'))
      const index = getroom.findIndex((data) => data.sessionId === createdata.sessionId)
      if (getroom[index].fact === '1') {
        let count = 0
        const msg = JSON.parse(localStorage.getItem('message'))
        let fintitem = msg.filter((item) => item.status === 'SENT' && item.oaId !== "")
        dispatch(setunread(fintitem[0].messageId))
        for (let i = 0; i < msg.length; i++) {
          if (msg[i].status === 'SENT') {
            count += 1
          }
        }
        // localStorage.setItem('count', count)
        getroom[index].count = count
        localStorage.setItem('room', JSON.stringify(getroom))

      } else if (getroom[index].fact === '0') {
        readMessage()
      }
    })
    socket.on(`messages:read:${createdata.sessionId}`, (data) => {
      //read data
      console.log('read message @@@@@@@@@@@@@@@@@@@@@@');
      console.log(data);
      const getroom = JSON.parse(localStorage.getItem('room'))
      const index = getroom.findIndex((data) => data.sessionId === data.data.sessionId)
      if (index === -1) {
        if (data.data.lastMsgReadTime !== '') {
          updateRead(data.data)
        }
      }
    })

    socket.emit(`messages:read:fetch`, `{"userId":"${createdata.guest.guestId}","msgUnreadTime":"${createdata.timestamp}","sessionId":"${createdata.sessionId}","isGuest":"true"}`)
    socket.on(`messages:read:fetch:${createdata.guest.guestId}`, (data) => {
      // last read
      console.log('read fetch');
      console.log(data);
      if (data.data.lastMsgReadTime !== '') {
        updateRead(data.data)
      }
    })
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
          console.log(progress);
          setPercenuploadimage(progress)

        },
      }).then((res) => {
        if (res.data.code === '0000') {
          setPercenuploadimage(0)
          setImagerefkey(null)
          resolve(res.data.data)
        }
        else {
          setImagerefkey(null)
          setPercenuploadimage(0)
          resolve('failed')
        }
        // console.log(payload);

      }).catch((err) => {
        setImagerefkey(null)
        setPercenuploadimage(0)
        resolve('failed')

      })
    })
  }
  const onChangeFile = async (event) => {
    if (event.target.files.length) {
      for (let i = 0; i < event.target.files.length; i++) {
        if (event.target.files[i].size > (10 * 1024 * 1024)) {
          setErrorimagetype(true)
          setErrormessage('You can only send up to 10MB of file at a time.')
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
            // fileresend: event.target.files[i]
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
          setIndexupload(i)
          setImagerefkey(payload.media[i].mediaRefKey)
          const uploadImgData = await uploadImage(formdata)

          arriamge.push(uploadImgData)
        }
        console.log('out loop');
        console.log(payload);
        payload.media = arriamge

        console.log('multiple dummy');
        console.log(payload);
        console.log(arriamge);
        setIndexupload(null)
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
            imgdemo: dimensions.src,
          })
        } else {
          console.log('case2');
          console.log(event.target.files[0]);
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
        formdata.append('guestId', createdata.guest.guestId)
        formdata.append('type', 'IMAGE')
        setImagerefkey(imagemediarefkey)
        console.log(formdata);

        const uploadImgData = await uploadImage(formdata)
        if (uploadImgData === 'failed') {
          failedresendimage.push({ referenceKey: payload.referenceKey, files: event.target.files[0] })
          const getmsg = localStorage.getItem('message') ? JSON.parse(localStorage.getItem('message')) : []
          getmsg.find(dummy => {
            if (dummy.referenceKey === payload.referenceKey) {
              dummy.status = 'FAILED'
            }
          })
          dispatch(setchat(getmsg))
          localStorage.setItem('message', JSON.stringify(getmsg))
        } else {
          console.log(uploadImgData);
          arriamge.push(uploadImgData)
          console.log('out loop');
          console.log(payload);
          payload.media = arriamge
          sendChat(payload)
        }


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
  const checkonline = (event) => {
    if (event.type === 'offline') {
      setOffline(true)

    } else if (event.type === 'online')
      setOffline(false)
  }
  const onClickemoji = (event) => {
    console.log(event);
    typeInTextarea(document.getElementById('inputmessage'), event.emoji)
  }
  const typeInTextarea = (el, newText) => {
    var start = el.selectionStart
    var end = el.selectionEnd
    var text = el.value
    var before = text.substring(0, start)
    var after = text.substring(end, text.length)
    el.value = before + newText + after
    el.selectionStart = el.selectionEnd = start + newText.length
    el.focus()
    setMessage(el.value)
    return false
  }
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };
  useEffect(() => {
    fetchData()
    // const caldatafunction = async () => {
    //   let res = await Service({ method: 'post', url: '/live-chat/data', headers: { 'Authorization': `Bearer ${token}` } })
    //   console.log(res);
    //   if (res.data.code === '0000') {
    //     const getroom = localStorage.getItem('room') ? JSON.parse(localStorage.getItem('room')) : []
    //     const index = getroom.findIndex((data) => data.oaId === res.data.data.oaId)
    //     if (index !== -1) {
    //       createdata = getroom[index]
    //     }
    //     dispatch(settopbar(res.data.data.widget.topBar[res.data.data.language]))
    //     dispatch(setimagedisplay(res.data.data.avatars.source))
    //   }
    // }
    // caldatafunction()

    if (localStorage.getItem('message')) {

      const msg = JSON.parse(localStorage.getItem('message'))
      let fintitem = msg.filter((item) => item.status === 'SENT' && item.oaId !== "")
      if (fintitem.length > 0) {
        dispatch(setunread(fintitem[0].messageId))
      }

      let arr = msg.filter(dummy => dummy.status !== 'FAILED')

      dispatch(setchat(arr))
      localStorage.setItem('message', JSON.stringify(arr))
    }


    socket.connect()
    autosize(document.querySelector('textarea'));




    socket.on('connect', () => {
      console.log('connect @@@@@@@@@@@@@@@');
      console.log(socket);
      socketEvent();
    });
    socket.on('disconnect', async () => {
      console.log('disconnect @@@@@@@@@@@@@@@');
      await unsubEvent();

    });
    socket.on('reconnect', () => {
      console.log('reconnect @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    })

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
    // socketEvent()
    const handleTabClose = async event => {
      event.preventDefault();
      const getroom = JSON.parse(localStorage.getItem('room'))
      const index = getroom.findIndex((data) => data.sessionId === createdata.sessionId)
      if (index !== -1) {
        getroom[index].timestamp = getTimeToUtc()
        getroom[index].fact = '1'
        localStorage.setItem('room', JSON.stringify(getroom))
      }
      // localStorage.setItem('timestamp', getTimeToUtc())
      // localStorage.removeItem(`token:${createdata.oaId}`)
      // localStorage.setItem('fact', '1')
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
        setTimeout(() => {
          var container = document.querySelector(".testscroll");
          container.scrollTop = container.scrollHeight;
        }, 100);

      }


    }

    window.addEventListener('beforeunload', handleTabClose);
    window.addEventListener('storage', openLivechatFromEventStorage)
    window.addEventListener('online', checkonline);
    window.addEventListener('offline', checkonline);
    var container = document.querySelector(".testscroll");
    container.scrollTop = container.scrollHeight;
    return () => {
      socket.removeAllListeners();
      socket.disconnect()
      window.removeEventListener('beforeunload', handleTabClose);
      window.removeEventListener('storage', openLivechatFromEventStorage)
      window.removeEventListener('online', checkonline);
      window.removeEventListener('offline', checkonline);

    };
  }, [])

  return (
    <>
      {
        createdata && chatMesage ?
          <><div className="container">
            <div className="chat-content">
              {
                errorimagetype && <div className="animate-this-element" style={{ width: '100%', position: 'absolute', bottom: '10px', zIndex: '1000000' }}>
                  <div style={{ width: '294px', background: 'white', margin: 'auto', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>
                    <img src={Erroricon} style={{ width: '15px', height: '15px' }} /><span style={{ marginLeft: '10px' }}>{errormessage}</span>
                  </div>
                </div>
              }
              {
                offline && <div style={{ width: '100%', position: 'absolute', bottom: '10px', zIndex: '1000000' }}>
                  <div style={{ width: '294px', background: 'white', margin: 'auto', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>
                    <img src={Erroricon} style={{ width: '15px', height: '15px' }} /><span style={{ marginLeft: '10px' }}>No Internet.</span>
                  </div>
                </div>
              }

              <div className="testscroll" style={{ padding: '20px 8px', paddingBottom: '0', height: '100%', overflowY: 'auto' }}>

                {chatMesage.map((data, index) => {

                  return <div key={index}>{createdata.sessionId === data.session &&
                    <div >
                      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '12px', backgroundColor: '#9B9DBE', color: '#ffffff', padding: '2px 7px', borderRadius: '10px' }}>{checkDisplaytime(data.field)}</span>
                      </div>
                      {
                        data.groupList && data.groupList.map((item, index) => {
                          return <div key={index} id={item.messageId}>

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
                                <div style={{ width: '20px', height: '20px', marginRight: '3px', backgroundImage: `url(${imageofficial ? imageofficial : Defaultoa})`, backgroundSize: 'cover', borderRadius: '3px' }}>
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
                                      <div className="reply" style={{ marginLeft: '-7px' }}>
                                        <Linkify
                                          componentDecorator={(decoratedHref, decoratedText, key) => (
                                            <a target="blank" href={decoratedHref} key={key} style={{ textDecoration: 'underline' }}>
                                              {decoratedText}
                                            </a>
                                          )}
                                        >{item.content}</Linkify>
                                      </div> :
                                      item.contentType === 'IMAGE' ? item.media.length === 1 ?
                                        <div className="reply"
                                          onClick={() => {
                                            previewImage(item.media[0].imageSource, item)
                                          }}
                                          style={{
                                            width: item.media[0].width === item.media[0].height && item.media[0].width < 216 ? 216 : item.media[0].width,
                                            backgroundImage: `url(${Waitimg})`, backgroundSize: 'cover',
                                            backgroundPosition: '50% 50%',
                                            minHeight: numcalcHeight(item.media[0].width, item.media[0].height),
                                            height: numcalcHeight(item.media[0].width, item.media[0].height),
                                            padding: 0,
                                            cursor: 'pointer'
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
                              <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end', borderRadius: '3px', marginBottom: '12px' }} >
                                <div style={{ display: 'flex', alignItems: 'flex-end', marginRight: '-7px' }}>
                                  <div style={{ color: '#8D92C4', marginRight: '4px' }}>{
                                    item.status === 'SENT' ?
                                      <img style={{ width: '11px', height: '9px' }} src={UnreadIcon} /> :
                                      item.status === 'READ' ?
                                        <img style={{ width: '13px', height: '9px' }} src={ReadIcon} /> :
                                        item.status === 'FAILED' ? <img onClick={() => { resendFailedmsg(item) }} style={{ width: '10px', height: '10px' }} src={Erroricon} /> :
                                          item.status === 'WAITING' ? <LoadingOutlined style={{ fontSize: '11px' }} /> : ''
                                  }
                                    {item.status !== 'FAILED' ? <span style={{ fontSize: '9px', marginLeft: '2px' }}>{getTimeToDisplay(item.createdTime)}</span> : ''}</div>
                                  {
                                    item.contentType === 'TEXT' ?
                                      <div className="send">

                                        <Linkify
                                          componentDecorator={(decoratedHref, decoratedText, key) => (
                                            <a target="blank" href={decoratedHref} key={key} style={{ textDecoration: 'underline' }}>
                                              {decoratedText}
                                            </a>
                                          )}
                                        >{item.content}</Linkify>
                                        {/* <Linkify
                                          component='button'
                                          properties={{ target: '_blank', style: { color: 'red', fontWeight: 'bold' } }}
                                        >
                                          {item.content}
                                        </Linkify> */}
                                      </div> :
                                      item.contentType === 'IMAGE' ? item.media.length === 1 ?
                                        <div className="send"
                                          onClick={() => {

                                            previewImage(item.media[0].imageSource, item)
                                          }}
                                          style={{
                                            width: item.media[0].width === item.media[0].height && item.media[0].width < 216 ? 216 : item.media[0].width,
                                            cursor: item.status !== 'FAILED' ? 'pointer' : '',
                                            minHeight: numcalcHeight(item.media[0].width, item.media[0].height),
                                            height: numcalcHeight(item.media[0].width, item.media[0].height),
                                            backgroundImage: `url(${Waitimg})`, backgroundSize: 'cover',
                                            backgroundPosition: '50% 50%',
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
                                              {
                                                item.media[0].mediaRefKey === imagerefkey &&
                                                <div style={{
                                                  margin: 'auto',
                                                  width: '38px',
                                                  height: '100%',
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                }}><Progress type="circle" width={38} strokeWidth={13} percent={item.media[0].mediaRefKey === imagerefkey ? percenuploadimage : 0} trailColor={'#2a2a54'} strokeColor={'#ffffff'} status="exception" showInfo={false} /></div>
                                              }

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
                                          return <div
                                            onClick={() => {
                                              previewImage(mediadata.imageSource, item)
                                            }}
                                            key={index} style={{ flex: '1 1 50%', padding: '1px', height: '100px', position: 'relative', cursor: item.status !== 'FAILED' ? 'pointer' : '' }}>
                                            {item.status === 'WAITING' && indexupload != null && !(indexupload > index) &&
                                              <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
                                                <div style={{
                                                  margin: 'auto',
                                                  width: '38px',
                                                  height: '100%',
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                }}><Progress type="circle" width={38} strokeWidth={13} percent={mediadata.mediaRefKey === imagerefkey ? percenuploadimage : 0} trailColor={'#2a2a54'} strokeColor={'#ffffff'} status="exception" showInfo={false} /></div>
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
                        })
                      }
                    </div>
                  }</div>

                })}
              </div>
            </div>
          </div>

            <div className="footer" style={{ background: offline && 'rgba(211, 211, 211, 0.5)' }}>
              <div className="inputMessage">
                <div className="text-space">
                  <textarea
                    id="inputmessage"
                    placeholder="Message..."
                    value={message}
                    onChange={(e) => { setMessage(e.target.value) }}
                    onKeyDown={enterChat}
                    disabled={offline}
                  />
                </div>
                <div className="icon-space" style={{ overflowX: 'hidden' }}>
                  <div className="icon-action" onClick={() => { if (offline === false) { document.getElementById('imageinput').click() } }}>
                    <img src={Inputimage} />
                    <input id="imageinput" type="file" onChange={onChangeFile} accept="image/*" hidden multiple />
                  </div>
                  <div className="icon-action" >

                    <Popover
                      content={
                        <div style={{ width: '250px', height: '250px' }}>
                          {
                            open === true && <EmojiPicker
                              style={{ borderColor: 'transparent' }}
                              onEmojiClick={onClickemoji}
                              autoFocusSearch={false}
                              width="100%"
                              height="100%"
                              lazyLoadEmojis={true}
                              searchDisabled={true}
                              previewConfig={{
                                showPreview: false
                              }}
                              categories={[
                                {
                                  name: "Smiles & Emotions",
                                  category: Categories.SMILEYS_PEOPLE
                                },
                                {
                                  name: "Flags",
                                  category: Categories.FLAGS
                                },
                                {
                                  name: 'Animals & nature',
                                  category: Categories.ANIMALS_NATURE
                                },
                                {
                                  name: 'Travel & places',
                                  category: Categories.TRAVEL_PLACES
                                },
                                {
                                  name: 'Symbols',
                                  category: Categories.SYMBOLS
                                }
                              ]}

                            />
                          }
                        </div>
                      }
                      placement="topRight"
                      // placement="topLeft"
                      trigger="click"
                      open={open}
                      onOpenChange={handleOpenChange}
                    >

                      {/* <h1>open pop</h1> */}
                      <img src={Emojiimg} />
                    </Popover>
                  </div>
                  <div className="icon-action" style={{ opacity: message === '' ? '0.5' : '1', cursor: message === '' ? 'no-drop' : 'pointer' }} onClick={() => { if (offline === false) { clickChat() } }} >
                    <img src={Sendchat} />
                  </div>
                </div>
              </div>
              <div className="powerByGoochat" style={{ background: offline && 'rgba(211, 211, 211, 0.5)' }}>
                <div className="hoverPowered" style={{ overflowX: 'hidden' }}>
                  <img src={Powered} />
                </div>
              </div>
            </div></> : ''
      }
    </>


  )
}

export default Livechat;