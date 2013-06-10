"use strict";
var MemoryStore = function() {

    this.listProfessionalGroups = function() {
        return this.professionalgroups;
    };

    this.listSpecialisms = function() {
        return this.specialisms;
    };

    this.findProfessionalGroupById = function(id) {
        var professionalgroups = this.professionalgroups;
        var professionalgroup = null;
        var l = professionalgroups.length;
        for (var i=0; i < l; i++) {
            if (professionalgroups[i].id === id) {
                professionalgroup = professionalgroups[i];
                break;
            }
        }
        return professionalgroup;
    };

    this.findSpecialismById = function(id) {
        var specialisms = this.specialisms;
        var specialism = null;
        var l = specialisms.length;
        for (var i=0; i < l; i++) {
            if (specialisms[i].id === id) {
                specialism = specialisms[i];
                break;
            }
        }
        return specialism;
    };

    this.findSpecialismsForProfessionalsGroupId = function(prof_id) {
        var specialisms = this.specialisms;
        var specialism = null;
        var l = specialisms.length;
        var result = [];
        for (var i=0; i < l; i++) {
            if (specialisms[i].prof_id === prof_id) {
                specialism = specialisms[i];
                result.push(specialism);
            }
        }
        return result;
    };

    this.professionalgroups = [
        {"id": "00", "name": "-- Maak een keuze --"},
        {"id": "01", "name": "Arts"},
        {"id": "17", "name": "Apotheker"},
        {"id": "04", "name": "Fysiotherapeut"},
        {"id": "25", "name": "Gezondheidszorgpsycholoog"},
        {"id": "16", "name": "Psychotherapeut"},
        {"id": "02", "name": "Tandarts"},
        {"id": "03", "name": "Verloskundige"},
        {"id": "30", "name": "Verpleegkundige"}
    ];

    this.specialisms = [
        {"id": "00", prof_id: "-1", "name": "-- Maak een keuze --"},
        {"id": "02", prof_id: "01", "name": "Allergologie (allergoloog)"},
        {"id": "03", prof_id: "01", "name": "Anesthesiologie (anesthesioloog)"},
        {"id": "08", prof_id: "01", "name": "Arbeid en gezond - bedrijfsgeneeskunde "},
        {"id": "48", prof_id: "01", "name": "Arbeid en gezond - verzekeringsgeneeskunde"},
        {"id": "10", prof_id: "01", "name": "Cardiologie (cardioloog)"},
        {"id": "11", prof_id: "01", "name": "Cardio-thoracale chirurgie"},
        {"id": "53", prof_id: "02", "name": "Dento-maxillaire orthopaedie (orthodontist)"},
        {"id": "12", prof_id: "01", "name": "Dermatologie en venerologie (dermatoloog)"},
        {"id": "56", prof_id: "01", "name": "Geneeskunde voor verstandelijk gehandicapten"},
        {"id": "14", prof_id: "01", "name": "Heelkunde (chirurg)"},
        {"id": "15", prof_id: "01", "name": "Huisartsgeneeskunde (huisarts)"},
        {"id": "62", prof_id: "01", "name": "Interne geneeskunde-allergologie"},
        {"id": "16", prof_id: "01", "name": "Interne geneeskunde (internist)"},
        {"id": "18", prof_id: "01", "name": "Keel-, neus- en oorheelkunde (kno-arts)"},
        {"id": "19", prof_id: "01", "name": "Kindergeneeskunde (kinderarts)"},
        {"id": "20", prof_id: "01", "name": "Klinische chemie (arts klinische chemie)"},
        {"id": "21", prof_id: "01", "name": "Klinische genetica (klinisch geneticus)"},
        {"id": "22", prof_id: "01", "name": "Klinische geriatrie (klinisch geriater)"},
        {"id": "63", prof_id: "25", "name": "Klinische neuropsychologie"},
        {"id": "61", prof_id: "25", "name": "Klinische psychologie (klinisch psycholoog)"},
        {"id": "23", prof_id: "01", "name": "Longziekten en tuberculose (longarts)"},
        {"id": "13", prof_id: "01", "name": "Maag-darm-leverziekten (maag-darm-leverarts)"},
        {"id": "55", prof_id: "01", "name": "Maatschappij en gezondheid 1"},
        {"id": "43", prof_id: "01", "name": "Maatschappij en gezondheid 2"},
        {"id": "24", prof_id: "01", "name": "Medische microbiologie (arts-microbioloog)"},
        {"id": "54", prof_id: "02", "name": "Mondziekten en kaakchirurgie (kaakchirurg)"},
        {"id": "25", prof_id: "01", "name": "Neurochirurgie (neurochirurg)"},
        {"id": "26", prof_id: "01", "name": "Neurologie (neuroloog)"},
        {"id": "30", prof_id: "01", "name": "Nucleaire geneeskunde (nucleair geneeskundige)"},
        {"id": "46", prof_id: "01", "name": "Obstetrie en gynaecologie (gynaecoloog)"},
        {"id": "31", prof_id: "01", "name": "Oogheelkunde (oogarts)"},
        {"id": "32", prof_id: "01", "name": "Orthopedie (orthopeed)"},
        {"id": "33", prof_id: "01", "name": "Pathologie (patholoog)"},
        {"id": "34", prof_id: "01", "name": "Plastische chirurgie (plastisch chirurg)"},
        {"id": "35", prof_id: "01", "name": "Psychiatrie (psychiater)"},
        {"id": "39", prof_id: "01", "name": "Radiologie (radioloog)"},
        {"id": "40", prof_id: "01", "name": "Radiotherapie (radiotherapeut)"},
        {"id": "41", prof_id: "01", "name": "Reumatologie (reumatoloog)"},
        {"id": "42", prof_id: "01", "name": "Revalidatiegeneeskunde (revalidatiearts)"},
        {"id": "47", prof_id: "01", "name": "Specialisme ouderengeneeskunde"},
        {"id": "45", prof_id: "01", "name": "Urologie (uroloog)"},
        {"id": "66", prof_id: "30", "name": "Verpl. spec. acute zorg bij som. aandoeningen"},
        {"id": "68", prof_id: "30", "name": "Verpl. spec. chronische zorg bij som. aandoeningen"},
        {"id": "69", prof_id: "30", "name": "Verpl. spec. geestelijke gezondheidszorg"},
        {"id": "67", prof_id: "30", "name": "Verpl. spec. intensieve zorg bij som. aandoeningen"},
        {"id": "65", prof_id: "30", "name": "Verpl. spec. prev. zorg bij som. aandoeningen"},
        {"id": "50", prof_id: "01", "name": "Zenuw- en zielsziekten (zenuwarts)"},
        {"id": "60", prof_id: "17", "name": "Ziekenhuisfarmacie (ziekenhuisapotheker)"}
    ];
};