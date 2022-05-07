// val:String 要校验的值
// regex:RegExp 校验正则,不是正则时val作为result的值
// msg:String 校验不通过的错误信息
function valid(val, regex, msg) {
  return {
    result: regex instanceof RegExp ? regex.test(val) : !!val,
    errMsg: msg,
  };
}
// 校验规则列表（可扩展）
const rules = {
  URL(url) {
    const regex =
      /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?"\\+&%$#=~_-]+))*$/;
    return valid(url, regex, 'URL格式不正确');
  },

  LowerCase(str) {
    const regex = /^[a-z]+$/;
    return valid(str, regex, '只能输入小写字母');
  },

  UpperCase(str) {
    const regex = /^[A-Z]+$/;
    return valid(str, regex, '只能输入大写字母');
  },

  Alphabets(str) {
    const regex = /^[A-Za-z]+$/;
    return valid(str, regex, '只能输入字母');
  },

  // Email(email) {
  //   const regex =
  //     /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //   return valid(email, regex, '邮箱地址格式不正确');
  // },

  Phone(phone) {
    const regex =
      /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
    return valid(phone, regex, '请填写正确的手机号格式');
  },
  // // 身份证
  // IdCard(idCard) {
  //   const regex =
  //     /(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)/;
  //   return valid(idCard, regex, '请填写正确的身份证号格式');
  // },
  // 密码验证
  Password(Password) {
    // const regex = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)([^\u4e00-\u9fa5\s]){6,20}$/
    const regex = /^[A-Za-z0-9]{6,20}$/;
    return valid(
      Password,
      regex,
      '请输入6-20位英文字母、数字或者符号（除空格）'
    );
  },
  Postcode(postcode) {
    const regex = /^[0-9][0-9]{5}$/;
    return valid(postcode, regex, '邮编格式不正确');
  },

  Number(num) {
    const regex = /^\d+$/;
    return valid(num, regex, '只能输入纯数字');
  },

  Fax(fax) {
    const regex = /^(\d{3,4}-)?\d{7,8}$/;
    return valid(fax, regex, '传真格式不正确');
  },

  Int(num) {
    const regex = /^((0)|([1-9]\d*))$/;
    return valid(num, regex, '只能输入非负整数');
  },

  IntPlus(num) {
    const regex = /^[1-9]\d*$/;
    return valid(num, regex, '只能输入正整数');
  },
  // auditType(str) {},

  IdCard(code) {
    const regex =
      /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    return valid(code, regex, '请输入正确的身份证号码');
  },

  MobileOrPhone(val) {
    const result = /^1\d{10}$/.test(val) || /^(0\d{2,3})?-?\d{7,8}$/.test(val);
    return valid(result, null, '手机或电话号格式不正确');
  },
  test(code) {
    const regex = /[2]/;
    return valid(code.length, regex, '请上传图片信息');
  },
  test1(code) {
    const regex = /[1]/;
    return valid(code.length, regex, '请上传图片信息');
  },
  any(code) {
    const regex = /\d/;
    return valid(code.length, regex, '请上传图片信息');
  },
};

// required:Boolean 是否必填项，选填，默认"true"
// types:String/Function 校验类型，选填，
// String时必须是上面rules中存在的函数名，
// Function时只接收一个参数(输入值)，返回格式： {result:Boolean, errMsg:String}
// trigger:String 触发动作，选填，默认"blur"
// nullMsg:String 未输入的提示语，选填，required=true时有效
export default function vxRule(
  required = true,
  types,
  trigger = 'blur',
  nullMsg = '该字段为必填项',
  type = 'string'
) {
  const rule = { required: !!required, trigger };
  let check = null;
  if (typeof types === 'function') {
    check = types;
  } else {
    check = types ? rules[types + ''] : null;
  }
  if (check) {
    // 存在规则时添加规则
    rule.validator = (r, v, c) => {
      const { result, errMsg } = check(v);
      if (required) {
        // 必填项: null,undefined,"","  " 都算无输入内容
        // return (v == null || (v + "").trim() === "") ? c(new Error(nullMsg)) : result ? c() : c(new Error(errMsg))
        return v == null || (v + '').trim() === ''
          ? Promise.reject(new Error(nullMsg))
          : result
          ? Promise.resolve()
          : Promise.reject(new Error(errMsg));
      }
      // 选填项: null,undefined,"" 都算无输入内容，"  "会被校验
      // return (v == null || (v + "") === "" || result) ? c() : c(new Error(errMsg))
      return v == null || v + '' === '' || result
        ? Promise.resolve()
        : Promise.reject(new Error(errMsg));
    };
  } else {
    rule.message = nullMsg;
  }
  rule.type = type;
  return [rule];
}
