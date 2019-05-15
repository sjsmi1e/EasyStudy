// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();
const db = cloud.database();
// 云函数入口函数
exports.main = async(event, context) => {
  try {
    return await db.collection("user_course").add({
      data: {
        user_id: event.id,
        one: [null,null,null,null,null,null,null],
        tow: [null, null, null, null, null, null, null],
        three: [null, null, null, null, null, null, null],
        four: [null, null, null, null, null, null, null],
        five: [null, null, null, null, null, null, null],
        six: [null, null, null, null, null, null, null],
        seven: [null, null, null, null, null, null, null],
        eight: [null, null, null, null, null, null, null]
      }
    })
  } catch (e) {
    console.error(e)
  }
}