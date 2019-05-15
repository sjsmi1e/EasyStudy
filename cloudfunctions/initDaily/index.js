// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection("user_daily").add({
      data: {
        user_id: event.id,
        latest_time:event.latest_time,
        totalDays:event.totalDays
      }
    })
  } catch (e) {
    console.error(e)
  }
}