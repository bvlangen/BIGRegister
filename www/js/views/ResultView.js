"use strict";

function ResultView() {

    Handlebars.registerHelper('translateprofession', function(object) {
        var id = object;
        if (id.length != 2) id = '0' + id; // shitty interface fix
        return new Handlebars.SafeString(
            store.findProfessionalGroupById(id).name
        );
    });
    Handlebars.registerHelper('translatespecialism', function(object) {
        var id = object;
        if (id.length != 2) id = '0' + id;  // shitty interface fix
        return new Handlebars.SafeString(
            store.findSpecialismById(id).name
        );
    });
    Handlebars.registerHelper('datepart', function(object) {
        var result = '';
        if (object != null) {
            var dd = object.getDate();
            if ( dd < 10 ) dd = '0' + dd;
            var mm = object.getMonth()+1;
            if ( mm < 10 ) mm = '0' + mm;
            var yyyy = object.getFullYear();
            result = dd+'-'+mm+'-'+yyyy;
        }
        return new Handlebars.SafeString(
            result
        );
    });
    var compiledTemplate = Handlebars.compile(
        '{{#ListHcpApprox}}' +
            '<div class="accordion-group">' +
            '    <div class="accordion-heading">' +
            '        <a class="accordion-toggle" data-toggle="collapse" data-parent="#search-result-accordion" href="#collapse{{HcpNumber}}">' +
            '           <p>{{#each JudgmentProvision}}<strong class="text-error"><i class="icon-exclamation"></i>  </strong>{{/each}}{{#each ArticleRegistration}}{{#if ArticleRegistrationEndDate}}<strong class="text-error"><i class="icon-warning-sign"></i>  </strong>{{/if}}{{/each}}{{MailingName}} ({{Gender}}) </p>' +
            '        </a>' +
            '    </div>' +
            '    <div id="collapse{{HcpNumber}}" class="accordion-body collapse">' +
            '        <div class="accordion-inner">' +
            '           <table class="table table-striped">' +
            '               <tbody>' +
            '                   <tr><td>Zorgverlener nummer</td><td>{{HcpNumber}}</td></tr>' +
            '                   <tr><td>Aanschrijfnaam</td><td>{{MailingName}}</td></tr>' +
            '                   {{#if WorkAddress1}}<tr><td>Werkadres 1</td><td><address>{{WorkAddress1.StreetName}} {{WorkAddress1.HouseNumber}}<br>{{WorkAddress1.PostalCode}} {{WorkAddress1.City}}</address></td></tr>{{/if}}' +
            '                   {{#if WorkAddress2}}<tr><td>Werkadres 2</td><td><address>{{WorkAddress2.StreetName}} {{WorkAddress2.HouseNumber}}<br>{{WorkAddress2.PostalCode}} {{WorkAddress2.City}}</address></td></tr>{{/if}}' +
            '                   {{#if WorkAddress3}}<tr><td>Werkadres 3</td><td><address>{{WorkAddress3.StreetName}} {{WorkAddress3.HouseNumber}}<br>{{WorkAddress3.PostalCode}} {{WorkAddress3.City}}</address></td></tr>{{/if}}' +
            '                   <tr><td>Beroep</td><td>{{#each ArticleRegistration}}{{{translateprofession ProfessionalGroupCode}}}<br>- BIG-nr {{{ArticleRegistrationNumber}}} {{#if ArticleRegistrationEndDate}} <span class="text-error"><strong>(Doorgehaald: {{{datepart ArticleRegistrationEndDate}}})</strong></span><p class="text-error"><strong><i class="icon-warning-sign"></i> De inschrijving van deze zorgverlener is doorgehaald. Deze zorgverlener mag niet werken in zijn/haar beroep.</strong></p> {{else}} (sinds {{{datepart ArticleRegistrationStartDate}}})<br>{{/if}} {{/each}}</td></tr>' +
            '                   <tr><td>Specialisme(s)</td><td>{{#each Specialism}}{{{translatespecialism TypeOfSpecialismId}}} (sinds {{{datepart StartDate}}})<br>{{/each}}</td></tr>' +
            '                   {{#each JudgmentProvision}}<tr><td>Bevoegdheids beperking</td><td>{{{PublicDescription}}}</td></tr>{{/each}}' +
            '               </tbody>' +
            '           </table>' +
            '         </div>' +
            '    </div>' +
            '</div>' +
        '{{/ListHcpApprox}}');

    this.Response_callBack = function(result)
    {
        if (result.ListHcpApprox.length > 50) showMoreResultsModal();
        else if (result.ListHcpApprox.length > 0) {
            var templateOutput = '<div class="accordion" id="search-result-accordion">' + compiledTemplate(result) + '</div>';
            $("#tab-search-result").html(templateOutput);
            $('#tabs a:last').tab('show');
        } else {
            showNoResultsModal();
        }
    };

    function showMoreResultsModal() {
        var header = '<i class="icon-exclamation-sign"></i> Meer resultaten';
        var content =
            '<p>Er zijn meer dan <strong>50</strong> resultaten gevonden die aan uw zoekcriteria voldoen.</p>' +
            '<p>Probeer uw zoekopdracht te verfijnen door meer gegevens in te vullen.</p>';
        $("#resultsMessageModalLabel").html(header);
        $("#resultsMessageModalBody").html(content);
        $("#resultsMessageModal").modal('show');
    }

    function showNoResultsModal() {
        var header = '<i class="icon-frown"></i> Geen resultaten gevonden';
        var content =
            '<p>Er zijn geen resultaten gevonden die aan uw zoekcriteria voldoen.</p>' +
            '<p>Controleer uw zoekopdracht.</p>';
        $("#resultsMessageModalLabel").html(header);
        $("#resultsMessageModalBody").html(content);
        $("#resultsMessageModal").modal('show');
    }

    this.clearView = function() {
        var content = '<p>Misschien moet u eerst even een zoekopdracht ingeven... <i class="icon-smile"></i></p>';
        $('#tab-search-result').html(content);
    };

    this.clearView();
}



