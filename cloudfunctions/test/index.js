// 云函数入口文件
const cloud = require('wx-server-sdk')

const fs = require('fs');
const got = require('got');

got('todomvc.com')
  .then(response => {
    console.log(response.body);
    //=> '<!doctype html> ...'
  })
  .catch(error => {
    console.log(error.response.body);
    //=> 'Internal server error ...'
  });

// Streams
got.stream('todomvc.com').pipe(fs.createWriteStream('index.html'));

// For POST, PUT and PATCH methods got.stream returns a WritableStream
fs.createReadStream('index.html').pipe(got.stream.post('todomvc.com'));


cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  //const wxContext = cloud.getWXContext()
  try {
    return await db.collection("test").add({
      data: {
        data:event.data
      }
    })
  } catch (e) {
    console.error(e)
  }
}