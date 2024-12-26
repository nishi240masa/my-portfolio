function __cf_cjs(esm) {
  const cjs = 'default' in esm ? esm.default : {};
	for (const [k, v] of Object.entries(esm)) {
		if (k !== 'default') {
			Object.defineProperty(cjs, k, {
				enumerable: true,
				value: v,
			});
		}
	}
	return cjs;
}
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn2, res) => function __init() {
  return fn2 && (res = (0, fn2[__getOwnPropNames(fn2)[0]])(fn2 = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// ../../../node_modules/wrangler/_virtual_unenv_global_polyfill-clear$immediate.js
var init_virtual_unenv_global_polyfill_clear_immediate = __esm({
  "../../../node_modules/wrangler/_virtual_unenv_global_polyfill-clear$immediate.js"() {
    init_cloudflare();
    globalThis.clearImmediate = clearImmediateFallback;
  }
});

// ../../../node_modules/unenv/runtime/_internal/utils.mjs
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
function notImplemented(name) {
  const fn2 = /* @__PURE__ */ __name(() => {
    throw createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn2, { __unenv__: true });
}
var init_utils = __esm({
  "../../../node_modules/unenv/runtime/_internal/utils.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    __name(createNotImplementedError, "createNotImplementedError");
    __name(notImplemented, "notImplemented");
  }
});

// ../../../node_modules/unenv/runtime/mock/noop.mjs
var noop_default;
var init_noop = __esm({
  "../../../node_modules/unenv/runtime/mock/noop.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    noop_default = Object.assign(() => {
    }, { __unenv__: true });
  }
});

// ../../../node_modules/unenv/runtime/node/timers/internal/immediate.mjs
var Immediate;
var init_immediate = __esm({
  "../../../node_modules/unenv/runtime/node/timers/internal/immediate.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    Immediate = class {
      _onImmediate;
      _timeout;
      constructor(callback, args) {
        this._onImmediate = callback;
        if ("setTimeout" in globalThis) {
          this._timeout = setTimeout(callback, 0, ...args);
        } else {
          callback(...args);
        }
      }
      ref() {
        this._timeout?.ref();
        return this;
      }
      unref() {
        this._timeout?.unref();
        return this;
      }
      hasRef() {
        return this._timeout?.hasRef() ?? false;
      }
      [Symbol.dispose]() {
        if ("clearTimeout" in globalThis) {
          clearTimeout(this._timeout);
        }
      }
    };
    __name(Immediate, "Immediate");
  }
});

// ../../../node_modules/unenv/runtime/node/timers/internal/set-immediate.mjs
function setImmediateFallbackPromises(value) {
  return new Promise((res) => {
    res(value);
  });
}
function setImmediateFallback(callback, ...args) {
  return new Immediate(callback, args);
}
function clearImmediateFallback(immediate) {
  immediate?.[Symbol.dispose]();
}
var init_set_immediate = __esm({
  "../../../node_modules/unenv/runtime/node/timers/internal/set-immediate.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    init_immediate();
    __name(setImmediateFallbackPromises, "setImmediateFallbackPromises");
    __name(setImmediateFallback, "setImmediateFallback");
    setImmediateFallback.__promisify__ = setImmediateFallbackPromises;
    __name(clearImmediateFallback, "clearImmediateFallback");
  }
});

// ../../../node_modules/unenv/runtime/node/timers/$cloudflare.mjs
var init_cloudflare = __esm({
  "../../../node_modules/unenv/runtime/node/timers/$cloudflare.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    init_set_immediate();
  }
});

// ../../../node_modules/wrangler/_virtual_unenv_global_polyfill-set$immediate.js
var init_virtual_unenv_global_polyfill_set_immediate = __esm({
  "../../../node_modules/wrangler/_virtual_unenv_global_polyfill-set$immediate.js"() {
    init_cloudflare();
    globalThis.setImmediate = setImmediateFallback;
  }
});

// ../../../node_modules/unenv/runtime/mock/proxy.mjs
function createMock(name, overrides = {}) {
  fn.prototype.name = name;
  const props = {};
  return new Proxy(fn, {
    get(_target, prop) {
      if (prop === "caller") {
        return null;
      }
      if (prop === "__createMock__") {
        return createMock;
      }
      if (prop === "__unenv__") {
        return true;
      }
      if (prop in overrides) {
        return overrides[prop];
      }
      return props[prop] = props[prop] || createMock(`${name}.${prop.toString()}`);
    },
    apply(_target, _this, _args) {
      return createMock(`${name}()`);
    },
    construct(_target, _args, _newT) {
      return createMock(`[${name}]`);
    },
    // @ts-ignore (ES6-only - removed in ES7)
    // https://github.com/tc39/ecma262/issues/161
    enumerate() {
      return [];
    }
  });
}
var fn, proxy_default;
var init_proxy = __esm({
  "../../../node_modules/unenv/runtime/mock/proxy.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    fn = /* @__PURE__ */ __name(function() {
    }, "fn");
    __name(createMock, "createMock");
    proxy_default = createMock("mock");
  }
});

// ../../../node_modules/unenv/runtime/node/console/index.mjs
import { Writable } from "node:stream";
var _console, _ignoreErrors, _stderr, _stdout, log, info, trace, debug, table, error, warn, createTask, assert, clear, count, countReset, dir, dirxml, group, groupEnd, groupCollapsed, profile, profileEnd, time, timeEnd, timeLog, timeStamp, Console;
var init_console = __esm({
  "../../../node_modules/unenv/runtime/node/console/index.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    init_proxy();
    init_noop();
    init_utils();
    init_proxy();
    init_noop();
    _console = globalThis.console;
    _ignoreErrors = true;
    _stderr = new Writable();
    _stdout = new Writable();
    log = _console?.log ?? noop_default;
    info = _console?.info ?? log;
    trace = _console?.trace ?? info;
    debug = _console?.debug ?? log;
    table = _console?.table ?? log;
    error = _console?.error ?? log;
    warn = _console?.warn ?? error;
    createTask = _console?.createTask ?? notImplemented("console.createTask");
    assert = notImplemented("console.assert");
    clear = _console?.clear ?? noop_default;
    count = _console?.count ?? noop_default;
    countReset = _console?.countReset ?? noop_default;
    dir = _console?.dir ?? noop_default;
    dirxml = _console?.dirxml ?? noop_default;
    group = _console?.group ?? noop_default;
    groupEnd = _console?.groupEnd ?? noop_default;
    groupCollapsed = _console?.groupCollapsed ?? noop_default;
    profile = _console?.profile ?? noop_default;
    profileEnd = _console?.profileEnd ?? noop_default;
    time = _console?.time ?? noop_default;
    timeEnd = _console?.timeEnd ?? noop_default;
    timeLog = _console?.timeLog ?? noop_default;
    timeStamp = _console?.timeStamp ?? noop_default;
    Console = _console?.Console ?? proxy_default.__createMock__("console.Console");
  }
});

// ../../../node_modules/unenv/runtime/node/console/$cloudflare.mjs
var workerdConsole, assert2, clear2, context, count2, countReset2, createTask2, debug2, dir2, dirxml2, error2, group2, groupCollapsed2, groupEnd2, info2, log2, profile2, profileEnd2, table2, time2, timeEnd2, timeLog2, timeStamp2, trace2, warn2, cloudflare_default;
var init_cloudflare2 = __esm({
  "../../../node_modules/unenv/runtime/node/console/$cloudflare.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    init_console();
    workerdConsole = globalThis["console"];
    ({
      assert: assert2,
      clear: clear2,
      context: (
        // @ts-expect-error undocumented public API
        context
      ),
      count: count2,
      countReset: countReset2,
      createTask: (
        // @ts-expect-error undocumented public API
        createTask2
      ),
      debug: debug2,
      dir: dir2,
      dirxml: dirxml2,
      error: error2,
      group: group2,
      groupCollapsed: groupCollapsed2,
      groupEnd: groupEnd2,
      info: info2,
      log: log2,
      profile: profile2,
      profileEnd: profileEnd2,
      table: table2,
      time: time2,
      timeEnd: timeEnd2,
      timeLog: timeLog2,
      timeStamp: timeStamp2,
      trace: trace2,
      warn: warn2
    } = workerdConsole);
    Object.assign(workerdConsole, {
      Console,
      _ignoreErrors,
      _stderr,
      _stderrErrorHandler: noop_default,
      _stdout,
      _stdoutErrorHandler: noop_default,
      _times: proxy_default
    });
    cloudflare_default = workerdConsole;
  }
});

// ../../../node_modules/wrangler/_virtual_unenv_global_polyfill-console.js
var init_virtual_unenv_global_polyfill_console = __esm({
  "../../../node_modules/wrangler/_virtual_unenv_global_polyfill-console.js"() {
    init_cloudflare2();
    globalThis.console = cloudflare_default;
  }
});

// ../../../node_modules/unenv/runtime/web/performance/_entry.mjs
var _supportedEntryTypes, _PerformanceEntry, PerformanceEntry, _PerformanceMark, PerformanceMark, _PerformanceMeasure, PerformanceMeasure, _PerformanceResourceTiming, PerformanceResourceTiming;
var init_entry = __esm({
  "../../../node_modules/unenv/runtime/web/performance/_entry.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    _supportedEntryTypes = [
      "event",
      // PerformanceEntry
      "mark",
      // PerformanceMark
      "measure",
      // PerformanceMeasure
      "resource"
      // PerformanceResourceTiming
    ];
    _PerformanceEntry = class {
      __unenv__ = true;
      detail;
      entryType = "event";
      name;
      startTime;
      constructor(name, options) {
        this.name = name;
        this.startTime = options?.startTime || performance.now();
        this.detail = options?.detail;
      }
      get duration() {
        return performance.now() - this.startTime;
      }
      toJSON() {
        return {
          name: this.name,
          entryType: this.entryType,
          startTime: this.startTime,
          duration: this.duration,
          detail: this.detail
        };
      }
    };
    __name(_PerformanceEntry, "_PerformanceEntry");
    PerformanceEntry = globalThis.PerformanceEntry || _PerformanceEntry;
    _PerformanceMark = class extends _PerformanceEntry {
      entryType = "mark";
    };
    __name(_PerformanceMark, "_PerformanceMark");
    PerformanceMark = globalThis.PerformanceMark || _PerformanceMark;
    _PerformanceMeasure = class extends _PerformanceEntry {
      entryType = "measure";
    };
    __name(_PerformanceMeasure, "_PerformanceMeasure");
    PerformanceMeasure = globalThis.PerformanceMeasure || _PerformanceMeasure;
    _PerformanceResourceTiming = class extends _PerformanceEntry {
      entryType = "resource";
      serverTiming = [];
      connectEnd = 0;
      connectStart = 0;
      decodedBodySize = 0;
      domainLookupEnd = 0;
      domainLookupStart = 0;
      encodedBodySize = 0;
      fetchStart = 0;
      initiatorType = "";
      name = "";
      nextHopProtocol = "";
      redirectEnd = 0;
      redirectStart = 0;
      requestStart = 0;
      responseEnd = 0;
      responseStart = 0;
      secureConnectionStart = 0;
      startTime = 0;
      transferSize = 0;
      workerStart = 0;
      responseStatus = 0;
    };
    __name(_PerformanceResourceTiming, "_PerformanceResourceTiming");
    PerformanceResourceTiming = globalThis.PerformanceResourceTiming || _PerformanceResourceTiming;
  }
});

// ../../../node_modules/unenv/runtime/web/performance/_performance.mjs
var _timeOrigin, _Performance, Performance, performance2;
var init_performance = __esm({
  "../../../node_modules/unenv/runtime/web/performance/_performance.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    init_utils();
    init_proxy();
    init_entry();
    _timeOrigin = Date.now();
    _Performance = class {
      __unenv__ = true;
      timeOrigin = _timeOrigin;
      eventCounts = /* @__PURE__ */ new Map();
      _entries = [];
      _resourceTimingBufferSize = 0;
      navigation = proxy_default.__createMock__("PerformanceNavigation");
      timing = proxy_default.__createMock__("PerformanceTiming");
      onresourcetimingbufferfull = null;
      now() {
        if (globalThis?.performance?.now && this.timeOrigin === _timeOrigin) {
          return globalThis.performance.now();
        }
        return Date.now() - this.timeOrigin;
      }
      clearMarks(markName) {
        this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
      }
      clearMeasures(measureName) {
        this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
      }
      clearResourceTimings() {
        this._entries = this._entries.filter(
          (e) => e.entryType !== "resource" || e.entryType !== "navigation"
        );
      }
      getEntries() {
        return this._entries;
      }
      getEntriesByName(name, type) {
        return this._entries.filter(
          (e) => e.name === name && (!type || e.entryType === type)
        );
      }
      getEntriesByType(type) {
        return this._entries.filter(
          (e) => e.entryType === type
        );
      }
      mark(name, options) {
        const entry = new _PerformanceMark(name, options);
        this._entries.push(entry);
        return entry;
      }
      measure(measureName, startOrMeasureOptions, endMark) {
        let start;
        let end;
        if (typeof startOrMeasureOptions === "string") {
          start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
          end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
        } else {
          start = Number.parseFloat(startOrMeasureOptions?.start) || performance2.now();
          end = Number.parseFloat(startOrMeasureOptions?.end) || performance2.now();
        }
        const entry = new _PerformanceMeasure(measureName, {
          startTime: start,
          detail: { start, end }
        });
        this._entries.push(entry);
        return entry;
      }
      setResourceTimingBufferSize(maxSize) {
        this._resourceTimingBufferSize = maxSize;
      }
      toJSON() {
        return this;
      }
      addEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.addEventListener");
      }
      removeEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.removeEventListener");
      }
      dispatchEvent(event) {
        throw createNotImplementedError("Performance.dispatchEvent");
      }
    };
    __name(_Performance, "_Performance");
    Performance = globalThis.Performance || _Performance;
    performance2 = globalThis.performance || new Performance();
  }
});

// ../../../node_modules/unenv/runtime/web/performance/_observer.mjs
var _PerformanceObserver, PerformanceObserver, _PerformanceObserverEntryList, PerformanceObserverEntryList;
var init_observer = __esm({
  "../../../node_modules/unenv/runtime/web/performance/_observer.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    init_utils();
    init_entry();
    _PerformanceObserver = class {
      __unenv__ = true;
      _callback = null;
      constructor(callback) {
        this._callback = callback;
      }
      takeRecords() {
        return [];
      }
      disconnect() {
        throw createNotImplementedError("PerformanceObserver.disconnect");
      }
      observe(options) {
        throw createNotImplementedError("PerformanceObserver.observe");
      }
    };
    __name(_PerformanceObserver, "_PerformanceObserver");
    __publicField(_PerformanceObserver, "supportedEntryTypes", _supportedEntryTypes);
    PerformanceObserver = globalThis.PerformanceObserver || _PerformanceObserver;
    _PerformanceObserverEntryList = class {
      __unenv__ = true;
      getEntries() {
        return [];
      }
      getEntriesByName(_name, _type) {
        return [];
      }
      getEntriesByType(type) {
        return [];
      }
    };
    __name(_PerformanceObserverEntryList, "_PerformanceObserverEntryList");
    PerformanceObserverEntryList = globalThis.PerformanceObserverEntryList || _PerformanceObserverEntryList;
  }
});

// ../../../node_modules/unenv/runtime/web/performance/index.mjs
var init_performance2 = __esm({
  "../../../node_modules/unenv/runtime/web/performance/index.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    init_performance();
    init_observer();
    init_entry();
  }
});

// ../../../node_modules/unenv/runtime/polyfill/global-this.mjs
function getGlobal() {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  return {};
}
var global_this_default;
var init_global_this = __esm({
  "../../../node_modules/unenv/runtime/polyfill/global-this.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    __name(getGlobal, "getGlobal");
    global_this_default = getGlobal();
  }
});

// ../../../node_modules/unenv/runtime/polyfill/performance.mjs
var performance_default;
var init_performance3 = __esm({
  "../../../node_modules/unenv/runtime/polyfill/performance.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    init_performance2();
    init_global_this();
    global_this_default.performance = global_this_default.performance || performance2;
    global_this_default.Performance = global_this_default.Performance || Performance;
    global_this_default.PerformanceEntry = global_this_default.PerformanceEntry || PerformanceEntry;
    global_this_default.PerformanceMark = global_this_default.PerformanceMark || PerformanceMark;
    global_this_default.PerformanceMeasure = global_this_default.PerformanceMeasure || PerformanceMeasure;
    global_this_default.PerformanceObserver = global_this_default.PerformanceObserver || PerformanceObserver;
    global_this_default.PerformanceObserverEntryList = global_this_default.PerformanceObserverEntryList || PerformanceObserverEntryList;
    global_this_default.PerformanceResourceTiming = global_this_default.PerformanceResourceTiming || PerformanceResourceTiming;
    performance_default = global_this_default.performance;
  }
});

// ../../../node_modules/wrangler/_virtual_unenv_global_polyfill-performance.js
var init_virtual_unenv_global_polyfill_performance = __esm({
  "../../../node_modules/wrangler/_virtual_unenv_global_polyfill-performance.js"() {
    init_performance3();
    globalThis.performance = performance_default;
  }
});

// ../../../node_modules/unenv/runtime/mock/empty.mjs
var empty_default;
var init_empty = __esm({
  "../../../node_modules/unenv/runtime/mock/empty.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    empty_default = Object.freeze(
      Object.create(null, {
        __unenv__: { get: () => true }
      })
    );
  }
});

// ../../../node_modules/unenv/runtime/node/process/internal/env.mjs
var _envShim, _processEnv, _getEnv, env;
var init_env = __esm({
  "../../../node_modules/unenv/runtime/node/process/internal/env.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    _envShim = /* @__PURE__ */ Object.create(null);
    _processEnv = globalThis.process?.env;
    _getEnv = /* @__PURE__ */ __name((useShim) => _processEnv || globalThis.__env__ || (useShim ? _envShim : globalThis), "_getEnv");
    env = new Proxy(_envShim, {
      get(_2, prop) {
        const env22 = _getEnv();
        return env22[prop] ?? _envShim[prop];
      },
      has(_2, prop) {
        const env22 = _getEnv();
        return prop in env22 || prop in _envShim;
      },
      set(_2, prop, value) {
        const env22 = _getEnv(true);
        env22[prop] = value;
        return true;
      },
      deleteProperty(_2, prop) {
        const env22 = _getEnv(true);
        delete env22[prop];
        return true;
      },
      ownKeys() {
        const env22 = _getEnv();
        return Object.keys(env22);
      }
    });
  }
});

// ../../../node_modules/unenv/runtime/node/process/internal/time.mjs
function _createNextTickWithTimeout() {
  let queue = [];
  let draining = false;
  let currentQueue;
  let queueIndex = -1;
  function cleanUpNextTick() {
    if (!draining || !currentQueue) {
      return;
    }
    draining = false;
    if (currentQueue.length > 0) {
      queue = [...currentQueue, ...queue];
    } else {
      queueIndex = -1;
    }
    if (queue.length > 0) {
      drainQueue();
    }
  }
  __name(cleanUpNextTick, "cleanUpNextTick");
  function drainQueue() {
    if (draining) {
      return;
    }
    const timeout = setTimeout(cleanUpNextTick);
    draining = true;
    let len = queue.length;
    while (len) {
      currentQueue = queue;
      queue = [];
      while (++queueIndex < len) {
        if (currentQueue) {
          currentQueue[queueIndex]();
        }
      }
      queueIndex = -1;
      len = queue.length;
    }
    currentQueue = void 0;
    draining = false;
    clearTimeout(timeout);
  }
  __name(drainQueue, "drainQueue");
  const nextTick22 = /* @__PURE__ */ __name((cb, ...args) => {
    queue.push(cb.bind(void 0, ...args));
    if (queue.length === 1 && !draining) {
      setTimeout(drainQueue);
    }
  }, "nextTick2");
  return nextTick22;
}
var hrtime, nextTick;
var init_time = __esm({
  "../../../node_modules/unenv/runtime/node/process/internal/time.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    hrtime = Object.assign(
      /* @__PURE__ */ __name(function hrtime2(startTime) {
        const now = Date.now();
        const seconds = Math.trunc(now / 1e3);
        const nanos = now % 1e3 * 1e6;
        if (startTime) {
          let diffSeconds = seconds - startTime[0];
          let diffNanos = nanos - startTime[0];
          if (diffNanos < 0) {
            diffSeconds = diffSeconds - 1;
            diffNanos = 1e9 + diffNanos;
          }
          return [diffSeconds, diffNanos];
        }
        return [seconds, nanos];
      }, "hrtime2"),
      {
        bigint: /* @__PURE__ */ __name(function bigint() {
          return BigInt(Date.now() * 1e6);
        }, "bigint")
      }
    );
    nextTick = globalThis.queueMicrotask ? (cb, ...args) => {
      globalThis.queueMicrotask(cb.bind(void 0, ...args));
    } : _createNextTickWithTimeout();
    __name(_createNextTickWithTimeout, "_createNextTickWithTimeout");
  }
});

// ../../../node_modules/unenv/runtime/node/process/internal/process.mjs
function noop() {
  return process2;
}
var title, argv, version, versions, on, addListener, once, off, removeListener, removeAllListeners, emit, prependListener, prependOnceListener, listeners, listenerCount, binding, _cwd, cwd, chdir, umask, getegid, geteuid, getgid, getuid, getgroups, getBuiltinModule, abort, allowedNodeEnvironmentFlags, arch, argv0, config, connected, constrainedMemory, availableMemory, cpuUsage, debugPort, dlopen, disconnect, emitWarning, eventNames, execArgv, execPath, exit, features, getActiveResourcesInfo, getMaxListeners, kill, memoryUsage, pid, platform, ppid, rawListeners, release, report, resourceUsage, setegid, seteuid, setgid, setgroups, setuid, setMaxListeners, setSourceMapsEnabled, stdout, stderr, stdin, traceDeprecation, uptime, exitCode, setUncaughtExceptionCaptureCallback, hasUncaughtExceptionCaptureCallback, sourceMapsEnabled, loadEnvFile, mainModule, permission, channel, throwDeprecation, finalization, assert3, openStdin, _debugEnd, _debugProcess, _fatalException, _getActiveHandles, _getActiveRequests, _kill, _preload_modules, _rawDebug, _startProfilerIdleNotifier, _stopProfilerIdleNotifier, _tickCallback, _linkedBinding, domain, initgroups, moduleLoadList, reallyExit, _exiting, _events, _eventsCount, _maxListeners, process2;
var init_process = __esm({
  "../../../node_modules/unenv/runtime/node/process/internal/process.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    init_proxy();
    init_empty();
    init_utils();
    init_env();
    init_time();
    init_time();
    title = "unenv";
    argv = [];
    version = "";
    versions = {
      ares: "",
      http_parser: "",
      icu: "",
      modules: "",
      node: "",
      openssl: "",
      uv: "",
      v8: "",
      zlib: ""
    };
    __name(noop, "noop");
    on = noop;
    addListener = noop;
    once = noop;
    off = noop;
    removeListener = noop;
    removeAllListeners = noop;
    emit = /* @__PURE__ */ __name(function emit2(event) {
      if (event === "message" || event === "multipleResolves") {
        return process2;
      }
      return false;
    }, "emit2");
    prependListener = noop;
    prependOnceListener = noop;
    listeners = /* @__PURE__ */ __name(function(name) {
      return [];
    }, "listeners");
    listenerCount = /* @__PURE__ */ __name(() => 0, "listenerCount");
    binding = /* @__PURE__ */ __name(function(name) {
      throw new Error("[unenv] process.binding is not supported");
    }, "binding");
    _cwd = "/";
    cwd = /* @__PURE__ */ __name(function cwd2() {
      return _cwd;
    }, "cwd2");
    chdir = /* @__PURE__ */ __name(function chdir2(dir3) {
      _cwd = dir3;
    }, "chdir2");
    umask = /* @__PURE__ */ __name(function umask2() {
      return 0;
    }, "umask2");
    getegid = /* @__PURE__ */ __name(function getegid2() {
      return 1e3;
    }, "getegid2");
    geteuid = /* @__PURE__ */ __name(function geteuid2() {
      return 1e3;
    }, "geteuid2");
    getgid = /* @__PURE__ */ __name(function getgid2() {
      return 1e3;
    }, "getgid2");
    getuid = /* @__PURE__ */ __name(function getuid2() {
      return 1e3;
    }, "getuid2");
    getgroups = /* @__PURE__ */ __name(function getgroups2() {
      return [];
    }, "getgroups2");
    getBuiltinModule = /* @__PURE__ */ __name((_name) => void 0, "getBuiltinModule");
    abort = notImplemented("process.abort");
    allowedNodeEnvironmentFlags = /* @__PURE__ */ new Set();
    arch = "";
    argv0 = "";
    config = empty_default;
    connected = false;
    constrainedMemory = /* @__PURE__ */ __name(() => 0, "constrainedMemory");
    availableMemory = /* @__PURE__ */ __name(() => 0, "availableMemory");
    cpuUsage = notImplemented("process.cpuUsage");
    debugPort = 0;
    dlopen = notImplemented("process.dlopen");
    disconnect = noop;
    emitWarning = noop;
    eventNames = notImplemented("process.eventNames");
    execArgv = [];
    execPath = "";
    exit = notImplemented("process.exit");
    features = /* @__PURE__ */ Object.create({
      inspector: void 0,
      debug: void 0,
      uv: void 0,
      ipv6: void 0,
      tls_alpn: void 0,
      tls_sni: void 0,
      tls_ocsp: void 0,
      tls: void 0,
      cached_builtins: void 0
    });
    getActiveResourcesInfo = /* @__PURE__ */ __name(() => [], "getActiveResourcesInfo");
    getMaxListeners = notImplemented(
      "process.getMaxListeners"
    );
    kill = notImplemented("process.kill");
    memoryUsage = Object.assign(
      () => ({
        arrayBuffers: 0,
        rss: 0,
        external: 0,
        heapTotal: 0,
        heapUsed: 0
      }),
      { rss: () => 0 }
    );
    pid = 1e3;
    platform = "";
    ppid = 1e3;
    rawListeners = notImplemented(
      "process.rawListeners"
    );
    release = /* @__PURE__ */ Object.create({
      name: "",
      lts: "",
      sourceUrl: void 0,
      headersUrl: void 0
    });
    report = /* @__PURE__ */ Object.create({
      compact: void 0,
      directory: void 0,
      filename: void 0,
      getReport: notImplemented("process.report.getReport"),
      reportOnFatalError: void 0,
      reportOnSignal: void 0,
      reportOnUncaughtException: void 0,
      signal: void 0,
      writeReport: notImplemented("process.report.writeReport")
    });
    resourceUsage = notImplemented(
      "process.resourceUsage"
    );
    setegid = notImplemented("process.setegid");
    seteuid = notImplemented("process.seteuid");
    setgid = notImplemented("process.setgid");
    setgroups = notImplemented("process.setgroups");
    setuid = notImplemented("process.setuid");
    setMaxListeners = notImplemented(
      "process.setMaxListeners"
    );
    setSourceMapsEnabled = notImplemented("process.setSourceMapsEnabled");
    stdout = proxy_default.__createMock__("process.stdout");
    stderr = proxy_default.__createMock__("process.stderr");
    stdin = proxy_default.__createMock__("process.stdin");
    traceDeprecation = false;
    uptime = /* @__PURE__ */ __name(() => 0, "uptime");
    exitCode = 0;
    setUncaughtExceptionCaptureCallback = notImplemented("process.setUncaughtExceptionCaptureCallback");
    hasUncaughtExceptionCaptureCallback = /* @__PURE__ */ __name(() => false, "hasUncaughtExceptionCaptureCallback");
    sourceMapsEnabled = false;
    loadEnvFile = notImplemented(
      "process.loadEnvFile"
    );
    mainModule = void 0;
    permission = {
      has: () => false
    };
    channel = {
      ref() {
      },
      unref() {
      }
    };
    throwDeprecation = false;
    finalization = {
      register() {
      },
      unregister() {
      },
      registerBeforeExit() {
      }
    };
    assert3 = notImplemented("process.assert");
    openStdin = notImplemented("process.openStdin");
    _debugEnd = notImplemented("process._debugEnd");
    _debugProcess = notImplemented("process._debugProcess");
    _fatalException = notImplemented("process._fatalException");
    _getActiveHandles = notImplemented("process._getActiveHandles");
    _getActiveRequests = notImplemented("process._getActiveRequests");
    _kill = notImplemented("process._kill");
    _preload_modules = [];
    _rawDebug = notImplemented("process._rawDebug");
    _startProfilerIdleNotifier = notImplemented(
      "process._startProfilerIdleNotifier"
    );
    _stopProfilerIdleNotifier = notImplemented(
      "process.__stopProfilerIdleNotifier"
    );
    _tickCallback = notImplemented("process._tickCallback");
    _linkedBinding = notImplemented("process._linkedBinding");
    domain = void 0;
    initgroups = notImplemented("process.initgroups");
    moduleLoadList = [];
    reallyExit = noop;
    _exiting = false;
    _events = [];
    _eventsCount = 0;
    _maxListeners = 0;
    process2 = {
      // @ts-expect-error
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      exitCode,
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      throwDeprecation,
      mainModule,
      permission,
      channel,
      arch,
      argv,
      argv0,
      assert: assert3,
      binding,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      exit,
      finalization,
      features,
      getBuiltinModule,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      nextTick,
      on,
      off,
      once,
      openStdin,
      pid,
      platform,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions
    };
  }
});

// ../../../node_modules/unenv/runtime/node/process/$cloudflare.mjs
var unpatchedGlobalThisProcess, getBuiltinModule2, workerdProcess, env2, exit2, nextTick2, platform2, _process, cloudflare_default2;
var init_cloudflare3 = __esm({
  "../../../node_modules/unenv/runtime/node/process/$cloudflare.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    init_process();
    unpatchedGlobalThisProcess = globalThis["process"];
    getBuiltinModule2 = unpatchedGlobalThisProcess.getBuiltinModule;
    workerdProcess = getBuiltinModule2("node:process");
    ({ env: env2, exit: exit2, nextTick: nextTick2, platform: platform2 } = workerdProcess);
    _process = {
      /**
       * manually unroll unenv-polyfilled-symbols to make it tree-shakeable
       */
      // @ts-expect-error (not typed)
      _debugEnd,
      _debugProcess,
      _events,
      _eventsCount,
      _exiting,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _linkedBinding,
      _maxListeners,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      arch,
      argv,
      argv0,
      assert: assert3,
      availableMemory,
      binding,
      chdir,
      config,
      constrainedMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      domain,
      emit,
      emitWarning,
      eventNames,
      execArgv,
      execPath,
      exit: exit2,
      exitCode,
      features,
      getActiveResourcesInfo,
      getMaxListeners,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      hasUncaughtExceptionCaptureCallback,
      hrtime,
      initgroups,
      kill,
      listenerCount,
      listeners,
      loadEnvFile,
      memoryUsage,
      moduleLoadList,
      off,
      on,
      once,
      openStdin,
      pid,
      platform: platform2,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      reallyExit,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      setUncaughtExceptionCaptureCallback,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      sourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      umask,
      uptime,
      version,
      versions,
      /**
       * manually unroll workerd-polyfilled-symbols to make it tree-shakeable
       */
      env: env2,
      getBuiltinModule: getBuiltinModule2,
      nextTick: nextTick2
    };
    cloudflare_default2 = _process;
  }
});

// ../../../node_modules/wrangler/_virtual_unenv_global_polyfill-process.js
var init_virtual_unenv_global_polyfill_process = __esm({
  "../../../node_modules/wrangler/_virtual_unenv_global_polyfill-process.js"() {
    init_cloudflare3();
    globalThis.process = cloudflare_default2;
  }
});

// ../../../node_modules/unenv/runtime/node/async_hooks/internal/async-local-storage.mjs
var _AsyncLocalStorage, AsyncLocalStorage;
var init_async_local_storage = __esm({
  "../../../node_modules/unenv/runtime/node/async_hooks/internal/async-local-storage.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    _AsyncLocalStorage = class {
      __unenv__ = true;
      _currentStore;
      _enterStore;
      _enabled = true;
      getStore() {
        return this._currentStore ?? this._enterStore;
      }
      disable() {
        this._enabled = false;
      }
      enable() {
        this._enabled = true;
      }
      enterWith(store) {
        this._enterStore = store;
      }
      run(store, callback, ...args) {
        this._currentStore = store;
        const res = callback(...args);
        this._currentStore = void 0;
        return res;
      }
      exit(callback, ...args) {
        const _previousStore = this._currentStore;
        this._currentStore = void 0;
        const res = callback(...args);
        this._currentStore = _previousStore;
        return res;
      }
      static snapshot() {
        throw new Error("[unenv] `AsyncLocalStorage.snapshot` is not implemented!");
      }
    };
    __name(_AsyncLocalStorage, "_AsyncLocalStorage");
    AsyncLocalStorage = globalThis.AsyncLocalStorage || _AsyncLocalStorage;
  }
});

// ../../../node_modules/unenv/runtime/node/async_hooks/internal/async-hook.mjs
var async_hook_exports = {};
__export(async_hook_exports, {
  AsyncHook: () => AsyncHook,
  asyncWrapProviders: () => asyncWrapProviders,
  createHook: () => createHook,
  executionAsyncId: () => executionAsyncId,
  executionAsyncResource: () => executionAsyncResource,
  triggerAsyncId: () => triggerAsyncId
});
var _AsyncHook, AsyncHook, createHook, executionAsyncId, executionAsyncResource, triggerAsyncId, asyncWrapProviders;
var init_async_hook = __esm({
  "../../../node_modules/unenv/runtime/node/async_hooks/internal/async-hook.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    _AsyncHook = class {
      __unenv__ = true;
      _enabled = false;
      _callbacks = {};
      constructor(callbacks = {}) {
        this._callbacks = callbacks;
      }
      enable() {
        this._enabled = true;
        return this;
      }
      disable() {
        this._enabled = false;
        return this;
      }
      init(asyncId, type, triggerAsyncId2, resource) {
        if (this._enabled && this._callbacks.init) {
          this._callbacks.init(asyncId, type, triggerAsyncId2, resource);
        }
      }
      before(asyncId) {
        if (this._enabled && this._callbacks.before) {
          this._callbacks.before(asyncId);
        }
      }
      after(asyncId) {
        if (this._enabled && this._callbacks.after) {
          this._callbacks.after(asyncId);
        }
      }
      destroy(asyncId) {
        if (this._enabled && this._callbacks.destroy) {
          this._callbacks.destroy(asyncId);
        }
      }
      promiseResolve(asyncId) {
        if (this._enabled && this._callbacks.promiseResolve) {
          this._callbacks.promiseResolve(asyncId);
        }
      }
    };
    __name(_AsyncHook, "_AsyncHook");
    AsyncHook = globalThis.AsyncHook || _AsyncHook;
    createHook = /* @__PURE__ */ __name(function createHook2(callbacks) {
      const asyncHook = new _AsyncHook(callbacks);
      return asyncHook;
    }, "createHook2");
    executionAsyncId = /* @__PURE__ */ __name(function executionAsyncId2() {
      return 0;
    }, "executionAsyncId2");
    executionAsyncResource = /* @__PURE__ */ __name(function() {
      return /* @__PURE__ */ Object.create(null);
    }, "executionAsyncResource");
    triggerAsyncId = /* @__PURE__ */ __name(function() {
      return 0;
    }, "triggerAsyncId");
    asyncWrapProviders = Object.assign(/* @__PURE__ */ Object.create(null), {
      NONE: 0,
      DIRHANDLE: 1,
      DNSCHANNEL: 2,
      ELDHISTOGRAM: 3,
      FILEHANDLE: 4,
      FILEHANDLECLOSEREQ: 5,
      BLOBREADER: 6,
      FSEVENTWRAP: 7,
      FSREQCALLBACK: 8,
      FSREQPROMISE: 9,
      GETADDRINFOREQWRAP: 10,
      GETNAMEINFOREQWRAP: 11,
      HEAPSNAPSHOT: 12,
      HTTP2SESSION: 13,
      HTTP2STREAM: 14,
      HTTP2PING: 15,
      HTTP2SETTINGS: 16,
      HTTPINCOMINGMESSAGE: 17,
      HTTPCLIENTREQUEST: 18,
      JSSTREAM: 19,
      JSUDPWRAP: 20,
      MESSAGEPORT: 21,
      PIPECONNECTWRAP: 22,
      PIPESERVERWRAP: 23,
      PIPEWRAP: 24,
      PROCESSWRAP: 25,
      PROMISE: 26,
      QUERYWRAP: 27,
      QUIC_ENDPOINT: 28,
      QUIC_LOGSTREAM: 29,
      QUIC_PACKET: 30,
      QUIC_SESSION: 31,
      QUIC_STREAM: 32,
      QUIC_UDP: 33,
      SHUTDOWNWRAP: 34,
      SIGNALWRAP: 35,
      STATWATCHER: 36,
      STREAMPIPE: 37,
      TCPCONNECTWRAP: 38,
      TCPSERVERWRAP: 39,
      TCPWRAP: 40,
      TTYWRAP: 41,
      UDPSENDWRAP: 42,
      UDPWRAP: 43,
      SIGINTWATCHDOG: 44,
      WORKER: 45,
      WORKERHEAPSNAPSHOT: 46,
      WRITEWRAP: 47,
      ZLIB: 48,
      CHECKPRIMEREQUEST: 49,
      PBKDF2REQUEST: 50,
      KEYPAIRGENREQUEST: 51,
      KEYGENREQUEST: 52,
      KEYEXPORTREQUEST: 53,
      CIPHERREQUEST: 54,
      DERIVEBITSREQUEST: 55,
      HASHREQUEST: 56,
      RANDOMBYTESREQUEST: 57,
      RANDOMPRIMEREQUEST: 58,
      SCRYPTREQUEST: 59,
      SIGNREQUEST: 60,
      TLSWRAP: 61,
      VERIFYREQUEST: 62
    });
  }
});

// ../../../node_modules/unenv/runtime/node/async_hooks/internal/async-resource.mjs
var _asyncIdCounter, _AsyncResource, AsyncResource;
var init_async_resource = __esm({
  "../../../node_modules/unenv/runtime/node/async_hooks/internal/async-resource.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    init_async_hook();
    _asyncIdCounter = 100;
    _AsyncResource = class {
      __unenv__ = true;
      type;
      _asyncId;
      _triggerAsyncId;
      constructor(type, triggerAsyncId2 = executionAsyncId()) {
        this.type = type;
        this._asyncId = -1 * _asyncIdCounter++;
        this._triggerAsyncId = typeof triggerAsyncId2 === "number" ? triggerAsyncId2 : triggerAsyncId2?.triggerAsyncId;
      }
      static bind(fn2, type, thisArg) {
        const resource = new AsyncResource(type ?? "anonymous");
        return resource.bind(fn2);
      }
      bind(fn2, thisArg) {
        const binded = /* @__PURE__ */ __name((...args) => this.runInAsyncScope(fn2, thisArg, ...args), "binded");
        binded.asyncResource = this;
        return binded;
      }
      runInAsyncScope(fn2, thisArg, ...args) {
        const result = fn2.apply(thisArg, args);
        return result;
      }
      emitDestroy() {
        return this;
      }
      asyncId() {
        return this._asyncId;
      }
      triggerAsyncId() {
        return this._triggerAsyncId;
      }
    };
    __name(_AsyncResource, "_AsyncResource");
    AsyncResource = globalThis.AsyncResource || _AsyncResource;
  }
});

// ../../../node_modules/unenv/runtime/node/async_hooks/index.mjs
var async_hooks_default;
var init_async_hooks = __esm({
  "../../../node_modules/unenv/runtime/node/async_hooks/index.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    init_async_local_storage();
    init_async_resource();
    init_async_hook();
    init_async_hook();
    async_hooks_default = {
      AsyncLocalStorage,
      AsyncResource,
      ...async_hook_exports
    };
  }
});

// ../../../node_modules/unenv/runtime/node/async_hooks/$cloudflare.mjs
var cloudflare_exports = {};
__export(cloudflare_exports, {
  AsyncLocalStorage: () => AsyncLocalStorage2,
  AsyncResource: () => AsyncResource2,
  asyncWrapProviders: () => asyncWrapProviders,
  createHook: () => createHook,
  default: () => cloudflare_default3,
  executionAsyncId: () => executionAsyncId,
  executionAsyncResource: () => executionAsyncResource,
  triggerAsyncId: () => triggerAsyncId
});
var workerdAsyncHooks, AsyncLocalStorage2, AsyncResource2, cloudflare_default3;
var init_cloudflare4 = __esm({
  "../../../node_modules/unenv/runtime/node/async_hooks/$cloudflare.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    init_async_hooks();
    init_async_hooks();
    workerdAsyncHooks = process.getBuiltinModule("node:async_hooks");
    ({ AsyncLocalStorage: AsyncLocalStorage2, AsyncResource: AsyncResource2 } = workerdAsyncHooks);
    cloudflare_default3 = {
      /**
       * manually unroll unenv-polyfilled-symbols to make it tree-shakeable
       */
      // @ts-expect-error @types/node is missing this one - this is a bug in typings
      asyncWrapProviders,
      createHook,
      executionAsyncId,
      executionAsyncResource,
      triggerAsyncId,
      /**
       * manually unroll workerd-polyfilled-symbols to make it tree-shakeable
       */
      AsyncLocalStorage: AsyncLocalStorage2,
      AsyncResource: AsyncResource2
    };
  }
});

// _worker.js/index.js
init_virtual_unenv_global_polyfill_process();
init_virtual_unenv_global_polyfill_performance();
init_virtual_unenv_global_polyfill_console();
init_virtual_unenv_global_polyfill_set_immediate();
init_virtual_unenv_global_polyfill_clear_immediate();
import("node:buffer").then(({ Buffer: Buffer2 }) => {
  globalThis.Buffer = Buffer2;
}).catch(() => null);
var __ALSes_PROMISE__ = Promise.resolve().then(() => (init_cloudflare4(), cloudflare_exports)).then(({ AsyncLocalStorage: AsyncLocalStorage3 }) => {
  globalThis.AsyncLocalStorage = AsyncLocalStorage3;
  const envAsyncLocalStorage = new AsyncLocalStorage3();
  const requestContextAsyncLocalStorage = new AsyncLocalStorage3();
  globalThis.process = {
    env: new Proxy(
      {},
      {
        ownKeys: () => Reflect.ownKeys(envAsyncLocalStorage.getStore()),
        getOwnPropertyDescriptor: (_2, ...args) => Reflect.getOwnPropertyDescriptor(envAsyncLocalStorage.getStore(), ...args),
        get: (_2, property) => Reflect.get(envAsyncLocalStorage.getStore(), property),
        set: (_2, property, value) => Reflect.set(envAsyncLocalStorage.getStore(), property, value)
      }
    )
  };
  globalThis[Symbol.for("__cloudflare-request-context__")] = new Proxy(
    {},
    {
      ownKeys: () => Reflect.ownKeys(requestContextAsyncLocalStorage.getStore()),
      getOwnPropertyDescriptor: (_2, ...args) => Reflect.getOwnPropertyDescriptor(requestContextAsyncLocalStorage.getStore(), ...args),
      get: (_2, property) => Reflect.get(requestContextAsyncLocalStorage.getStore(), property),
      set: (_2, property, value) => Reflect.set(requestContextAsyncLocalStorage.getStore(), property, value)
    }
  );
  return { envAsyncLocalStorage, requestContextAsyncLocalStorage };
}).catch(() => null);
var se = Object.create;
var H = Object.defineProperty;
var ae = Object.getOwnPropertyDescriptor;
var ne = Object.getOwnPropertyNames;
var re = Object.getPrototypeOf;
var ie = Object.prototype.hasOwnProperty;
var T = /* @__PURE__ */ __name((e, t) => () => (e && (t = e(e = 0)), t), "T");
var U = /* @__PURE__ */ __name((e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), "U");
var oe = /* @__PURE__ */ __name((e, t, a, s) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let r of ne(t))
      !ie.call(e, r) && r !== a && H(e, r, { get: () => t[r], enumerable: !(s = ae(t, r)) || s.enumerable });
  return e;
}, "oe");
var V = /* @__PURE__ */ __name((e, t, a) => (a = e != null ? se(re(e)) : {}, oe(t || !e || !e.__esModule ? H(a, "default", { value: e, enumerable: true }) : a, e)), "V");
var g;
var u = T(() => {
  g = { collectedLocales: [] };
});
var f;
var l = T(() => {
  f = { version: 3, routes: { none: [{ src: "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$", headers: { Location: "/$1" }, status: 308, continue: true }, { src: "^/_next/__private/trace$", dest: "/404", status: 404, continue: true }, { src: "^/404/?$", status: 404, continue: true, missing: [{ type: "header", key: "x-prerender-revalidate" }] }, { src: "^/500$", status: 500, continue: true }, { src: "^/?$", has: [{ type: "header", key: "rsc" }], dest: "/index.rsc", headers: { vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" }, continue: true, override: true }, { src: "^/((?!.+\\.rsc).+?)(?:/)?$", has: [{ type: "header", key: "rsc" }], dest: "/$1.rsc", headers: { vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" }, continue: true, override: true }], filesystem: [{ src: "^/index(\\.action|\\.rsc)$", dest: "/", continue: true }, { src: "^/_next/data/(.*)$", dest: "/_next/data/$1", check: true }, { src: "^/\\.prefetch\\.rsc$", dest: "/__index.prefetch.rsc", check: true }, { src: "^/(.+)/\\.prefetch\\.rsc$", dest: "/$1.prefetch.rsc", check: true }, { src: "^/\\.rsc$", dest: "/index.rsc", check: true }, { src: "^/(.+)/\\.rsc$", dest: "/$1.rsc", check: true }], miss: [{ src: "^/_next/static/(?:[^/]+/pages|pages|chunks|runtime|css|image|media)/.+$", status: 404, check: true, dest: "$0" }], rewrite: [{ src: "^/_next/data/(.*)$", dest: "/404", status: 404 }, { src: "^/production/(?<nxtPid>[^/]+?)(?:\\.rsc)(?:/)?$", dest: "/production/[id].rsc?nxtPid=$nxtPid" }, { src: "^/production/(?<nxtPid>[^/]+?)(?:/)?$", dest: "/production/[id]?nxtPid=$nxtPid" }], resource: [{ src: "^/.*$", status: 404 }], hit: [{ src: "^/_next/static/(?:[^/]+/pages|pages|chunks|runtime|css|image|media|LWbJTI1NcOfPRwd_ILBBX)/.+$", headers: { "cache-control": "public,max-age=31536000,immutable" }, continue: true, important: true }, { src: "^/index(?:/)?$", headers: { "x-matched-path": "/" }, continue: true, important: true }, { src: "^/((?!index$).*?)(?:/)?$", headers: { "x-matched-path": "/$1" }, continue: true, important: true }], error: [{ src: "^/.*$", dest: "/404", status: 404 }, { src: "^/.*$", dest: "/500", status: 500 }] }, images: { domains: [], sizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840, 16, 32, 48, 64, 96, 128, 256, 384], remotePatterns: [], minimumCacheTTL: 60, formats: ["image/webp"], dangerouslyAllowSVG: false, contentSecurityPolicy: "script-src 'none'; frame-src 'none'; sandbox;", contentDispositionType: "attachment" }, overrides: { "404.html": { path: "404", contentType: "text/html; charset=utf-8" }, "500.html": { path: "500", contentType: "text/html; charset=utf-8" }, "_app.rsc.json": { path: "_app.rsc", contentType: "application/json" }, "_error.rsc.json": { path: "_error.rsc", contentType: "application/json" }, "_document.rsc.json": { path: "_document.rsc", contentType: "application/json" }, "404.rsc.json": { path: "404.rsc", contentType: "application/json" } }, framework: { version: "15.0.4" }, crons: [] };
});
var m;
var d = T(() => {
  m = { "/404.html": { type: "override", path: "/404.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/404.rsc.json": { type: "override", path: "/404.rsc.json", headers: { "content-type": "application/json" } }, "/500.html": { type: "override", path: "/500.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/_app.rsc.json": { type: "override", path: "/_app.rsc.json", headers: { "content-type": "application/json" } }, "/_document.rsc.json": { type: "override", path: "/_document.rsc.json", headers: { "content-type": "application/json" } }, "/_error.rsc.json": { type: "override", path: "/_error.rsc.json", headers: { "content-type": "application/json" } }, "/_next/static/LWbJTI1NcOfPRwd_ILBBX/_buildManifest.js": { type: "static" }, "/_next/static/LWbJTI1NcOfPRwd_ILBBX/_ssgManifest.js": { type: "static" }, "/_next/static/chunks/165-e60011917ba144c3.js": { type: "static" }, "/_next/static/chunks/282-41544138672a1f79.js": { type: "static" }, "/_next/static/chunks/297-67105da6b5ebb23c.js": { type: "static" }, "/_next/static/chunks/371-a92d2c269e96d0a6.js": { type: "static" }, "/_next/static/chunks/423-edcb24aede6d03e0.js": { type: "static" }, "/_next/static/chunks/4bd1b696-c382d9b284a242c9.js": { type: "static" }, "/_next/static/chunks/517-a21e85c3fdc2d9db.js": { type: "static" }, "/_next/static/chunks/555-8df0eb5cd16db712.js": { type: "static" }, "/_next/static/chunks/7-752b491c6396068d.js": { type: "static" }, "/_next/static/chunks/app/(use-header)/home/page-fee6709daf1a7f8c.js": { type: "static" }, "/_next/static/chunks/app/(use-header)/layout-9c5648561ceec055.js": { type: "static" }, "/_next/static/chunks/app/(use-header)/production/(use-profuction)/[id]/page-10f7a0ffca07c290.js": { type: "static" }, "/_next/static/chunks/app/(use-header)/production/page-e5dd37431ec18c85.js": { type: "static" }, "/_next/static/chunks/app/(use-header)/profyle/page-6e559a3ad6ad8f52.js": { type: "static" }, "/_next/static/chunks/app/(use-header)/skill/page-f2aee323580ef7af.js": { type: "static" }, "/_next/static/chunks/app/_not-found/page-bf603915c57eb7c7.js": { type: "static" }, "/_next/static/chunks/app/layout-2c183e5f4322f910.js": { type: "static" }, "/_next/static/chunks/app/page-d752aaa507255cd8.js": { type: "static" }, "/_next/static/chunks/d3ac728e-fe3d08335343d5d2.js": { type: "static" }, "/_next/static/chunks/framework-6b27c2b7aa38af2d.js": { type: "static" }, "/_next/static/chunks/main-app-a3672579edf24340.js": { type: "static" }, "/_next/static/chunks/main-ece3bdca9ae83228.js": { type: "static" }, "/_next/static/chunks/pages/_app-d23763e3e6c904ff.js": { type: "static" }, "/_next/static/chunks/pages/_error-9b7125ad1a1e68fa.js": { type: "static" }, "/_next/static/chunks/polyfills-42372ed130431b0a.js": { type: "static" }, "/_next/static/chunks/webpack-679b75d1c4c2027c.js": { type: "static" }, "/_next/static/css/ef46db3751d8e999.css": { type: "static" }, "/file.svg": { type: "static" }, "/globe.svg": { type: "static" }, "/ment_cat.png": { type: "static" }, "/my_home.jpg": { type: "static" }, "/red_origami.jpg": { type: "static" }, "/red_wasi.jpg": { type: "static" }, "/window.svg": { type: "static" }, "/home": { type: "function", entrypoint: "__next-on-pages-dist__/functions/home.func.js" }, "/home.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/home.func.js" }, "/index": { type: "function", entrypoint: "__next-on-pages-dist__/functions/index.func.js" }, "/": { type: "function", entrypoint: "__next-on-pages-dist__/functions/index.func.js" }, "/index.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/index.func.js" }, "/production/[id]": { type: "function", entrypoint: "__next-on-pages-dist__/functions/production/[id].func.js" }, "/production/[id].rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/production/[id].func.js" }, "/production": { type: "function", entrypoint: "__next-on-pages-dist__/functions/production.func.js" }, "/production.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/production.func.js" }, "/profyle": { type: "function", entrypoint: "__next-on-pages-dist__/functions/profyle.func.js" }, "/profyle.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/profyle.func.js" }, "/skill": { type: "function", entrypoint: "__next-on-pages-dist__/functions/skill.func.js" }, "/skill.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/skill.func.js" }, "/404": { type: "override", path: "/404.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/500": { type: "override", path: "/500.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/_app.rsc": { type: "override", path: "/_app.rsc.json", headers: { "content-type": "application/json" } }, "/_error.rsc": { type: "override", path: "/_error.rsc.json", headers: { "content-type": "application/json" } }, "/_document.rsc": { type: "override", path: "/_document.rsc.json", headers: { "content-type": "application/json" } }, "/404.rsc": { type: "override", path: "/404.rsc.json", headers: { "content-type": "application/json" } }, "/favicon.ico": { type: "override", path: "/favicon.ico", headers: { "cache-control": "public, max-age=0, must-revalidate", "content-type": "image/x-icon", "x-next-cache-tags": "_N_T_/layout,_N_T_/favicon.ico/layout,_N_T_/favicon.ico/route,_N_T_/favicon.ico", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } } };
});
var F = U((Ge, $) => {
  "use strict";
  u();
  l();
  d();
  function R(e, t) {
    e = String(e || "").trim();
    let a = e, s, r = "";
    if (/^[^a-zA-Z\\\s]/.test(e)) {
      s = e[0];
      let o = e.lastIndexOf(s);
      r += e.substring(o + 1), e = e.substring(1, o);
    }
    let n = 0;
    return e = le(e, (o) => {
      if (/^\(\?[P<']/.test(o)) {
        let c = /^\(\?P?[<']([^>']+)[>']/.exec(o);
        if (!c)
          throw new Error(`Failed to extract named captures from ${JSON.stringify(o)}`);
        let h = o.substring(c[0].length, o.length - 1);
        return t && (t[n] = c[1]), n++, `(${h})`;
      }
      return o.substring(0, 3) === "(?:" || n++, o;
    }), e = e.replace(/\[:([^:]+):\]/g, (o, c) => R.characterClasses[c] || o), new R.PCRE(e, r, a, r, s);
  }
  __name(R, "R");
  function le(e, t) {
    let a = 0, s = 0, r = false;
    for (let i = 0; i < e.length; i++) {
      let n = e[i];
      if (r) {
        r = false;
        continue;
      }
      switch (n) {
        case "(":
          s === 0 && (a = i), s++;
          break;
        case ")":
          if (s > 0 && (s--, s === 0)) {
            let o = i + 1, c = a === 0 ? "" : e.substring(0, a), h = e.substring(o), p = String(t(e.substring(a, o)));
            e = c + p + h, i = a;
          }
          break;
        case "\\":
          r = true;
          break;
        default:
          break;
      }
    }
    return e;
  }
  __name(le, "le");
  (function(e) {
    class t extends RegExp {
      constructor(s, r, i, n, o) {
        super(s, r), this.pcrePattern = i, this.pcreFlags = n, this.delimiter = o;
      }
    }
    __name(t, "t");
    e.PCRE = t, e.characterClasses = { alnum: "[A-Za-z0-9]", word: "[A-Za-z0-9_]", alpha: "[A-Za-z]", blank: "[ \\t]", cntrl: "[\\x00-\\x1F\\x7F]", digit: "\\d", graph: "[\\x21-\\x7E]", lower: "[a-z]", print: "[\\x20-\\x7E]", punct: "[\\]\\[!\"#$%&'()*+,./:;<=>?@\\\\^_`{|}~-]", space: "\\s", upper: "[A-Z]", xdigit: "[A-Fa-f0-9]" };
  })(R || (R = {}));
  R.prototype = R.PCRE.prototype;
  $.exports = R;
});
var Z = U((O) => {
  "use strict";
  u();
  l();
  d();
  O.parse = Pe;
  O.serialize = ve;
  var we = Object.prototype.toString, E = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
  function Pe(e, t) {
    if (typeof e != "string")
      throw new TypeError("argument str must be a string");
    for (var a = {}, s = t || {}, r = s.decode || be, i = 0; i < e.length; ) {
      var n = e.indexOf("=", i);
      if (n === -1)
        break;
      var o = e.indexOf(";", i);
      if (o === -1)
        o = e.length;
      else if (o < n) {
        i = e.lastIndexOf(";", n - 1) + 1;
        continue;
      }
      var c = e.slice(i, n).trim();
      if (a[c] === void 0) {
        var h = e.slice(n + 1, o).trim();
        h.charCodeAt(0) === 34 && (h = h.slice(1, -1)), a[c] = ke(h, r);
      }
      i = o + 1;
    }
    return a;
  }
  __name(Pe, "Pe");
  function ve(e, t, a) {
    var s = a || {}, r = s.encode || Se;
    if (typeof r != "function")
      throw new TypeError("option encode is invalid");
    if (!E.test(e))
      throw new TypeError("argument name is invalid");
    var i = r(t);
    if (i && !E.test(i))
      throw new TypeError("argument val is invalid");
    var n = e + "=" + i;
    if (s.maxAge != null) {
      var o = s.maxAge - 0;
      if (isNaN(o) || !isFinite(o))
        throw new TypeError("option maxAge is invalid");
      n += "; Max-Age=" + Math.floor(o);
    }
    if (s.domain) {
      if (!E.test(s.domain))
        throw new TypeError("option domain is invalid");
      n += "; Domain=" + s.domain;
    }
    if (s.path) {
      if (!E.test(s.path))
        throw new TypeError("option path is invalid");
      n += "; Path=" + s.path;
    }
    if (s.expires) {
      var c = s.expires;
      if (!Ce(c) || isNaN(c.valueOf()))
        throw new TypeError("option expires is invalid");
      n += "; Expires=" + c.toUTCString();
    }
    if (s.httpOnly && (n += "; HttpOnly"), s.secure && (n += "; Secure"), s.priority) {
      var h = typeof s.priority == "string" ? s.priority.toLowerCase() : s.priority;
      switch (h) {
        case "low":
          n += "; Priority=Low";
          break;
        case "medium":
          n += "; Priority=Medium";
          break;
        case "high":
          n += "; Priority=High";
          break;
        default:
          throw new TypeError("option priority is invalid");
      }
    }
    if (s.sameSite) {
      var p = typeof s.sameSite == "string" ? s.sameSite.toLowerCase() : s.sameSite;
      switch (p) {
        case true:
          n += "; SameSite=Strict";
          break;
        case "lax":
          n += "; SameSite=Lax";
          break;
        case "strict":
          n += "; SameSite=Strict";
          break;
        case "none":
          n += "; SameSite=None";
          break;
        default:
          throw new TypeError("option sameSite is invalid");
      }
    }
    return n;
  }
  __name(ve, "ve");
  function be(e) {
    return e.indexOf("%") !== -1 ? decodeURIComponent(e) : e;
  }
  __name(be, "be");
  function Se(e) {
    return encodeURIComponent(e);
  }
  __name(Se, "Se");
  function Ce(e) {
    return we.call(e) === "[object Date]" || e instanceof Date;
  }
  __name(Ce, "Ce");
  function ke(e, t) {
    try {
      return t(e);
    } catch {
      return e;
    }
  }
  __name(ke, "ke");
});
u();
l();
d();
u();
l();
d();
u();
l();
d();
var P = "INTERNAL_SUSPENSE_CACHE_HOSTNAME.local";
u();
l();
d();
u();
l();
d();
u();
l();
d();
u();
l();
d();
var q = V(F());
function C(e, t, a) {
  if (t == null)
    return { match: null, captureGroupKeys: [] };
  let s = a ? "" : "i", r = [];
  return { match: (0, q.default)(`%${e}%${s}`, r).exec(t), captureGroupKeys: r };
}
__name(C, "C");
function v(e, t, a, { namedOnly: s } = {}) {
  return e.replace(/\$([a-zA-Z0-9_]+)/g, (r, i) => {
    let n = a.indexOf(i);
    return s && n === -1 ? r : (n === -1 ? t[parseInt(i, 10)] : t[n + 1]) || "";
  });
}
__name(v, "v");
function I(e, { url: t, cookies: a, headers: s, routeDest: r }) {
  switch (e.type) {
    case "host":
      return { valid: t.hostname === e.value };
    case "header":
      return e.value !== void 0 ? j(e.value, s.get(e.key), r) : { valid: s.has(e.key) };
    case "cookie": {
      let i = a[e.key];
      return i && e.value !== void 0 ? j(e.value, i, r) : { valid: i !== void 0 };
    }
    case "query":
      return e.value !== void 0 ? j(e.value, t.searchParams.get(e.key), r) : { valid: t.searchParams.has(e.key) };
  }
}
__name(I, "I");
function j(e, t, a) {
  let { match: s, captureGroupKeys: r } = C(e, t);
  return a && s && r.length ? { valid: !!s, newRouteDest: v(a, s, r, { namedOnly: true }) } : { valid: !!s };
}
__name(j, "j");
u();
l();
d();
function D(e) {
  let t = new Headers(e.headers);
  return e.cf && (t.set("x-vercel-ip-city", encodeURIComponent(e.cf.city)), t.set("x-vercel-ip-country", e.cf.country), t.set("x-vercel-ip-country-region", e.cf.regionCode), t.set("x-vercel-ip-latitude", e.cf.latitude), t.set("x-vercel-ip-longitude", e.cf.longitude)), t.set("x-vercel-sc-host", P), new Request(e, { headers: t });
}
__name(D, "D");
u();
l();
d();
function _(e, t, a) {
  let s = t instanceof Headers ? t.entries() : Object.entries(t);
  for (let [r, i] of s) {
    let n = r.toLowerCase(), o = a?.match ? v(i, a.match, a.captureGroupKeys) : i;
    n === "set-cookie" ? e.append(n, o) : e.set(n, o);
  }
}
__name(_, "_");
function b(e) {
  return /^https?:\/\//.test(e);
}
__name(b, "b");
function x(e, t) {
  for (let [a, s] of t.entries()) {
    let r = /^nxtP(.+)$/.exec(a), i = /^nxtI(.+)$/.exec(a);
    r?.[1] ? (e.set(a, s), e.set(r[1], s)) : i?.[1] ? e.set(i[1], s.replace(/(\(\.+\))+/, "")) : (!e.has(a) || !!s && !e.getAll(a).includes(s)) && e.append(a, s);
  }
}
__name(x, "x");
function L(e, t) {
  let a = new URL(t, e.url);
  return x(a.searchParams, new URL(e.url).searchParams), a.pathname = a.pathname.replace(/\/index.html$/, "/").replace(/\.html$/, ""), new Request(a, e);
}
__name(L, "L");
function S(e) {
  return new Response(e.body, e);
}
__name(S, "S");
function N(e) {
  return e.split(",").map((t) => {
    let [a, s] = t.split(";"), r = parseFloat((s ?? "q=1").replace(/q *= */gi, ""));
    return [a.trim(), isNaN(r) ? 1 : r];
  }).sort((t, a) => a[1] - t[1]).map(([t]) => t === "*" || t === "" ? [] : t).flat();
}
__name(N, "N");
u();
l();
d();
function A(e) {
  switch (e) {
    case "none":
      return "filesystem";
    case "filesystem":
      return "rewrite";
    case "rewrite":
      return "resource";
    case "resource":
      return "miss";
    default:
      return "miss";
  }
}
__name(A, "A");
async function k(e, { request: t, assetsFetcher: a, ctx: s }, { path: r, searchParams: i }) {
  let n, o = new URL(t.url);
  x(o.searchParams, i);
  let c = new Request(o, t);
  try {
    switch (e?.type) {
      case "function":
      case "middleware": {
        let h = await import(e.entrypoint);
        try {
          n = await h.default(c, s);
        } catch (p) {
          let y = p;
          throw y.name === "TypeError" && y.message.endsWith("default is not a function") ? new Error(`An error occurred while evaluating the target edge function (${e.entrypoint})`) : p;
        }
        break;
      }
      case "override": {
        n = S(await a.fetch(L(c, e.path ?? r))), e.headers && _(n.headers, e.headers);
        break;
      }
      case "static": {
        n = await a.fetch(L(c, r));
        break;
      }
      default:
        n = new Response("Not Found", { status: 404 });
    }
  } catch (h) {
    return console.error(h), new Response("Internal Server Error", { status: 500 });
  }
  return S(n);
}
__name(k, "k");
function B(e, t) {
  let a = "^//?(?:", s = ")/(.*)$";
  return !e.startsWith(a) || !e.endsWith(s) ? false : e.slice(a.length, -s.length).split("|").every((i) => t.has(i));
}
__name(B, "B");
u();
l();
d();
function de(e, { protocol: t, hostname: a, port: s, pathname: r }) {
  return !(t && e.protocol.replace(/:$/, "") !== t || !new RegExp(a).test(e.hostname) || s && !new RegExp(s).test(e.port) || r && !new RegExp(r).test(e.pathname));
}
__name(de, "de");
function he(e, t) {
  if (e.method !== "GET")
    return;
  let { origin: a, searchParams: s } = new URL(e.url), r = s.get("url"), i = Number.parseInt(s.get("w") ?? "", 10), n = Number.parseInt(s.get("q") ?? "75", 10);
  if (!r || Number.isNaN(i) || Number.isNaN(n) || !t?.sizes?.includes(i) || n < 0 || n > 100)
    return;
  let o = new URL(r, a);
  if (o.pathname.endsWith(".svg") && !t?.dangerouslyAllowSVG)
    return;
  let c = r.startsWith("//"), h = r.startsWith("/") && !c;
  if (!h && !t?.domains?.includes(o.hostname) && !t?.remotePatterns?.find((w) => de(o, w)))
    return;
  let p = e.headers.get("Accept") ?? "", y = t?.formats?.find((w) => p.includes(w))?.replace("image/", "");
  return { isRelative: h, imageUrl: o, options: { width: i, quality: n, format: y } };
}
__name(he, "he");
function pe(e, t, a) {
  let s = new Headers();
  if (a?.contentSecurityPolicy && s.set("Content-Security-Policy", a.contentSecurityPolicy), a?.contentDispositionType) {
    let i = t.pathname.split("/").pop(), n = i ? `${a.contentDispositionType}; filename="${i}"` : a.contentDispositionType;
    s.set("Content-Disposition", n);
  }
  e.headers.has("Cache-Control") || s.set("Cache-Control", `public, max-age=${a?.minimumCacheTTL ?? 60}`);
  let r = S(e);
  return _(r.headers, s), r;
}
__name(pe, "pe");
async function G(e, { buildOutput: t, assetsFetcher: a, imagesConfig: s }) {
  let r = he(e, s);
  if (!r)
    return new Response("Invalid image resizing request", { status: 400 });
  let { isRelative: i, imageUrl: n } = r, c = await (i && n.pathname in t ? a.fetch.bind(a) : fetch)(n);
  return pe(c, n, s);
}
__name(G, "G");
u();
l();
d();
u();
l();
d();
var fe = "x-vercel-cache-tags";
var me = "x-next-cache-soft-tags";
var ge = Symbol.for("__cloudflare-request-context__");
async function z(e) {
  let t = `https://${P}/v1/suspense-cache/`;
  if (!e.url.startsWith(t))
    return null;
  try {
    let a = new URL(e.url), s = await ye();
    if (a.pathname === "/v1/suspense-cache/revalidate") {
      let i = a.searchParams.get("tags")?.split(",") ?? [];
      for (let n of i)
        await s.revalidateTag(n);
      return new Response(null, { status: 200 });
    }
    let r = a.pathname.replace("/v1/suspense-cache/", "");
    if (!r.length)
      return new Response("Invalid cache key", { status: 400 });
    switch (e.method) {
      case "GET": {
        let i = K(e, me), n = await s.get(r, { softTags: i });
        return n ? new Response(JSON.stringify(n.value), { status: 200, headers: { "Content-Type": "application/json", "x-vercel-cache-state": "fresh", age: `${(Date.now() - (n.lastModified ?? Date.now())) / 1e3}` } }) : new Response(null, { status: 404 });
      }
      case "POST": {
        let i = globalThis[ge], n = /* @__PURE__ */ __name(async () => {
          let o = await e.json();
          o.data.tags === void 0 && (o.tags ??= K(e, fe) ?? []), await s.set(r, o);
        }, "n");
        return i ? i.ctx.waitUntil(n()) : await n(), new Response(null, { status: 200 });
      }
      default:
        return new Response(null, { status: 405 });
    }
  } catch (a) {
    return console.error(a), new Response("Error handling cache request", { status: 500 });
  }
}
__name(z, "z");
async function ye() {
  return process.env.__NEXT_ON_PAGES__KV_SUSPENSE_CACHE ? W("kv") : W("cache-api");
}
__name(ye, "ye");
async function W(e) {
  let t = await import(`./__next-on-pages-dist__/cache/${e}.js`);
  return new t.default();
}
__name(W, "W");
function K(e, t) {
  return e.headers.get(t)?.split(",")?.filter(Boolean);
}
__name(K, "K");
function X() {
  globalThis[J] || (_e(), globalThis[J] = true);
}
__name(X, "X");
function _e() {
  let e = globalThis.fetch;
  globalThis.fetch = async (...t) => {
    let a = new Request(...t), s = await xe(a);
    return s || (s = await z(a), s) ? s : (Re(a), e(a));
  };
}
__name(_e, "_e");
async function xe(e) {
  if (e.url.startsWith("blob:"))
    try {
      let a = (await import(`./__next-on-pages-dist__/assets/${new URL(e.url).pathname}.bin`)).default, s = { async arrayBuffer() {
        return a;
      }, get body() {
        return new ReadableStream({ start(r) {
          let i = Buffer.from(a);
          r.enqueue(i), r.close();
        } });
      }, async text() {
        return Buffer.from(a).toString();
      }, async json() {
        let r = Buffer.from(a);
        return JSON.stringify(r.toString());
      }, async blob() {
        return new Blob(a);
      } };
      return s.clone = () => ({ ...s }), s;
    } catch {
    }
  return null;
}
__name(xe, "xe");
function Re(e) {
  e.headers.has("user-agent") || e.headers.set("user-agent", "Next.js Middleware");
}
__name(Re, "Re");
var J = Symbol.for("next-on-pages fetch patch");
u();
l();
d();
var Q = V(Z());
var M = /* @__PURE__ */ __name(class {
  constructor(t, a, s, r, i) {
    this.routes = t;
    this.output = a;
    this.reqCtx = s;
    this.url = new URL(s.request.url), this.cookies = (0, Q.parse)(s.request.headers.get("cookie") || ""), this.path = this.url.pathname || "/", this.headers = { normal: new Headers(), important: new Headers() }, this.searchParams = new URLSearchParams(), x(this.searchParams, this.url.searchParams), this.checkPhaseCounter = 0, this.middlewareInvoked = [], this.wildcardMatch = i?.find((n) => n.domain === this.url.hostname), this.locales = new Set(r.collectedLocales);
  }
  url;
  cookies;
  wildcardMatch;
  path;
  status;
  headers;
  searchParams;
  body;
  checkPhaseCounter;
  middlewareInvoked;
  locales;
  checkRouteMatch(t, { checkStatus: a, checkIntercept: s }) {
    let r = C(t.src, this.path, t.caseSensitive);
    if (!r.match || t.methods && !t.methods.map((n) => n.toUpperCase()).includes(this.reqCtx.request.method.toUpperCase()))
      return;
    let i = { url: this.url, cookies: this.cookies, headers: this.reqCtx.request.headers, routeDest: t.dest };
    if (!t.has?.find((n) => {
      let o = I(n, i);
      return o.newRouteDest && (i.routeDest = o.newRouteDest), !o.valid;
    }) && !t.missing?.find((n) => I(n, i).valid) && !(a && t.status !== this.status)) {
      if (s && t.dest) {
        let n = /\/(\(\.+\))+/, o = n.test(t.dest), c = n.test(this.path);
        if (o && !c)
          return;
      }
      return { routeMatch: r, routeDest: i.routeDest };
    }
  }
  processMiddlewareResp(t) {
    let a = "x-middleware-override-headers", s = t.headers.get(a);
    if (s) {
      let c = new Set(s.split(",").map((h) => h.trim()));
      for (let h of c.keys()) {
        let p = `x-middleware-request-${h}`, y = t.headers.get(p);
        this.reqCtx.request.headers.get(h) !== y && (y ? this.reqCtx.request.headers.set(h, y) : this.reqCtx.request.headers.delete(h)), t.headers.delete(p);
      }
      t.headers.delete(a);
    }
    let r = "x-middleware-rewrite", i = t.headers.get(r);
    if (i) {
      let c = new URL(i, this.url), h = this.url.hostname !== c.hostname;
      this.path = h ? `${c}` : c.pathname, x(this.searchParams, c.searchParams), t.headers.delete(r);
    }
    let n = "x-middleware-next";
    t.headers.get(n) ? t.headers.delete(n) : !i && !t.headers.has("location") ? (this.body = t.body, this.status = t.status) : t.headers.has("location") && t.status >= 300 && t.status < 400 && (this.status = t.status), _(this.reqCtx.request.headers, t.headers), _(this.headers.normal, t.headers), this.headers.middlewareLocation = t.headers.get("location");
  }
  async runRouteMiddleware(t) {
    if (!t)
      return true;
    let a = t && this.output[t];
    if (!a || a.type !== "middleware")
      return this.status = 500, false;
    let s = await k(a, this.reqCtx, { path: this.path, searchParams: this.searchParams, headers: this.headers, status: this.status });
    return this.middlewareInvoked.push(t), s.status === 500 ? (this.status = s.status, false) : (this.processMiddlewareResp(s), true);
  }
  applyRouteOverrides(t) {
    !t.override || (this.status = void 0, this.headers.normal = new Headers(), this.headers.important = new Headers());
  }
  applyRouteHeaders(t, a, s) {
    !t.headers || (_(this.headers.normal, t.headers, { match: a, captureGroupKeys: s }), t.important && _(this.headers.important, t.headers, { match: a, captureGroupKeys: s }));
  }
  applyRouteStatus(t) {
    !t.status || (this.status = t.status);
  }
  applyRouteDest(t, a, s) {
    if (!t.dest)
      return this.path;
    let r = this.path, i = t.dest;
    this.wildcardMatch && /\$wildcard/.test(i) && (i = i.replace(/\$wildcard/g, this.wildcardMatch.value)), this.path = v(i, a, s);
    let n = /\/index\.rsc$/i.test(this.path), o = /^\/(?:index)?$/i.test(r), c = /^\/__index\.prefetch\.rsc$/i.test(r);
    n && !o && !c && (this.path = r);
    let h = /\.rsc$/i.test(this.path), p = /\.prefetch\.rsc$/i.test(this.path), y = this.path in this.output;
    h && !p && !y && (this.path = this.path.replace(/\.rsc/i, ""));
    let w = new URL(this.path, this.url);
    return x(this.searchParams, w.searchParams), b(this.path) || (this.path = w.pathname), r;
  }
  applyLocaleRedirects(t) {
    if (!t.locale?.redirect || !/^\^(.)*$/.test(t.src) && t.src !== this.path || this.headers.normal.has("location"))
      return;
    let { locale: { redirect: s, cookie: r } } = t, i = r && this.cookies[r], n = N(i ?? ""), o = N(this.reqCtx.request.headers.get("accept-language") ?? ""), p = [...n, ...o].map((y) => s[y]).filter(Boolean)[0];
    if (p) {
      !this.path.startsWith(p) && (this.headers.normal.set("location", p), this.status = 307);
      return;
    }
  }
  getLocaleFriendlyRoute(t, a) {
    return !this.locales || a !== "miss" ? t : B(t.src, this.locales) ? { ...t, src: t.src.replace(/\/\(\.\*\)\$$/, "(?:/(.*))?$") } : t;
  }
  async checkRoute(t, a) {
    let s = this.getLocaleFriendlyRoute(a, t), { routeMatch: r, routeDest: i } = this.checkRouteMatch(s, { checkStatus: t === "error", checkIntercept: t === "rewrite" }) ?? {}, n = { ...s, dest: i };
    if (!r?.match || n.middlewarePath && this.middlewareInvoked.includes(n.middlewarePath))
      return "skip";
    let { match: o, captureGroupKeys: c } = r;
    if (this.applyRouteOverrides(n), this.applyLocaleRedirects(n), !await this.runRouteMiddleware(n.middlewarePath))
      return "error";
    if (this.body !== void 0 || this.headers.middlewareLocation)
      return "done";
    this.applyRouteHeaders(n, o, c), this.applyRouteStatus(n);
    let p = this.applyRouteDest(n, o, c);
    if (n.check && !b(this.path))
      if (p === this.path) {
        if (t !== "miss")
          return this.checkPhase(A(t));
        this.status = 404;
      } else if (t === "miss") {
        if (!(this.path in this.output) && !(this.path.replace(/\/$/, "") in this.output))
          return this.checkPhase("filesystem");
        this.status === 404 && (this.status = void 0);
      } else
        return this.checkPhase("none");
    return !n.continue || n.status && n.status >= 300 && n.status <= 399 ? "done" : "next";
  }
  async checkPhase(t) {
    if (this.checkPhaseCounter++ >= 50)
      return console.error(`Routing encountered an infinite loop while checking ${this.url.pathname}`), this.status = 500, "error";
    this.middlewareInvoked = [];
    let a = true;
    for (let i of this.routes[t]) {
      let n = await this.checkRoute(t, i);
      if (n === "error")
        return "error";
      if (n === "done") {
        a = false;
        break;
      }
    }
    if (t === "hit" || b(this.path) || this.headers.normal.has("location") || !!this.body)
      return "done";
    if (t === "none")
      for (let i of this.locales) {
        let n = new RegExp(`/${i}(/.*)`), c = this.path.match(n)?.[1];
        if (c && c in this.output) {
          this.path = c;
          break;
        }
      }
    let s = this.path in this.output;
    if (!s && this.path.endsWith("/")) {
      let i = this.path.replace(/\/$/, "");
      s = i in this.output, s && (this.path = i);
    }
    if (t === "miss" && !s) {
      let i = !this.status || this.status < 400;
      this.status = i ? 404 : this.status;
    }
    let r = "miss";
    return s || t === "miss" || t === "error" ? r = "hit" : a && (r = A(t)), this.checkPhase(r);
  }
  async run(t = "none") {
    this.checkPhaseCounter = 0;
    let a = await this.checkPhase(t);
    return this.headers.normal.has("location") && (!this.status || this.status < 300 || this.status >= 400) && (this.status = 307), a;
  }
}, "M");
async function Y(e, t, a, s) {
  let r = new M(t.routes, a, e, s, t.wildcard), i = await ee(r);
  return Ee(e, i, a);
}
__name(Y, "Y");
async function ee(e, t = "none", a = false) {
  return await e.run(t) === "error" || !a && e.status && e.status >= 400 ? ee(e, "error", true) : { path: e.path, status: e.status, headers: e.headers, searchParams: e.searchParams, body: e.body };
}
__name(ee, "ee");
async function Ee(e, { path: t = "/404", status: a, headers: s, searchParams: r, body: i }, n) {
  let o = s.normal.get("location");
  if (o) {
    if (o !== s.middlewareLocation) {
      let p = [...r.keys()].length ? `?${r.toString()}` : "";
      s.normal.set("location", `${o ?? "/"}${p}`);
    }
    return new Response(null, { status: a, headers: s.normal });
  }
  let c;
  if (i !== void 0)
    c = new Response(i, { status: a });
  else if (b(t)) {
    let p = new URL(t);
    x(p.searchParams, r), c = await fetch(p, e.request);
  } else
    c = await k(n[t], e, { path: t, status: a, headers: s, searchParams: r });
  let h = s.normal;
  return _(h, c.headers), _(h, s.important), c = new Response(c.body, { ...c, status: a || c.status, headers: h }), c;
}
__name(Ee, "Ee");
u();
l();
d();
function te() {
  globalThis.__nextOnPagesRoutesIsolation ??= { _map: /* @__PURE__ */ new Map(), getProxyFor: Me };
}
__name(te, "te");
function Me(e) {
  let t = globalThis.__nextOnPagesRoutesIsolation._map.get(e);
  if (t)
    return t;
  let a = Te();
  return globalThis.__nextOnPagesRoutesIsolation._map.set(e, a), a;
}
__name(Me, "Me");
function Te() {
  let e = /* @__PURE__ */ new Map();
  return new Proxy(globalThis, { get: (t, a) => e.has(a) ? e.get(a) : Reflect.get(globalThis, a), set: (t, a, s) => je.has(a) ? Reflect.set(globalThis, a, s) : (e.set(a, s), true) });
}
__name(Te, "Te");
var je = /* @__PURE__ */ new Set(["_nextOriginalFetch", "fetch", "__incrementalCache"]);
var ms = { async fetch(e, t, a) {
  te(), X();
  let s = await __ALSes_PROMISE__;
  if (!s) {
    let n = new URL(e.url), o = await t.ASSETS.fetch(`${n.protocol}//${n.host}/cdn-cgi/errors/no-nodejs_compat.html`), c = o.ok ? o.body : "Error: Could not access built-in Node.js modules. Please make sure that your Cloudflare Pages project has the 'nodejs_compat' compatibility flag set.";
    return new Response(c, { status: 503 });
  }
  let { envAsyncLocalStorage: r, requestContextAsyncLocalStorage: i } = s;
  return r.run({ ...t, NODE_ENV: "production", SUSPENSE_CACHE_URL: P }, async () => i.run({ env: t, ctx: a, cf: e.cf }, async () => {
    if (new URL(e.url).pathname.startsWith("/_next/image"))
      return G(e, { buildOutput: m, assetsFetcher: t.ASSETS, imagesConfig: f.images });
    let o = D(e);
    return Y({ request: o, ctx: a, assetsFetcher: t.ASSETS }, f, m, g);
  }));
} };
export {
  ms as default
};
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
//# sourceMappingURL=bundledWorker-0.6446637170486265.mjs.map
