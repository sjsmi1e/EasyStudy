// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init();
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  
  try {
    const _ = db.command;
    return await db.collection("user_daily").where({
      user_id: event.id
    })
      .update({
        data: {
          latest_time: event.latest_time,
          totalDays: _.inc(1)     
        },
      })
  } catch (e) {
    console.error(e)
  }
}