"use strict";

var app = {
    showAlert: function (message, title) {
        if (navigator.notification) {
            navigator.notification.alert(message, null, title, 'OK');
        } else {
            alert(title ? (title + ": " + message) : message);
        }
    },

    initializeDataSource: function() {
        this.store = new MemoryStore();
    },

    initializeSelect: function(select, items) {
        var output = [];
        for(var i = 0, len = items.length; i < len; i++){
            output.push('<option value="' + items[i].id+'">' + items[i].name + '</option>');
        }
        $('#'+select).append(output.join('')).selectmenu('refresh');
    },

    initSwipeingPages: function () {
        $(document).ready(function () {

            $('.search-page').live('swipeleft swiperight', function (event) {
                console.log(event.type);
                if (event.type == "swipeleft") {
                    var prev = $("#prevlink", $.mobile.activePage);
                    if (prev.length) {
                        var prevurl = $(prev).attr("href");
                        console.log(prevurl);
                        $.mobile.changePage(prevurl);
                    }
                }
                if (event.type == "swiperight") {
                    var next = $("#nextlink", $.mobile.activePage);
                    if (next.length) {
                        var nexturl = $(next).attr("href");
                        console.log(nexturl);
                        $.mobile.changePage(nexturl);
                    }
                }
                event.preventDefault();
            });
        });
    },

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.setupApplication('deviceready');
    },

    // Update DOM on a Received Event - for now setup app as only event is deviceready
    setupApplication: function(id) {
        this.initializeDataSource();

        this.initializeSelect('professionalgroup', app.store.listProfessionalGroups());
        this.initializeSelect('typeofspecialism', app.store.listSpecialisms());
        this.initSwipeingPages();
    }
};
