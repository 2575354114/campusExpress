const db = wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    Express: [],
    orderOpenid: [],
    openid: "",
    isRobbed: false, // 初始状态为未抢单
    currentPage: 1, // 当前页数
    pageSize: 4, // 每页数据条数
    loading: false, // 是否正在加载中
    noMoreData: false, // 是否没有更多数据了
  },

  //检查用户是否登录
  checkLogin: function () {
    var that = this;
    var openid = that.data.openid;

    db.collection("Users")
      .where({
        openid: openid,
      })
      .get({
        success(res) {
          if (res.data.length > 0) {
            // 用户已注册，设置登录状态
            that.setData({
              isLoggedIn: true,
            });
          } else {
            // 用户未注册，设置登录状态为 false
            that.setData({
              isLoggedIn: false,
            });
          }
        },
        fail(err) {
          console.error(err);
        },
      });
  },




  //抢单逻辑
  robOrder(result) {
    wx.showLoading({
      title: "处理中",
    });
    let that = this;
    let id = result.currentTarget.dataset.id;
    let userOpenid = that.data.openid;
    let orderOpenid = result.currentTarget.dataset.orderopenid; // 获取订单发布人的openid

    if (!that.data.isLoggedIn) {
      wx.showToast({
        title: "请先前往个人中心授权个人信息",
        icon: "none",
      });
      return; // 添加此行，防止继续执行
    }

    if (userOpenid === orderOpenid) {
      wx.showToast({
        title: "不能抢自己的订单",
        icon: "none",
      });
      return; // 添加此行，防止继续执行
    }
    wx.cloud.callFunction({
      name: "updateExpressStatus",
      data: {
        id: id,
        status: "已接单",
        openid: userOpenid,
      },
      success: (res) => {
        console.log(res);
        const updatedExpress = that.data.Express.map((item) => {
          return item.id === id ? { ...item, status: "已接单" } : item;
        });
    
        wx.hideLoading({
          success: () => {
            wx.showToast({
              title: "抢单成功",
            });
    
            that.setData({
              Express: updatedExpress,
              isRobbed: true,
            }, () => {
              setTimeout(() => {
                wx.startPullDownRefresh();
              }, 1200);
            });
          },
        });
      },
    });
    

   
  },

  //分页
  loadData: function () {
    if (this.data.loading || this.data.noMoreData) {
      return;
    }

    wx.showLoading({
      title: "加载中...",
    });

    var that = this;
    var currentPage = this.data.currentPage;

    db.collection("Express")
      .where({
        status: "新发布",
      })
      // .orderBy("status", "desc")
      .orderBy("createTime", "desc")
      .skip((currentPage - 1) * this.data.pageSize)
      .limit(this.data.pageSize)
      .get({
        success(res) {
          wx.hideLoading();
          if (res.data.length > 0) {
            // 有新数据
            that.setData({
              Express: that.data.Express.concat(res.data), // 将新数据拼接到原有数据后面
              currentPage: currentPage + 1,
              loading: false,
              noMoreData: false,
            });
          } else {
            // 没有新数据了
            that.setData({
              noMoreData: true,
              loading: false,
            });
          }
        },
        fail(err) {
          wx.hideLoading();
          console.error(err);
        },
      });
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
        console.log(that.data.openid);
        that.checkLogin(); // 检查登录状态
        that.loadData(); // 加载数据
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
  onPullDownRefresh: function () {
    var that = this;
    console.log("开始下拉刷新"); // 添加这行
    wx.showNavigationBarLoading(); // 在标题栏中显示加载
    wx.showLoading({
      title: "刷新中...",
    });

    // 清空已加载的数据，重新加载第一页数据
    that.setData({
      Express: [],
      currentPage: 1,
      isRobbed: false,
      noMoreData: false,
    });

    // 模拟数据加载的延迟（你可以用实际的数据加载代码替代这里）
    setTimeout(function () {
      that.loadData(); // 重新加载数据

      // 隐藏刷新中的加载动画
      wx.hideLoading();

      // 停止下拉刷新动画
      wx.stopPullDownRefresh();

      // 隐藏标题栏中的加载指示器
      wx.hideNavigationBarLoading();
      console.log("下拉刷新完成"); // 添加这行
    }, 1500); // 1秒的延迟（请用实际的数据加载时间替代）
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    that.loadData(); // 当滑动到底部时触发加载数据

    if (that.data.noMoreData) {
      wx.showLoading({
        title: "没有更多数据了",
        mask: true,
      });

      setTimeout(function () {
        wx.hideLoading();
      }, 1000);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
