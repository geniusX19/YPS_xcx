const formatTime = date => {
  console.log("===:"+date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()  
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//切换密码可见性
function switchEye(that, eye, showpass) {
  var showpass = !that.data.showpass;
  var eye = !that.data.eye;
  that.setData({
    showpass: showpass,
    eye: eye
  })
}
//获取输入的邮箱
function getEmail(that, email) {
  that.setData({
    email: email
  })
}
//获取输入的密码
function getPassWord(that, password) {
  console.log(password)
  that.setData({
    password: password
  })
}
function close(that) {
  that.setData({
    logShow: false
  })
}

function distance(la1, lo1, la2, lo2) {
  var La1 = la1 * Math.PI / 180.0; 
  var La2 = la2 * Math.PI / 180.0; 
  var La3 = La1 - La2; 
  var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0; 
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2))); 
  s = s * 6378.137;//地球半径    
  s = Math.round(s * 10000) / 10000;      
  return s  
}

/*
 * 时间戳转换为yyyy-MM-dd hh:mm:ss 格式  formatDate()
 * inputTime   时间戳
 * flag  返回时间格式标识
 */
function formatDate(inputTime,flag) {
  var date = new Date(inputTime);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  if(flag == 'all'){
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
  }else{
    return y + '-' + m + '-' + d;
  }
}

function formatDuring(mss) {
  var days = parseInt(mss / (1000 * 60 * 60 * 24));
  var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = (mss % (1000 * 60)) / 1000;
  return days + "天" + hours + "小时" + minutes + "分";
}

// 把方法暴露出来供别的页面使用
module.exports = {
  switchEye: switchEye,
  getPassWord: getPassWord,
  getEmail: getEmail,
  close: close,
  formatTime: formatTime,
  formatDate:formatDate,
  formatDuring:formatDuring,
  distance: distance
}

