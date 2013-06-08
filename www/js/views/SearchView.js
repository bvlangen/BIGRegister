"use strict";

/*
 <label class="radio">
 <input type="radio" name="optionsRadios" id="optionsRadios1" value="option1" checked>
 Option one is this and that—be sure to include why it's great
 </label>
 <label class="radio">
 <input type="radio" name="optionsRadios" id="optionsRadios2" value="option2">
 Option two can be something else and selecting it will deselect option one
 </label>
 */

function SearchView() {
    $("#tab-search").html('' +
        '<form id="search-form" class="form-horizontal">' +
        '    <fieldset>' +
        '       <div class="control-group">' +
        '           <label class="control-label">Geslacht</label>' +
        '           <div class="controls">' +
        '               <label class="radio inline">' +
        '               <input type="radio" name="genderRadios" value="M">Man</label>' +
        '               <label class="radio inline">' +
        '               <input type="radio" name="genderRadios" value="V">Vrouw</label>' +
        '           </div>' +
        '       </div>' +
        '       <div class="control-group">' +
        '           <label class="control-label" for="initials">Voorletter(s)</label>' +
        '           <div class="controls">' +
        '               <input type="text" id="initials" placeholder="Voorletter(s)">' +
        '           </div>' +
        '           <label class="control-label" for="prefix">Voorvoegsel(s)</label>' +
        '           <div class="controls">' +
        '               <input type="text" id="prefix" placeholder="Voorvoegsel(s)">' +
        '           </div>' +
        '           <label class="control-label" for="name">Achternaam</label>' +
        '           <div class="controls">' +
        '               <input type="text" id="name" placeholder="Achternaam" required> <i class="icon-hand-left"></i>' +
        '           </div>' +
        '           <label class="control-label" for="professionalgroup">Beroep</label>' +
        '           <div class="controls">' +
        '               <select id="professionalgroup"></select>' +
        '           </div>' +
        '           <label class="control-label" for="typeofspecialism">Specialisme</label>' +
        '           <div class="controls">' +
        '               <select id="typeofspecialism"></select>' +
        '           </div>' +
        '           <div class="controls">' +
        '               <p id="mandatory-expl" class="muted"><i class="icon-hand-left"></i><em> = verplicht</em></p>' +
        '           </div>' +
        '           <div class="form-actions">' +
        '               <a class="btn btn-primary" id="btnSubmit" href="#"><i class="icon-ok icon-white"></i> Check Doc</a>' +
        '               <a class="btn btn-warning" id="btnReset" href="#"><i class="icon-remove icon-white"></i> Wis alles</a>' +
        '           </div>' +
        '       </div>' +
        '   </fieldset>' +
        '</form>'
    );

    this.validInput = function() {
        var name = $('#name');
        $(name).popover({html: 'true', content: '<p><strong><small><i class="icon-warning-sign"></i> <em>Achternaam is leeg!</em><small></strong></p>', placement: 'bottom'});
        if (name.val().trim() == '') {
            $(name).val('');
            $(name).popover('show');
            return false;
        } else {
            $(name).popover('destroy');
            return true;
        }
    }
}
