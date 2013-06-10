"use strict";

function isDefined(variable) {
    return variable !=null && variable !== 'undefined' && variable != ''

}

function googleAnalytics(page) {
//    if (gaPlugin !== undefined) {
//        gaPlugin.trackPage(emptyCallback, emptyCallback, page);
//    }
}

function isAndroid() {
    return navigator.userAgent.toLowerCase().indexOf("android") > -1;
}

function isIOS() {
    return navigator.userAgent.match(/(iPad|iPhone|iPod)/i);
}

function isMobile() {
    return isIOS() || isAndroid();
}