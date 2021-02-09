!function () {
  var e = !1;
  window.JQClass = function () {
  }, JQClass.classes = {}, JQClass.extend = function n(t) {
    function i() {
      !e && this._init && this._init.apply(this, arguments)
    }

    var o = this.prototype;
    e = !0;
    var a = new this;
    e = !1;
    for (var s in t)a[s] = "function" == typeof t[s] && "function" == typeof o[s] ? function (e, n) {
      return function () {
        var t = this._super;
        this._super = function (n) {
          return o[e].apply(this, n)
        };
        var i = n.apply(this, arguments);
        return this._super = t, i
      }
    }(s, t[s]) : t[s];
    return i.prototype = a, i.prototype.constructor = i, i.extend = n, i
  }
}(), function ($) {
  function camelCase(e) {
    return e.replace(/-([a-z])/g, function (e, n) {
      return n.toUpperCase()
    })
  }

  JQClass.classes.JQPlugin = JQClass.extend({
    name: "plugin",
    defaultOptions: {},
    regionalOptions: {},
    _getters: [],
    _getMarker: function () {
      return "is-" + this.name
    },
    _init: function () {
      $.extend(this.defaultOptions, this.regionalOptions && this.regionalOptions[""] || {});
      var e = camelCase(this.name);
      $[e] = this, $.fn[e] = function (n) {
        var t = Array.prototype.slice.call(arguments, 1);
        return $[e]._isNotChained(n, t) ? $[e][n].apply($[e], [this[0]].concat(t)) : this.each(function () {
          if ("string" == typeof n) {
            if ("_" === n[0] || !$[e][n])throw"Unknown method: " + n;
            $[e][n].apply($[e], [this].concat(t))
          } else $[e]._attach(this, n)
        })
      }
    },
    setDefaults: function (e) {
      $.extend(this.defaultOptions, e || {})
    },
    _isNotChained: function (e, n) {
      return "option" === e && (0 === n.length || 1 === n.length && "string" == typeof n[0]) ? !0 : $.inArray(e, this._getters) > -1
    },
    _attach: function (e, n) {
      if (e = $(e), !e.hasClass(this._getMarker())) {
        e.addClass(this._getMarker()), n = $.extend({}, this.defaultOptions, this._getMetadata(e), n || {});
        var t = $.extend({name: this.name, elem: e, options: n}, this._instSettings(e, n));
        e.data(this.name, t), this._postAttach(e, t), this.option(e, n)
      }
    },
    _instSettings: function (e, n) {
      return {}
    },
    _postAttach: function (e, n) {
    },
    _getMetadata: function (elem) {
      try {
        var data = elem.data(this.name.toLowerCase()) || "";
        data = data.replace(/'/g, '"'), data = data.replace(/([a-zA-Z0-9]+):/g, function (e, n, t) {
          var i = data.substring(0, t).match(/"/g);
          return i && i.length % 2 !== 0 ? n + ":" : '"' + n + '":'
        }), data = $.parseJSON("{" + data + "}");
        for (var name in data) {
          var value = data[name];
          "string" == typeof value && value.match(/^new Date\((.*)\)$/) && (data[name] = eval(value))
        }
        return data
      } catch (e) {
        return {}
      }
    },
    _getInst: function (e) {
      return $(e).data(this.name) || {}
    },
    option: function (e, n, t) {
      e = $(e);
      var i = e.data(this.name);
      if (!n || "string" == typeof n && null == t) {
        var o = (i || {}).options;
        return o && n ? o[n] : o
      }
      if (e.hasClass(this._getMarker())) {
        var o = n || {};
        "string" == typeof n && (o = {}, o[n] = t), this._optionsChanged(e, i, o), $.extend(i.options, o)
      }
    },
    _optionsChanged: function (e, n, t) {
    },
    destroy: function (e) {
      e = $(e), e.hasClass(this._getMarker()) && (this._preDestroy(e, this._getInst(e)), e.removeData(this.name).removeClass(this._getMarker()))
    },
    _preDestroy: function (e, n) {
    }
  }), $.JQPlugin = {
    createPlugin: function (e, n) {
      "object" == typeof e && (n = e, e = "JQPlugin"), e = camelCase(e);
      var t = camelCase(n.name);
      JQClass.classes[t] = JQClass.classes[e].extend(n), new JQClass.classes[t]
    }
  }
}(jQuery), function (e) {
  var n = "countdown", t = 0, i = 1, o = 2, a = 3, s = 4, l = 5, r = 6;
  e.JQPlugin.createPlugin({
    name: n,
    defaultOptions: {
      until: null,
      since: null,
      timezone: null,
      serverSync: null,
      format: "dHMS",
      layout: "",
      compact: !1,
      padZeroes: !1,
      significant: 0,
      description: "",
      expiryUrl: "",
      expiryText: "",
      alwaysExpire: !1,
      onExpiry: null,
      onTick: null,
      tickInterval: 1
    },
    regionalOptions: {
      "": {
        labels: ["Years", "Months", "Weeks", "Days", "Hours", "Minutes", "Seconds"],
        labels1: ["Year", "Month", "Week", "Day", "Hour", "Minute", "Second"],
        compactLabels: ["y", "m", "w", "d"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
      }
    },
    _getters: ["getTimes"],
    _rtlClass: n + "-rtl",
    _sectionClass: n + "-section",
    _amountClass: n + "-amount",
    _periodClass: n + "-period",
    _rowClass: n + "-row",
    _holdingClass: n + "-holding",
    _showClass: n + "-show",
    _descrClass: n + "-descr",
    _timerElems: [],
    _init: function () {
      function n(e) {
        var l = 1e12 > e ? o ? performance.now() + performance.timing.navigationStart : i() : e || i();
        l - s >= 1e3 && (t._updateElems(), s = l), a(n)
      }

      var t = this;
      this._super(), this._serverSyncs = [];
      var i = "function" == typeof Date.now ? Date.now : function () {
        return (new Date).getTime()
      }, o = window.performance && "function" == typeof window.performance.now, a = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || null, s = 0;
      !a || e.noRequestAnimationFrame ? (e.noRequestAnimationFrame = null, setInterval(function () {
        t._updateElems()
      }, 980)) : (s = window.animationStartTime || window.webkitAnimationStartTime || window.mozAnimationStartTime || window.oAnimationStartTime || window.msAnimationStartTime || i(), a(n))
    },
    UTCDate: function (e, n, t, i, o, a, s, l) {
      "object" == typeof n && n.constructor == Date && (l = n.getMilliseconds(), s = n.getSeconds(), a = n.getMinutes(), o = n.getHours(), i = n.getDate(), t = n.getMonth(), n = n.getFullYear());
      var r = new Date;
      return r.setUTCFullYear(n), r.setUTCDate(1), r.setUTCMonth(t || 0), r.setUTCDate(i || 1), r.setUTCHours(o || 0), r.setUTCMinutes((a || 0) - (Math.abs(e) < 30 ? 60 * e : e)), r.setUTCSeconds(s || 0), r.setUTCMilliseconds(l || 0), r
    },
    periodsToSeconds: function (e) {
      return 31557600 * e[0] + 2629800 * e[1] + 604800 * e[2] + 86400 * e[3] + 3600 * e[4] + 60 * e[5] + e[6]
    },
    _instSettings: function (e, n) {
      return {_periods: [0, 0, 0, 0, 0, 0, 0]}
    },
    _addElem: function (e) {
      this._hasElem(e) || this._timerElems.push(e)
    },
    _hasElem: function (n) {
      return e.inArray(n, this._timerElems) > -1
    },
    _removeElem: function (n) {
      this._timerElems = e.map(this._timerElems, function (e) {
        return e == n ? null : e
      })
    },
    _updateElems: function () {
      for (var e = this._timerElems.length - 1; e >= 0; e--)this._updateCountdown(this._timerElems[e])
    },
    _optionsChanged: function (n, t, i) {
      i.layout && (i.layout = i.layout.replace(/&lt;/g, "<").replace(/&gt;/g, ">")), this._resetExtraLabels(t.options, i);
      var o = t.options.timezone != i.timezone;
      e.extend(t.options, i), this._adjustSettings(n, t, null != i.until || null != i.since || o);
      var a = new Date;
      (t._since && t._since < a || t._until && t._until > a) && this._addElem(n[0]), this._updateCountdown(n, t)
    },
    _updateCountdown: function (n, t) {
      if (n = n.jquery ? n : e(n), t = t || n.data(this.name)) {
        if (n.html(this._generateHTML(t)).toggleClass(this._rtlClass, t.options.isRTL), e.isFunction(t.options.onTick)) {
          var i = "lap" != t._hold ? t._periods : this._calculatePeriods(t, t._show, t.options.significant, new Date);
          1 != t.options.tickInterval && this.periodsToSeconds(i) % t.options.tickInterval != 0 || t.options.onTick.apply(n[0], [i])
        }
        var o = "pause" != t._hold && (t._since ? t._now.getTime() < t._since.getTime() : t._now.getTime() >= t._until.getTime());
        if (o && !t._expiring) {
          if (t._expiring = !0, this._hasElem(n[0]) || t.options.alwaysExpire) {
            if (this._removeElem(n[0]), e.isFunction(t.options.onExpiry) && t.options.onExpiry.apply(n[0], []), t.options.expiryText) {
              var a = t.options.layout;
              t.options.layout = t.options.expiryText, this._updateCountdown(n[0], t), t.options.layout = a
            }
            t.options.expiryUrl && (window.location = t.options.expiryUrl)
          }
          t._expiring = !1
        } else"pause" == t._hold && this._removeElem(n[0])
      }
    },
    _resetExtraLabels: function (e, n) {
      var t = !1;
      for (var i in n)if ("whichLabels" != i && i.match(/[Ll]abels/)) {
        t = !0;
        break
      }
      if (t)for (var i in e)i.match(/[Ll]abels[02-9]|compactLabels1/) && (e[i] = null)
    },
    _adjustSettings: function (n, t, i) {
      for (var o, a = 0, s = null, l = 0; l < this._serverSyncs.length; l++)if (this._serverSyncs[l][0] == t.options.serverSync) {
        s = this._serverSyncs[l][1];
        break
      }
      if (null != s)a = t.options.serverSync ? s : 0, o = new Date; else {
        var r = e.isFunction(t.options.serverSync) ? t.options.serverSync.apply(n[0], []) : null;
        o = new Date, a = r ? o.getTime() - r.getTime() : 0, this._serverSyncs.push([t.options.serverSync, a])
      }
      var u = t.options.timezone;
      u = null == u ? -o.getTimezoneOffset() : u, (i || !i && null == t._until && null == t._since) && (t._since = t.options.since, null != t._since && (t._since = this.UTCDate(u, this._determineTime(t._since, null)), t._since && a && t._since.setMilliseconds(t._since.getMilliseconds() + a)), t._until = this.UTCDate(u, this._determineTime(t.options.until, o)), a && t._until.setMilliseconds(t._until.getMilliseconds() + a)), t._show = this._determineShow(t)
    },
    _preDestroy: function (e, n) {
      this._removeElem(e[0]), e.empty()
    },
    pause: function (e) {
      this._hold(e, "pause")
    },
    lap: function (e) {
      this._hold(e, "lap")
    },
    resume: function (e) {
      this._hold(e, null)
    },
    toggle: function (n) {
      var t = e.data(n, this.name) || {};
      this[t._hold ? "resume" : "pause"](n)
    },
    toggleLap: function (n) {
      var t = e.data(n, this.name) || {};
      this[t._hold ? "resume" : "lap"](n)
    },
    _hold: function (n, t) {
      var i = e.data(n, this.name);
      if (i) {
        if ("pause" == i._hold && !t) {
          i._periods = i._savePeriods;
          var o = i._since ? "-" : "+";
          i[i._since ? "_since" : "_until"] = this._determineTime(o + i._periods[0] + "y" + o + i._periods[1] + "o" + o + i._periods[2] + "w" + o + i._periods[3] + "d" + o + i._periods[4] + "h" + o + i._periods[5] + "m" + o + i._periods[6] + "s"), this._addElem(n)
        }
        i._hold = t, i._savePeriods = "pause" == t ? i._periods : null, e.data(n, this.name, i), this._updateCountdown(n, i)
      }
    },
    getTimes: function (n) {
      var t = e.data(n, this.name);
      return t ? "pause" == t._hold ? t._savePeriods : t._hold ? this._calculatePeriods(t, t._show, t.options.significant, new Date) : t._periods : null
    },
    _determineTime: function (e, n) {
      var t = this, i = function (e) {
        var n = new Date;
        return n.setTime(n.getTime() + 1e3 * e), n
      }, o = function (e) {
        e = e.toLowerCase();
        for (var n = new Date, i = n.getFullYear(), o = n.getMonth(), a = n.getDate(), s = n.getHours(), l = n.getMinutes(), r = n.getSeconds(), u = /([+-]?[0-9]+)\s*(s|m|h|d|w|o|y)?/g, c = u.exec(e); c;) {
          switch (c[2] || "s") {
            case"s":
              r += parseInt(c[1], 10);
              break;
            case"m":
              l += parseInt(c[1], 10);
              break;
            case"h":
              s += parseInt(c[1], 10);
              break;
            case"d":
              a += parseInt(c[1], 10);
              break;
            case"w":
              a += 7 * parseInt(c[1], 10);
              break;
            case"o":
              o += parseInt(c[1], 10), a = Math.min(a, t._getDaysInMonth(i, o));
              break;
            case"y":
              i += parseInt(c[1], 10), a = Math.min(a, t._getDaysInMonth(i, o))
          }
          c = u.exec(e)
        }
        return new Date(i, o, a, s, l, r, 0)
      }, a = null == e ? n : "string" == typeof e ? o(e) : "number" == typeof e ? i(e) : e;
      return a && a.setMilliseconds(0), a
    },
    _getDaysInMonth: function (e, n) {
      return 32 - new Date(e, n, 32).getDate()
    },
    _normalLabels: function (e) {
      return e
    },
    _generateHTML: function (n) {
      var u = this;
      n._periods = n._hold ? n._periods : this._calculatePeriods(n, n._show, n.options.significant, new Date);
      for (var c = !1, d = 0, p = n.options.significant, m = e.extend({}, n._show), h = t; r >= h; h++)c |= "?" == n._show[h] && n._periods[h] > 0, m[h] = "?" != n._show[h] || c ? n._show[h] : null, d += m[h] ? 1 : 0, p -= n._periods[h] > 0 ? 1 : 0;
      for (var g = [!1, !1, !1, !1, !1, !1, !1], h = r; h >= t; h--)n._show[h] && (n._periods[h] ? g[h] = !0 : (g[h] = p > 0, p--));
      var w = n.options.compact ? n.options.compactLabels : n.options.labels, _ = n.options.whichLabels || this._normalLabels, f = function (e) {
        var t = n.options["compactLabels" + _(n._periods[e])];
        return m[e] ? u._translateDigits(n, n._periods[e]) + (t ? t[e] : w[e]) + " " : ""
      }, b = n.options.padZeroes ? 2 : 1, y = function (e) {
        var t = n.options["labels" + _(n._periods[e])];
        return !n.options.significant && m[e] || n.options.significant && g[e] ? '<span class="' + u._sectionClass + '"><span class="' + u._amountClass + '">' + u._minDigits(n, n._periods[e], b) + '</span><span class="' + u._periodClass + '">' + (t ? t[e] : w[e]) + "</span></span>" : ""
      };
      return n.options.layout ? this._buildLayout(n, m, n.options.layout, n.options.compact, n.options.significant, g) : (n.options.compact ? '<span class="' + this._rowClass + " " + this._amountClass + (n._hold ? " " + this._holdingClass : "") + '">' + f(t) + f(i) + f(o) + f(a) + (m[s] ? this._minDigits(n, n._periods[s], 2) : "") + (m[l] ? (m[s] ? n.options.timeSeparator : "") + this._minDigits(n, n._periods[l], 2) : "") + (m[r] ? (m[s] || m[l] ? n.options.timeSeparator : "") + this._minDigits(n, n._periods[r], 2) : "") : '<span class="' + this._rowClass + " " + this._showClass + (n.options.significant || d) + (n._hold ? " " + this._holdingClass : "") + '">' + y(t) + y(i) + y(o) + y(a) + y(s) + y(l) + y(r)) + "</span>" + (n.options.description ? '<span class="' + this._rowClass + " " + this._descrClass + '">' + n.options.description + "</span>" : "")
    },
    _buildLayout: function (n, u, c, d, p, m) {
      for (var h = n.options[d ? "compactLabels" : "labels"], g = n.options.whichLabels || this._normalLabels, w = function (e) {
        return (n.options[(d ? "compactLabels" : "labels") + g(n._periods[e])] || h)[e]
      }, _ = function (e, t) {
        return n.options.digits[Math.floor(e / t) % 10]
      }, f = {
        desc: n.options.description,
        sep: n.options.timeSeparator,
        yl: w(t),
        yn: this._minDigits(n, n._periods[t], 1),
        ynn: this._minDigits(n, n._periods[t], 2),
        ynnn: this._minDigits(n, n._periods[t], 3),
        y1: _(n._periods[t], 1),
        y10: _(n._periods[t], 10),
        y100: _(n._periods[t], 100),
        y1000: _(n._periods[t], 1e3),
        ol: w(i),
        on: this._minDigits(n, n._periods[i], 1),
        onn: this._minDigits(n, n._periods[i], 2),
        onnn: this._minDigits(n, n._periods[i], 3),
        o1: _(n._periods[i], 1),
        o10: _(n._periods[i], 10),
        o100: _(n._periods[i], 100),
        o1000: _(n._periods[i], 1e3),
        wl: w(o),
        wn: this._minDigits(n, n._periods[o], 1),
        wnn: this._minDigits(n, n._periods[o], 2),
        wnnn: this._minDigits(n, n._periods[o], 3),
        w1: _(n._periods[o], 1),
        w10: _(n._periods[o], 10),
        w100: _(n._periods[o], 100),
        w1000: _(n._periods[o], 1e3),
        dl: w(a),
        dn: this._minDigits(n, n._periods[a], 1),
        dnn: this._minDigits(n, n._periods[a], 2),
        dnnn: this._minDigits(n, n._periods[a], 3),
        d1: _(n._periods[a], 1),
        d10: _(n._periods[a], 10),
        d100: _(n._periods[a], 100),
        d1000: _(n._periods[a], 1e3),
        hl: w(s),
        hn: this._minDigits(n, n._periods[s], 1),
        hnn: this._minDigits(n, n._periods[s], 2),
        hnnn: this._minDigits(n, n._periods[s], 3),
        h1: _(n._periods[s], 1),
        h10: _(n._periods[s], 10),
        h100: _(n._periods[s], 100),
        h1000: _(n._periods[s], 1e3),
        ml: w(l),
        mn: this._minDigits(n, n._periods[l], 1),
        mnn: this._minDigits(n, n._periods[l], 2),
        mnnn: this._minDigits(n, n._periods[l], 3),
        m1: _(n._periods[l], 1),
        m10: _(n._periods[l], 10),
        m100: _(n._periods[l], 100),
        m1000: _(n._periods[l], 1e3),
        sl: w(r),
        sn: this._minDigits(n, n._periods[r], 1),
        snn: this._minDigits(n, n._periods[r], 2),
        snnn: this._minDigits(n, n._periods[r], 3),
        s1: _(n._periods[r], 1),
        s10: _(n._periods[r], 10),
        s100: _(n._periods[r], 100),
        s1000: _(n._periods[r], 1e3)
      }, b = c, y = t; r >= y; y++) {
        var D = "yowdhms".charAt(y), L = new RegExp("\\{" + D + "<\\}([\\s\\S]*)\\{" + D + ">\\}", "g");
        b = b.replace(L, !p && u[y] || p && m[y] ? "$1" : "")
      }
      return e.each(f, function (e, n) {
        var t = new RegExp("\\{" + e + "\\}", "g");
        b = b.replace(t, n)
      }), b
    },
    _minDigits: function (e, n, t) {
      return n = "" + n, n.length >= t ? this._translateDigits(e, n) : (n = "0000000000" + n, this._translateDigits(e, n.substr(n.length - t)))
    },
    _translateDigits: function (e, n) {
      return ("" + n).replace(/[0-9]/g, function (n) {
        return e.options.digits[n]
      })
    },
    _determineShow: function (e) {
      var n = e.options.format, u = [];
      return u[t] = n.match("y") ? "?" : n.match("Y") ? "!" : null, u[i] = n.match("o") ? "?" : n.match("O") ? "!" : null, u[o] = n.match("w") ? "?" : n.match("W") ? "!" : null, u[a] = n.match("d") ? "?" : n.match("D") ? "!" : null, u[s] = n.match("h") ? "?" : n.match("H") ? "!" : null, u[l] = n.match("m") ? "?" : n.match("M") ? "!" : null, u[r] = n.match("s") ? "?" : n.match("S") ? "!" : null, u
    },
    _calculatePeriods: function (e, n, u, c) {
      e._now = c, e._now.setMilliseconds(0);
      var d = new Date(e._now.getTime());
      e._since ? c.getTime() < e._since.getTime() ? e._now = c = d : c = e._since : (d.setTime(e._until.getTime()), c.getTime() > e._until.getTime() && (e._now = c = d));
      var p = [0, 0, 0, 0, 0, 0, 0];
      if (n[t] || n[i]) {
        var m = this._getDaysInMonth(c.getFullYear(), c.getMonth()), h = this._getDaysInMonth(d.getFullYear(), d.getMonth()), g = d.getDate() == c.getDate() || d.getDate() >= Math.min(m, h) && c.getDate() >= Math.min(m, h), w = function (e) {
          return 60 * (60 * e.getHours() + e.getMinutes()) + e.getSeconds()
        }, _ = Math.max(0, 12 * (d.getFullYear() - c.getFullYear()) + d.getMonth() - c.getMonth() + (d.getDate() < c.getDate() && !g || g && w(d) < w(c) ? -1 : 0));
        p[t] = n[t] ? Math.floor(_ / 12) : 0, p[i] = n[i] ? _ - 12 * p[t] : 0, c = new Date(c.getTime());
        var f = c.getDate() == m, b = this._getDaysInMonth(c.getFullYear() + p[t], c.getMonth() + p[i]);
        c.getDate() > b && c.setDate(b), c.setFullYear(c.getFullYear() + p[t]), c.setMonth(c.getMonth() + p[i]), f && c.setDate(b)
      }
      var y = Math.floor((d.getTime() - c.getTime()) / 1e3), D = function (e, t) {
        p[e] = n[e] ? Math.floor(y / t) : 0, y -= p[e] * t
      };
      if (D(o, 604800), D(a, 86400), D(s, 3600), D(l, 60), D(r, 1), y > 0 && !e._since)for (var L = [1, 12, 4.3482, 7, 24, 60, 60], S = r, M = 1, T = r; T >= t; T--)n[T] && (p[S] >= M && (p[S] = 0, y = 1), y > 0 && (p[T]++, y = 0, S = T, M = 1)), M *= L[T];
      if (u)for (var T = t; r >= T; T++)u && p[T] ? u-- : u || (p[T] = 0);
      return p
    }
  })
}(jQuery), function (e) {
  e.countdown.regionalOptions.am = {
    labels: ["Տարի", "Ամիս", "Շաբաթ", "Օր", "ժամ", "րոպե", "վարկյան"],
    compactLabels: ["l", "m", "n", "d"],
    compactLabels1: ["g", "m", "n", "d"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.am)
}(jQuery), function (e) {
  e.countdown.regionalOptions.ar = {
    labels: ["سنوات", "أشهر", "أسابيع", "أيام", "ساعات", "دقائق", "ثواني"],
    labels1: ["سنة", "شهر", "أسبوع", "يوم", "ساعة", "دقيقة", "ثانية"],
    compactLabels: ["س", "ش", "أ", "ي"],
    whichLabels: null,
    digits: ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"],
    timeSeparator: ":",
    isRTL: !0
  }, e.countdown.setDefaults(e.countdown.regionalOptions.ar)
}(jQuery), function (e) {
  e.countdown.regionalOptions.bg = {
    labels: ["Години", "Месеца", "Седмица", "Дни", "Часа", "Минути", "Секунди"],
    labels1: ["Година", "Месец", "Седмица", "Ден", "Час", "Минута", "Секунда"],
    compactLabels: ["l", "m", "n", "d"],
    compactLabels1: ["g", "m", "n", "d"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.bg)
}(jQuery), function (e) {
  e.countdown.regionalOptions.bn = {
    labels: ["বছর", "মাস", "সপ্তাহ", "দিন", "ঘন্টা", "মিনিট", "সেকেন্ড"],
    labels1: ["বছর", "মাস", "সপ্তাহ", "দিন", "ঘন্টা", "মিনিট", "সেকেন্ড"],
    compactLabels: ["ব", "মা", "স", "দি"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.bn)
}(jQuery), function (e) {
  e.countdown.regionalOptions.bs = {
    labels: ["Godina", "Mjeseci", "Sedmica", "Dana", "Sati", "Minuta", "Sekundi"],
    labels1: ["Godina", "Mjesec", "Sedmica", "Dan", "Sat", "Minuta", "Sekunda"],
    labels2: ["Godine", "Mjeseca", "Sedmica", "Dana", "Sata", "Minute", "Sekunde"],
    compactLabels: ["g", "m", "t", "d"],
    whichLabels: function (e) {
      return 1 == e ? 1 : e >= 2 && 4 >= e ? 2 : 0
    },
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.bs)
}(jQuery), function (e) {
  e.countdown.regionalOptions.ca = {
    labels: ["Anys", "Mesos", "Setmanes", "Dies", "Hores", "Minuts", "Segons"],
    labels1: ["Anys", "Mesos", "Setmanes", "Dies", "Hores", "Minuts", "Segons"],
    compactLabels: ["a", "m", "s", "g"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.ca)
}(jQuery), function (e) {
  e.countdown.regionalOptions.cs = {
    labels: ["Roků", "Měsíců", "Týdnů", "Dní", "Hodin", "Minut", "Sekund"],
    labels1: ["Rok", "Měsíc", "Týden", "Den", "Hodina", "Minuta", "Sekunda"],
    labels2: ["Roky", "Měsíce", "Týdny", "Dny", "Hodiny", "Minuty", "Sekundy"],
    compactLabels: ["r", "m", "t", "d"],
    whichLabels: function (e) {
      return 1 == e ? 1 : e >= 2 && 4 >= e ? 2 : 0
    },
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.cs)
}(jQuery), function (e) {
  e.countdown.regionalOptions.cy = {
    labels: ["Blynyddoedd", "Mis", "Wythnosau", "Diwrnodau", "Oriau", "Munudau", "Eiliadau"],
    labels1: ["Blwyddyn", "Mis", "Wythnos", "Diwrnod", "Awr", "Munud", "Eiliad"],
    compactLabels: ["b", "m", "w", "d"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.cy)
}(jQuery), function (e) {
  e.countdown.regionalOptions.da = {
    labels: ["År", "Måneder", "Uger", "Dage", "Timer", "Minutter", "Sekunder"],
    labels1: ["År", "Måned", "Uge", "Dag", "Time", "Minut", "Sekund"],
    compactLabels: ["Å", "M", "U", "D"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.da)
}(jQuery), function (e) {
  e.countdown.regionalOptions.de = {
    labels: ["Jahre", "Monate", "Wochen", "Tage", "Stunden", "Minuten", "Sekunden"],
    labels1: ["Jahr", "Monat", "Woche", "Tag", "Stunde", "Minute", "Sekunde"],
    compactLabels: ["J", "M", "W", "T"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.de)
}(jQuery), function (e) {
  e.countdown.regionalOptions.el = {
    labels: ["Χρόνια", "Μήνες", "Εβδομάδες", "Μέρες", "Ώρες", "Λεπτά", "Δευτερόλεπτα"],
    labels1: ["Χρόνος", "Μήνας", "Εβδομάδα", "Ημέρα", "Ώρα", "Λεπτό", "Δευτερόλεπτο"],
    compactLabels: ["Χρ.", "Μην.", "Εβδ.", "Ημ."],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.el)
}(jQuery), function (e) {
  e.countdown.regionalOptions.es = {
    labels: ["Años", "Meses", "Semanas", "Días", "Horas", "Minutos", "Segundos"],
    labels1: ["Año", "Mes", "Semana", "Día", "Hora", "Minuto", "Segundo"],
    compactLabels: ["a", "m", "s", "g"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.es)
}(jQuery), function (e) {
  e.countdown.regionalOptions.et = {
    labels: ["Aastat", "Kuud", "Nädalat", "Päeva", "Tundi", "Minutit", "Sekundit"],
    labels1: ["Aasta", "Kuu", "Nädal", "Päev", "Tund", "Minut", "Sekund"],
    compactLabels: ["a", "k", "n", "p"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.et)
}(jQuery), function (e) {
  e.countdown.regionalOptions.fa = {
    labels: ["‌سال", "ماه", "هفته", "روز", "ساعت", "دقیقه", "ثانیه"],
    labels1: ["سال", "ماه", "هفته", "روز", "ساعت", "دقیقه", "ثانیه"],
    compactLabels: ["س", "م", "ه", "ر"],
    whichLabels: null,
    digits: ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"],
    timeSeparator: ":",
    isRTL: !0
  }, e.countdown.setDefaults(e.countdown.regionalOptions.fa)
}(jQuery), function (e) {
  e.countdown.regionalOptions.fi = {
    labels: ["vuotta", "kuukautta", "viikkoa", "päivää", "tuntia", "minuuttia", "sekuntia"],
    labels1: ["vuosi", "kuukausi", "viikko", "päivä", "tunti", "minuutti", "sekunti"],
    compactLabels: ["v", "kk", "vk", "pv"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.fi)
}(jQuery), function (e) {
  e.countdown.regionalOptions.fo = {
    labels: ["Ár", "Mánaðir", "Vikur", "Dagar", "Tímar", "Minuttir", "Sekund"],
    labels1: ["Ár", "Mánaður", "Vika", "Dagur", "Tími", "Minuttur", "Sekund"],
    compactLabels: ["Á", "M", "V", "D"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.fo)
}(jQuery), function (e) {
  e.countdown.regionalOptions.fr = {
    labels: ["Années", "Mois", "Semaines", "Jours", "Heures", "Minutes", "Secondes"],
    labels1: ["Année", "Mois", "Semaine", "Jour", "Heure", "Minute", "Seconde"],
    compactLabels: ["a", "m", "s", "j"],
    whichLabels: function (e) {
      return e > 1 ? 0 : 1
    },
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.fr)
}(jQuery), function (e) {
  e.countdown.regionalOptions.ge = {
    labels: ["წელი", "თვე", "კვირა", "დღე", "საათი", "წუთი", "წამი"],
    compactLabels: ["y", "m", "w", "d"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.ge)
}(jQuery), function (e) {
  e.countdown.regionalOptions.gl = {
    labels: ["Anos", "Meses", "Semanas", "Días", "Horas", "Minutos", "Segundos"],
    labels1: ["Ano", "Mes", "Semana", "Día", "Hora", "Minuto", "Segundo"],
    compactLabels: ["a", "m", "s", "g"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.gl)
}(jQuery), function (e) {
  e.countdown.regionalOptions.gu = {
    labels: ["વર્ષ", "મહિનો", "અઠવાડિયા", "દિવસ", "કલાક", "મિનિટ", "સેકન્ડ"],
    labels1: ["વર્ષ", "મહિનો", "અઠવાડિયા", "દિવસ", "કલાક", "મિનિટ", "સેકન્ડ"],
    compactLabels: ["વ", "મ", "અ", "દિ"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.gu)
}(jQuery), function (e) {
  e.countdown.regionalOptions.he = {
    labels: ["שנים", "חודשים", "שבועות", "ימים", "שעות", "דקות", "שניות"],
    labels1: ["שנה", "חודש", "שבוע", "יום", "שעה", "דקה", "שנייה"],
    compactLabels: ["שנ", "ח", "שב", "י"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !0
  }, e.countdown.setDefaults(e.countdown.regionalOptions.he)
}(jQuery), function (e) {
  e.countdown.regionalOptions.hr = {
    labels: ["Godina", "Mjeseci", "Tjedana", "Dana", "Sati", "Minuta", "Sekundi"],
    labels1: ["Godina", "Mjesec", "Tjedan", "Dan", "Sat", "Minutu", "Sekundu"],
    labels2: ["Godine", "Mjeseca", "Tjedana", "Dana", "Sata", "Minute", "Sekunde"],
    compactLabels: ["g", "m", "t", "d"],
    whichLabels: function (e) {
      return e = parseInt(e, 10), e % 10 === 1 && e % 100 !== 11 ? 1 : e % 10 >= 2 && 4 >= e % 10 && (10 > e % 100 || e % 100 >= 20) ? 2 : 0
    },
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.hr)
}(jQuery), function (e) {
  e.countdown.regionalOptions.hu = {
    labels: ["Év", "Hónap", "Hét", "Nap", "Óra", "Perc", "Másodperc"],
    labels1: ["Év", "Hónap", "Hét", "Nap", "Óra", "Perc", "Másodperc"],
    compactLabels: ["É", "H", "Hé", "N"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.hu)
}(jQuery), function (e) {
  e.countdown.regionalOptions.hy = {
    labels: ["Տարի", "Ամիս", "Շաբաթ", "Օր", "Ժամ", "Րոպե", "Վարկյան"],
    labels1: ["Տարի", "Ամիս", "Շաբաթ", "Օր", "Ժամ", "Րոպե", "Վարկյան"],
    compactLabels: ["տ", "ա", "շ", "օ"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.hy)
}(jQuery), function (e) {
  e.countdown.regionalOptions.id = {
    labels: ["tahun", "bulan", "minggu", "hari", "jam", "menit", "detik"],
    labels1: ["tahun", "bulan", "minggu", "hari", "jam", "menit", "detik"],
    compactLabels: ["t", "b", "m", "h"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.id)
}(jQuery), function (e) {
  e.countdown.regionalOptions.is = {
    labels: ["Ár", "Mánuðir", "Vikur", "Dagar", "Klukkustundir", "Mínútur", "Sekúndur"],
    labels1: ["Ár", "Mánuður", "Vika", "Dagur", "Klukkustund", "Mínúta", "Sekúnda"],
    compactLabels: ["ár.", "mán.", "vik.", "dag.", "klst.", "mín.", "sek."],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.is)
}(jQuery), function (e) {
  e.countdown.regionalOptions.it = {
    labels: ["Anni", "Mesi", "Settimane", "Giorni", "Ore", "Minuti", "Secondi"],
    labels1: ["Anno", "Mese", "Settimana", "Giorno", "Ora", "Minuto", "Secondo"],
    compactLabels: ["a", "m", "s", "g"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.it)
}(jQuery), function (e) {
  e.countdown.regionalOptions.ja = {
    labels: ["年", "月", "週", "日", "時", "分", "秒"],
    labels1: ["年", "月", "週", "日", "時", "分", "秒"],
    compactLabels: ["年", "月", "週", "日"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.ja)
}(jQuery), function (e) {
  e.countdown.regionalOptions.kn = {
    labels: ["ವರ್ಷಗಳು", "ತಿಂಗಳು", "ವಾರಗಳು", "ದಿನಗಳು", "ಘಂಟೆಗಳು", "ನಿಮಿಷಗಳು", "ಕ್ಷಣಗಳು"],
    labels1: ["ವರ್ಷ", "ತಿಂಗಳು", "ವಾರ", "ದಿನ", "ಘಂಟೆ", "ನಿಮಿಷ", "ಕ್ಷಣ"],
    compactLabels: ["ವ", "ತಿ", "ವಾ", "ದಿ"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.kn)
}(jQuery), function (e) {
  e.countdown.regionalOptions.ko = {
    labels: ["년", "월", "주", "일", "시", "분", "초"],
    labels1: ["년", "월", "주", "일", "시", "분", "초"],
    compactLabels: ["년", "월", "주", "일"],
    compactLabels1: ["년", "월", "주", "일"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.ko)
}(jQuery), function (e) {
  e.countdown.regionalOptions.lt = {
    labels: ["Metų", "Mėnesių", "Savaičių", "Dienų", "Valandų", "Minučių", "Sekundžių"],
    labels1: ["Metai", "Mėnuo", "Savaitė", "Diena", "Valanda", "Minutė", "Sekundė"],
    compactLabels: ["m", "m", "s", "d"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.lt)
}(jQuery), function (e) {
  e.countdown.regionalOptions.lv = {
    labels: ["Gadi", "Mēneši", "Nedēļas", "Dienas", "Stundas", "Minūtes", "Sekundes"],
    labels1: ["Gads", "Mēnesis", "Nedēļa", "Diena", "Stunda", "Minūte", "Sekunde"],
    compactLabels: ["l", "m", "n", "d"],
    compactLabels1: ["g", "m", "n", "d"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.lv)
}(jQuery), function (e) {
  e.countdown.regionalOptions.ml = {
    labels: ["വര്‍ഷങ്ങള്‍", "മാസങ്ങള്‍", "ആഴ്ചകള്‍", "ദിവസങ്ങള്‍", "മണിക്കൂറുകള്‍", "മിനിറ്റുകള്‍", "സെക്കന്റുകള്‍"],
    labels1: ["വര്‍ഷം", "മാസം", "ആഴ്ച", "ദിവസം", "മണിക്കൂര്‍", "മിനിറ്റ്", "സെക്കന്റ്"],
    compactLabels: ["വ", "മ", "ആ", "ദി"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.ml)
}(jQuery), function (e) {
  e.countdown.regionalOptions.ms = {
    labels: ["Tahun", "Bulan", "Minggu", "Hari", "Jam", "Minit", "Saat"],
    labels1: ["Tahun", "Bulan", "Minggu", "Hari", "Jam", "Minit", "Saat"],
    compactLabels: ["t", "b", "m", "h"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.ms)
}(jQuery), function (e) {
  e.countdown.regionalOptions.my = {
    labels: ["နွစ္", "လ", "ရက္သတဿတပတ္", "ရက္", "နာရီ", "မိနစ္", "စကဿကန့္"],
    labels1: ["နွစ္", "လ", "ရက္သတဿတပတ္", "ရက္", "နာရီ", "မိနစ္", "စကဿကန့္"],
    compactLabels: ["နွစ္", "လ", "ရက္သတဿတပတ္", "ရက္"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.my)
}(jQuery), function (e) {
  e.countdown.regionalOptions.nb = {
    labels: ["År", "Måneder", "Uker", "Dager", "Timer", "Minutter", "Sekunder"],
    labels1: ["År", "Måned", "Uke", "Dag", "Time", "Minutt", "Sekund"],
    compactLabels: ["Å", "M", "U", "D"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.nb)
}(jQuery), function (e) {
  e.countdown.regionalOptions.nl = {
    labels: ["Jaren", "Maanden", "Weken", "Dagen", "Uren", "Minuten", "Seconden"],
    labels1: ["Jaar", "Maand", "Week", "Dag", "Uur", "Minuut", "Seconde"],
    compactLabels: ["j", "m", "w", "d"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.nl)
}(jQuery), function (e) {
  e.countdown.regionalOptions.pl = {
    labels: ["lat", "miesięcy", "tygodni", "dni", "godzin", "minut", "sekund"],
    labels1: ["rok", "miesiąc", "tydzień", "dzień", "godzina", "minuta", "sekunda"],
    labels2: ["lata", "miesiące", "tygodnie", "dni", "godziny", "minuty", "sekundy"],
    compactLabels: ["l", "m", "t", "d"],
    compactLabels1: ["r", "m", "t", "d"],
    whichLabels: function (e) {
      var n = e % 10, t = Math.floor(e % 100 / 10);
      return 1 == e ? 1 : n >= 2 && 4 >= n && 1 != t ? 2 : 0
    },
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.pl)
}(jQuery), function (e) {
  e.countdown.regionalOptions["pt-BR"] = {
    labels: ["Anos", "Meses", "Semanas", "Dias", "Horas", "Minutos", "Segundos"],
    labels1: ["Ano", "M�s", "Semana", "Dia", "Hora", "Minuto", "Segundo"],
    compactLabels: ["a", "m", "s", "d"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions["pt-BR"])
}(jQuery), function (e) {
  e.countdown.regionalOptions.ro = {
    labels: ["Ani", "Luni", "Saptamani", "Zile", "Ore", "Minute", "Secunde"],
    labels1: ["An", "Luna", "Saptamana", "Ziua", "Ora", "Minutul", "Secunda"],
    compactLabels: ["A", "L", "S", "Z"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.ro)
}(jQuery), function (e) {
  e.countdown.regionalOptions.ru = {
    labels: ["Лет", "Месяцев", "Недель", "Дней", "Часов", "Минут", "Секунд"],
    labels1: ["Год", "Месяц", "Неделя", "День", "Час", "Минута", "Секунда"],
    labels2: ["Года", "Месяца", "Недели", "Дня", "Часа", "Минуты", "Секунды"],
    compactLabels: ["л", "м", "н", "д"],
    compactLabels1: ["г", "м", "н", "д"],
    whichLabels: function (e) {
      var n = e % 10, t = Math.floor(e % 100 / 10);
      return 1 == e ? 1 : n >= 2 && 4 >= n && 1 != t ? 2 : 1 == n && 1 != t ? 1 : 0
    },
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.ru)
}(jQuery), function (e) {
  e.countdown.regionalOptions.sk = {
    labels: ["Rokov", "Mesiacov", "Týždňov", "Dní", "Hodín", "Minút", "Sekúnd"],
    labels1: ["Rok", "Mesiac", "Týždeň", "Deň", "Hodina", "Minúta", "Sekunda"],
    labels2: ["Roky", "Mesiace", "Týždne", "Dni", "Hodiny", "Minúty", "Sekundy"],
    compactLabels: ["r", "m", "t", "d"],
    whichLabels: function (e) {
      return 1 == e ? 1 : e >= 2 && 4 >= e ? 2 : 0
    },
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.sk)
}(jQuery), function (e) {
  e.countdown.regionalOptions.sl = {
    labels: ["Let", "Mesecev", "Tednov", "Dni", "Ur", "Minut", "Sekund"],
    labels1: ["Leto", "Mesec", "Teden", "Dan", "Ura", "Minuta", "Sekunda"],
    compactLabels: ["l", "m", "t", "d"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.sl)
}(jQuery), function (e) {
  e.countdown.regionalOptions.sq = {
    labels: ["Vite", "Muaj", "Javë", "Ditë", "Orë", "Minuta", "Sekonda"],
    labels1: ["Vit", "Muaj", "Javë", "Dit", "Orë", "Minutë", "Sekond"],
    compactLabels: ["V", "M", "J", "D"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.sq)
}(jQuery), function (e) {
  e.countdown.regionalOptions["sr-SR"] = {
    labels: ["Godina", "Meseci", "Nedelja", "Dana", "Časova", "Minuta", "Sekundi"],
    labels1: ["Godina", "Mesec", "Nedelja", "Dan", "Čas", "Minut", "Sekunda"],
    labels2: ["Godine", "Meseca", "Nedelje", "Dana", "Časa", "Minuta", "Sekunde"],
    compactLabels: ["g", "m", "n", "d"],
    whichLabels: function (e) {
      return 1 == e ? 1 : e >= 2 && 4 >= e ? 2 : 0
    },
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions["sr-SR"])
}(jQuery), function (e) {
  e.countdown.regionalOptions.sr = {
    labels: ["Година", "Месеци", "Недеља", "Дана", "Часова", "Минута", "Секунди"],
    labels1: ["Година", "месец", "Недеља", "Дан", "Час", "Минут", "Секунда"],
    labels2: ["Године", "Месеца", "Недеље", "Дана", "Часа", "Минута", "Секунде"],
    compactLabels: ["г", "м", "н", "д"],
    whichLabels: function (e) {
      return 1 == e ? 1 : e >= 2 && 4 >= e ? 2 : 0
    },
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.sr)
}(jQuery), function (e) {
  e.countdown.regionalOptions.sv = {
    labels: ["År", "Månader", "Veckor", "Dagar", "Timmar", "Minuter", "Sekunder"],
    labels1: ["År", "Månad", "Vecka", "Dag", "Timme", "Minut", "Sekund"],
    compactLabels: ["Å", "M", "V", "D"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.sv)
}(jQuery), function (e) {
  e.countdown.regionalOptions.th = {
    labels: ["ปี", "เดือน", "สัปดาห์", "วัน", "ชั่วโมง", "นาที", "วินาที"],
    labels1: ["ปี", "เดือน", "สัปดาห์", "วัน", "ชั่วโมง", "นาที", "วินาที"],
    compactLabels: ["ปี", "เดือน", "สัปดาห์", "วัน"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.th)
}(jQuery), function (e) {
  e.countdown.regionalOptions.tr = {
    labels: ["Yıl", "Ay", "Hafta", "Gün", "Saat", "Dakika", "Saniye"],
    labels1: ["Yıl", "Ay", "Hafta", "Gün", "Saat", "Dakika", "Saniye"],
    compactLabels: ["y", "a", "h", "g"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.tr)
}(jQuery), function (e) {
  e.countdown.regionalOptions.uk = {
    labels: ["Років", "Місяців", "Тижнів", "Днів", "Годин", "Хвилин", "Секунд"],
    labels1: ["Рік", "Місяць", "Тиждень", "День", "Година", "Хвилина", "Секунда"],
    labels2: ["Роки", "Місяці", "Тижні", "Дні", "Години", "Хвилини", "Секунди"],
    compactLabels: ["r", "m", "t", "d"],
    whichLabels: function (e) {
      return 1 == e ? 1 : e >= 2 && 4 >= e ? 2 : 0
    },
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.uk)
}(jQuery), function (e) {
  e.countdown.regionalOptions.ur = {
    labels: ["سال", "مہينے", "ہفتے", "دن", "گھنٹے", "منٹس", "سيکنڑز"],
    labels1: ["سال", "ماہ", "ہفتہ", "دن", "گھنٹہ", "منٹ", "سیکنڈز"],
    compactLabels: ["(ق)", "سینٹ", "ایک", "J"],
    whichLabels: null,
    digits: ["٠", "١", "٢", "٣", "۴", "۵", "۶", "۷", "٨", "٩"],
    timeSeparator: ":",
    isRTL: !0
  }, e.countdown.setDefaults(e.countdown.regionalOptions.ur)
}(jQuery), function (e) {
  e.countdown.regionalOptions.uz = {
    labels: ["Yil", "Oy", "Hafta", "Kun", "Soat", "Daqiqa", "Soniya"],
    labels1: ["Yil", "Oy", "Hafta", "Kun", "Soat", "Daqiqa", "Soniya"],
    compactLabels: ["y", "o", "h", "k"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.uz)
}(jQuery), function (e) {
  e.countdown.regionalOptions.vi = {
    labels: ["Năm", "Tháng", "Tuần", "Ngày", "Giờ", "Phút", "Giây"],
    labels1: ["Năm", "Tháng", "Tuần", "Ngày", "Giờ", "Phút", "Giây"],
    compactLabels: ["năm", "th", "tu", "ng"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions.vi)
}(jQuery), function (e) {
  e.countdown.regionalOptions["zh-CN"] = {
    labels: ["年", "月", "周", "天", "时", "分", "秒"],
    labels1: ["年", "月", "周", "天", "时", "分", "秒"],
    compactLabels: ["年", "月", "周", "天"],
    compactLabels1: ["年", "月", "周", "天"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions["zh-CN"])
}(jQuery), function (e) {
  e.countdown.regionalOptions["zh-TW"] = {
    labels: ["年", "月", "周", "天", "時", "分", "秒"],
    labels1: ["年", "月", "周", "天", "時", "分", "秒"],
    compactLabels: ["年", "月", "周", "天"],
    compactLabels1: ["年", "月", "周", "天"],
    whichLabels: null,
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    timeSeparator: ":",
    isRTL: !1
  }, e.countdown.setDefaults(e.countdown.regionalOptions["zh-TW"])
}(jQuery), function () {
  try {
    var e;
    e = function (e) {
      try {
        if (e > 0)return e - 1;
        if (0 === e)return 6
      } catch (n) {
        error_handler(n, "lib-countdown 1")
      }
    }, $(function () {
      try {
        var n;
        return n = window.plp_lang || window.plp.lang || "ru", $.countdown.setDefaults($.countdown.regionalOptions[""]), $(".macros-countdown").each(function () {
          try {
            var t, i, o, a, s, l;
            return t = $(this).find(".countdown"), l = t.data("vals"), s = new Date, "full" === l.type ? (l.full_date.day++, o = new Date(l.full_date.year, l.full_date.month, l.full_date.day, l.full_time.hour, l.full_time.minute)) : "month" === l.type ? (l.month_day++, o = new Date(s.getFullYear(), s.getMonth(), l.month_day, l.month_time.hour, l.month_time.minute), o.getTime() < s.getTime() && (o = new Date(s.getFullYear(), s.getMonth() + 1, l.month_day, l.month_time.hour, l.month_time.minute))) : "week" === l.type ? (i = l.week_day - e(s.getDay()), o = new Date(s.getFullYear(), s.getMonth(), s.getDate() + i, l.week_time.hour, l.week_time.minute), o.getTime() < s.getTime() && (i = 7 - e(s.getDay()) + l.week_day, o = new Date(s.getFullYear(), s.getMonth(), s.getDate() + i, l.week_time.hour, l.week_time.minute))) : "day" === l.type ? (o = new Date(s.getFullYear(), s.getMonth(), s.getDate(), l.day_time.hour, l.day_time.minute), o.getTime() < s.getTime() && (o = new Date(s.getFullYear(), s.getMonth(), s.getDate() + 1, l.day_time.hour, l.day_time.minute))) : "fake" === l.type && (a = [l.fake_days, l.fake_time.hour, l.fake_time.minute].join(":"), $.cookie(a) ? o = new Date(1 * $.cookie(a)) : (o = new Date(s.getFullYear(), s.getMonth(), s.getDate() + l.fake_days, s.getHours() + l.fake_time.hour, s.getMinutes() + l.fake_time.minute), $.cookie(a, o.getTime(), {
              expires: 365,
              path: "/"
            }))), t.countdown({until: o, layout: t.html()}), t.countdown("option", $.countdown.regionalOptions[n])
          } catch (r) {
            error_handler(r, "lib-countdown 3")
          }
        })
      } catch (t) {
      }
    })
  } catch (n) {
    error_handler(n, "lib-countdown 0")
  }
}.call(this);