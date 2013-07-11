"use strict";

function AppController() {

    function executeSoapCall() {
        // show result tab as soon as possible
        $('#tabs a[href="#tab-search-result"]').tab('show');
        window.scrollTo(0, 0);
        resultView.showProgressBarAndMessage();

        var gender = $('input[name=genderRadios]:checked', '#search-form').val();
        var initials = $('#initials').val();
        var prefix = $('#prefix').val();
        var name = $('#name').val();
        var bigNr = $('#BIGnr').val();
        var professionalgroup = $('#professionalgroup').val();
        var typeofspecialism = $('#typeofspecialism').val();

        var method = "listHcpApprox";
//        var url = "http://webservices-acc.cibg.nl/Ribiz/OpenbaarV2.asmx"; // acceptatie
        var url = "http://webservices.cibg.nl/Ribiz/OpenbaarV2.asmx";  // productie
        var params = new SOAPClientParameters();
        params.add("WebSite", "Ribiz");
        if (isDefined(bigNr)) params.add("RegistrationNumber", bigNr.trim());
        if (isDefined(name)) params.add("Name", name.trim());
        if (isDefined(initials)) {
            // add a '.' when not last character
            var initialsFixed = initials.trim();
            if (initialsFixed.charAt(initialsFixed.length-1) != '.') {
                initialsFixed += '.';
            }
            params.add("Initials", initialsFixed);
        }
        if (isDefined(gender)) params.add("Gender", gender);
        if (professionalgroup != "00") { // Default 'selecteer'
            params.add("ProfessionalGroup", professionalgroup);
        }
        if (typeofspecialism != "00") { // Default 'selecteer'
            params.add("TypeOfSpecialism", typeofspecialism);
        }
        SOAPClient.invoke(url, method, params, resultView.Response_callBack);
    }

    // PhoneGap functionality - Supported platforms: iOS, Android, BlackBerry WebWorks (OS 5.0 and higher)
    function connectionAvailable() {
        return navigator.network.connection.type != Connection.NONE;
    }

    function _updateSpecialismsSelect() {
        var professionId = $('#professionalgroup').val();
        var output = [];
        var items;
        if (professionId == "00") {
            items = store.listSpecialisms();
        } else {
            items = store.findSpecialismsForProfessionalsGroupId(professionId);
            if (items.length > 0) {
                output.push('<option value="00">-- Maak een keuze --</option>');
            } else {
                output.push('<option value="00">-- Geen specialismes --</option>');
            }
        }
        for(var i = 0, len = items.length; i < len; i++){
            output.push('<option value="' + items[i].id+'">' + items[i].name + '</option>');
        }
        $('#typeofspecialism').empty().append(output.join(''));
    }

    function _initializeSelect(select, items) {
        var output = [];
        for(var i = 0, len = items.length; i < len; i++){
            output.push('<option value="' + items[i].id+'">' + items[i].name + '</option>');
        }
        $('#'+select).empty().append(output.join(''));
    }

    function _initSelectLists() {
        _initializeSelect('professionalgroup', store.listProfessionalGroups());
        _initializeSelect('typeofspecialism', store.listSpecialisms());
    }

    function _initOnChangeProfessionalGroup() {
        $('#professionalgroup').on('change', function (e) {
            _updateSpecialismsSelect();
        });
    }

    function _initOnClickBtnReset() {
        $('#btnReset').on('click', function (e) {
            googleAnalytics("searchview-reset-form");
            $("#search-form")[0].reset();
            $('#professionalgroup').val('00');
            _initializeSelect('typeofspecialism', store.listSpecialisms());
            resultView.clearView();
            searchView.clearPopovers();
        });
    }

    function _initOnClickBtnSubmit() {
        $('#search-form')
            .unbind("submit")
            .bind("submit", function(e) {
                e.stopPropagation();
                e.preventDefault();
                if (searchView.validInput()) {
                    googleAnalytics("searchview-submit-form");
                    if (!isMobile() || connectionAvailable()) {
                        executeSoapCall();
                    } else {
                        alert('Er is geen verbinding met het Internet! Controleer uw verbinding.');
                    }
                } else {
                    googleAnalytics("searchview-submit-form-invalid-input");
                }
            });
    }

    var activeTab = '#tab-search'; // default search tab on startup
    function _initActiveTabTracking() {
        $('a[data-toggle="tab"]').on('shown', function (e) {
            activeTab = $(e.target).attr('href'); // activated tab
        });
    }

    function _exitFromApp(buttonIndex) {
        if (buttonIndex==2){
            navigator.app.exitApp();
        }
    }

    function _initBackButton(){
        document.addEventListener("backbutton", function(e) {
            if(activeTab == '#tab-search'){
                e.preventDefault();
                navigator.notification.confirm(
                    'Wilt u het BIG Register afsluiten?', // message
                    _exitFromApp,                         // callback to invoke with index of button pressed
                    'Hierdoor sluit u de app',            // title
                    'Nee,Ja'                              // buttonLabels
                );
            }
            else {
                $('#tabs a[href="#tab-search"]').tab('show');
                window.scrollTo(0, 0);
            }
        }, false);
    }

    this.init = function() {
        _initSelectLists();
        _initOnChangeProfessionalGroup();
        _initOnClickBtnReset();
        _initOnClickBtnSubmit();
        _initBackButton();
        _initActiveTabTracking();

    }
}