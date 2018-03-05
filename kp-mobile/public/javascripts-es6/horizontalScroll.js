/**
 * http://usejsdoc.org/

 */
'use strict';

function horizontalScroll() {
}
/**
 * 横向滚动
 * @param json
 * @param {{speed:int}} 滚动速度(默认  '50' )
 * @param {{scroll_begin:String}} 滚动开始标签的id(默认  'scroll_begin' )
 * @param {{scroll_end:String}} 滚动结束标签的id(默认  'scroll_end' )
 * @param {{scroll_div:String}} 包裹scroll_begin，scroll_end 的标签id (默认  'scroll_div' )
 * @param {{gongao:String}} 最外层 的标签id (默认  'gongao' )
 * @param {{height:String}} 高度 (默认  '30px' )
 *
 * 例子
 * <div id="gongao">
 *     <div style="width:900px;height:30px;margin:0 auto;white-space: nowrap;overflow:hidden;" id="scroll_div" class="scroll_div">
 *          <div id="scroll_begin">
 *              ${affiche.content} ${affiche.content} ${affiche.content}
 *              ${affiche.content} ${affiche.content} ${affiche.content}
 *          </div>
 *          <div id="scroll_end"></div>
 *      </div>
 * </div>
 */
horizontalScroll.init = (json)=>{
    let speed,scroll_begin,scroll_end,scroll_div,gongao,height;
    if( json ) {
        if (json.speed) {
            speed = json.speed;
        }
        else {
            speed = 50;
        }
        if(json.scroll_begin){
            scroll_begin = document.getElementById(json.scroll_begin);
        }else{
            scroll_begin = document.getElementById("scroll_begin");
        }
        if(json.scroll_end){
            scroll_end = document.getElementById(json.scroll_end);
        }else{
            scroll_end = document.getElementById("scroll_end");
        }
        if(json.scroll_div){
            scroll_div = document.getElementById(json.scroll_div);
        }else{
            scroll_div = document.getElementById("scroll_div");
        }
        if(json.gongao){
            gongao =document.getElementById(json.gongao);
        }else{
            gongao = document.getElementById("gongao");
        }
        if(json.height){
            height = json.height;
        }else{
            height = "30px";
        }
    }else{
        speed=50;
        scroll_begin = document.getElementById("scroll_begin");
        scroll_end = document.getElementById("scroll_end");
        scroll_div = document.getElementById("scroll_div");
        gongao = document.getElementById("gongao");
        height = "30px";
    }
    gongao.style.cssText = gongao.style.cssText +　"overflow:hidden;line-height:"+height +";height:"+height+";";
    scroll_div.style.cssText  =  scroll_div.style.cssText + ";white-space: nowrap !important;overflow:hidden !important;height"+height+";";
    scroll_begin.innerHTML +=scroll_begin.innerHTML;
    scroll_end.innerHTML=scroll_begin.innerHTML;
    function Marquee(){
        console.log(scroll_div.scrollLeft);
        if(scroll_end.offsetWidth-scroll_div.scrollLeft<=0){
            scroll_div.scrollLeft = scroll_div.scrollLeft % 1;
        }else{
            if(scroll_div.scrollLeft + 1 >scroll_end.offsetWidth ){
                scroll_div.scrollLeft = scroll_end.offsetWidth +1;
            }else
                scroll_div.scrollLeft  = scroll_div.scrollLeft + 1;
        }
    }
    var MyMar=setInterval(Marquee,speed);
    scroll_div.onmouseover=function() {clearInterval(MyMar);};
    scroll_div.onmouseout=function() {MyMar=setInterval(Marquee,speed);}
};