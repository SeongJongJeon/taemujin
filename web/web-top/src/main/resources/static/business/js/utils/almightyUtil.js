/*! jquery-dateFormat 18-05-2015 */
var DateFormat={};!function(a){var b=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],c=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],d=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],e=["January","February","March","April","May","June","July","August","September","October","November","December"],f={Jan:"01",Feb:"02",Mar:"03",Apr:"04",May:"05",Jun:"06",Jul:"07",Aug:"08",Sep:"09",Oct:"10",Nov:"11",Dec:"12"},g=/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.?\d{0,3}[Z\-+]?(\d{2}:?\d{2})?/;a.format=function(){function a(a){return b[parseInt(a,10)]||a}function h(a){return c[parseInt(a,10)]||a}function i(a){var b=parseInt(a,10)-1;return d[b]||a}function j(a){var b=parseInt(a,10)-1;return e[b]||a}function k(a){return f[a]||a}function l(a){var b,c,d,e,f,g=a,h="";return-1!==g.indexOf(".")&&(e=g.split("."),g=e[0],h=e[e.length-1]),f=g.split(":"),3===f.length?(b=f[0],c=f[1],d=f[2].replace(/\s.+/,"").replace(/[a-z]/gi,""),g=g.replace(/\s.+/,"").replace(/[a-z]/gi,""),{time:g,hour:b,minute:c,second:d,millis:h}):{time:"",hour:"",minute:"",second:"",millis:""}}function m(a,b){for(var c=b-String(a).length,d=0;c>d;d++)a="0"+a;return a}return{parseDate:function(a){var b,c,d={date:null,year:null,month:null,dayOfMonth:null,dayOfWeek:null,time:null};if("number"==typeof a)return this.parseDate(new Date(a));if("function"==typeof a.getFullYear)d.year=String(a.getFullYear()),d.month=String(a.getMonth()+1),d.dayOfMonth=String(a.getDate()),d.time=l(a.toTimeString()+"."+a.getMilliseconds());else if(-1!=a.search(g))b=a.split(/[T\+-]/),d.year=b[0],d.month=b[1],d.dayOfMonth=b[2],d.time=l(b[3].split(".")[0]);else switch(b=a.split(" "),6===b.length&&isNaN(b[5])&&(b[b.length]="()"),b.length){case 6:d.year=b[5],d.month=k(b[1]),d.dayOfMonth=b[2],d.time=l(b[3]);break;case 2:c=b[0].split("-"),d.year=c[0],d.month=c[1],d.dayOfMonth=c[2],d.time=l(b[1]);break;case 7:case 9:case 10:d.year=b[3],d.month=k(b[1]),d.dayOfMonth=b[2],d.time=l(b[4]);break;case 1:c=b[0].split(""),d.year=c[0]+c[1]+c[2]+c[3],d.month=c[5]+c[6],d.dayOfMonth=c[8]+c[9],d.time=l(c[13]+c[14]+c[15]+c[16]+c[17]+c[18]+c[19]+c[20]);break;default:return null}return d.date=d.time?new Date(d.year,d.month-1,d.dayOfMonth,d.time.hour,d.time.minute,d.time.second,d.time.millis):new Date(d.year,d.month-1,d.dayOfMonth),d.dayOfWeek=String(d.date.getDay()),d},date:function(b,c){try{var d=this.parseDate(b);if(null===d)return b;for(var e,f=d.year,g=d.month,k=d.dayOfMonth,l=d.dayOfWeek,n=d.time,o="",p="",q="",r=!1,s=0;s<c.length;s++){var t=c.charAt(s),u=c.charAt(s+1);if(r)"'"==t?(p+=""===o?"'":o,o="",r=!1):o+=t;else switch(o+=t,q="",o){case"ddd":p+=a(l),o="";break;case"dd":if("d"===u)break;p+=m(k,2),o="";break;case"d":if("d"===u)break;p+=parseInt(k,10),o="";break;case"D":k=1==k||21==k||31==k?parseInt(k,10)+"st":2==k||22==k?parseInt(k,10)+"nd":3==k||23==k?parseInt(k,10)+"rd":parseInt(k,10)+"th",p+=k,o="";break;case"MMMM":p+=j(g),o="";break;case"MMM":if("M"===u)break;p+=i(g),o="";break;case"MM":if("M"===u)break;p+=m(g,2),o="";break;case"M":if("M"===u)break;p+=parseInt(g,10),o="";break;case"y":case"yyy":if("y"===u)break;p+=o,o="";break;case"yy":if("y"===u)break;p+=String(f).slice(-2),o="";break;case"yyyy":p+=f,o="";break;case"HH":p+=m(n.hour,2),o="";break;case"H":if("H"===u)break;p+=parseInt(n.hour,10),o="";break;case"hh":e=0===parseInt(n.hour,10)?12:n.hour<13?n.hour:n.hour-12,p+=m(e,2),o="";break;case"h":if("h"===u)break;e=0===parseInt(n.hour,10)?12:n.hour<13?n.hour:n.hour-12,p+=parseInt(e,10),o="";break;case"mm":p+=m(n.minute,2),o="";break;case"m":if("m"===u)break;p+=n.minute,o="";break;case"ss":p+=m(n.second.substring(0,2),2),o="";break;case"s":if("s"===u)break;p+=n.second,o="";break;case"S":case"SS":if("S"===u)break;p+=o,o="";break;case"SSS":var v="000"+n.millis.substring(0,3);p+=v.substring(v.length-3),o="";break;case"a":p+=n.hour>=12?"PM":"AM",o="";break;case"p":p+=n.hour>=12?"p.m.":"a.m.",o="";break;case"E":p+=h(l),o="";break;case"'":o="",r=!0;break;default:p+=t,o=""}}return p+=q}catch(w){return console&&console.log&&console.log(w),b}},prettyDate:function(a){var b,c,d;return("string"==typeof a||"number"==typeof a)&&(b=new Date(a)),"object"==typeof a&&(b=new Date(a.toString())),c=((new Date).getTime()-b.getTime())/1e3,d=Math.floor(c/86400),isNaN(d)||0>d?void 0:60>c?"just now":120>c?"1 minute ago":3600>c?Math.floor(c/60)+" minutes ago":7200>c?"1 hour ago":86400>c?Math.floor(c/3600)+" hours ago":1===d?"Yesterday":7>d?d+" days ago":31>d?Math.ceil(d/7)+" weeks ago":d>=31?"more than 5 weeks ago":void 0},toBrowserTimeZone:function(a,b){return this.date(new Date(a),b||"MM/dd/yyyy HH:mm:ss")}}}()}(DateFormat),function(a){a.format=DateFormat.format}(jQuery);

/*
CryptoJS v3.0.2
code.google.com/p/crypto-js
(c) 2009-2012 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS = CryptoJS || function (p, h) {
    var i = {}, l = i.lib = {}, r = l.Base = function () {
        function a() {
        }

        return {
            extend: function (e) {
                a.prototype = this;
                var c = new a;
                e && c.mixIn(e);
                c.$super = this;
                return c
            }, create: function () {
                var a = this.extend();
                a.init.apply(a, arguments);
                return a
            }, init: function () {
            }, mixIn: function (a) {
                for (var c in a) a.hasOwnProperty(c) && (this[c] = a[c]);
                a.hasOwnProperty("toString") && (this.toString = a.toString)
            }, clone: function () {
                return this.$super.extend(this)
            }
        }
    }(), o = l.WordArray = r.extend({
        init: function (a, e) {
            a =
                this.words = a || [];
            this.sigBytes = e != h ? e : 4 * a.length
        }, toString: function (a) {
            return (a || s).stringify(this)
        }, concat: function (a) {
            var e = this.words, c = a.words, b = this.sigBytes, a = a.sigBytes;
            this.clamp();
            if (b % 4) for (var d = 0; d < a; d++) e[b + d >>> 2] |= (c[d >>> 2] >>> 24 - 8 * (d % 4) & 255) << 24 - 8 * ((b + d) % 4); else if (65535 < c.length) for (d = 0; d < a; d += 4) e[b + d >>> 2] = c[d >>> 2]; else e.push.apply(e, c);
            this.sigBytes += a;
            return this
        }, clamp: function () {
            var a = this.words, e = this.sigBytes;
            a[e >>> 2] &= 4294967295 << 32 - 8 * (e % 4);
            a.length = p.ceil(e / 4)
        }, clone: function () {
            var a =
                r.clone.call(this);
            a.words = this.words.slice(0);
            return a
        }, random: function (a) {
            for (var e = [], c = 0; c < a; c += 4) e.push(4294967296 * p.random() | 0);
            return o.create(e, a)
        }
    }), m = i.enc = {}, s = m.Hex = {
        stringify: function (a) {
            for (var e = a.words, a = a.sigBytes, c = [], b = 0; b < a; b++) {
                var d = e[b >>> 2] >>> 24 - 8 * (b % 4) & 255;
                c.push((d >>> 4).toString(16));
                c.push((d & 15).toString(16))
            }
            return c.join("")
        }, parse: function (a) {
            for (var e = a.length, c = [], b = 0; b < e; b += 2) c[b >>> 3] |= parseInt(a.substr(b, 2), 16) << 24 - 4 * (b % 8);
            return o.create(c, e / 2)
        }
    }, n = m.Latin1 = {
        stringify: function (a) {
            for (var e =
                a.words, a = a.sigBytes, c = [], b = 0; b < a; b++) c.push(String.fromCharCode(e[b >>> 2] >>> 24 - 8 * (b % 4) & 255));
            return c.join("")
        }, parse: function (a) {
            for (var e = a.length, c = [], b = 0; b < e; b++) c[b >>> 2] |= (a.charCodeAt(b) & 255) << 24 - 8 * (b % 4);
            return o.create(c, e)
        }
    }, k = m.Utf8 = {
        stringify: function (a) {
            try {
                return decodeURIComponent(escape(n.stringify(a)))
            } catch (e) {
                throw Error("Malformed UTF-8 data");
            }
        }, parse: function (a) {
            return n.parse(unescape(encodeURIComponent(a)))
        }
    }, f = l.BufferedBlockAlgorithm = r.extend({
        reset: function () {
            this._data = o.create();
            this._nDataBytes = 0
        }, _append: function (a) {
            "string" == typeof a && (a = k.parse(a));
            this._data.concat(a);
            this._nDataBytes += a.sigBytes
        }, _process: function (a) {
            var e = this._data, c = e.words, b = e.sigBytes, d = this.blockSize, q = b / (4 * d),
                q = a ? p.ceil(q) : p.max((q | 0) - this._minBufferSize, 0), a = q * d, b = p.min(4 * a, b);
            if (a) {
                for (var j = 0; j < a; j += d) this._doProcessBlock(c, j);
                j = c.splice(0, a);
                e.sigBytes -= b
            }
            return o.create(j, b)
        }, clone: function () {
            var a = r.clone.call(this);
            a._data = this._data.clone();
            return a
        }, _minBufferSize: 0
    });
    l.Hasher = f.extend({
        init: function () {
            this.reset()
        },
        reset: function () {
            f.reset.call(this);
            this._doReset()
        }, update: function (a) {
            this._append(a);
            this._process();
            return this
        }, finalize: function (a) {
            a && this._append(a);
            this._doFinalize();
            return this._hash
        }, clone: function () {
            var a = f.clone.call(this);
            a._hash = this._hash.clone();
            return a
        }, blockSize: 16, _createHelper: function (a) {
            return function (e, c) {
                return a.create(c).finalize(e)
            }
        }, _createHmacHelper: function (a) {
            return function (e, c) {
                return g.HMAC.create(a, c).finalize(e)
            }
        }
    });
    var g = i.algo = {};
    return i
}(Math);
(function () {
    var p = CryptoJS, h = p.lib.WordArray;
    p.enc.Base64 = {
        stringify: function (i) {
            var l = i.words, h = i.sigBytes, o = this._map;
            i.clamp();
            for (var i = [], m = 0; m < h; m += 3) for (var s = (l[m >>> 2] >>> 24 - 8 * (m % 4) & 255) << 16 | (l[m + 1 >>> 2] >>> 24 - 8 * ((m + 1) % 4) & 255) << 8 | l[m + 2 >>> 2] >>> 24 - 8 * ((m + 2) % 4) & 255, n = 0; 4 > n && m + 0.75 * n < h; n++) i.push(o.charAt(s >>> 6 * (3 - n) & 63));
            if (l = o.charAt(64)) for (; i.length % 4;) i.push(l);
            return i.join("")
        }, parse: function (i) {
            var i = i.replace(/\s/g, ""), l = i.length, r = this._map, o = r.charAt(64);
            o && (o = i.indexOf(o), -1 != o && (l = o));
            for (var o = [], m = 0, s = 0; s < l; s++) if (s % 4) {
                var n = r.indexOf(i.charAt(s - 1)) << 2 * (s % 4), k = r.indexOf(i.charAt(s)) >>> 6 - 2 * (s % 4);
                o[m >>> 2] |= (n | k) << 24 - 8 * (m % 4);
                m++
            }
            return h.create(o, m)
        }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
    }
})();
(function (p) {
    function h(f, g, a, e, c, b, d) {
        f = f + (g & a | ~g & e) + c + d;
        return (f << b | f >>> 32 - b) + g
    }

    function i(f, g, a, e, c, b, d) {
        f = f + (g & e | a & ~e) + c + d;
        return (f << b | f >>> 32 - b) + g
    }

    function l(f, g, a, e, c, b, d) {
        f = f + (g ^ a ^ e) + c + d;
        return (f << b | f >>> 32 - b) + g
    }

    function r(f, g, a, e, c, b, d) {
        f = f + (a ^ (g | ~e)) + c + d;
        return (f << b | f >>> 32 - b) + g
    }

    var o = CryptoJS, m = o.lib, s = m.WordArray, m = m.Hasher, n = o.algo, k = [];
    (function () {
        for (var f = 0; 64 > f; f++) k[f] = 4294967296 * p.abs(p.sin(f + 1)) | 0
    })();
    n = n.MD5 = m.extend({
        _doReset: function () {
            this._hash = s.create([1732584193, 4023233417,
                2562383102, 271733878])
        }, _doProcessBlock: function (f, g) {
            for (var a = 0; 16 > a; a++) {
                var e = g + a, c = f[e];
                f[e] = (c << 8 | c >>> 24) & 16711935 | (c << 24 | c >>> 8) & 4278255360
            }
            for (var e = this._hash.words, c = e[0], b = e[1], d = e[2], q = e[3], a = 0; 64 > a; a += 4) 16 > a ? (c = h(c, b, d, q, f[g + a], 7, k[a]), q = h(q, c, b, d, f[g + a + 1], 12, k[a + 1]), d = h(d, q, c, b, f[g + a + 2], 17, k[a + 2]), b = h(b, d, q, c, f[g + a + 3], 22, k[a + 3])) : 32 > a ? (c = i(c, b, d, q, f[g + (a + 1) % 16], 5, k[a]), q = i(q, c, b, d, f[g + (a + 6) % 16], 9, k[a + 1]), d = i(d, q, c, b, f[g + (a + 11) % 16], 14, k[a + 2]), b = i(b, d, q, c, f[g + a % 16], 20, k[a + 3])) : 48 > a ? (c =
                l(c, b, d, q, f[g + (3 * a + 5) % 16], 4, k[a]), q = l(q, c, b, d, f[g + (3 * a + 8) % 16], 11, k[a + 1]), d = l(d, q, c, b, f[g + (3 * a + 11) % 16], 16, k[a + 2]), b = l(b, d, q, c, f[g + (3 * a + 14) % 16], 23, k[a + 3])) : (c = r(c, b, d, q, f[g + 3 * a % 16], 6, k[a]), q = r(q, c, b, d, f[g + (3 * a + 7) % 16], 10, k[a + 1]), d = r(d, q, c, b, f[g + (3 * a + 14) % 16], 15, k[a + 2]), b = r(b, d, q, c, f[g + (3 * a + 5) % 16], 21, k[a + 3]));
            e[0] = e[0] + c | 0;
            e[1] = e[1] + b | 0;
            e[2] = e[2] + d | 0;
            e[3] = e[3] + q | 0
        }, _doFinalize: function () {
            var f = this._data, g = f.words, a = 8 * this._nDataBytes, e = 8 * f.sigBytes;
            g[e >>> 5] |= 128 << 24 - e % 32;
            g[(e + 64 >>> 9 << 4) + 14] = (a << 8 | a >>>
                24) & 16711935 | (a << 24 | a >>> 8) & 4278255360;
            f.sigBytes = 4 * (g.length + 1);
            this._process();
            f = this._hash.words;
            for (g = 0; 4 > g; g++) a = f[g], f[g] = (a << 8 | a >>> 24) & 16711935 | (a << 24 | a >>> 8) & 4278255360
        }
    });
    o.MD5 = m._createHelper(n);
    o.HmacMD5 = m._createHmacHelper(n)
})(Math);
(function () {
    var p = CryptoJS, h = p.lib, i = h.Base, l = h.WordArray, h = p.algo, r = h.EvpKDF = i.extend({
        cfg: i.extend({keySize: 4, hasher: h.MD5, iterations: 1}), init: function (i) {
            this.cfg = this.cfg.extend(i)
        }, compute: function (i, m) {
            for (var h = this.cfg, n = h.hasher.create(), k = l.create(), f = k.words, g = h.keySize, h = h.iterations; f.length < g;) {
                a && n.update(a);
                var a = n.update(i).finalize(m);
                n.reset();
                for (var e = 1; e < h; e++) a = n.finalize(a), n.reset();
                k.concat(a)
            }
            k.sigBytes = 4 * g;
            return k
        }
    });
    p.EvpKDF = function (i, l, h) {
        return r.create(h).compute(i,
            l)
    }
})();
CryptoJS.lib.Cipher || function (p) {
    var h = CryptoJS, i = h.lib, l = i.Base, r = i.WordArray, o = i.BufferedBlockAlgorithm, m = h.enc.Base64,
        s = h.algo.EvpKDF, n = i.Cipher = o.extend({
            cfg: l.extend(), createEncryptor: function (b, d) {
                return this.create(this._ENC_XFORM_MODE, b, d)
            }, createDecryptor: function (b, d) {
                return this.create(this._DEC_XFORM_MODE, b, d)
            }, init: function (b, d, a) {
                this.cfg = this.cfg.extend(a);
                this._xformMode = b;
                this._key = d;
                this.reset()
            }, reset: function () {
                o.reset.call(this);
                this._doReset()
            }, process: function (b) {
                this._append(b);
                return this._process()
            },
            finalize: function (b) {
                b && this._append(b);
                return this._doFinalize()
            }, keySize: 4, ivSize: 4, _ENC_XFORM_MODE: 1, _DEC_XFORM_MODE: 2, _createHelper: function () {
                return function (b) {
                    return {
                        encrypt: function (a, q, j) {
                            return ("string" == typeof q ? c : e).encrypt(b, a, q, j)
                        }, decrypt: function (a, q, j) {
                            return ("string" == typeof q ? c : e).decrypt(b, a, q, j)
                        }
                    }
                }
            }()
        });
    i.StreamCipher = n.extend({
        _doFinalize: function () {
            return this._process(!0)
        }, blockSize: 1
    });
    var k = h.mode = {}, f = i.BlockCipherMode = l.extend({
        createEncryptor: function (b, a) {
            return this.Encryptor.create(b,
                a)
        }, createDecryptor: function (b, a) {
            return this.Decryptor.create(b, a)
        }, init: function (b, a) {
            this._cipher = b;
            this._iv = a
        }
    }), k = k.CBC = function () {
        function b(b, a, d) {
            var c = this._iv;
            c ? this._iv = p : c = this._prevBlock;
            for (var e = 0; e < d; e++) b[a + e] ^= c[e]
        }

        var a = f.extend();
        a.Encryptor = a.extend({
            processBlock: function (a, d) {
                var c = this._cipher, e = c.blockSize;
                b.call(this, a, d, e);
                c.encryptBlock(a, d);
                this._prevBlock = a.slice(d, d + e)
            }
        });
        a.Decryptor = a.extend({
            processBlock: function (a, d) {
                var c = this._cipher, e = c.blockSize, f = a.slice(d, d +
                    e);
                c.decryptBlock(a, d);
                b.call(this, a, d, e);
                this._prevBlock = f
            }
        });
        return a
    }(), g = (h.pad = {}).Pkcs7 = {
        pad: function (b, a) {
            for (var c = 4 * a, c = c - b.sigBytes % c, e = c << 24 | c << 16 | c << 8 | c, f = [], g = 0; g < c; g += 4) f.push(e);
            c = r.create(f, c);
            b.concat(c)
        }, unpad: function (b) {
            b.sigBytes -= b.words[b.sigBytes - 1 >>> 2] & 255
        }
    };
    i.BlockCipher = n.extend({
        cfg: n.cfg.extend({mode: k, padding: g}), reset: function () {
            n.reset.call(this);
            var b = this.cfg, a = b.iv, b = b.mode;
            if (this._xformMode == this._ENC_XFORM_MODE) var c = b.createEncryptor; else c = b.createDecryptor,
                this._minBufferSize = 1;
            this._mode = c.call(b, this, a && a.words)
        }, _doProcessBlock: function (b, a) {
            this._mode.processBlock(b, a)
        }, _doFinalize: function () {
            var b = this.cfg.padding;
            if (this._xformMode == this._ENC_XFORM_MODE) {
                b.pad(this._data, this.blockSize);
                var a = this._process(!0)
            } else a = this._process(!0), b.unpad(a);
            return a
        }, blockSize: 4
    });
    var a = i.CipherParams = l.extend({
        init: function (a) {
            this.mixIn(a)
        }, toString: function (a) {
            return (a || this.formatter).stringify(this)
        }
    }), k = (h.format = {}).OpenSSL = {
        stringify: function (a) {
            var d =
                    a.ciphertext, a = a.salt,
                d = (a ? r.create([1398893684, 1701076831]).concat(a).concat(d) : d).toString(m);
            return d = d.replace(/(.{64})/g, "$1\n")
        }, parse: function (b) {
            var b = m.parse(b), d = b.words;
            if (1398893684 == d[0] && 1701076831 == d[1]) {
                var c = r.create(d.slice(2, 4));
                d.splice(0, 4);
                b.sigBytes -= 16
            }
            return a.create({ciphertext: b, salt: c})
        }
    }, e = i.SerializableCipher = l.extend({
        cfg: l.extend({format: k}), encrypt: function (b, d, c, e) {
            var e = this.cfg.extend(e), f = b.createEncryptor(c, e), d = f.finalize(d), f = f.cfg;
            return a.create({
                ciphertext: d,
                key: c,
                iv: f.iv,
                algorithm: b,
                mode: f.mode,
                padding: f.padding,
                blockSize: b.blockSize,
                formatter: e.format
            })
        }, decrypt: function (a, c, e, f) {
            f = this.cfg.extend(f);
            c = this._parse(c, f.format);
            return a.createDecryptor(e, f).finalize(c.ciphertext)
        }, _parse: function (a, c) {
            return "string" == typeof a ? c.parse(a) : a
        }
    }), h = (h.kdf = {}).OpenSSL = {
        compute: function (b, c, e, f) {
            f || (f = r.random(8));
            b = s.create({keySize: c + e}).compute(b, f);
            e = r.create(b.words.slice(c), 4 * e);
            b.sigBytes = 4 * c;
            return a.create({key: b, iv: e, salt: f})
        }
    }, c = i.PasswordBasedCipher =
        e.extend({
            cfg: e.cfg.extend({kdf: h}), encrypt: function (a, c, f, j) {
                j = this.cfg.extend(j);
                f = j.kdf.compute(f, a.keySize, a.ivSize);
                j.iv = f.iv;
                a = e.encrypt.call(this, a, c, f.key, j);
                a.mixIn(f);
                return a
            }, decrypt: function (a, c, f, j) {
                j = this.cfg.extend(j);
                c = this._parse(c, j.format);
                f = j.kdf.compute(f, a.keySize, a.ivSize, c.salt);
                j.iv = f.iv;
                return e.decrypt.call(this, a, c, f.key, j)
            }
        })
}();
(function () {
    var p = CryptoJS, h = p.lib.BlockCipher, i = p.algo, l = [], r = [], o = [], m = [], s = [], n = [], k = [], f = [],
        g = [], a = [];
    (function () {
        for (var c = [], b = 0; 256 > b; b++) c[b] = 128 > b ? b << 1 : b << 1 ^ 283;
        for (var d = 0, e = 0, b = 0; 256 > b; b++) {
            var j = e ^ e << 1 ^ e << 2 ^ e << 3 ^ e << 4, j = j >>> 8 ^ j & 255 ^ 99;
            l[d] = j;
            r[j] = d;
            var i = c[d], h = c[i], p = c[h], t = 257 * c[j] ^ 16843008 * j;
            o[d] = t << 24 | t >>> 8;
            m[d] = t << 16 | t >>> 16;
            s[d] = t << 8 | t >>> 24;
            n[d] = t;
            t = 16843009 * p ^ 65537 * h ^ 257 * i ^ 16843008 * d;
            k[j] = t << 24 | t >>> 8;
            f[j] = t << 16 | t >>> 16;
            g[j] = t << 8 | t >>> 24;
            a[j] = t;
            d ? (d = i ^ c[c[c[p ^ i]]], e ^= c[c[e]]) : d = e = 1
        }
    })();
    var e = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54], i = i.AES = h.extend({
        _doReset: function () {
            for (var c = this._key, b = c.words, d = c.sigBytes / 4, c = 4 * ((this._nRounds = d + 6) + 1), i = this._keySchedule = [], j = 0; j < c; j++) if (j < d) i[j] = b[j]; else {
                var h = i[j - 1];
                j % d ? 6 < d && 4 == j % d && (h = l[h >>> 24] << 24 | l[h >>> 16 & 255] << 16 | l[h >>> 8 & 255] << 8 | l[h & 255]) : (h = h << 8 | h >>> 24, h = l[h >>> 24] << 24 | l[h >>> 16 & 255] << 16 | l[h >>> 8 & 255] << 8 | l[h & 255], h ^= e[j / d | 0] << 24);
                i[j] = i[j - d] ^ h
            }
            b = this._invKeySchedule = [];
            for (d = 0; d < c; d++) j = c - d, h = d % 4 ? i[j] : i[j - 4], b[d] = 4 > d || 4 >= j ? h : k[l[h >>> 24]] ^ f[l[h >>>
            16 & 255]] ^ g[l[h >>> 8 & 255]] ^ a[l[h & 255]]
        }, encryptBlock: function (a, b) {
            this._doCryptBlock(a, b, this._keySchedule, o, m, s, n, l)
        }, decryptBlock: function (c, b) {
            var d = c[b + 1];
            c[b + 1] = c[b + 3];
            c[b + 3] = d;
            this._doCryptBlock(c, b, this._invKeySchedule, k, f, g, a, r);
            d = c[b + 1];
            c[b + 1] = c[b + 3];
            c[b + 3] = d
        }, _doCryptBlock: function (a, b, d, e, f, h, i, g) {
            for (var l = this._nRounds, k = a[b] ^ d[0], m = a[b + 1] ^ d[1], o = a[b + 2] ^ d[2], n = a[b + 3] ^ d[3], p = 4, r = 1; r < l; r++) var s = e[k >>> 24] ^ f[m >>> 16 & 255] ^ h[o >>> 8 & 255] ^ i[n & 255] ^ d[p++], u = e[m >>> 24] ^ f[o >>> 16 & 255] ^ h[n >>> 8 & 255] ^
                i[k & 255] ^ d[p++], v = e[o >>> 24] ^ f[n >>> 16 & 255] ^ h[k >>> 8 & 255] ^ i[m & 255] ^ d[p++], n = e[n >>> 24] ^ f[k >>> 16 & 255] ^ h[m >>> 8 & 255] ^ i[o & 255] ^ d[p++], k = s, m = u, o = v;
            s = (g[k >>> 24] << 24 | g[m >>> 16 & 255] << 16 | g[o >>> 8 & 255] << 8 | g[n & 255]) ^ d[p++];
            u = (g[m >>> 24] << 24 | g[o >>> 16 & 255] << 16 | g[n >>> 8 & 255] << 8 | g[k & 255]) ^ d[p++];
            v = (g[o >>> 24] << 24 | g[n >>> 16 & 255] << 16 | g[k >>> 8 & 255] << 8 | g[m & 255]) ^ d[p++];
            n = (g[n >>> 24] << 24 | g[k >>> 16 & 255] << 16 | g[m >>> 8 & 255] << 8 | g[o & 255]) ^ d[p++];
            a[b] = s;
            a[b + 1] = u;
            a[b + 2] = v;
            a[b + 3] = n
        }, keySize: 8
    });
    p.AES = h._createHelper(i)
})();

/*
CryptoJS v3.0.2
code.google.com/p/crypto-js
(c) 2009-2012 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS = CryptoJS || function (g, i) {
    var f = {}, b = f.lib = {}, m = b.Base = function () {
        function a() {
        }

        return {
            extend: function (e) {
                a.prototype = this;
                var c = new a;
                e && c.mixIn(e);
                c.$super = this;
                return c
            }, create: function () {
                var a = this.extend();
                a.init.apply(a, arguments);
                return a
            }, init: function () {
            }, mixIn: function (a) {
                for (var c in a) a.hasOwnProperty(c) && (this[c] = a[c]);
                a.hasOwnProperty("toString") && (this.toString = a.toString)
            }, clone: function () {
                return this.$super.extend(this)
            }
        }
    }(), l = b.WordArray = m.extend({
        init: function (a, e) {
            a =
                this.words = a || [];
            this.sigBytes = e != i ? e : 4 * a.length
        }, toString: function (a) {
            return (a || d).stringify(this)
        }, concat: function (a) {
            var e = this.words, c = a.words, o = this.sigBytes, a = a.sigBytes;
            this.clamp();
            if (o % 4) for (var b = 0; b < a; b++) e[o + b >>> 2] |= (c[b >>> 2] >>> 24 - 8 * (b % 4) & 255) << 24 - 8 * ((o + b) % 4); else if (65535 < c.length) for (b = 0; b < a; b += 4) e[o + b >>> 2] = c[b >>> 2]; else e.push.apply(e, c);
            this.sigBytes += a;
            return this
        }, clamp: function () {
            var a = this.words, e = this.sigBytes;
            a[e >>> 2] &= 4294967295 << 32 - 8 * (e % 4);
            a.length = g.ceil(e / 4)
        }, clone: function () {
            var a =
                m.clone.call(this);
            a.words = this.words.slice(0);
            return a
        }, random: function (a) {
            for (var e = [], c = 0; c < a; c += 4) e.push(4294967296 * g.random() | 0);
            return l.create(e, a)
        }
    }), n = f.enc = {}, d = n.Hex = {
        stringify: function (a) {
            for (var e = a.words, a = a.sigBytes, c = [], b = 0; b < a; b++) {
                var d = e[b >>> 2] >>> 24 - 8 * (b % 4) & 255;
                c.push((d >>> 4).toString(16));
                c.push((d & 15).toString(16))
            }
            return c.join("")
        }, parse: function (a) {
            for (var e = a.length, c = [], b = 0; b < e; b += 2) c[b >>> 3] |= parseInt(a.substr(b, 2), 16) << 24 - 4 * (b % 8);
            return l.create(c, e / 2)
        }
    }, j = n.Latin1 = {
        stringify: function (a) {
            for (var e =
                a.words, a = a.sigBytes, b = [], d = 0; d < a; d++) b.push(String.fromCharCode(e[d >>> 2] >>> 24 - 8 * (d % 4) & 255));
            return b.join("")
        }, parse: function (a) {
            for (var b = a.length, c = [], d = 0; d < b; d++) c[d >>> 2] |= (a.charCodeAt(d) & 255) << 24 - 8 * (d % 4);
            return l.create(c, b)
        }
    }, k = n.Utf8 = {
        stringify: function (a) {
            try {
                return decodeURIComponent(escape(j.stringify(a)))
            } catch (b) {
                throw Error("Malformed UTF-8 data");
            }
        }, parse: function (a) {
            return j.parse(unescape(encodeURIComponent(a)))
        }
    }, h = b.BufferedBlockAlgorithm = m.extend({
        reset: function () {
            this._data = l.create();
            this._nDataBytes = 0
        }, _append: function (a) {
            "string" == typeof a && (a = k.parse(a));
            this._data.concat(a);
            this._nDataBytes += a.sigBytes
        }, _process: function (a) {
            var b = this._data, c = b.words, d = b.sigBytes, j = this.blockSize, h = d / (4 * j),
                h = a ? g.ceil(h) : g.max((h | 0) - this._minBufferSize, 0), a = h * j, d = g.min(4 * a, d);
            if (a) {
                for (var f = 0; f < a; f += j) this._doProcessBlock(c, f);
                f = c.splice(0, a);
                b.sigBytes -= d
            }
            return l.create(f, d)
        }, clone: function () {
            var a = m.clone.call(this);
            a._data = this._data.clone();
            return a
        }, _minBufferSize: 0
    });
    b.Hasher = h.extend({
        init: function () {
            this.reset()
        },
        reset: function () {
            h.reset.call(this);
            this._doReset()
        }, update: function (a) {
            this._append(a);
            this._process();
            return this
        }, finalize: function (a) {
            a && this._append(a);
            this._doFinalize();
            return this._hash
        }, clone: function () {
            var a = h.clone.call(this);
            a._hash = this._hash.clone();
            return a
        }, blockSize: 16, _createHelper: function (a) {
            return function (b, c) {
                return a.create(c).finalize(b)
            }
        }, _createHmacHelper: function (a) {
            return function (b, c) {
                return u.HMAC.create(a, c).finalize(b)
            }
        }
    });
    var u = f.algo = {};
    return f
}(Math);
(function () {
    var g = CryptoJS, i = g.lib, f = i.WordArray, i = i.Hasher, b = [], m = g.algo.SHA1 = i.extend({
        _doReset: function () {
            this._hash = f.create([1732584193, 4023233417, 2562383102, 271733878, 3285377520])
        }, _doProcessBlock: function (f, n) {
            for (var d = this._hash.words, j = d[0], k = d[1], h = d[2], g = d[3], a = d[4], e = 0; 80 > e; e++) {
                if (16 > e) b[e] = f[n + e] | 0; else {
                    var c = b[e - 3] ^ b[e - 8] ^ b[e - 14] ^ b[e - 16];
                    b[e] = c << 1 | c >>> 31
                }
                c = (j << 5 | j >>> 27) + a + b[e];
                c = 20 > e ? c + ((k & h | ~k & g) + 1518500249) : 40 > e ? c + ((k ^ h ^ g) + 1859775393) : 60 > e ? c + ((k & h | k & g | h & g) - 1894007588) : c + ((k ^ h ^ g) -
                    899497514);
                a = g;
                g = h;
                h = k << 30 | k >>> 2;
                k = j;
                j = c
            }
            d[0] = d[0] + j | 0;
            d[1] = d[1] + k | 0;
            d[2] = d[2] + h | 0;
            d[3] = d[3] + g | 0;
            d[4] = d[4] + a | 0
        }, _doFinalize: function () {
            var b = this._data, f = b.words, d = 8 * this._nDataBytes, j = 8 * b.sigBytes;
            f[j >>> 5] |= 128 << 24 - j % 32;
            f[(j + 64 >>> 9 << 4) + 15] = d;
            b.sigBytes = 4 * f.length;
            this._process()
        }
    });
    g.SHA1 = i._createHelper(m);
    g.HmacSHA1 = i._createHmacHelper(m)
})();
(function () {
    var g = CryptoJS, i = g.enc.Utf8;
    g.algo.HMAC = g.lib.Base.extend({
        init: function (f, b) {
            f = this._hasher = f.create();
            "string" == typeof b && (b = i.parse(b));
            var g = f.blockSize, l = 4 * g;
            b.sigBytes > l && (b = f.finalize(b));
            for (var n = this._oKey = b.clone(), d = this._iKey = b.clone(), j = n.words, k = d.words, h = 0; h < g; h++) j[h] ^= 1549556828, k[h] ^= 909522486;
            n.sigBytes = d.sigBytes = l;
            this.reset()
        }, reset: function () {
            var f = this._hasher;
            f.reset();
            f.update(this._iKey)
        }, update: function (f) {
            this._hasher.update(f);
            return this
        }, finalize: function (f) {
            var b =
                this._hasher, f = b.finalize(f);
            b.reset();
            return b.finalize(this._oKey.clone().concat(f))
        }
    })
})();
(function () {
    var g = CryptoJS, i = g.lib, f = i.Base, b = i.WordArray, i = g.algo, m = i.HMAC, l = i.PBKDF2 = f.extend({
        cfg: f.extend({keySize: 4, hasher: i.SHA1, iterations: 1}), init: function (b) {
            this.cfg = this.cfg.extend(b)
        }, compute: function (f, d) {
            for (var g = this.cfg, k = m.create(g.hasher, f), h = b.create(), i = b.create([1]), a = h.words, e = i.words, c = g.keySize, g = g.iterations; a.length < c;) {
                var l = k.update(d).finalize(i);
                k.reset();
                for (var q = l.words, t = q.length, r = l, s = 1; s < g; s++) {
                    r = k.finalize(r);
                    k.reset();
                    for (var v = r.words, p = 0; p < t; p++) q[p] ^= v[p]
                }
                h.concat(l);
                e[0]++
            }
            h.sigBytes = 4 * c;
            return h
        }
    });
    g.PBKDF2 = function (b, d, f) {
        return l.create(f).compute(b, d)
    }
})();

var AesUtil = function (keySize, iterationCount) {
    this.keySize = keySize / 32;
    this.iterationCount = iterationCount;
};

AesUtil.prototype.generateKey = function (salt, passPhrase) {
    var key = CryptoJS.PBKDF2(
        passPhrase,
        CryptoJS.enc.Hex.parse(salt),
        {keySize: this.keySize, iterations: this.iterationCount});
    return key;
}

AesUtil.prototype.encrypt = function (salt, iv, passPhrase, plainText) {
    var key = this.generateKey(salt, passPhrase);
    var encrypted = CryptoJS.AES.encrypt(
        plainText,
        key,
        {iv: CryptoJS.enc.Hex.parse(iv)});
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}

AesUtil.prototype.decrypt = function (salt, iv, passPhrase, cipherText) {
    var key = this.generateKey(salt, passPhrase);
    var cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(cipherText)
    });
    var decrypted = CryptoJS.AES.decrypt(
        cipherParams,
        key,
        {iv: CryptoJS.enc.Hex.parse(iv)});
    return decrypted.toString(CryptoJS.enc.Utf8);
}

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}
if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function () {
        var args = arguments;
        var re = new RegExp(args[0], "gi");
        return this.replace(re, args[1]);
    };
}

//부트스트랩 사용시 모달이 열리고 닫히는 것에 따라서 공통으로 작업이 필요한 경우
$(document).on({
    'shown.bs.modal': function (e) {
        if (e.currentTarget.id == 'syrupMobile') {
            $('.modal-backdrop').css('background-color', '#FFFFFF');
            $('.modal-backdrop.in').css('opacity', '1');
        } else {
            $('.modal-backdrop').css('background-color', '#000000');
            $('.modal-backdrop.in').css('opacity', '0.5');
        }
        var currentModalCnt = $('body').data('cnt') > 0 ? $('body').data('cnt') : 0;
        $('body').data('cnt', currentModalCnt + 1);
        $('body').addClass('modal-open');
        //모달 있을땐 채팅버튼 제거
        $('#chattingButton').css('display', 'none');

        // if (MobileUtil.checkMobile()) {
        //     $('body').css('position', 'fixed');
        // }
    },
    'hidden.bs.modal': function (e) {
        var currentModalCnt = $('body').data('cnt') - 1;
        $('body').data('cnt', currentModalCnt);
        if (currentModalCnt <= 0) {
            $('#chattingButton').css('display', 'block');
            $('body').removeClass('modal-open');

            // if (MobileUtil.checkMobile()) {
            //     $('body').css('position', 'static');
            // }
        } else {
            $('body').addClass('modal-open');
        }
    }
}, '.modal');

/**
 * 페이지 로딩시 셋팅하는 값
 */
var loadData = {
    awsCloudFront: '',

    setAwsCloudFront: function (awsCloudFront) {
        this.awsCloudFront = 'https://' + awsCloudFront;
    }
}

var CommonLang={user:{checkEmptyEmail:"이메일을 입력해 주세요.",invalidEmail:"유효하지 않은 이메일 주소입니다.",usedEmail:"이미 사용중인 이메일 주소입니다.",checkEmailDuplication:"이메일 중복체크를 해주세요.",minPwdLength:"비밀번호는 8자 이상 입력해주세요.",emptyPwd:"비밀번호를 입력해주세요.",notMatchPwd:"비밀번호가 일치하지 않습니다.",invalidSiteUrl:"유효한 URL을 입력해주세요.\n예) http://buzzmarket.co.kr",successRegister:"회원가입이 완료되었습니다.",successModify:"정보가 수정되었습니다.",notRegisterEmail:"등록되지 않은 이메일이거나, 이메일 또는 비밀번호를 잘못 입력하셨습니다.",authOvertime:"24시간 이내에 계정을 활성화 하지 않아 삭제되었습니다.",diffUserAndBank:"본인인증한 이름과 예금주 이름이 다릅니다.",diffAccount:"본인인증 이름과 계좌주 이름이 다릅니다.",notYetAuth:"아직 인증되지 않은 계정입니다.",restrictAdmin:"관리자에 의해 정지된 계정입니다.",sendInitPwd:"입력하신 {}으로\n비밀번호 재설정 가이드를 발송했습니다.\n이메일을 확인해주세요.",resetPwd:"비밀번호가 재설정 되었습니다.\n다시 로그인해주세요.",cellPhoneValidation:"휴대폰번호는 숫자로만 되어야 합니다.",confirmWithdraw:"정말 탈퇴하시겠습니까?",successWithdraw:"회원 탈퇴가 정상적으로 처리되었습니다.",notAvailableWithdraw:"진행중인 거래가 있습니다.\n해당거래를 완료하시거나 중단후 다시 시도해 주세요. ",notExistsSns:"연동한 SNS가 존재하지 않습니다.",copyInviteUrl:"초대 링크가 복사되었습니다.",initCloseBntOfSnsPopup:"채널을 최소 1개 이상 등록하셔야 포인트가 제공됩니다.",haveNotSnsInvitedUrlMsg:"아래에서 최소 1개 이상의 채널을 등록해야 친구초대를 할 수 있습니다.",haveSnsInvitedUrlMsg:"초대받은 친구가 회원가입 및 채널 등록 완료 후 3일이 경과되면 포인트가 지급됩니다.",paidPointOfInvitedInfluencer:"1,000포인트가 지급되었습니다.",thirdpartyPast:"혜택이 종료된 파트너 링크입니다. 더이상 해당 링크로 가입하실 수 없습니다.",overLimitInvitation:"해당 초대 링크는 초대 제한수를 초과하였습니다.",notExistsRoom:"채팅방이 존재하지 않습니다.",suException:"인증코드 또는 사용자가 존재하지 않습니다.",successBrandFreePoint:"신청이 완료되었습니다.",alreadyRegistrationNumber:"이미 등록된 번호입니다. 새로운 번호를 입력해주세요.",overMaxAuthTryCnt:"인증요청 가능 횟수가 초과되었습니다. 잠시 후 다시 시도해주세요.",joinAuth:"인증번호를 입력해 주세요.",joinNotAuth:"인증요청을 해주세요.",joinNotMatchAuth:"인증번호가 틀렸습니다. 확인 후 다시 입력해주세요.",joinReqAuth:"휴대폰을 인증해주세요.",joinExceedAuth:"인증번호가 만료되었습니다. 다시 요청해주세요.",completeAuth:"휴대폰 인증이 완료되었습니다."},advertiserLogin:{advertiserLoginEmail:"이메일을 입력해주세요.",advertiserLoginPassword:"비밀번호를 입력해주세요."},advertiserRegistration:{advertiserLoginEmail:"이메일을 입력해주세요.",advertiserJoinBrandName:"브랜드명을 입력해 주세요.",advertiserJoinName:"담당자 이름을 입력해 주세요.",advertiserJoinEmail:"이메일을 입력해 주세요.",advertiserJoinEmailInvalid:"유효하지 않은 이메일 주소입니다.",advertiserJoinEmailNotCheck:"중복확인을 해주세요.",advertiserJoinEmailAvail:"사용할 수 있는 이메일입니다.",advertiserJoinEmailUsed:"사용중인 이메일 입니다.",advertiserJoinPwd:"8자리 이상의 비밀번호를 입력해주세요.",advertiserJoinRePwd:"일치하지 않는 비밀번호입니다.",advertiserJoinCellPhone:"휴대폰 번호를 입력해 주세요.",advertiserJoinCellPhoneInvalid:"올바른 휴대폰번호 양식이 아닙니다.",isAgreementOfUtil:"이용약관에 동의해주세요.",isAgreePersonalInfo:"개인정보활용에 동의해주세요."},influencerRegistration:{influencerEmail:"이메일을 입력해주세요",influencerPassword:"8자리 이상의 비밀번호를 입력해주세요.",influencerPasswordConfirm:"일치하지 않는 비밀번호입니다.",influencerIsAgreementOfUtil:"이용약관에 동의해주세요.",influencerIsAgreementOfPersonalInfoUse:"개인정보활용에 동의해주세요."},advertiserModify:{success:"수정이 완료되었습니다."},campaignRegistration:{campaignFromModalTitle:"캠페인명을 입력해 주세요.",campaignFromModalDesc:"캠페인 설명을 입력해 주세요.",campaignFromModalSnsList:"SNS를 선택해 주세요.",campaignFromModalPrice:"가격 범위를 선택해 주세요.",campaignFromModalCategory:"카테고리를 선택해 주세요.",campaignFromModalReqDesc:"제작 요청사항을 입력해 주세요.",campaignFromModalEndDate:"캠페인 종료일을 선택해주세요.",successRegister:"캠페인이 등록되었습니다.",successTempRegister:"캠페인이 임시저장되었습니다.",successLicenseRegister:"등록하신 사업자등록증 확인 후 게재됩니다.\n확인에는 업무일 기준으로 최대 24시간이 소요됩니다. ",successModify:"캠페인이 수정되었습니다.",lessThanEndDate:"캠페인 종료일은 오늘보다 커야 합니다."},proposalRegistration:{snsList:"SNS를 선택해 주세요.",price:"제안 금액을 입력해주세요.",priceMin:"1,000원 단위로 입력해주세요.",proposalDesc:"제안내용을 입력해주세요.",successRegister:"제안서가 제출되었습니다.",successModify:"제안서 수정이 완료되었습니다."},draftRegistration:{comment:"코멘트를 작성해주세요.",successRegister:"시안이 제출되었습니다."},draft:{approval:"확정되었습니다.",approvalConfirmTitle:"시안 확정",approvalConfirmMsg:"확정된 시안으로 광고가 진행됩니다. 확정하시겠습니까?",reject:"수정 요청사항이 전달되었습니다.",rejectConfirmTitle:"수정 사항 전달",rejectConfirmMsg:"전달하시겠습니까?"},advertiseUrl:{emptyUrl:"URL을 등록해주세요.",invalidUrl:"유효한 URL을 입력해주세요.\n예) http://buzzmarket.co.kr",registerConfirmMsg:"광고 URL을 등록하시겠어요?\n등록된 URL은 변경이 불가능하오니 한번 더 확인하고 등록해주세요.",register:"광고 등록이 완료되어 포인트가 지급되었습니다.<br/>(수수료 10% 제외)<p class=\"toast-notice\"><span>광고 컨텐츠는 최소 7일 이상 '전체공개' 상태로 유지되어야 하며, 이를 위반시 지급된 광고비가 회수됩니다.</span></p>",notExistsAccountInfo:"계좌번호를 먼저 등록해주세요.\n계좌등록 페이지로 이동하시겠습니까?",notExistsAccountInfoByException:"계좌번호를 먼저 등록해주세요.\n지급이력 메뉴에서 등록할 수 있습니다.",rejectRegister:"확인 불가한 URL 입니다."},campaign:{inviteCampaign:"초대 메시지가 발송되었습니다.",confirmProposal:"확인을 누르시면 {} 포인트가\n결제됩니다.",pointLack:"포인트가 부족합니다.",sendProposal:"제안서를 제출하시겠습니까?",completePick:"찜목록 탭으로 이동합니다.\n찜목록 탭에서 내역을 확인하세요",completeUnPick:"신규제안 탭으로 이동합니다.",refundConfirmMsg:"정말 환불을 받으시겠습니까?"},charge:{completeImmediately:"즉시 결제가 완료 되었습니다.\n해당 제안서는 진행중으로 이동합니다.",completePayPoint:"포인트 결제가 완료 되었습니다.\n해당 제안서는 진행중 탭으로 이동합니다.",completePoint:"포인트 충전이 완료되었습니다.",failPayment:"결제가 정상적으로 완료되지 않았습니다.",refundPending:"이미 환급요청중 입니다.",unableRefund:"최소 출금신청 금액은 50,000원 이상입니다.",notFoundCard:"등록된 카드가 존재하지 않습니다.",hasNotCashPoint:"캠페인 진행을 통해 얻은 수익이 1건이상 포함되어야 출금하실 수 있습니다.\n'전체 캠페인'에서 마음에 드는 캠페인을 선택하여 제안해보세요.",restrictTime:"1분 이내에 같은 금액으로 결제가 불가합니다.",lackBalance:"잔액이 부족하여 결제를 할 수 없습니다.\n다른 결제수단으로 결제해주세요.",notRegistered:"미등록쇼핑몰",cancelPayment:"결제가 취소되었습니다.",purchasePoint:"포인트가 부족합니다.\n포인트 구매화면으로 이동하시겠습니까?",purchasePointConfirm:"{0} 포인트를 구매하시겠습니까?",confirmRefundMsg:"{0}원을 출금 요청하시겠습니까?",completeRefundReq:"출금 요청이 완료되었습니다. 영업일 기준 3일 이내에 등록하신 계좌로 입금됩니다.",depositError:"입금이체 실패"},evaluate:{success:"평가가 등록되었습니다.\n소중한 의견 감사합니다."},common:{activateAdvertiser:"회원 가입이 완료되었습니다.",activateInfluencer:"회원 가입이 완료되었습니다.",moveAfterPurchase:"제안 승인 화면으로 이동합니다.",moveAfterInfluencerModify:"캠페인 화면으로 이동합니다.",moveAfterBankAccountModify:"URL 등록 화면으로 이동합니다.",modifyCompletion:"수정이 완료되었습니다.",imageExtension:"지원 이미지 확장자는 jpg|jpeg|png|gif 와 같습니다.",mediaExtension:"지원 이미지 확장자는 jpg|jpeg|png|gif|mp4 와 같습니다.",emptyReport:"신고 유형을 선택해주세요.",complainCompletion:"신고가 정상적으로 접수되었습니다.\n확인 후 조속히 처리될 수 있도록\n조치하겠습니다.",logout:"로그아웃 하시겠습니까?",resetPwd:"비밀번호 재설정 이메일을 전송했습니다.",successResetPwd:"비밀번호 재설정이 완료되었습니다.",failResetPwd:"비밀번호 초기화 시간이 24시간이 지났습니다.",notExistsUser:"등록되지 않은 계정입니다.",cancelProposal:"제안서를 철회하시겠습니까?",modifyProposal:"제안서를 수정하시겠습니까?",notProposalStatus:"현재 제안서는 진행중 상태입니다. 진행중 캠페인에서 철회해주세요.",completeCancelProposal:"철회가 완료되었습니다.",favorite:"해당 인플루언서를 즐겨찾기 하시겠습니까?",favoriteSuccess:"등록되었습니다.\n마이페이지>즐겨찾기에서 확인할 수 있습니다.",unFavorite:"즐겨찾기 해제하시겠습니까?",unFavoriteSuccess:"해제되었습니다.",cancelProgress:"이미 URL이 등록된 광고는 환불이 불가합니다.\n사전에 인플루언서와 충분히 협의해주세요.",cancelProgressByIn:"미등록된 URL은 광고료가 지불되지 않습니다.\n사전에 광고주와 충분히 협의해주세요.",cancelProgressComplete:"거래가 중단되었습니다.",notProgressProposal:"진행중인 제안서가 아닙니다.",inviteNotExistsCampaign:"초대할 캠페인이 없습니다.",askCreationCampaign:"초대할 캠페인이 없습니다. 캠페인을 생성하시겠습니까?",successInviteCampaign:"초대가 완료되었습니다.",dDay:"종료일",pluginBlock:"광고차단 플러그인에 버즈마켓을 허용해주세요."},error:{default:"알수없는 에러"},system:{notAccess:"접근할 수 없는 페이지입니다.",innerSystemError:"잠시후 다시 시도해주세요.\n지속적인 문제시 관리자에게 문의 해주세요.",unauthorizedAccessException:"허가되지 않은 접근입니다."},campaignFail:{invalidUrl:"잘못된 URL을 등록하였습니다.",InsufficientPoint:"포인트 잔액이 부족합니다.",cancelProgressProposal:"결제 취소에 오류가 발생하여 캠페인 종료가 실패하였습니다.",notModifyProposal:"이미 결제하여 수정이 불가합니다.\n새로고침을 해주세요.",diffProposalVersion:"인플루언서가 제안을 수정하였습니다.\n새로고침을 해주세요.",invalidProposalStatus:"인플루언서가 제안을 철회하였습니다.\n새로고침을 해주세요.",completeProposal:"철회 또는 완료된 제안입니다.\n새로고침을 해주세요."},influencer:{alreadyUploadedUrl:"이미 등록되어있는 컨텐츠 URL 입니다.",requiredChannel:"제안 채널선택 및 올바른 제안가를 작성해주세요.",registerContentsError:"컨텐츠가 전체공개가 아니거나 존재하지 않습니다.\n확인후 다시등록해주세요.",notMatchOwner:"본인 SNS의 컨텐츠 URL을 등록해주세요.",isAvailableNickname:"사용 가능한 닉네임 입니다.",checkNickname:"닉네임 중복확인을 해주세요",tooShortnickname:"닉네임은 최소 2자이상입니다.",duplicateNickname:"이미 사용중인 닉네임 입니다.",influencerJoinEmailAvailable:"사용 할 수 있는 이메일입니다.",essentialInfo:'광고주가 당신의 제안을 선택할 수 있도록 회원 정보를 입력해주세요.\n("확인"을 누르면 입력 화면으로 이동합니다.)',snsConnect:"SNS 연동을 하시겠습니까?",selectSido:"시,도를 선택해주세요.",selectSiGungu:"군,구 를 선택해주세요.",selectAge:"출생년도를 입력해주세요. ",selectGender:"성별을 선택해 주세요.",alreadyLinkedSns:"다른 계정에 이미 연동되어있는 채널 입니다.",notFoundSns:"sns 정보를 알 수 없습니다.",restrictActivatedSnsListSize:"최소 하나 이상의 채널이 등록되어야 합니다.",linkError:"연동에 실패했습니다.",needToReAuth:"재인증이 필요합니다.",restrictChangeBankAccountInfo:"지급 대기건이 있어 변경 불가능합니다.",checkResidenceRegistrationNumber:" 주민번호를 확인해 주세요.",checkRealName:"올바른 이름을 입력해주세요.",NotUnlinkSns:"진행중인 캠페인이 있어 연결해제 할 수 없습니다.",notYetPastPeriod:"게재 후 7일이 경과하지 않은 광고 컨텐츠가 존재하여 해지할 수 없습니다.\n해당 기간이 경과한 후 다시 시도해주세요.",restrictFollowerCnt:"팔로워 수가 최소 30명 이상이어야 합니다."},influencerBankAccounts:{requireName:"이름을 입력해주세요.",requireIdentityNumberFieldOne:"생년월일을 입력해주세요.",requireIdentityNumberFieldTwo:"주민번호 뒷자리를 입력해 주세요.",requireBankAccountNumber:"계좌번호(10자리 이상)를 입력해주세요.",invalidNameOrIdentityNumber:"실명인증을 할 수 없습니다.",requireBankAccount:"은행을 선택해주세요."},registerContact:{title:"제목을 입력해주세요.",email:"이메일을 입력해주세요.",invalidEmail:"유효하지 않은 이메일 주소입니다.",content:"문의사항을 입력해주세요.",success:"문의사항이 접수되었습니다.\n확인후 빠른 답변 드리겠습니다."}};

var staticData = {
    ErrorCodeMap: {
        defaultMsg: CommonLang.error.default,
        codes: {
            600: {msg: CommonLang.user.notRegisterEmail, isRedirect: false},
            601: {msg: CommonLang.user.notYetAuth, isRedirect: false},
            602: {msg: CommonLang.user.usedEmail, isRedirect: false},
            603: {msg: CommonLang.system.unauthorizedAccessException, isRedirect: false},
            604: {msg: CommonLang.user.restrictAdmin, isRedirect: false},
            605: {msg: CommonLang.influencer.restrictChangeBankAccountInfo, isRedirect: false},
            606: {msg: CommonLang.user.authOvertime, isRedirect: false},
            607: {msg: CommonLang.user.diffUserAndBank, isRedirect: false},
            608: {msg: CommonLang.user.diffAccount, isRedirect: false},
            609: {msg: CommonLang.user.thirdpartyPast, isRedirect: true},
            610: {msg: CommonLang.user.overLimitInvitation, isRedirect: true},
            611: {msg: CommonLang.user.suException, isRedirect: false},
            613: {msg: CommonLang.user.alreadyRegistrationNumber, isRedirect: false},
            701: {msg: CommonLang.system.notAccess, isRedirect: true},
            702: {msg: CommonLang.system.innerSystemError, isRedirect: false},
            781: {msg: CommonLang.charge.failPayment, isRedirect: false},
            782: {msg: CommonLang.charge.restrictTime, isRedirect: false},
            783: {msg: CommonLang.charge.lackBalance, isRedirect: false},
            784: {msg: CommonLang.charge.notRegistered, isRedirect: false},
            785: {msg: CommonLang.charge.failPayment, isRedirect: false, isShowServerMsg: true},
            786: {msg: CommonLang.charge.refundPending, isRedirect: false},
            787: {msg: CommonLang.charge.unableRefund, isRedirect: false},
            788: {msg: CommonLang.charge.notFoundCard, isRedirect: false},
            789: {msg: CommonLang.charge.hasNotCashPoint, isRedirect: false},
            790: {msg: CommonLang.advertiseUrl.notExistsAccountInfoByException, isRedirect: false},
            791: {msg: CommonLang.charge.depositError, isRedirect: false},
            901: {msg: CommonLang.influencer.notFoundSns, isRedirect: false},
            904: {msg: CommonLang.influencer.linkError, isRedirect: false},
            905: {msg: CommonLang.influencer.registerContentsError, isRedirect: false},
            906: {msg: CommonLang.influencer.needToReAuth, isRedirect: false},
            907: {msg: CommonLang.influencer.alreadyLinkedSns, isRedirect: false},
            908: {msg: CommonLang.influencer.restrictActivatedSnsListSize, isRedirect: false},
            909: {msg: CommonLang.influencer.NotUnlinkSns, isRedirect: false},
            910: {msg: CommonLang.influencer.registerContentsError, isRedirect: false},
            911: {msg: CommonLang.influencer.notMatchOwner, isRedirect: false},
            912: {msg: CommonLang.influencer.notYetPastPeriod, isRedirect: false},
            913: {msg: CommonLang.influencer.restrictFollowerCnt, isRedirect: false},
            931: {msg: CommonLang.campaignFail.invalidUrl, isRedirect: false},
            932: {msg: CommonLang.campaignFail.InsufficientPoint, isRedirect: false},
            933: {msg: CommonLang.campaignFail.cancelProgressProposal, isRedirect: false},
            934: {msg: CommonLang.campaignFail.notModifyProposal, isRedirect: false},
            935: {msg: CommonLang.campaignFail.diffProposalVersion, isRedirect: false},
            936: {msg: CommonLang.campaignFail.completeProposal, isRedirect: false},
            937: {msg: CommonLang.campaignFail.invalidProposalStatus, isRedirect: false},
            938: {msg: CommonLang.influencer.alreadyUploadedUrl, isRedirect: false},
            939: {msg: CommonLang.influencer.requiredChannel, isRedirect: false}
        }
    }
}

/**
 * Util을 모아놓은 함수이다.
 */
var commonUtil = (function () {
    var keySize = 128;
    var iterationCount = 1;
    var passPhrase = 'Buzzmarket jump';
    var iv = 'F27D5C9927726BCEFE7510B1BDD3D137';
    var salt = '3FF2EC019C627B945225DEBAD71A01B6985FE84C95A70EB132882F88C0A59A55';
    var aesUtil = new AesUtil(keySize, iterationCount);

    var defaultRestrictImgSize = 5;
    var defaultRestrictMovieSize = 30;
    var defaultRestrictUnit = 'MB';

    function isRestrict(originSize, restrictSize, unit) {
        var tempRestrictSize = 0;
        switch (unit) {
            case 'KB':
                tempRestrictSize = restrictSize * 1024;
                break;
            case 'MB':
                tempRestrictSize = restrictSize * 1024 * 1024;
                break;
            case 'GB':
                tempRestrictSize = restrictSize * 1024 * 1024 * 1024;
                break;
            default:
                tempRestrictSize = restrictSize;
        }

        if (originSize > tempRestrictSize) {
            return true;
        }

        return false;
    }

    return {
        aes: {
            //AES128 인코딩
            encrypt: function (originVal) {
                var encrypt = aesUtil.encrypt(salt, iv, passPhrase, originVal);
                return encrypt;
            },
            //AES128 디코딩
            decrypt: function (cipherText) {
                var decrypt = aesUtil.decrypt(salt, iv, passPhrase, cipherText);
                return decrypt;
            }
        },

        browser: {
            //모바일인지 여부 (true 모바일)
            isMobile: function () {
                return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            },

            //IE 브라우져 여부
            checkIE: function () {
                var agent = navigator.userAgent.toLowerCase();
                if ((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1)) {
                    return true;
                }
                return false;
            },

            //html 태그를 제거한다
            stripTag: function (content) {
                return content.replace(/<(\/)?([a-z]*)(\s[a-z]*=[^>]*)?(\s)*(\/)?>/gi, "");
            },

            //window 스크롤에 따라 다음 페이지 등을 호출해야 하는 경우
            setWindowScroll: function (func) {
                $(window).scroll(function () {
                    var scrollBottom = $(window).scrollTop() + $(window).height();
                    if (scrollBottom > $(document).height() * 0.8) {
                        func();
                    }
                });
            },

            /**
             * 주어진 엘리먼트 밖의 스크롤 막음
             */
            setElementScrollAndPreventOuterScroll: function ($layout) {
                $layout.on('mousewheel DOMMouseScroll', function (e) {
                    var e0 = e.originalEvent;
                    var delta = e0.wheelDelta || -e0.detail;

                    this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
                    e.preventDefault();
                });
            },

            /**
             * 스크롤의 상단으로 부터 주어진 퍼센트 이내에 위치에 있는지 체크
             * @param $layout
             * @param percent
             */
            checkScrollUpperPercent: function ($layout, percent) {
                if ($layout.scrollTop() <= ($layout[0].scrollHeight * (percent / 100))) {
                    // console.log($layout[0].scrollHeight + " : " + $layout.scrollTop() + " : " + ($layout[0].scrollHeight * (percent / 100)));
                    return true;
                }
                return false;
            },

            /**
             * 스크롤의 하단으로 부터 주어진 퍼센트 밖에 위치에 있는지 체크
             * @param $layout
             * @param percent
             */
            checkScrollLowerPercent: function ($layout, percent) {
                var scrollHeight = ($layout[0].scrollHeight - $layout.scrollTop());
                var checkHeight = $layout.outerHeight() + ($layout.outerHeight() * (percent / 100));
                if (scrollHeight <= checkHeight) {
                    return true;
                }
                return false;
            },

            /**
             * 스크롤이 최하단에 위치하는지 여부
             * @param $layout
             */
            checkScrollBottom: function ($layout) {
                var scrollHeight = ($layout[0].scrollHeight - $layout.scrollTop());
                return (scrollHeight - $layout.outerHeight()) <= 0 ? true : false;
            }
        },

        number: {
            //3자리마다 콤마를 찍어서 리턴
            numberWithCommas: function (number) {
                number = parseInt(number, 10);
                return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },

            /**
             * 소숫점 계산과 3자리마다 콤마를 찍어서 리턴 (분수 계산후)
             * @param molecule 분자
             * @param denominator 분모
             * @param point 노출할 소수점 자릿수
             */
            numberWithCommasAndFloatPointOfFraction: function (molecule, denominator, point) {
                if (molecule == 0) {
                    return 0;
                }
                return this.numberWithCommasAndFloatPoint(molecule / denominator, point);
            },

            /**
             * 소숫점 계산과 3자리마다 콤마를 찍어서 리턴
             * @param number 값
             * @param point 소수점 자리
             */
            numberWithCommasAndFloatPoint: function (number, point) {
                var strNumber = number.toString();
                var splitNumber = strNumber.split('.');
                number = parseInt(splitNumber[0], 10);

                var returnVal = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                if (splitNumber.length > 1) {
                    returnVal += '.' + splitNumber[1].substr(0, point);
                }
                return returnVal;
            },

            //숫자만 입력해야 하는 필드의 경우
            setOnlyNumberField: function ($obj) {
                $obj.keyup(function (e) {
                    $(this).val($(this).val().replace(/[^\d]/g, ''));
                });
            },

            //랜덤 값을 리턴
            getRandomNumber: function (min, max) {
                return Math.floor((Math.random() * max) + min);
            },

            //KB, MB, GB로 단위를 변환하여 리턴
            generateToUnit: function (number, isComputerUnit) {
                var changedNumber = '';
                var unit = '';
                var denominator = 0;
                if (number >= 1000 && number < 1000000) {
                    unit = isComputerUnit ? 'KB' : 'K';
                    denominator = 1000;
                } else if (number >= 1000000 && number < 1000000000) {
                    unit = isComputerUnit ? 'MB' : 'M';
                    denominator = 1000000;
                } else if (number >= 1000000000) {
                    unit = isComputerUnit ? 'GB' : 'G';
                    denominator = 1000000000;
                } else {
                    return number;
                }

                var temp = ((number / denominator).toFixed(1)).toString();
                changedNumber = parseInt(temp.split('.')[1], 10) > 0 ? temp + unit : temp.split('.')[0] + unit;
                return changedNumber;
            }
        },

        validation: {
            //이메일 체크
            checkEmailForm: function (email) {
                var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return emailRegex.test(email);
            },

            //URL 체크
            checkUrlForm: function (url) {
                var urlRegex = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
                return urlRegex.test(url);
            },

            //휴대폰 체크
            checkCellPhone: function (cellPhone) {
                var cellPhoneRegex = /^(?:(010\d{4})|(01[1|6|7|8|9]\d{3,4}))(\d{4})$/;
                return cellPhoneRegex.test(cellPhone);
            },

            //문자열에 이메일이 포함되어 있는지 체크
            checkContainsEmail: function (txt) {
                var containsEmailRegex = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
                return containsEmailRegex.test(txt);
            },

            //문자열에 전화번호가 포함되어 있는지 체크
            checkContainsPhone: function (txt) {
                var containsPhoneRegex = /(?:(\d{2,3})|(\d{3,4}))(\d{4})/;
                var containsPhoneHyphenRegex = /(?:(\d{2,3}[-|\s])|([-|\s]\d{3,4}))[-|\s](\d{4})/;
                var containsCellPhoneRegex = /(?:(010\d{4})|(01[1|6|7|8|9]\d{3,4}))(\d{4})/;
                var containsCellPhoneHyphenRegex = /(?:(010[-|\s]\d{4})|(01[1|6|7|8|9][-|\s]\d{3,4}))[-|\s](\d{4})/;

                return containsPhoneRegex.test(txt) || containsPhoneHyphenRegex.test(txt) || containsCellPhoneRegex.test(txt) || containsCellPhoneHyphenRegex.test(txt);
            }
        },

        file: {
            //파일 사이즈 제한여부 (true : 제한)
            isRestrict: isRestrict,

            /**
             * 파일의 확장자 체크
             * @param fileName
             * @param checkingExtension ex) jpg|jpeg|png|gif
             */
            checkExtension: function (fileName, checkingExtension) {
                //return fileName.match(/.(jpg|jpeg|png|gif)$/i) == null ? false : true;
                var re = new RegExp('.({0})'.format(checkingExtension), "i");
                return fileName.match(re) == null ? false : true;
            },

            //파일의 전체 경로에서 파일이름만 추출
            extractFileName: function ($fileObj) {
                var split = $fileObj.val().split('\\');
                return split[split.length - 1];
            }
        },

        //이건 추후에 수정하자
        media: {
            showMediaFile: function (mediaType, url) {
                $('#draftCover').find('.modal-body:eq(0)').html('');
                $('#draftCover').css('zIndex', 1051);
                var tag = '';
                switch (mediaType) {
                    case 'I':   //image
                        tag = '<img src="{0}{1}"/>'.format(loadData.awsCloudFront, url);
                        break;
                    case 'V':   //Video
                        var videoWidth = $(document).width();
                        if (MobileUtil.checkMobile()) {
                            videoWidth = videoWidth - 50;
                        } else {
                            videoWidth = 640;
                        }
                        tag = '<video width="' + videoWidth + '" controls autoplay><source src="{0}{1}" type="video/mp4">Your browser does not support the video tag.</video>'.format(loadData.awsCloudFront, url);
                        break;
                }
                $('#draftCover').find('.modal-body:eq(0)').html(tag);
                $('#draftCover').on('hidden.bs.modal', function () {
                    $('video').remove();
                });
                $('#draftCover').modal('show');
            }
        },

        image: {
            /**
             * 백그라운드로 이미지 미리보기 설정
             *
             * @param $fileBtnObj   파일선택 버튼
             * @param $imgPreviewObj    미리보기 엘리먼트
             * @param $imgTxtOnPreview  미리보기 엘리먼트에 이미지 적용전 텍스트 엘리먼트
             * @param options
             * checkRestrict : 파일 사이즈 제한검사 (true | false)
             * restrictSize : 제한 사이즈 (없으면 디폴트 사용 - 5)
             * restrictUnit : 제한 사이즈 단위 (없으면 디폴트 사용 - MB), KB, MB, GB
             *
             * isUpload : 서버에 업로드 후 URL을 받아서 하용할지 여부 (true | false)
             * uploadParameterName : 업로드시 파라미터 이름
             * uploadUrl : 업로드 URL
             *
             * failFnc : 실패시 함수 (리턴 파라미터 msg, code)
             * successFnc : 성공시 함수
             */
            setPreview: function ($fileBtnObj, $imgPreviewObj, $imgTxtOnPreview, isImgTag, options) {
                var imgExtensionRegex = /.(jpg|jpeg|png|gif)$/i;

                //파일 버튼의 값 변경시
                $fileBtnObj.change(function (e) {
                    if (isImgTag) {
                        $imgPreviewObj.attr('src', '');
                    } else {
                        $imgPreviewObj.css('background-image', 'url({0})'.format(''));
                    }
                    var imgBtnObj = $(this);
                    var fileName = imgBtnObj.val();
                    var fileSize = imgBtnObj[0].files[0].size;

                    //실패시 실행코드
                    var failFnc = function (code, msg) {
                        imgBtnObj.val('');
                        if (options && options.failFnc) {
                            options.failFnc(code, msg);
                        }
                    }

                    //성공시 실행코드
                    var successFnc = function () {
                        if (options && options.successFnc) {
                            options.successFnc();
                        }
                    }

                    //정의된 파일 확장자가 아닌경우
                    if (!fileName.match(imgExtensionRegex)) {
                        failFnc('incorrect extension', 501);
                        return;
                    }

                    //파일 사이즈 제한의 경우
                    if (options && options.checkRestrict) {
                        var restrictSize = options.restrictSize || defaultRestrictImgSize;
                        var restrictUnit = options.restrictUnit || defaultRestrictUnit;

                        if (isRestrict(fileSize, restrictSize, restrictUnit)) {
                            failFnc('greater than restriction size', 502);
                            return;
                        }
                    }

                    //서버에 업로드 후 미리보기를 해야 하는지 여부
                    if (options && options.isUpload) {
                        var formData = new FormData();
                        formData.append(options.uploadParameterName, imgBtnObj[0].files[0]);

                        $.ajax({
                            type: 'POST',
                            url: options.uploadUrl,
                            data: formData,
                            processData: false,
                            contentType: false,
                            success: function (result) {
                                var url = $.parseJSON(result).message;
                                if ($imgTxtOnPreview) {
                                    $imgTxtOnPreview.css('display', 'none');
                                }

                                if (isImgTag) {
                                    $imgPreviewObj.attr('src', loadData.awsCloudFront + url);
                                } else {
                                    $imgPreviewObj.css('background-image', 'url({0})'.format(loadData.awsCloudFront + url));
                                }
                                successFnc();
                            },
                            error: function (req, status, errorText) {
                                failFnc('upload error', 503);
                                /*$('#loading').css('display', 'none');
                                ImgLoader.stopAnimation();*/
                            }
                        });
                    } else {
                        if (isImgTag) {
                            var fileReader = new FileReader();
                            fileReader.onload = function (e) {
                                $imgPreviewObj.attr('src', e.target.result);
                                successFnc();
                            }
                            fileReader.readAsDataURL(imgBtnObj[0].files[0]);
                        } else {
                            $imgPreviewObj.css('background-image', 'url({0})'.format(fileName));
                            successFnc();
                        }
                    }
                });
            }
        },

        generation: {
            //시도의 이름을 짧게 변경
            generateRegionFullToShortName: function (fullName) {
                var mapList = {
                    '강원도': '강원',
                    '경기도': '경기',
                    '경상남도': '경남',
                    '경상북도': '경북',
                    '광주광역시': '광주',
                    '대구광역시': '대구',
                    '대전광역시': '대전',
                    '부산광역시': '부산',
                    '서울특별시': '서울',
                    '세종특별자치시': '세종',
                    '울산광역시': '울산',
                    '인천광역시': '인천',
                    '전라남도': '전남',
                    '전라북도': '전북',
                    '제주특별자치도': '제주',
                    '충청남도': '충남',
                    '충청북도': '충북',
                };

                var sido = mapList[fullName];
                if (sido == undefined) {
                    return fullName;
                }

                return sido;
            },

            //나이를 연령대로 변경
            generateAgeBand: function (age) {
                var currentYear = new Date().getFullYear();
                var tempAge = (currentYear - age).toString();
                return tempAge.substring(0, tempAge.length - 1) + '0대';
            }
        },

        obj: {
            //객체 복사 (jQuery 이용)
            copy: function (obj, isDeepCopy) {
                return $.extend(isDeepCopy, {}, obj);
            }
        },

        date: {
            //달력 필드 생성
            makeDateFiled: function ($fieldObj, options) {
                $.datepicker.setDefaults({
                    dateFormat: 'yy-mm-dd',
                    prevText: '이전 달',
                    nextText: '다음 달',
                    monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                    monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                    dayNames: ['일', '월', '화', '수', '목', '금', '토'],
                    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
                    dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
                    showMonthAfterYear: true,
                    yearSuffix: '년'
                });

                $fieldObj = $fieldObj.datepicker(options || {});

                if (options.setDate) {
                    $fieldObj.datepicker("setDate", options.setDate);
                } else if (options.minDate) {
                    $fieldObj.datepicker({minDate: options.minDate});
                } else {
                    $fieldObj.datepicker("setDate", new Date());
                }

                if (options.maxDate) {
                    $fieldObj.datepicker('option', 'maxDate', options.maxDate);
                }

                if (options.selected) {
                    $fieldObj.datepicker('option', 'onSelect', function (dateText, inst) {
                        options.selected(dateText, inst);
                    });
                }
            },

            /**
             * 유닉스 타임을 스트링으로 변환
             * @param unixtime 유닉스 타임
             * @param format ex) yyyy.MM.dd HH:mm:ss
             */
            generateUnixTimeToStr: function (unixtime, format) {
                var date = null;
                if (unixtime == null) {
                    date = new Date();
                } else {
                    date = new Date(unixtime);
                }
                return $.format.date(date, format);
            },

            /**
             * 날짜 사이의 몇일이 차이나는지 리턴
             * @param fromDate
             * @param toDate
             */
            getDaysBetweenDate: function (fromDate, toDate) {
                var oneDay = 24 * 60 * 60 * 1000;
                return Math.round((fromDate.getTime() - toDate.getTime()) / (oneDay));
            },

            /**
             * 하루안에 발생된 것인지 체크
             */
            checkOneDay: function (date) {
                var oneDay = 24 * 60 * 60 * 1000;
                var diffTime = new Date().getTime() - date.getTime();
                if (diffTime <= oneDay) {
                    return true;
                }
                return false;
            },

            /**
             * 시분초를 제외한 오늘 날짜의 date 리턴
             */
            getDate: function (date) {
                var tempDate = date ? date : new Date();
                return new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate());
            },

            /**
             * 주어진 일자를 더해서 날짜값을 리턴
             */
            getPlusDay: function (days) {
                var today = new Date();
                return new Date(today.getFullYear(), today.getMonth(), today.getDate() + days);
            },

            /**
             * 카운트 다운 분:초
             */
            countDown: function ($field, maxSeconds) {
                var clearCountDown = function ($fieldObj) {
                    clearInterval($fieldObj.data('countDown'));
                }

                clearCountDown($field);
                $field.data('countDownSeconds', maxSeconds);
                var x = setInterval(function () {
                    var currentSeconds = $field.data('countDownSeconds');
                    var minutes = parseInt(currentSeconds / 60, 10);
                    var seconds = currentSeconds % 60;
                    $field.html('{0}:{1}'.format(minutes, seconds < 10 ? '0' + seconds : seconds));
                    $field.data('countDownSeconds', currentSeconds - 1);
                    if (currentSeconds == 0) {
                        clearCountDown($field);
                    }
                }, 1000);
                $field.data('countDown', x);
            },
        },

        cookie: {
            getCookie: function (cName) {
                cName = cName + '=';
                var cookieData = document.cookie;
                var start = cookieData.indexOf(cName);
                var cValue = '';
                if (start != -1) {
                    start += cName.length;
                    var end = cookieData.indexOf(';', start);
                    if (end == -1) end = cookieData.length;
                    cValue = cookieData.substring(start, end);
                }

                return decodeURI(cValue);
            }
        },

        ajax: {
            call: function (options) {
                if (!options) {
                    return false;
                }
                if (options.contentType == 'application/json') {
                    options.data = JSON.stringify(options.data) || {};
                }

                //ajax 호출시 마스킹 처리가 필요하다면.
                if (options.isMask) {

                }

                var ajaxOptions = {
                    async: options.async == undefined ? true : options.async,
                    type: options.type || 'get',
                    url: options.url,
                    headers: {
                        Accept: options.accept || "application/json; charset=utf-8"
                    },
                    data: options.data || {},
                    processData: options.processData == undefined ? true : options.processData,
                    contentType: options.contentType == undefined ? "application/x-www-form-urlencoded; charset=UTF-8" : options.contentType,
                    success: function (data) {
                        if (options.isMask) {

                        }

                        if (options.bindParams) {
                            options.success(data, options.bindParams);
                        } else {
                            options.success(data);
                        }
                    },
                    error: function (req, status, errorText) {
                        if (options.isMask) {

                        }

                        //광고차단 플러인등에 걸린경우
                        if (req.readyState == 0 || req.status == 0) {
                            return;
                        }
                        if (options.error) {
                            options.error(req, status, errorText);
                        } else {    //정의된 에러 함수가 없다면 미리 정의된 메시지를 뿌려주거나 root 페이지로 리다이렉트
                            var tempDisplayMsg = '';
                            var status = req.status;
                            var responseText = req.responseText;

                            if (staticData.ErrorCodeMap.codes[status]) {
                                if (staticData.ErrorCodeMap.codes[status].isShowServerMsg) {
                                    var result = $.parseJSON(responseText);
                                    var displayMsg = result.message;
                                    if (displayMsg == '') {
                                        displayMsg = staticData.ErrorCodeMap.codes[status].msg;
                                    }
                                    tempDisplayMsg = displayMsg;
                                } else {
                                    tempDisplayMsg = staticData.ErrorCodeMap.codes[status].msg;
                                }
                                if (staticData.ErrorCodeMap.codes[status].isRedirect) {
                                    window.location.href = '/';
                                }
                            } else {
                                tempDisplayMsg = staticData.ErrorCodeMap.defaultMsg;
                            }

                            return alert(tempDisplayMsg);
                        }
                    }
                };
                if (options.dataType != undefined) {
                    ajaxOptions.dataType = options.dataType;
                }
                if (options.jsonp != undefined) {
                    ajaxOptions.jsonp = options.jsonp;
                }
                $.ajax(ajaxOptions)
            }
        }
    }
})();