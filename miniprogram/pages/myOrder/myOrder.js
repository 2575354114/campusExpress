const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Express:[]
  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
  
    // 调用云函数 login
    wx.cloud.callFunction({
      name: 'login',
      success(res) {
        let openid = res.result.openid; // 获取云函数返回的openid
  
        // 使用获取的openid查询 'Express' 集合的数据
        db.collection('Express').where({
          receivOpenId: openid
        }).get({
          success(res) {
            console.log(res);
            that.setData({
              Express: res.data
            })
          },
          fail(res) {
            console.log(res);
          }
        })
      },
      fail(err) {
        console.error('云函数 login 调用失败', err);
      }
    });
  },
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 退单操作
  statusClick: function (e) {
    let item = e.currentTarget.dataset.item; // 获取当前点击的订单信息
    let orderId = item._id; // 获取订单的 _id
    console.log(orderId)
  
    wx.showModal({
      title: '警告',
      content: '您是否要退单？',
      success: (res) => {
        if (res.confirm) {
          this.cancelOrder(orderId); // 执行退单操作，传入订单id
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  },
  // 退单逻辑

  cancelOrder: function (orderId) {
    console.log('订单已退单，订单ID：', orderId);
  
    const db = wx.cloud.database();
    const _ = db.command;
    let that = this;
    db.collection('Express').doc(orderId).update({
      data: {
        receivOpenId: _.remove(),
        status: '新发布'
      },
      success: function(res) {
        console.log('退单成功', res);
        wx.showLoading({
          title: '退单中',
        });
        setTimeout(function() {
          that.onLoad(); // 重新加载数据
          wx.hideLoading();
        }, 1100); // 1.1秒的延迟
        
        
        
      },
      fail: function(error) {
        console.error('退单失败', error);
      }
    });
  }
  


})