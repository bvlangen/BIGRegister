"use strict";

var store;
var appController;
var searchView;
var resultView;

// construct and execute a System setup class
(function System() {

    var onDeviceReady = function() {
        appController = new AppController();
        store = new MemoryStore();
        searchView = new SearchView();
        resultView = new ResultView();
        appController.init();
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