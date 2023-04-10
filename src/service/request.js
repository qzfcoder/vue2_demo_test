import axios from 'axios';
class ttRequest {
  constructor(config) {
    this.instance = axios.create(config);
    // 使用拦截器
    // 1.从config中取出的拦截器是对应的实例的拦截器
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch
    );
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch
    );
    // 2.添加所有的实例都有的拦截器
    this.instance.interceptors.request.use(
      (res) => {
        const token =
          'eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6Ijk2ZjkzNTUzLTY5ZTktNDdmNy1hNjYwLWFjM2M2NzU5ZjQ5NSJ9.dJfpYqsxk5kbkI47h950ymXQ2A0iS2uR5U2UlxH34bw0uIz-wk8yn4jbnjM45VrSxLYr6sWIy231LCTdVWFVpQ';
        res.headers.Authorization = `Bearer ${token}`;
        console.log('所有的实例都有的拦截器: 请求成功拦截');
        return res;
      },
      (err) => {
        console.log('所有的实例都有的拦截器: 请求失败拦截');
        return err;
      }
    );

    this.instance.interceptors.response.use(
      (res) => {
        console.log('所有的实例都有的拦截器: 响应成功拦截');
        const data = res.data;
        if (data.returnCode === '-1001') {
          console.log('请求失败~, 错误信息');
        } else {
          return data;
        }
      },
      (err) => {
        console.log('所有的实例都有的拦截器: 响应失败拦截');
        // 将loading移除
        this.loading?.close();

        // 例子: 判断不同的HttpErrorCode显示不同的错误信息
        if (err.response.status === 404) {
          console.log('404的错误~');
        }
        return err;
      }
    );
  }

  request(config) {
    return new Promise((resolve, reject) => {
      // 1.单个请求对请求config的处理
      if (config.interceptors?.requestInterceptor) {
        config = config.interceptors.requestInterceptor(config);
      }

      // 2.判断是否需要显示loading
      if (config.showLoading === false) {
        this.showLoading = config.showLoading;
      }

      this.instance
        .request(config)
        .then((res) => {
          // 1.单个请求对数据的处理
          if (config.interceptors?.responseInterceptor) {
            res = config.interceptors.responseInterceptor(res);
          }
          // 2.将结果resolve返回出去
          resolve(res);
        })
        .catch((err) => {
          reject(err);
          return err;
        });
    });
  }

  get(config) {
    return this.request({ ...config, method: 'GET' });
  }

  post(config) {
    return this.request({ ...config, method: 'POST' });
  }

  delete(config) {
    return this.request({ ...config, method: 'DELETE' });
  }

  patch(config) {
    return this.request({ ...config, method: 'PATCH' });
  }
}
export default ttRequest;
