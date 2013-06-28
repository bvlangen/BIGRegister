"use strict";

function isDefined(variable) {
    return variable !=null && variable !== 'undefined' && variable != ''
}

function capitaliseFirstLetterOfEveryWord(string) {
    if (isDefined(string)) {
        return string.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    } else {
        return string;
    }
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