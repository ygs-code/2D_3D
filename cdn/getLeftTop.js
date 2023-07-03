/*
parentNote和offsetParent的区别是：
parentNote指当前元素的父级，
offsetParent则是指当前元素最近的定位父级，
存在很多兼容性问题，且用且谨慎。
*/

function offsetTop(element) {
    var top = 0;
    var left = 0;
    while (element !== null) {
        top += element.offsetTop;
        left += element.offsetLeft;
        element = element.offsetParent;
    }
    return { top, left };
}
