"use strict";
var MemoryStore = function(successCallback, errorCallback) {

    this.findProfessionalGroupByName = function(searchKey) {
        return this.professionalgroups.filter(function (element) {
            return element.name.toLowerCase().indexOf(searchKey.toLowerCase()) > -1;
        });
    };

    this.listProfessionalGroups = function() {
        return this.professionalgroups;
    };

    this.findSpecialismByName = function(searchKey) {
        return this.specialisms.filter(function (element) {
            return element.name.toLowerCase().indexOf(searchKey.toLowerCase()) > -1;
        });
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

    this.professionalgroups = [
        {"id": "01", "name": "Artsen"},
        {"id": "02", "name": "Tandartsen"},
        {"id": "03", "name": "Verloskundigen"},
        {"id": "04", "name": "Fysiotherapeuten"},
        {"id": "16", "name": "Psychotherapeuten"},
        {"id": "17", "name": "Apothekers"},
        {"id": "18", "name": "Apotheekhoudende artsen"},
        {"id": "25", "name": "Gz-psychologen"},
        {"id": "30", "name": "Verpleegkundigen"},
        {"id": "87", "name": "Optometristen"},
        {"id": "88", "name": "Huidtherapeuten"},
        {"id": "89", "name": "Diëtisten"},
        {"id": "90", "name": "Ergotherapeuten"},
        {"id": "91", "name": "Logopedisten"},
        {"id": "92", "name": "Mondhygiënisten"},
        {"id": "93", "name": "Oefentherapeuten Mensendieck"},
        {"id": "94", "name": "Oefentherapeuten Cesar"},
        {"id": "95", "name": "Orthoptisten"},
        {"id": "96", "name": "Podotherapeuten"},
        {"id": "97", "name": "Radiodiagnostisch laboranten"},
        {"id": "98", "name": "Radiotherapeutisch laboranten"},
        {"id": "99", "name": "Onbekend"},
        {"id": "83", "name": "Apothekersassistenten"},
        {"id": "85", "name": "Tandprothetica"},
        {"id": "86", "name": "Verzorgenden individuele gezondheidszorg"}
    ];

    this.specialisms = [
        {"id": "2", "name": "Allergologie"},
        {"id": "3", "name": "Anesthesiologie"},
        {"id": "4", "name": "Algemene gezondheidszorg"},
        {"id": "5", "name": "Medische milieukunde"},
        {"id": "6", "name": "Tuberculosebestrijding"},
        {"id": "7", "name": "Arbeid en gezondheid"},
        {"id": "8", "name": "Arbeid en gezondheid-bedrijfsgeneeskunde"},
        {"id": "10", "name": "Cardiologie"},
        {"id": "11", "name": "Ardio - thoracale chirurgie"},
        {"id": "12", "name": "Dermatologie en venerologie"},
        {"id": "13", "name": "Leer van maag-darm-leverziekten"},
        {"id": "14", "name": "Heelkunde"},
        {"id": "15", "name": "Huisartsgeneeskunde"},
        {"id": "16", "name": "Inwendige geneeskunde"},
        {"id": "17", "name": "Jeugdgezondheidszorg"},
        {"id": "18", "name": "Keel-neus-oorheelkunde"},
        {"id": "19", "name": "Kindergeneeskunde"},
        {"id": "20", "name": "Klinische chemie"},
        {"id": "21", "name": "Klinische genetica"},
        {"id": "22", "name": "Klinische geriatrie"},
        {"id": "23", "name": "Longziekten en tuberculose"},
        {"id": "24", "name": "Medische microbiologie"},
        {"id": "25", "name": "Neurochirurgie"},
        {"id": "26", "name": "Neurologie"},
        {"id": "30", "name": "Nucleaire geneeskunde"},
        {"id": "31", "name": "Oogheelkunde"},
        {"id": "32", "name": "Orthopedie"},
        {"id": "33", "name": "Pathologie"},
        {"id": "34", "name": "Plastische chirurgie"},
        {"id": "35", "name": "Psychiatrie"},
        {"id": "39", "name": "Radiologie"},
        {"id": "40", "name": "Radiotherapie"},
        {"id": "41", "name": "Reumatologie"},
        {"id": "42", "name": "Revalidatiegeneeskunde"},
        {"id": "43", "name": "Maatschappij en gezondheid"},
        {"id": "44", "name": "Sportgeneeskunde"},
        {"id": "45", "name": "Urologie"},
        {"id": "46", "name": "Obstetrie en gynaecologie"},
        {"id": "47", "name": "Verpleeghuisgeneeskunde"},
        {"id": "48", "name": "Arbeid en gezondheid-verzekeringsgeneeskunde"},
        {"id": "50", "name": "Zenuw -en zielsziekten"},
        {"id": "53", "name": "Dento-maxillaire orthopaedie"},
        {"id": "54", "name": "Mondziekten en kaakchirurgie"},
        {"id": "55", "name": "Maatschappij en gezondheid"},
        {"id": "56", "name": "Medische zorg voor verstandelijke gehandicapten"},
        {"id": "60", "name": "Ziekenhuisfarmacie"},
        {"id": "61", "name": "Klinische psychologie"},
        {"id": "62", "name": "Interne geneeskunde-allergologie"}
    ];
};