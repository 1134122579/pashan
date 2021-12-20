var e = require("../../@babel/runtime/helpers/interopRequireDefault"), t = require("../../@babel/runtime/helpers/objectSpread2"), a = e(require("../../utils/mixins/pageMixin/myPageMixin")), o = getApp(), s = require("../../utils/util.js");
let App = getApp()
import storage from "../../utils/cache"

Page({
    mixins: [ a.default ],
    data: {
        userInfo:App.globalData.userInfo,
        ensureBloodType: void 0,
        ensureRole: void 0,
        bloodTypeIndex: "0",
        diseaseIndex: "0",
        bloodType: [ "O", "A", "B", "AB", "其他" ],
        disease: !1,
        role: [ "游客", "导游", "本地居民" ],
        roleIndex: "0",
        dList: [ {
            name: "无",
            checked: !1,
            id: 0
        }, {
            name: "高血压",
            checked: !1,
            id: 1
        }, {
            name: "心脏病",
            checked: !1,
            id: 2
        }, {
            name: "糖尿病",
            checked: !1,
            id: 3
        }, {
            name: "哮喘",
            checked: !1,
            id: 4
        }, {
            name: "高血压",
            checked: !1,
            id: 5
        }, {
            name: "其他",
            checked: !1,
            id: 6
        } ],
        cList: [],
        dArr: []
    },
    confirmTestify: s.throttle(function(e) {
        var t = this;
        "set" == this.data.state ? this.data.fullname && this.data.idcard && this.data.ensureRole ? (console.log("fullname", this.data.fullname, "idcard", this.data.idcard, "urgentname", this.data.urgentname, "urgentphone", this.data.urgent, "bloodtype", this.data.ensureBloodType, "disease", this.data.cListStr, "role", this.data.ensureRole), 
        wx.login({
            success: function(e) {
                e.code && wx.request({
                    url: "https://sumou-server.tsunamitek.com/dengshan?code=".concat(e.code, "&cmd=extra.set"),
                    method: "POST",
                    data: {
                        appid: "".concat(o.globalData.appId),
                        code: e.code,
                        fullname: t.data.fullname,
                        idcard: t.data.idcard,
                        emerg_contact: t.data.urgentname,
                        emerg_contact_phone: t.data.urgent,
                        blood_type: "",
                        pathography: "",
                        usertype: t.data.ensureRole
                    },
                    success: function(e) {
                        console.log("extra.set success", e), console.log("app.globalData", o.globalData), 
                        null == o.globalData.detailStuff ? wx.redirectTo({
                            url: "/pages/index/index"
                        }) : o.globalData.detailStuff.myteamid ? wx.redirectTo({
                            url: "/pages/detail/detail?myteamid=".concat(o.globalData.detailStuff.myteamid)
                        }) : wx.redirectTo({
                            url: "/pages/index/index"
                        });
                    }
                });
            }
        })) : this.data.fullname ? this.data.idcard ? this.data.ensureRole || wx.showModal({
            title: "校验失败",
            content: "身份校验错误，请重新选择。"
        }) : wx.showModal({
            title: "校验失败",
            content: "身份证校验错误，请重新输入。"
        }) : wx.showModal({
            title: "校验失败",
            content: "真实姓名校验错误，请重新输入。"
        }) : (this.data.state = "reset") && wx.login({
            success: function(e) {
                e.code && wx.request({
                    url: "https://sumou-server.tsunamitek.com/dengshan?code=".concat(e.code, "&cmd=extra.set"),
                    method: "POST",
                    data: {
                        appid: "".concat(o.globalData.appId),
                        code: e.code,
                        fullname: t.data.fullname,
                        idcard: t.data.idcard,
                        emerg_contact: t.data.urgentname,
                        emerg_contact_phone: t.data.urgent,
                        blood_type: "",
                        pathography: "",
                        usertype: t.data.ensureRole
                    },
                    success: function(e) {
                        console.log("extra.set success"), wx.redirectTo({
                            url: "/pages/index/index"
                        });
                    }
                });
            }
        });
    }, 1e3),
    handleCheckboxChange: function(e) {
        console.log(e);
        for (var t = this.data.dList, a = e.detail.value, o = this.data.cList, s = 0; s < t.length; s++) {
            t[s].checked = !1;
            for (var n = 0; n < a.length; n++) if (t[s].id == a[n]) {
                t[s].checked = !0, o.push(t[s].name);
                for (var d = 0; d < o.length; d++) o[d] != o[d + 1] && o[d] != o[d + 2] && o[d] != o[d + 3] || (o.splice(d, 1), 
                d--);
            }
        }
        this.setData({
            cListStr: this.data.cList.join(","),
            dList: t,
            cList: o
        });
    },
    checkBoxSubmit: function() {
        this.setData({
            disease: !1,
            cListStr: this.data.postD.join()
        });
    },
    checkBoxChange: function(e) {
        if (console.log(e), e.currentTarget.dataset.id) {
            var a = e.currentTarget.dataset.id, o = this.data.dArr;
            this.setData({
                dArr: t(t({}, o), {}, {
                    x: a
                })
            });
        }
    },
    checkboxChange: function(e) {
        for (var t = [], a = [], o = 0; o < e.detail.value.length; o++) {
            var s = e.detail.value[o].split(",");
            t = t.concat(s[0]), a = a.concat(s[1]);
        }
        console.log(a);
        for (var n = [], d = 0; d < a.length; d++) {
            var i = this.data.dList;
            n = n.concat(i[a[d]].name);
        }
        console.log(n);
        for (var l = this.data.dList, c = 0; c < a.length; c++) if ("0" == a[c]) {
            a = [ "0" ], n = [ "无" ];
            for (var r = 1; r < l.length; r++) l[r].checked;
        }
        this.setData({
            postD: n
        });
    },
    idcard: function(e) {
        var t = e.detail.value;
        console.log(t);
        var a = "", o = !0;
        if (t && t.match(/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/)) if ({
            11: "北京",
            12: "天津",
            13: "河北",
            14: "山西",
            15: "内蒙古",
            21: "辽宁",
            22: "吉林",
            23: "黑龙江 ",
            31: "上海",
            32: "江苏",
            33: "浙江",
            34: "安徽",
            35: "福建",
            36: "江西",
            37: "山东",
            41: "河南",
            42: "湖北 ",
            43: "湖南",
            44: "广东",
            45: "广西",
            46: "海南",
            50: "重庆",
            51: "四川",
            52: "贵州",
            53: "云南",
            54: "西藏 ",
            61: "陕西",
            62: "甘肃",
            63: "青海",
            64: "宁夏",
            65: "新疆",
            71: "台湾",
            81: "香港",
            82: "澳门",
            91: "国外 "
        }[t.substr(0, 2)]) {
            if (18 == t.length) {
                t = t.split("");
                for (var s = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ], n = [ 1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2 ], d = 0, i = 0; i < 17; i++) d += t[i] * s[i];
                n[d % 11] != t[17] && (a = "校验位错误", o = !1, wx.showModal({
                    title: "身份证填写错误",
                    content: "校验位错误",
                    showCancel: "false"
                }));
            }
        } else a = "地址编码错误", o = !1, wx.showModal({
            title: "身份证填写错误",
            content: "地址编码错误",
            showCancel: "false"
        }); else a = "身份证号格式错误", o = !1, wx.showModal({
            title: "身份证填写错误",
            content: "身份证号格式错误",
            showCancel: "false"
        });
        return console.log("pass===" + o), o && (this.setData({
            allow_id: !0
        }), wx.setStorageSync("idcard", t), this.setData({
            idcard: t.join("")
        })), o || console.log("tip" + a), o;
    },
    name: function(e) {
        var t = /^((?![\u3000-\u303F])[\u2E80-\uFE4F]|\·)*(?![\u3000-\u303F])[\u2E80-\uFE4F](\·)*$/.test(e.detail.value);
        console.log(t), t ? this.setData({
            fullname: e.detail.value
        }) : wx.showModal({
            title: "校验错误",
            content: "只允许输入汉字,请重新输入"
        });
    },
    urgentname: function(e) {
        /^((?![\u3000-\u303F])[\u2E80-\uFE4F]|\·)*(?![\u3000-\u303F])[\u2E80-\uFE4F](\·)*$/.test(e.detail.value) ? this.setData({
            urgentname: e.detail.value
        }) : wx.showModal({
            title: "校验错误",
            content: "只允许输入汉字,请重新输入"
        });
    },
    urgentphone: function(e) {
        e.detail.value && 0 != e.detail.value.length ? /^1\d{10}$/.test(e.detail.value) ? this.setData({
            urgent: e.detail.value
        }) : (wx.showModal({
            content: "手机号码格式不正确"
        }), this.setData({
            urgent: void 0
        })) : (wx.showModal({
            content: "此处手机号码不能为空"
        }), this.setData({
            urgent: void 0
        }));
    },
    bindPickerBloodType: function(e) {
        this.setData({
            bloodTypeIndex: e.detail.value,
            ensureBloodType: this.data.bloodType[e.detail.value]
        });
    },
    disease: function() {
        this.setData({
            disease: !0
        });
    },
    bindPickerDisease: function(e) {
        console.log(e), this.setData({
            diseaseIndex: e.detail.value,
            ensureDisease: this.data.disease[e.detail.value]
        });
    },
    bindPickerRole: function(e) {
        this.setData({
            roleIndex: e.detail.value,
            ensureRole: this.data.role[e.detail.value]
        });
    },
    onLoad: function(e) {
        var t = this;
        this.setData({
            userinfo: o.globalData.userinfo,
            state: e.state,
            userInfoDataBase: o.globalData.userInfoDataBase
        }), wx.login({
            success: function(e) {
                wx.request({
                    url: "https://sumou-server.tsunamitek.com/dengshan?code=".concat(e.code, "&cmd=extra.has"),
                    method: "POST",
                    success: function(e) {
                        "1" == e.data["extra.has"] && wx.login({
                            success: function(e) {
                                wx.request({
                                    url: "https://sumou-server.tsunamitek.com/dengshan?code=".concat(e.code, "&cmd=extra.get"),
                                    method: "POST",
                                    success: function(e) {
                                        console.log("extra.get success ", e), t.setData({
                                            extraInfo: e.data,
                                            fullname: e.data.fullname,
                                            idcard: e.data.idcard,
                                            urgentname: e.data.emerg_contact,
                                            urgent: e.data.emerg_contact_phone,
                                            ensureBloodType: e.data.blood_type,
                                            cListStr: e.data.pathography,
                                            ensureRole: e.data.usertype
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    },
    onReady: function() {
        this.setData({
            userInfo:storage.getUserInfo()
        })
    },
    onShow: function() {
    
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {
        return {
            path: "/pages/index/index",
            imageUrl: "/images/share.jpg",
            title: "行山易"
        };
    }
});