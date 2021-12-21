/*
 * @Author: your name
 * @Date: 2021-06-28 11:36:37
 * @LastEditTime: 2021-06-30 14:01:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \answer\api\index.js
 */
import fly from "../utils/instance";
export default {
  // 登录获取登录token
  wx_mini_login(params) {
    return fly({
      url: `wx_mini_login`,
      method: "post",
      params,
      isThree: false,
    });
  },
  getUserInfo(params) {
    return fly({
      url: `getUserInfo`,
      method: "get",
      params,
      isThree: false,
    });
  },
  ckeckToken(params) {
    return fly({
      url: `checkToken`,
      method: "post",
      params,
      isThree: false,
    });
  },
  wxlogin(params) {
    return fly({
      url: `wxlogin`,
      method: "post",
      params,
      isThree: false,
    });
  },
  editUserInfo(params) {
    return fly({
      url: `editUserInfo`,
      method: "post",
      params,
      isThree: false,
    });
  },
  encrypt_info(params) {
    return fly({
      url: `encrypt_info`,
      method: "post",
      params,
      isThree: false,
    });
  },
  editDsLog(params) {
    return fly({
      url: `editDsLog`,
      method: "post",
      params,
      isThree: false,
    });
  },
  subDsLog(params) {
    return fly({
      url: `subDsLog`,
      method: "post",
      params,
      isThree: false,
    });
  },
  getDsRk(params) {
    return fly({
      url: `getDsRk`,
      method: "get",
      params,
      isThree: false,
    });
  },
  editDsLog(params) {
    return fly({
      url: `editDsLog`,
      method: "post",
      params,
      isThree: false,
    });
  },
  getDsCount(params) {
    return fly({
      url: `getDsCount`,
      method: "get",
      params,
      isThree: false,
    });
  },
  cacheDsLog(params) {
    return fly({
      url: `cacheDsLog`,
      method: "post",
      params,
      isThree: false,
    });
  },
  subPosition(params) {
    return fly({
      url: `subPosition`,
      method: "post",
      params,
      isThree: false,
    });
  },
};