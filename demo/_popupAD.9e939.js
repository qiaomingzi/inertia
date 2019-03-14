define("qdm/js/common/page/merge.435d1.js", [], function(require, exports, module) {
    var strategys = {
        cover: function(parentVal, childVal) {
            return childVal === undefined ? parentVal : childVal;
        },
        merge: function(parentVal, childVal) {
            if (childVal) {
                if (parentVal) {
                    return parentVal.concat(childVal);
                }
                return Array.isArray(childVal) ? childVal : [ childVal ];
            }
            return parentVal;
        }
    };
    var mergeItems = [ "init" ];
    var base = {
        _call: function(name) {
            var handlers = this["_" + name];
            if (handlers) {
                for (var i = 0, n = handlers.length; i < n; i++) {
                    handlers[i].call(this);
                }
            }
        }
    };
    function merge(parent, child) {
        var options = {};
        if (child.mixins) {
            child.mixins.forEach(function(mixin) {
                parent = merge(parent, mixin);
            });
        }
        function mergeField(key) {
            var strategy = mergeItems.indexOf(key) > -1 ? strategys.merge : strategys.cover;
            options[key] = strategy(parent[key], child[key]);
        }
        Object.keys(parent).forEach(mergeField);
        Object.keys(child).forEach(mergeField);
        return options;
    }
    exports = module.exports = function(options) {
        options = options || {};
        var page = merge(base, options);
        mergeItems.forEach(function(key) {
            page["_" + key] = page[key];
            page[key] = function() {
                this._call(key);
            };
        });
        return page;
    };
});define("qdm/js/common/mixin/lazyLoad.54931.js", [ "lib.Zepto", "qdm/js/common/components/LazyLoad.b284f.js" ], function(require, exports, module) {
    var $ = require("lib.Zepto");
    require("qdm/js/common/components/LazyLoad.b284f.js");
    exports = module.exports = {
        scrollerSelector: null,
        init: function() {
            this.initLazyLoad();
        },
        initLazyLoad: function() {
            var scrollerSelector = this.scrollerSelector || window;
            $(scrollerSelector).lazyLoad();
        },
        updateLazyLoad: function() {
            var scrollerSelector = this.scrollerSelector || window;
            $(scrollerSelector).trigger("scroll");
        }
    };
});(function(global, factory) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = factory();
    } else if (typeof define === "function" && (define.amd || define.cmd)) {
        define("qdm/js/common/components/Aside.6dba4.js", [], factory);
    } else {
        global.Aside = factory();
    }
})(this, function() {
    "use strict";
    var $ = window.Zepto;
    var ACTIVE = "active";
    var Aside;
    $.fn.aside = function(options) {
        if (!this.$aside) {
            this.$aside = new Aside(this, options);
        }
    };
    Aside = function(el, options) {
        var defaults = {
            scrollable: ".scrollable",
            onInit: function() {},
            onShow: function() {},
            onHide: function() {},
            onScroll: function() {}
        };
        var elTrigger = $(el);
        var elBody = $(document.body);
        if (elTrigger.length === 0) return;
        var params = $.extend({}, defaults, options);
        var idAside = el.data("rel");
        var elAside = $("#" + idAside);
        var isActive = function() {
            return location.hash.replace("#&", "") === idAside;
        };
        var self = this;
        self.el = {
            trigger: elTrigger,
            aside: elAside,
            overlay: elAside.find(".aside-overlay"),
            content: elAside.find(".aside-content")
        };
        self.callback = {
            init: params.onInit,
            show: params.onShow,
            hide: params.onHide,
            scroll: params.onScroll
        };
        self.title = elTrigger.attr("title");
        elTrigger.attr({
            role: "button",
            "aria-haspopup": "true"
        });
        elTrigger.on("click", function(event) {
            event.preventDefault();
            self.show(this.href);
        });
        elAside.prependTo(elBody);
        self.el.overlay.on("click", function() {
            self.hide();
        }).on("touchmove", function(event) {
            event.preventDefault();
        }).attr({
            role: "button"
        });
        self.scrollable(params.scrollable);
        self.swipeOut(params.scrollable);
        if (isActive()) {
            self.show();
        }
        window.addEventListener("popstate", function() {
            if (isActive()) {
                self.show();
            } else {
                self.hide(true);
            }
        });
    };
    Aside.prototype.show = function(hash) {
        var self = this;
        var el = self.el, callback = self.callback;
        var elTrigger = el.trigger;
        var elAside = el.aside;
        if (elAside.hasClass(ACTIVE)) {
            return;
        }
        elAside.addClass(ACTIVE);
        el.overlay.attr("title", "点击关闭浮层");
        elTrigger.attr("title", "浮层已显示");
        if (!elTrigger.data("init")) {
            elTrigger.data("init", true);
            callback.init.call(self);
        }
        $("html").addClass("noscroll");
        callback.show.call(self);
        if (history.pushState && hash) {
            history.pushState(null, null, hash);
        }
    };
    Aside.prototype.hide = function(isFromPopState) {
        var self = this;
        var el = self.el, callback = self.callback;
        var elTrigger = el.trigger;
        var elAside = el.aside;
        $("html").removeClass("noscroll");
        if (!elAside.hasClass(ACTIVE)) {
            return;
        }
        elAside.removeClass(ACTIVE);
        el.overlay.attr("title", "浮层已关闭");
        elTrigger.attr("title", self.title);
        callback.hide.call(self);
        if (history.pushState && !isFromPopState) {
            var href = location.href.split("#")[0];
            history.go(-1);
            setTimeout(function() {
                history.replaceState(null, null, href);
            }, 0);
        }
    };
    Aside.prototype.scrollable = function(selectorScrollable) {
        var self = this;
        var elAside = self.el.aside;
        if (!selectorScrollable || elAside.data("isBindScroll")) {
            return self;
        }
        var isSBBrowser = /mx\d.*mqqbrowser/i.test(navigator.userAgent);
        var data = {
            posY: 0,
            maxscroll: 0
        };
        elAside.on("touchstart", selectorScrollable, function(event) {
            var events = event.touches[0] || event;
            data.elScroll = $(this);
            data.posY = events.pageY;
            data.scrollY = data.elScroll.scrollTop();
            data.maxscroll = this.scrollHeight - this.clientHeight;
        });
        elAside.on("touchmove", function(event) {
            if (data.maxscroll <= 0 || isSBBrowser) {
                event.preventDefault();
            }
            var elScroll = data.elScroll;
            var scrollTop = elScroll.scrollTop();
            var events = event.touches[0] || event;
            var distanceY = events.pageY - data.posY;
            if (isSBBrowser) {
                elScroll.scrollTop(data.scrollY - distanceY);
                elScroll.trigger("scroll");
                return;
            }
            if (distanceY > 0 && scrollTop == 0) {
                event.preventDefault();
                return;
            }
            if (distanceY < 0 && scrollTop + 1 >= data.maxscroll) {
                event.preventDefault();
                return;
            }
            self.callback.scroll.call(self, elScroll);
        });
        elAside.data("isBindScroll", true);
    };
    Aside.prototype.swipeOut = function(selectorScrollable) {
        var self = this;
        var elAside = self.el.aside;
        var elContent = self.el.content;
        var data = {};
        elContent.on("touchstart", function(event) {
            var events = event.touches[0] || event;
            data.posX = events.pageX;
            data.distanceX = 0;
            if (data.transition) {
                return;
            }
            elContent.css({
                "-webkit-transition": "none",
                transition: "none"
            });
            var target = event.target, elTarget = $(target);
            var elScroll = elTarget.parents(selectorScrollable);
            if (elTarget.is(selectorScrollable)) {
                elScroll = elTarget;
            }
            if (elScroll.length && elScroll[0].scrollHeight > elScroll[0].clientHeight) {
                data.moving = false;
                return;
            }
            data.moving = true;
        });
        elAside.on("touchmove", function(event) {
            var events = event.touches[0] || event;
            var distanceX = events.pageX - data.posX;
            data.distanceX = distanceX;
            if (distanceX < 0) {
                distanceX = 0;
            }
            if (!data.moving) {
                return;
            }
            elContent.css({
                "-webkit-transform": "translateX(" + distanceX + "px)",
                transform: "translateX(" + distanceX + "px)"
            });
            event.preventDefault();
        });
        elAside.on("touchend", function() {
            elContent.css({
                "-webkit-transition": "",
                transition: ""
            });
            if (!data.moving) {
                return;
            }
            data.transition = true;
            if (data.distanceX > 100) {
                self.hide();
                elContent.css({
                    "-webkit-transform": "translateX(100%)",
                    transform: "translateX(100%)"
                });
            } else {
                elContent.css({
                    "-webkit-transform": "translateX(0)",
                    transform: "translateX(0)"
                });
            }
            setTimeout(function() {
                elContent.css({
                    "-webkit-transform": "",
                    transform: ""
                });
                delete data.transition;
            }, 151);
            data.moving = false;
        });
        return self;
    };
    return Aside;
});(function(global, factory) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = factory();
    } else if (typeof define === "function" && (define.amd || define.cmd)) {
        define("qdm/js/common/components/Tab.2becb.js", [], factory);
    } else {
        global.Tab = factory();
    }
})(this, function(require) {
    "use strict";
    var url;
    if (typeof require == "function") {
        url = require("qdm/js/common/utils/url.fd98a.js");
    }
    var STATE = "active", ARIASELECTED = "aria-selected";
    var Tab;
    $.fn.tab = function(options) {
        new Tab($(this), options);
    };
    $.fn.eqAttr = function(key) {
        key = key || "data-rel";
        var value = $(this).attr(key);
        if (!value) return $();
        var target = $("#" + value);
        if (target.length) return target;
        return $("." + value);
    };
    Tab = function(el, options) {
        var container = $(), line = $();
        el = $(el);
        if (el.length === 0) {
            return;
        }
        options = options || {};
        var defaults = {
            eventType: "click",
            history: "auto",
            prepend: "auto",
            index: "auto",
            aria: "a",
            callback: function() {}
        };
        var params = $.extend({}, defaults, options);
        if (el.length == 1 && el.is("a") == false) {
            container = el;
            el = container.find("a");
            if (params.history == "auto") {
                params.history = true;
            }
            if (params.prepend == "auto") {
                params.prepend = true;
                line = $("<line></line>");
                container.prepend(line);
            }
        }
        var self = this;
        self.callback = function(elTab) {
            if (params.history === true && history.pushState) {
                var key = "tab", value = elTab.attr("data-rel");
                if (value) {
                    history.replaceState(null, document.title, url.setParam(key, value.toLowerCase()));
                }
            }
            if (line.length) {
                line.css({
                    width: elTab.width(),
                    left: elTab.position().left
                });
            }
            params.callback.apply(this, arguments);
        };
        var elAria = el.closest(params.aria).attr("role", "tab");
        var indexTab = params.index;
        el.each(function(index) {
            if (typeof indexTab !== "number" && $(this).hasClass(STATE)) {
                indexTab = index;
            }
            $(this).data("index", index);
        });
        if (typeof indexTab !== "number") {
            indexTab = 0;
        }
        el.on(params.eventType, function(event) {
            var targetTab = $(this);
            var resetTab;
            var resetPanel, targetPanel;
            if (targetTab.hasClass(STATE)) {
                if (event.isTrusted === false || event.hasOwnProperty("_args")) {
                    elAria.attr(ARIASELECTED, "false");
                    targetTab.closest(params.aria).attr(ARIASELECTED, "true");
                    self.callback.call(this, targetTab, $(), $(), $());
                }
                return;
            }
            resetTab = el.eq(indexTab).removeClass(STATE);
            elAria.eq(indexTab).attr(ARIASELECTED, "false");
            targetTab.addClass(STATE);
            targetTab.closest(params.aria).attr(ARIASELECTED, "true");
            resetPanel = resetTab.eqAttr().removeClass(STATE);
            targetPanel = targetTab.eqAttr().addClass(STATE);
            indexTab = targetTab.data("index");
            self.callback.call(this, targetTab, resetTab, targetPanel, resetPanel);
        });
        $(function() {
            el.eq(indexTab).trigger(params.eventType);
        });
        self.el = {
            tab: el
        };
        self.params = params;
    };
    return Tab;
});(function(global, factory) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = factory();
    } else if (typeof define === "function" && (define.amd || define.cmd)) {
        define("qdm/js/common/components/Swipe.ca9f7.js", [], factory);
    } else {
        global.Swipe = factory();
    }
})(this, function() {
    "use strict";
    function Swipe(container, options) {
        "use strict";
        var noop = function() {};
        var offloadFn = function(fn) {
            setTimeout(function() {
                (fn || noop)();
            }, 0);
        };
        var browser = {
            addEventListener: !!window.addEventListener,
            touch: "ontouchstart" in window,
            transitions: true
        };
        if (!container) return;
        var element = container.children[0];
        var slides;
        var slidePos;
        var width;
        var length;
        options = options || {};
        var index = parseInt(options.startSlide, 10) || 0;
        var speed = options.speed || 300;
        options.continuous = options.continuous !== undefined ? options.continuous : true;
        var animate;
        var begin;
        var circle;
        var move;
        function setup() {
            slides = element.children;
            length = slides.length;
            if (slides.length < 2) options.continuous = false;
            if (browser.transitions && options.continuous && slides.length < 3) {
                element.appendChild(slides[0].cloneNode(true));
                element.appendChild(element.children[1].cloneNode(true));
                slides = element.children;
            }
            slidePos = new Array(slides.length);
            width = container.getBoundingClientRect().width || container.offsetWidth;
            element.style.width = slides.length * width + "px";
            var pos = slides.length;
            while (pos) {
                pos -= 1;
                var myslide = slides[pos];
                myslide.style.width = width + "px";
                myslide.setAttribute("data-index", pos);
                if (browser.transitions) {
                    myslide.style.left = pos * -width + "px";
                    var posWidth = 0;
                    if (index < pos) {
                        posWidth = width;
                    } else if (index > pos) {
                        posWidth = -width;
                    }
                    move(pos, posWidth, 0);
                }
            }
            if (options.continuous && browser.transitions) {
                move(circle(index - 1), -width, 0);
                move(circle(index + 1), width, 0);
            }
            if (!browser.transitions) element.style.left = index * -width + "px";
            container.style.visibility = "visible";
        }
        circle = function(cureent) {
            return (slides.length + cureent % slides.length) % slides.length;
        };
        function translate(current, dist, time) {
            var slideThis = slides[current];
            var style = slideThis && slideThis.style;
            if (!style) return;
            style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = time + "ms";
            style.webkitTransform = "translate(" + dist + "px,0) translateZ(0)";
            style.msTransform = style.MozTransform = style.OTransform = "translateX(" + dist + "px)";
        }
        move = function(current, dist, time) {
            translate(current, dist, time);
            slidePos[current] = dist;
        };
        var delay = options.auto || 0;
        var interval;
        animate = function(from, to, speeds) {
            if (!speeds) {
                element.style.left = to + "px";
                return;
            }
            var start = +new Date();
            var timer = setInterval(function() {
                var timeElap = +new Date() - start;
                if (timeElap > speeds) {
                    element.style.left = to + "px";
                    if (delay) {
                        begin();
                    }
                    if (options.transitionEnd) {
                        options.transitionEnd.call(event, index, slides[index]);
                    }
                    clearInterval(timer);
                    return;
                }
                element.style.left = (to - from) * (Math.floor(timeElap / speeds * 100) / 100) + from + "px";
            }, 4);
        };
        function slide(to, slideSpeed) {
            if (index === to) return;
            if (browser.transitions) {
                var direction = Math.abs(index - to) / (index - to);
                if (options.continuous) {
                    var naturalDirection = direction;
                    direction = -slidePos[circle(to)] / width;
                    if (direction !== naturalDirection) {
                        to = -direction * slides.length + to;
                    }
                }
                var diff = Math.abs(index - to) - 1;
                while (diff) {
                    diff -= 1;
                    move(circle((to > index ? to : index) - diff - 1), width * direction, 0);
                }
                to = circle(to);
                move(index, width * direction, slideSpeed || speed);
                move(to, 0, slideSpeed || speed);
                if (options.continuous) {
                    move(circle(to - direction), -(width * direction), 0);
                }
            } else {
                to = circle(to);
                animate(index * -width, to * -width, slideSpeed || speed);
            }
            index = to;
            offloadFn(options.callback && options.callback(index, slides[index]));
        }
        function prev() {
            if (options.continuous) slide(index - 1); else if (index) slide(index - 1);
        }
        function next() {
            if (options.continuous) slide(index + 1); else if (index < slides.length - 1) slide(index + 1);
        }
        begin = function() {
            clearTimeout(interval);
            interval = setTimeout(next, delay);
        };
        function stop() {
            clearTimeout(interval);
            interval = null;
        }
        var start = {};
        var delta = {};
        var isScrolling;
        var events = {
            handleEvent: function(event) {
                switch (event.type) {
                  case "touchstart":
                    this.start(event);
                    break;

                  case "touchmove":
                    this.move(event);
                    break;

                  case "touchend":
                    offloadFn(this.end(event));
                    break;

                  case "webkitTransitionEnd":
                  case "msTransitionEnd":
                  case "oTransitionEnd":
                  case "otransitionend":
                  case "transitionend":
                    offloadFn(this.transitionEnd(event));
                    break;

                  case "resize":
                    offloadFn(setup);
                    break;

                  default:
                    break;
                }
                if (options.stopPropagation) event.stopPropagation();
            },
            start: function(event) {
                var touches = event.touches[0];
                start = {
                    x: touches.pageX,
                    y: touches.pageY,
                    time: +new Date()
                };
                isScrolling = undefined;
                delta = {};
                element.addEventListener("touchmove", this, false);
                element.addEventListener("touchend", this, false);
            },
            move: function(event) {
                if (event.touches.length > 1 || event.scale && event.scale !== 1) {
                    return;
                }
                if (options.disableScroll) {
                    event.preventDefault();
                }
                var touches = event.touches[0];
                delta = {
                    x: touches.pageX - start.x,
                    y: touches.pageY - start.y
                };
                if (typeof isScrolling === "undefined") {
                    isScrolling = !!(isScrolling || Math.abs(delta.x) < Math.abs(delta.y));
                }
                if (!isScrolling) {
                    event.preventDefault();
                    stop();
                    if (options.continuous) {
                        translate(circle(index - 1), delta.x + slidePos[circle(index - 1)], 0);
                        translate(index, delta.x + slidePos[index], 0);
                        translate(circle(index + 1), delta.x + slidePos[circle(index + 1)], 0);
                    } else {
                        var deltaX = delta.x / (!index && delta.x > 0 || index === slides.length - 1 && delta.x < 0 ? Math.abs(delta.x) / width + 1 : 1);
                        delta.x = deltaX;
                        translate(index - 1, delta.x + slidePos[index - 1], 0);
                        translate(index, delta.x + slidePos[index], 0);
                        translate(index + 1, delta.x + slidePos[index + 1], 0);
                    }
                }
            },
            end: function() {
                var duration = +new Date() - start.time;
                var isValidSlide = Number(duration) < 250 && Math.abs(delta.x) > 20 || Math.abs(delta.x) > width / 2;
                var isPastBounds = !index && delta.x > 0 || index === slides.length - 1 && delta.x < 0;
                if (options.continuous) {
                    isPastBounds = false;
                }
                var direction = delta.x < 0;
                if (!isScrolling) {
                    if (isValidSlide && !isPastBounds) {
                        if (direction) {
                            if (options.continuous) {
                                move(circle(index - 1), -width, 0);
                                move(circle(index + 2), width, 0);
                            } else {
                                move(index - 1, -width, 0);
                            }
                            move(index, slidePos[index] - width, speed);
                            move(circle(index + 1), slidePos[circle(index + 1)] - width, speed);
                            index = circle(index + 1);
                        } else {
                            if (options.continuous) {
                                move(circle(index + 1), width, 0);
                                move(circle(index - 2), -width, 0);
                            } else {
                                move(index + 1, width, 0);
                            }
                            move(index, slidePos[index] + width, speed);
                            move(circle(index - 1), slidePos[circle(index - 1)] + width, speed);
                            index = circle(index - 1);
                        }
                        if (options.callback) {
                            options.callback(index, slides[index]);
                        }
                    } else if (options.continuous) {
                        move(circle(index - 1), -width, speed);
                        move(index, 0, speed);
                        move(circle(index + 1), width, speed);
                    } else {
                        move(index - 1, -width, speed);
                        move(index, 0, speed);
                        move(index + 1, width, speed);
                    }
                }
                element.removeEventListener("touchmove", events, false);
                element.removeEventListener("touchend", events, false);
            },
            transitionEnd: function(event) {
                if (parseInt(event.target.getAttribute("data-index"), 10) === index) {
                    if (delay) begin();
                    if (options.transitionEnd) {
                        options.transitionEnd.call(event, index, slides[index]);
                    }
                }
            }
        };
        setup();
        if (delay) begin();
        if (browser.addEventListener) {
            if (browser.touch) element.addEventListener("touchstart", events, false);
            if (browser.transitions) {
                element.addEventListener("webkitTransitionEnd", events, false);
                element.addEventListener("msTransitionEnd", events, false);
                element.addEventListener("oTransitionEnd", events, false);
                element.addEventListener("otransitionend", events, false);
                element.addEventListener("transitionend", events, false);
            }
            window.addEventListener("resize", events, false);
        } else {
            window.onresize = function() {
                setup();
            };
        }
        return {
            setup: function() {
                setup();
            },
            slide: function(to, speed2) {
                stop();
                slide(to, speed2);
            },
            prev: function() {
                stop();
                prev();
            },
            next: function() {
                stop();
                next();
            },
            stop: function() {
                stop();
            },
            getPos: function() {
                return index;
            },
            getNumSlides: function() {
                return length;
            },
            kill: function() {
                stop();
                element.style.width = "";
                element.style.left = "";
                var pos = slides.length;
                while (pos) {
                    pos -= 1;
                    var slideThis = slides[pos];
                    slideThis.style.width = "";
                    slideThis.style.left = "";
                    if (browser.transitions) translate(pos, 0, 0);
                }
                if (browser.addEventListener) {
                    element.removeEventListener("touchstart", events, false);
                    element.removeEventListener("webkitTransitionEnd", events, false);
                    element.removeEventListener("transitionend", events, false);
                    window.removeEventListener("resize", events, false);
                } else {
                    window.onresize = null;
                }
            }
        };
    }
    return Swipe;
});(function(global, factory) {
    if (typeof define === "function" && (define.amd || define.cmd)) {
        define("qdm/js/common/components/hScroll.a7d3b.js", [], factory);
    } else {
        golbal.hScroll = factory();
    }
})(this, function() {
    "use strict";
    var data = {
        touching: false,
        scrollLeft: 0
    };
    var hScroll = function(selector) {
        var isIPhone = /iphone/i.test(navigator.userAgent);
        if (document.androidHscroll) {
            return;
        }
        var elTarget = $(selector);
        if (elTarget.length) {
            elTarget.attr({
                role: "listbox",
                title: "水平列表"
            });
            if (elTarget[0].clientWidth < elTarget[0].scrollWidth) {
                elTarget[0].title = elTarget[0].title + "，可水平滚动";
            }
        }
        document.androidHscroll = true;
        if (typeof selector !== "string" || isIPhone === true) {
            return;
        }
        $("body").on("touchstart", selector, function(event) {
            var events = event.touches[0] || event;
            data.posX = events.pageX;
            data.posY = events.pageY;
            data.scrollLeft = $(this).scrollLeft();
            data.target = $(this);
            data.touching = true;
        });
        document.addEventListener("touchmove", function(event) {
            if (data.touching !== true) {
                return;
            }
            var events = event.touches[0] || event;
            data.nowX = events.pageX;
            data.nowY = events.pageY;
            var distanceX = data.nowX - data.posX;
            var distanceY = data.nowY - data.posY;
            if (Math.abs(distanceY) < Math.abs(distanceX)) {
                event.preventDefault();
            }
            var distanceX = data.nowX - data.posX;
            if (distanceX && data.target) {
                data.target.scrollLeft(data.scrollLeft - distanceX);
            }
        });
        document.addEventListener("touchend", function(event) {
            data.touching = false;
            data.target = null;
        });
    };
    return hScroll;
});(function(global, factory) {
    if (typeof define === "function" && (define.amd || define.cmd)) {
        define("qdm/js/common/components/Inertia.dedc0.js", [], factory);
    } else {
        global.Inertia = factory();
    }
})(this, function() {
    "use strict";
    var Inertia = function(ele, options) {
        var defaults = {
            edge: true
        };
        var params = {};
        options = options || {};
        for (var key in defaults) {
            if (typeof options[key] !== "undefined") {
                params[key] = options[key];
            } else {
                params[key] = defaults[key];
            }
        }
        var data = {
            distanceX: 0,
            distanceY: 0
        };
        var win = window;
        var winWidth = win.innerWidth;
        var winHeight = win.innerHeight;
        if (!ele) {
            return;
        }
        this.ele = ele;
        this.win = win;
        var fnTranslate = function(x, y) {
            x = Math.round(1e3 * x) / 1e3;
            y = Math.round(1e3 * y) / 1e3;
            ele.style.webkitTransform = "translate(" + [ x + "px", y + "px" ].join(",") + ")";
            ele.style.transform = "translate3d(" + [ x + "px", y + "px", 0 ].join(",") + ")";
        };
        var strStoreDistance = this.getPosition();
        if (strStoreDistance) {
            var arrStoreDistance = strStoreDistance.split(",");
            ele.distanceX = +arrStoreDistance[0];
            ele.distanceY = +arrStoreDistance[1];
            fnTranslate(ele.distanceX, ele.distanceY);
        }
        ele.style.visibility = "visible";
        var initBound = ele.getBoundingClientRect();
        if (initBound.left < -.5 * initBound.width || initBound.top < -.5 * initBound.height || initBound.right > winWidth + .5 * initBound.width || initBound.bottom > winHeight + .5 * initBound.height) {
            ele.distanceX = 0;
            ele.distanceY = 0;
            fnTranslate(0, 0);
        }
        ele.addEventListener("touchstart", function(event) {
            var events = event.touches[0] || event;
            data.posX = events.pageX;
            data.posY = events.pageY;
            data.touching = true;
            if (ele.distanceX) {
                data.distanceX = ele.distanceX;
            }
            if (ele.distanceY) {
                data.distanceY = ele.distanceY;
            }
            data.bound = ele.getBoundingClientRect();
            data.timerready = true;
        });
        var easeOutBounce = function(t, b, c, d) {
            if ((t /= d) < 1 / 2.75) {
                return c * 7.5625 * t * t + b;
            } else if (t < 2 / 2.75) {
                return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
            } else if (t < 2.5 / 2.75) {
                return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
            }
        };
        document.addEventListener("touchmove", function(event) {
            if (data.touching !== true) {
                return;
            }
            if (data.timerready == true) {
                data.timerstart = +new Date();
                data.timerready = false;
            }
            event.preventDefault();
            var events = event.touches[0] || event;
            data.nowX = events.pageX;
            data.nowY = events.pageY;
            var distanceX = data.nowX - data.posX, distanceY = data.nowY - data.posY;
            var absLeft = data.bound.left + distanceX, absTop = data.bound.top + distanceY, absRight = absLeft + data.bound.width, absBottom = absTop + data.bound.height;
            if (absLeft < 0) {
                distanceX = distanceX - absLeft;
            }
            if (absTop < 0) {
                distanceY = distanceY - absTop;
            }
            if (absRight > winWidth) {
                distanceX = distanceX - (absRight - winWidth);
            }
            if (absBottom > winHeight) {
                distanceY = distanceY - (absBottom - winHeight);
            }
            var x = data.distanceX + distanceX, y = data.distanceY + distanceY;
            fnTranslate(x, y);
            ele.distanceX = x;
            ele.distanceY = y;
        }, {
            passive: false
        });
        document.addEventListener("touchend", function() {
            if (data.touching === false) {
                return;
            }
            data.touching = false;
            data.timerend = +new Date();
            if (!data.nowX || !data.nowY) {
                return;
            }
            var distanceX = data.nowX - data.posX, distanceY = data.nowY - data.posY;
            if (Math.abs(distanceX) < 5 && Math.abs(distanceY) < 5) {
                return;
            }
            var distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY), time = data.timerend - data.timerstart;
            var speed = distance / time * 16.666;
            var rate = Math.min(10, speed);
            data.inertiaing = true;
            var reverseX = 1, reverseY = 1;
            var step = function() {
                if (data.touching == true) {
                    data.inertiaing = false;
                    return;
                }
                speed = speed - speed / rate;
                var moveX = reverseX * speed * distanceX / distance, moveY = reverseY * speed * distanceY / distance;
                var bound = ele.getBoundingClientRect();
                if (moveX < 0 && bound.left + moveX < 0) {
                    moveX = 0 - bound.left;
                    reverseX = reverseX * -1;
                } else if (moveX > 0 && bound.right + moveX > winWidth) {
                    moveX = winWidth - bound.right;
                    reverseX = reverseX * -1;
                }
                if (moveY < 0 && bound.top + moveY < 0) {
                    moveY = -1 * bound.top;
                    reverseY = -1 * reverseY;
                } else if (moveY > 0 && bound.bottom + moveY > winHeight) {
                    moveY = winHeight - bound.bottom;
                    reverseY = -1 * reverseY;
                }
                var x = ele.distanceX + moveX, y = ele.distanceY + moveY;
                fnTranslate(x, y);
                ele.distanceX = x;
                ele.distanceY = y;
                if (speed < .1) {
                    speed = 0;
                    if (params.edge == false) {
                        data.inertiaing = false;
                        if (win.localStorage) {
                            localStorage["Inertia_" + ele.id] = [ x, y ].join();
                        }
                    } else {
                        edge();
                    }
                } else {
                    requestAnimationFrame(step);
                }
            };
            var edge = function() {
                var start = 0, during = 25;
                var init = ele.distanceX, y = ele.distanceY, change = 0;
                var bound = ele.getBoundingClientRect();
                if (bound.left + bound.width / 2 < winWidth / 2) {
                    change = -1 * bound.left;
                } else {
                    change = winWidth - bound.right;
                }
                var run = function() {
                    if (data.touching == true) {
                        data.inertiaing = false;
                        return;
                    }
                    start++;
                    var x = easeOutBounce(start, init, change, during);
                    fnTranslate(x, y);
                    if (start < during) {
                        requestAnimationFrame(run);
                    } else {
                        ele.distanceX = x;
                        ele.distanceY = y;
                        data.inertiaing = false;
                        if (win.localStorage) {
                            localStorage["Inertia_" + ele.id] = [ x, y ].join();
                        }
                    }
                };
                run();
            };
            step();
        });
    };
    Inertia.prototype.getPosition = function() {
        var ele = this.ele;
        if (ele.id && this.win.localStorage && localStorage["Inertia_" + ele.id]) {
            return localStorage["Inertia_" + ele.id];
        } else {
            return "";
        }
    };
    return Inertia;
});define("qdm/js/common/store/recentlyRead.b5fcf.js", [ "qdm/js/common/utils/date.65910.js", "qdm/js/common/utils/Storage.352e8.js" ], function(require, exports, module) {
    var DateUtil = require("qdm/js/common/utils/date.65910.js");
    var Storage = require("qdm/js/common/utils/Storage.352e8.js");
    var RECENTLY_READ = "RECENTLY_READ";
    function getBooks() {
        var books = Storage.get(RECENTLY_READ);
        return Array.isArray(books) ? books : [];
    }
    exports = module.exports = {
        getBooks: function() {
            var books = getBooks();
            if (!Array.isArray(books)) {
                return [];
            }
            return books.map(function(book) {
                book.datetime = book.time === -1 ? "2016-12-29" : DateUtil.format(book.time, "YYYY-MM-DD");
                book.time = book.time === -1 ? "12.29前" : DateUtil.toNow(book.time);
                return book;
            });
        },
        addBook: function(book, chapter) {
            var books = getBooks();
            for (var i = 0, n = books.length; i < n; i++) {
                if (+books[i].bid === +book.bookId) {
                    books.splice(i, 1);
                    break;
                }
            }
            books.unshift({
                bid: book.bookId,
                bName: book.bookName,
                cid: chapter.chapterId,
                cName: chapter.chapterName,
                aid: book.authorId,
                aName: book.authorName,
                time: new Date().getTime()
            });
            Storage.set(RECENTLY_READ, books.slice(0, 20));
        },
        syncBooks: function(oldBooks) {
            var books = getBooks();
            oldBooks.forEach(function(book) {
                for (var i = 0, n = books.length; i < n; i++) {
                    if (+books[i].bid === +book.bookId) {
                        return;
                    }
                }
                books.push({
                    bid: book.bookId,
                    bName: book.bookName,
                    cid: book.chapterId,
                    cName: book.chapterName,
                    aid: book.authorId,
                    aName: book.authorName,
                    time: -1
                });
            });
            Storage.set(RECENTLY_READ, books.slice(0, 20));
        }
    };
});define("qdm/js/homepage/_popupAD.9e939.js", [ "lib.Zepto", "util.Cookie" ], function(require, exports, module) {
    var $ = require("lib.Zepto");
    var Cookie = require("util.Cookie");
    var tpl = function(imgSrc, link) {
        return [ '<div class="panel-container pop-up-a-d">', '<div class="inner">', '<a href="', link, '"><img class="img" src="', imgSrc, '"></a>', '<i class="close"><svg class="icon icon-remove center"><use xlink:href="#icon-remove"></use></svg></i>', "</div>", "</div>" ].join("");
    };
    exports = module.exports = function() {
        var cookieKey = "m_pop_up_a_d";
        var popDate = Cookie.get(cookieKey);
        var curDate = new Date().getDate();
        if (Date.now() < 15119784e5 && (!popDate || popDate != curDate)) {
            $("body").append(tpl("https://qidian.gtimg.com/qdm/img/pop-up-a-d.ca6a1.jpg", "https://wj.qq.com/s/1707155/4aa9"));
            $(".pop-up-a-d").on("click", ".close", function() {
                $(".pop-up-a-d").off("click").remove();
            });
            Cookie.set(cookieKey, curDate, "qidian.com", "/", 24 * 60 * 60 * 1e3);
        }
    };
});