import React, { useEffect } from 'react'
import '../environment/scss/layout.scss';
import Header from './header'
const Layout = ({ children }) => {

  return (
    <>
      <div className="appChat">
        <div className="bodyframe">
          <Header />
          {children}
        </div>
      </div>
    </>
  )
}

export default Layout