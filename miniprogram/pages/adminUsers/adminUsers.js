// pages/adminUsers/adminUsers.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    users: [] // 初始化用户数组为空

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    this.getUsers().then(userInfoArray => {
      // 在这里处理获取到的用户信息数组
      console.log(userInfoArray);
  
      // 将用户信息存入页面的data中
      this.setData({
        users: userInfoArray
      });
    }).catch(err => {
      // 处理错误
      console.error(err);
    });
  },

  
  //获取所有用户  
  getUsers() {
    return new Promise((resolve, reject) => {
      const db = wx.cloud.database(); // 获取数据库实例
      const usersCollection = db.collection('Users'); // 获取Users集合
  
      // 使用get方法获取所有用户信息
      usersCollection.get().then(res => {
        // 查询成功，res.data 中包含了所有用户信息
        const userInfoArray = res.data;
        resolve(userInfoArray);
      }).catch(err => {
        // 查询失败，返回错误信息
        reject(err);
      });
    });
  },

  statusClick: function(e){
    let item = e.currentTarget.dataset.item;

    let userId = item._id;
    console.log(userId)

    wx.showModal({
      title: '警告',
      content: '是否要删除该用户',
      success: (res) => {
        if (res.cancel) {
          console.log("用户点击取消")
          
        }
    
        if (res.confirm) {
          this.deleteUser(userId);
          
        }
      }
    })
  },

  

  //删除用户操作
  deleteUser: function(userId){
    console.log('删除用户id为：',userId);

    const db = wx.cloud.database();
    const _ = db.command;
    let that = this;
    db.collection('Users')
    .doc(userId)
    .remove({
      success: function(res){
        console.log('用户删除成功', res)
        wx.showLoading({
          title: '删除成功',
        });
        setTimeout(function(){
          that.onLoad();
          wx.hideLoading();
        }, 1500)
      },
      fail: function(error){
        console.error("用户删除失败",error)
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