// // 云函数入口文件
// const cloud = require('wx-server-sdk')

// cloud.init()

// const db = cloud.database()

// exports.main = async (event, context) => {
//   try {
//     return await db.collection('Express').doc(event.id).update({
//       data: {
//         status:event.status,
//         receivOpenId:event.openid
//       }
//     })
//   } catch (e) {
//     console.error(e)
//   }
// }


// // 云函数入口文件
// const cloud = require('wx-server-sdk')

// cloud.init()


// const db = cloud.database()

// exports.main = async (event, context) => {
//   try {
//     return await db.collection('Express').doc(event.id).update({
//       data: {
//         status: event.status,
//         receivOpenId: event.userInfo.openId // 修改这里
//       }
//     })
//   } catch (e) {
//     console.error(e)
//   }
// }

const cloud = require('wx-server-sdk')

cloud.init({ env: 'kevin-7gityun68d37f64c' })

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    console.log('接收到的参数:', event); // 添加这行
    const result = await db.collection('Express').doc(event.id).update({
      data: {
        status: event.status,
        receivOpenId: event.userInfo.openId
      }
    })
    console.log('更新结果:', result); // 添加这行
    return result;
  } catch (e) {
    console.error(e);
    return e;
  }
}
