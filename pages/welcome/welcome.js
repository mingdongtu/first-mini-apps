Page({
  myTab:function(event){
    // wx.navigateTo({
    //   url: "../posts/post"
    // });
  wx.navigateTo({
    url: "../posts/post",
    success:function(res){
    console.log("成功了！")
    },
    // fail:function(){

    // },
    complete:function(){
      console.log("无论成功与否！")
    }
  })
  },
  onUnload: function () {
    console.log("执行onUnload");
  },
  onHide:function(){
    console.log("执行onHide");
  }
})