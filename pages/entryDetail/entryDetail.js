var t, e = require("../../@babel/runtime/helpers/interopRequireDefault"),
    a = require("../../@babel/runtime/helpers/toConsumableArray"),
    o = e(require("../../utils/rpx2px.js")),
    n = e(require("../../utils/mixins/pageMixin/myPageMixin")),
    s = getApp(),
    i = require("../../utils/util.js"),
    r = require("../../utils/weapp-qrcode.js"),
    c = (require("../../utils/wxml2canvas"),
        (0, o.default)(500));
// d = {
//     _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
//     encode: function (t) {
//         var e, a, o, n, s, i, r, c = "",
//             l = 0;
//         for (t = d._utf8_encode(t); l < t.length;) n = (e = t.charCodeAt(l++)) >> 2, s = (3 & e) << 4 | (a = t.charCodeAt(l++)) >> 4,
//             i = (15 & a) << 2 | (o = t.charCodeAt(l++)) >> 6, r = 63 & o, isNaN(a) ? i = r = 64 : isNaN(o) && (r = 64),
//             c = c + this._keyStr.charAt(n) + this._keyStr.charAt(s) + this._keyStr.charAt(i) + this._keyStr.charAt(r);
//         return c;
//     },
//     decode: function (t) {
//         var e, a, o, n, s, i, r = "",
//             c = 0;
//         for (t = t.replace(/[^A-Za-z0-9\+\/\=]/g, ""); c < t.length;) e = this._keyStr.indexOf(t.charAt(c++)) << 2 | (n = this._keyStr.indexOf(t.charAt(c++))) >> 4,
//             a = (15 & n) << 4 | (s = this._keyStr.indexOf(t.charAt(c++))) >> 2, o = (3 & s) << 6 | (i = this._keyStr.indexOf(t.charAt(c++))),
//             r += String.fromCharCode(e), 64 != s && (r += String.fromCharCode(a)), 64 != i && (r += String.fromCharCode(o));
//         return r = d._utf8_decode(r);
//     },
//     _utf8_encode: function (t) {
//         var e = "";
//         t = t.replace(/\r\n/g, "\n");
//         for (var a = 0; a < t.length; a++) {
//             var o = t.charCodeAt(a);
//             o < 128 ? e += String.fromCharCode(o) : o > 127 && o < 2048 ? (e += String.fromCharCode(o >> 6 | 192),
//                 e += String.fromCharCode(63 & o | 128)) : (e += String.fromCharCode(o >> 12 | 224),
//                 e += String.fromCharCode(o >> 6 & 63 | 128), e += String.fromCharCode(63 & o | 128));
//         }
//         return e;
//     },
//     _utf8_decode: function (t) {
//         var e, a, o, n = "",
//             s = 0;
//         for (e = a = 0; s < t.length;)(e = t.charCodeAt(s)) < 128 ? (n += String.fromCharCode(e),
//             s++) : e > 191 && e < 224 ? (a = t.charCodeAt(s + 1), n += String.fromCharCode((31 & e) << 6 | 63 & a),
//             s += 2) : (a = t.charCodeAt(s + 1), o = t.charCodeAt(s + 2), n += String.fromCharCode((15 & e) << 12 | (63 & a) << 6 | 63 & o),
//             s += 3);
//         return n;
//     }
// };


let islatitude = ''
const W = wx.getSystemInfoSync().windowWidth;
const rate = 750.0 / W;
// 300rpx 在6s上为 150px
const qrcode_w = 300 / rate;
let JStimeDSQ = ''
let UPDKDD = ""
let lineTime = ''
let plinNull = ""
let App = getApp()
import storage from "../../utils/cache"
import Api from '../../api/index'
import {
    parseTime
} from "../../utils/index.js"
Page({
    mixins: [n.default],
    data: {
        userInfo: App.globalData.userInfo,
        mask: true,
        statusPoup: true,
        createCodeImg: "",
        qrcodeWidth: qrcode_w,
        latitude: 22.510274072389358,
        longitude: 114.52162398098838,
        markers: [],
        statusArr: [],
        statusDWobj: "",
        newpolyline: [{
            points: [],
            width: 3,
            dottedLine: !1,
            arrowLine: !0,
            color: "#4E63A"
        }],
        currentStatus: '',
        altitude: '',
        JStime: "00:00:00",
        gpsState: !0,
        timecostItv: !1,
        foldState: !0,
        satellite: !1,
        startLocstartationUpdateBackground: ''
    },
    // 设置路线
    setPolyline() {
        clearInterval(lineTime)
        let that = this
        lineTime = setInterval(() => {
            let {
                statusDWobj,
                newpolyline
            } = that.data
            let oldList = wx.getStorageSync('polylineLocatoion')
            let points = oldList.concat([statusDWobj])
            console.log(points, "路径123456789")
            console.log(points, 121231231)
            let polylineone = [{
                points: points,
                width: 3,
                dottedLine: !1,
                arrowLine: !0,
                color: "#4E63A9"
            }]
            wx.setStorageSync('polylineLocatoion', points)
            that.setData({
                newpolyline: polylineone
            })
        }, 60000);
    },
    getLine() {
        let that = this
        let {
            statusDWobj,
            newpolyline
        } = that.data
        plinNull = setInterval(() => {
            if (statusDWobj) {
                let oldList = wx.getStorageSync('polylineLocatoion')
                console.log(oldList, 121231231)
                let polylineone = [{
                    points: oldList,
                    width: 3,
                    dottedLine: !1,
                    arrowLine: !0,
                    color: "#4E63A9"
                }]
                wx.setStorageSync('polylineLocatoion', oldList)
                that.setData({
                    newpolyline: polylineone
                })
                clearInterval(plinNull)
            }

        }, 1000);

    },
    onSos() {
        let {
            userInfo,
            statusDWobj
        } = this.data
        wx.showLoading({
            title: '申请中...',
        })
        Api.subSosLog({
            beian_id: userInfo.bean_info.id,
            lat: statusDWobj.latitude,
            lng: statusDWobj.longitude,
        }).then(res => {
            wx.hideLoading()
            wx.showModal({
                title: '申请救援',
                content: '已发送救援申请！请等待'
            })
        })
    },
    showNum(num) {
        if (num < 10) {
            return '0' + num
        }
        return num
    },
    time() {
        let getoldDate = wx.getStorageSync('statTime')
        if (getoldDate) {
            let That = this
            clearInterval(JStimeDSQ)
            JStimeDSQ = setInterval(() => {
                let newDate = +new Date()
                let time = parseInt((newDate - getoldDate) / 1000)
                let s = 0,
                    i = 0,
                    h = 0
                s = That.showNum(time % 60)
                i = That.showNum(parseInt(time / 60) % 60)
                h = That.showNum(parseInt(time / 60 / 60))
                That.setData({
                    // JStime: parseTime(time, "{h}:{i}:{s}")
                    JStime: `${h}:${i}:${s}`
                })
            }, 1000);
            That.upDK()
            That.setPolyline()
        } else {
            this.setData({
                mask: true
            })
        }
    },
    // 上传打卡
    upDK() {
        let that = this
        clearInterval(UPDKDD)
        UPDKDD = setInterval(() => {
            let {
                statusDWobj,
                userInfo
            } = that.data
            Api.subPosition({
                lat: statusDWobj.latitude,
                lng: statusDWobj.longitude,
                beian_id: userInfo["bean_info"]["id"]
            }).then(res => {
                console.log("上传当前位置成功成功", res)
            })
        }, 300000);
    },
    satellite: function () {
        this.setData({
            satellite: !this.data.satellite
        });
    },
    allRoutes: function () {
        var t = require("../../Z.kml.gcj02").route,
            e = [];
        for (var o in t) e.push(t[o]);
        for (var n = 1; n < e.length; n++)
            for (var s = ["A", "B", "C", "D", "E", "F"], i = 0; i < s.length; i++)
                if (t.hasOwnProperty(s[i] + n)) {
                    for (var r = t[s[i] + n].split("/"), c = 0; c < r.length; c++) r[c] = r[c].split(","),
                        r[c] = {
                            latitude: r[c][0],
                            longitude: r[c][1]
                        };
                    that.setData({
                        polyline: [].concat(a(that.data.polyline), [{
                            points: r,
                            width: 3,
                            dottedLine: !1,
                            arrowLine: !0,
                            color: "#FF0000"
                        }])
                    });
                }
    },
    cancel: i.throttle(function (t) {
        var e = this;
        let {
            bean_info
        } = storage.getUserInfo()
        Api.cacheDsLog({
            ...bean_info
        }).then(res => {
            wx.showToast({
                title: '备案已取消',
                icon: 'none',
                mask: true
            })
            setTimeout(() => {
                wx.redirectTo({
                    url: '/pages/index/index',
                })
            }, 1500);
        })

    }, 2e3),
    start: i.throttle(function (t) {
        let newDate = +new Date()
        // if (wx.getStorageSync('state') == 1) {
        //     return
        // }
        let {
            statusDWobj,
            userInfo
        } = this.data
        var e = this;
        Api.startDsLog().then(res => {
            Api.subPosition({
                lat: statusDWobj.latitude,
                lng: statusDWobj.longitude,
                beian_id: userInfo["bean_info"]["id"]
            }).then(res => {
                wx.setStorageSync("state", 1);
                wx.setStorageSync('polylineLocatoion', [statusDWobj])
                clearInterval(JStimeDSQ)
                e.setPolyline()
                wx.setStorageSync('statTime', newDate)
                e.time()
                wx.showToast({
                    title: '开始登山',
                    icon: "none"
                })
                e.setData({
                    mask: true,
                    timecostItv: !0,
                    statusPoup: false
                })
            })
        })
    }, 2e3),
    onjishu() {
        let {
            userInfo
        } = this.data
        wx.showLoading({
            title: '上传中',
        })
        Api.endDsLog().then(res => {
            Api.endDsLog(userInfo.bean_info).then(res => {
                wx.hideLoading()
                wx.showToast({
                    title: '结束登山',
                    mask: true
                })
                setTimeout(() => {
                    wx.redirectTo({
                        url: '/pages/index/index',
                    })
                }, 1500);
                clearInterval(JStimeDSQ)
                clearInterval(UPDKDD)
                clearInterval(lineTime)
                wx.removeStorageSync('statTime')
                wx.removeStorageSync('state')
                wx.offLocationChange((data) => {
                    console.log(data, "结束定位")
                })
            })
        })

    },
    // 获取位置
    // getLocation() {
    //     console.log("获取位置", 99999999999999999999)
    //     wx.onLocationChange((result) => {
    //         console.log("获取位置", result)
    //     })
    // },
    lookCode() {
        console.log(1)
        this.setData({
            mask: true,
            statusPoup: false
        })
    },
    onlookcancel() {
        this.setData({
            mask: false,
            statusPoup: false
        })
    },
    finish: i.throttle(function (t) {
        wx.setStorageSync("state", !1);
        var e = this;
        this.setData({
            gpsState: !1,
            timecostItv: !1
        });
        var a = wx.getStorageSync("gps");
        this.setData({
            polyline: [{
                points: a,
                width: 3,
                dottedLine: !1,
                arrowLine: !0,
                color: "#4E63A9"
            }]
        })
        // ,
        //  wx.login({
        //     success: function (t) {
        //         wx.request({
        //             url: "https://sumou-server.tsunamitek.com/dengshan?code=".concat(t.code, "&cmd=entry.finish"),
        //             method: "POST",
        //             data: {
        //                 entryId: e.data.entryId
        //             },
        //             success: function (t) {
        //                 console.log("entry finish success", t), "request:ok" == t.errMsg && (wx.login({
        //                     success: function (t) {
        //                         wx.request({
        //                             url: "https://sumou-server.tsunamitek.com/dengshan?code=".concat(t.code, "&cmd=entry.detail"),
        //                             method: "POST",
        //                             data: {
        //                                 entryId: e.data.entryId
        //                             },
        //                             success: function (t) {
        //                                 e.setData({
        //                                     detail: t.data.data
        //                                 });
        //                             }
        //                         });
        //                     }
        //                 }), e.setData({
        //                     finish: !0
        //                 }), e.drawapi());
        //             }
        //         });
        //     }
        // });
    }, 2e3),

    fold: i.throttle(function (t) {
        this.setData({
            foldState: !1
        });
    }, 2e3),
    unfold: i.throttle(function (t) {
        this.setData({
            foldState: !0
        });
    }, 2e3),
    // report: i.throttle(function (t) {
    //     var e = this;
    //     wx.login({
    //         success: function (t) {
    //             wx.request({
    //                 url: "https://sumou-server.tsunamitek.com/dengshan?code=".concat(t.code, "&cmd=report.commit"),
    //                 method: "POST",
    //                 data: {
    //                     lat: parseFloat(e.data.currentStatus.latitude).toFixed(6),
    //                     lng: parseFloat(e.data.currentStatus.longitude).toFixed(6),
    //                     entryId: e.data.entryId
    //                 },
    //                 success: function (t) {
    //                     console.log("report.commit successs", t), wx.showToast({
    //                         title: "上报成功",
    //                         icon: "none"
    //                     }), wx.login({
    //                         success: function (t) {
    //                             wx.request({
    //                                 url: "https://sumou-server.tsunamitek.com/dengshan?code=".concat(t.code, "&cmd=squad.report.list"),
    //                                 success: function (t) {
    //                                     console.log("squad.report.list success", t);
    //                                     for (var a = 0; a < t.data.data.length; a++) t.data.data[a].entryId.toString() == e.data.entryId.toString() && (console.log(t.data.data[a]),
    //                                         e.setData({
    //                                             last: {
    //                                                 lastLat: parseFloat(t.data.data[a].lat).toFixed(6),
    //                                                 lastLng: parseFloat(t.data.data[a].lng).toFixed(6),
    //                                                 lastTime: t.data.data[a].createdAt.split("T")[0]
    //                                             }
    //                                         }));
    //                                 }
    //                             });
    //                         }
    //                     });
    //                 }
    //             });
    //         }
    //     }), wx.login({
    //         success: function (t) {
    //             wx.request({
    //                 url: "https://sumou-server.tsunamitek.com/dengshan?code=".concat(t.code, "&cmd=squad.report.list"),
    //                 success: function (t) {
    //                     console.log("report.list success", t);
    //                 }
    //             });
    //         }
    //     });
    // }, 2e3),
    confirmHandler: function (t) {
        var e = t.detail.value;
        this.renderCode(e);
    },
    renderCode: function (e) {
        var a = this;
        t.makeCode(e, function () {
            t.exportImage(function (t) {
                a.setData({
                    text: "",
                    imgsrc: t
                });
            });
        });
    },
    inputHandler: function (t) {
        var e = t.detail.value;
        this.setData({
            text: e
        });
    },
    tapHandler: function () {
        this.renderCode(this.data.text);
    },
    save: function () {
        console.log("save"), wx.showActionSheet({
            itemList: ["保存图片"],
            success: function (e) {
                console.log(e.tapIndex), 0 == e.tapIndex && t.exportImage(function (t) {
                    wx.saveImageToPhotosAlbum({
                        filePath: t
                    });
                });
            }
        });
    },
    close: i.throttle(function (t) {
        wx.navigateBack({
            delta: 0
        });
    }, 2e3),
    // share: i.throttle(function (t) {
    //     var e = this;
    //     wx.canvasToTempFilePath({
    //         x: 0,
    //         y: 0,
    //         width: e.data.canvasWidth,
    //         height: e.data.canvasHeight,
    //         canvasId: "canvas-map",
    //         success: function (t) {
    //             console.log(t.tempFilePath), e.setData({
    //                 canvasImg: t.tempFilePath
    //             });
    //             var a = t.tempFilePath;
    //             wx.saveImageToPhotosAlbum({
    //                 filePath: a,
    //                 success: function (t) {
    //                     wx.showToast({
    //                         title: "保存至相册成功"
    //                     });
    //                 },
    //                 fail: function (t) {}
    //             });
    //         }
    //     });
    // }, 2e3),
    caredCode() {
        let {
            userInfo
        } = this.data
        let that = this
        let t = new r("canvas", {
            // image: "/images/bg.png",
            text: `${+new Date()}${userInfo.idcard}`,
            width: qrcode_w,
            height: qrcode_w,
            colorDark: "#15D36A",
            colorLight: "white",
            correctLevel: r.CorrectLevel.H,
            callback: (res) => {
                // 生成二维码的临时文件
                console.log("生成二维码的临时文件", res.path)
                that.setData({
                    createCodeImg: res.path
                })
            }
        })
    },
    onLoad: function (e) {
        let that = this
        var o = this;
        wx.showLoading({
            title: "加载中..",
        })
        if (wx.getStorageSync("state")) {
            this.setData({
                mask: wx.getStorageSync("state") == 1 ? false : true
            })
        }
        wx.getSetting({
            success: function (res) {
                if (res.authSetting['scope.userLocationBackground']) {} else {
                    wx.navigateBack({
                        delta: 1,
                    })
                }
            }
        });

        wx.startLocationUpdateBackground({
            success: function (t) {
                console.log("授权实时获取定位检测权限", t)
                if ("startLocationUpdateBackground:ok" == t.errMsg) {
                    var e = 0;
                    setInterval(function () {
                        e++;
                    }, 1e3), wx.onLocationChange(function (t) {
                        var n = t;
                        n.latitude = parseFloat(t.latitude).toFixed(6)
                        n.longitude = parseFloat(t.longitude).toFixed(6);
                        wx.hideLoading({
                            success: (res) => {},
                        })

                        that.setData({
                            statusDWobj: n,
                        })
                        wx.setStorageSync('location', t)
                        // clearTimeout(islatitude)
                        // islatitude = setTimeout(() => {
                        //     if (t.latitude) {
                        //         wx.navigateBack({
                        //             delta: 1,
                        //         })
                        //     }
                        // }, 500);
                        return
                        if (console.log(t), e >= 1) {
                            var n = t;
                            n.latitude = parseFloat(t.latitude).toFixed(6), n.longitude = parseFloat(t.longitude).toFixed(6);
                            o.setData({
                                statusArr: [{
                                    latitude,
                                    longitude,
                                    altitude
                                }],
                                currentStatus: n,
                                altitude: t.altitude.toFixed(2)
                            });
                        }

                    });
                } else wx.showModal({
                    showCancel: true,
                    content: "未开启后台位置获取，请点击右上角“…”，进入设置，选择位置消息，勾选按钮“使用小程序期间和离开小程序后”。",
                    success: function (t) {
                        wx.navigateTo({
                            url: '/pages/index/index',
                        })
                        return
                        wx.openSetting({
                            success: function (t) {
                                wx.getSetting({
                                    success: function (t) {
                                        if (console.log(t), 1 == t.authSetting["scope.userLocationBackground"]) {
                                            var e = 0;
                                            setInterval(function () {
                                                e++;
                                            }, 1e3), wx.onLocationChange(function (t) {
                                                var n = t;
                                                n.latitude = parseFloat(t.latitude).toFixed(6), n.longitude = parseFloat(t.longitude).toFixed(6)
                                                that.setData({
                                                    statusDWobj: n
                                                })
                                                wx.setStorageSync('location', t)
                                                return
                                                if (console.log(t), e >= 1) {
                                                    var n = t;
                                                    n.latitude = parseFloat(t.latitude).toFixed(6), n.longitude = parseFloat(t.longitude).toFixed(6),
                                                        o.setData({
                                                            currentStatus: n,
                                                            altitude: t.altitude.toFixed(2)
                                                        });
                                                }

                                            });
                                        } else {
                                            wx.redirectTo({
                                                url: '/pages/index/index',
                                            })
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            },
            fail: function () {
                wx.showModal({
                    showCancel: !0,
                    content: "未开启后台位置获取，请点击右上角“…”，进入设置，选择位置消息，勾选按钮“使用小程序期间和离开小程序后”。",
                    success: function (t) {
                        wx.navigateTo({
                            url: '/pages/index/index',
                        })
                        return
                        wx.openSetting({
                            success: function (t) {
                                wx.getSetting({
                                    success: function (t) {
                                        if (console.log(t), 1 == t.authSetting["scope.userLocationBackground"]) {
                                            wx.showToast({
                                                title: "授权成功",
                                                icon: "none"
                                            }), o.setData({
                                                startLocationUpdateBackground: "#999"
                                            });
                                            var e = 0;
                                            setInterval(function () {
                                                e++;
                                            }, 1e3)
                                            if (e >= 1) {
                                                wx.onLocationChange(function (t) {
                                                    var n = t;
                                                    n.latitude = parseFloat(t.latitude).toFixed(6), n.longitude = parseFloat(t.longitude).toFixed(6)
                                                    that.setData({
                                                        statusDWobj: n
                                                    })
                                                    wx.setStorageSync('location', t)
                                                    return
                                                });
                                            }

                                        } else {
                                            wx.redirectTo({
                                                url: '/pages/index/index',
                                            })
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
        this.toCurrentLocation();
    },
    toDQLocation() {


    },
    toCurrentLocation: i.throttle(function (t) {
        this.mapCtx = wx.createMapContext("myMap"), this.mapCtx.moveToLocation();
        // console.log(   this.mapCtx)
    }, 2e3),
    points: function () {
        var t = this.data.openid;
        if ("oU3jR4t_jCIXVuJ_a8De13TN0oi8" == t || "oU3jR4uzCvHrt-7yGCBsJykcShkU" == t || "hold1" == this.data.openid || "hold2" == this.data.openid) {
            if (wx.getStorageSync("gps")) {
                for (var e, a = wx.getStorageSync("gps"), o = [], n = 0; n < a.length; n++) o[n] = parseFloat(a[n].latitude) - .073545 + "," + (parseFloat(a[n].longitude) + .6418105);
                e = o.join("/"), this.setData({
                    pointsStr: e
                });
            }
        } else if (wx.getStorageSync("gps")) {
            for (var s, i = wx.getStorageSync("gps"), r = [], c = 0; c < i.length; c++) r[c] = i[c].latitude + "," + i[c].longitude;
            s = r.join("/"), console.log(s), this.setData({
                pointsStr: s
            });
        }
    },
    getOpenid: function () {
        var t = s.globalData.sio.openid;
        this.setData({
            openid: t
        });
    },
    onReady: function () {},
    onShow: function () {
        let that = this
        if (storage.getToken()) {
            Api.getUserInfo().then(res => {
                storage.setUserInfo(res)
                that.setData({
                    userInfo: storage.getUserInfo()
                })
                that.caredCode()
                that.time()
            })
        }
        if (wx.getStorageSync('polylineLocatoion')) {
            this.getLine()
        }
    },
    onHide: function () {},
    onUnload: function () {},
    onPullDownRefresh: function () {},
    onReachBottom: function () {},
    onShareAppMessage: function () {}
});