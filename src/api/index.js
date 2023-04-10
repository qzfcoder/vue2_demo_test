import request from '@/service/index';

// 测试接口为 http://localhost:3000/banner?type=2
export function accountLoginRequest(account) {
  return request.post({
    url: '/system/dict/data/type/secret_level',
    data: account,
  });
}
