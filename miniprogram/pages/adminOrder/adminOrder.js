// pages/adminOrder/adminOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    detailData:[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(){
    this.getOrders().then(orderInfoArray =>{
      console.log(orderInfoArray);
      this.setData({
        orders: orderInfoArray
      });
    }).catch(err=>{
      console.error(err);
    });
  },

  //获取所有订单
  getOrders(){
    return new Promise((resolve, reject)=>{
      const db = wx.cloud.database();

      const ordersCollection = db.collection('Express');

      ordersCollection.get().then(res =>{
        const orderInfoArray = res.data;
        resolve(orderInfoArray);
      }).catch(err=>{
        reject(err);
      })
    })

  },

  //修改订单状态
  fixStatus: function(e){
    let item = e.currentTarget.dataset.item;
    let orderId = item._id;
    console.log(orderId)

    wx.showModal({
      title: '警告',
      content: '修改为新发布',
      success: (res) => {
        if (res.cancel) {
          console.log("已取消取消")
          
        }
    
        if (res.confirm) {
          this.cancelOrder(orderId)
          
        }
      }
    })
  },
  cancelOrder:function(orderId){
    console.log('已修改，将订单修改为新发布');
    const db = wx.cloud.database();
    const _ = db.command;
    let that = this;
    db.collection('Express').doc(orderId).update({
      data:{
        receivOpenId: _.remove(),
        status:'新发布'
      },
      success: function(res){
        console.log('修改成功',res);
        wx.showLoading({
          title: '修改中',
        });
        setTimeout(function(){
          that.onLoad();
          wx.hideLoading();
        },800);
      },
      fail: function(error){
        console.error('修改失败',error)
      }
    });

  },
  deteil: function(e) {
    let item = e.currentTarget.dataset.item;
    let orderId = item._id;
    console.log(orderId);
    const db = wx.cloud.database();
    
    let that = this;
  
    db.collection('Express')
      .doc(orderId)
      .get({
        success(res) {
          if (res.data) {
            const detail = res.data;
            console.log(detail.ExpressMaoney);
  
            wx.showModal({
              title: '订单详情',
              content: `发布人：${detail.ExpressNickName}\n取件码${detail.ExpressCode}\n手机号：${detail.ExpressPhone}`,
              showCancel: false,
            });
  
            const detailData = {
              ExpressNickName: detail.ExpressNickName,
              ExpressCode: detail.ExpressCode,
              ExpressPhone: detail.ExpressPhone
            };
  
            that.setData({
              detailData: detailData
            });
          }
        },
        fail(res) {
          console.log(res);
        }
      });
  },
  


  //删除订单
  statusClick: function(e){
    let item = e.currentTarget.dataset.item;
    let orderId = item._id;
    wx.showModal({
      title: '警告',
      content: '您是否要删除该订单',
      complete: (res) => {
        if (res.cancel) {
          console.log('已取消')
          
        }
    
        if (res.confirm) {
          this.deleteOrder(orderId);

          
        }
      }
    })
  },
  deleteOrder: function(orderId){
    const db = wx.cloud.database();
    const _ = db.command;
    let that = this;
    db.collection("Express")
    .doc(orderId)
    .remove({
      success: function(res){
        console.log("订单删除成功",res);
        wx.showLoading({
          title: '删除成功',
        })
        setTimeout(function(){
          that.onLoad();
          wx.hideLoading();
        }, 1000)
      },
      fail: function(error){
        console.error("订单删除失败", error);
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})