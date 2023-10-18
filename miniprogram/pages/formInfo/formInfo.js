const db = wx.cloud.database();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    picker: ["大件", "中件", "小件"],
    ExpressAddress: "",
    ExpressTime: "",
    ExpressFromAddress: "",
    ExpressCode: "",
    ExpressMoney: "",
    ExpressQQ: "",
    // ExpressPhone: "",
    createTime: "",
  },
  ExpressReceiveAddress(res) {
    this.setData({
      ExpressAddress: res.detail.value,
    });
  },
  ExpressTime(res) {
    this.setData({
      ExpressTime: res.detail.value,
    });
  },
  ExpressFromAddress(res) {
    this.setData({
      ExpressFromAddress: res.detail.value,
    });
  },
  ExpressCode(res) {
    this.setData({
      ExpressCode: res.detail.value,
    });
  },
  ExpressMoney(res) {
    this.setData({
      ExpressMoney: res.detail.value,
    });
  },
  ExpressQQ(res) {
    this.setData({
      ExpressQQ: res.detail.value,
    });
  },
  // ExpressPhone(res) {
  //   this.setData({
  //     ExpressPhone: res.detail.value,
  //   });
  // },
  PickerChangeExpress(res) {
    console.log(this.data.picker[res.detail.value]);
    this.setData({
      index: res.detail.value,
    });
  },
  ExpressSubmit(res) {
    var that = this;
    if (
      that.data.ExpressAddress == "" ||
      that.data.ExpressTime == "" ||
      that.data.ExpressFromAddress == "" ||
      that.data.ExpressCode == "" ||
      that.data.ExpressMoney == "" ||
      that.data.ExpressQQ == ""
      // that.data.ExpressPhone == ""
    ) {
      wx.showToast({
        title: "请完整填写信息",
        icon: "none",
      });
    } else {
      // 通过云函数获取用户的 openid
      wx.cloud.callFunction({
        name: "login",
        success: function (res) {
          let openid = res.result.openid;

          // 在 Users 数据库中根据 openid 获取用户信息
          const db = wx.cloud.database();
          db.collection("Users")
            .where({
              openid: openid,
            })
            .get({
              success: function (res) {
                if (res.data.length > 0) {
                  let user = res.data[0];

                  // 在 Express 数据库中添加快递信息
                  db.collection("Express").add({
                    data: {
                      ExpressLeiXing: that.data.picker[that.data.index],
                      ExpressReceiveAddress: that.data.ExpressAddress,
                      ExpressReceiveTime: that.data.ExpressTime,
                      ExpressFromAddress: that.data.ExpressFromAddress,
                      ExpressCode: that.data.ExpressCode,
                      ExpressMoney: that.data.ExpressMoney,
                      ExpressQQ: that.data.ExpressQQ,
                      ExpressPhone: user.phoneNumber,
                      status: "新发布",
                      ExpressAvatarUrl: user.avatarUrl, // 使用从 Users 数据库获取的头像链接
                      ExpressNickName: user.nickName, // 使用从 Users 数据库获取的昵称
                      createTime: db.serverDate(),
                    },
                    success(res) {
                      console.log("上传成功");
                      wx.showToast({
                        title: "发布成功",
                        complete: () => {
                          wx.switchTab({
                            url: "../order/order",
                          });
                        },
                      });
                      that.setData({
                        index: 0,
                        ExpressAddress: "",
                        ExpressTime: "",
                        ExpressFromAddress: "",
                        ExpressCode: "",
                        ExpressMoney: "",
                        ExpressQQ: "",
                        // ExpressPhone: "",
                      });
                    },
                    fail(res) {
                      console.log("上传失败", res);
                      wx.showToast({
                        title: "上传失败",
                      });
                      that.setData({
                        index: 0,
                        ExpressAddress: "",
                        ExpressTime: "",
                        ExpressFromAddress: "",
                        ExpressCode: "",
                        ExpressMoney: "",
                        ExpressQQ: "",
                        ExpressPhone: "",
                      });
                    },
                  });
                } else {
                  wx.showToast({
                    title: "未找到用户信息",
                    icon: "none",
                  });
                }
              },
              fail: function (err) {
                console.error("查询失败", err);
              },
            });
        },
        fail: console.error,
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.cloud.callFunction({
      name: "login",
      success(res) {
        that.setData({
          openid: res.result.openid,
        });

        // 获取当前日期和时间
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
        const day = currentDate.getDate().toString().padStart(2, "0");
        const hours = currentDate.getHours().toString().padStart(2, "0");
        const minutes = currentDate.getMinutes().toString().padStart(2, "0");

        // 设置默认日期和时间
        const defaultDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;
        that.setData({
          ExpressTime: defaultDateTime,
        });
      },
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
