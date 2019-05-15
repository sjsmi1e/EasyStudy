// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection("user_notes").add({
      data: {
        user_id: event.id,
        content:event.content,
        type:event.type,
        fileId:event.fileId,//数组
        head:event.head,
        time:event.time
      }
    })
  } catch (e) {
    console.error(e)
  }
}