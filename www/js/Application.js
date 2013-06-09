"use strict";

var store;
var appController;
var searchView;
var resultView;
// Google Analytics
var gaPlugin;

function GAStartupSuccess() {
    googleAnalytics("startup");
}

// construct and execute a System setup class
(function System() {

    var onDeviceReady = function() {
        appController = new AppController();
        store = new MemoryStore();
        searchView = new SearchView();
        resultView = new ResultView();
        appController.init();
        document.addEventListener("menubutton", function(){$('#menu').collapse('toggle')}, false);
        if (window.plugins != undefined) {
            gaPlugin = window.plugins.gaPlugin;
            gaPlugin.init(GAStartupSuccess, emptyCallback, "UA-41593795-1", 5);
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