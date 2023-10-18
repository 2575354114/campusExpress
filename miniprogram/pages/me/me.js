const db = wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openid: "",
    login: false,
    showAdminLogin: false, // 控制管理员登录按钮的显示与隐藏
    showDialog: false,
    nickName: "",
    phoneNumber: "",
    avatarUrl: "",
  },
  /**
   * 弹出框操作函数
   *
   */
  showDialog: function () {
    this.setData({
      showDialog: true,
    });
  },

  closeDialog: function () {
    this.setData({
      showDialog: false,
    });
  },

  inputNickName: function (e) {
    this.setData({
      nickName: e.detail.value,
    });
  },

  inputPhoneNumber: function (e) {
    this.setData({
      phoneNumber: e.detail.value,
    });
  },

  chooseAvatar: function () {
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: function (res) {
        const tempFilePaths = res.tempFilePaths[0];
        that.setData({
          avatarUrl: tempFilePaths,
        });
      },
    });
  },

  submitInfo: function () {
    let that = this;
    let { nickName, phoneNumber, avatarUrl } = this.data;
    // 校验头像是否为空
    if (!avatarUrl) {
      wx.showToast({
        title: "请选择头像",
        icon: "none",
        duration: 2000,
      });
      return;
    }

    // 校验昵称是否为空
    if (!nickName) {
      wx.showToast({
        title: "请输入昵称",
        icon: "none",
        duration: 2000,
      });
      return;
    }

    // 校验手机号是否为空且长度为11位
    if (!phoneNumber || phoneNumber.length !== 11) {
      wx.showToast({
        title: "请输入正确的手机号",
        icon: "none",
        duration: 2000,
      });
      return;
    }

    // 1. 获取用户openid
    wx.cloud.callFunction({
      name: "login",
      success: function (res) {
        let openid = res.result.openid;

        // 2. 检查数据库中是否已存在相同的 openid
        const db = wx.cloud.database();
        db.collection("Users")
          .where({
            openid: openid,
          })
          .get({
            success: function (res) {
              if (res.data.length > 0) {
                // 数据库中已存在相同的 openid，不进行存储
                console.log("该用户已存在");
                return;
              } else {
                // 3. 上传头像到云存储
                wx.cloud.uploadFile({
                  cloudPath:
                    "Avatar/" +
                    Date.now() +
                    "-" +
                    Math.floor(Math.random() * 1000), // 生成唯一的文件名
                  filePath: avatarUrl,
                  success: (res) => {
                    let avatarFileID = res.fileID;

                    // 4. 将信息存入 Users 数据库
                    db.collection("Users").add({
                      data: {
                        openid: openid,
                        nickName: nickName,
                        phoneNumber: phoneNumber,
                        avatarUrl: avatarFileID,
                      },
                      success: function (res) {
                        console.log("用户信息保存成功", res);

                        // 提交成功后，关闭对话框
                        that.setData({
                          showDialog: false,
                          login: true,
                        });

                        wx.showToast({
                          title: "提交成功",
                          icon: "success",
                          duration: 1000,
                        });
                      },
                      fail: function (err) {
                        console.error("用户信息保存失败", err);
                      },
                    });
                  },
                  fail: console.error,
                });
              }
            },
            fail: console.error,
          });
      },
      fail: console.error,
    });
  },

  jiedan(res) {
    wx.navigateTo({
      url: "../myOrder/myOrder?openid=" + this.data.openid,
    });
  },
  fabu(res) {
    wx.navigateTo({
      url: "../myPublish/myPublish?openid=" + this.data.openid,
    });
  },
  fankui(res) {
    wx.navigateTo({
      url: "../feedBack/feedBack",
    });
  },
  admin(res) {
    wx.navigateTo({
      url: "../admin/admin",
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: "加载中",
    });

    var that = this;

    // 1. 调用云函数 login 获取用户 openid
    wx.cloud.callFunction({
      name: "login",
      success: function (res) {
        let openid = res.result.openid;
        console.log(openid);
        var targetOpenid = "o7Jdc5FBzccfYFa1A-yi1AB6O2rU";
        if (openid === targetOpenid) {
          // openid 符合条件，显示整个菜单栏
          that.setData({
            login: true,
            showAdminLogin: true,
          });
        } else {
          // openid 不符合条件，不显示管理员登录按钮
          that.setData({
            login: true,
            showAdminLogin: false,
          });
        }

        // 2. 根据 openid 查询 Users 数据库
        const db = wx.cloud.database();
        db.collection("Users")
          .where({
            openid: openid,
          })
          .get({
            success: function (res) {
              // 如果存在该用户
              if (res.data.length > 0) {
                let user = res.data[0];

                that.setData({
                  openid: openid,
                  login: true,
                  nickName: user.nickName,
                  avatarUrl: user.avatarUrl,
                  phoneNumber: user.phoneNumber,
                });

                wx.showToast({
                  title: "登录成功",
                  icon: "success",
                  duration: 2000,
                });
              } else {
                // 如果未找到用户信息，提示用户登录
                that.setData({
                  login: false,
                });
                wx.hideLoading(); // 隐藏加载中提示
                wx.showModal({
                  title: "未登录",
                  content: "请登录后使用该功能",
                  showCancel: false, // 隐藏取消按钮
                  confirmText: "去登录",
                  success: function (res) {
                    if (res.confirm) {
                      // 用户点击确认，跳转到登录页面或者进行登录操作
                      // 例如：跳转到登录页面
                      wx.navigateTo({
                        url: "loginPage", // 替换成你的登录页面路径
                      });
                    }
                  },
                });
              }
            },
            fail: function (err) {
              console.error("查询失败", err);
              wx.hideLoading();
            },
          });
      },
      fail: function (err) {
        console.error("云函数调用失败", err);
        wx.hideLoading();
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
