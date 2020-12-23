/**
 * 评论组件：
 * @param {Object} config
 * 属性说明：
 * 1. el: 某个元素下  （必须，且为id）
 * 2. emoticon： 表情包列表 （必须，暂时只支持数组形式）
 * 3. limtText： 评论字节长度限制，传入0为不限制 （注意是字节长度！！！默认为0，换行为4个字节，空格为1个字节，表情为4个字节）
 * 4. iconWidth：插入的表情宽度
 * 5. iconHeight：插入的表情高度
 * 6. initStatus：起始状态 true显示 false 隐藏
 * 7. info: 携带信息（可用于id传递）
 * 7. changeEvent: 监听输入方法，有一个参数为 当前输入内容
 * 8. submitEvent：提交方法，有4个参数 1） 是否出错 2）错误信息 3）输入内容 4) 携带信息 对应info
 *
 * 暴漏方法：
 *  show： 显示该评论框
 *  hide： 隐藏该评论框
 *
 * 备注：
 *  1. 若要起始状态为隐藏，请设置完initStatus为false后 在el节点上设置display：none，不然将会有闪烁现象
 *  2. 尽量不要一次性显示多个评论框，最好每次一个
 *  3. 样式可以自行覆盖，节点也可自行添加，但是基本模板节点必须有，不然会找不到节点导致报错
 *
 */
function PgcCmt(config) {
  if (!this.isType(config, 'Object')) {
    throw TypeError('参数类型必须为对象')
  }
  if (!config.el || !document.getElementById(config.el)) {
    throw Error('缺少el参数，或者el参数为空')
  }
  if(config.emoticon.length >5){
    throw Error("最多只能有5套表情包")
  }
  this.init(config)
}
PgcCmt.prototype.init = function (config) {

  this.initParams(config)
  this.initEmoticonPlane()
  this.initEvent()
}
/**
 * 初始化参数
 * @param {Object} config
 */
PgcCmt.prototype.initParams = function(config){
  this.config = config;
  this.el = config.el;
  this.mode = config.mode || 'array'
  this.emoticon = config.emoticon;
  this.limtText = config.limtText == undefined ? 0 : config.limtText
  this.iconWidth = config.iconWidth || 30
  this.iconHeight = config.iconHeight || 30
  // this.showIcon = false
  this.canSubmit = false
  this.changeEvent = config.changeEvent || function(){}
  this.submitEvent = config.submitEvent || function(){}
  document.getElementById(this.el).querySelector('.content_edit').setAttribute("contenteditable",true)

}
/**
 * @description 展示评论框
 */
PgcCmt.prototype.show = function (){
    document.getElementById(this.el).style.display = "block";
    window.addEventListener("click", this.setHideClick);
}
 /**
 * @description 隐藏评论框
 */
PgcCmt.prototype.hide = function (){
  document.getElementById(this.el).style.display = "none";
  window.removeEventListener("click", this.setHideClick);
 }
/**
 * @description 判断类型
 * @param {*} obj 判断的对象
 * @param {*} str 类型
 * @returns {boolean}
 */
PgcCmt.prototype.isType = function (obj, str) {
  return !!~Object.prototype.toString.call(obj).indexOf(str)
}
/**
 * @description 初始化类型表情包面板
 */
PgcCmt.prototype.initEmoticonPlane = function () {
  const el = document.getElementById(this.el)
  const handleBox = el.querySelector('.handle_list')
  if (!handleBox) {
    throw Error('跟节点内必须有以handle_list为类的节点')
  }
  const iconPlane = document.createElement('div')
  const iconDiv = document.createElement('div')
  const tabPlane = document.createElement('ul')
  let icon_boxs = []
  iconPlane.classList.add('icon_list')
  iconDiv.classList.add('icon_box')
  tabPlane.classList.add('icon_tab')
  let tabInnerHtml = ""
  this.emoticon.forEach((item,index) => {
    let className = "tab_li"
    if(index === 0){
      className += " tab_current"
    }
    let width = item.width || 30;
    let height = item.height || 30
    tabInnerHtml += `<li class="${className}" ><img width="${width}" height="${height}" src="${item.icon}" /></li>`
    let divPlane = document.createElement('div')
    divPlane.classList.add('icon_plane')
    if(index !==0){
      divPlane.style.display = "none"
    }
    let listInnerHtml = ""
    item.list.forEach(url=>{
      listInnerHtml += `<li class="icon_item" ><img src="${url}" /></li>`
    })
    divPlane.innerHTML = listInnerHtml
    icon_boxs.push(divPlane)
  });
  icon_boxs.forEach(dom=>{
    iconDiv.appendChild(dom)
  })
  tabPlane.innerHTML = tabInnerHtml
  iconPlane.appendChild(tabPlane)
  iconPlane.appendChild(iconDiv)
  handleBox.appendChild(iconPlane)
  iconPlane.style.display = "none";
  let tabLists = iconPlane.querySelectorAll('.icon_tab li')
  if(tabLists){
    let tabArr = Array.from(tabLists)
    tabArr.forEach(item=>{
      item.addEventListener('click',function(){
        let index = tabArr.indexOf(this)
        tabArr.forEach((tabItem,i)=>{
          if(i == index){
            tabItem.classList.add('tab_current')
          }else{
            tabItem.classList.remove('tab_current')
          }
        })
        Array.from(iconPlane.querySelectorAll('.icon_plane')).forEach((pItem,count)=>{
          if(count == index){
            pItem.style.display = "block"
          }else{
            pItem.style.display = "none"
          }
        })
      })
    })
  }

}
/**
 * @description 初始化事件
 */
PgcCmt.prototype.initEvent = function () {
  const that = this;
  const el = document.getElementById(this.el)
  const inputDom = document.getElementById(this.el).querySelector('.content_edit')
  this.toLast(inputDom)
  el.querySelector('.em_icon').addEventListener('click', (e) => {
    e.stopPropagation();
    const iconPlane = document.getElementById(this.el).querySelector('.icon_list')
    const showIcon = iconPlane.style.display == 'block'
    iconPlane.style.display = showIcon ? 'none' : 'block'
    showIcon || this.getFouceInput();
  //   this.showIcon = !this.showIcon
  })
  const iconImg = el.querySelectorAll('.icon_item')
  for (let i = 0; i <= iconImg.length - 1; i++) {
    iconImg[i].addEventListener('click', function () {

      let src = this.querySelector('img').src
      that.innerEmoticon(src)
    })
  }
  inputDom.addEventListener('input', (e) => {
    that.changeText(e)
  })
  inputDom.addEventListener('blur', (e) => {
    that.getFouceInput();
  })
  el.querySelector('.btn_submit').addEventListener('click',function () {
      that.submitCmt()
  })
  if(this.config.initStatus){
      window.addEventListener("click", this.setHideClick);
  }else{
      document.getElementById(this.el).style.display = "none"
  }
}
/**
 * @description 插入表情
 * @param {string} url 表情链接
 */
PgcCmt.prototype.innerEmoticon = function (url) {
  const inputDom = document.getElementById(this.el).querySelector('.content_edit')
  this.canSubmit || (this.canSubmit = true);
  if(this.canSubmit){
      document.getElementById(this.el).querySelector('.btn_submit').classList.add('btn_submit_y')
  }
  let length = this.getCharLen(this.paseText(inputDom.innerHTML).text);
  if (this.limtText && length + 4 > this.limtText) return;

  const img = `<img src='${url}' width=${this.iconWidth} height=${this.iconHeight} />`;
  //  兼容性判断 如果不兼容不往下执行，虽然说不兼容IE9以下，但是还是做一下判断 方便后面灵活控制
  if (window.getSelection && window.getSelection().getRangeAt) {
    let winSn = this.widFouce,
      range = this.rangeFouce;
    //  要判断的光标状态
    if (
      winSn.focusNode.className !== "content_edit" &&
      winSn.focusNode.parentElement.className !== "content_edit"
    ) {
      winSn.selectAllChildren(inputDom);
      winSn.collapseToEnd();
      range = winSn.getRangeAt(0);
    }
    range.collapse(false);
    let node;
    if (range.createContextualFragment) {
      // 兼容IE9跟safari
      node = range.createContextualFragment(img);
    } else {
      let tempDom = document.createElement("div");
      tempDom.innerHTML = img;
      node = tempDom;
    }
    let dom = node.firstChild;
    range.insertNode(dom);
    let clRang = range.cloneRange();
    clRang.setStartAfter(dom);
    winSn.removeAllRanges();
    winSn.addRange(clRang);
    this.changeEvent(inputDom.innerHTML)
  } else {
    console.log("不兼容~");
  }
}
/**
 * @description 判断字符长度（空格&nbsp; 要当1个字符算，所以最后要给每个空格减去5）
 * @param {string} sSource 文本内容
 */
PgcCmt.prototype.getCharLen = function (sSource) {
  var l = 0;
  var schar;
  for (var i = 0;
    (schar = sSource.charAt(i)); i++) {
    l += schar.match(/[^\x00-\xff]/) != null ? 2 : 1;
  }
  let nbsp = sSource.match(/&nbsp;/gi);
  if (nbsp) {
    let len = nbsp.length;
    l = l - len * 5;
  }
  return l;
}
/**
 * @description 监听文本变化 （表情包插入时不触发该方法，只有输入时会触发，判断字数，要先把自定义表情改成占位符，一个自定义表情按2个字符算）
 * @param {Event} e 事件对象
 */
PgcCmt.prototype.changeText = function (e) {
    let text = e.srcElement.innerHTML;
    let emitText = text;
    if (this.limtText) {
      let textObj = this.paseText(text);
      let len = this.getCharLen(textObj.text);
      if (len > this.limtText) {
        let str = this.setCmtTextByLimit(textObj.text, textObj.key);
        emitText = textObj.isReplace ?
          this.reductionStr(text, str, textObj.key) :
          str;
        e.srcElement.innerHTML = emitText;
        this.toLast(e.srcElement);
      }
    }

    this.canSubmit = emitText.length ? true : false;
    const btn = document.getElementById(this.el).querySelector('.btn_submit')
    if(this.canSubmit && !~btn.className.indexOf('btn_submit_y') ){
      btn.classList.add('btn_submit_y')
    }else if(!this.canSubmit && ~btn.className.indexOf('btn_submit_y') ) {
      btn.classList.remove('btn_submit_y')
    }
    this.changeEvent(emitText)
  },
  /**
   * @description 解析文本内容，把图片全部用占位替换掉  跟换行相关（div，br）全部改成两个空格
   * @param {*} str 文本内容
   */
  PgcCmt.prototype.paseText = function (str) {
    let str1 = str.replace(/<div>|<\/div>|<br>/gi, "  ");
    let imgReg = /<img[^>]*src[=\'\"\s]+([^\"\']*)[\"\']?[^>]*>/gi;
    let imgMatch = str1.match(imgReg);
    let key = this.getRandomFour(str1);
    let isReplace = false;

    if (imgMatch) {
      isReplace = true;
      for (let i = 0; i < imgMatch.length; i++) {
        str1 = str1.replace(imgMatch[i], key);
      }
    }
    return {
      isReplace,
      key,
      text: str1
    };
  }
/**
  * @description 在时间戳里取随机4位数作为图片占位符的key，且如果文本中包含key则递归
  * @param {*} str  文本
  */
PgcCmt.prototype.getRandomFour = function (str) {
  let timeStr = new Date().getTime() + "";
  let result = "";
  for (let i = 0; i < 4; i++) {
    let nums = Math.floor(Math.random() * 13);
    result = result + timeStr[nums];
  }
  return str.indexOf(result) == -1 ? result : this.getRandomFour(str);
}
/**
 * @description 文字切割 如果超出文字限制需要切割
 * @param {*} sSource  文本内容
 * @param {*} key  图片占位符
 */
PgcCmt.prototype.setCmtTextByLimit = function (sSource, key) {
  let self = this;
  if (typeof sSource !== "string") return;
  var str = changeLast(sSource, key);
  if (this.getCharLen(str) <= this.limtText) return str;
  while (this.getCharLen(str) > this.limtText) {
    str =
      4 + str.lastIndexOf(key) == str.length ?
      str.substring(0, str.length - 4) :
      str.substring(0, str.length - 1);
  }

  function changeLast(strl, key) {
    // 一直切割到最后一个不为表情包或不超出限制为止
    while (
      4 + strl.lastIndexOf(key) == strl.length &&
      self.getCharLen(strl) > self.limtText
    ) {
      strl = sSource.substring(0, sSource.length - 4);
    }
    return strl;
  }
  return str;
}
/**
 * @description 解析内容，把图片全部用占位替换掉
 * @param {*} sourceText  源内容
 * @param {*} text 加入占位符的内容
 * @param {*} key  占位符
 */
PgcCmt.prototype.reductionStr = function (sourceText, text, key) {
  let imgReg = /<img[^>]*src[=\'\"\s]+([^\"\']*)[\"\']?[^>]*>/gi;
  let imgMatch = sourceText.match(imgReg);
  let result = text;
  if (imgMatch) {
    for (let i = 0; i < imgMatch.length; i++) {
      result = result.replace(key, imgMatch[i]);
    }
  }
  return result;
}
/**
 * @description 获取焦点
 */
PgcCmt.prototype.getFouceInput = function () {
  this.widFouce = window.getSelection();
  this.rangeFouce = this.widFouce.getRangeAt(0);
}
/**
 * // 将光标移到最后
 * @param {dom} obj 光标聚焦的dom元素
 */
PgcCmt.prototype.toLast = function (obj) {
  if (window.getSelection) {
    let winSel = window.getSelection();
    winSel.selectAllChildren(obj);
    winSel.collapseToEnd();
  }
}
/**
 * @description 点击表情框以外的区域关闭表情框
 * @param {*} event
 */
PgcCmt.prototype.setHideClick =  function(event){
    const that = this;
  const iconPlane = document.querySelectorAll('.icon_list')
  let target = event.srcElement;

  let nameList = ["icon_item", "icon_list", "icon_box","icon_tab","icon_plane","tab_li"];
  if( target.parentElement && target.parentElement.className.indexOf('tab_li') !== -1){
    return;
  }
  if (
    !nameList.includes(target.className) ||
    (target.parentElement &&
    (!nameList.includes(target.parentElement.className)))

  ) {
    for(let i = 0; i<= iconPlane.length-1; i++){
      iconPlane[i].style.display =  'none'
    }

  }
}
/**
 * @description 提交评论
 */
PgcCmt.prototype.submitCmt = function() {

  let text = document.getElementById(this.el).querySelector('.content_edit').innerHTML;
  let length = this.getCharLen(this.paseText(text).text);
  if (!this.canSubmit) return;
  if (this.text == "") {
      this.submitEvent(true,"评论为空",null)
    return;
  } else if (this.limtText && length > this.limtText) {
      this.submitEvent(true,"评论超出字数",null)
    return;
  }
  this.submitEvent(false,"",text,this.config.info)
  // self.$emit("submitSuccess", text, self.info);
}
