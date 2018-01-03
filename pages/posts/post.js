
// postsData用来接收post-data.js中用于输出的js对象
// 下面的参数只能用相对路径
var postsData = require("../../data/posts-data.js");

Page({
  data:{
  },
  onLoad:function(options){
// 将两篇文章的数据整合成一个数组
        this.setData({
          posts_key: postsData.postList
        });
    },
    onPostTap:function(event){
      var postId = event.currentTarget.dataset.postid;
      console.log("on post id is"+postId);
      wx.navigateTo({ 
           url:"post-detail/post-detail?id="+postId
      })
    },
  // 点击轮播图实现跳转
    // onSwiperItemTap:function(event){
    //   var postId = event.currentTarget.dataset.postid;
    //   // console.log("on post id is" + postId);
    //   wx.navigateTo({
    //     url: "post-detail/post-detail?id=" + postId
    //   })
    // },
    onSwiperTap:function(event){
      // target与currentTarget
      // target指的是当前点击的组件，currentTarget指的是事件捕获的组件
      // target指的是image,而currentTarget指的是swiper
      var postId = event.target.dataset.postid;
      wx.navigateTo({
        url: "post-detail/post-detail?id=" + postId
      })
    }
})

