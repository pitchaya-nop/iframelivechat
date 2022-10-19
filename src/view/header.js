import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setunread } from '../store/chat'
import Closeicon from '../environment/image/close.png'
const Header = () => {
  const dispatch = useDispatch()
  const { topbarDisplay, livechatClassname } = useSelector(state => state.common)
  const closeLivechat = () => {


    let message = JSON.stringify({
      message: 'closelivechat',
      date: Date.now(),
    });
    window.parent.postMessage(message, '*');

  }
  const setFact = () => {
    localStorage.setItem('fact', '1')
    dispatch(setunread(null))
  }
  return (
    <>
      <div className="header">
        {topbarDisplay && <h1>{topbarDisplay}</h1>}
        <div className="close-position">
          <a className="close-icon" style={{ backgroundImage: `url(${Closeicon})` }} onClick={() => { closeLivechat(); setFact() }}>
            {/* <img src={Closeicon} /> */}
          </a>
        </div>
      </div>

    </>

  )
}


export default Header