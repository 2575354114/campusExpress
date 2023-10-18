const cloud = require('wx-server-sdk');
cloud.init({ env: 'kevin-7gityun68d37f64c' })

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  try {
    const receivOpenId = event.receivOpenId;

    // 使用 receivOpenId 查询匹配的 Users 数据
    const usersRes = await db.collection('Users').where({
      openid: receivOpenId,
    }).get();

    if (usersRes.data.length > 0) {
      const user = usersRes.data[0];
      return {
        nickName: user.Nickname,
        phoneNumber: user.phoneNumber,
      };
    } else {
      return {
        nickName: null,
        phoneNumber: null,
      };
    }
  } catch (err) {
    console.error(err);
    return {
      code: 500,
      errMsg: '云函数调用失败',
    };
  }
};
