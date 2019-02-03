function doPost(e) {
  var body = JSON.parse(e.postData.contents);
  if (!checkIsMyMessage(body)){
    return;
  }
 
  if (body.message && body.message.chat){
    body.message.chat.id = body.message.chat.id + '';
  }
 
  var payload = tulinBotPayload(body);
  var payloads;
 
  if (Array.isArray(payload)){
    payloads = payload;
  } else {
    payloads = [payload]
  }
 
  for (var i = 0; i < payloads.length; i++){
    payload = payloads[i];
    if (payload){
      var res = PostTelegram(payload);
    }
  }
 
}
function tulinBotPayload(body) {
  var payload;
  var chatId = body.message.chat.id;
  payload = {
    "method": "sendMessage",
    "chat_id": chatId,
    "text": "",
    "disable_web_page_preview": true,
    "reply_to_message_id": body.message.message_id,
  };
 
  var tulinReq = {
    "reqType": 0,
      "perception": {
          "inputText": {
              // tulinjiqirenbot 改成你自己机器人的名字
              "text": body.message.text.replace("@tulinjiqirenBot", "")
          }
          
      },
      "userInfo": {
        // 改成你自己的图灵机器人的 apikey 和 userId
          "apiKey": "4e8395e7721046e38e9c610de725edd7",
          "userId": "339657"
      }
  };
 
 
  var data = {
    'contentType': 'application/json',
    "method": "post",
    "payload": JSON.stringify(tulinReq)
  };
 
  var response = UrlFetchApp.fetch("http://openapi.tuling123.com/openapi/api/v2", data);
  var res = JSON.parse(response);
 
  if (res.results && res.results[0].values && res.results[0].values.text) {
    payload.text = res.results[0].values.text;
  }
  return payload;
}
function isPrivate(body) {
  var share =  getShareObject(body);
  var chat = share.chat;
  if (chat.type === "private") {
    return true;
  }
  return false;
}
function PostTelegram(payload) {
  var data = {
    'contentType': 'application/json',
    "method": "post",
    "payload": JSON.stringify(payload)
  };
 
  // 改成你自己机器人的 API token
  var response = UrlFetchApp.fetch("https://api.telegram.org/bot750371992:AAGTJC08Gg3g9I-gVm6BkAb30wsMVyQMbUI/", data);
  var res = JSON.parse(response);
  return res;
}
function checkIsMyMessage(body){
  var text = body.message.text;
 
  if (isPrivate(body)){
    return true;
  }
 
  if (body.message.reply_to_message) {
//这里的ＩＤ要改成你自己机器人的ＩＤ， 之前视频里忘讲了
    if (body.message.reply_to_message.from.id == 750371992) {
      return true;
    }
  }
 
// 如果找不到机器人的 ID， 可以用以下这段代码代替， 换成你自己机器人的名字
 // if (body.message.reply_to_message) {
  //  if (body.message.reply_to_message.from.username == "tulinjiqirenBot") {
  //    return true;
  //  }
 // }﻿
 
  if (text) {
    var paras = text.split(" ");
    if (paras[0] && paras[0].indexOf("@") >= 0){
      // tulinjiqirenbot 改成你自己机器人的名字， 全部小写
      if  (paras[0].toLowerCase().indexOf("tulinjiqirenbot") >= 0){
        return true;
      }
      return false;
    }
  }
  return false;
}
 
function getShareObject(body) {
  var payload;
  var from;
  var chat;
  var messageId;
  var callback_query_id;
 
  // use editMessage method instead if it's a callback 
  if (body.callback_query) {
    chat = body.callback_query.message.chat;
    chat.id = chat.id + "";
    messageId = body.callback_query.message.message_id;
    from = body.callback_query.from;
    callback_query_id = body.callback_query.id;
    payload = {
      "method": "editMessageText",
      "chat_id": chat.id,
      "message_id": messageId,
      "text": "",
      "parse_mode": "markdown",
      "disable_web_page_preview": false,
    };
  } else {
    from = body.message.from;
    chat = body.message.chat;
    chat.id = chat.id + "";
    messageId = body.message.message_id;
    payload = {
      "method": "sendMessage",
      "chat_id": chat.id,
      "text": "",
      "parse_mode": "markdown",
      "disable_web_page_preview": true,
      "reply_to_message_id": messageId,
    };
 
  }
 
  var share = {};
  share.payload = payload;
  share.from = from;
  share.chat = chat;
  share.messageId = messageId;
  share.callback_query_id = callback_query_id;
 
  return share;
}
