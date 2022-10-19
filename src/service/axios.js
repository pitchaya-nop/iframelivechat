import axios from 'axios';
import { v4 as uuid_v4 } from "uuid";

const fetchClient = () => {
  const defaultOptions = {
    baseURL: `${process.env.REACT_APP_API_URL}`,
    headers: {
      'Device-Id': uuid_v4(),
      'Platform': 'web',
      'Accept-Language': 'en',

    },
  };

  // Create instance
  let instance = axios.create(defaultOptions);

  // Set the AUTH token for any request
  // instance.interceptors.request.use(function (config) {
  //   const token = localStorage.getItem('token');
  //   config.headers.Authorization = token ? `Bearer ${token}` : '';
  //   return config;
  // });

  return instance;
};

export default fetchClient();
