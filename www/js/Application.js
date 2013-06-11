"use strict";

var store;
var appController;
var searchView;
var resultView;
// Google Analytics
var gaPlugin;

function googleAnalytics(page) {
    if (gaPlugin !== undefined) {
        alert('googleAnalytics - page - '+page);
        gaPlugin.trackPage(nativePluginResultHandler, nativePluginErrorHandler, page);
    } else {
        alert('google analytics is not !=== undefined, but:' + gaPlugin);
    }
}

function nativePluginResultHandler (result) {
    alert('nativePluginResultHandler - '+result);
}

function nativePluginErrorHandler (error) {
    alert('nativePluginErrorHandler - '+error);
}

function goingAway() {
    gaPlugin.exit(nativePluginResultHandler, nativePluginErrorHandler);
}

// construct and execute a System setup class
(function System() {

    var onDeviceReady = function() {
        appController = new AppController();
        store = new MemoryStore();
        searchView = new SearchView();
        resultView = new ResultView();
        appController.init();
        if (window.plugins != undefined) {
            gaPlugin = window.plugins.gaPlugin;
            gaPlugin.init(nativePluginResultHandler, nativePluginErrorHandler, "UA-41593795-2", 10);
        }
    };

    var init = function() {
        $(document).ready(function() {
            if (isMobile()) {
                document.addEventListener('deviceready', onDeviceReady, false);
            } else {
                onDeviceReady();
            }
            FastClick.attach(document.body);
        });
    };

    init();
})();