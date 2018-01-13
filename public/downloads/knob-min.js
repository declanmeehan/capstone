var Knob;
(Knob = function(e, t) {
  var n = document.createElement("div");
  n.setAttribute("tabindex", 0),
    e.parentNode.replaceChild(n, e),
    (e.style.cssText = "position: absolute; top: -10000px"),
    e.setAttribute("tabindex", -1),
    n.appendChild(e);
  var r = (this.settings = this._getSettings(e));
  (this.value = e.value = r.min + r.range / 2),
    (this.input = e),
    (this.min = r.min),
    (this.ui = t);
  var i = {
    keydown: this._handleKeyEvents.bind(this),
    mousewheel: this._handleWheelEvents.bind(this),
    DOMMouseScroll: this._handleWheelEvents.bind(this),
    touchstart: this._handleMove.bind(this, "touchmove", "touchend"),
    mousedown: this._handleMove.bind(this, "mousemove", "mouseup")
  };
  for (var s in i) n.addEventListener(s, i[s], !1);
  (n.style.cssText =
    "position: relative; width:" +
    r.width +
    "px;" +
    "height:" +
    r.height +
    "px;"),
    t.init(n, r),
    (this.container = n),
    this.changed(0);
}),
  (Knob.prototype = {
    _handleKeyEvents: function(e) {
      var t = e.keyCode;
      if (t >= 37 && t <= 40) {
        e.preventDefault();
        var n = 1 + e.shiftKey * 9;
        this.changed({ 37: -1, 38: 1, 39: 1, 40: -1 }[t] * n);
      }
    },
    _handleWheelEvents: function(e) {
      e.preventDefault();
      var t = -e.detail || e.wheelDeltaX,
        n = -e.detail || e.wheelDeltaY,
        r = t > 0 || n > 0 ? 1 : t < 0 || n < 0 ? -1 : 0;
      this.changed(r);
    },
    _handleMove: function(e, t) {
      (this.centerX =
        Math.floor(this.container.getBoundingClientRect().left) +
        document.body.scrollLeft +
        this.settings.width / 2),
        (this.centerY =
          Math.floor(this.container.getBoundingClientRect().top) +
          document.body.scrollTop +
          this.settings.height / 2);
      var n = this._updateWhileMoving.bind(this),
        r = document.body;
      r.addEventListener(e, n, !1),
        r.addEventListener(
          t,
          function() {
            r.removeEventListener(e, n, !1);
          },
          !1
        );
    },
    _updateWhileMoving: function(e) {
      e.preventDefault();
      var t = e.changedTouches ? e.changedTouches[0] : e,
        n = this.centerX - t.pageX,
        r = this.centerY - t.pageY,
        i = Math.atan2(-r, -n) * 180 / Math.PI + 90 - this.settings.angleoffset,
        s;
      i < 0 && (i += 360),
        (i %= 360),
        i <= this.settings.anglerange
          ? (s = Math.max(Math.min(1, i / this.settings.anglerange), 0))
          : (s = +(
              i - this.settings.anglerange <
              (360 - this.settings.anglerange) / 2
            ));
      var o = this.settings.range,
        u = this.min + o * s,
        a = (this.settings.max - this.min) / o;
      (this.value = this.input.value = Math.round(u / a) * a),
        this.ui.update(s, this.value),
        this.triggerChange();
    },
    changed: function(e) {
      (this.input.value = this.limit(
        parseFloat(this.input.value) + e * (this.input.step || 1)
      )),
        (this.value = this.input.value),
        this.ui.update(this._valueToPercent(), this.value),
        this.triggerChange();
    },
    update: function(e) {
      (this.input.value = this.limit(e)),
        (this.value = this.input.value),
        this.ui.update(this._valueToPercent(), this.value),
        this.triggerChange();
    },
    triggerChange: function() {
      if (document.createEventObject) {
        var e = document.createEventObject();
        this.input.fireEvent("onchange", e);
      } else this.input.dispatchEvent(new Event("change"));
    },
    _valueToPercent: function() {
      return this.value != null
        ? 100 / this.settings.range * (this.value - this.min) / 100
        : this.min;
    },
    limit: function(e) {
      return Math.min(Math.max(this.settings.min, e), this.settings.max);
    },
    _getSettings: function(e) {
      var t;
      e.dataset.labels && (t = e.dataset.labels.split(","));
      var n = {
        max: t ? t.length - 1 : parseFloat(e.max),
        min: t ? 0 : parseFloat(e.min),
        step: parseFloat(e.step) || 1,
        angleoffset: 0,
        anglerange: 360,
        labels: t
      };
      n.range = n.max - n.min;
      var r = e.dataset;
      for (var i in r)
        if (r.hasOwnProperty(i) && i !== "labels") {
          var s = +r[i];
          n[i] = isNaN(s) ? r[i] : s;
        }
      return n;
    }
  });
var Ui = function() {};
(Ui.prototype = {
  init: function(e, t) {
    this.options || (this.options = {}),
      this.merge(this.options, t),
      (this.width = t.width),
      (this.height = t.height),
      this.createElement(e);
    if (!this.components) return;
    this.components.forEach(
      function(e) {
        e.init(this.el.node, t);
      }.bind(this)
    );
  },
  merge: function(e, t) {
    for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
    return e;
  },
  addComponent: function(e) {
    this.components || (this.components = []), this.components.push(e);
  },
  update: function(e, t) {
    if (!this.components) return;
    this.components.forEach(function(n) {
      n.update(e, t);
    });
  },
  createElement: function(e) {
    (this.el = new Ui.El(this.width, this.height)),
      this.el.create("svg", {
        version: "1.2",
        baseProfile: "tiny",
        width: this.width,
        height: this.height
      }),
      this.appendTo(e);
  },
  appendTo: function(e) {
    e.appendChild(this.el.node);
  }
}),
  (Ui.Pointer = function(e) {
    (this.options = e || {}),
      (this.options.type && Ui.El[this.options.type]) ||
        (this.options.type = "Triangle");
  }),
  (Ui.Pointer.prototype = Object.create(Ui.prototype)),
  (Ui.Pointer.prototype.update = function(e) {
    this.el.rotate(
      this.options.angleoffset + e * this.options.anglerange,
      this.width / 2,
      this.height / 2
    );
  }),
  (Ui.Pointer.prototype.createElement = function(e) {
    this.options.pointerHeight ||
      (this.options.pointerHeight = this.height / 2),
      this.options.type == "Arc"
        ? ((this.el = new Ui.El.Arc(this.options)),
          this.el.setAngle(this.options.size))
        : (this.el = new Ui.El[this.options.type](
            this.options.pointerWidth,
            this.options.pointerHeight,
            this.width / 2,
            this.options.pointerHeight / 2 + this.options.offset
          )),
      this.el.addClassName("pointer"),
      this.appendTo(e);
  }),
  (Ui.Arc = function(e) {
    this.options = e || {};
  }),
  (Ui.Arc.prototype = Object.create(Ui.prototype)),
  (Ui.Arc.prototype.createElement = function(e) {
    (this.el = new Ui.El.Arc(this.options)), this.appendTo(e);
  }),
  (Ui.Arc.prototype.update = function(e) {
    this.el.setAngle(e * this.options.anglerange);
  }),
  (Ui.Scale = function(e) {
    (this.options = this.merge(
      {
        steps: e.range / e.step,
        radius: this.width / 2,
        tickWidth: 1,
        tickHeight: 3
      },
      e
    )),
      (this.options.type = Ui.El[this.options.type || "Rect"]);
  }),
  (Ui.Scale.prototype = Object.create(Ui.prototype)),
  (Ui.Scale.prototype.createElement = function(e) {
    (this.el = new Ui.El(this.width, this.height)),
      (this.startAngle = this.options.angleoffset || 0),
      this.options.radius || (this.options.radius = this.height / 2.5),
      this.el.create("g"),
      this.el.addClassName("scale");
    if (this.options.drawScale && !this.options.labels) {
      var t = this.options.anglerange / this.options.steps,
        n = this.options.steps + (this.options.anglerange == 360 ? 0 : 1);
      this.ticks = [];
      var r = this.options.type;
      for (var i = 0; i < n; i++) {
        var s = new r(
          this.options.tickWidth,
          this.options.tickHeight,
          this.width / 2,
          this.options.tickHeight / 2
        );
        s.rotate(this.startAngle + i * t, this.width / 2, this.height / 2),
          this.el.append(s),
          this.ticks.push(s);
      }
    }
    this.appendTo(e), this.options.drawDial && this.dial();
  }),
  (Ui.Scale.prototype.dial = function() {
    var e = this.options.anglerange / this.options.steps,
      t = this.options.min,
      n = (this.options.max - t) / this.options.steps,
      r = this.options.steps + (this.options.anglerange == 360 ? 0 : 1);
    this.dials = [];
    if (!this.options.labels)
      for (var i = 0; i < r; i++) {
        var s = new Ui.El.Text(
          Math.abs(t + n * i),
          this.width / 2 - 2.5,
          this.height / 2 - this.options.radius,
          5,
          5
        );
        this.el.append(s),
          s.rotate(this.startAngle + i * e, this.width / 2, this.height / 2),
          this.dials.push(s);
      }
    else {
      e = this.options.anglerange / (this.options.labels.length - 1);
      for (var i = 0; i < this.options.labels.length; i++) {
        var o = this.options.labels[i],
          s = new Ui.El.Text(
            o,
            this.width / 2 - 2.5,
            this.height / 2 - this.options.radius,
            5,
            5
          );
        this.el.append(s),
          s.rotate(this.startAngle + i * e, this.width / 2, this.height / 2),
          s.attr("text-anchor", "middle"),
          this.dials.push(s);
      }
    }
  }),
  (Ui.Scale.prototype.update = function(e) {
    this.ticks &&
      (this.activeStep && this.activeStep.attr("class", ""),
      (this.activeStep = this.ticks[Math.round(this.options.steps * e)]),
      this.activeStep.attr("class", "active")),
      this.dials &&
        (this.activeDial && this.activeDial.attr("class", ""),
        (this.activeDial = this.dials[Math.round(this.options.steps * e)]),
        this.activeDial && this.activeDial.attr("class", "active"));
  }),
  (Ui.Text = function() {}),
  (Ui.Text.prototype = Object.create(Ui.prototype)),
  (Ui.Text.prototype.createElement = function(e) {
    (this.parentEl = e),
      (this.el = new Ui.El.Text("", 0, this.height)),
      this.appendTo(e),
      this.el.center(e);
  }),
  (Ui.Text.prototype.update = function(e, t) {
    (this.el.node.textContent = t), this.el.center(this.parentEl);
  }),
  (Ui.El = function() {}),
  (Ui.El.prototype = {
    svgNS: "http://www.w3.org/2000/svg",
    init: function(e, t, n, r) {
      (this.width = e),
        (this.height = t),
        (this.x = n || 0),
        (this.y = r || 0),
        (this.left = this.x - e / 2),
        (this.right = this.x + e / 2),
        (this.top = this.y - t / 2),
        (this.bottom = this.y + t / 2);
    },
    create: function(e, t) {
      this.node = document.createElementNS(this.svgNS, e);
      for (var n in t) this.attr(n, t[n]);
    },
    rotate: function(e, t, n) {
      this.attr(
        "transform",
        "rotate(" + e + " " + (t || this.x) + " " + (n || this.y) + ")"
      );
    },
    attr: function(e, t) {
      if (t == null) return this.node.getAttribute(e) || "";
      this.node.setAttribute(e, t);
    },
    append: function(e) {
      this.node.appendChild(e.node);
    },
    addClassName: function(e) {
      this.attr("class", this.attr("class") + " " + e);
    }
  }),
  (Ui.El.Triangle = function() {
    this.init.apply(this, arguments),
      this.create("polygon", {
        points:
          this.left +
          "," +
          this.bottom +
          " " +
          this.x +
          "," +
          this.top +
          " " +
          this.right +
          "," +
          this.bottom
      });
  }),
  (Ui.El.Triangle.prototype = Object.create(Ui.El.prototype)),
  (Ui.El.Rect = function() {
    this.init.apply(this, arguments),
      this.create("rect", {
        x: this.x - this.width / 2,
        y: this.y,
        width: this.width,
        height: this.height
      });
  }),
  (Ui.El.Rect.prototype = Object.create(Ui.El.prototype)),
  (Ui.El.Circle = function(e, t, n) {
    arguments.length == 4 && ((t = arguments[2]), (n = arguments[3])),
      this.init(e * 2, e * 2, t, n),
      this.create("circle", { cx: this.x, cy: this.y, r: e });
  }),
  (Ui.El.Circle.prototype = Object.create(Ui.El.prototype)),
  (Ui.El.Text = function(e, t, n, r, i) {
    this.create("text", { x: t, y: n, width: r, height: i }),
      (this.node.textContent = e);
  }),
  (Ui.El.Text.prototype = Object.create(Ui.El.prototype)),
  (Ui.El.Text.prototype.center = function(e) {
    var t = e.getAttribute("width"),
      n = e.getAttribute("height");
    this.attr("x", t / 2 - this.node.getBBox().width / 2),
      this.attr("y", n / 2 + this.node.getBBox().height / 4);
  }),
  (Ui.El.Arc = function(e) {
    (this.options = e),
      (this.options.angleoffset =
        (e.angleoffset || 0) - (this.options.labels ? 0 : 90)),
      this.create("path");
  }),
  (Ui.El.Arc.prototype = Object.create(Ui.El.prototype)),
  (Ui.El.Arc.prototype.setAngle = function(e) {
    this.attr("d", this.getCoords(e));
  }),
  (Ui.El.Arc.prototype.getCoords = function(e) {
    function p(e, t) {
      return { x: o + e * Math.cos(t), y: o + e * Math.sin(t) };
    }
    var t = this.options.angleoffset,
      n = this.options.outerRadius || this.options.width / 2,
      r =
        this.options.innerRadius ||
        this.options.width / 2 - this.options.arcWidth,
      i = Math.PI * t / 180,
      s = Math.PI * (t + e) / 180,
      o = this.options.width / 2,
      u = p(n, s),
      a = p(n, i),
      f = p(r, i),
      l = p(r, s),
      c = "M" + u.x + "," + u.y,
      h = e < 180 ? 0 : 1;
    return (
      (c += " A" + n + "," + n + " 0 " + h + " 0 " + a.x + "," + a.y),
      (c += "L" + f.x + "," + f.y),
      (c += " A" + r + "," + r + " 0 " + h + " 1 " + l.x + "," + l.y),
      (c += "L" + u.x + "," + u.y),
      c
    );
  });
