"use strict";
var SelectHandler = function() {

    this.initializeSelect = function(select, items) {
        var output = [];
        for(var i = 0, len = items.length; i < len; i++){
            output.push('<option value="' + items[i].id+'">' + items[i].name + '</option>');
        }
        $('#'+select).append(output.join('')).selectmenu('refresh');
    };

    this.updateSpecialismsSelect = function() {
        var typeOfSpecialismSelect = $('#typeofspecialism');
        typeOfSpecialismSelect.empty();
        var output = [];
        var professionId = $('#professionalgroup').val();
        var items;
        if (professionId == "00") {
            items = app.store.listSpecialisms();
        } else {
            items = app.store.findSpecialismsForProfessionalsGroupId(professionId);
            if (items.length > 0) {
                output.push('<option value="00">-- Maak een keuze --</option>');
            } else {
                output.push('<option value="00">-- Geen specialisme aanwezig --</option>');
            }
        }

        for(var i = 0, len = items.length; i < len; i++){
            output.push('<option value="' + items[i].id+'">' + items[i].name + '</option>');
        }
        typeOfSpecialismSelect.append(output.join('')).selectmenu('refresh');
    }

};