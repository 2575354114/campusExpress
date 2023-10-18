// 引入 wx-server-sdk 库，用于在云函数中操作云开发资源
const cloud = require('wx-server-sdk')

// 初始化云开发环境
cloud.init({ env: 'kevin-7gityun68d37f64c' })

/**
 * 云函数入口函数
 * 
 * @param {Object} event - 事件参数，包含小程序端传入的数据
 * @param {Object} context - 上下文对象，包括运行环境的信息
 * 
 * @return {Object} - 返回给小程序端的数据，包括事件参数、用户openid、appid、unionid等信息
 */
exports.main = async (event, context) => {
  console.log(event) // 打印事件参数，用于调试
  console.log(context) // 打印上下文信息，用于调试

  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
  const wxContext = cloud.getWXContext()

  // 返回给小程序端的数据
  return {
    event, // 返回事件参数
    openid: wxContext.OPENID, // 返回用户的openid
    appid: wxContext.APPID, // 返回小程序的appid
    unionid: wxContext.UNIONID, // 返回用户的unionid（如果符合获取条件）
    env: wxContext.ENV, // 返回当前云环境ID
  }
}
