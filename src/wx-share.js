const wx = require('weixin-js-sdk');
const { location } = window;
const shareLink = location.toString();
const url = encodeURIComponent(shareLink);
/**
 * 微信分享接口 在微信安卓版上表现正常 在IOS上无法正常分享
 * 原因： 安卓端浏览器自动对shareLink进行了encodeURIComponent
 *        IOS端默认不进行此操作 且IOS端会莫名其妙在地址后面加一些键值对
 *        那里面的 & 符号 是需要转义的
 */
const appId = '';
const wxAPI = 'https://weixin.bingyan-tech.hustonline.net/service/resources/signature';
const jsApiList = [
  'onMenuShareAppMessage',
  'onMenuShareTimeline',
  'onMenuShareQQ',
  'onMenuShareWeibo',
  'onMenuShareQZone'
];
/**
 * 
 * @param {Object} shareConfig
 * @param {string} shareConfig.title
 * @param {string} shareConfig.desc
 * @param {string} shareConfig.link
 * @param {string} shareConfig.desc
 * @param {function} shareConfig.success
 * @param {function} shareConfig.cancel
 */
function share(shareConfig) {
  const staticShareConfig = {
    title: '',
    desc: '',
    link: '',
    imgUrl: '',
    success() {},
    cancle() {}
  };
  const conf = Object.assign(staticShareConfig, shareConfig);
  return fetch(`${wxAPI}?url=${url}`).then((res) => res.json()).then((data) => {
    const config = {
      debug: false,
      appId: data.appId || data.appid || appId,
      timestamp: data.timestamp,
      nonceStr: data.nonce_str || data.noncestr,
      signature: data.signature,
      jsApiList: [...jsApiList],
      success() {},
      cancel() {}
    };
    wx.config(config); 
    wx.ready(() => {
      jsApiList.forEach((item) => {
        if (item === 'onMenuShareTimeline') {
          wx.onMenuShareTimeline(conf);
          return;
        }
        const wxApi = wx[item];
        if (typeof wxApi === 'function') {
          wxApi(conf);
        } else {
          console.warn(`${item} api not exist!!!`);
        }
      });
    });
  });
}
module.exports = share;
