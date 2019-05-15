// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init();
const db = cloud.database();
// 云函数入口函数
exports.main = async(event, context) => {
  try {
    return await db.collection("user_course").where({
        user_id: event.id
      })
      .update({
        data: {
          one: event.rest.data[0].one,
          two: event.rest.data[0].two,
          three: event.rest.data[0].three,
          four: event.rest.data[0].four,
          five: event.rest.data[0].five,
          six: event.rest.data[0].six,
          seven: event.rest.data[0].seven,
          eight: event.rest.data[0].eight
        },
      })
  } catch (e) {
    console.error(e)
  }
}