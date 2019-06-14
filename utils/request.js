
const app = getApp();
//const baseUrl = "https://yps.yikesong.cc";// yikesong.cc正式服
const baseUrl = "https://peter.xiaomiqiu.com/api"; // 小米球测试服
const request = function (createData) {
  return new Promise(function (resolve, reject) {
    let isJsonrequest = false;
    let isPathParams = false;
    //判断json请求
    if (createData.data != undefined) {
      isJsonrequest = true;
    }
    //判断?连接请求
    let params = '?';
    if (createData.params != undefined) {
      isPathParams = true;
      for (var i in createData.params) {
        params += i;
        params += '=';
        params += createData.params[i];
        params += '&';
      }
      //获取最后一个&
      params = params.substring(0,params.length-1);
    }

    //判断头信息
    var headers = {
      Accept: 'application/json',
      Authorization: 'Bearer ' + wx.getStorageSync("third_Session").accessToken
    };
    if (createData.headers != null) {
      headers = createData.headers;
    }
    wx.request({
      url: `${baseUrl + createData.url}`+ (isPathParams?params:''),
      data: JSON.stringify(createData.data),
      header: headers,
      method: createData.method,
      success: function (res) {
        if (res.data.flag) {
          resolve(res.data);
        } else {
          let title;
          if (res.data.code === 2403) { //授权失败
            title = '授权失败';
            // TODO 进行授权操作
          } else {
            title = res.data.msg;
            console.log(res.data)
          }
          wx.showToast({
            title: title,
            icon: 'none',
            duration: 10000,
            mask: false,
            success: function (res) {},
            fail: function (res) {},
            complete: function (res) {},
          })
        }
      },
      fail: function (res) {
        reject(res);
      },
      complete: function (res) {},
    })
  });
}


export default request