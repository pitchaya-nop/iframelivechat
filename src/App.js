import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import PrivateRoute from './route/route'
import Welcome from './view/welcome'
import Livechat from './view/livechat'
import Togglelivechat from './view/togglelivechat'
import Previewimg from './view/previewimg'
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/mode" element={
          <Togglelivechat />
        }
        />
        <Route path="/login" element={
          <Welcome />
        }
        />
        <Route path="/livechat" element={

          <Livechat />
        } />
        <Route path="/preview" element={
          <Previewimg />
        } />
      </Routes>
    </Router>
  );
}

export default App;
