const db = wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    Express: [],
    userData: {}
  },

  DontClick() {
    wx.showLoading({
      title: "该任务已被接单",
    });
    setTimeout(function () {
      wx.hideLoading();
    }, 600);
  },
  statusClick: function (e) {
    let item = e.currentTarget.dataset.item;
    let orderId = item._id;
    console.log(orderId);
    wx.showModal({
      title: "警告",
      content: "您是否要删除该任务？",
      success: (res) => {
        if (res.confirm) {
          this.deletelOrder(orderId); // 执行退单操作，传入订单id
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      },
    });
  },

  deletelOrder: function (orderId) {
    console.log("订单已删除，订单ID:", orderId);

    const db = wx.cloud.database();
    const _ = db.command;
    let that = this;
    db.collection("Express")
      .doc(orderId)
      .remove({
        success: function (res) {
          console.log("订单删除成功", res);
          wx.showLoading({
            title: "删除成功",
          });
          setTimeout(function () {
            that.onLoad();
            wx.hideLoading();
          }, 1500);
        },
        fail: function (error) {
          console.error("订单删除失败", error);
        },
      });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    // 调用云函数 login
    wx.cloud.callFunction({
      name: "login",
      success(res) {
        // 获取云函数返回的openid
        let openid = res.result.openid;

        // 使用openid查询Express集合数据
        db.collection("Express")
          .where({
            _openid: openid,
          })
          .orderBy("status", "doc")
          .get({
            success(res) {
              console.log(res);
              // const receivOpenIds = res.data.map(item => item.receivOpenId);
              console.log(
                "receivOpenId:",
                res.data.map((item) => item.receivOpenId)
              );

              that.setData({
                Express: res.data,
                // receivOpenIds: receivOpenIds, // 将 receivOpenIds 存入 data 中
              });
            },
            fail(res) {
              console.log(res);
            },
          });
      },
      fail(err) {
        console.error("云函数 login 调用失败", err);
      },
    });
  },

  showReceivOpenIds: function (e) {
    let item = e.currentTarget.dataset.item;
    let that = this;

    if (item && item.receivOpenId) {
      console.log("当前订单的 receivOpenId:", item.receivOpenId);
  
      const db = wx.cloud.database();
      const _ = db.command;

      // 假设 receivOpenId 是你要查询的用户的 openid
      const OpenId = item.receivOpenId;

      db.collection("Users")
        .where({
          _openid: OpenId,
        })
        .get({
          success(res) {
            if (res.data.length > 0) {
              const user = res.data[0];
              console.log(user.nickName)
              wx.showModal({
                title: '接单人信息',
                content: `昵称: ${user.nickName}\n手机号: ${user.phoneNumber}`,
                showCancel: false,
              });
              const userData = {
                nickName: user.nickName,
                avatarUrl: user.avatarUrl,
                phoneNumber: user.phoneNumber
              };
              that.setData({
                userData: userData
              });
              
            } else {
              console.log("找不到匹配的用户");
            }
          },
          fail(error) {
            console.error("查询用户信息失败", error);
          },
        });
    } else {
      console.error("接单人信息未定义或不存在");
    }
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
