const fs = require('fs');
const path = require('path');
// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();
// 云函数入口函数
exports.main = async(event, context) => {
  try {
    let imgData = event.data;
    //console.log(imgData);
    var dataBuffer = new Buffer(imgData, 'base64');
    return await cloud.uploadFile({
      cloudPath: event.name,
      fileContent: dataBuffer,
    })
  } catch (e) {
    console.error(e);
  }

}