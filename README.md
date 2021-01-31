# PgcCmt

基于js的可插入表情的评论框， <a href="https://github.com/xinhaolin/VueCLib" target="_blank" >Vue版本</a><br>
技术细节请看：<a href="https://juejin.cn/post/6882577678692515847" target="_blank" >掘金地址</a>，<br> 由于技术点基本一致，所以就不再写一篇文章记录 

## Demo

<a href="https://www1.pconline.com.cn/pgc/20201221/cmt/index.html" target="_blank" >demo地址</a>

## 组件说明

1. 字数的限制都是基于字符长度进行判断
2. 不兼容IE低版本（最好是不要用IE了，这点很重要~）
3. 评论中会带有标签，例如回车会转为div标签,表情包是利用img标签插入，空格为&nbsp
4. 表情会被解析为4个字符，空格与回车虽然会被转换，但是解析的时候回车会被转换成2个字符，空格转换成1个
5. 若要起始状态为隐藏，请设置完initStatus为false后 在el节点上设置display：none，不然将会有闪烁现象
6. 尽量不要一次性显示多个评论框，最好每次一个
7. 样式可以自行覆盖，节点也可自行添加，但是基本模板节点必须有，不然会找不到节点导致报错
8. 支持多套表情，表情列表需严格按照格式来
9. 该组件暂不支持移动端，因为移动端在ios中部分非输入元素也能获得焦点，会导致插入图片时光标不准确

## 实例参数说明

  1. el: 某个元素下  （必须，且为id）
  2. emoticon： 表情包列表 （必须，暂时只支持数组形式）
  3. limtText： 评论字节长度限制，传入0为不限制 （注意是字节长度！！！默认为0，换行为2个字节，空格为1个字节，表情为4个字节）
  4. iconWidth：插入的表情宽度，默认是30px
  5. iconHeight：插入的表情高度，默认是30px
  6. initStatus：起始状态 true显示 false 隐藏
  7. info: 携带信息（可用于id传递）
  8. changeEvent: 监听输入方法，有一个参数为 当前输入内容
  9. submitEvent：提交方法，有4个参数 1） 是否出错 2）错误信息 3）输入内容 4) 携带信息 对应info
   
## 实例方法
 1.  show： 显示该评论框
 2.  hide： 隐藏该评论框
   
## 使用方法

 1. 把js与css文件下载下来后，引入相应的js与css
 ``` html
 <link rel="stylesheet" href="./cmt.css">
 <script src="./cmt.js"></script>
 ```
 2. 引入基础的html模版(最外层id可随意指定，里面html结构需如下)
 ``` html
      <div id="cmt_wapper" >
        <div class="cmt_box">
          <p class="content_edit"></p>
          <div class="handle_list">
            <img class="em_icon" src="//www1.pconline.com.cn/20200929/pgc/cmt/icon.png" />
            <div class="btn_submit">发布</div>
          </div>
        </div>
      </div>
 ```
 3. 创建评论组件（每个评论组件需实例化一次，实例化时需传递一个对象作为参数，对象属性请看上方参数说明）
 ``` html
 <script >
   new PgcCmt({
        el: 'cmt_wapper',
        initStatus: false,
        emoticon: imgList,
        changeEvent: (text) => {
            console.log('输出text', text)
        },
        submitEvent: (err, msg, text, info) => {
            console.log('提交', err, msg, text, info)
            if(err){
                alert('提交失败，请打开F12控制台查看')
            }else{
                alert('提交成功，请打开F12控制台查看')
            }
        }
    })
 </script>
 ```
  4. 表情列表格式
   
  ```javascript
    // 一个对象为一套表情，最多5套
   const imgList = [
     {
     icon: '//www1.pconline.com.cn/20200929/pgc/cmt/icon.png', // tab的icon
      width: 30, // tab icon的宽度
      height: 30, // tab icon的高度
      list: [
        "//gold-cdn.xitu.io/asset/twemoji/2.6.0/svg/1f603.svg"
      ]
      }
   ]
  ```
### 版本：
 v1.0: 只支持单套表情包，且暂无对复制进文本框的内容进行过滤操作，需要在changText回调里进行自主过滤<br/>
 v1.1：（开发中...）开启文本过滤操作，对复制进去的文本进行标签过滤
