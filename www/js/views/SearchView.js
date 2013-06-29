"use strict";

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
        '           <label class="control-label" for="BIGnr">BIG nummer</label>' +
        '           <div class="controls div-padded">' +
        '               <input type="text" id="BIGnr" placeholder="BIG nummer">' +
        '           </div>' +
        '           <label class="control-label" for="initials">Voorletter(s)</label>' +
        '           <div class="controls div-padded">' +
        '               <input type="text" id="initials" placeholder="Voorletter(s)">' +
        '           </div>' +
        '           <label class="control-label" for="prefix">Voorvoegsel(s)</label>' +
        '           <div class="controls div-padded">' +
        '               <input type="text" id="prefix" placeholder="Voorvoegsel(s)">' +
        '           </div>' +
        '           <label class="control-label" for="name">Achternaam</label>' +
        '           <div class="controls div-padded">' +
        '               <input type="text" id="name" placeholder="Achternaam">' +
        '           </div>' +
        '           <div class="control-group">' +
        '             <label class="control-label" for="professionalgroup">Beroep</label>' +
        '             <div class="controls div-padded">' +
        '               <select id="professionalgroup"></select>' +
        '             </div>' +
        '           </div>' +
        '           <div class="control-group">' +
        '             <label class="control-label" for="typeofspecialism">Specialisme</label>' +
        '             <div class="controls div-padded">' +
        '               <select id="typeofspecialism"></select>' +
        '             </div>' +
        '           </div>' +
        '           <label class="control-label" for="mandatory-expl"></label>' +
        '           <div class="controls">' +
        '               <p id="mandatory-expl" class="text-info"><small><em><i class="icon-info-sign"></i> Vul minimaal BIG nr. of achternaam in.</em></small></p>' +
        '           </div>' +
        '           <div class="form-actions">' +
//        '               <a class="btn btn-primary" id="btnSubmit" href="#"><i class="icon-check"></i> Check</a>' +
        '               <button type="submit" id="btnSubmit" class="btn btn-primary"><i class="icon-check"></i> Check</button>' +
        '               <a class="btn btn-inverse" id="btnReset" href="#"><i class="icon-eraser"></i> Wis Invoer</a>' +
        '           </div>' +
        '       </div>' +
        '   </fieldset>' +
        '</form></br></br></br></br></br></br></br></br>'
    );

    // take care of valid input of initials (only characters, upper cased and with dots)
    var initials = $("#initials");
    initials.focus(function() {
        initials.blur(function() {
            var i = initials.val();
            i = i.replace(/\./g, '');   // remove all dots
            i = i.replace(/\s+/g, ' '); // remove all spaces
            i = i.split('').join('.');  // add a dot after every character
            var last = i[i.length - 1];
            if (last != "." && i.length !== 0) {
                i += ".";
            }
            this.value = i.toUpperCase();
        });
    });

    // capitalize first letter of every word in the name
    var name = $("#name");
    name.focus(function() {
        name.blur(function() {
            this.value = capitaliseFirstLetterOfEveryWord(name.val());
        });
    });

    // capitalize first letter of every word in the prefix
    var prefix = $("#prefix");
    prefix.focus(function() {
        var current = prefix.val();
        prefix.blur(function() {
            this.value = capitaliseFirstLetterOfEveryWord(prefix.val());
        });
    });

    this.clearPopovers = function() {
        $('#btnSubmit').popover('destroy');
        $('#BIGnr').popover('destroy');
    };

    // controleer dat iig bigNr of achternaam is ingevuld en dat het bignr nummeriek is.
    this.validInput = function() {
        var bigNr = $('#BIGnr');
        var bigNrVal = bigNr.val().trim();
        var name = $('#name');
        var nameVal = name.val().trim();
        var btnSubmit = $('#btnSubmit');

        btnSubmit.popover({html: 'true', content: '<p class="text-error"><strong><i class="icon-warning-sign"></i><small> <em>Vul in ieder geval het BIG nummer en/of de achternaam in, eventueel gecombineerd met overige zoekcriteria!</em><small></strong></p>', placement: 'top'});
        if (!isDefined(bigNrVal) && !isDefined(nameVal)) {
            btnSubmit.popover('show');
            $(".popover")
                .unbind("click")
                .bind("click", function() {
                  searchView.clearPopovers();
            });
            return false;
        } else {
            btnSubmit.popover('destroy');
        }

        var numbers = /^[0-9]+$/;
        bigNr.popover({html: 'true', content: '<p class="text-error"><strong><i class="icon-warning-sign"></i><small> <em>BIG nummer is niet numeriek!</em><small></strong></p>', placement: 'bottom'});
        if(isDefined(bigNrVal) && !(bigNrVal.match(numbers))){
            bigNr.popover('show');
            $(".popover")
                .unbind("click")
                .bind("click", function() {
                  searchView.clearPopovers();
            });
            return false;
        } else {
            bigNr.popover('destroy');
            return true;
        }
    };
}
