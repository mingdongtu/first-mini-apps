
// 首先要将数据引入到当前脚本文件中
var postsData = require("../../../data/posts-data.js");
// 拿到app里面的全局变量
var app=getApp();
Page({
  // 用于存储postId
  data: {
   isPlayingMusic:false
  },
  onLoad: function (option) {
    // var globalData=app.globalData;
    var postId = option.id;
    console.log(option)
    // 将postId值存储在页面的data属性中
    this.data.currentPostId = postId;
    var postData = postsData.postList[postId];
    
    //  开始做数据绑定
    this.setData({
      postData: postData
    });


    // 首先要从缓存里面读取这样一个状态：收藏功能实现
    // var posts_Collected;
    var postsCollected = wx.getStorageSync('posts_Collected');

    //  读取当前文章的缓存状态,首选要判断缓存是否存在
    if (postsCollected) {

      var postCollected = postsCollected[postId];
      this.setData({
        collected: postCollected
      })
    } else {

      var postsCollected = {};
      postsCollected[postId] = false;
      //然后将其放在缓存中
      wx.setStorageSync("posts_Collected", postsCollected);
    }
    // g_isPlayingMusic是一个全局变量，用于保存音乐播放状态的,isPlayingMusic用于在这个页面中控制数据绑定的
    // 这里主要解决的问题是音乐播放时，页面切出又切回时保证音乐不重新播放
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId){
          // this.data.isPlayingMusic=true
          this.setData({
            isPlayingMusic:true
          })
    }
    this.setMusicMonitor();
  },

  setMusicMonitor:function(){
    // 将音乐监听事件放于onload事件下:主要解决的是同步的问题
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      // 监听到音乐播放后，就要去更换图标
      that.setData({
        isPlayingMusic: true
      })
      // 在监听函数中改变g_isPlayingMusic
      app.globalData.g_isPlayingMusic=true;
      // 将当前的postId值赋给g_currentMusicPostId;
      app.globalData.g_currentMusicPostId=that.data.currentPostId;

    });
    // 监听它的暂停事件

    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      })

      app.globalData.g_isPlayingMusic=false;
      // 当音乐暂停的时候要把当前音乐清空
      app.globalData.g_currentMusicPostId=null;
    })

  },

  onCollectionTap: function (event) {
    // 首先获取所有缓存状态
    var postsCollected = wx.getStorageSync('posts_Collected');
    console.log(postsCollected)
    // 获取当前文章的缓存状态
    var postCollected = postsCollected[this.data.currentPostId];  
    // 进行取反操作，收藏变成未收藏，未收藏变成收藏
    postCollected = !postCollected;
    // 然后更新具体某一篇文章的缓存状态：注意：下面只是向对象里面,而没有真正在缓存里面更新
    postsCollected[this.data.currentPostId] = postCollected;
    // 调用showModal方法
    
    this.showToast(postsCollected, postCollected);

  },
  //  将showToast和showModal提取出来

  showModal: function (postsCollected, postCollected) {
     var that=this;
    // 模态框
    wx.showModal({
      title: "收藏",
      content: postCollected?" 收藏该文章？":"取消收藏改文章?",
      showCancel: "true",
      cancelText: "取消",
      cancelColor: "#333",
      confirmText: "确认",
      confirmColor: "#405f80",
      success:function(res){
           if(res.confirm){
             console.log("执行这里4")
             // 将整体的状态重新注入缓存
             wx.setStorageSync("posts_Collected", postsCollected);
             // 更新数据绑定
             that.setData({
               collected: postCollected
             });
           }
      }
    })
  },
  showToast: function (postsCollected, postCollected) {
    // 将整体的状态重新注入缓存
    wx.setStorageSync("posts_Collected", postsCollected);
    // 更新数据绑定
    this.setData({
      collected: postCollected
    });

    //  点击出现提示框，利用三元表达式来实现判断
    wx.showToast({
      title: postCollected ? "收藏成功！" : "取消收藏！",
      duration: 1000,
      icon: "success"  
    });
  },
  onShareTap:function(event){
    var itemList=[
      "分享到微信",
      "分享到朋友圈",
      "分享到微博",
      "分享到QQ",
      "分享到Facebook"
    ]
       wx.showActionSheet({
         itemList:itemList,
            itemColor:"#405f80",
            success:function(res){
                //  res.cancel 用户是不是点击了取消
                // res.tapIndex 数组元素的序号
                wx.showModal({
                     title:"用户"+itemList[res.tapIndex],
                     content:"现在还无法实现分享功能"
                })
            }
       })
  },
  // 实现音乐播放的控制
   onMusicTap:function(event){
    //  获取当前文章的postId值:关于数据引入这一块要好好研究
    var currentPostId=this.data.currentPostId;
    var postData = postsData.postList[currentPostId];
    //  获取音乐播放状态
     var isPlayingMusic=this.data.isPlayingMusic;
     if (isPlayingMusic){
      //  若音乐启动则调用关闭API
      wx.pauseBackgroundAudio();
      // 注意：启动后修改状态重新存储在data中,要在wxml中进行数据绑定就必须采用setData（）方法
      this.setData({
             isPlayingMusic:false
      })   
     }else{
       wx.playBackgroundAudio({
         dataUrl: postData.music.url,
         title: postData.music.title,
         coverImgUrl: postData.music.coverImg
       })
      // 再次变更状态
       this.setData({
         isPlayingMusic: true
       })
     }
    
   }

})