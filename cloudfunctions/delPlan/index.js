// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  //const wxContext = cloud.getWXContext()
  var selectDataBase = "";
  if (event.q == 1) {
    //天
    selectDataBase = "user_plan_day";
  } else if (event.q == 2) {
    //周
    selectDataBase = "user_plan_week";
  } else if (event.q == 3) {
    //月
    selectDataBase = "user_plan_month";
  } else {
    selectDataBase = "user_plan_year";
  }
  console.log("id:"+event.id+"q:"+event.q);
  try {
    return await db.collection(selectDataBase).where({
      _id: event.id
    }).remove()
  } catch (e) {
    console.error(e)
  }
}