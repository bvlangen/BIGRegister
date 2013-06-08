"use strict";

function AppController() {

    function executeSoapCall() {
        var gender = $('input[name=genderRadios]:checked', '#search-form').val();
        var initials = $('#initials').val();
        var prefix = $('#prefix').val();
        var name = $('#name').val();
        var professionalgroup = $('#professionalgroup').val();
        var typeofspecialism = $('#typeofspecialism').val();

        var method = "listHcpApprox";
        var url = "http://webservices-acc.cibg.nl/Ribiz/OpenbaarV2.asmx"; // acceptatie
//        var url = "http://webservices.cibg.nl/Ribiz/OpenbaarV2.asmx";  // productie
        var params = new SOAPClientParameters();
        params.add("WebSite", "Ribiz");
        if (isDefined(name)) params.add("Name", name.trim());
        if (isDefined(initials)) params.add("Initials", initials.trim());
        if (isDefined(gender)) params.add("Gender", gender);
        if (professionalgroup != "00") { // Default 'selecteer'
            params.add("ProfessionalGroup", professionalgroup);
        }
        if (typeofspecialism != "00") { // Default 'selecteer'
            params.add("TypeOfSpecialism", typeofspecialism);
        }
        SOAPClient.invoke(url, method, params, resultView.Response_callBack);
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
//        select.empty().append(output.join(''));
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
            $("#search-form")[0].reset();
            $('#professionalgroup').val('00');
            _initializeSelect('typeofspecialism', store.listSpecialisms());
            resultView.clearView();
        });
    }

    function _initOnClickBtnSubmit() {
        $('#btnSubmit').on('click', function (e) {
            if (searchView.validInput()) {
                console.log("Executing SOAP-call");
                executeSoapCall();
            }
        });
    }

    this.init = function() {
        _initSelectLists();
        _initOnChangeProfessionalGroup();
        _initOnClickBtnReset();
        _initOnClickBtnSubmit();
    }
}