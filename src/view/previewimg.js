import React, { useEffect } from 'react'
const Previewimg = () => {
  const path = new URLSearchParams(window.location.search).get("path")
  useEffect(() => {
    console.log(path);

  }, [])
  return (
    <div style={{ width: '100vw', height: '100vh', background: 'black' }}>
      <div style={{ display: 'flex', width: '1280px', height: '100%', margin: 'auto', alignItems: 'center', justifyContent: 'center' }}>
        {/* <h1 style={{ color: 'white' }}>Preview image</h1> */}
        <div style={{ maxWidth: '1280px', maxHeight: '1080px', aspectRatio: '16 / 9', textAlign: 'center' }}>
          <img src={path} style={{ height: '100%', width: 'auto' }} />
        </div>
      </div>
    </div>
  )
}

export default Previewimg