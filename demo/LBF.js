!function (e, t) {
    function r(e) {
        return function (t) {
            return {}.toString.call(t) == "[object " + e + "]"
        }
    }

    function n() {
        return U++
    }

    function i(e, t, r) {
        r = r || this;
        for (var n = 0, i = e.length; n < i; n++) "undefined" != typeof e[n] && t.call(r, e[n], n, e)
    }

    function a(e) {
        return e.match(R)[0]
    }

    function o(e) {
        for (e = (e = e.replace(G, "/")).replace(k, "$1/"); e.match($);) e = e.replace($, "/");
        return e
    }

    function s(e) {
        var t = e.length - 1, r = e.charAt(t);
        return "#" === r ? e.substring(0, t) : ".css" === e.substring(t - 3) ? e : ".js" === e.substring(t - 2) || e.indexOf("?") > 0 || "/" === r ? e : e + ".js"
    }

    function u(e) {
        var t = w.alias;
        return t && F(t[e]) ? t[e] : e
    }

    function c(e) {
        var t;
        if (e.indexOf(".") > -1 && (t = M.exec(e))) {
            var r;
            (r = t[1]) && (e = e.substring(0, e.lastIndexOf(r))), r = ".js" + (r || ""), e = e.split(".").join("/") + r
        }
        return e
    }

    function f(e) {
        var t, r = w.paths;
        return r && (t = e.match(X)) && F(r[t[1]]) && (e = r[t[1]] + t[2]), e
    }

    function l(e) {
        var t = w.vars;
        return t && e.indexOf("{") > -1 && (e = e.replace(H, function (e, r) {
            return F(t[r]) ? t[r] : e
        })), e
    }

    function v(e) {
        var t = w.map, r = e;
        if (t) for (var n = 0, i = t.length; n < i; n++) {
            var a = t[n];
            if ((r = q(a) ? a(e) || e : e.replace(a[0], a[1])) !== e) break
        }
        return r
    }

    function d(e, t) {
        var r, n = e.charAt(0);
        if (Q.test(e)) r = e; else if ("." === n) r = o((t ? a(t) : w.cwd) + e); else if ("/" === n) {
            var i = w.cwd.match(V);
            r = i ? i[0] + e.substring(1) : e
        } else r = w.base + e;
        return 0 === r.indexOf("//") && (r = location.protocol + r), r
    }

    function h(e, t, r) {
        var n = te.test(e), i = J.createElement(n ? "link" : "script");
        if (r) {
            var a = q(r) ? r(e) : r;
            a && (i.charset = a)
        }
        return g(i, t, n, e), n ? (i.rel = "stylesheet", i.href = e) : (i.async = !0, i.src = e), Y = i, ee ? Z.insertBefore(i, ee) : Z.appendChild(i), Y = null, i
    }

    function g(e, t, r, n) {
        function i() {
            e.onload = e.onerror = e.onreadystatechange = null, r || w.debug || Z.removeChild(e), e = null, t()
        }

        var a = "onload" in e;
        !r || !re && a ? a ? (e.onload = i, e.onerror = function () {
            j("error", {uri: n, node: e}), i()
        }) : e.onreadystatechange = function () {
            /loaded|complete/.test(e.readyState) && i()
        } : setTimeout(function () {
            p(e, t)
        }, 1)
    }

    function p(e, t) {
        var r, n = e.sheet;
        if (re) n && (r = !0); else if (n) try {
            n.cssRules && (r = !0)
        } catch (i) {
            "NS_ERROR_DOM_SECURITY_ERR" === i.name && (r = !0)
        }
        setTimeout(function () {
            r ? t() : p(e, t)
        }, 20)
    }

    function m() {
        if (Y) return Y;
        if (z && "interactive" === z.readyState) return z;
        for (var e = Z.getElementsByTagName("script"), t = e.length - 1; t >= 0; t--) {
            var r = e[t];
            if ("interactive" === r.readyState) return z = r
        }
    }

    function b(e) {
        var t = oe.exec(e), r = ie;
        if (!t) return [];
        "require" !== (t = t[1]) && (r = (r = r.toString().replace(/require/g, t)).slice(1, r.length - 2), r = new RegExp(r, "g"));
        var n = [];
        return e.replace(ae, "").replace(r, function (e, t, r) {
            r && n.push(r)
        }), n
    }

    function y(e, t) {
        this.uri = e, this.dependencies = t || [], this.exports = null, this.status = 0, this._waitings = {}, this._remain = 0
    }

    function E(e) {
        var t = w.combo;
        switch (typeof t) {
            case"string":
                return -1 === e.indexOf(t);
            default:
                return !1
        }
    }

    function x(e) {
        var t = [], r = ye.exec(e[0])[1], n = r.length;
        i(e, function (e) {
            t.push(e.substr(n))
        }), S(r, t)
    }

    function S(e, t) {
        for (var r = [], n = 0, i = t.length; n < i; n++) r[n] = t[n].replace(/\?.*$/, "");
        var a = e + me[0] + r.join(me[1]);
        he && (a += he);
        var o = t.length > be;
        if (t.length > 1 && o) {
            var s = O(t, be);
            S(e, s[0]), S(e, s[1])
        } else {
            if (o) throw new Error("The combo url is too long: " + a);
            for (var n = 0, i = t.length; n < i; n++) pe[e + t[n]] = a
        }
    }

    function O(e, t) {
        for (var r = 0, n = e.length; r < n; r++) if (r > t - 1) return [e.splice(0, r), e]
    }

    function _(e) {
        return Ee.test(e)
    }

    function A(e) {
        if (de) return de.test ? de.test(e) : de(e)
    }

    function L(e) {
        var t = w.comboSyntax || me, r = t[0], n = t[1];
        return r && e.indexOf(r) > 0 || n && e.indexOf(n) > 0
    }

    if (e.LBF) var T = e.LBF;
    var exports = e.LBF = {version: "2.0.0"}, w = exports.data = {};
    exports.noConflict = function () {
        T && (e.LBF = T)
    };
    var N = r("Object"), F = r("String"), B = Array.isArray || r("Array"), q = r("Function"), D = r("Number"),
        C = r("RegExp"), U = 0, I = w.events = {};
    exports.on = function (e, t) {
        return (I[e] || (I[e] = [])).push(t), exports
    }, exports.off = function (e, t) {
        if (!e && !t) return I = w.events = {}, exports;
        var r = I[e];
        if (r) if (t) for (var n = r.length - 1; n >= 0; n--) r[n] === t && r.splice(n, 1); else delete I[e];
        return exports
    };
    var j = exports.emit = function (e, t) {
            var r = I[e];
            if (r) for (var n = 0, i = (r = r.slice()).length; n < i; n++) r[n](t);
            return exports
        }, R = /[^?#]*\//, G = /\/\.\//g, $ = /\/[^/]+\/\.\.\//, k = /([^:/])\/+\//g, X = /^([^/:]+)(\/.+)$/,
        H = /{([^{]+)}/g, M = /^[\w-_]*(?:\.[\w-_]+)*(\?[\w-_&=]*)?$/, Q = /^\/\/.|:\//, V = /^.*?\/\/.*?\//,
        J = document, K = location.href && 0 !== location.href.indexOf("about:") ? a(location.href) : "", P = J.scripts,
        W = a(function (e) {
            return e.hasAttribute ? e.src : e.getAttribute("src", 4)
        }(J.getElementById("LBFnode") || P[P.length - 1]) || K);
    exports.resolve = function (e, t) {
        if (!e) return "";
        var r = d(e = s(e = l(e = f(e = u(e = c(e = u(e)))))), t);
        return r = v(r)
    };
    var Y, z, Z = J.head || J.getElementsByTagName("head")[0] || J.documentElement,
        ee = Z.getElementsByTagName("base")[0], te = /\.css(?:\?|$)/i,
        re = +navigator.userAgent.replace(/.*(?:AppleWebKit|AndroidWebKit)\/(\d+).*/, "$1") < 536;
    exports.request = h;
    var ne,
        ie = /"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g,
        ae = /\\\\/g, oe = /^function[\s]*\([\s]*([^\s,\)]+)/, se = exports.cache = {}, ue = {}, ce = {}, fe = {},
        le = y.STATUS = {FETCHING: 1, SAVED: 2, LOADING: 3, LOADED: 4, EXECUTING: 5, EXECUTED: 6};
    y.prototype.resolve = function () {
        for (var e = this, t = e.dependencies, r = [], n = w.ignoreCss, i = 0, a = t.length; i < a; i++) n && -1 !== t[i].indexOf(".css") && (!0 === n || B(n) && -1 !== inArray(e.id, n)) || r.push(y.resolve(t[i], e.uri));
        return r
    }, y.prototype.load = function () {
        var e = this;
        if (!(e.status >= le.LOADING)) {
            e.status = le.LOADING;
            var t = e.resolve();
            j("beforeload", t), j("load", t);
            for (var r, n = e._remain = t.length, i = 0; i < n; i++) (r = y.get(t[i])).status < le.LOADED ? r._waitings[e.uri] = (r._waitings[e.uri] || 0) + 1 : e._remain--;
            if (0 !== e._remain) {
                var a = {};
                for (i = 0; i < n; i++) (r = se[t[i]]).status < le.FETCHING ? r.fetch(a) : r.status === le.SAVED && r.load();
                for (var o in a) a.hasOwnProperty(o) && a[o]()
            } else e.onload()
        }
    }, y.prototype.onload = function () {
        var e = this;
        e.status = le.LOADED, e.callback && e.callback();
        var t, r, n = e._waitings;
        for (t in n) n.hasOwnProperty(t) && ((r = se[t])._remain -= n[t], 0 === r._remain && r.onload());
        delete e._waitings, delete e._remain
    }, y.prototype.fetch = function (e) {
        function t() {
            exports.request(i.requestUri, i.onRequest, i.charset)
        }

        var r = this, n = r.uri;
        r.status = le.FETCHING;
        var i = {uri: n};
        j("fetch", i);
        var a = i.requestUri || n;
        a && !ce[a] ? ue[a] ? fe[a].push(r) : (ue[a] = !0, fe[a] = [r], j("request", i = {
            uri: n,
            requestUri: a,
            onRequest: function () {
                delete ue[a], ce[a] = !0, ne && (y.save(n, ne), ne = null);
                var e, t = fe[a];
                for (delete fe[a]; e = t.shift();) e.load()
            },
            charset: w.charset
        }), i.requested || (e ? e[i.requestUri] = t : t())) : r.load()
    }, y.prototype.exec = function () {
        function require(e) {
            return y.get(require.resolve(e)).exec()
        }

        var e = this;
        if (e.status >= le.EXECUTING) return e.exports;
        e.status = le.EXECUTING;
        var t = e.uri;
        require.resolve = function (e) {
            return y.resolve(e, t)
        }, require.async = function (e, r) {
            return y.use(e, r, t + "_async_" + n()), require
        };
        var r = e.factory, exports = q(r) ? r(require, e.exports = {}, e) : r;
        return void 0 === exports && (exports = e.exports), delete e.factory, e.exports = exports, e.status = le.EXECUTED, j("exec", e), exports
    }, y.resolve = function (e, t) {
        var r = {id: e, refUri: t};
        return j("resolve", r), r.uri || exports.resolve(r.id, t)
    }, y.define = function (e, t, r) {
        var n = arguments.length;
        1 === n ? (r = e, e = void 0) : 2 === n && (r = t, B(e) ? (t = e, e = void 0) : t = void 0), !B(t) && q(r) && (t = b(r.toString()));
        var i = {id: e, uri: y.resolve(e), deps: t, factory: r};
        if (!i.uri && J.attachEvent) {
            var a = m();
            a && (i.uri = a.src)
        }
        j("define", i), i.uri ? y.save(i.uri, i) : ne = i
    }, y.save = function (e, t) {
        var r = y.get(e);
        r.status < le.SAVED && (r.id = t.id || e, r.dependencies = t.deps || [], r.factory = t.factory, r.status = le.SAVED, j("save", r))
    }, y.get = function (e, t) {
        return se[e] || (se[e] = new y(e, t))
    }, y.use = function (t, r, n) {
        var t = function (e) {
            var e = B(e) ? e : [e], t = {}, r = [], n = 0, i = w.deps;
            for (n = 0; n < e.length; n++) if (!t[e[n]]) {
                t[e[n]] = !0, r.push(e[n]);
                for (var a = i[e[n]] || [], o = 0; o < a.length; o++) e.push(a[o])
            }
            return r
        }(t), i = y.get(n, B(t) ? t : [t]);
        i.callback = function () {
            for (var exports = [], t = i.resolve(), n = 0, a = t.length; n < a; n++) exports[n] = se[t[n]].exec();
            r && r.apply(e, exports), delete i.callback
        }, i.load()
    }, y.preload = function (e) {
        var t = w.preload, r = t.length;
        r ? y.use(t, function () {
            t.splice(0, r), y.preload(e)
        }, w.cwd + "_preload_" + n()) : e()
    }, exports.use = function (e, t) {
        return y.preload(function () {
            y.use(e, t, w.cwd + "_use_" + n())
        }), exports
    }, y.define.cmd = {}, e.define = exports.define = y.define, exports.Module = y, w.fetchedList = ce, w.cid = n, exports.require = function (e) {
        var t = y.get(y.resolve(e));
        return t.status < le.EXECUTING && (t.onload(), t.exec()), t.exports
    }, w.base = W, w.dir = W, w.cwd = K, w.charset = "utf-8", w.preload = [], w.deps = {}, exports.config = function (e) {
        for (var t in e) {
            var r = e[t], n = w[t];
            if (n && N(n)) for (var i in r) n[i] = r[i]; else B(n) ? r = n.concat(r) : "base" === t && ("/" !== r.slice(-1) && (r += "/"), r = d(r)), w[t] = r
        }
        return j("config", e), exports
    };
    var ve = [["globalSettings", exports.data], ["lang.forEach", i], ["lang.isType", r], ["lang.isObject", N], ["lang.isString", F], ["lang.isArray", B], ["lang.isFunction", q], ["lang.isNumber", D], ["lang.isRegExp", C], ["util.request", h]];
    e.JSON && ve.push(["lang.JSON", e.JSON]), e.jQuery && 0 === (e.jQuery.version || "").indexOf("1.7") && ve.push(["lib.jQuery", e.jQuery]), i(ve, function (e) {
        exports.define(e[0], function (require, exports, module) {
            module.exports = e[1]
        })
    });
    var de, he, ge = (y = LBF.Module).STATUS.FETCHING, pe = (w = LBF.data).comboHash = {}, me = ["c/=/", ",/"], be = 20;
    LBF.on("load", function (e) {
        var t = e.length;
        if (!(t < 2) && w.combo) {
            w.comboSyntax && (me = w.comboSyntax), w.comboMaxLength && (be = w.comboMaxLength), w.comboSuffix && (he = w.comboSuffix), de = w.comboExcludes;
            for (var r = [], n = 0; n < t; n++) {
                var i = e[n];
                pe[i] || E(i) || y.get(i).status < ge && !_(i) && !A(i) && !L(i) && r.push(i)
            }
            r.length > 1 && x(r)
        }
    }), LBF.on("fetch", function (e) {
        w.combo && (e.requestUri = pe[e.uri] || e.uri)
    });
    var ye = /^(\S+:\/{2,3}[^\/]+\/)/, Ee = /\.css(?:\?.*)?$/;
    if (w.test) {
        var xe = LBF.test || (LBF.test = {});
        xe.uris2paths = x, xe.paths2hash = paths2hash
    }
    LBF.config({
        alias: {globalSettings: W + "globalSettings"},
        vars: {theme: W + "ui/themes/default"},
        paths: {
            app: W + "app",
            lang: W + "lang",
            monitor: W + "monitor",
            lib: W + "lib",
            ui: W + "ui",
            util: W + "util",
            format: W + "format"
        }
    }), LBF.config({})
}(this);