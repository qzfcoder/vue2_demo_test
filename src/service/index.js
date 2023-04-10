import ttRequest from './request';
import { BASE_URL, TIME_OUT } from './config';
const Request = new ttRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  interceptors: {
    requestInterceptor: (config) => {
      // const token =
      //   'eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6Ijk2ZjkzNTUzLTY5ZTktNDdmNy1hNjYwLWFjM2M2NzU5ZjQ5NSJ9.dJfpYqsxk5kbkI47h950ymXQ2A0iS2uR5U2UlxH34bw0uIz-wk8yn4jbnjM45VrSxLYr6sWIy231LCTdVWFVpQ';
      // config.headers.Authorization = `Bearer ${token}`;

      console.log('请求成功的拦截', config);
      return config;
    },
    requestInterceptorCatch: (err) => {
      console.log('请求失败的拦截');
      return err;
    },
    responseInterceptor: (res) => {
      console.log('响应成功的拦截');
      return res;
    },
    responseInterceptorCatch: (err) => {
      console.log('响应失败的拦截');
      return err;
    },
  },
});

export default Request;
