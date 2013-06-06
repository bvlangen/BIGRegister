"use strict";

var app = {

    soapCall:
        function()
        {
            var initials = $('#initials').val();
            var prefix = $('#prefix').val();
            var name = $('#name').val();
            var postcode = $('#postcode').val();
            var professionalgroup = $('#professionalgroup').val();
            var typeofspecialism = $('#typeofspecialism').val();

            var url = "http://webservices-acc.cibg.nl/Ribiz/OpenbaarV2.asmx";
            var method = "listHcpApprox";

            var params = new SOAPClientParameters();
            params.add("WebSite", "Ribiz");
            if (isDefined(name)) params.add("Name", name);
            if (isDefined(initials)) params.add("Initials", initials);
//            if (isDefined(postcode)) params.add("Postalcode", postcode);
            if (professionalgroup != "00") { // Default 'selecteer'
                params.add("ProfessionalGroup", professionalgroup);
            }
            if (typeofspecialism != "00") { // Default 'selecteer'
                params.add("TypeOfSpecialism", typeofspecialism);
            }
            SOAPClient.invoke(url, method, params, Response_callBack);

        function Response_callBack(r)
        {
            $.mobile.changePage('#search-result', { transition: "slide", changeHash: true, reverse: false });

//            setTimeout(function() {

            // refresh the result
            var result = $('#result');
//            result.empty();

            var htmlLoopedSearchResult = "";
            for (var i=0;i< r.ListHcpApprox.length;i++) {

                var listHcpApprox = r.ListHcpApprox[i];
                var foundPeronName = listHcpApprox.MailingName + " (" + listHcpApprox.Gender + ")";

                htmlLoopedSearchResult +=
                    "<div data-role='collapsible'>" +
                        "<h2>" + foundPeronName + "</h2>" +
                        "<ul data-role='listview' data-theme='c' data-divider-theme='d'>" +
                        "<li>" +
                        "<table border='1'>" +
                        "<tr><td>Zorgverlener nummer</td><td valign='top'>" + listHcpApprox.HcpNumber + "</td></tr>" +
                        "<tr><td>Aanschrijfnaam</td><td>" + listHcpApprox.MailingName  + "</td></tr>";

                if(isDefined(listHcpApprox.WorkAddress1)){
                    htmlLoopedSearchResult +=
                        "<tr><td valign='top'>Werkadres</td><td>" +
                            "<table>" +
                                "<tr><td>" + listHcpApprox.WorkAddress1.StreetName + " " + listHcpApprox.WorkAddress1.HouseNumber +"</td></tr>"  +
                                "<tr><td>" + listHcpApprox.WorkAddress1.PostalCode + " " + listHcpApprox.WorkAddress1.City +"</td></tr>"  +
                            "</table>" +
                        "</td></tr>";
                }

                if(isDefined(listHcpApprox.WorkAddress2)){
                    htmlLoopedSearchResult +=
                        "<tr><td valign='top'>Werkadres 2</td><td>" +
                            "<table>" +
                                "<tr><td>" + listHcpApprox.WorkAddress2.StreetName + " " + listHcpApprox.WorkAddress2.HouseNumber +"</td></tr>"  +
                                "<tr><td>" + listHcpApprox.WorkAddress2.PostalCode + " " + listHcpApprox.WorkAddress2.City +"</td></tr>"  +
                            "</table>" +
                        "</td></tr>";
                }

                if(isDefined(listHcpApprox.WorkAddress3)){
                    htmlLoopedSearchResult +=
                        "<tr><td valign='top'>Werkadres 3</td><td>" +
                            "<table>" +
                                "<tr><td>" + listHcpApprox.WorkAddress3.StreetName + " " + listHcpApprox.WorkAddress3.HouseNumber +"</td></tr>"  +
                                "<tr><td>" + listHcpApprox.WorkAddress3.PostalCode + " " + listHcpApprox.WorkAddress3.City +"</td></tr>"  +
                            "</table>" +
                        "</td></tr>";
                }

                if (isDefinedList(listHcpApprox.ArticleRegistration)) {
                    htmlLoopedSearchResult += "<tr valign='top'><td>Beroepsgroep</td><td>";
                    for (var j=0;j< listHcpApprox.ArticleRegistration.length;j++) {
                        var id = listHcpApprox.ArticleRegistration[j].ProfessionalGroupCode;
                        htmlLoopedSearchResult += app.store.findProfessionalGroupById(id).name + "<br/>Sinds: " + listHcpApprox.ArticleRegistration[j].ArticleRegistrationStartDate;
                    }
                    htmlLoopedSearchResult += "</td></tr>";
                }

                if (isDefinedList(listHcpApprox.Specialism)) {
                    htmlLoopedSearchResult += "<tr valign='top'><td>Specialisme(s)</td><td>";
                    for (var j=0;j< listHcpApprox.Specialism.length;j++) {
                        var id = listHcpApprox.Specialism[j].TypeOfSpecialismId;
                        htmlLoopedSearchResult += app.store.findSpecialismById(id).name + "<br/>Sinds: " + listHcpApprox.Specialism[j].StartDate;
                    }
                    htmlLoopedSearchResult += "</td></tr>";
                }

                if (isDefinedList(listHcpApprox.Mention)) {
                    htmlLoopedSearchResult += "<tr valign='top'><td>Vermeldingen</td><td>";
                    for (var j=0;j< listHcpApprox.Mention.length;j++) {
                        htmlLoopedSearchResult += listHcpApprox.Mention[j] + "; ";
                    }
                    htmlLoopedSearchResult += "</td></tr>";
                }

                if (isDefinedList(listHcpApprox.JudgmentProvision)) {
                    htmlLoopedSearchResult += "<tr valign='top'><td>Bevoegdheids beperkingen: </td><td>";
                    for (var j=0;j< listHcpApprox.JudgmentProvision.length;j++) {
                        htmlLoopedSearchResult += listHcpApprox.JudgmentProvision[j].PublicDescription;
                    }
                    htmlLoopedSearchResult += "</td></tr>";
                }

                if (isDefined(listHcpApprox.Limitation)) {
                    htmlLoopedSearchResult += "<tr valign='top'><td>Beperking:</td><td>" + listHcpApprox.Limitation + "</td></tr>";
                }
                htmlLoopedSearchResult += "</table>" +

                    "</li>" +
                    "</ul>" +
                    "</div>";
            }

            // add the result
            result.html(htmlLoopedSearchResult);

            var collapsibleSet = $('#collapsibleSet');
            collapsibleSet.trigger("create");  // need to create otherwise style is gone
            collapsibleSet.find('div[data-role=collapsible]').collapsible({refresh:true});
//            }, 500);
        }
    },

    initSwipeingPages: function () {
        $(document).on('pageinit', function () {

            $('.search-page').on('swipeleft swiperight', function (event) {
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
        this.store = new MemoryStore();
        this.selectHandler = new SelectHandler();
        FastClick.attach(document.body);
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

        this.selectHandler.initializeSelect('professionalgroup', this.store.listProfessionalGroups());
        this.selectHandler.initializeSelect('typeofspecialism', this.store.listSpecialisms());

        this.initSwipeingPages();
    }
};
