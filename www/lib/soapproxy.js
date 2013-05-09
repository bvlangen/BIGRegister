/*
 * Copyright 2012, Serge V. Izmaylov
 * Released under GPL Version 2 license.
 */
"use strict";
// published objects
function SOAPProxyFabric() {
    // singleton fabric
}

function SOAPProxyUtils() {
    // singleton utility object
}

function SOAPProxy(wsdl) {
    // fabric product
    this.serviceUrl = "";
    this.lastRequest = "";
    this.lastResponseHeaders = "";
    this.lastStatusCode = "";
    this.lastResponse = "";
    this.lastResponseHeaders = "";

    this._wsdl = wsdl;
    this._targetNamespace = "";
    this._nswsdl = "";
    this._nssoap = "";
    this._nssoapenc = "";
    this._nsxsd = "";
    this._nsxsi = "";
    this._nstns = "";
    this._types = new Array();
    this._elements = new Array();
    this._defaultTypes = SOAPProxyUtils._createDefaultTypes();
    this._types = SOAPProxyUtils._createStandardTypes();
    this._messages = new Array();
    this._operations = new Array();

    // parse WSDL
    this._fetchBasicNamespaces();
    this._fetchTypes();
    this._fetchElements();
    this._fetchMessages();
    this._fetchOperations();
    this._fetchBindings();
    this._buildMethods();

    return this;
}

// public properties
SOAPProxyFabric.version = "1.0";

// public methods
SOAPProxyFabric.fromUrl = function (source, async, callback) {
    if ((source == null) || (source == ""))
        throw SOAPProxyUtils._createError(500, "Bad WSDL source");
    var cache = SOAPProxyFabric._wsdlCache[source];
    if (cache != null) {
        if (callback != null)
            callback(cache.proxy, cache.wsdl, cache.wsdlText);
        if (!async)
            return cache.proxy;
    } else {
        var xhr = SOAPProxyUtils._getXmlHttpRequest();
        xhr.open("GET", source + "?wsdl", async);
        if(async) {
            xhr.onreadystatechange = function() {
                if(xhr.readyState == 4)
                    SOAPProxyFabric._onGotWSDL(callback, xhr, source);
            }
        }
        xhr.send(null);
        if (!async)
            return SOAPProxyFabric.fromDOM(xhr.responseXML);
    }
}

SOAPProxyFabric.fromXml = function (text) {
    return SOAPProxyFabric.fromDOM(SOAPProxyUtils._parseXML(text));
}

SOAPProxyFabric.fromDOM = function (wsdl) {
    alert("WSDL : "+ wsdl);

    alert("WSDL documentElement: "+wsdl.documentElement);
    if (wsdl == null)
        throw SOAPProxyUtils._createError(500, "WSDL is null");
    if (wsdl.documentElement == null)
        throw SOAPProxyUtils._createError(500, "No documentElement in WSDL");
    var proxy = new SOAPProxy(wsdl);
    return proxy;
}

SOAPProxy.prototype.invoke = function (method, params, async, resultcallback, faultcallback) {
    var op = this._operations[method];
    if (op == null)
        throw SOAPProxyUtils._createError(500, "Unknown method");
    return op.invoke(params, async, resultcallback, faultcallback);
}

SOAPProxyOperation.prototype.invoke = function (params, async, resultcallback, faultcallback) {
    var postdata = this._buildInput(params);
    var xhr = SOAPProxyUtils._getXmlHttpRequest();
    var op = this;

    try {
        xhr.open("POST", this._proxy.serviceUrl, async);
    } catch (x) {
        return op._dispatchFailure(async, faultcallback);
    }
    xhr.setRequestHeader("SOAPAction", this._soapAction);
    xhr.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
    this._proxy.lastRequestHeaders = "SOAPAction: " + this._soapAction + "\r\n" + "Content-Type: text/xml; charset=utf-8\r\n";
    if (async)
        xhr.onreadystatechange = function()
        {
            if(xhr.readyState == 4)
                op._dispatchResponse(async, resultcallback, faultcallback, xhr);
        }
    try {
        xhr.send(postdata);
    } catch (x) {
        return op._dispatchFailure(async, faultcallback);
    }
    if (!async)
        return op._dispatchResponse(async, resultcallback, faultcallback, xhr);
}

// private classes

function SOAPProxyOperation (proxy) {
    this._proxy = proxy;
    this._soapAction = "";
    this._messageIn = {name: "", messageNamespace: "", encodingStyle: ""};
    this._messageOut = {name: "", messageNamespace: "", encodingStyle: ""};
}

// private properties
SOAPProxyFabric._wsdlCache = new Array();

// private methods
SOAPProxyOperation.prototype._buildInput = function (p) {
    var hdr = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
        "<soapenv:Envelope " +
        "xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" " +
        "xmlns:ns1=\"" + ((this._messageIn.messageNamespace == "") ? this._proxy._targetNamespace : this._messageIn.messageNamespace) + "\" " +
        "xmlns:" + this._proxy._nstns.substring(0, this._proxy._nsxsd.length-1) + "=\"" + this._proxy._targetNamespace + "\" " +
        "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" " +
        "xmlns:" + this._proxy._nsxsd.substring(0, this._proxy._nsxsd.length-1) + "=\"http://www.w3.org/2001/XMLSchema\" " +
        "xmlns:soapenc=\"http://schemas.xmlsoap.org/soap/encoding/\" " +
        "soapenv:encodingStyle=\"" + ((this._messageIn.encodingStyle == "") ? "http://schemas.xmlsoap.org/soap/encoding/" : this._messageIn.encodingStyle) + "\"" +
        ">" +
        "<soapenv:Body>";
    var ftr =     "</soapenv:Body>" +
        "</soapenv:Envelope>";
    var cnt = "";
    var msgname = this._proxy._messages[this._messageIn.name].name;
    var parts = this._proxy._messages[this._messageIn.name].parts;
    if (msgname == "__selfref") // No element reference
        msgname = this._opname;
    var types = this._proxy._types;
    if ((parts != null) && (parts.length > 0)) {
        for (var i = 0; i < parts.length; i++) {
            if (p != null)
                cnt += types[parts[i].type].serf(p[parts[i].name], parts[i].name, this._proxy);
            else
                cnt += types[parts[i].type].serf(null, parts[i].name, this._proxy);
        }
    }
    if (cnt == "")
        cnt = "<ns1:" + msgname + "/>";
    else {
        cnt = "<ns1:" + msgname + ">" + cnt + "</ns1:" + msgname + ">";
    }
    this._proxy.lastRequest = hdr + cnt + ftr;
    return this._proxy.lastRequest;
}

SOAPProxyOperation.prototype._parseOutput = function (doc) {
    if ((doc == null) || (doc.documentElement == null))
        return SOAPProxyUtils._createError(500, "Null response");
    try {
        var msg = { _nssoapenv: "", _nssoapenc: "", _nsxsi: "", _nsmsg: "", _nstns: "" };
        var an;
        for (var i = 0; i < doc.documentElement.attributes.length; i++) {
            if (/\/soap\/envelope\/$/.test(doc.documentElement.attributes[i].nodeValue) &&
                doc.documentElement.attributes[i].nodeName.substring(0,5) == "xmlns") {
                an = doc.documentElement.attributes[i].nodeName;
                msg._nssoapenv = an.substring(an.indexOf(":")+1) + ":";
            }
            if (/\/soap\/encoding\/$/.test(doc.documentElement.attributes[i].nodeValue) &&
                doc.documentElement.attributes[i].nodeName.substring(0,5) == "xmlns") {
                an = doc.documentElement.attributes[i].nodeName;
                msg._nssoapenc = an.substring(an.indexOf(":")+1) + ":";
            }
            if (/\/XMLSchema-instance$/.test(doc.documentElement.attributes[i].nodeValue)) {
                an = doc.documentElement.attributes[i].nodeName;
                msg._nsxsi = an.substring(an.indexOf(":")+1) + ":";
            }
            if (doc.documentElement.attributes[i].nodeValue == this._messageOut.messageNamespace) {
                an = doc.documentElement.attributes[i].nodeName;
                msg._nsmsg = an.substring(an.indexOf(":")+1) + ":";
            }
            if (doc.documentElement.attributes[i].nodeValue == this._proxy._targetNamespace) {
                an = doc.documentElement.attributes[i].nodeName;
                msg._nstns = an.substring(an.indexOf(":")+1) + ":";
            }
        }
        if (msg._nsmsg == "")
            msg._nsmsg = msg._nstns;

        // Find message node
        var mes = this._proxy._messages[this._messageOut.name];
        if (mes == null)
            return SOAPProxyUtils._createError(500, "Internal error: unknown response message");

        var msgname = mes.name;
        var nd;

        // Try all standard names for out message
        if (msgname == "__selfref") {
            var altmsgname = this._opname + "Response"; // Try "<Method>Response"
            nd = SOAPProxyUtils._getElementsByTagName(doc, msg._nsmsg + altmsgname);
            if (nd.length == 0) // Try SOAPENV prefix
                nd = SOAPProxyUtils._getElementsByTagName(doc, msg._nssoapenv + altmsgname);
            if (nd.length == 0) // Fallback to unprefixed name
                nd = SOAPProxyUtils._getElementsByTagName(doc, altmsgname);
            if (nd.length == 0) { // Try "<MessageName>"
                altmsgname = this._messageOut.name;
                nd = SOAPProxyUtils._getElementsByTagName(doc, msg._nsmsg + altmsgname);
                if (nd.length == 0) // Fallback to unprefixed name
                    nd = SOAPProxyUtils._getElementsByTagName(doc, altmsgname);
                if (nd.length == 0) // Try just "return"
                    nd = SOAPProxyUtils._getElementsByTagName(doc, "return");
            }
        } else {
            nd = SOAPProxyUtils._getElementsByTagName(doc, msg._nsmsg + msgname);
            if (nd.length == 0) // Fallback to unprefixed name
                nd = SOAPProxyUtils._getElementsByTagName(doc, msgname);
        }

        // Maybe fault message
        if (nd.length == 0) {
            // Is it fault message?
            if (SOAPProxyUtils._getElementsByTagName(doc, msg._nssoapenv + "Fault").length > 0) {
                var faultmsg = "Service fault";
                if ((nd = SOAPProxyUtils._getElementsByTagName(doc, "faultstring")).length > 0)
                    faultmsg = SOAPProxyUtils._nodeText(nd[0]);
                return SOAPProxyUtils._createError(500, faultmsg);
            } else
                return SOAPProxyUtils._createError(500, "Message node not found");
        }

        // Found message node
        var res = {};
        var parts = mes.parts;
        if (parts != null) {
            for (var i = 0; i < parts.length; i++) {
                var np = SOAPProxyUtils._getElementsByTagName(nd[0], parts[i].name);
                if (np.length == 0) // Try prefixed name
                    np = SOAPProxyUtils._getElementsByTagName(nd[0], msg._nstns + parts[i].name);
                if (np.length > 0)
                    res[parts[i].name] = this._proxy._types[parts[i].type].desf(np[0], this._proxy, msg);
                else
                    res[parts[i].name] = null;
            }
            if (parts.length == 1)
                res = res[parts[0].name];
        }
        return res;
    } catch (x) {
        return x;
    }
}

SOAPProxyOperation.prototype._dispatchResponse = function (async, resultcallback, faultcallback, xhr) {
    if (xhr.readyState != 4) {  // Failed to get data
        res = SOAPProxyUtils._createError(500, "Failed to get response")
        if (faultcallback)
            faultcallback(res, null, "", this._proxy);
        if (!async)
            return res;
    }
    this._proxy.lastResponse = xhr.responseText;
    this._proxy.lastStatusCode = xhr.status;
    this._proxy.lastResponseHeaders = xhr.getAllResponseHeaders();
    var res = this._parseOutput(xhr.responseXML);
    if (res instanceof Error) {
        if (faultcallback)
            faultcallback(res, xhr.responseXML, xhr.responseText, this._proxy);
    } else {
        if (resultcallback)
            resultcallback(res, xhr.responseXML, xhr.responseText, this._proxy);
    }
    if (!async)
        return res;
}

SOAPProxyOperation.prototype._dispatchFailure = function (async, faultcallback) {
    var res = SOAPProxyUtils._createError(500, "Failed to get response")
    if (faultcallback)
        faultcallback(res, null, "", this._proxy);
    if (!async)
        return res;
}

SOAPProxyFabric._onGotWSDL = function(callback, xhr, source) {
    var cache  = {};
    try {
        alert("Got WSDL " + xhr.resresponseXML);
        alert("Got WSDL " + xhr.responseText);
        cache.proxy = SOAPProxyFabric.fromDOM(xhr.responseXML);
        cache.wsdl = xhr.responseXML;
        cache.wsdlText = xhr.responseText;
        if ((cache.proxy != null) && (cache.wsdl != null))
            SOAPProxyFabric._wsdlCache[source] = cache;
        else
            cache.proxy = SOAPProxyUtils._createError(500, "Error loading WSDL");
    } catch (e) {
        cache.proxy = e;
    }
    if (callback)
        callback(cache.proxy, cache.wsdl, cache.wsdlText);
}

SOAPProxy.prototype._fetchBasicNamespaces = function () {
    if (this._wsdl.documentElement.attributes == null) {
        alert("Error1");
        throw SOAPProxyUtils._createError(500, "No attributes of documentElement in WSDL");
    }
    var attrs = this._wsdl.documentElement.attributes;
    alert("Nr of attibutes : " + attrs.length);

    if (attrs.getNamedItem("targetNamespace") == null) {
        alert("Error2");
        throw SOAPProxyUtils._createError(500, "No targetNamespace in documentElement in WSDL");
    }
    this._targetNamespace = attrs.getNamedItem("targetNamespace").nodeValue;
    for (var i =0; i < attrs.length; i++) {
        var an = attrs[i].nodeName;
        alert("Nodename : " + an);
        if (an.indexOf(":") != -1) {
            if (/\/wsdl\/$/.test(attrs[i].nodeValue)) // This is wsdl namespace
                this._nswsdl = an.substring(an.indexOf(":")+1) + ":";
            if (/\/wsdl\/soap\/$/.test(attrs[i].nodeValue)) // This is soap namespace
                this._nssoap = an.substring(an.indexOf(":")+1) + ":";
            if (/\/soap\/encoding\/$/.test(attrs[i].nodeValue)) // This is soapenc namespace
                this._nssoapenc = an.substring(an.indexOf(":")+1) + ":";
            if (/\/XMLSchema$/.test(attrs[i].nodeValue)) // This is xsd namespace
                this._nsxsd = an.substring(an.indexOf(":")+1) + ":";
            if (/\/XMLSchema-instance$/.test(attrs[i].nodeValue)) // This is xsi namespace
                this._nsxsi = an.substring(an.indexOf(":")+1) + ":";
            if (attrs[i].nodeValue == this._targetNamespace) // This is tns namespace
                this._nstns = an.substring(an.indexOf(":")+1) + ":";
        }
    }
}

SOAPProxy.prototype._fetchTypes = function () {
    // WSDL Types section
    for (var tn in this._types)
        this._types[tn].pfx = this._nsxsd;
    this._types["Array"].pfx = this._types["Struct"].pfx = this._nssoapenc;

    var wst = SOAPProxyUtils._getElementsByTagName(this._wsdl.documentElement, this._nswsdl + "types");
    if ((wst!= null) && (wst.length != 0) && (wst[0].childNodes.length != 0)) {
        var tl = SOAPProxyUtils._getElementsByTagName(wst[0], this._nsxsd + "schema");
        if (tl.length != 0)
            tl = tl[0].childNodes;
        // fetch complex types from wsdl
        for (var i = 0; i < tl.length; i++)
            if (tl[i].nodeType == 1) { // elements only
                switch (tl[i].nodeName) {
                    default: continue;

                    case this._nsxsd + "complexType":
                    case "complexType":
                        var td = SOAPProxyUtils._parseComplexTypeNode(tl[i], this);
                        if ((td.typename != "") && (typeof(td.type) == "object"))
                            this._types[td.typename] = td.type;
                        continue;
                }
            }
    }
}

SOAPProxy.prototype._fetchElements = function () {
    var wst = SOAPProxyUtils._getElementsByTagName(this._wsdl.documentElement, this._nswsdl + "types");
    if ((wst!= null) && (wst.length != 0) && (wst[0].childNodes.length != 0)) {
        var tl = SOAPProxyUtils._getElementsByTagName(wst[0], this._nsxsd + "schema");
        if (tl.length != 0)
            tl = tl[0].childNodes;
        // fetch elements from wsdl
        for (var i = 0; i < tl.length; i++)
            if (tl[i].nodeType == 1) { // elements only
                switch (tl[i].nodeName) {
                    default: continue;

                    case this._nsxsd + "element":
                    case "element":
                        if (tl[i].attributes.getNamedItem("name") != null) { // Need valid element
                            var en = tl[i].attributes.getNamedItem("name").nodeValue;
                            if (tl[i].attributes.getNamedItem("type") != null) { // Simple type (inline)
                                var et = tl[i].attributes.getNamedItem("type").nodeValue;
                                if (et.indexOf(":") != -1)
                                    et = et.substring(et.indexOf(":")+1);
                                if (this._types[et] != null)
                                    this._elements[en] = { name: en, type: et};
                            } else { // Complex type (child element)
                                var ct = SOAPProxyUtils._getElementsByTagName(tl[i], this._nsxsd + "complexType");
                                if (ct.length == 0)
                                    ct = SOAPProxyUtils._getElementsByTagName(tl[i], "complexType");
                                if (ct.length != 0) {
                                    var td = SOAPProxyUtils._parseComplexTypeNode(ct[0], this);
                                    if (typeof(td.type) == "object") {
                                        td.pfx = this._nstns;
                                        if (td.typename != "") {
                                            if (this._types[td.typename] == null)
                                                this._types[td.typename] = td.type;
                                            this._elements[en] = {name: en, type: td.typename};
                                        } else {
                                            td.typename = "__elt"+en;
                                            if (this._types[td.typename] == null)
                                                this._types[td.typename] = td.type;
                                            this._elements[en] = {name: en, type: td.typename};
                                        }
                                    }
                                }
                            }
                        }
                        continue;
                }
            }
    }
}

SOAPProxy.prototype._fetchMessages = function () {
    // WSDL Messages section
    var wsm = SOAPProxyUtils._getElementsByTagName(this._wsdl.documentElement, this._nswsdl + "message");
    if ((wsm!= null) && (wsm.length != 0))
        for (var mi = 0; mi < wsm.length; mi++) {
            if (wsm[mi].attributes.getNamedItem("name") == null)
                continue;
            var mn = wsm[mi].attributes.getNamedItem("name").nodeValue;
            var min = "__selfref";
            var msp = SOAPProxyUtils._getElementsByTagName(wsm[mi], this._nswsdl + "part");
            var mp = new Array();
            if ((msp!= null) && (msp.length != 0)) {
                var goout = false;
                for (var pi = 0; !goout && (pi < msp.length); pi++)
                    if (msp[pi].attributes.getNamedItem("name") != null) {
                        var pn = msp[pi].attributes.getNamedItem("name").nodeValue;
                        // Self-defined type?
                        if (msp[pi].attributes.getNamedItem("type")) {
                            var pt = "__any";
                            pt = msp[pi].attributes.getNamedItem("type").nodeValue;
                            if (pt.indexOf(":") != -1)
                                pt = pt.substring(pt.indexOf(":")+1);
                            if (this._types[pt] == null)
                                pt = "__any";
                            mp.push({ name: ""+pn, type: ""+pt });
                            continue;
                        }
                        // Element reference?
                        if (msp[pi].attributes.getNamedItem("element")) {
                            var pe = msp[pi].attributes.getNamedItem("element").nodeValue;
                            if (pe.indexOf(":") != -1)
                                pe = pe.substring(pe.indexOf(":")+1);
                            if (this._elements[pe] == null) // Skip unknown element
                                continue;
                            var t = this._types[this._elements[pe].type];
                            if (t != null) {
                                mp = new Array();
                                if (t.children != null)
                                    for (var i = 0; i < t.children.length; i++)
                                        mp.push({ name: t.children[i].eln, type: t.children[i].elt });
                                // only one element reference!
                                min = pe;
                                goout = true;
                                continue;
                            } else // Invalid part
                                continue;
                        }
                        // something strange, skip it
                    }
            }
            this._messages[mn] = {name: min, parts: mp};
        }
}

SOAPProxy.prototype._fetchOperations = function () {
    // WSDL Messages section
    var wspt = SOAPProxyUtils._getElementsByTagName(this._wsdl.documentElement, this._nswsdl + "portType");
    if ((wspt!= null) && (wspt.length != 0) && (wspt[0].childNodes.length != 0)) {
        var ol = wspt[0].childNodes;
        for (var i = 0; i < ol.length; i++)
            if (ol[i].nodeName == this._nswsdl + "operation") {
                if (ol[i].attributes.getNamedItem("name") == null)
                    continue;
                var opname = ol[i].attributes.getNamedItem("name").nodeValue;
                var msgin = SOAPProxyUtils._getElementsByTagName(ol[i], this._nswsdl + "input");
                if (msgin.length == 0)
                    continue;
                if (msgin[0].attributes.getNamedItem("message") == null)
                    continue;
                var msginname = msgin[0].attributes.getNamedItem("message").nodeValue;
                if (msginname.indexOf(":") != -1)
                    msginname = msginname.substring(msginname.indexOf(":")+1);
                if (this._messages[msginname] == null)
                    continue;
                var msgout = SOAPProxyUtils._getElementsByTagName(ol[i], this._nswsdl + "output");
                if (msgout.length == 0)
                    continue;
                if (msgout[0].attributes.getNamedItem("message") == null)
                    continue;
                var msgoutname = msgout[0].attributes.getNamedItem("message").nodeValue;
                if (msgoutname.indexOf(":") != -1)
                    msgoutname = msgoutname.substring(msgoutname.indexOf(":")+1);
                if (this._messages[msgoutname] == null)
                    continue;
                var newop = new SOAPProxyOperation(this);
                newop._opname = opname;
                newop._messageIn = {name: msginname, messageNamespace: "", encodingStyle: ""};
                newop._messageOut = {name: msgoutname, messageNamespace: "", encodingStyle: ""};
                this._operations[opname] = newop;
            }
    }
}

SOAPProxy.prototype._fetchBindings = function () {
    // WSDL Messages section
    var wsb = SOAPProxyUtils._getElementsByTagName(this._wsdl.documentElement, this._nswsdl + "binding");
    if ((wsb!= null) && (wsb.length != 0) && (wsb[0].childNodes.length != 0)) {
        var ol = wsb[0].childNodes;
        for (var i = 0; i < ol.length; i++)
            if (ol[i].nodeName == this._nswsdl + "operation") {
                if (ol[i].attributes.getNamedItem("name") == null)
                    continue;
                var opname = ol[i].attributes.getNamedItem("name").nodeValue;
                if (this._operations[opname] == null)
                    continue;
                var opnode = SOAPProxyUtils._getElementsByTagName(ol[i], this._nssoap + "operation");
                if (opnode.length == 0)
                    continue;
                if (opnode[0].attributes.getNamedItem("soapAction") == null)
                    continue;
                this._operations[opname]._soapAction = opnode[0].attributes.getNamedItem("soapAction").nodeValue

                var msgin = SOAPProxyUtils._getElementsByTagName(ol[i], this._nswsdl + "input");
                if (msgin.length == 0)
                    continue;
                var bodyin = SOAPProxyUtils._getElementsByTagName(msgin[0], this._nssoap + "body");
                if (bodyin.length == 0)
                    continue;
                if (bodyin[0].attributes.getNamedItem("namespace") != null)
                    this._operations[opname]._messageIn.messageNamespace = bodyin[0].attributes.getNamedItem("namespace").nodeValue;
                if (bodyin[0].attributes.getNamedItem("encodingStyle") != null)
                    this._operations[opname]._messageIn.encodingStyle = bodyin[0].attributes.getNamedItem("encodingStyle").nodeValue;

                var msgout = SOAPProxyUtils._getElementsByTagName(ol[i], this._nswsdl + "input");
                if (msgout.length == 0)
                    continue;
                var bodyout = SOAPProxyUtils._getElementsByTagName(msgout[0], this._nssoap + "body");
                if (bodyout.length == 0)
                    continue;
                if (bodyout[0].attributes.getNamedItem("namespace") != null)
                    this._operations[opname]._messageOut.messageNamespace = bodyout[0].attributes.getNamedItem("namespace").nodeValue;
                if (bodyout[0].attributes.getNamedItem("encodingStyle") != null)
                    this._operations[opname]._messageOut.encodingStyle = bodyout[0].attributes.getNamedItem("encodingStyle").nodeValue;
            }
    }
    // WSDL Service section
    var wss = SOAPProxyUtils._getElementsByTagName(this._wsdl.documentElement, this._nswsdl + "service");
    if (wss.length == 0)
        return;
    var wsp = SOAPProxyUtils._getElementsByTagName(wss[0], this._nswsdl + "port");
    if (wsp.length == 0)
        return;
    var wsa = SOAPProxyUtils._getElementsByTagName(wsp[0], this._nssoap + "address");
    if (wsa.length == 0)
        return;
    var loc = wsa[0].attributes.getNamedItem("location");
    if (loc != null)
        this.serviceUrl = loc.nodeValue;
}

SOAPProxy.prototype._buildMethods = function () {
    for (var opname in this._operations)
        this[opname] = new Function("params", "async", "resultcallback", "faultcallback",
            "return this.invoke(\"" + opname + "\", params, async, resultcallback, faultcallback);");
}

//private utility properties
SOAPProxyUtils._rxdo = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)([+\-])(\d{2}):(\d{2})$/i;
SOAPProxyUtils._rxdz =  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/i;

//private utility functions
SOAPProxyUtils._typeof = function (o) {
    if (o == null)
        return "null";
    if (o.constructor.toString().indexOf("function Date()") != -1)
        return "date";
    if (o.constructor.toString().indexOf("function Array()") != -1)
        if (o.length > 0)
            for (var sample in o)
                if (isNaN(sample)) // array is hash
                    return "object";
                else
                    return "array";
    return typeof(o);
}

SOAPProxyUtils._stringToString = function (o) {
    var r = o;
    if (typeof(o) != "string")
        r = o.toString()
    return r.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
SOAPProxyUtils._integerToString = function (o) {
    var r = o;
    if (typeof(o) != "number")
        r = parseInt(o);
    return Math.round(r).toString();
}
SOAPProxyUtils._floatToString = function (o) {
    var r = o;
    if (typeof(o) != "number")
        r = parseFloat(o);
    return r.toString();
}
SOAPProxyUtils._booleanToString = function (o) {
    if (o)
        return "true";
    else
        return "false";
}
SOAPProxyUtils._dateToString = function (o) {
    var r = o;
    if(o.constructor.toString().indexOf("function Date()") == -1) {
        if (typeof(o) == "string") {
            var t = Date.parse(o);
            if (isNaN(t))
                r = SOAPProxyUtils._stringToDate(o);
            else {
                r = new Date();
                r.setTime(t);
            }
            if (r == null)
                return "";
        }
    } else
    if (isNaN(r.getTime()))
        return "";
    var year = r.getFullYear().toString();
    var month = (r.getMonth() + 1).toString(); month = (month.length == 1) ? "0" + month : month;
    var date = r.getDate().toString(); date = (date.length == 1) ? "0" + date : date;
    var hours = r.getHours().toString(); hours = (hours.length == 1) ? "0" + hours : hours;
    var minutes = r.getMinutes().toString(); minutes = (minutes.length == 1) ? "0" + minutes : minutes;
    var seconds = r.getSeconds().toString(); seconds = (seconds.length == 1) ? "0" + seconds : seconds;
    var milliseconds = r.getMilliseconds().toString();
    var tzminutes = Math.abs(r.getTimezoneOffset());
    var tzhours = 0;
    while(tzminutes >= 60) { tzhours++; tzminutes -= 60; }
    tzminutes = (tzminutes.toString().length == 1) ? "0" + tzminutes.toString() : tzminutes.toString();
    tzhours = (tzhours.toString().length == 1) ? "0" + tzhours.toString() : tzhours.toString();
    var timezone = ((r.getTimezoneOffset() < 0) ? "+" : "-") + tzhours + ":" + tzminutes;
    return year + "-" + month + "-" + date + "T" + hours + ":" + minutes + ":" + seconds + "." + milliseconds + timezone;
}
SOAPProxyUtils._stringToDate = function (o) {
    if (o == null)
        return null;
    var a = SOAPProxyUtils._rxdz.exec(o);
    if (a != null) {
        var ms = 1000 * (+a[6] - Math.floor(+a[6]));
        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6], ms));
    }
    a = SOAPProxyUtils._rxdo.exec(o);
    if (a != null) {
        var ms = 1000 * (+a[6] - Math.floor(+a[6]));
        var dt = +(a[7]+"60000") * (+a[8]*60 + +a[9]);
        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6], ms) - dt);
    }
    return null;
}

SOAPProxyUtils._getXmlHttpRequest = function()
{
    try
    {
        if(window.XMLHttpRequest) // Try native XmlHttp
        {
            var xhr = new XMLHttpRequest();
            // some versions of Moz do not support the readyState property and the onreadystate event so we patch it!
            if(xhr.readyState == null) {
                xhr.readyState = 1;
                xhr.addEventListener("load", function() {
                    xhr.readyState = 4;
                    if(typeof xhr.onreadystatechange == "function")
                        xhr.onreadystatechange();
                }, false);
            }
            return xhr;
        }
        if(window.ActiveXObject) { // Try IE XmlHttp
            if (SOAPProxyUtils._getXmlHttpRequest.progid)
                return new ActiveXObject(SOAPProxyUtils._getXmlHttpRequest.progid);
            else
                var progids = ["Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
            for (var i = 0; i < progids.length; i++) {
                try {
                    var xhr = new ActiveXObject(progids[i]);
                    SOAPProxyUtils._getXmlHttpRequest.progid = progids[i];
                    return xhr;
                } catch (ex) {};
            }
        }
    }
    catch (ex) {}
    throw SOAPProxyUtils._createError(500, "No XmlHttp support");
}

SOAPProxyUtils._parseXML = function(input)
{
    try
    {
        var xml;
        if(window.ActiveXObject) {
            alert("ActiveXOject");
            xml = new ActiveXObject("Microsoft.XMLDOM");
            xml.async = false;
            xml.loadXML(input);
        } else
            xml = new DOMParser().parseFromString(input, "text/xml");
        alert("XML: " + xml);
        return xml;
    } catch (ex) {}
    throw SOAPProxyUtils._createError(500, "Can't create XML parser");
}

SOAPProxyUtils._createError = function(code, message) {
    if (window.navigator.appName.indexOf("Internet Explorer") != -1) {
        if (window.navigator.appVersion.indexOf("Trident") == -1) // IE 6.0
            return new Error();
        else
            return new Error(0+code, ""+message);
    } else {
        return new Error(""+message);
    }
}

SOAPProxyUtils._createDefaultTypes = function () {
    if (SOAPProxyUtils._defaultTypes != null)
        return SOAPProxyUtils._defaultTypes;
    SOAPProxyUtils._defaultTypes = new Array();
    SOAPProxyUtils._defaultTypes["null"] = "__null";
    SOAPProxyUtils._defaultTypes["function"] = "__empty";
    SOAPProxyUtils._defaultTypes["undefined"] = "__null";
    SOAPProxyUtils._defaultTypes["string"] = "string";
    SOAPProxyUtils._defaultTypes["number"] = "double";
    SOAPProxyUtils._defaultTypes["boolean"] = "boolean";
    SOAPProxyUtils._defaultTypes["date"] = "dateTime";
    SOAPProxyUtils._defaultTypes["array"] = "Array";
    SOAPProxyUtils._defaultTypes["object"] = "Struct";
    return SOAPProxyUtils._defaultTypes;
}

SOAPProxyUtils._createStandardTypes = function () {
    if (SOAPProxyUtils._standardTypes == null) {
        SOAPProxyUtils._standardTypes = new Array();

        // Standard serialization
        var _serNull = function (o, name, proxy) { return ""; /* return "<"+name+" xsi:nil=\"true\"/>"; */ };
        var _desNull = function (n, proxy, msg) { return null; };
        var _serStr = function (o, name, proxy) {
            if (o == null)
                return "<"+name+" xsi:nil=\"true\"/>";
            else
                return "<"+name+" xsi:type=\"" + this.pfx + this.name + "\">" + SOAPProxyUtils._stringToString(o) + "</"+name+">";
        };
        var _desStr = function (n, proxy, msg) {
            if (n.childNodes.length == 0)
                return null;
            else
                return SOAPProxyUtils._nodeText(n);
        };
        var _serBool = function (o, name, proxy) {
            if (o == null)
                return "<"+name+" xsi:nil=\"true\"/>";
            else
                return "<"+name+" xsi:type=\"" + this.pfx + this.name + "\">" + SOAPProxyUtils._booleanToString(o) + "</"+name+">";
        };
        var _desBool = function (n, proxy, msg) {
            if (n.childNodes.length == 0)
                return null;
            else
                return (SOAPProxyUtils._nodeText(n).toLowerCase() == "true");
        };
        var _serInt = function (o, name, proxy) {
            if (o == null)
                return "<"+name+" xsi:nil=\"true\"/>";
            else
                return "<"+name+" xsi:type=\"" + this.pfx + this.name + "\">" + SOAPProxyUtils._integerToString(o) + "</"+name+">";
        };
        var _desInt = function (n, proxy, msg) {
            if (n.childNodes.length == 0)
                return null;
            else
                return parseInt(SOAPProxyUtils._nodeText(n));
        };
        var _serFlo = function (o, name, proxy) {
            if (o == null)
                return "<"+name+" xsi:nil=\"true\"/>";
            else
                return "<"+name+" xsi:type=\"" + this.pfx + this.name + "\">" + SOAPProxyUtils._floatToString(o) + "</"+name+">";
        };
        var _desFlo = function (n, proxy, msg) {
            if (n.childNodes.length == 0)
                return null;
            else
                return parseFloat(SOAPProxyUtils._nodeText(n));
        };
        var _serDate = function (o, name, proxy) {
            if (o == null)
                return "<"+name+" xsi:nil=\"true\"/>";
            else
                return "<"+name+" xsi:type=\"" + this.pfx + this.name + "\">" + SOAPProxyUtils._dateToString(o) + "</"+name+">";
        };
        var _desDate = function (n, proxy, msg) {
            if (n.childNodes.length == 0)
                return null;
            else
                return SOAPProxyUtils._stringToDate(SOAPProxyUtils._nodeText(n));
        };
        var _serKnownArray = function (o, name, proxy) {
            var t = proxy._types[this.children[0].elt];
            if (o == null)
                return "<"+name+" xsi:nil=\"true\"/>";
            if (o.length == 0)
                return "<"+name+" SOAP-ENC:arrayType=\"" + t.pfx + t.name + "[0]\" xsi:type=\"soapenc:Array\"/>";
            else {
                var s = "<" + name + " SOAP-ENC:arrayType=\"" + t.pfx + t.name + "[" + o.length + "]\" xsi:type=\"soapenc:Array\">";
                for (var i = 0; i < o.length; i++)
                    s += t.serf(o[i], this.children[0].eln, proxy);
                s += "</" + name + ">";
                return s;
            }
        }
        var _desKnownArray = function (n, proxy, msg) {
            var res = new Array();
            if (n.childNodes.length > 0) {
                var t = proxy._types[this.children[0].elt];
                for (var i = 0; i < n.childNodes.length; i++)
                    if (n.childNodes[i].nodeType == 1) // elements only
                        res.push(t.desf(n.childNodes[i], proxy, msg));
            }
            return res;
        }
        var _serUnknownArray = function (o, name, proxy) {
            if (o == null)
                return "<"+name+" xsi:nil=\"true\"/>";
            if (o.length == 0)
                return "<"+name+" xsi:type=\"soapenc:Array\"/>";
            else {
                var s = "<" + name + " xsi:type=\"soapenc:Array\">";
                for (var i = 0; i < o.length; i++) {
                    var t = proxy._types[proxy._defaultTypes[SOAPProxyUtils._typeof(o[i])]];
                    s += t.serf(o[i], "item", proxy);
                }
                s += "</" + name + ">";
                return s;
            }
        }
        var _desUnknownArray = function (n, proxy, msg) {
            var res = new Array();
            if (n.childNodes.length > 0) {
                var itn = "__any";
                if (n.attributes.getNamedItem(msg._nssoapenc + "arrayType") != null) {
                    itn = n.attributes.getNamedItem(msg._nssoapenc + "arrayType").nodeValue;
                    if (itn.indexOf(":") != -1) itn = itn.substring(itn.indexOf(":")+1);
                    if (itn.indexOf("[") != -1) itn = itn.substring(0, itn.indexOf("["));
                }
                if (proxy._types[itn] == null) itn = "__any";
                var t = proxy._types[itn];
                for (var i = 0; i < n.childNodes.length; i++)
                    if (n.childNodes[i].nodeType == 1) // elements only
                        res.push(t.desf(n.childNodes[i], proxy, msg));
            }
            return res;
        }
        var _serKnownObject = function (o, name, proxy) {
            var cnt = 0;
            if (o == null)
                return "<"+name+" xsi:nil=\"true\"/>";
            if (this.children.length == 0)
                return "<"+name+" xsi:type=\"" + proxy._nsxsd +" nil\"/>";
            var s = "<" + name + " xsi:type=\"tns:" + this.name + "\">";
            for (var i = 0; i < this.children.length; i++)
                if (o[this.children[i].eln] != null) {
                    var t = proxy._types[this.children[i].elt];
                    s += t.serf(o[this.children[i].eln], this.children[i].eln, proxy);
                    cnt++;
                }
            if (cnt == 0)
                return "<"+name+"/>";
            s += "</" + name + ">";
            return s;
        }
        var _desKnownObject = function (n, proxy, msg) {
            var res = {};
            if (this.children.length > 0) {
                for (var i = 0; i < n.childNodes.length; i++)
                    if (n.childNodes[i].nodeType == 1) { // elements only
                        var nn = n.childNodes[i].nodeName;
                        if (nn.indexOf(":") != -1)
                            nn = nn.substring(nn.indexOf(":")+1);
                        for (var j = 0; j < this.children.length; j++)
                            if (nn == this.children[j].eln) {
                                var t = proxy._types[this.children[j].elt];
                                res[nn] = t.desf(n.childNodes[i], proxy, msg);
                            }
                    }
            }
            return res;
        }
        var _serUnknownObject = function (o, name, proxy) {
            var cnt = 0;
            if (o == null)
                return "<"+name+" xsi:type=\"" + proxy._nsxsd +" nil\"/>";
            if (typeof(o) == "function")
                return "";
            var tn = SOAPProxyUtils._typeof(o);
            if (tn != "object")
                return proxy._types[SOAPProxyUtils._defaultTypes[tn]].serf(o, name, proxy);
            var s = "<" + name + " xsi:type=\"soapenc:Struct\">";
            for (var p in o) {
                var t = proxy._types[proxy._defaultTypes[SOAPProxyUtils._typeof(o[p])]];
                if (t != null) {
                    s += t.serf(o[p], p, proxy);
                    cnt++;
                }
            }
            if (cnt == 0)
                return "<"+name+"/>";
            s += "</" + name + ">";
            return s;
        }
        var _desUnknownObject = function (n, proxy, msg) {
            var tn = "__any";
            if (n.attributes.getNamedItem(msg._nssoapenc + "arrayType") != null) {
                var atn = "__any";
                atn = n.attributes.getNamedItem(msg._nssoapenc + "arrayType").nodeValue;
                if (atn.indexOf(":") != -1) atn = atn.substring(atn.indexOf(":")+1);
                if (atn.indexOf("[") != -1) atn = atn.substring(0, atn.indexOf("[")) + "[]";
                if (proxy._types[atn] != null)
                    return proxy._types[atn].desf(n, proxy, msg);
                else
                    return proxy._types["Array"].desf(n, proxy, msg)
            }
            if (n.attributes.getNamedItem(msg._nsxsi + "type") != null) {
                tn = n.attributes.getNamedItem(msg._nsxsi + "type").nodeValue;
                if (tn.indexOf(":") != -1) tn = tn.substring(tn.indexOf(":")+1);
            }
            if ((tn != "__any") && (tn != "Struct") && (proxy._types[tn] != null))
                return proxy._types[tn].desf(n, proxy, msg);
            if (n.childNodes.length == 0) // empty
                return "";
            if ((n.childNodes.length == 1) && ((n.childNodes[0].nodeType == 3) || (n.childNodes[0].nodeType == 4))) // has textnode
                return SOAPProxyUtils._nodeText(n);
            var res = {};
            for (var i = 0; i < n.childNodes.length; i++)
                if (n.childNodes[i].nodeType == 1) { // elements only
                    res[n.childNodes[i].nodeName] = proxy._types["__any"].desf(n.childNodes[i], proxy, msg);
                }
            return res;
        }
        // Well-known types
        SOAPProxyUtils._standardTypes["__empty"] = { pfx: "", serf: function() { return ""; }, desf: null, children: null };

        SOAPProxyUtils._standardTypes["__null"] = { pfx: "", serf: _serNull, desf: _desNull, children: null };

        SOAPProxyUtils._standardTypes["__any"] = { pfx: "", serf: _serUnknownObject, desf: _desUnknownObject, children: null };
        SOAPProxyUtils._standardTypes["ur-type"] = { pfx: "", serf: _serUnknownObject, desf: _desUnknownObject, children: null };

        SOAPProxyUtils._standardTypes["__dummyObject"] = { pfx: "", serf: _serKnownObject, desf: _desKnownObject, children: null };

        SOAPProxyUtils._standardTypes["string"] = { pfx: "",  serf: _serStr, desf: _desStr, children: null };
        SOAPProxyUtils._standardTypes["string[]"] = { pfx: "", serf: _serKnownArray, desf: _desKnownArray, children: [{ eln: "item", elt: "string" }] };

        SOAPProxyUtils._standardTypes["boolean"] = { pfx: "", serf: _serBool, desf: _desBool, children: null };
        SOAPProxyUtils._standardTypes["boolean[]"] = { pfx: "", serf: _serKnownArray, desf: _desKnownArray, children: [{ eln: "item", elt: "boolean" }] };

        SOAPProxyUtils._standardTypes["decimal"] = { pfx: "", serf: _serFlo, desf: _desFlo, children: null };
        SOAPProxyUtils._standardTypes["float"] = { pfx: "", serf: _serFlo, desf: _desFlo, children: null };
        SOAPProxyUtils._standardTypes["double"] = { pfx: "", serf: _serFlo, desf: _desFlo, children: null };
        SOAPProxyUtils._standardTypes["decimal[]"] = { pfx: "", serf: _serKnownArray, desf: _desKnownArray, children: [{ eln: "item", elt: "decimal" }] };
        SOAPProxyUtils._standardTypes["float[]"] = { pfx: "", serf: _serKnownArray, desf: _desKnownArray, children: [{ eln: "item", elt: "float" }] };
        SOAPProxyUtils._standardTypes["double[]"] = { pfx: "", serf: _serKnownArray, desf: _desKnownArray, children: [{ eln: "item", elt: "double" }] };

        SOAPProxyUtils._standardTypes["integer"] = { pfx: "", serf: _serInt, desf: _desInt, children: null };
        SOAPProxyUtils._standardTypes["byte"] = { pfx: "", serf: _serInt, desf: _desInt, children: null };
        SOAPProxyUtils._standardTypes["short"] = { pfx: "", serf: _serInt, desf: _desInt, children: null };
        SOAPProxyUtils._standardTypes["int"] = { pfx: "", serf: _serInt, desf: _desInt, children: null };
        SOAPProxyUtils._standardTypes["long"] = { pfx: "", serf: _serInt, desf: _desInt, children: null };
        SOAPProxyUtils._standardTypes["unsignedByte"] = { pfx: "", serf: _serInt, desf: _desInt, children: null };
        SOAPProxyUtils._standardTypes["unsignedShort"] = { pfx: "", serf: _serInt, desf: _desInt, children: null };
        SOAPProxyUtils._standardTypes["unsignedInt"] = { pfx: "", serf: _serInt, desf: _desInt, children: null };
        SOAPProxyUtils._standardTypes["unsignedLong"] = { pfx: "", serf: _serInt, desf: _desInt, children: null };
        SOAPProxyUtils._standardTypes["integer[]"] = { pfx: "", serf: _serKnownArray, desf: _desKnownArray, children: [{ eln: "item", elt: "integer" }] };
        SOAPProxyUtils._standardTypes["byte[]"] = { pfx: "", serf: _serKnownArray, desf: _desKnownArray, children: [{ eln: "item", elt: "byte" }] };
        SOAPProxyUtils._standardTypes["short[]"] = { pfx: "", serf: _serKnownArray, desf: _desKnownArray, children: [{ eln: "item", elt: "short" }] };
        SOAPProxyUtils._standardTypes["int[]"] = { pfx: "", serf: _serKnownArray, desf: _desKnownArray, children: [{ eln: "item", elt: "int" }] };
        SOAPProxyUtils._standardTypes["long[]"] = { pfx: "", serf: _serKnownArray, desf: _desKnownArray, children: [{ eln: "item", elt: "long" }] };
        SOAPProxyUtils._standardTypes["unsignedByte[]"] = { pfx: "", serf: _serKnownArray, desf: _desKnownArray, children: [{ eln: "item", elt: "unsignedByte" }] };
        SOAPProxyUtils._standardTypes["unsignedShort[]"] = { pfx: "", serf: _serKnownArray, desf: _desKnownArray, children: [{ eln: "item", elt: "unsignedShort" }] };
        SOAPProxyUtils._standardTypes["unsignedInt[]"] = { pfx: "", serf: _serKnownArray, desf: _desKnownArray, children: [{ eln: "item", elt: "unsignedInt" }] };
        SOAPProxyUtils._standardTypes["unsignedLong[]"] = { pfx: "", serf: _serKnownArray, desf: _desKnownArray, children: [{ eln: "item", elt: "unsignedLong" }] };

        SOAPProxyUtils._standardTypes["dateTime"] = { pfx: "", serf: _serDate, desf: _desDate, children: null };
        SOAPProxyUtils._standardTypes["dateTime[]"] = { pfx: "", serf: _serKnownArray, desf: _desKnownArray, children: [{ eln: "item", elt: "dateTime" }] };

        SOAPProxyUtils._standardTypes["Array"] = { pfx: "", serf: _serUnknownArray, desf: _desUnknownArray, children: null };
        SOAPProxyUtils._standardTypes["Struct"] = { pfx: "", serf: _serUnknownObject, desf: _desUnknownObject, children: null };
    }

    var res = new Array();
    for (var tn in SOAPProxyUtils._standardTypes) {
        res[tn] = SOAPProxyUtils._standardTypes[tn]
        res[tn].name = tn;
    }
    return res;
}

SOAPProxyUtils._parseComplexTypeNode = function (n, proxy) {
    var tn = "";
    var t;
    if (n.attributes.getNamedItem("name") != null)
        tn = n.attributes.getNamedItem("name").nodeValue;
    // find content node
    for (var i=0; i < n.childNodes.length; i++)
        switch (n.childNodes[i].nodeName) {
            case "all":
            case proxy._nsxsd+"all":
            case "sequence":
            case proxy._nsxsd+"sequence":
                var cl = SOAPProxyUtils._getElementsByTagName(n.childNodes[i], proxy._nsxsd + "element");
                if (cl.length == 0)
                    cl = n.childNodes[i].getElemetsByTagName("element");
                if (cl.length == 0) // empty complex type
                    continue;
                if (cl.length == 1) { // it may be array type
                    var maxOccurs = "1";
                    if (cl[0].attributes.getNamedItem("maxOccurs") != null)
                        maxOccurs = cl[0].attributes.getNamedItem("maxOccurs").nodeValue;
                    if (maxOccurs != "1") { // guess it IS array
                        var et = "__any";
                        if (cl[0].attributes.getNamedItem("type") != null)
                            et = cl[0].attributes.getNamedItem("type").nodeValue;
                        if (et.indexOf(":") != -1)
                            et = et.substring(et.indexOf(":")+1);
                        var en = "item";
                        if (cl[0].attributes.getNamedItem("name") != null)
                            en = cl[0].attributes.getNamedItem("name").nodeValue;
                        t = { pfx: proxy._nstns,
                            name: tn,
                            serf: SOAPProxyUtils._standardTypes["string[]"].serf,
                            desf: SOAPProxyUtils._standardTypes["string[]"].desf,
                            children: [{ eln: en, elt: et}]
                        };
                        return {typename: tn, type: t}
                    }
                }
                // it is struct
                var chld = new Array();
                for (var j = 0; j < cl.length; j++) {
                    var et = "__any";
                    if (cl[j].attributes.getNamedItem("type") != null)
                        et = cl[j].attributes.getNamedItem("type").nodeValue;
                    if (et.indexOf(":") != -1)
                        et = et.substring(et.indexOf(":")+1);
                    var en = "";
                    if (cl[j].attributes.getNamedItem("name") != null)
                        en = cl[j].attributes.getNamedItem("name").nodeValue;
                    if (en != "")
                        chld.push({ eln: en, elt: et});
                }
                t = { pfx: proxy._nstns,
                    name: tn,
                    serf: SOAPProxyUtils._standardTypes["__dummyObject"].serf,
                    desf: SOAPProxyUtils._standardTypes["__dummyObject"].desf,
                    children: chld
                };
                return { typename: tn, type: t };
        }
    // empty complex type
    t = { pfx: proxy._nsxsd,
        name: "nil",
        serf: SOAPProxyUtils._standardTypes["__null"].serf,
        desf: SOAPProxyUtils._standardTypes["__null"].desf,
        children: null
    };
    return { typename: tn, type: t };
}

SOAPProxyUtils._getElementsByTagName =
    (
        (window.navigator.appVersion.indexOf("Chrome") == -1) &&
            (window.navigator.appName.indexOf("Opera") == -1)
        )
        ?
        function (n, name) {
            return n.getElementsByTagName(name)
        }
        :
        function (n, name) {
            var tl;
            tl = n.getElementsByTagName(name.substring(name.indexOf(":")+1));
            var res = new Array();
            for (var i = 0; i < tl.length; i++)
                if (tl[i].nodeName == name)
                    res.push(tl[i]);
            return res;
        };

SOAPProxyUtils._nodeText = (window.navigator.appName.indexOf("Internet Explorer") == -1) ?
    function (n) {
        return n.textContent;
    } :
    function (n) {
        if (n.text != null) // text node
            return n.text;
        else // MUST be leaf node
            return ((n.firstChild == null) || (n.firstChild.text == null)) ? "" : n.firstChild.text;
    };
