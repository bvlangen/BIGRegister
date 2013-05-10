/*****************************************************************************\

 Javascript "SOAP Client" library

 @version: 2.4 - 2007.12.21
 @author: Matteo Casati - http://www.guru4.net/

 \*****************************************************************************/
"use strict";

var wsdlStr =
//    '<?xml version="1.0" encoding="utf-8"?>' +
        '<wsdl:definitions xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" xmlns:tm="http://microsoft.com/wsdl/mime/textMatching/" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/" xmlns:mime="http://schemas.xmlsoap.org/wsdl/mime/" xmlns:tns="http://services.cibg.nl/ExternalUser" xmlns:s="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" xmlns:http="http://schemas.xmlsoap.org/wsdl/http/" targetNamespace="http://services.cibg.nl/ExternalUser" xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/">' +
        '<wsdl:types>' +
        '<s:schema elementFormDefault="qualified" targetNamespace="http://services.cibg.nl/ExternalUser">' +
        '<s:element name="listHcpApproxRequest" type="tns:ListHcpApproxRequest" />' +
        '<s:complexType name="ListHcpApproxRequest">' +
        '<s:sequence>' +
        '<s:element minOccurs="1" maxOccurs="1" name="WebSite" type="tns:SourceWebSite" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="Name" type="s:string" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="Initials" type="s:string" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="Prefix" type="s:string" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="Street" type="s:string" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="Gender" type="s:string" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="HouseNumber" type="s:string" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="Postalcode" type="s:string" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="City" type="s:string" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="RegistrationNumber" type="s:string" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="DateOfBirth" type="s:string" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="ProfessionalGroup" type="s:string" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="TypeOfSpecialism" type="s:string" />' +
        '</s:sequence>' +
        '</s:complexType>' +
        '<s:simpleType name="SourceWebSite">' +
        '<s:restriction base="s:string">' +
        '<s:enumeration value="None" />' +
        '<s:enumeration value="Ribiz" />' +
        '<s:enumeration value="Skp" />' +
        '</s:restriction>' +
        '</s:simpleType>' +
        '<s:element name="ListHcpApprox3Result" type="tns:ListHcpApproxResponse3" />' +
        '<s:complexType name="ListHcpApproxResponse3">' +
        '<s:sequence>' +
        '<s:element minOccurs="0" maxOccurs="1" name="ListHcpApprox" type="tns:ArrayOfListHcpApprox3" />' +
        '</s:sequence>' +
        '</s:complexType>' +
        '<s:complexType name="ArrayOfListHcpApprox3">' +
        '<s:sequence>' +
        '<s:element minOccurs="0" maxOccurs="unbounded" name="ListHcpApprox3" nillable="true" type="tns:ListHcpApprox3" />' +
        '</s:sequence>' +
        '</s:complexType>' +
        '<s:complexType name="ListHcpApprox3">' +
        '<s:sequence>' +
        '<s:element minOccurs="1" maxOccurs="1" name="HcpNumber" type="s:decimal" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="BirthSurname" type="s:string" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="MailingName" type="s:string" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="Prefix" type="s:string" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="PartnerName" type="s:string" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="PartnerNamePrefix" type="s:string" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="Initial" type="s:string" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="Gender" type="s:string" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="WorkAddress1" type="tns:Address" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="WorkAddress2" type="tns:Address" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="WorkAddress3" type="tns:Address" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="ArticleRegistration" type="tns:ArrayOfArticleRegistrationExtApp" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="Specialism" type="tns:ArrayOfSpecialismExtApp" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="Mention" type="tns:ArrayOfMentionExtApp" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="JudgmentProvision" type="tns:ArrayOfJudgmentProvisionExtApp" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="Limitation" type="tns:ArrayOfLimitationExtApp" />' +
        '</s:sequence>' +
        '</s:complexType>' +
        '<s:complexType name="Address">' +
        '<s:sequence>' +
        '<s:element minOccurs="0" maxOccurs="1" name="AddressTo" type="s:string" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="StreetName" type="s:string" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="HouseNumber" type="s:string" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="HouseNumberAddition" type="s:string" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="PostalCode" type="s:string" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="City" type="s:string" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="ForeignAddress" type="s:string" />' +
        '<s:element minOccurs="1" maxOccurs="1" name="CountryCode" nillable="true" type="s:decimal" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="Email" type="s:string" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="TelephoneNumber" type="s:string" />' +
        '</s:sequence>' +
        '</s:complexType>' +
        '<s:complexType name="ArrayOfArticleRegistrationExtApp">' +
        '<s:sequence>' +
        '<s:element minOccurs="0" maxOccurs="unbounded" name="ArticleRegistrationExtApp" nillable="true" type="tns:ArticleRegistrationExtApp" />' +
        '</s:sequence>' +
        '</s:complexType>' +
        '<s:complexType name="ArticleRegistrationExtApp">' +
        '<s:sequence>' +
        '<s:element minOccurs="1" maxOccurs="1" name="ArticleRegistrationNumber" type="s:decimal" />' +
        '<s:element minOccurs="1" maxOccurs="1" name="ArticleRegistrationStartDate" type="s:dateTime" />' +
        '<s:element minOccurs="1" maxOccurs="1" name="ArticleRegistrationEndDate" type="s:dateTime" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="ProfessionalGroupCode" type="s:string" />' +
        '</s:sequence>' +
        '</s:complexType>' +
        '<s:complexType name="ArrayOfSpecialismExtApp">' +
        '<s:sequence>' +
        '<s:element minOccurs="0" maxOccurs="unbounded" name="SpecialismExtApp" nillable="true" type="tns:SpecialismExtApp" />' +
        '</s:sequence>' +
        '</s:complexType>' +
        '<s:complexType name="SpecialismExtApp">' +
        '<s:sequence>' +
        '<s:element minOccurs="1" maxOccurs="1" name="SpecialismId" type="s:decimal" />' +
        '<s:element minOccurs="1" maxOccurs="1" name="ArticleRegistrationNumber" type="s:decimal" />' +
        '<s:element minOccurs="1" maxOccurs="1" name="StartDate" type="s:dateTime" />' +
        '<s:element minOccurs="1" maxOccurs="1" name="EndDate" nillable="true" type="s:dateTime" />' +
        '<s:element minOccurs="1" maxOccurs="1" name="TypeOfSpecialismId" type="s:decimal" />' +
        '</s:sequence>' +
        '</s:complexType>' +
        '<s:complexType name="ArrayOfMentionExtApp">' +
        '<s:sequence>' +
        '<s:element minOccurs="0" maxOccurs="unbounded" name="MentionExtApp" nillable="true" type="tns:MentionExtApp" />' +
        '</s:sequence>' +
        '</s:complexType>' +
        '<s:complexType name="MentionExtApp">' +
        '<s:sequence>' +
        '<s:element minOccurs="1" maxOccurs="1" name="MentionId" type="s:decimal" />' +
        '<s:element minOccurs="1" maxOccurs="1" name="ArticleRegistrationNumber" type="s:decimal" />' +
        '<s:element minOccurs="1" maxOccurs="1" name="TypeOfMentionId" type="s:decimal" />' +
        '<s:element minOccurs="1" maxOccurs="1" name="StartDate" type="s:dateTime" />' +
        '<s:element minOccurs="1" maxOccurs="1" name="EndDate" nillable="true" type="s:dateTime" />' +
        '</s:sequence>' +
        '</s:complexType>' +
        '<s:complexType name="ArrayOfJudgmentProvisionExtApp">' +
        '<s:sequence>' +
        '<s:element minOccurs="0" maxOccurs="unbounded" name="JudgmentProvisionExtApp" nillable="true" type="tns:JudgmentProvisionExtApp" />' +
        '</s:sequence>' +
        '</s:complexType>' +
        '<s:complexType name="JudgmentProvisionExtApp">' +
        '<s:sequence>' +
        '<s:element minOccurs="1" maxOccurs="1" name="ArticleNumber" type="s:decimal" />' +
        '<s:element minOccurs="1" maxOccurs="1" name="Id" type="s:decimal" />' +
        '<s:element minOccurs="1" maxOccurs="1" name="StartDate" type="s:dateTime" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="PublicDescription" type="s:string" />' +
        '<s:element minOccurs="1" maxOccurs="1" name="EndDate" nillable="true" type="s:dateTime" />' +
        '<s:element minOccurs="1" maxOccurs="1" name="Public" type="s:boolean" />' +
        '</s:sequence>' +
        '</s:complexType>' +
        '<s:complexType name="ArrayOfLimitationExtApp">' +
        '<s:sequence>' +
        '<s:element minOccurs="0" maxOccurs="unbounded" name="LimitationExtApp" nillable="true" type="tns:LimitationExtApp" />' +
        '</s:sequence>' +
        '</s:complexType>' +
        '<s:complexType name="LimitationExtApp">' +
        '<s:sequence>' +
        '<s:element minOccurs="1" maxOccurs="1" name="LimitationId" type="s:decimal" />' +
        '<s:element minOccurs="1" maxOccurs="1" name="ArticleRegistrationNumber" type="s:decimal" />' +
        '<s:element minOccurs="1" maxOccurs="1" name="CompetenceRegistrationId" type="s:decimal" />' +
        '<s:element minOccurs="1" maxOccurs="1" name="TypeLimitationId" type="s:decimal" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="Description" type="s:string" />' +
        '<s:element minOccurs="1" maxOccurs="1" name="StartDate" nillable="true" type="s:dateTime" />' +
        '<s:element minOccurs="1" maxOccurs="1" name="EndDate" nillable="true" type="s:dateTime" />' +
        '<s:element minOccurs="1" maxOccurs="1" name="ExpirationEndDate" nillable="true" type="s:dateTime" />' +
        '<s:element minOccurs="1" maxOccurs="1" name="MonthsValid" type="s:int" />' +
        '<s:element minOccurs="1" maxOccurs="1" name="YearsValid" type="s:int" />' +
        '</s:sequence>' +
        '</s:complexType>' +
        '<s:element name="GetRibizReferenceData">' +
        '<s:complexType>' +
        '<s:sequence>' +
        '<s:element minOccurs="0" maxOccurs="1" name="getCibgReferenceDataRequest" type="tns:GetRibizReferenceDataRequest" />' +
        '</s:sequence>' +
        '</s:complexType>' +
        '</s:element>' +
        '<s:complexType name="GetRibizReferenceDataRequest" />' +
        '<s:element name="GetRibizReferenceDataResponse">' +
        '<s:complexType>' +
        '<s:sequence>' +
        '<s:element minOccurs="0" maxOccurs="1" name="GetRibizReferenceDataResult" type="tns:GetRibizReferenceDataResponse" />' +
        '</s:sequence>' +
        '</s:complexType>' +
        '</s:element>' +
        '<s:complexType name="GetRibizReferenceDataResponse">' +
        '<s:sequence>' +
        '<s:element minOccurs="0" maxOccurs="1" name="ProfessionalGroups" type="tns:ArrayOfProfessionalGroup" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="TypeOfSpecialisms" type="tns:ArrayOfTypeOfSpecialism" />' +
        '</s:sequence>' +
        '</s:complexType>' +
        '<s:complexType name="ArrayOfProfessionalGroup">' +
        '<s:sequence>' +
        '<s:element minOccurs="0" maxOccurs="unbounded" name="ProfessionalGroup" nillable="true" type="tns:ProfessionalGroup" />' +
        '</s:sequence>' +
        '</s:complexType>' +
        '<s:complexType name="ProfessionalGroup">' +
        '<s:sequence>' +
        '<s:element minOccurs="0" maxOccurs="1" name="Code" type="s:string" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="Description" type="s:string" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="DescriptionEnglish" type="s:string" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="Title" type="s:string" />' +
        '<s:element minOccurs="1" maxOccurs="1" name="Article3" type="s:boolean" />' +
        '<s:element minOccurs="1" maxOccurs="1" name="Article34" type="s:boolean" />' +
        '<s:element minOccurs="1" maxOccurs="1" name="BusinessOwner" type="s:decimal" />' +
        '</s:sequence>' +
        '</s:complexType>' +
        '<s:complexType name="ArrayOfTypeOfSpecialism">' +
        '<s:sequence>' +
        '<s:element minOccurs="0" maxOccurs="unbounded" name="TypeOfSpecialism" nillable="true" type="tns:TypeOfSpecialism" />' +
        '</s:sequence>' +
        '</s:complexType>' +
        '<s:complexType name="TypeOfSpecialism">' +
        '<s:sequence>' +
        '<s:element minOccurs="1" maxOccurs="1" name="Code" type="s:decimal" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="Description" type="s:string" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="DescriptionEn" type="s:string" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="TitleOfSpecialist" type="s:string" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="TitleOfSpecialistEn" type="s:string" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="Register" type="s:string" />' +
        '<s:element minOccurs="1" maxOccurs="1" name="EndDate" nillable="true" type="s:dateTime" />' +
        '<s:element minOccurs="0" maxOccurs="1" name="ProfessionalGroupCode" type="s:string" />' +
        '</s:sequence>' +
        '</s:complexType>' +
        '</s:schema>' +
        '</wsdl:types>' +
        '<wsdl:message name="ListHcpApprox3SoapIn">' +
        '<wsdl:part name="listHcpApproxRequest" element="tns:listHcpApproxRequest" />' +
        '</wsdl:message>' +
        '<wsdl:message name="ListHcpApprox3SoapOut">' +
        '<wsdl:part name="ListHcpApprox3Result" element="tns:ListHcpApprox3Result" />' +
        '</wsdl:message>' +
        '<wsdl:message name="GetRibizReferenceDataSoapIn">' +
        '<wsdl:part name="parameters" element="tns:GetRibizReferenceData" />' +
        '</wsdl:message>' +
        '<wsdl:message name="GetRibizReferenceDataSoapOut">' +
        '<wsdl:part name="parameters" element="tns:GetRibizReferenceDataResponse" />' +
        '</wsdl:message>' +
        '<wsdl:portType name="PublicV3Soap">' +
        '<wsdl:operation name="ListHcpApprox3">' +
        '<wsdl:documentation xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/">Search for health care professionals based on approx match</wsdl:documentation>' +
        '<wsdl:input message="tns:ListHcpApprox3SoapIn" />' +
        '<wsdl:output message="tns:ListHcpApprox3SoapOut" />' +
        '</wsdl:operation>' +
        '<wsdl:operation name="GetRibizReferenceData">' +
        '<wsdl:documentation xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/">Returns the RIBIZ reference data</wsdl:documentation>' +
        '<wsdl:input message="tns:GetRibizReferenceDataSoapIn" />' +
        '<wsdl:output message="tns:GetRibizReferenceDataSoapOut" />' +
        '</wsdl:operation>' +
        '</wsdl:portType>' +
        '<wsdl:binding name="PublicV3Soap" type="tns:PublicV3Soap">' +
        '<soap:binding transport="http://schemas.xmlsoap.org/soap/http" />' +
        '<wsdl:operation name="ListHcpApprox3">' +
        '<soap:operation soapAction="http://services.cibg.nl/ExternalUser/ListHcpApprox3" style="document" />' +
        '<wsdl:input>' +
        '<soap:body use="literal" />' +
        '</wsdl:input>' +
        '<wsdl:output>' +
        '<soap:body use="literal" />' +
        '</wsdl:output>' +
        '</wsdl:operation>' +
        '<wsdl:operation name="GetRibizReferenceData">' +
        '<soap:operation soapAction="http://services.cibg.nl/ExternalUser/GetRibizReferenceData" style="document" />' +
        '<wsdl:input>' +
        '<soap:body use="literal" />' +
        '</wsdl:input>' +
        '<wsdl:output>' +
        '<soap:body use="literal" />' +
        '</wsdl:output>' +
        '</wsdl:operation>' +
        '</wsdl:binding>' +
        '<wsdl:binding name="PublicV3Soap12" type="tns:PublicV3Soap">' +
        '<soap12:binding transport="http://schemas.xmlsoap.org/soap/http" />' +
        '<wsdl:operation name="ListHcpApprox3">' +
        '<soap12:operation soapAction="http://services.cibg.nl/ExternalUser/ListHcpApprox3" style="document" />' +
        '<wsdl:input>' +
        '<soap12:body use="literal" />' +
        '</wsdl:input>' +
        '<wsdl:output>' +
        '<soap12:body use="literal" />' +
        '</wsdl:output>' +
        '</wsdl:operation>' +
        '<wsdl:operation name="GetRibizReferenceData">' +
        '<soap12:operation soapAction="http://services.cibg.nl/ExternalUser/GetRibizReferenceData" style="document" />' +
        '<wsdl:input>' +
        '<soap12:body use="literal" />' +
        '</wsdl:input>' +
        '<wsdl:output>' +
        '<soap12:body use="literal" />' +
        '</wsdl:output>' +
        '</wsdl:operation>' +
        '</wsdl:binding>' +
        '<wsdl:service name="PublicV3">' +
        '<wsdl:port name="PublicV3Soap" binding="tns:PublicV3Soap">' +
        '<soap:address location="http://services.cibg.nl/ExternalUserV2.asmx" />' +
        '</wsdl:port>' +
        '<wsdl:port name="PublicV3Soap12" binding="tns:PublicV3Soap12">' +
        '<soap12:address location="http://services.cibg.nl/ExternalUserV2.asmx" />' +
        '</wsdl:port>' +
        '</wsdl:service>' +
        '</wsdl:definitions>';

function SOAPClientParameters()
{
    var _pl = new Array();
    this.add = function(name, value)
    {
        _pl[name] = value;
        return this;
    }
    this.toXml = function()
    {
        var xml = "";
        for(var p in _pl)
        {
            switch(typeof(_pl[p]))
            {
                case "string":
                case "number":
                case "boolean":
                case "object":
                    xml += "<" + p + ">" + SOAPClientParameters._serialize(_pl[p]) + "</" + p + ">";
                    break;
                default:
                    break;
            }
        }
        return xml;
    }
}
SOAPClientParameters._serialize = function(o)
{
    var s = "";
    switch(typeof(o))
    {
        case "string":
            s += o.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); break;
        case "number":
        case "boolean":
            s += o.toString(); break;
        case "object":
            // Date
            if(o.constructor.toString().indexOf("function Date()") > -1)
            {

                var year = o.getFullYear().toString();
                var month = (o.getMonth() + 1).toString(); month = (month.length == 1) ? "0" + month : month;
                var date = o.getDate().toString(); date = (date.length == 1) ? "0" + date : date;
                var hours = o.getHours().toString(); hours = (hours.length == 1) ? "0" + hours : hours;
                var minutes = o.getMinutes().toString(); minutes = (minutes.length == 1) ? "0" + minutes : minutes;
                var seconds = o.getSeconds().toString(); seconds = (seconds.length == 1) ? "0" + seconds : seconds;
                var milliseconds = o.getMilliseconds().toString();
                var tzminutes = Math.abs(o.getTimezoneOffset());
                var tzhours = 0;
                while(tzminutes >= 60)
                {
                    tzhours++;
                    tzminutes -= 60;
                }
                tzminutes = (tzminutes.toString().length == 1) ? "0" + tzminutes.toString() : tzminutes.toString();
                tzhours = (tzhours.toString().length == 1) ? "0" + tzhours.toString() : tzhours.toString();
                var timezone = ((o.getTimezoneOffset() < 0) ? "+" : "-") + tzhours + ":" + tzminutes;
                s += year + "-" + month + "-" + date + "T" + hours + ":" + minutes + ":" + seconds + "." + milliseconds + timezone;
            }
            // Array
            else if(o.constructor.toString().indexOf("function Array()") > -1)
            {
                for(var p in o)
                {
                    if(!isNaN(p))   // linear array
                    {
                        (/function\s+(\w*)\s*\(/ig).exec(o[p].constructor.toString());
                        var type = RegExp.$1;
                        switch(type)
                        {
                            case "":
                                type = typeof(o[p]);
                            case "String":
                                type = "string"; break;
                            case "Number":
                                type = "int"; break;
                            case "Boolean":
                                type = "bool"; break;
                            case "Date":
                                type = "DateTime"; break;
                        }
                        s += "<" + type + ">" + SOAPClientParameters._serialize(o[p]) + "</" + type + ">"
                    }
                    else    // associative array
                        s += "<" + p + ">" + SOAPClientParameters._serialize(o[p]) + "</" + p + ">"
                }
            }
            // Object or custom function
            else
                for(var p in o)
                    s += "<" + p + ">" + SOAPClientParameters._serialize(o[p]) + "</" + p + ">";
            break;
        default:
            break; // throw new Error(500, "SOAPClientParameters: type '" + typeof(o) + "' is not supported");
    }
    return s;
}

function SOAPClient() {}

// private: wsdl cache
var SOAPClient_cacheWsdl = new Array();

SOAPClient.invoke = function(url, method, parameters, callback)
{
    var wsdl = SOAPClient_cacheWsdl[url];
    if(wsdl + "" == "" || wsdl + "" == "undefined") {
        wsdl = SOAPClient._loadWsdl(url);
    }

    return SOAPClient._sendSoapRequest(url, method, parameters, callback, wsdl);
}

SOAPClient._loadWsdl = function(url)
{
    var wsdl = SOAPClient_cacheWsdl[url];
    if(wsdl + "" == "" || wsdl + "" == "undefined") {
        var wsdl = null;
        try {
            var parser = new DOMParser();
            wsdl = parser.parseFromString( wsdlStr, "text/xml" );
            SOAPClient_cacheWsdl[url] = wsdl;	// save a copy in cache
            return wsdl;
        } catch ( e ) {
            alert("Error parsing WSDL" + e);
        }
    }
}
SOAPClient._sendSoapRequest = function(url, method, parameters, callback, wsdl)
{
    // get namespace
    var ns = (wsdl.documentElement.attributes["targetNamespace"] + "" == "undefined") ? wsdl.documentElement.attributes.getNamedItem("targetNamespace").nodeValue : wsdl.documentElement.attributes["targetNamespace"].value;
    // build SOAP request
    var sr =
        "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
            "<soap:Envelope " +
            "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" " +
            "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" " +
            "xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">" +
            "<soap:Body>" +
            "<" + method + "Request" + " xmlns=\"" + ns + "\">" +
            parameters.toXml() +
            "</" + method + "Request" + "></soap:Body></soap:Envelope>";
    // send request
    alert(sr);
    var xmlHttp = SOAPClient._getXmlHttp();
    xmlHttp.open("POST", url, true);    // async request

//    var soapaction = ((ns.lastIndexOf("/") != ns.length - 1) ? ns + "/" : ns) + method;
    xmlHttp.setRequestHeader("SOAPAction", "http://services.cibg.nl/ExternalUser/ListHcpApprox3");
    xmlHttp.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
    xmlHttp.onreadystatechange = function()
    {
        if(xmlHttp.readyState == 4)  {
            alert("Got result");
            SOAPClient._onSendSoapRequest(method, callback, wsdl, xmlHttp);
        }
    };
    xmlHttp.send(sr);
}



SOAPClient._onSendSoapRequest = function(method, callback, wsdl, req)
{
    // TODO -- START TEST
    if (true) {

        var tstResult = '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><soap:Body><ListHcpApprox3Result xmlns="http://services.cibg.nl/ExternalUser"><ListHcpApprox><ListHcpApprox3><HcpNumber>213171</HcpNumber><BirthSurname>Hak</BirthSurname><MailingName>C.H. Hak</MailingName><Initial>C.H.</Initial><Gender>M</Gender><ArticleRegistration><ArticleRegistrationExtApp><ArticleRegistrationNumber>69021317101</ArticleRegistrationNumber><ArticleRegistrationStartDate>1997-12-22T00:00:00</ArticleRegistrationStartDate><ArticleRegistrationEndDate>0001-01-01T00:00:00</ArticleRegistrationEndDate><ProfessionalGroupCode>01</ProfessionalGroupCode></ArticleRegistrationExtApp></ArticleRegistration><Specialism /><Mention /><JudgmentProvision><JudgmentProvisionExtApp><ArticleNumber>69021317101</ArticleNumber><Id>256</Id><StartDate>2012-08-16T08:28:13</StartDate><PublicDescription>Het bevel houdt in dat de arts per 16 augustus 2012 zijn werkzaamheden neerlegt, waaronder het zelfstandig uitvoeren van voorbehouden handelingen als bedoeld in artikel 36 van de Wet BIG, en ook de praktijkvoering staakt en blijft staken, totdat de inspectie zijn handelen heeft laten toetsen door een rechterlijke instantie.' +
            'Dit bevel duurt in ieder geval tot de tuchtrechter naar aanleiding van de spoedklacht een oordeel heeft gegeven over het handelen. Wettelijke grondslag: artikel 87a van de Wet BIG.</PublicDescription><EndDate xsi:nil="true" /><Public>true</Public></JudgmentProvisionExtApp></JudgmentProvision><Limitation /></ListHcpApprox3><ListHcpApprox3><HcpNumber>567718</HcpNumber><BirthSurname>Hak</BirthSurname><MailingName>C.H. Hak</MailingName><Initial>C.H.</Initial><Gender>V</Gender><ArticleRegistration><ArticleRegistrationExtApp><ArticleRegistrationNumber>69056771830</ArticleRegistrationNumber><ArticleRegistrationStartDate>2002-03-20T00:00:00</ArticleRegistrationStartDate><ArticleRegistrationEndDate>0001-01-01T00:00:00</ArticleRegistrationEndDate><ProfessionalGroupCode>30</ProfessionalGroupCode></ArticleRegistrationExtApp></ArticleRegistration><Specialism /><Mention /><JudgmentProvision /><Limitation /></ListHcpApprox3></ListHcpApprox></ListHcpApprox3Result></soap:Body></soap:Envelope>';
        var resultxml = null;
        try {
            var parser = new DOMParser();
            resultxml = parser.parseFromString( tstResult, "text/xml" );
        } catch ( e ) {
            alert("Error parsing WSDL" + e);
        }
        var o = null;
        //    var nd = SOAPClient._getElementsByTagName(req.responseXML, method + "Result");
        var nd = SOAPClient._getElementsByTagName(resultxml, "ListHcpApprox3Result");
        if(nd.length == 0)
            nd = SOAPClient._getElementsByTagName(resultxml, "return");	// PHP web Service?
        if(nd.length == 0)
        {
            if(resultxml.getElementsByTagName("faultcode").length > 0)
            {
                o = new Error(500, resultxml.getElementsByTagName("faultstring")[0].childNodes[0].nodeValue);
            }
        }
        else {
            o = SOAPClient._soapresult2object(nd[0], wsdl);
        }

        if(callback)  {
            alert("Callback entered");
            callback(o, resultxml);
        }

        // -- END TEST
    } else {

        var o = null;
        //    var nd = SOAPClient._getElementsByTagName(req.responseXML, method + "Result");
        var nd = SOAPClient._getElementsByTagName(req.responseXML, "ListHcpApprox3Result");
        if(nd.length == 0)
            nd = SOAPClient._getElementsByTagName(req.responseXML, "return");	// PHP web Service?
        if(nd.length == 0)
        {
            if(req.responseXML.getElementsByTagName("faultcode").length > 0)
            {
                o = new Error(500, req.responseXML.getElementsByTagName("faultstring")[0].childNodes[0].nodeValue);
            }
        }
        else {
            o = SOAPClient._soapresult2object(nd[0], wsdl);
        }

        if(callback)  {
            alert("Callback entered");
            callback(o, req.responseXML);
        }
    }
}
SOAPClient._soapresult2object = function(node, wsdl)
{
    var wsdlTypes = SOAPClient._getTypesFromWsdl(wsdl);
    return SOAPClient._node2object(node, wsdlTypes);
}
SOAPClient._node2object = function(node, wsdlTypes)
{
    // null node
    if(node == null)
        return null;
    // text node
    if(node.nodeType == 3 || node.nodeType == 4)
        return SOAPClient._extractValue(node, wsdlTypes);
    // leaf node
    if (node.childNodes.length == 1 && (node.childNodes[0].nodeType == 3 || node.childNodes[0].nodeType == 4))
        return SOAPClient._node2object(node.childNodes[0], wsdlTypes);
    var isarray = SOAPClient._getTypeFromWsdl(node.nodeName, wsdlTypes).toLowerCase().indexOf("arrayof") != -1;
    // object node
    if(!isarray)
    {
        var obj = null;
        if(node.hasChildNodes())
            obj = new Object();
        for(var i = 0; i < node.childNodes.length; i++)
        {
            var p = SOAPClient._node2object(node.childNodes[i], wsdlTypes);
            obj[node.childNodes[i].nodeName] = p;
        }
        return obj;
    }
    // list node
    else
    {
        // create node ref
        var l = new Array();
        for(var i = 0; i < node.childNodes.length; i++)
            l[l.length] = SOAPClient._node2object(node.childNodes[i], wsdlTypes);
        return l;
    }
    return null;
}
SOAPClient._extractValue = function(node, wsdlTypes)
{
    var value = node.nodeValue;
    switch(SOAPClient._getTypeFromWsdl(node.parentNode.nodeName, wsdlTypes).toLowerCase())
    {
        default:
        case "s:string":
            return (value != null) ? value + "" : "";
        case "s:boolean":
            return value + "" == "true";
        case "s:int":
        case "s:long":
            return (value != null) ? parseInt(value + "", 10) : 0;
        case "s:double":
            return (value != null) ? parseFloat(value + "") : 0;
        case "s:datetime":
            if(value == null)
                return null;
            else
            {
                value = value + "";
                value = value.substring(0, (value.lastIndexOf(".") == -1 ? value.length : value.lastIndexOf(".")));
                value = value.replace(/T/gi," ");
                value = value.replace(/-/gi,"/");
                var d = new Date();
                d.setTime(Date.parse(value));
                return d;
            }
    }
}
SOAPClient._getTypesFromWsdl = function(wsdl)
{
    var wsdlTypes = new Array();
    // IE
    var ell = wsdl.getElementsByTagName("s:element");
    var useNamedItem = true;
    // MOZ
    if(ell.length == 0)
    {
        ell = wsdl.getElementsByTagName("element");
        useNamedItem = false;
    }
    for(var i = 0; i < ell.length; i++)
    {

        if(useNamedItem)
        {
            if(ell[i].attributes.getNamedItem("name") != null && ell[i].attributes.getNamedItem("type") != null) {
                wsdlTypes[ell[i].attributes.getNamedItem("name").nodeValue] = ell[i].attributes.getNamedItem("type").nodeValue;
            }

        }
        else
        {
            if(ell[i].attributes["name"] != null && ell[i].attributes["type"] != null)  {
                wsdlTypes[ell[i].attributes["name"].value] = ell[i].attributes["type"].value;
            }
        }
    }
    return wsdlTypes;
}
SOAPClient._getTypeFromWsdl = function(elementname, wsdlTypes)
{
    var type = wsdlTypes[elementname] + "";
    return (type == "undefined") ? "" : type;
}
// private: utils
SOAPClient._getElementsByTagName = function(document, tagName)
{
    try
    {
        // trying to get node omitting any namespaces (latest versions of MSXML.XMLDocument)
        return document.selectNodes(".//*[local-name()=\""+ tagName +"\"]");
    }
    catch (ex) {}
    // old XML parser support
    return document.getElementsByTagName(tagName);
}
// private: xmlhttp factory
SOAPClient._getXmlHttp = function()
{
    try
    {
        if(window.XMLHttpRequest)
        {
            var req = new XMLHttpRequest();
            // some versions of Moz do not support the readyState property and the onreadystate event so we patch it!
            if(req.readyState == null)
            {
                req.readyState = 1;

                req.addEventListener("load",
                    function()
                    {
                        req.readyState = 4;
                        if(typeof req.onreadystatechange == "function")
                            req.onreadystatechange();
                    },
                    false);
            }
            return req;
        }
        if(window.ActiveXObject)
            return new ActiveXObject(SOAPClient._getXmlHttpProgID());
    }
    catch (ex) {}
    throw new Error("Your browser does not support XmlHttp objects");
}
SOAPClient._getXmlHttpProgID = function()
{
    if(SOAPClient._getXmlHttpProgID.progid)
        return SOAPClient._getXmlHttpProgID.progid;
    var progids = ["Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
    var o;
    for(var i = 0; i < progids.length; i++)
    {
        try
        {
            o = new ActiveXObject(progids[i]);
            return SOAPClient._getXmlHttpProgID.progid = progids[i];
        }
        catch (ex) {};
    }
    throw new Error("Could not find an installed XML parser");
}

SOAPClient._toBase64 = function(input)
{
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) +
            keyStr.charAt(enc3) + keyStr.charAt(enc4);
    } while (i < input.length);

    return output;
}

