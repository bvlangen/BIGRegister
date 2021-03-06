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
    var i=0;
    var compiledTemplate = Handlebars.compile(
        '{{#ListHcpApprox}}' +
            '<div class="accordion-group">' +
            '    <div class="accordion-heading">' +
            '        <a class="accordion-toggle" data-toggle="collapse" data-parent="#search-result-accordion" href="#collapse{{@index}}">' +
            '           <p>{{#each JudgmentProvision}}<strong class="text-error"><i class="icon-exclamation"></i>  </strong>{{/each}}{{#each ArticleRegistration}}{{#if ArticleRegistrationEndDate}}<strong class="text-error"><i class="icon-warning-sign"></i>  </strong>{{/if}}{{/each}}{{MailingName}} ({{Gender}}) </p>' +
            '        </a>' +
            '    </div>' +
            '    <div id="collapse{{@index}}" class="accordion-body collapse">' +
            '        <div class="accordion-inner">' +
            '           <table class="table table-striped">' +
            '               <tbody>' +
            '                   <tr><td>Aanschrijfnaam</td><td>{{MailingName}}</td></tr>' +
            '                   {{#if WorkAddress1}}<tr><td>Werkadres 1</td><td><address>{{WorkAddress1.StreetName}} {{WorkAddress1.HouseNumber}}<br>{{WorkAddress1.PostalCode}} {{WorkAddress1.City}}</address></td></tr>{{/if}}' +
            '                   {{#if WorkAddress2}}<tr><td>Werkadres 2</td><td><address>{{WorkAddress2.StreetName}} {{WorkAddress2.HouseNumber}}<br>{{WorkAddress2.PostalCode}} {{WorkAddress2.City}}</address></td></tr>{{/if}}' +
            '                   {{#if WorkAddress3}}<tr><td>Werkadres 3</td><td><address>{{WorkAddress3.StreetName}} {{WorkAddress3.HouseNumber}}<br>{{WorkAddress3.PostalCode}} {{WorkAddress3.City}}</address></td></tr>{{/if}}' +
            '                   <tr><td>Beroep</td><td>{{#each ArticleRegistration}}{{{translateprofession ProfessionalGroupCode}}}<br>BIG registratie: {{{datepart ArticleRegistrationStartDate}}} {{#if ArticleRegistrationEndDate}}<span class="text-error"><strong>(Doorgehaald: {{{datepart ArticleRegistrationEndDate}}})</strong></span><p class="text-error"><strong><i class="icon-warning-sign"></i> De inschrijving van deze zorgverlener is doorgehaald. Deze zorgverlener mag niet werken in zijn/haar beroep.</strong></p>{{else}}<br>BIG nr: {{{ArticleRegistrationNumber}}}{{/if}}{{/each}}</td></tr>' +
            '                   <tr><td>Specialisme(s)</td><td>{{#each Specialism}}{{{translatespecialism TypeOfSpecialismId}}}{{/each}}</td></tr>' +
            '                   {{#each JudgmentProvision}}<tr><td>Bevoegdheids beperking</td><td>{{{PublicDescription}}}</td></tr>{{/each}}' +
            '                   {{#each Limitation}}<tr><td>Clausule</td><td>{{{Description}}}</td></tr>{{/each}}' +
            '               </tbody>' +
            '           </table>' +
            '         </div>' +
            '    </div>' +
            '</div>' +
        '{{/ListHcpApprox}}');

    this.Response_callBack = function(result)
    {
        if (result.ListHcpApprox.length > 50) {
            showMoreResultsModal(result);
        } else if (result.ListHcpApprox.length > 0) {
            showResultsModal(result);
        } else {
            showNoResultsModal();
        }
    };

    function showResultsModal(result) {
        googleAnalytics("resultview-positive-results");
        abortProgressBar();
        var templateOutput = '<div class="accordion" id="search-result-accordion">' + compiledTemplate(result) + '</div>';
        $("#tab-search-result").html(templateOutput);
    }

    function showMoreResultsModal(result) {
        googleAnalytics("resultview-positive-more-results");
        abortProgressBar();
        var templateOutput = '<div class="accordion" id="search-result-accordion">' + compiledTemplate(result) + '</div>';
        templateOutput += '<div><p class="text-info"><em><i class="icon-info-sign"></i> Niet de zorgverlener gevonden die u zoekt? Probeer uw zoekopdracht te verfijnen door meer gegevens in te vullen.</em></p></div>';
        $("#tab-search-result").html(templateOutput);

        var header = '<i class="icon-exclamation-sign"></i> Meer resultaten';
        var content =
            '<p>Er zijn meer dan <strong>50</strong> resultaten gevonden die aan uw zoekcriteria voldoen. ' +
            'De <strong>eerste 50</strong> resultaten worden in het overzicht weergegeven. Dit overzicht is derhalve niet compleet.</p>' +
            '<p class="text-info"><em><i class="icon-info-sign"></i> Probeer uw zoekopdracht te verfijnen door meer gegevens in te vullen.</em></p>';
        $("#resultsMessageModalLabel").html(header);
        $("#resultsMessageModalBody").html(content);
        $("#resultsMessageModal").modal('show');
    }

    function showNoResultsModal() {
        googleAnalytics("resultview-no-results");
        resultView.clearView();
        $('#tabs').find('a[href="#tab-search"]').tab('show');
        var header = '<i class="icon-frown"></i> Geen resultaten gevonden';
        var content =
            '<p>Er zijn geen resultaten gevonden die aan uw zoekcriteria voldoen.</p>' +
            '<p class="text-info"><em><i class="icon-info-sign"></i> Controleer uw zoekopdracht.</em></p>';
        $("#resultsMessageModalLabel").html(header);
        $("#resultsMessageModalBody").html(content);
        $("#resultsMessageModal").modal('show');
    }

    this.clearView = function() {
        abortProgressBar();
        var content = '<p>Misschien moet u eerst even een zoekopdracht ingeven... <i class="icon-smile"></i></p>';
        $('#tab-search-result').html(content);
    };


    var tid;  // timer identifier
    function abortProgressBar() { // to be called when you want to stop the progress bar
        clearTimeout(tid);
        $('.progress').removeClass('active');
    }

    this.showProgressBarAndMessage = function() {
        var content =
            '<p>&nbsp;<i class="icon-refresh icon-spin"></i> Resultaten worden opgehaald...</p>' +
            '<div class="progress progress-info progress-striped active">' +
            '   <div class="bar" id="progress-bar" style="width: 0"></div>' +
            '</div>';
        $('#tab-search-result').html(content);

        // get screen width and run progress bar (approx. 5 sec until 100%)
        var screenWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        var screenParticle = screenWidth / 18;
        var timeoutMillies = 200;
        var tid = setTimeout(runProgressBar, timeoutMillies);
        var $bar = $('.bar');
        function runProgressBar() {
            if (($bar.width() + screenParticle) > screenWidth) { // abort when width gets bigger than screen width
                abortProgressBar();
            }
            $bar.width($bar.width()+ screenParticle);
            tid = setTimeout(runProgressBar, timeoutMillies); // repeat myself
        }
    };



    this.clearView();
}



