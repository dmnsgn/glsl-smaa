/* Font Face Observer v3.3.1 - © Bram Stein - Damien Seguin. License: BSD-3-Clause */ function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === 'function') {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
var styles = {
    maxWidth: "none",
    display: "inline-block",
    position: "absolute",
    height: "100%",
    width: "100%",
    overflow: "scroll",
    fontSize: "16px"
};
var collapsibleInnerStyles = {
    display: "inline-block",
    height: "200%",
    width: "200%",
    fontSize: "16px",
    maxWidth: "none"
};
var fontStyle = {
    maxWidth: "none",
    minWidth: "20px",
    minHeight: "20px",
    display: "inline-block",
    overflow: "hidden",
    position: "absolute",
    width: "auto",
    margin: "0",
    padding: "0",
    top: "-999px",
    whiteSpace: "nowrap",
    fontSynthesis: "none"
};
var Ruler = /*#__PURE__*/ function() {
    /**
   *
   * @param {string} text
   */ function Ruler(text) {
        _classCallCheck(this, Ruler);
        this.element = document.createElement("div");
        this.element.setAttribute("aria-hidden", "true");
        this.element.appendChild(document.createTextNode(text));
        this.collapsible = document.createElement("span");
        this.expandable = document.createElement("span");
        this.collapsibleInner = document.createElement("span");
        this.expandableInner = document.createElement("span");
        this.lastOffsetWidth = -1;
        Object.assign(this.collapsible.style, styles);
        Object.assign(this.expandable.style, styles);
        Object.assign(this.expandableInner.style, styles);
        Object.assign(this.collapsibleInner.style, collapsibleInnerStyles);
        this.collapsible.appendChild(this.collapsibleInner);
        this.expandable.appendChild(this.expandableInner);
        this.element.appendChild(this.collapsible);
        this.element.appendChild(this.expandable);
    }
    /**
   * @return {Element}
   */ _createClass(Ruler, [
        {
            key: "getElement",
            value: function getElement() {
                return this.element;
            }
        },
        {
            key: "setFont",
            value: function setFont(font) {
                Object.assign(this.element.style, _objectSpread({}, fontStyle, {
                    font: font
                }));
            }
        },
        {
            key: "getWidth",
            value: function getWidth() {
                return this.element.offsetWidth;
            }
        },
        {
            key: "setWidth",
            value: function setWidth(width) {
                this.element.style.width = width + "px";
            }
        },
        {
            key: "reset",
            value: function reset() {
                var offsetWidth = this.getWidth();
                var width = offsetWidth + 100;
                this.expandableInner.style.width = width + "px";
                this.expandable.scrollLeft = width;
                this.collapsible.scrollLeft = this.collapsible.scrollWidth + 100;
                if (this.lastOffsetWidth !== offsetWidth) {
                    this.lastOffsetWidth = offsetWidth;
                    return true;
                } else {
                    return false;
                }
            }
        },
        {
            key: "onScroll",
            value: function onScroll(callback) {
                if (this.reset() && this.element.parentNode !== null) {
                    callback(this.lastOffsetWidth);
                }
            }
        },
        {
            key: "onResize",
            value: function onResize(callback) {
                var that = this;
                function onScroll() {
                    that.onScroll(callback);
                }
                this.collapsible.addEventListener("scroll", onScroll);
                this.expandable.addEventListener("scroll", onScroll);
                this.reset();
            }
        }
    ]);
    return Ruler;
}();
function onReady(callback) {
    document.body ? callback() : document.addEventListener ? document.addEventListener("DOMContentLoaded", function c() {
        document.removeEventListener("DOMContentLoaded", c);
        callback();
    }) : document.attachEvent("onreadystatechange", function k() {
        if ("interactive" == document.readyState || "complete" == document.readyState) document.detachEvent("onreadystatechange", k), callback();
    });
}
/** Class for FontFaceObserver. */ var FontFaceObserver = /*#__PURE__*/ function() {
    _createClass(FontFaceObserver, null, [
        {
            key: "getUserAgent",
            /**
     * @type {null|boolean}
     */ /**
     * @type {null|boolean}
     */ /**
     * @type {null|boolean}
     */ /**
     * @type {null|boolean}
     */ /**
     * @type {number}
     */ /**
     * @return {string}
     */ value: function getUserAgent() {
                return window.navigator.userAgent;
            }
        },
        {
            key: "getNavigatorVendor",
            value: function getNavigatorVendor() {
                return window.navigator.vendor;
            }
        },
        {
            key: "hasWebKitFallbackBug",
            value: function hasWebKitFallbackBug() {
                if (FontFaceObserver.HAS_WEBKIT_FALLBACK_BUG === null) {
                    var match = /AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(FontFaceObserver.getUserAgent());
                    FontFaceObserver.HAS_WEBKIT_FALLBACK_BUG = !!match && (parseInt(match[1], 10) < 536 || parseInt(match[1], 10) === 536 && parseInt(match[2], 10) <= 11);
                }
                return FontFaceObserver.HAS_WEBKIT_FALLBACK_BUG;
            }
        },
        {
            key: "hasSafari10Bug",
            value: function hasSafari10Bug() {
                if (FontFaceObserver.HAS_SAFARI_10_BUG === null) {
                    if (FontFaceObserver.supportsNativeFontLoading() && /Apple/.test(FontFaceObserver.getNavigatorVendor())) {
                        var match = /AppleWebKit\/([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/.exec(FontFaceObserver.getUserAgent());
                        FontFaceObserver.HAS_SAFARI_10_BUG = !!match && parseInt(match[1], 10) < 603;
                    } else {
                        FontFaceObserver.HAS_SAFARI_10_BUG = false;
                    }
                }
                return FontFaceObserver.HAS_SAFARI_10_BUG;
            }
        },
        {
            key: "supportsNativeFontLoading",
            value: function supportsNativeFontLoading() {
                if (FontFaceObserver.SUPPORTS_NATIVE_FONT_LOADING === null) {
                    FontFaceObserver.SUPPORTS_NATIVE_FONT_LOADING = !!document["fonts"];
                }
                return FontFaceObserver.SUPPORTS_NATIVE_FONT_LOADING;
            }
        },
        {
            key: "supportStretch",
            value: function supportStretch() {
                if (FontFaceObserver.SUPPORTS_STRETCH === null) {
                    var div = document.createElement("div");
                    try {
                        div.style.font = "condensed 100px sans-serif";
                    } catch (e) {}
                    FontFaceObserver.SUPPORTS_STRETCH = div.style.font !== "";
                }
                return FontFaceObserver.SUPPORTS_STRETCH;
            }
        }
    ]);
    function FontFaceObserver(family) {
        var descriptors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        _classCallCheck(this, FontFaceObserver);
        this.family = family;
        this.style = descriptors.style || "normal";
        this.weight = descriptors.weight || "normal";
        this.stretch = descriptors.stretch || "normal";
        return this;
    }
    /**
   * @param {string=} text Optional test string to use for detecting if a font
   * is available.
   * @param {number=} timeout Optional timeout for giving up on font load
   * detection and rejecting the promise (defaults to 3 seconds).
   * @return {Promise.<FontFaceObserver>}
   */ _createClass(FontFaceObserver, [
        {
            key: "load",
            value: function load(text, timeout) {
                var that = this;
                var testString = text || "BESbswy";
                var timeoutId = 0;
                var timeoutValue = timeout || FontFaceObserver.DEFAULT_TIMEOUT;
                var start = that.getTime();
                return new Promise(function(resolve, reject) {
                    if (FontFaceObserver.supportsNativeFontLoading() && !FontFaceObserver.hasSafari10Bug()) {
                        var loader = new Promise(function(resolve, reject) {
                            var check = function check() {
                                var now = that.getTime();
                                if (now - start >= timeoutValue) {
                                    reject(new Error("" + timeoutValue + "ms timeout exceeded"));
                                } else {
                                    document.fonts.load(that.getStyle('"' + that["family"] + '"'), testString).then(function(fonts) {
                                        if (fonts.length >= 1) {
                                            resolve();
                                        } else {
                                            setTimeout(check, 25);
                                        }
                                    }, reject);
                                }
                            };
                            check();
                        });
                        var timer = new Promise(function(resolve, reject) {
                            timeoutId = setTimeout(function() {
                                reject(new Error("" + timeoutValue + "ms timeout exceeded"));
                            }, timeoutValue);
                        });
                        Promise.race([
                            timer,
                            loader
                        ]).then(function() {
                            clearTimeout(timeoutId);
                            resolve(that);
                        }, reject);
                    } else {
                        onReady(function() {
                            var rulerA = new Ruler(testString);
                            var rulerB = new Ruler(testString);
                            var rulerC = new Ruler(testString);
                            var widthA = -1;
                            var widthB = -1;
                            var widthC = -1;
                            var fallbackWidthA = -1;
                            var fallbackWidthB = -1;
                            var fallbackWidthC = -1;
                            var container = document.createElement("div");
                            /**
             * @private
             */ function removeContainer() {
                                if (container.parentNode !== null) {
                                    container.parentNode.removeChild(container);
                                }
                            }
                            /**
             * @private
             *
             * If metric compatible fonts are detected, one of the widths will be
             * -1. This is because a metric compatible font won't trigger a scroll
             * event. We work around this by considering a font loaded if at least
             * two of the widths are the same. Because we have three widths, this
             * still prevents false positives.
             *
             * Cases:
             * 1) Font loads: both a, b and c are called and have the same value.
             * 2) Font fails to load: resize callback is never called and timeout
             *    happens.
             * 3) WebKit bug: both a, b and c are called and have the same value,
             *    but the values are equal to one of the last resort fonts, we
             *    ignore this and continue waiting until we get new values (or a
             *    timeout).
             */ function check() {
                                if (widthA != -1 && widthB != -1 || widthA != -1 && widthC != -1 || widthB != -1 && widthC != -1) {
                                    if (widthA == widthB || widthA == widthC || widthB == widthC) {
                                        // All values are the same, so the browser has most likely
                                        // loaded the web font
                                        if (FontFaceObserver.hasWebKitFallbackBug()) {
                                            // Except if the browser has the WebKit fallback bug, in which
                                            // case we check to see if all values are set to one of the
                                            // last resort fonts.
                                            if (widthA == fallbackWidthA && widthB == fallbackWidthA && widthC == fallbackWidthA || widthA == fallbackWidthB && widthB == fallbackWidthB && widthC == fallbackWidthB || widthA == fallbackWidthC && widthB == fallbackWidthC && widthC == fallbackWidthC) {
                                                // The width we got matches some of the known last resort
                                                // fonts, so let's assume we're dealing with the last resort
                                                // font.
                                                return;
                                            }
                                        }
                                        removeContainer();
                                        clearTimeout(timeoutId);
                                        resolve(that);
                                    }
                                }
                            } // This ensures the scroll direction is correct.
                            container.dir = "ltr";
                            rulerA.setFont(that.getStyle("sans-serif"));
                            rulerB.setFont(that.getStyle("serif"));
                            rulerC.setFont(that.getStyle("monospace"));
                            container.appendChild(rulerA.getElement());
                            container.appendChild(rulerB.getElement());
                            container.appendChild(rulerC.getElement());
                            document.body.appendChild(container);
                            fallbackWidthA = rulerA.getWidth();
                            fallbackWidthB = rulerB.getWidth();
                            fallbackWidthC = rulerC.getWidth();
                            function checkForTimeout() {
                                var now = that.getTime();
                                if (now - start >= timeoutValue) {
                                    removeContainer();
                                    reject(new Error("" + timeoutValue + "ms timeout exceeded"));
                                } else {
                                    var hidden = document["hidden"];
                                    if (hidden === true || hidden === undefined) {
                                        widthA = rulerA.getWidth();
                                        widthB = rulerB.getWidth();
                                        widthC = rulerC.getWidth();
                                        check();
                                    }
                                    timeoutId = setTimeout(checkForTimeout, 50);
                                }
                            }
                            checkForTimeout();
                            rulerA.onResize(function(width) {
                                widthA = width;
                                check();
                            });
                            rulerA.setFont(that.getStyle('"' + that["family"] + '",sans-serif'));
                            rulerB.onResize(function(width) {
                                widthB = width;
                                check();
                            });
                            rulerB.setFont(that.getStyle('"' + that["family"] + '",serif'));
                            rulerC.onResize(function(width) {
                                widthC = width;
                                check();
                            });
                            rulerC.setFont(that.getStyle('"' + that["family"] + '",monospace'));
                        });
                    }
                });
            }
        },
        {
            key: "getStyle",
            value: function getStyle(family) {
                return [
                    this.style,
                    this.weight,
                    FontFaceObserver.supportStretch() ? this.stretch : "",
                    "100px",
                    family
                ].join(" ");
            }
        },
        {
            key: "getTime",
            value: function getTime() {
                return new Date().getTime();
            }
        }
    ]);
    return FontFaceObserver;
}();
_defineProperty(FontFaceObserver, "Ruler", Ruler);
_defineProperty(FontFaceObserver, "HAS_WEBKIT_FALLBACK_BUG", null);
_defineProperty(FontFaceObserver, "HAS_SAFARI_10_BUG", null);
_defineProperty(FontFaceObserver, "SUPPORTS_STRETCH", null);
_defineProperty(FontFaceObserver, "SUPPORTS_NATIVE_FONT_LOADING", null);
_defineProperty(FontFaceObserver, "DEFAULT_TIMEOUT", 3000);

/**
 * Keys used for the {@link AsyncPreloader.loaders}
 */ var LoaderKey;
(function(LoaderKey) {
    LoaderKey["Json"] = "Json";
    LoaderKey["ArrayBuffer"] = "ArrayBuffer";
    LoaderKey["Blob"] = "Blob";
    LoaderKey["FormData"] = "FormData";
    LoaderKey["Text"] = "Text";
    LoaderKey["Image"] = "Image";
    LoaderKey["Video"] = "Video";
    LoaderKey["Audio"] = "Audio";
    LoaderKey["Xml"] = "Xml";
    LoaderKey["Font"] = "Font";
})(LoaderKey || (LoaderKey = {}));

const isSafari = /^((?!chrome|android).)*safari/i.test(globalThis.navigator?.userAgent) === true;
/**
 * AsyncPreloader: assets preloader using ES2017 async/await and fetch.
 *
 * It exports an instance of itself as default so you can:
 *
 * ```js
 * import Preloader from "async-preloader";
 *
 * await Preloader.loadItems([]);
 * ```
 *
 * to use directly as a singleton or
 *
 * ```js
 * import { AsyncPreloader as Preloader } from "async-preloader";
 *
 * const preloader = new Preloader();
 * await preloader.loadItems([]);
 * ```
 * if you need more than one instance.
 */ class AsyncPreloader {
    constructor(){
        // Properties
        /**
         * Object that contains the loaded items
         */ this.items = new Map();
        /**
         * Default body method to be called on the Response from fetch if no body option is specified on the LoadItem
         */ this.defaultBodyMethod = "blob";
        /**
         * Default loader to use if no loader key is specified in the {@link LoadItem} or if the extension doesn't match any of the {@link AsyncPreloader.loaders} extensions
         */ this.defaultLoader = LoaderKey.Text;
        // API
        /**
         * Load the specified manifest (array of items)
         *
         * @param items Items to load
         * @returns Resolve when all items are loaded, reject for any error
         */ this.loadItems = async (items)=>{
            return await Promise.all(items.map(this.loadItem));
        };
        /**
         * Load a single item
         *
         * @param item Item to load
         * @returns Resolve when item is loaded, reject for any error
         */ this.loadItem = async (item)=>{
            if (typeof item === "string") item = {
                src: item
            };
            const extension = AsyncPreloader.getFileExtension(item.src || "");
            const loaderKey = item.loader || AsyncPreloader.getLoaderKey(extension);
            const loadedItem = await this[`load` + loaderKey](item);
            this.items.set(item.id || item.src, loadedItem);
            return loadedItem;
        };
        // Special loaders
        /**
         * Load a manifest of items
         *
         * @param src Manifest src url
         * @param key Manifest key in the JSON object containing the array of LoadItem.
         * @returns
         */ this.loadManifest = async (src, key = "items")=>{
            const loadedManifest = await this.loadJson({
                src
            });
            const items = AsyncPreloader.getProp(loadedManifest, key);
            return await this.loadItems(items);
        };
        // Text loaders
        /**
         * Load an item and parse the Response as text
         *
         * @param item Item to load
         * @returns Fulfilled value of parsed Response
         */ this.loadText = async (item)=>{
            const response = await AsyncPreloader.fetchItem(item);
            return await response.text();
        };
        /**
         * Load an item and parse the Response as json
         *
         * @param item Item to load
         * @returns Fulfilled value of parsed Response
         */ this.loadJson = async (item)=>{
            const response = await AsyncPreloader.fetchItem(item);
            return await response.json();
        };
        /**
         * Load an item and parse the Response as arrayBuffer
         *
         * @param item Item to load
         * @returns Fulfilled value of parsed Response
         */ this.loadArrayBuffer = async (item)=>{
            const response = await AsyncPreloader.fetchItem(item);
            return await response.arrayBuffer();
        };
        /**
         * Load an item and parse the Response as blob
         *
         * @param item Item to load
         * @returns Fulfilled value of parsed Response
         */ this.loadBlob = async (item)=>{
            const response = await AsyncPreloader.fetchItem(item);
            return await response.blob();
        };
        /**
         * Load an item and parse the Response as formData
         *
         * @param item Item to load
         * @returns Fulfilled value of parsed Response
         */ this.loadFormData = async (item)=>{
            const response = await AsyncPreloader.fetchItem(item);
            return await response.formData();
        };
        // Custom loaders
        /**
         * Load an item in one of the following cases:
         * - item's "loader" option set as "Image"
         * - item's "src" option extensions matching the loaders Map
         * - direct call of the method
         *
         * @param item Item to load
         * @returns Fulfilled value with a decoded HTMLImageElement instance of or a parsed Response according to the "body" option. Defaults to a decoded HTMLImageElement.
         */ this.loadImage = async (item)=>{
            const image = new Image();
            if (item.body) {
                const response = await AsyncPreloader.fetchItem(item);
                const data = await response[item.body]();
                if (item.body !== "blob") return data;
                return await new Promise((resolve, reject)=>{
                    image.addEventListener("load", function load() {
                        image.removeEventListener("load", load);
                        resolve(image);
                    });
                    image.addEventListener("error", function error(event) {
                        image.removeEventListener("error", error);
                        reject(event);
                    });
                    image.src = URL.createObjectURL(data);
                });
            }
            image.src = item.src;
            if (!item.noDecode) await image.decode();
            return image;
        };
        /**
         * Load an item in one of the following cases:
         * - item's "loader" option set as "Video"
         * - item's "src" option extensions matching the loaders Map
         * - direct call of the method
         *
         * @param item Item to load
         * @returns Fulfilled value of parsed Response according to the "body" option. Defaults to an HTMLVideoElement with a blob as srcObject or src.
         */ this.loadVideo = async (item)=>{
            const response = await AsyncPreloader.fetchItem(item);
            const data = await response[item.body || this.defaultBodyMethod]();
            if (item.body) return data;
            const video = document.createElement("video");
            return await new Promise((resolve, reject)=>{
                video.addEventListener("canplaythrough", function canplaythrough() {
                    video.removeEventListener("canplaythrough", canplaythrough);
                    resolve(video);
                });
                video.addEventListener("error", function error(event) {
                    video.removeEventListener("error", error);
                    reject(event);
                });
                try {
                    if (isSafari) throw "";
                    video.srcObject = data;
                } catch (error) {
                    video.src = URL.createObjectURL(data);
                }
                video.load();
            });
        };
        /**
         * Load an item in one of the following cases:
         * - item's "loader" option set as "Audio"
         * - item's "src" option extensions matching the loaders Map
         * - direct call of the method
         *
         * @param item Item to load
         * @returns Fulfilled value of parsed Response according to the "body" option. Defaults to an HTMLAudioElement with a blob as srcObject or src.
         */ this.loadAudio = async (item)=>{
            const response = await AsyncPreloader.fetchItem(item);
            const data = await response[item.body || this.defaultBodyMethod]();
            if (item.body) return data;
            const audio = document.createElement("audio");
            audio.autoplay = false;
            audio.preload = "auto";
            return await new Promise((resolve, reject)=>{
                audio.addEventListener("canplaythrough", function canplaythrough() {
                    audio.removeEventListener("canplaythrough", canplaythrough);
                    resolve(audio);
                });
                audio.addEventListener("error", function error(event) {
                    audio.removeEventListener("error", error);
                    reject(event);
                });
                try {
                    if (isSafari) throw "";
                    audio.srcObject = data;
                } catch (error) {
                    audio.src = URL.createObjectURL(data);
                }
                audio.load();
            });
        };
        /**
         * Load an item in one of the following cases:
         * - item's "loader" option set as "Xml"
         * - item's "src" option extensions matching the loaders Map
         * - direct call of the method
         *
         * @param item Item to load (need a mimeType specified or default to "application/xml")
         * @returns Result of Response parsed as a document.
         */ this.loadXml = async (item)=>{
            if (!item.mimeType) {
                const extension = AsyncPreloader.getFileExtension(item.src);
                item = {
                    ...item,
                    mimeType: AsyncPreloader.getMimeType(LoaderKey.Xml, extension)
                };
            }
            if (!AsyncPreloader.domParser) {
                throw new Error("DomParser is not supported.");
            }
            const response = await AsyncPreloader.fetchItem(item);
            const data = await response.text();
            return AsyncPreloader.domParser.parseFromString(data, item.mimeType);
        };
        /**
         * Load a font via FontFace or check a font is loaded via FontFaceObserver instance
         *
         * @param item Item to load (id correspond to the font family name).
         * @returns Fulfilled value with FontFace instance or initial id if no src provided.
         */ this.loadFont = async (item)=>{
            const fontName = item.id || AsyncPreloader.getFileName(item.src);
            const options = item.fontOptions || {};
            if (!item.src) {
                const font = new FontFaceObserver(fontName, options.variant || {});
                await font.load(options.testString, options.timeout);
                return fontName;
            }
            const source = item.body === "arrayBuffer" ? await this.loadArrayBuffer({
                src: item.src
            }) : `url(${item.src})`;
            const font = new FontFace(fontName, source, options.descriptors);
            return await font.load().then((font)=>{
                document.fonts.add(font);
                return font;
            });
        };
    }
    // Utils
    /**
     * Fetch wrapper for LoadItem
     *
     * @param item Item to fetch
     * @returns Fetch response
     */ static fetchItem(item) {
        return fetch(item.src, item.options || {});
    }
    /**
     * Get an object property by its path in the form 'a[0].b.c' or ['a', '0', 'b', 'c'].
     * Similar to [lodash.get](https://lodash.com/docs/4.17.5#get).
     *
     * @param object Object with nested properties
     * @param path Path to the desired property
     * @returns The returned object property
     */ static getProp(object, path) {
        const p = Array.isArray(path) ? path : path.split(".").filter((index)=>index.length);
        if (!p.length) return object;
        return AsyncPreloader.getProp(object[p.shift()], p);
    }
    /**
     * Get file extension
     *
     * @param path
     * @returns
     */ static getFileExtension(path) {
        return (path?.match(/[^\\/]\.([^.\\/]+)$/) || [
            null
        ]).pop();
    }
    /**
     * Get file base name
     *
     * @param path
     * @returns
     */ static getFileBaseName(path) {
        return path.split(/[\\/]/).pop();
    }
    /**
     * Get file name
     *
     * @param path
     * @returns
     */ static getFileName(path) {
        return AsyncPreloader.getFileBaseName(path).split(".").slice(0, -1).join(".") || path;
    }
    /**
     * Retrieve loader key from extension (when the loader option isn't specified in the LoadItem)
     *
     * @param extension
     * @returns
     */ static getLoaderKey(extension) {
        const loader = Array.from(AsyncPreloader.loaders).find((loader)=>loader[1].extensions.includes(extension));
        return loader ? loader[0] : LoaderKey.Text;
    }
    /**
     * Retrieve mime type from extension
     *
     * @param loaderKey
     * @param extension
     * @returns
     */ static getMimeType(loaderKey, extension) {
        const loader = AsyncPreloader.loaders.get(loaderKey);
        return loader.mimeType[extension] || loader.defaultMimeType;
    }
}
/**
 * Loader types and the extensions they handle
 *
 * Allows the omission of the loader key in a {@link LoadItem.loader} for some generic extensions
 */ AsyncPreloader.loaders = new Map().set(LoaderKey.Text, {
    extensions: [
        "txt"
    ]
}).set(LoaderKey.Json, {
    extensions: [
        "json"
    ]
}).set(LoaderKey.Image, {
    extensions: [
        "jpeg",
        "jpg",
        "gif",
        "png",
        "webp"
    ]
}).set(LoaderKey.Video, {
    extensions: [
        "webm",
        "ogg",
        "mp4"
    ]
}).set(LoaderKey.Audio, {
    extensions: [
        "webm",
        "ogg",
        "mp3",
        "wav",
        "flac"
    ]
}).set(LoaderKey.Xml, {
    extensions: [
        "xml",
        "svg",
        "html"
    ],
    mimeType: {
        xml: "text/xml",
        svg: "image/svg+xml",
        html: "text/html"
    },
    defaultMimeType: "text/xml"
}).set(LoaderKey.Font, {
    extensions: [
        "woff2",
        "woff",
        "ttf",
        "otf",
        "eot"
    ]
});
/**
 * DOMParser instance for the XML loader
 */ AsyncPreloader.domParser = typeof DOMParser !== "undefined" && new DOMParser();
const AsyncPreloaderInstance = new AsyncPreloader();

export { AsyncPreloader, AsyncPreloaderInstance as default };
