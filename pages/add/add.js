var e = require("../../@babel/runtime/helpers/interopRequireDefault"),
    t = require("../../@babel/runtime/helpers/defineProperty"),
    a = e(require("../../utils/mixins/pageMixin/myPageMixin")),
    n = getApp(),
    s = require("../../utils/util.js");

import Api from "../../api/index"
Page({
    mixins: [a.default],
    data: t({
        dataBack: true,
        ensureEnter: '',
        group: ["单人", "团队"],
        family: ["是", "否"],
        reason: ["游玩/活动", "生产作业", "采集山产品", "车辆通行", "祭祀", "迁坟", "其他"],
        clear: !0,
        enterIndex: 0,
        ensureExit: "桔钓沙登山口",
        groupIndex: 0,
        ensureGroup: "单人",
        reasonIndex: 0,
        ensureReason: "游玩/活动",
        prop: 0,
        isRead: !1
    }, "clear", !1),
    fire: function () {
        this.setData({
            fire: !0,
            promise: !1
        });
    },
    promise: function () {
        this.setData({
            promise: !0,
            isRead: !0,
            clear: !1
        });
    },
    notRead: function () {
        this.setData({
            isRead: !1,
            promise: void 0,
            fire: void 0
        });
    },
    isRead: function () {
        this.data.fire ? this.setData({
            isRead: !0
        }) : this.setData({
            fire: !1,
            clear: !0
        });
    },
    getDsRk() {
        Api.getDsRk().then(res => {
            this.setData({
                enter: res
            })
        })
    },
    createDone: s.throttle(function (e) {
        let that = this
        let {
            ensureGroup,
            showEnsureFamilyNum,
            ensureReason,
            date,
            ensureEnter,
            isRead
        } = this.data
        let type = ensureGroup != "团队" ? 1 : 2
        let reason = ensureReason //登山原因
        let ds_time = date //登山时间
        let rukou = ensureEnter //登山入口
        if (!isRead) {
            wx.showToast({
                title: '请阅读并勾选责任书',
                icon: "none"
            })
            return
        }
        if(type==2&&!showEnsureFamilyNum){
            wx.showToast({
                title: '请填写数量',
                icon: "none"
            })
            return
        }
        wx.showLoading({
            title: '备案中',
            mask: true,
        })
        Api.subDsLog({
            type,
            reason,
            ds_time,
            rukou,
            num:type==1?"":showEnsureFamilyNum
        }).then(res => {
            wx.hideLoading()
            wx.showToast({
                title: '备案成功',
                icon: 'none',
                mask: true
            })
            setTimeout(() => {
                wx.redirectTo({
                    url: "/pages/index/index"
                })
            }, 1500);
        })
        return
        var t = this;
        if (0 != this.data.isRead)
            if (this.data.ensureEnter) {
                if ("单人" == this.data.ensureGroup) wx.showModal({
                    title: "提交备案",
                    content: "请确认备案信息是否正确，正确请选择确定返回主页",
                    success: function (e) {
                        e.confirm &&
                            e.confirm && wx.login({
                                success: function (e) {
                                    wx.request({
                                        url: "https://sumou-server.tsunamitek.com/dengshan?code=".concat(e.code, "&cmd=entry.create"),
                                        method: "POST",
                                        data: {
                                            appid: "".concat(n.globalData.appId),
                                            entry: t.data.ensureEnter,
                                            exit: " ",
                                            time: t.data.date,
                                            purpose: t.data.ensureReason,
                                            type: t.data.groupIndex.toString()
                                        },
                                        success: function (e) {
                                            console.log("entry.create", e), "必填项目缺失" != e.data.err ? wx.navigateBack({
                                                delta: 0
                                            }) : wx.showToast({
                                                title: "必填项目缺失",
                                                icon: "error"
                                            });
                                        }
                                    });
                                }
                            }), e.cancel;
                    }
                });
                else if ("团体" == this.data.ensureGroup) {
                    if (!this.data.ensureFamily) return void wx.showToast({
                        title: "必填项目缺失",
                        icon: "error"
                    });
                    this.data.subsMsg || wx.requestSubscribeMessage({
                        tmplIds: ["KG6-W5Wf235B33PwAGJ8JccsFfHmtA74Py9VfgPrX0g"],
                        success: function (e) {
                            t.setData({
                                subsMsg: !0
                            }), wx.showModal({
                                title: "提交备案",
                                content: "请确认备案信息是否正确，正确请选择确定前往团队界面。",
                                success: function (e) {
                                    e.confirm && wx.login({
                                        success: function (e) {
                                            wx.request({
                                                url: "https://sumou-server.tsunamitek.com/dengshan?code=".concat(e.code, "&cmd=entry.create"),
                                                method: "POST",
                                                data: {
                                                    appid: "".concat(n.globalData.appId),
                                                    entry: t.data.ensureEnter,
                                                    exit: "",
                                                    time: t.data.date,
                                                    purpose: t.data.ensureReason,
                                                    type: t.data.groupIndex.toString()
                                                },
                                                success: function (e) {
                                                    console.log("entry.create success", e), "必填项目缺失" != e.data.err ? (t.setData({
                                                        teamid: e.data.entry_id
                                                    }), wx.redirectTo({
                                                        url: "/pages/detail/detail?myteamid=".concat(t.data.teamid)
                                                    })) : wx.showToast({
                                                        title: "必填项目缺失",
                                                        icon: "error"
                                                    });
                                                }
                                            });
                                        }
                                    }), e.cancel;
                                }
                            });
                        }
                    });
                } else if ("团队" == this.data.ensureGroup) {
                    if (!this.data.ensureFamilyNum || "0" == this.data.ensureFamilyNum) return void wx.showToast({
                        title: "团队人数错误",
                        icon: "error"
                    });
                    wx.showModal({
                        title: "提交备案",
                        content: "请确认备案信息是否正确，正确请选择确定返回主页",
                        success: function (e) {
                            e.confirm && Api.subDsLog({}).then(res => {

                            })
                            return
                            e.confirm && wx.login({
                                success: function (e) {
                                    wx.request({
                                        url: "https://sumou-server.tsunamitek.com/dengshan?code=".concat(e.code, "&cmd=entry.create"),
                                        method: "POST",
                                        data: {
                                            appid: "".concat(n.globalData.appId),
                                            entry: t.data.ensureEnter,
                                            exit: " ",
                                            time: t.data.date,
                                            purpose: t.data.ensureReason,
                                            type: t.data.groupIndex.toString(),
                                            count: t.data.ensureFamilyNum.toString()
                                        },
                                        success: function (e) {
                                            console.log("entry.create", e);
                                            var t = e.data.entry_id;
                                            console.log(t), wx.login({
                                                success: function (e) {
                                                    wx.request({
                                                        url: "https://sumou-server.tsunamitek.com/dengshan?code=".concat(e.code, "&cmd=entry.teammates.leaderApprove"),
                                                        method: "POST",
                                                        data: {
                                                            teamid: t
                                                        },
                                                        success: function (e) {
                                                            n.globalData.detailStuff, console.log("approve success ", e), wx.showToast({
                                                                title: "申报成功"
                                                            });
                                                        }
                                                    });
                                                }
                                            }), "必填项目缺失" != e.data.err ? wx.navigateBack({
                                                delta: 0
                                            }) : wx.showToast({
                                                title: "必填项目缺失",
                                                icon: "error"
                                            });
                                        }
                                    });
                                }
                            }), e.cancel;
                        }
                    });
                }
            } else wx.showToast({
                title: "必填项目缺失",
                icon: "error"
            });
        else wx.showToast({
            title: "请勾选声明后重试",
            icon: "error"
        });
    }, 1e3),
    ensureFamilyNum: function (e) {
        console.log(e.detail.value), this.setData({
            showEnsureFamilyNum: parseInt(e.detail.value),
            ensureFamilyNum: parseInt(e.detail.value) + 1
        });
    },
    toFire: function () {
        wx.navigateTo({
            url: "/pages/fire/fire"
        });
    },
    toPromise: function () {
        wx.navigateTo({
            url: "/pages/promise/promise"
        });
    },
    bindDateChange: function (e) {
        this.setData({
            date: e.detail.value
        });
    },
    bindPickerGroup: function (e) {
        this.setData({
            groupIndex: e.detail.value,
            ensureGroup: this.data.group[e.detail.value]
        });
    },
    bindPickerFamily: function (e) {
        this.setData({
            familyIndex: e.detail.value,
            ensureFamily: this.data.family[e.detail.value]
        });
    },
    bindPickerEnter: function (e) {
        this.setData({
            enterIndex: e.detail.value,
            ensureEnter: this.data.enter[e.detail.value]['name']
        });
    },
    bindPickerExit: function (e) {
        this.setData({
            exitIndex: e.detail.value,
            ensureExit: this.data.exit[e.detail.value]
        });
    },
    bindPickerReason: function (e) {
        this.setData({
            reasonIndex: e.detail.value,
            ensureReason: this.data.reason[e.detail.value]
        });
    },
    onLoad: function (e) {
        if (this.data.pageData && this.setData({
                enter: this.data.pageData.entry,
                exit: this.data.pageData.exit,
                entryEN: this.data.pageData.entryEN
            }), n.globalData.entryEN)
            for (var t = 0; t < this.data.entryEN.length; t++) n.globalData.entryEN == this.data.entryEN[t] && (console.log(t),
                console.log(this.data.enter[t]), this.setData({
                    enterIndex: t,
                    ensureEnter: this.data.enter[t]
                }));
        var a = s.formatTime(new Date()).split(" ");
        this.setData({
            date: a[0]
        }), wx.getSetting({
            success: function (e) {
                console.log(e.authSetting), console.log(e.authSetting["scope.userLocationBackground"]),
                    null == e.authSetting["scope.userLocationBackground"] ? (n.globalData.startLocationUpdateBackground = !1,
                        console.log("false")) : (n.globalData.startLocationUpdateBackground = !0, console.log("2"));
            }
        });
    },
    onReady: function () {},
    onShow: function () {
        this.getDsRk()
    },
    onHide: function () {},
    onUnload: function () {},
    onPullDownRefresh: function () {},
    onReachBottom: function () {},
    onShareAppMessage: function () {
        return {
            path: "/pages/index/index",
            imageUrl: "/images/share.jpg",
            title: "行山易"
        };
    }
});