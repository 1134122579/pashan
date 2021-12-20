var t, e = require("../../@babel/runtime/helpers/interopRequireDefault"), a = require("../../@babel/runtime/helpers/toConsumableArray"), o = e(require("../../utils/rpx2px.js")), n = e(require("../../utils/mixins/pageMixin/myPageMixin")), s = getApp(), i = require("../../utils/util.js"), r = require("../../utils/weapp-qrcode.js"), c = (require("../../utils/wxml2canvas"), 
(0, o.default)(500)), d = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function(t) {
        var e, a, o, n, s, i, r, c = "", l = 0;
        for (t = d._utf8_encode(t); l < t.length; ) n = (e = t.charCodeAt(l++)) >> 2, s = (3 & e) << 4 | (a = t.charCodeAt(l++)) >> 4, 
        i = (15 & a) << 2 | (o = t.charCodeAt(l++)) >> 6, r = 63 & o, isNaN(a) ? i = r = 64 : isNaN(o) && (r = 64), 
        c = c + this._keyStr.charAt(n) + this._keyStr.charAt(s) + this._keyStr.charAt(i) + this._keyStr.charAt(r);
        return c;
    },
    decode: function(t) {
        var e, a, o, n, s, i, r = "", c = 0;
        for (t = t.replace(/[^A-Za-z0-9\+\/\=]/g, ""); c < t.length; ) e = this._keyStr.indexOf(t.charAt(c++)) << 2 | (n = this._keyStr.indexOf(t.charAt(c++))) >> 4, 
        a = (15 & n) << 4 | (s = this._keyStr.indexOf(t.charAt(c++))) >> 2, o = (3 & s) << 6 | (i = this._keyStr.indexOf(t.charAt(c++))), 
        r += String.fromCharCode(e), 64 != s && (r += String.fromCharCode(a)), 64 != i && (r += String.fromCharCode(o));
        return r = d._utf8_decode(r);
    },
    _utf8_encode: function(t) {
        var e = "";
        t = t.replace(/\r\n/g, "\n");
        for (var a = 0; a < t.length; a++) {
            var o = t.charCodeAt(a);
            o < 128 ? e += String.fromCharCode(o) : o > 127 && o < 2048 ? (e += String.fromCharCode(o >> 6 | 192), 
            e += String.fromCharCode(63 & o | 128)) : (e += String.fromCharCode(o >> 12 | 224), 
            e += String.fromCharCode(o >> 6 & 63 | 128), e += String.fromCharCode(63 & o | 128));
        }
        return e;
    },
    _utf8_decode: function(t) {
        var e, a, o, n = "", s = 0;
        for (e = a = 0; s < t.length; ) (e = t.charCodeAt(s)) < 128 ? (n += String.fromCharCode(e), 
        s++) : e > 191 && e < 224 ? (a = t.charCodeAt(s + 1), n += String.fromCharCode((31 & e) << 6 | 63 & a), 
        s += 2) : (a = t.charCodeAt(s + 1), o = t.charCodeAt(s + 2), n += String.fromCharCode((15 & e) << 12 | (63 & a) << 6 | 63 & o), 
        s += 3);
        return n;
    }
};

Page({
    mixins: [ n.default ],
    data: {
        mask: !0,
        qrcodeWidth: c,
        latitude: 22.510274072389358,
        longitude: 114.52162398098838,
        markers: [],
        gpsState: !0,
        timecostItv: !1,
        foldState: !0,
        satellite: !1
    },
    satellite: function() {
        this.setData({
            satellite: !this.data.satellite
        });
    },
    allRoutes: function() {
        var t = require("../../Z.kml.gcj02").route, e = [];
        for (var o in t) e.push(t[o]);
        for (var n = 1; n < e.length; n++) for (var s = [ "A", "B", "C", "D", "E", "F" ], i = 0; i < s.length; i++) if (t.hasOwnProperty(s[i] + n)) {
            for (var r = t[s[i] + n].split("/"), c = 0; c < r.length; c++) r[c] = r[c].split(","), 
            r[c] = {
                latitude: r[c][0],
                longitude: r[c][1]
            };
            that.setData({
                polyline: [].concat(a(that.data.polyline), [ {
                    points: r,
                    width: 3,
                    dottedLine: !1,
                    arrowLine: !0,
                    color: "#4E63A9"
                } ])
            });
        }
    },
    cancel: i.throttle(function(t) {
        var e = this;
        wx.login({
            success: function(t) {
                wx.request({
                    url: "https://sumou-server.tsunamitek.com/dengshan?code=".concat(t.code, "&cmd=entry.cancel"),
                    method: "POST",
                    data: {
                        entryId: e.data.entryId
                    },
                    success: function(t) {
                        console.log("entry.cancel", t), "已备案队员全部或部分已开始 - 不得取消备案，只能结束" != t.data.err ? wx.navigateBack({
                            delta: 0
                        }) : wx.showModal({
                            showCancel: !1,
                            title: "无法取消备案",
                            content: "已备案队员全部或部分已开始，不得取消备案。"
                        });
                    }
                });
            }
        });
    }, 2e3),
    start: i.throttle(function(t) {
        wx.setStorageSync("state", !0);
        var e = this;
        this.setData({
            mask: !1,
            timecostItv: !0
        }), wx.login({
            success: function(t) {
                wx.request({
                    url: "https://sumou-server.tsunamitek.com/dengshan?code=".concat(t.code, "&cmd=entry.start"),
                    method: "POST",
                    data: {
                        entryId: e.data.entryId.toString()
                    },
                    success: function(t) {
                        wx.removeStorageSync("gps"), console.log("entry.start success", t), e.timecost();
                    }
                });
            }
        });
    }, 2e3),
    finish: i.throttle(function(t) {
        wx.setStorageSync("state", !1);
        var e = this;
        this.setData({
            gpsState: !1,
            timecostItv: !1
        });
        var a = wx.getStorageSync("gps");
        this.setData({
            polyline: [ {
                points: a,
                width: 3,
                dottedLine: !1,
                arrowLine: !0,
                color: "#4E63A9"
            } ]
        }), wx.login({
            success: function(t) {
                wx.request({
                    url: "https://sumou-server.tsunamitek.com/dengshan?code=".concat(t.code, "&cmd=entry.finish"),
                    method: "POST",
                    data: {
                        entryId: e.data.entryId
                    },
                    success: function(t) {
                        console.log("entry finish success", t), "request:ok" == t.errMsg && (wx.login({
                            success: function(t) {
                                wx.request({
                                    url: "https://sumou-server.tsunamitek.com/dengshan?code=".concat(t.code, "&cmd=entry.detail"),
                                    method: "POST",
                                    data: {
                                        entryId: e.data.entryId
                                    },
                                    success: function(t) {
                                        e.setData({
                                            detail: t.data.data
                                        });
                                    }
                                });
                            }
                        }), e.setData({
                            finish: !0
                        }), e.drawapi());
                    }
                });
            }
        });
    }, 2e3),
    drawapi: function() {
        var t = this;
        this.points(), wx.login({
            success: function(e) {
                var a, o;
                t.data.pointsStr && (a = t.data.pointsStr), t.data.entryId && (o = t.data.entryId), 
                wx.request({
                    url: "https://sumou-server.tsunamitek.com/dengshan?code=".concat(e.code, "&cmd=map.draw"),
                    method: "POST",
                    responseType: "arraybuffer",
                    data: {
                        entryId: o,
                        points: a
                    },
                    success: function(e) {
                        console.log("map.draw success ", e);
                        var a = "data:image/png;base64, " + wx.arrayBufferToBase64(e.data);
                        t.send_code(a);
                        t.setData({
                            routeImage: "data:image/png;base64, " + wx.arrayBufferToBase64(e.data)
                        }), wx.getImageInfo({
                            src: "".concat(t.data.codeimg),
                            success: function(e) {
                                console.log(e.path), t.setData({
                                    path: e.path
                                });
                            }
                        });
                    }
                });
            }
        });
    },
    fold: i.throttle(function(t) {
        this.setData({
            foldState: !1
        });
    }, 2e3),
    unfold: i.throttle(function(t) {
        this.setData({
            foldState: !0
        });
    }, 2e3),
    report: i.throttle(function(t) {
        var e = this;
        wx.login({
            success: function(t) {
                wx.request({
                    url: "https://sumou-server.tsunamitek.com/dengshan?code=".concat(t.code, "&cmd=report.commit"),
                    method: "POST",
                    data: {
                        lat: parseFloat(e.data.currentStatus.latitude).toFixed(6),
                        lng: parseFloat(e.data.currentStatus.longitude).toFixed(6),
                        entryId: e.data.entryId
                    },
                    success: function(t) {
                        console.log("report.commit successs", t), wx.showToast({
                            title: "上报成功",
                            icon: "none"
                        }), wx.login({
                            success: function(t) {
                                wx.request({
                                    url: "https://sumou-server.tsunamitek.com/dengshan?code=".concat(t.code, "&cmd=squad.report.list"),
                                    success: function(t) {
                                        console.log("squad.report.list success", t);
                                        for (var a = 0; a < t.data.data.length; a++) t.data.data[a].entryId.toString() == e.data.entryId.toString() && (console.log(t.data.data[a]), 
                                        e.setData({
                                            last: {
                                                lastLat: parseFloat(t.data.data[a].lat).toFixed(6),
                                                lastLng: parseFloat(t.data.data[a].lng).toFixed(6),
                                                lastTime: t.data.data[a].createdAt.split("T")[0]
                                            }
                                        }));
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }), wx.login({
            success: function(t) {
                wx.request({
                    url: "https://sumou-server.tsunamitek.com/dengshan?code=".concat(t.code, "&cmd=squad.report.list"),
                    success: function(t) {
                        console.log("report.list success", t);
                    }
                });
            }
        });
    }, 2e3),
    confirmHandler: function(t) {
        var e = t.detail.value;
        this.renderCode(e);
    },
    renderCode: function(e) {
        var a = this;
        t.makeCode(e, function() {
            t.exportImage(function(t) {
                a.setData({
                    text: "",
                    imgsrc: t
                });
            });
        });
    },
    inputHandler: function(t) {
        var e = t.detail.value;
        this.setData({
            text: e
        });
    },
    tapHandler: function() {
        this.renderCode(this.data.text);
    },
    save: function() {
        console.log("save"), wx.showActionSheet({
            itemList: [ "保存图片" ],
            success: function(e) {
                console.log(e.tapIndex), 0 == e.tapIndex && t.exportImage(function(t) {
                    wx.saveImageToPhotosAlbum({
                        filePath: t
                    });
                });
            }
        });
    },
    timecost: function() {
        var t = this;
        wx.login({
            success: function(e) {
                wx.request({
                    url: "https://sumou-server.tsunamitek.com/dengshan?code=".concat(e.code, "&cmd=entry.detail"),
                    method: "POST",
                    data: {
                        entryId: t.data.entryId
                    },
                    success: function(e) {
                        console.log("entry.detail success", e), "0" == e.data.data.condition && wx.setStorageSync("state", !0);
                        var o = e.data.data.time.split("T")[0].split("-")[1], n = e.data.data.time.split("T")[0].split("-")[2];
                        if (t.setData({
                            detail: e.data.data,
                            month: o,
                            day: n
                        }), t.data.detail) {
                            var s = t.data.detail;
                            if ("10" == s.condition || "20" == s.condition) {
                                var i = s.startedAt.split("T")[1].split("Z")[0].split(":"), r = s.endAt.split("T")[1].split("Z")[0].split(":"), c = r[0] - i[0], d = r[1] - i[1], l = r[2] - i[2] + 4;
                                l < 0 && (d -= 1, l += 60), d < 0 && (c -= 1, d += 60), l >= 0 && l < 10 && (l = "0" + l.toString()), 
                                d >= 0 && d < 10 && (d = "0" + d.toString()), c >= 0 && c < 10 && (c = "0" + c.toString()), 
                                t.setData({
                                    h: c.toString(),
                                    m: d.toString(),
                                    s: l.toString()
                                });
                            } else if ("0" == s.condition) {
                                var u = new Date(), g = s.startedAt.split("T")[1].split("Z")[0].split(":"), h = u.getHours(), p = u.getMinutes(), f = u.getSeconds(), m = h - g[0], w = p - g[1], S = f - g[2];
                                S < 0 && (w -= 1, S += 60), w < 0 && (m -= 1, w += 60), m < 0 && (S = 0, w = 0, 
                                m = 0);
                                setInterval(function() {
                                    1 == t.data.timecostItv && (++S >= 60 && (S = 0, w = parseInt(w) + 1), w >= 60 && (w = 0, 
                                    m = parseInt(m) + 1), S >= 0 && S < 10 && (S = "0" + S.toString()), w >= 0 && w < 10 && (2 == w.length || (w = "0" + w.toString())), 
                                    m >= 0 && m < 10 && (2 == m.length || (m = "0" + m)), t.setData({
                                        h: m.toString(),
                                        m: w.toString(),
                                        s: S.toString()
                                    }));
                                }, 1e3);
                            }
                        }
                        if (e.data.data.entry) {
                            var v = require("../../Z.kml.gcj02").route, x = {
                                "七星湾至桔钓沙": {
                                    entry: [ "七星湾登山口", "桔钓沙登山口" ],
                                    route: "F"
                                },
                                "桔钓沙至七星湾": {
                                    entry: [ "七星湾登山口", "桔钓沙登山口" ],
                                    route: "F"
                                },
                                "上横岗，东涌水库，上横岗至七娘山合并": {
                                    entry: [ "上横岗后屋坪登山口" ],
                                    route: "E"
                                },
                                "西贡，半天云，俄公，柚柑湾1": {
                                    entry: [ "巧巧窑鸡前登山口", "俄公登山口", "半天云登山口" ],
                                    route: "D"
                                },
                                "西贡，半天云，俄公，柚柑湾2": {
                                    entry: [ "巧巧窑鸡前登山口", "俄公登山口", "半天云登山口", "柚柑湾登山口", "西贡村口登山口" ],
                                    route: "D"
                                },
                                "西贡，半天云，俄公，柚柑湾3": {
                                    entry: [ "西贡村口登山口", "俄公登山口", "半天云登山口" ],
                                    route: "D"
                                },
                                "西贡，半天云，俄公，柚柑湾4": {
                                    entry: [ "西贡村口登山口", "俄公登山口", "半天云登山口" ],
                                    route: "D"
                                },
                                "西贡，半天云，俄公，柚柑湾5": {
                                    entry: [ "柚柑湾登山口", "西贡村口登山口", "半天云登山口" ],
                                    route: "D"
                                },
                                "东涌、南文头、天文台1": {
                                    entry: [ "东涌穿越登山口", "、东涌码头涌口岭登山口", " 西涌天文台登山口" ],
                                    route: "C"
                                },
                                "东涌、南文头、天文台2": {
                                    entry: [ "东涌穿越登山口", "、东涌码头涌口岭登山口", " 西涌天文台登山口" ],
                                    route: "C"
                                },
                                "水头沙，布新，金沙湾": {
                                    entry: [ "英管岭登山口" ],
                                    route: "A"
                                }
                            }, y = [];
                            for (var D in x) for (var C = 0; C < x[D].entry.length; C++) e.data.data.entry == x[D].entry[C] && (y = [].concat(a(y), [ x[D].route ]));
                            var I = [];
                            for (var k in v) I.push(v[k]);
                            for (var T = y.filter(function(t, e, a) {
                                return a.indexOf(t) === e;
                            }), F = 1; F < I.length; F++) for (var A = 0; A < T.length; A++) if (v.hasOwnProperty(T[A] + F)) for (var L = v[T[A] + F].split("/"), _ = 0; _ < L.length; _++) L[_] = L[_].split(","), 
                            L[_] = {
                                latitude: L[_][0],
                                longitude: L[_][1]
                            }, _ == L.length - 1 && (null == t.data.polyline ? t.setData({
                                polyline: [ {
                                    points: L,
                                    width: 3,
                                    dottedLine: !1,
                                    arrowLine: !0,
                                    color: "#4E63A9"
                                } ]
                            }) : t.setData({
                                polyline: [].concat(a(t.data.polyline), [ {
                                    points: L,
                                    width: 3,
                                    dottedLine: !1,
                                    arrowLine: !0,
                                    color: "#4E63A9"
                                } ])
                            }));
                        }
                    }
                });
            }
        });
    },
    close: i.throttle(function(t) {
        wx.navigateBack({
            delta: 0
        });
    }, 2e3),
    share: i.throttle(function(t) {
        var e = this;
        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: e.data.canvasWidth,
            height: e.data.canvasHeight,
            canvasId: "canvas-map",
            success: function(t) {
                console.log(t.tempFilePath), e.setData({
                    canvasImg: t.tempFilePath
                });
                var a = t.tempFilePath;
                wx.saveImageToPhotosAlbum({
                    filePath: a,
                    success: function(t) {
                        wx.showToast({
                            title: "保存至相册成功"
                        });
                    },
                    fail: function(t) {}
                });
            }
        });
    }, 2e3),
    canvas: function(t) {
        this.setData({
            canvasmask: !0
        });
        var e = this;
        wx.getImageInfo({
            src: t,
            success: function(a) {
                var o = e.data.avatarSrc;
                wx.getImageInfo({
                    src: o,
                    success: function(t) {
                        t.path;
                        wx.setStorageSync("avatarUrl", t.path);
                    }
                });
                var n = wx.getStorageSync("avatarUrl");
                console.log(n), a.height, a.width;
                var i, r = s.globalData.userInfoDataBase.nickName, c = e.data.detail.startedAt.split("T")[0] + " " + e.data.detail.startedAt.split("T")[1].split("Z")[0], d = e.data.detail.endAt.split("T")[0] + " " + e.data.detail.endAt.split("T")[1].split("Z")[0], l = e.data.detail.entry;
                new Date();
                function u(t) {
                    return t / i;
                }
                e.setData({
                    canvasHeight: u(580),
                    canvasWidth: u(335)
                }), wx.getSystemInfo({
                    success: function(t) {
                        return i = 375 / t.windowWidth;
                    }
                });
                var g = e.data.h + ":" + e.data.m + ":" + e.data.s, h = wx.createCanvasContext("canvas-map");
                h.drawImage(t, 0, 0, u(355), u(330)), h.drawImage("../../images/share-bg.png", 0, u(330), u(343), u(252)), 
                h.fillText(r, u(30), u(420)), h.setFontSize(10), h.fillText("开始时间：".concat(c), u(160), u(512)), 
                h.fillText("初始登山口：".concat(l), u(200), u(467)), h.fillText("结束时间：".concat(d), u(160), u(564)), 
                h.fillText("持续时间：".concat(g), u(160), u(538)), h.drawImage("../../images/weappcode.jpg", u(20), u(447), u(100), u(100)), 
                h.setFontSize(12), h.fillText("分享给你的朋友", u(27), u(575)), h.fillText("一起来征服自然", u(27), u(560)), 
                h.drawImage(n, u(20), u(355), u(50), u(50)), h.save(), wx.showLoading({
                    title: "绘制中...",
                    icon: "loading"
                }), setTimeout(function() {
                    h.draw(), wx.hideLoading({
                        success: function(t) {}
                    });
                }, 1e3);
            }
        });
    },
    send_code: function(t) {
        var e = this, a = this, o = wx.getFileSystemManager(), n = new Date().getTime(), s = wx.env.USER_DATA_PATH + "/" + n + ".png";
        o.writeFile({
            filePath: s,
            data: t.slice(22),
            encoding: "base64",
            success: function() {
                e.codeimg = s, a.setData({
                    codeimg: s
                }), a.canvas(s);
            }
        });
    },
    fs: function() {
        var t = wx.getFileSystemManager();
        t.writeFileSync("".concat(wx.env.USER_DATA_PATH, "/coordinate").concat(this.data.entryId, ".json"), '[{"latitude":"22.581716","longitude":"113.907722"},{"latitude":"22.581716","longitude":"113.907722"}]', "utf8");
        var e = t.readFileSync("".concat(wx.env.USER_DATA_PATH, "/hello.json")), a = new Uint8Array(e), o = String.fromCharCode.apply(null, a), n = decodeURIComponent(escape(o));
        console.log(JSON.parse(n)), this.setData({
            latlng: JSON.parse(n)
        });
    },
    onLoad: function(e) {
        e.state ? "true" == e.state && (this.setData({
            timecostItv: !0,
            mask: !1
        }), wx.setStorageSync("state", !0)) : 1 == wx.getStorageSync("state") && this.setData({
            timecostItv: !0,
            mask: !1
        }), console.log(e), e && this.setData({
            entryId: e.entryId,
            imgsrc: e.imgsrc
        });
        var o = this;
        wx.getSystemInfo({
            success: function(t) {
                console.log("getSystemInfo success", t), o.setData({
                    windowHeight: 2 * t.windowHeight,
                    windowWidth: 2 * t.windowWidth
                });
            }
        }), wx.startLocationUpdateBackground({
            success: function(t) {
                if ("startLocationUpdateBackground:ok" == t.errMsg) {
                    wx.getSetting({
                        success: function(t) {
                            1 == t.authSetting["scope.userLocationBackground"] && (o.setData({
                                startLocationUpdateBackground: "#999"
                            }), wx.setStorageSync("startLocationUpdateBackground", "true"));
                        }
                    });
                    var e = 0;
                    setInterval(function() {
                        e++;
                    }, 1e3), wx.onLocationChange(function(t) {
                        if (console.log(t), e >= 1) {
                            var n = t;
                            n.latitude = parseFloat(t.latitude).toFixed(6), n.longitude = parseFloat(t.longitude).toFixed(6), 
                            o.setData({
                                currentStatus: n,
                                altitude: t.altitude.toFixed(2)
                            });
                        }
                        if (e >= 60) {
                            "oU3jR4t_jCIXVuJ_a8De13TN0oi8" == o.data.openid || "oU3jR4uzCvHrt-7yGCBsJykcShkU" == o.data.openid || "hold1" == o.data.openid || "hold2" == o.data.openid ? (s.globalData.sio.emit("gpsEvent", parseFloat(t.latitude) - .073545 + "/" + (parseFloat(t.longitude) + .6418105)), 
                            console.log("e1,".concat(parseFloat(t.latitude) - .073545, ",").concat(parseFloat(t.longitude) + .6418105))) : s.globalData.sio.emit("gpsEvent", t.latitude + "/" + t.longitude);
                            var i = {
                                latitude: t.latitude,
                                longitude: t.longitude
                            }, r = wx.getStorageSync("gps");
                            o.data.gpsState && (r ? wx.setStorageSync("gps", [].concat(a(r), [ i ])) : wx.setStorageSync("gps", i)), 
                            e = 0;
                        }
                    });
                } else wx.showModal({
                    showCancel: !0,
                    content: "未开启后台位置获取，请点击右上角“…”，进入设置，选择位置消息，勾选按钮“使用小程序期间和离开小程序后”。",
                    success: function(t) {
                        console.log(t), wx.openSetting({
                            success: function(t) {
                                wx.getSetting({
                                    success: function(t) {
                                        if (console.log(t), 1 == t.authSetting["scope.userLocationBackground"]) {
                                            var e = 0;
                                            setInterval(function() {
                                                e++;
                                            }, 1e3), wx.onLocationChange(function(t) {
                                                if (console.log(t), e >= 1) {
                                                    var n = t;
                                                    n.latitude = parseFloat(t.latitude).toFixed(6), n.longitude = parseFloat(t.longitude).toFixed(6), 
                                                    o.setData({
                                                        currentStatus: n,
                                                        altitude: t.altitude.toFixed(2)
                                                    });
                                                }
                                                if (e >= 60) {
                                                    "oU3jR4t_jCIXVuJ_a8De13TN0oi8" == o.data.openid || "oU3jR4uzCvHrt-7yGCBsJykcShkU" == o.data.openid || "hold1" == o.data.openid || "hold2" == o.data.openid ? (s.globalData.sio.emit("gpsEvent", parseFloat(t.latitude) - .073545 + "/" + (parseFloat(t.longitude) + .6418105)), 
                                                    console.log("e2,".concat(parseFloat(t.latitude) - .073545, ",").concat(parseFloat(t.longitude) + .6418105))) : s.globalData.sio.emit("gpsEvent", t.latitude + "/" + t.longitude);
                                                    var i = {
                                                        latitude: t.latitude,
                                                        longitude: t.longitude
                                                    }, r = wx.getStorageSync("gps");
                                                    o.data.gpsState && (r ? wx.setStorageSync("gps", [].concat(a(r), [ i ])) : wx.setStorageSync("gps", i)), 
                                                    e = 0;
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            },
            fail: function() {
                wx.showModal({
                    showCancel: !0,
                    content: "未开启后台位置获取，请点击右上角“…”，进入设置，选择位置消息，勾选按钮“使用小程序期间和离开小程序后”。",
                    success: function(t) {
                        wx.openSetting({
                            success: function(t) {
                                wx.getSetting({
                                    success: function(t) {
                                        if (console.log(t), 1 == t.authSetting["scope.userLocationBackground"]) {
                                            wx.showToast({
                                                title: "授权成功",
                                                icon: "none"
                                            }), o.setData({
                                                startLocationUpdateBackground: "#999"
                                            });
                                            var e = 0;
                                            setInterval(function() {
                                                e++;
                                            }, 1e3), wx.onLocationChange(function(t) {
                                                if (console.log(t), e >= 1) {
                                                    var n = t;
                                                    n.latitude = parseFloat(t.latitude).toFixed(6), n.longitude = parseFloat(t.longitude).toFixed(6), 
                                                    o.setData({
                                                        currentStatus: n,
                                                        altitude: t.altitude.toFixed(2)
                                                    });
                                                }
                                                if (e >= 60) {
                                                    "oU3jR4t_jCIXVuJ_a8De13TN0oi8" == o.data.openid || "oU3jR4uzCvHrt-7yGCBsJykcShkU" == o.data.openid || "hold1" == o.data.openid || "hold2" == o.data.openid ? (s.globalData.sio.emit("gpsEvent", parseFloat(t.latitude) - .073545 + "/" + (parseFloat(t.longitude) + .6418105)), 
                                                    console.log("e3,".concat(parseFloat(t.latitude) - .073545, ",").concat(parseFloat(t.longitude) + .6418105))) : s.globalData.sio.emit("gpsEvent", t.latitude + "/" + t.longitude);
                                                    var i = {
                                                        latitude: t.latitude,
                                                        longitude: t.longitude
                                                    }, r = wx.getStorageSync("gps");
                                                    o.data.gpsState && (r ? wx.setStorageSync("gps", [].concat(a(r), [ i ])) : wx.setStorageSync("gps", i)), 
                                                    e = 0;
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }), o.data.entryId && wx.login({
            success: function(e) {
                wx.request({
                    url: "https://sumou-server.tsunamitek.com/dengshan?code=".concat(e.code, "&cmd=entry.detail"),
                    method: "POST",
                    data: {
                        entryId: o.data.entryId
                    },
                    success: function(e) {
                        "0" == e.data.data.condition && o.timecost(), console.log("entry.detail success ", e);
                        var a = e.data.data.time.split("T")[0].split("-")[1], n = e.data.data.time.split("T")[0].split("-")[2], s = e.data.data.time.split("T")[0].split("-");
                        o.setData({
                            detail: e.data.data,
                            dateArr: s,
                            day: n,
                            month: a
                        });
                        var i = d.encode("entry:".concat(e.data.data.entry, ",exit:").concat(e.data.data.exit, ",time:").concat(e.data.data.time, ",entryid:").concat(o.data.entryId));
                        o.setData({
                            text: i
                        }), o.setData({
                            colorDark: "#32CD32"
                        }), t = new r("canvas", {
                            image: "/images/bg.png",
                            width: c,
                            height: c,
                            colorDark: o.data.colorDark,
                            colorLight: "white",
                            correctLevel: r.CorrectLevel.H
                        }), wx.showLoading({
                            title: "加载中..."
                        }), t.makeCode(o.data.text, function() {
                            setTimeout(function() {
                                t.exportImage(function(t) {
                                    o.setData({
                                        imgsrc: t
                                    }), wx.hideLoading({
                                        success: function(t) {}
                                    });
                                });
                            }, 1e3);
                        }), o.tapHandler();
                        var l = setInterval(function() {
                            wx.login({
                                success: function(t) {
                                    wx.request({
                                        url: "https://sumou-server.tsunamitek.com/dengshan?code=".concat(t.code, "&cmd=entry.detail"),
                                        method: "POST",
                                        data: {
                                            entryId: o.data.entryId
                                        },
                                        success: function(t) {
                                            console.log(t, "============================================mark"), "0" == t.data.data.condition && (clearInterval(l), 
                                            o.setData({
                                                mask: !1,
                                                timecostItv: !0
                                            }), o.timecost());
                                        }
                                    });
                                }
                            });
                        }, 5e3);
                    }
                });
            }
        }), wx.login({
            success: function(t) {
                wx.request({
                    url: "https://sumou-server.tsunamitek.com/dengshan?code=".concat(t.code, "&cmd=index.today"),
                    success: function(t) {
                        o.setData({
                            avatarSrc: t.data.avatarUrl
                        });
                    }
                });
            }
        }), this.toCurrentLocation();
    },
    toCurrentLocation: i.throttle(function(t) {
        this.mapCtx = wx.createMapContext("myMap"), this.mapCtx.moveToLocation();
    }, 2e3),
    points: function() {
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
    getOpenid: function() {
        var t = s.globalData.sio.openid;
        this.setData({
            openid: t
        });
    },
    onReady: function() {},
    onShow: function() {
        var t = this;
        setTimeout(function() {
            t.getOpenid();
        }, 3e3);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});