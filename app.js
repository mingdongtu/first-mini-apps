
// app有3个生命周期函数
// App({
//   onLaunch:function(){
//     console.log("onLaunch");   
//   },
//   onShow:function(){
//     console.log("onShow");
//   },
//   onHide:function(){
//     console.log('onHide')
//   }
// })


// 在页面page里面实现的是页面周期的控制，而在APP里则是关于应用程序
// 生命周期的控制:globalData专门用于保存我们用于全局的数据
// g_currentMusicPostId指代的是哪一个音乐在播放
App({
    globalData:{
       g_isPlayingMusic:false,
       g_currentMusicPostId:null
    }
})