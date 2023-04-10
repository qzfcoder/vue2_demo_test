let BASE_URL;
const TIME_OUT = 10000;

if (process.env.NODE_ENV === 'development') {
  BASE_URL = 'http://192.168.100.220:9091';
} else if (process.env.NODE_ENV === 'production') {
  BASE_URL = 'http://152.136.185.210:5000';
} else {
  BASE_URL = 'http://152.136.185.210:5000';
}

export { BASE_URL, TIME_OUT };
