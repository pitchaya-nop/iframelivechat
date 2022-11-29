// import React from 'react';
// import { Navigate, useNavigate, useParams } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import Service from '../service/axios'
// import { settopbar } from '../store/common'
// // import Service from '../api/api';
// // import { setuser, setoa } from '../store/user';
// const PrivateRoute = ({ children }) => {
//   // const navigate = useNavigate();
//   const token = new URLSearchParams(window.location.search).get("token")
//   // const dispatch = useDispatch();
//   // const { topbarDisplay } = useSelector((state) => state.common);
//   // const { id } = useParams();

//   // if (topbarDisplay === null && token) {
//   //   Service({
//   //     method: 'post',
//   //     url: '/live-chat/data',
//   //     headers: {
//   //       'Authorization': `Bearer ${token}`
//   //     }
//   //   }).then((res) => {
//   //     dispatch(settopbar(res.data.data.widget.topBar[res.data.data.language]))
//   //   })
//   // }
//   // if (localStorage.getItem('room') && token) {
//   //   navigate('/livechat', { state: localStorage.getItem('room'), token: token })
//   // }
//   // if (!user && localStorage.getItem('token')) {
//   //   Service({
//   //     method: 'post',
//   //     url: '/profile/me',
//   //   }).then((res) => {
//   //     if (res.data.code === '0000') {
//   //       dispatch(setuser(res.data.data.userProfile));
//   //     } else if (res.data.statusCode === '401') {
//   //       localStorage.removeItem('token');
//   //       navigate('/login');
//   //     }
//   //   });
//   // }
//   // if (!accountoa && id) {
//   //   Service({
//   //     method: 'post',
//   //     url: '/official/profile',
//   //     data: {
//   //       id: id,
//   //     },
//   //   })
//   //     .then((res) => {
//   //       if (res.data.code === '0000') {
//   //         dispatch(setoa(res.data.data));
//   //       }
//   //     })
//   //     .catch(function (error) {
//   //       console.log(error);
//   //     });
//   // }
//   return token ? children : <Navigate to="/login" />;
//   // return children
// };

// export default PrivateRoute;
