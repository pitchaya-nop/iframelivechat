
import React, { useEffect } from 'react'
import autosize from 'autosize';
import './environment/scss/layout.scss';
import Powered from './environment/image/Powered.png';
import Inputimage from './environment/image/inputimage.png';
import Emoji from './environment/image/emoji.png'
import Sendchat from './environment/image/sendchat.png'
const App = () => {
  const style = {
    maxHeight: "75px",
    minHeight: "38px",
    resize: "none",
    padding: "9px",
    boxSizing: "border-box",
    fontSize: "15px"
  };


  const handleKeyDown = (e) => {
    // Reset field height
    console.log(e);
    e.target.style.height = 'inherit';

    // Get the computed styles for the element
    const computed = window.getComputedStyle(e.target);

    const height = e.target.scrollHeight
    // Calculate the height
    // const height = parseInt(computed.getPropertyValue('border-top-width'), 10)
    //   + parseInt(computed.getPropertyValue('padding-top'), 10)
    //   + e.target.scrollHeight
    //   + parseInt(computed.getPropertyValue('padding-bottom'), 10)
    //   + parseInt(computed.getPropertyValue('border-bottom-width'), 10);

    e.target.style.height = `${height}px`;
  }
  useEffect(() => {
    autosize(document.querySelector('textarea'));
  }, [])
  return (
    <div className="appChat">
      <div className="bodyframe">
        <div className="header">
          <h1>Chat Now</h1>
        </div>
        <div className="container">
          <span>
            body
        </span>
        </div>
        <div className="footer">
          <div className="inputMessage">
            <div className="text-space">
              <textarea
                // style={style}
                placeholder="Message"
              />
            </div>
            <div className="icon-space">
              <div className="icon-action">
                <img src={Inputimage} />
              </div>
              <div className="icon-action">
                <img src={Emoji} />
              </div>
              <div className="icon-action">
                <img src={Sendchat} />
              </div>
            </div>
          </div>
          <div className="powerByGoochat">
            <img src={Powered} />
          </div>
        </div>
      </div>


    </div>
  );
}

export default App;
