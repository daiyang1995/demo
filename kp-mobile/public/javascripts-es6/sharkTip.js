/**
 * http://usejsdoc.org/

 */
'use strict';
function sharkTip(){}
let sharkArray = [];
sharkArray[0] = false;

/**
 * @param json
 * @param {{msg:String}} 提示信息
 * @param {{needShark:boolean}} 是否需要晃动
 * @param {{shakZindex:int}} 设置z-index
 * @param {{sharkCss:json}} json 自定义css 例子: "postion":"fixed","width":"70%"
 */
sharkTip.init = (json)=> {
    let msg = json.msg ? json.msg : "内容";
    let needShark = json.needShark == true ? true: false;
    let shakZindex = json.sharkZindex ? json.sharkZindex : 9871229;
    let sharkCss = json.sharkCss ? json.sharkCss : "";
    let thisSharkId = --sharkArray.length;
    sharkArray[thisSharkId] = needShark;
    sharkArray[sharkArray.length] = false;

    $("body").append(`<div id="shark${thisSharkId}" class="shark" style="z-index: ${shakZindex}"><span>${msg}</span></div>`);

    if(sharkCss !=""){
        $(`#shark${thisSharkId}`).css(sharkCss);
    }
    return thisSharkId;
}
sharkTip.show = (thisSharkId , msg ="内容" , fadeinTime= 400 , hideTime=2000)=>{
    $(`#shark${thisSharkId} span`).html(`${msg} !`);
    $(`#shark${thisSharkId}`).fadeIn(fadeinTime);
    if(sharkArray[thisSharkId]){
        $(`#shark${thisSharkId} span`).addClass("sharkSpan")
    }
    setTimeout(()=>{
        $(`#shark${thisSharkId}`).fadeOut(fadeinTime);
    } , hideTime)
}

