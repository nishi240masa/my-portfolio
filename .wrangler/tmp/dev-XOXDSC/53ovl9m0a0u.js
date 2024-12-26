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
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// node_modules/wrangler/_virtual_unenv_global_polyfill-clear$immediate.js
globalThis.clearImmediate = clearImmediateFallback;

// node_modules/unenv/runtime/_internal/utils.mjs
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
function notImplemented(name) {
  const fn3 = /* @__PURE__ */ __name(() => {
    throw createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn3, { __unenv__: true });
}
__name(notImplemented, "notImplemented");

// node_modules/unenv/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// node_modules/unenv/runtime/node/timers/internal/immediate.mjs
var Immediate = class {
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

// node_modules/unenv/runtime/node/timers/internal/set-immediate.mjs
function setImmediateFallbackPromises(value) {
  return new Promise((res) => {
    res(value);
  });
}
__name(setImmediateFallbackPromises, "setImmediateFallbackPromises");
function setImmediateFallback(callback, ...args) {
  return new Immediate(callback, args);
}
__name(setImmediateFallback, "setImmediateFallback");
setImmediateFallback.__promisify__ = setImmediateFallbackPromises;
function clearImmediateFallback(immediate) {
  immediate?.[Symbol.dispose]();
}
__name(clearImmediateFallback, "clearImmediateFallback");

// node_modules/wrangler/_virtual_unenv_global_polyfill-set$immediate.js
globalThis.setImmediate = setImmediateFallback;

// node_modules/unenv/runtime/node/console/index.mjs
import { Writable } from "node:stream";

// node_modules/unenv/runtime/mock/proxy.mjs
var fn = /* @__PURE__ */ __name(function() {
}, "fn");
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
__name(createMock, "createMock");
var proxy_default = createMock("mock");

// node_modules/unenv/runtime/node/console/index.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? notImplemented("console.createTask");
var assert = notImplemented("console.assert");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? proxy_default.__createMock__("console.Console");

// node_modules/unenv/runtime/node/console/$cloudflare.mjs
var workerdConsole = globalThis["console"];
var {
  assert: assert2,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
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
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler: noop_default,
  _stdout,
  _stdoutErrorHandler: noop_default,
  _times: proxy_default
});
var cloudflare_default = workerdConsole;

// node_modules/wrangler/_virtual_unenv_global_polyfill-console.js
globalThis.console = cloudflare_default;

// node_modules/unenv/runtime/web/performance/_entry.mjs
var _supportedEntryTypes = [
  "event",
  // PerformanceEntry
  "mark",
  // PerformanceMark
  "measure",
  // PerformanceMeasure
  "resource"
  // PerformanceResourceTiming
];
var _PerformanceEntry = class {
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
var PerformanceEntry = globalThis.PerformanceEntry || _PerformanceEntry;
var _PerformanceMark = class extends _PerformanceEntry {
  entryType = "mark";
};
__name(_PerformanceMark, "_PerformanceMark");
var PerformanceMark = globalThis.PerformanceMark || _PerformanceMark;
var _PerformanceMeasure = class extends _PerformanceEntry {
  entryType = "measure";
};
__name(_PerformanceMeasure, "_PerformanceMeasure");
var PerformanceMeasure = globalThis.PerformanceMeasure || _PerformanceMeasure;
var _PerformanceResourceTiming = class extends _PerformanceEntry {
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
var PerformanceResourceTiming = globalThis.PerformanceResourceTiming || _PerformanceResourceTiming;

// node_modules/unenv/runtime/web/performance/_performance.mjs
var _timeOrigin = Date.now();
var _Performance = class {
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
var Performance = globalThis.Performance || _Performance;
var performance2 = globalThis.performance || new Performance();

// node_modules/unenv/runtime/web/performance/_observer.mjs
var _PerformanceObserver = class {
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
var PerformanceObserver = globalThis.PerformanceObserver || _PerformanceObserver;
var _PerformanceObserverEntryList = class {
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
var PerformanceObserverEntryList = globalThis.PerformanceObserverEntryList || _PerformanceObserverEntryList;

// node_modules/unenv/runtime/polyfill/global-this.mjs
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
__name(getGlobal, "getGlobal");
var global_this_default = getGlobal();

// node_modules/unenv/runtime/polyfill/performance.mjs
global_this_default.performance = global_this_default.performance || performance2;
global_this_default.Performance = global_this_default.Performance || Performance;
global_this_default.PerformanceEntry = global_this_default.PerformanceEntry || PerformanceEntry;
global_this_default.PerformanceMark = global_this_default.PerformanceMark || PerformanceMark;
global_this_default.PerformanceMeasure = global_this_default.PerformanceMeasure || PerformanceMeasure;
global_this_default.PerformanceObserver = global_this_default.PerformanceObserver || PerformanceObserver;
global_this_default.PerformanceObserverEntryList = global_this_default.PerformanceObserverEntryList || PerformanceObserverEntryList;
global_this_default.PerformanceResourceTiming = global_this_default.PerformanceResourceTiming || PerformanceResourceTiming;
var performance_default = global_this_default.performance;

// node_modules/wrangler/_virtual_unenv_global_polyfill-performance.js
globalThis.performance = performance_default;

// node_modules/unenv/runtime/mock/empty.mjs
var empty_default = Object.freeze(
  Object.create(null, {
    __unenv__: { get: () => true }
  })
);

// node_modules/unenv/runtime/node/process/internal/env.mjs
var _envShim = /* @__PURE__ */ Object.create(null);
var _processEnv = globalThis.process?.env;
var _getEnv = /* @__PURE__ */ __name((useShim) => _processEnv || globalThis.__env__ || (useShim ? _envShim : globalThis), "_getEnv");
var env = new Proxy(_envShim, {
  get(_2, prop) {
    const env23 = _getEnv();
    return env23[prop] ?? _envShim[prop];
  },
  has(_2, prop) {
    const env23 = _getEnv();
    return prop in env23 || prop in _envShim;
  },
  set(_2, prop, value) {
    const env23 = _getEnv(true);
    env23[prop] = value;
    return true;
  },
  deleteProperty(_2, prop) {
    const env23 = _getEnv(true);
    delete env23[prop];
    return true;
  },
  ownKeys() {
    const env23 = _getEnv();
    return Object.keys(env23);
  }
});

// node_modules/unenv/runtime/node/process/internal/time.mjs
var hrtime = Object.assign(
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
var nextTick = globalThis.queueMicrotask ? (cb, ...args) => {
  globalThis.queueMicrotask(cb.bind(void 0, ...args));
} : _createNextTickWithTimeout();
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
  const nextTick23 = /* @__PURE__ */ __name((cb, ...args) => {
    queue.push(cb.bind(void 0, ...args));
    if (queue.length === 1 && !draining) {
      setTimeout(drainQueue);
    }
  }, "nextTick2");
  return nextTick23;
}
__name(_createNextTickWithTimeout, "_createNextTickWithTimeout");

// node_modules/unenv/runtime/node/process/internal/process.mjs
var title = "unenv";
var argv = [];
var version = "";
var versions = {
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
function noop() {
  return process2;
}
__name(noop, "noop");
var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = /* @__PURE__ */ __name(function emit2(event) {
  if (event === "message" || event === "multipleResolves") {
    return process2;
  }
  return false;
}, "emit2");
var prependListener = noop;
var prependOnceListener = noop;
var listeners = /* @__PURE__ */ __name(function(name) {
  return [];
}, "listeners");
var listenerCount = /* @__PURE__ */ __name(() => 0, "listenerCount");
var binding = /* @__PURE__ */ __name(function(name) {
  throw new Error("[unenv] process.binding is not supported");
}, "binding");
var _cwd = "/";
var cwd = /* @__PURE__ */ __name(function cwd2() {
  return _cwd;
}, "cwd2");
var chdir = /* @__PURE__ */ __name(function chdir2(dir4) {
  _cwd = dir4;
}, "chdir2");
var umask = /* @__PURE__ */ __name(function umask2() {
  return 0;
}, "umask2");
var getegid = /* @__PURE__ */ __name(function getegid2() {
  return 1e3;
}, "getegid2");
var geteuid = /* @__PURE__ */ __name(function geteuid2() {
  return 1e3;
}, "geteuid2");
var getgid = /* @__PURE__ */ __name(function getgid2() {
  return 1e3;
}, "getgid2");
var getuid = /* @__PURE__ */ __name(function getuid2() {
  return 1e3;
}, "getuid2");
var getgroups = /* @__PURE__ */ __name(function getgroups2() {
  return [];
}, "getgroups2");
var getBuiltinModule = /* @__PURE__ */ __name((_name) => void 0, "getBuiltinModule");
var abort = notImplemented("process.abort");
var allowedNodeEnvironmentFlags = /* @__PURE__ */ new Set();
var arch = "";
var argv0 = "";
var config = empty_default;
var connected = false;
var constrainedMemory = /* @__PURE__ */ __name(() => 0, "constrainedMemory");
var availableMemory = /* @__PURE__ */ __name(() => 0, "availableMemory");
var cpuUsage = notImplemented("process.cpuUsage");
var debugPort = 0;
var dlopen = notImplemented("process.dlopen");
var disconnect = noop;
var emitWarning = noop;
var eventNames = notImplemented("process.eventNames");
var execArgv = [];
var execPath = "";
var exit = notImplemented("process.exit");
var features = /* @__PURE__ */ Object.create({
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
var getActiveResourcesInfo = /* @__PURE__ */ __name(() => [], "getActiveResourcesInfo");
var getMaxListeners = notImplemented(
  "process.getMaxListeners"
);
var kill = notImplemented("process.kill");
var memoryUsage = Object.assign(
  () => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }),
  { rss: () => 0 }
);
var pid = 1e3;
var platform = "";
var ppid = 1e3;
var rawListeners = notImplemented(
  "process.rawListeners"
);
var release = /* @__PURE__ */ Object.create({
  name: "",
  lts: "",
  sourceUrl: void 0,
  headersUrl: void 0
});
var report = /* @__PURE__ */ Object.create({
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
var resourceUsage = notImplemented(
  "process.resourceUsage"
);
var setegid = notImplemented("process.setegid");
var seteuid = notImplemented("process.seteuid");
var setgid = notImplemented("process.setgid");
var setgroups = notImplemented("process.setgroups");
var setuid = notImplemented("process.setuid");
var setMaxListeners = notImplemented(
  "process.setMaxListeners"
);
var setSourceMapsEnabled = notImplemented("process.setSourceMapsEnabled");
var stdout = proxy_default.__createMock__("process.stdout");
var stderr = proxy_default.__createMock__("process.stderr");
var stdin = proxy_default.__createMock__("process.stdin");
var traceDeprecation = false;
var uptime = /* @__PURE__ */ __name(() => 0, "uptime");
var exitCode = 0;
var setUncaughtExceptionCaptureCallback = notImplemented("process.setUncaughtExceptionCaptureCallback");
var hasUncaughtExceptionCaptureCallback = /* @__PURE__ */ __name(() => false, "hasUncaughtExceptionCaptureCallback");
var sourceMapsEnabled = false;
var loadEnvFile = notImplemented(
  "process.loadEnvFile"
);
var mainModule = void 0;
var permission = {
  has: () => false
};
var channel = {
  ref() {
  },
  unref() {
  }
};
var throwDeprecation = false;
var finalization = {
  register() {
  },
  unregister() {
  },
  registerBeforeExit() {
  }
};
var assert3 = notImplemented("process.assert");
var openStdin = notImplemented("process.openStdin");
var _debugEnd = notImplemented("process._debugEnd");
var _debugProcess = notImplemented("process._debugProcess");
var _fatalException = notImplemented("process._fatalException");
var _getActiveHandles = notImplemented("process._getActiveHandles");
var _getActiveRequests = notImplemented("process._getActiveRequests");
var _kill = notImplemented("process._kill");
var _preload_modules = [];
var _rawDebug = notImplemented("process._rawDebug");
var _startProfilerIdleNotifier = notImplemented(
  "process._startProfilerIdleNotifier"
);
var _stopProfilerIdleNotifier = notImplemented(
  "process.__stopProfilerIdleNotifier"
);
var _tickCallback = notImplemented("process._tickCallback");
var _linkedBinding = notImplemented("process._linkedBinding");
var domain = void 0;
var initgroups = notImplemented("process.initgroups");
var moduleLoadList = [];
var reallyExit = noop;
var _exiting = false;
var _events = [];
var _eventsCount = 0;
var _maxListeners = 0;
var process2 = {
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

// node_modules/unenv/runtime/node/process/$cloudflare.mjs
var unpatchedGlobalThisProcess = globalThis["process"];
var getBuiltinModule2 = unpatchedGlobalThisProcess.getBuiltinModule;
var workerdProcess = getBuiltinModule2("node:process");
var { env: env2, exit: exit2, nextTick: nextTick2, platform: platform2 } = workerdProcess;
var _process = {
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
var cloudflare_default2 = _process;

// node_modules/wrangler/_virtual_unenv_global_polyfill-process.js
globalThis.process = cloudflare_default2;

// .wrangler/tmp/pages-4AmyS0/bundledWorker-0.6446637170486265.mjs
import { Writable as Writable2 } from "node:stream";
var __defProp2 = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __defNormalProp2 = /* @__PURE__ */ __name((obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value, "__defNormalProp");
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var __esm = /* @__PURE__ */ __name((fn22, res) => /* @__PURE__ */ __name(function __init() {
  return fn22 && (res = (0, fn22[__getOwnPropNames(fn22)[0]])(fn22 = 0)), res;
}, "__init"), "__esm");
var __export = /* @__PURE__ */ __name((target, all) => {
  for (var name in all)
    __defProp2(target, name, { get: all[name], enumerable: true });
}, "__export");
var __publicField2 = /* @__PURE__ */ __name((obj, key, value) => {
  __defNormalProp2(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
}, "__publicField");
var init_virtual_unenv_global_polyfill_clear_immediate = __esm({
  "../../../node_modules/wrangler/_virtual_unenv_global_polyfill-clear$immediate.js"() {
    init_cloudflare();
    globalThis.clearImmediate = clearImmediateFallback2;
  }
});
function createNotImplementedError2(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError2, "createNotImplementedError");
function notImplemented2(name) {
  const fn22 = /* @__PURE__ */ __name2(() => {
    throw createNotImplementedError2(name);
  }, "fn");
  return Object.assign(fn22, { __unenv__: true });
}
__name(notImplemented2, "notImplemented");
var init_utils = __esm({
  "../../../node_modules/unenv/runtime/_internal/utils.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    __name2(createNotImplementedError2, "createNotImplementedError");
    __name2(notImplemented2, "notImplemented");
  }
});
var noop_default2;
var init_noop = __esm({
  "../../../node_modules/unenv/runtime/mock/noop.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    noop_default2 = Object.assign(() => {
    }, { __unenv__: true });
  }
});
var Immediate2;
var init_immediate = __esm({
  "../../../node_modules/unenv/runtime/node/timers/internal/immediate.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    Immediate2 = /* @__PURE__ */ __name(class {
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
    }, "Immediate");
    __name2(Immediate2, "Immediate");
  }
});
function setImmediateFallbackPromises2(value) {
  return new Promise((res) => {
    res(value);
  });
}
__name(setImmediateFallbackPromises2, "setImmediateFallbackPromises");
function setImmediateFallback2(callback, ...args) {
  return new Immediate2(callback, args);
}
__name(setImmediateFallback2, "setImmediateFallback");
function clearImmediateFallback2(immediate) {
  immediate?.[Symbol.dispose]();
}
__name(clearImmediateFallback2, "clearImmediateFallback");
var init_set_immediate = __esm({
  "../../../node_modules/unenv/runtime/node/timers/internal/set-immediate.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    init_immediate();
    __name2(setImmediateFallbackPromises2, "setImmediateFallbackPromises");
    __name2(setImmediateFallback2, "setImmediateFallback");
    setImmediateFallback2.__promisify__ = setImmediateFallbackPromises2;
    __name2(clearImmediateFallback2, "clearImmediateFallback");
  }
});
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
var init_virtual_unenv_global_polyfill_set_immediate = __esm({
  "../../../node_modules/wrangler/_virtual_unenv_global_polyfill-set$immediate.js"() {
    init_cloudflare();
    globalThis.setImmediate = setImmediateFallback2;
  }
});
function createMock2(name, overrides = {}) {
  fn2.prototype.name = name;
  const props = {};
  return new Proxy(fn2, {
    get(_target, prop) {
      if (prop === "caller") {
        return null;
      }
      if (prop === "__createMock__") {
        return createMock2;
      }
      if (prop === "__unenv__") {
        return true;
      }
      if (prop in overrides) {
        return overrides[prop];
      }
      return props[prop] = props[prop] || createMock2(`${name}.${prop.toString()}`);
    },
    apply(_target, _this, _args) {
      return createMock2(`${name}()`);
    },
    construct(_target, _args, _newT) {
      return createMock2(`[${name}]`);
    },
    // @ts-ignore (ES6-only - removed in ES7)
    // https://github.com/tc39/ecma262/issues/161
    enumerate() {
      return [];
    }
  });
}
__name(createMock2, "createMock");
var fn2;
var proxy_default2;
var init_proxy = __esm({
  "../../../node_modules/unenv/runtime/mock/proxy.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    fn2 = /* @__PURE__ */ __name2(function() {
    }, "fn");
    __name2(createMock2, "createMock");
    proxy_default2 = createMock2("mock");
  }
});
var _console2;
var _ignoreErrors2;
var _stderr2;
var _stdout2;
var log3;
var info3;
var trace3;
var debug3;
var table3;
var error3;
var warn3;
var createTask3;
var assert4;
var clear3;
var count3;
var countReset3;
var dir3;
var dirxml3;
var group3;
var groupEnd3;
var groupCollapsed3;
var profile3;
var profileEnd3;
var time3;
var timeEnd3;
var timeLog3;
var timeStamp3;
var Console2;
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
    _console2 = globalThis.console;
    _ignoreErrors2 = true;
    _stderr2 = new Writable2();
    _stdout2 = new Writable2();
    log3 = _console2?.log ?? noop_default2;
    info3 = _console2?.info ?? log3;
    trace3 = _console2?.trace ?? info3;
    debug3 = _console2?.debug ?? log3;
    table3 = _console2?.table ?? log3;
    error3 = _console2?.error ?? log3;
    warn3 = _console2?.warn ?? error3;
    createTask3 = _console2?.createTask ?? notImplemented2("console.createTask");
    assert4 = notImplemented2("console.assert");
    clear3 = _console2?.clear ?? noop_default2;
    count3 = _console2?.count ?? noop_default2;
    countReset3 = _console2?.countReset ?? noop_default2;
    dir3 = _console2?.dir ?? noop_default2;
    dirxml3 = _console2?.dirxml ?? noop_default2;
    group3 = _console2?.group ?? noop_default2;
    groupEnd3 = _console2?.groupEnd ?? noop_default2;
    groupCollapsed3 = _console2?.groupCollapsed ?? noop_default2;
    profile3 = _console2?.profile ?? noop_default2;
    profileEnd3 = _console2?.profileEnd ?? noop_default2;
    time3 = _console2?.time ?? noop_default2;
    timeEnd3 = _console2?.timeEnd ?? noop_default2;
    timeLog3 = _console2?.timeLog ?? noop_default2;
    timeStamp3 = _console2?.timeStamp ?? noop_default2;
    Console2 = _console2?.Console ?? proxy_default2.__createMock__("console.Console");
  }
});
var workerdConsole2;
var assert22;
var clear22;
var context2;
var count22;
var countReset22;
var createTask22;
var debug22;
var dir22;
var dirxml22;
var error22;
var group22;
var groupCollapsed22;
var groupEnd22;
var info22;
var log22;
var profile22;
var profileEnd22;
var table22;
var time22;
var timeEnd22;
var timeLog22;
var timeStamp22;
var trace22;
var warn22;
var cloudflare_default3;
var init_cloudflare2 = __esm({
  "../../../node_modules/unenv/runtime/node/console/$cloudflare.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    init_console();
    workerdConsole2 = globalThis["console"];
    ({
      assert: assert22,
      clear: clear22,
      context: (
        // @ts-expect-error undocumented public API
        context2
      ),
      count: count22,
      countReset: countReset22,
      createTask: (
        // @ts-expect-error undocumented public API
        createTask22
      ),
      debug: debug22,
      dir: dir22,
      dirxml: dirxml22,
      error: error22,
      group: group22,
      groupCollapsed: groupCollapsed22,
      groupEnd: groupEnd22,
      info: info22,
      log: log22,
      profile: profile22,
      profileEnd: profileEnd22,
      table: table22,
      time: time22,
      timeEnd: timeEnd22,
      timeLog: timeLog22,
      timeStamp: timeStamp22,
      trace: trace22,
      warn: warn22
    } = workerdConsole2);
    Object.assign(workerdConsole2, {
      Console: Console2,
      _ignoreErrors: _ignoreErrors2,
      _stderr: _stderr2,
      _stderrErrorHandler: noop_default2,
      _stdout: _stdout2,
      _stdoutErrorHandler: noop_default2,
      _times: proxy_default2
    });
    cloudflare_default3 = workerdConsole2;
  }
});
var init_virtual_unenv_global_polyfill_console = __esm({
  "../../../node_modules/wrangler/_virtual_unenv_global_polyfill-console.js"() {
    init_cloudflare2();
    globalThis.console = cloudflare_default3;
  }
});
var _supportedEntryTypes2;
var _PerformanceEntry2;
var PerformanceEntry2;
var _PerformanceMark2;
var PerformanceMark2;
var _PerformanceMeasure2;
var PerformanceMeasure2;
var _PerformanceResourceTiming2;
var PerformanceResourceTiming2;
var init_entry = __esm({
  "../../../node_modules/unenv/runtime/web/performance/_entry.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    _supportedEntryTypes2 = [
      "event",
      // PerformanceEntry
      "mark",
      // PerformanceMark
      "measure",
      // PerformanceMeasure
      "resource"
      // PerformanceResourceTiming
    ];
    _PerformanceEntry2 = /* @__PURE__ */ __name(class {
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
    }, "_PerformanceEntry");
    __name2(_PerformanceEntry2, "_PerformanceEntry");
    PerformanceEntry2 = globalThis.PerformanceEntry || _PerformanceEntry2;
    _PerformanceMark2 = /* @__PURE__ */ __name(class extends _PerformanceEntry2 {
      entryType = "mark";
    }, "_PerformanceMark");
    __name2(_PerformanceMark2, "_PerformanceMark");
    PerformanceMark2 = globalThis.PerformanceMark || _PerformanceMark2;
    _PerformanceMeasure2 = /* @__PURE__ */ __name(class extends _PerformanceEntry2 {
      entryType = "measure";
    }, "_PerformanceMeasure");
    __name2(_PerformanceMeasure2, "_PerformanceMeasure");
    PerformanceMeasure2 = globalThis.PerformanceMeasure || _PerformanceMeasure2;
    _PerformanceResourceTiming2 = /* @__PURE__ */ __name(class extends _PerformanceEntry2 {
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
    }, "_PerformanceResourceTiming");
    __name2(_PerformanceResourceTiming2, "_PerformanceResourceTiming");
    PerformanceResourceTiming2 = globalThis.PerformanceResourceTiming || _PerformanceResourceTiming2;
  }
});
var _timeOrigin2;
var _Performance2;
var Performance2;
var performance22;
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
    _timeOrigin2 = Date.now();
    _Performance2 = /* @__PURE__ */ __name(class {
      __unenv__ = true;
      timeOrigin = _timeOrigin2;
      eventCounts = /* @__PURE__ */ new Map();
      _entries = [];
      _resourceTimingBufferSize = 0;
      navigation = proxy_default2.__createMock__("PerformanceNavigation");
      timing = proxy_default2.__createMock__("PerformanceTiming");
      onresourcetimingbufferfull = null;
      now() {
        if (globalThis?.performance?.now && this.timeOrigin === _timeOrigin2) {
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
        const entry = new _PerformanceMark2(name, options);
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
          start = Number.parseFloat(startOrMeasureOptions?.start) || performance22.now();
          end = Number.parseFloat(startOrMeasureOptions?.end) || performance22.now();
        }
        const entry = new _PerformanceMeasure2(measureName, {
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
        throw createNotImplementedError2("Performance.addEventListener");
      }
      removeEventListener(type, listener, options) {
        throw createNotImplementedError2("Performance.removeEventListener");
      }
      dispatchEvent(event) {
        throw createNotImplementedError2("Performance.dispatchEvent");
      }
    }, "_Performance");
    __name2(_Performance2, "_Performance");
    Performance2 = globalThis.Performance || _Performance2;
    performance22 = globalThis.performance || new Performance2();
  }
});
var _PerformanceObserver2;
var PerformanceObserver2;
var _PerformanceObserverEntryList2;
var PerformanceObserverEntryList2;
var init_observer = __esm({
  "../../../node_modules/unenv/runtime/web/performance/_observer.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    init_utils();
    init_entry();
    _PerformanceObserver2 = /* @__PURE__ */ __name(class {
      __unenv__ = true;
      _callback = null;
      constructor(callback) {
        this._callback = callback;
      }
      takeRecords() {
        return [];
      }
      disconnect() {
        throw createNotImplementedError2("PerformanceObserver.disconnect");
      }
      observe(options) {
        throw createNotImplementedError2("PerformanceObserver.observe");
      }
    }, "_PerformanceObserver");
    __name2(_PerformanceObserver2, "_PerformanceObserver");
    __publicField2(_PerformanceObserver2, "supportedEntryTypes", _supportedEntryTypes2);
    PerformanceObserver2 = globalThis.PerformanceObserver || _PerformanceObserver2;
    _PerformanceObserverEntryList2 = /* @__PURE__ */ __name(class {
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
    }, "_PerformanceObserverEntryList");
    __name2(_PerformanceObserverEntryList2, "_PerformanceObserverEntryList");
    PerformanceObserverEntryList2 = globalThis.PerformanceObserverEntryList || _PerformanceObserverEntryList2;
  }
});
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
function getGlobal2() {
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
__name(getGlobal2, "getGlobal");
var global_this_default2;
var init_global_this = __esm({
  "../../../node_modules/unenv/runtime/polyfill/global-this.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    __name2(getGlobal2, "getGlobal");
    global_this_default2 = getGlobal2();
  }
});
var performance_default2;
var init_performance3 = __esm({
  "../../../node_modules/unenv/runtime/polyfill/performance.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    init_performance2();
    init_global_this();
    global_this_default2.performance = global_this_default2.performance || performance22;
    global_this_default2.Performance = global_this_default2.Performance || Performance2;
    global_this_default2.PerformanceEntry = global_this_default2.PerformanceEntry || PerformanceEntry2;
    global_this_default2.PerformanceMark = global_this_default2.PerformanceMark || PerformanceMark2;
    global_this_default2.PerformanceMeasure = global_this_default2.PerformanceMeasure || PerformanceMeasure2;
    global_this_default2.PerformanceObserver = global_this_default2.PerformanceObserver || PerformanceObserver2;
    global_this_default2.PerformanceObserverEntryList = global_this_default2.PerformanceObserverEntryList || PerformanceObserverEntryList2;
    global_this_default2.PerformanceResourceTiming = global_this_default2.PerformanceResourceTiming || PerformanceResourceTiming2;
    performance_default2 = global_this_default2.performance;
  }
});
var init_virtual_unenv_global_polyfill_performance = __esm({
  "../../../node_modules/wrangler/_virtual_unenv_global_polyfill-performance.js"() {
    init_performance3();
    globalThis.performance = performance_default2;
  }
});
var empty_default2;
var init_empty = __esm({
  "../../../node_modules/unenv/runtime/mock/empty.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    empty_default2 = Object.freeze(
      Object.create(null, {
        __unenv__: { get: () => true }
      })
    );
  }
});
var _envShim2;
var _processEnv2;
var _getEnv2;
var env3;
var init_env = __esm({
  "../../../node_modules/unenv/runtime/node/process/internal/env.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    _envShim2 = /* @__PURE__ */ Object.create(null);
    _processEnv2 = globalThis.process?.env;
    _getEnv2 = /* @__PURE__ */ __name2((useShim) => _processEnv2 || globalThis.__env__ || (useShim ? _envShim2 : globalThis), "_getEnv");
    env3 = new Proxy(_envShim2, {
      get(_2, prop) {
        const env222 = _getEnv2();
        return env222[prop] ?? _envShim2[prop];
      },
      has(_2, prop) {
        const env222 = _getEnv2();
        return prop in env222 || prop in _envShim2;
      },
      set(_2, prop, value) {
        const env222 = _getEnv2(true);
        env222[prop] = value;
        return true;
      },
      deleteProperty(_2, prop) {
        const env222 = _getEnv2(true);
        delete env222[prop];
        return true;
      },
      ownKeys() {
        const env222 = _getEnv2();
        return Object.keys(env222);
      }
    });
  }
});
function _createNextTickWithTimeout2() {
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
  __name2(cleanUpNextTick, "cleanUpNextTick");
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
  __name2(drainQueue, "drainQueue");
  const nextTick222 = /* @__PURE__ */ __name2((cb, ...args) => {
    queue.push(cb.bind(void 0, ...args));
    if (queue.length === 1 && !draining) {
      setTimeout(drainQueue);
    }
  }, "nextTick2");
  return nextTick222;
}
__name(_createNextTickWithTimeout2, "_createNextTickWithTimeout");
var hrtime3;
var nextTick3;
var init_time = __esm({
  "../../../node_modules/unenv/runtime/node/process/internal/time.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    hrtime3 = Object.assign(
      /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function hrtime22(startTime) {
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
      }, "hrtime2"), "hrtime2"),
      {
        bigint: /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function bigint2() {
          return BigInt(Date.now() * 1e6);
        }, "bigint"), "bigint")
      }
    );
    nextTick3 = globalThis.queueMicrotask ? (cb, ...args) => {
      globalThis.queueMicrotask(cb.bind(void 0, ...args));
    } : _createNextTickWithTimeout2();
    __name2(_createNextTickWithTimeout2, "_createNextTickWithTimeout");
  }
});
function noop2() {
  return process22;
}
__name(noop2, "noop");
var title2;
var argv2;
var version2;
var versions2;
var on2;
var addListener2;
var once2;
var off2;
var removeListener2;
var removeAllListeners2;
var emit3;
var prependListener2;
var prependOnceListener2;
var listeners2;
var listenerCount2;
var binding2;
var _cwd2;
var cwd3;
var chdir3;
var umask3;
var getegid3;
var geteuid3;
var getgid3;
var getuid3;
var getgroups3;
var getBuiltinModule3;
var abort2;
var allowedNodeEnvironmentFlags2;
var arch2;
var argv02;
var config2;
var connected2;
var constrainedMemory2;
var availableMemory2;
var cpuUsage2;
var debugPort2;
var dlopen2;
var disconnect2;
var emitWarning2;
var eventNames2;
var execArgv2;
var execPath2;
var exit3;
var features2;
var getActiveResourcesInfo2;
var getMaxListeners2;
var kill2;
var memoryUsage2;
var pid2;
var platform3;
var ppid2;
var rawListeners2;
var release2;
var report2;
var resourceUsage2;
var setegid2;
var seteuid2;
var setgid2;
var setgroups2;
var setuid2;
var setMaxListeners2;
var setSourceMapsEnabled2;
var stdout2;
var stderr2;
var stdin2;
var traceDeprecation2;
var uptime2;
var exitCode2;
var setUncaughtExceptionCaptureCallback2;
var hasUncaughtExceptionCaptureCallback2;
var sourceMapsEnabled2;
var loadEnvFile2;
var mainModule2;
var permission2;
var channel2;
var throwDeprecation2;
var finalization2;
var assert32;
var openStdin2;
var _debugEnd2;
var _debugProcess2;
var _fatalException2;
var _getActiveHandles2;
var _getActiveRequests2;
var _kill2;
var _preload_modules2;
var _rawDebug2;
var _startProfilerIdleNotifier2;
var _stopProfilerIdleNotifier2;
var _tickCallback2;
var _linkedBinding2;
var domain2;
var initgroups2;
var moduleLoadList2;
var reallyExit2;
var _exiting2;
var _events2;
var _eventsCount2;
var _maxListeners2;
var process22;
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
    title2 = "unenv";
    argv2 = [];
    version2 = "";
    versions2 = {
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
    __name2(noop2, "noop");
    on2 = noop2;
    addListener2 = noop2;
    once2 = noop2;
    off2 = noop2;
    removeListener2 = noop2;
    removeAllListeners2 = noop2;
    emit3 = /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function emit22(event) {
      if (event === "message" || event === "multipleResolves") {
        return process22;
      }
      return false;
    }, "emit2"), "emit2");
    prependListener2 = noop2;
    prependOnceListener2 = noop2;
    listeners2 = /* @__PURE__ */ __name2(function(name) {
      return [];
    }, "listeners");
    listenerCount2 = /* @__PURE__ */ __name2(() => 0, "listenerCount");
    binding2 = /* @__PURE__ */ __name2(function(name) {
      throw new Error("[unenv] process.binding is not supported");
    }, "binding");
    _cwd2 = "/";
    cwd3 = /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function cwd22() {
      return _cwd2;
    }, "cwd2"), "cwd2");
    chdir3 = /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function chdir22(dir32) {
      _cwd2 = dir32;
    }, "chdir2"), "chdir2");
    umask3 = /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function umask22() {
      return 0;
    }, "umask2"), "umask2");
    getegid3 = /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function getegid22() {
      return 1e3;
    }, "getegid2"), "getegid2");
    geteuid3 = /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function geteuid22() {
      return 1e3;
    }, "geteuid2"), "geteuid2");
    getgid3 = /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function getgid22() {
      return 1e3;
    }, "getgid2"), "getgid2");
    getuid3 = /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function getuid22() {
      return 1e3;
    }, "getuid2"), "getuid2");
    getgroups3 = /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function getgroups22() {
      return [];
    }, "getgroups2"), "getgroups2");
    getBuiltinModule3 = /* @__PURE__ */ __name2((_name) => void 0, "getBuiltinModule");
    abort2 = notImplemented2("process.abort");
    allowedNodeEnvironmentFlags2 = /* @__PURE__ */ new Set();
    arch2 = "";
    argv02 = "";
    config2 = empty_default2;
    connected2 = false;
    constrainedMemory2 = /* @__PURE__ */ __name2(() => 0, "constrainedMemory");
    availableMemory2 = /* @__PURE__ */ __name2(() => 0, "availableMemory");
    cpuUsage2 = notImplemented2("process.cpuUsage");
    debugPort2 = 0;
    dlopen2 = notImplemented2("process.dlopen");
    disconnect2 = noop2;
    emitWarning2 = noop2;
    eventNames2 = notImplemented2("process.eventNames");
    execArgv2 = [];
    execPath2 = "";
    exit3 = notImplemented2("process.exit");
    features2 = /* @__PURE__ */ Object.create({
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
    getActiveResourcesInfo2 = /* @__PURE__ */ __name2(() => [], "getActiveResourcesInfo");
    getMaxListeners2 = notImplemented2(
      "process.getMaxListeners"
    );
    kill2 = notImplemented2("process.kill");
    memoryUsage2 = Object.assign(
      () => ({
        arrayBuffers: 0,
        rss: 0,
        external: 0,
        heapTotal: 0,
        heapUsed: 0
      }),
      { rss: () => 0 }
    );
    pid2 = 1e3;
    platform3 = "";
    ppid2 = 1e3;
    rawListeners2 = notImplemented2(
      "process.rawListeners"
    );
    release2 = /* @__PURE__ */ Object.create({
      name: "",
      lts: "",
      sourceUrl: void 0,
      headersUrl: void 0
    });
    report2 = /* @__PURE__ */ Object.create({
      compact: void 0,
      directory: void 0,
      filename: void 0,
      getReport: notImplemented2("process.report.getReport"),
      reportOnFatalError: void 0,
      reportOnSignal: void 0,
      reportOnUncaughtException: void 0,
      signal: void 0,
      writeReport: notImplemented2("process.report.writeReport")
    });
    resourceUsage2 = notImplemented2(
      "process.resourceUsage"
    );
    setegid2 = notImplemented2("process.setegid");
    seteuid2 = notImplemented2("process.seteuid");
    setgid2 = notImplemented2("process.setgid");
    setgroups2 = notImplemented2("process.setgroups");
    setuid2 = notImplemented2("process.setuid");
    setMaxListeners2 = notImplemented2(
      "process.setMaxListeners"
    );
    setSourceMapsEnabled2 = notImplemented2("process.setSourceMapsEnabled");
    stdout2 = proxy_default2.__createMock__("process.stdout");
    stderr2 = proxy_default2.__createMock__("process.stderr");
    stdin2 = proxy_default2.__createMock__("process.stdin");
    traceDeprecation2 = false;
    uptime2 = /* @__PURE__ */ __name2(() => 0, "uptime");
    exitCode2 = 0;
    setUncaughtExceptionCaptureCallback2 = notImplemented2("process.setUncaughtExceptionCaptureCallback");
    hasUncaughtExceptionCaptureCallback2 = /* @__PURE__ */ __name2(() => false, "hasUncaughtExceptionCaptureCallback");
    sourceMapsEnabled2 = false;
    loadEnvFile2 = notImplemented2(
      "process.loadEnvFile"
    );
    mainModule2 = void 0;
    permission2 = {
      has: () => false
    };
    channel2 = {
      ref() {
      },
      unref() {
      }
    };
    throwDeprecation2 = false;
    finalization2 = {
      register() {
      },
      unregister() {
      },
      registerBeforeExit() {
      }
    };
    assert32 = notImplemented2("process.assert");
    openStdin2 = notImplemented2("process.openStdin");
    _debugEnd2 = notImplemented2("process._debugEnd");
    _debugProcess2 = notImplemented2("process._debugProcess");
    _fatalException2 = notImplemented2("process._fatalException");
    _getActiveHandles2 = notImplemented2("process._getActiveHandles");
    _getActiveRequests2 = notImplemented2("process._getActiveRequests");
    _kill2 = notImplemented2("process._kill");
    _preload_modules2 = [];
    _rawDebug2 = notImplemented2("process._rawDebug");
    _startProfilerIdleNotifier2 = notImplemented2(
      "process._startProfilerIdleNotifier"
    );
    _stopProfilerIdleNotifier2 = notImplemented2(
      "process.__stopProfilerIdleNotifier"
    );
    _tickCallback2 = notImplemented2("process._tickCallback");
    _linkedBinding2 = notImplemented2("process._linkedBinding");
    domain2 = void 0;
    initgroups2 = notImplemented2("process.initgroups");
    moduleLoadList2 = [];
    reallyExit2 = noop2;
    _exiting2 = false;
    _events2 = [];
    _eventsCount2 = 0;
    _maxListeners2 = 0;
    process22 = {
      // @ts-expect-error
      _events: _events2,
      _eventsCount: _eventsCount2,
      _exiting: _exiting2,
      _maxListeners: _maxListeners2,
      _debugEnd: _debugEnd2,
      _debugProcess: _debugProcess2,
      _fatalException: _fatalException2,
      _getActiveHandles: _getActiveHandles2,
      _getActiveRequests: _getActiveRequests2,
      _kill: _kill2,
      _preload_modules: _preload_modules2,
      _rawDebug: _rawDebug2,
      _startProfilerIdleNotifier: _startProfilerIdleNotifier2,
      _stopProfilerIdleNotifier: _stopProfilerIdleNotifier2,
      _tickCallback: _tickCallback2,
      domain: domain2,
      initgroups: initgroups2,
      moduleLoadList: moduleLoadList2,
      reallyExit: reallyExit2,
      exitCode: exitCode2,
      abort: abort2,
      addListener: addListener2,
      allowedNodeEnvironmentFlags: allowedNodeEnvironmentFlags2,
      hasUncaughtExceptionCaptureCallback: hasUncaughtExceptionCaptureCallback2,
      setUncaughtExceptionCaptureCallback: setUncaughtExceptionCaptureCallback2,
      loadEnvFile: loadEnvFile2,
      sourceMapsEnabled: sourceMapsEnabled2,
      throwDeprecation: throwDeprecation2,
      mainModule: mainModule2,
      permission: permission2,
      channel: channel2,
      arch: arch2,
      argv: argv2,
      argv0: argv02,
      assert: assert32,
      binding: binding2,
      chdir: chdir3,
      config: config2,
      connected: connected2,
      constrainedMemory: constrainedMemory2,
      availableMemory: availableMemory2,
      cpuUsage: cpuUsage2,
      cwd: cwd3,
      debugPort: debugPort2,
      dlopen: dlopen2,
      disconnect: disconnect2,
      emit: emit3,
      emitWarning: emitWarning2,
      env: env3,
      eventNames: eventNames2,
      execArgv: execArgv2,
      execPath: execPath2,
      exit: exit3,
      finalization: finalization2,
      features: features2,
      getBuiltinModule: getBuiltinModule3,
      getegid: getegid3,
      geteuid: geteuid3,
      getgid: getgid3,
      getgroups: getgroups3,
      getuid: getuid3,
      getActiveResourcesInfo: getActiveResourcesInfo2,
      getMaxListeners: getMaxListeners2,
      hrtime: hrtime3,
      kill: kill2,
      listeners: listeners2,
      listenerCount: listenerCount2,
      memoryUsage: memoryUsage2,
      nextTick: nextTick3,
      on: on2,
      off: off2,
      once: once2,
      openStdin: openStdin2,
      pid: pid2,
      platform: platform3,
      ppid: ppid2,
      prependListener: prependListener2,
      prependOnceListener: prependOnceListener2,
      rawListeners: rawListeners2,
      release: release2,
      removeAllListeners: removeAllListeners2,
      removeListener: removeListener2,
      report: report2,
      resourceUsage: resourceUsage2,
      setegid: setegid2,
      seteuid: seteuid2,
      setgid: setgid2,
      setgroups: setgroups2,
      setuid: setuid2,
      setMaxListeners: setMaxListeners2,
      setSourceMapsEnabled: setSourceMapsEnabled2,
      stderr: stderr2,
      stdin: stdin2,
      stdout: stdout2,
      title: title2,
      traceDeprecation: traceDeprecation2,
      umask: umask3,
      uptime: uptime2,
      version: version2,
      versions: versions2
    };
  }
});
var unpatchedGlobalThisProcess2;
var getBuiltinModule22;
var workerdProcess2;
var env22;
var exit22;
var nextTick22;
var platform22;
var _process2;
var cloudflare_default22;
var init_cloudflare3 = __esm({
  "../../../node_modules/unenv/runtime/node/process/$cloudflare.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    init_process();
    unpatchedGlobalThisProcess2 = globalThis["process"];
    getBuiltinModule22 = unpatchedGlobalThisProcess2.getBuiltinModule;
    workerdProcess2 = getBuiltinModule22("node:process");
    ({ env: env22, exit: exit22, nextTick: nextTick22, platform: platform22 } = workerdProcess2);
    _process2 = {
      /**
       * manually unroll unenv-polyfilled-symbols to make it tree-shakeable
       */
      // @ts-expect-error (not typed)
      _debugEnd: _debugEnd2,
      _debugProcess: _debugProcess2,
      _events: _events2,
      _eventsCount: _eventsCount2,
      _exiting: _exiting2,
      _fatalException: _fatalException2,
      _getActiveHandles: _getActiveHandles2,
      _getActiveRequests: _getActiveRequests2,
      _kill: _kill2,
      _linkedBinding: _linkedBinding2,
      _maxListeners: _maxListeners2,
      _preload_modules: _preload_modules2,
      _rawDebug: _rawDebug2,
      _startProfilerIdleNotifier: _startProfilerIdleNotifier2,
      _stopProfilerIdleNotifier: _stopProfilerIdleNotifier2,
      _tickCallback: _tickCallback2,
      abort: abort2,
      addListener: addListener2,
      allowedNodeEnvironmentFlags: allowedNodeEnvironmentFlags2,
      arch: arch2,
      argv: argv2,
      argv0: argv02,
      assert: assert32,
      availableMemory: availableMemory2,
      binding: binding2,
      chdir: chdir3,
      config: config2,
      constrainedMemory: constrainedMemory2,
      cpuUsage: cpuUsage2,
      cwd: cwd3,
      debugPort: debugPort2,
      dlopen: dlopen2,
      domain: domain2,
      emit: emit3,
      emitWarning: emitWarning2,
      eventNames: eventNames2,
      execArgv: execArgv2,
      execPath: execPath2,
      exit: exit22,
      exitCode: exitCode2,
      features: features2,
      getActiveResourcesInfo: getActiveResourcesInfo2,
      getMaxListeners: getMaxListeners2,
      getegid: getegid3,
      geteuid: geteuid3,
      getgid: getgid3,
      getgroups: getgroups3,
      getuid: getuid3,
      hasUncaughtExceptionCaptureCallback: hasUncaughtExceptionCaptureCallback2,
      hrtime: hrtime3,
      initgroups: initgroups2,
      kill: kill2,
      listenerCount: listenerCount2,
      listeners: listeners2,
      loadEnvFile: loadEnvFile2,
      memoryUsage: memoryUsage2,
      moduleLoadList: moduleLoadList2,
      off: off2,
      on: on2,
      once: once2,
      openStdin: openStdin2,
      pid: pid2,
      platform: platform22,
      ppid: ppid2,
      prependListener: prependListener2,
      prependOnceListener: prependOnceListener2,
      rawListeners: rawListeners2,
      reallyExit: reallyExit2,
      release: release2,
      removeAllListeners: removeAllListeners2,
      removeListener: removeListener2,
      report: report2,
      resourceUsage: resourceUsage2,
      setMaxListeners: setMaxListeners2,
      setSourceMapsEnabled: setSourceMapsEnabled2,
      setUncaughtExceptionCaptureCallback: setUncaughtExceptionCaptureCallback2,
      setegid: setegid2,
      seteuid: seteuid2,
      setgid: setgid2,
      setgroups: setgroups2,
      setuid: setuid2,
      sourceMapsEnabled: sourceMapsEnabled2,
      stderr: stderr2,
      stdin: stdin2,
      stdout: stdout2,
      title: title2,
      umask: umask3,
      uptime: uptime2,
      version: version2,
      versions: versions2,
      /**
       * manually unroll workerd-polyfilled-symbols to make it tree-shakeable
       */
      env: env22,
      getBuiltinModule: getBuiltinModule22,
      nextTick: nextTick22
    };
    cloudflare_default22 = _process2;
  }
});
var init_virtual_unenv_global_polyfill_process = __esm({
  "../../../node_modules/wrangler/_virtual_unenv_global_polyfill-process.js"() {
    init_cloudflare3();
    globalThis.process = cloudflare_default22;
  }
});
var _AsyncLocalStorage;
var AsyncLocalStorage;
var init_async_local_storage = __esm({
  "../../../node_modules/unenv/runtime/node/async_hooks/internal/async-local-storage.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    _AsyncLocalStorage = /* @__PURE__ */ __name(class {
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
    }, "_AsyncLocalStorage");
    __name2(_AsyncLocalStorage, "_AsyncLocalStorage");
    AsyncLocalStorage = globalThis.AsyncLocalStorage || _AsyncLocalStorage;
  }
});
var async_hook_exports = {};
__export(async_hook_exports, {
  AsyncHook: () => AsyncHook,
  asyncWrapProviders: () => asyncWrapProviders,
  createHook: () => createHook,
  executionAsyncId: () => executionAsyncId,
  executionAsyncResource: () => executionAsyncResource,
  triggerAsyncId: () => triggerAsyncId
});
var _AsyncHook;
var AsyncHook;
var createHook;
var executionAsyncId;
var executionAsyncResource;
var triggerAsyncId;
var asyncWrapProviders;
var init_async_hook = __esm({
  "../../../node_modules/unenv/runtime/node/async_hooks/internal/async-hook.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    _AsyncHook = /* @__PURE__ */ __name(class {
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
    }, "_AsyncHook");
    __name2(_AsyncHook, "_AsyncHook");
    AsyncHook = globalThis.AsyncHook || _AsyncHook;
    createHook = /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function createHook2(callbacks) {
      const asyncHook = new _AsyncHook(callbacks);
      return asyncHook;
    }, "createHook2"), "createHook2");
    executionAsyncId = /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function executionAsyncId2() {
      return 0;
    }, "executionAsyncId2"), "executionAsyncId2");
    executionAsyncResource = /* @__PURE__ */ __name2(function() {
      return /* @__PURE__ */ Object.create(null);
    }, "executionAsyncResource");
    triggerAsyncId = /* @__PURE__ */ __name2(function() {
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
var _asyncIdCounter;
var _AsyncResource;
var AsyncResource;
var init_async_resource = __esm({
  "../../../node_modules/unenv/runtime/node/async_hooks/internal/async-resource.mjs"() {
    init_virtual_unenv_global_polyfill_process();
    init_virtual_unenv_global_polyfill_performance();
    init_virtual_unenv_global_polyfill_console();
    init_virtual_unenv_global_polyfill_set_immediate();
    init_virtual_unenv_global_polyfill_clear_immediate();
    init_async_hook();
    _asyncIdCounter = 100;
    _AsyncResource = /* @__PURE__ */ __name(class {
      __unenv__ = true;
      type;
      _asyncId;
      _triggerAsyncId;
      constructor(type, triggerAsyncId2 = executionAsyncId()) {
        this.type = type;
        this._asyncId = -1 * _asyncIdCounter++;
        this._triggerAsyncId = typeof triggerAsyncId2 === "number" ? triggerAsyncId2 : triggerAsyncId2?.triggerAsyncId;
      }
      static bind(fn22, type, thisArg) {
        const resource = new AsyncResource(type ?? "anonymous");
        return resource.bind(fn22);
      }
      bind(fn22, thisArg) {
        const binded = /* @__PURE__ */ __name2((...args) => this.runInAsyncScope(fn22, thisArg, ...args), "binded");
        binded.asyncResource = this;
        return binded;
      }
      runInAsyncScope(fn22, thisArg, ...args) {
        const result = fn22.apply(thisArg, args);
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
    }, "_AsyncResource");
    __name2(_AsyncResource, "_AsyncResource");
    AsyncResource = globalThis.AsyncResource || _AsyncResource;
  }
});
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
var cloudflare_exports = {};
__export(cloudflare_exports, {
  AsyncLocalStorage: () => AsyncLocalStorage2,
  AsyncResource: () => AsyncResource2,
  asyncWrapProviders: () => asyncWrapProviders,
  createHook: () => createHook,
  default: () => cloudflare_default32,
  executionAsyncId: () => executionAsyncId,
  executionAsyncResource: () => executionAsyncResource,
  triggerAsyncId: () => triggerAsyncId
});
var workerdAsyncHooks;
var AsyncLocalStorage2;
var AsyncResource2;
var cloudflare_default32;
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
    cloudflare_default32 = {
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
var T = /* @__PURE__ */ __name2((e, t) => () => (e && (t = e(e = 0)), t), "T");
var U = /* @__PURE__ */ __name2((e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), "U");
var oe = /* @__PURE__ */ __name2((e, t, a, s) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let r of ne(t))
      !ie.call(e, r) && r !== a && H(e, r, { get: () => t[r], enumerable: !(s = ae(t, r)) || s.enumerable });
  return e;
}, "oe");
var V = /* @__PURE__ */ __name2((e, t, a) => (a = e != null ? se(re(e)) : {}, oe(t || !e || !e.__esModule ? H(a, "default", { value: e, enumerable: true }) : a, e)), "V");
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
  __name2(R, "R");
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
  __name2(le, "le");
  (function(e) {
    class t extends RegExp {
      constructor(s, r, i, n, o) {
        super(s, r), this.pcrePattern = i, this.pcreFlags = n, this.delimiter = o;
      }
    }
    __name(t, "t");
    __name2(t, "t");
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
  __name2(Pe, "Pe");
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
  __name2(ve, "ve");
  function be(e) {
    return e.indexOf("%") !== -1 ? decodeURIComponent(e) : e;
  }
  __name(be, "be");
  __name2(be, "be");
  function Se(e) {
    return encodeURIComponent(e);
  }
  __name(Se, "Se");
  __name2(Se, "Se");
  function Ce(e) {
    return we.call(e) === "[object Date]" || e instanceof Date;
  }
  __name(Ce, "Ce");
  __name2(Ce, "Ce");
  function ke(e, t) {
    try {
      return t(e);
    } catch {
      return e;
    }
  }
  __name(ke, "ke");
  __name2(ke, "ke");
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
__name2(C, "C");
function v(e, t, a, { namedOnly: s } = {}) {
  return e.replace(/\$([a-zA-Z0-9_]+)/g, (r, i) => {
    let n = a.indexOf(i);
    return s && n === -1 ? r : (n === -1 ? t[parseInt(i, 10)] : t[n + 1]) || "";
  });
}
__name(v, "v");
__name2(v, "v");
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
__name2(I, "I");
function j(e, t, a) {
  let { match: s, captureGroupKeys: r } = C(e, t);
  return a && s && r.length ? { valid: !!s, newRouteDest: v(a, s, r, { namedOnly: true }) } : { valid: !!s };
}
__name(j, "j");
__name2(j, "j");
u();
l();
d();
function D(e) {
  let t = new Headers(e.headers);
  return e.cf && (t.set("x-vercel-ip-city", encodeURIComponent(e.cf.city)), t.set("x-vercel-ip-country", e.cf.country), t.set("x-vercel-ip-country-region", e.cf.regionCode), t.set("x-vercel-ip-latitude", e.cf.latitude), t.set("x-vercel-ip-longitude", e.cf.longitude)), t.set("x-vercel-sc-host", P), new Request(e, { headers: t });
}
__name(D, "D");
__name2(D, "D");
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
__name2(_, "_");
function b(e) {
  return /^https?:\/\//.test(e);
}
__name(b, "b");
__name2(b, "b");
function x(e, t) {
  for (let [a, s] of t.entries()) {
    let r = /^nxtP(.+)$/.exec(a), i = /^nxtI(.+)$/.exec(a);
    r?.[1] ? (e.set(a, s), e.set(r[1], s)) : i?.[1] ? e.set(i[1], s.replace(/(\(\.+\))+/, "")) : (!e.has(a) || !!s && !e.getAll(a).includes(s)) && e.append(a, s);
  }
}
__name(x, "x");
__name2(x, "x");
function L(e, t) {
  let a = new URL(t, e.url);
  return x(a.searchParams, new URL(e.url).searchParams), a.pathname = a.pathname.replace(/\/index.html$/, "/").replace(/\.html$/, ""), new Request(a, e);
}
__name(L, "L");
__name2(L, "L");
function S(e) {
  return new Response(e.body, e);
}
__name(S, "S");
__name2(S, "S");
function N(e) {
  return e.split(",").map((t) => {
    let [a, s] = t.split(";"), r = parseFloat((s ?? "q=1").replace(/q *= */gi, ""));
    return [a.trim(), isNaN(r) ? 1 : r];
  }).sort((t, a) => a[1] - t[1]).map(([t]) => t === "*" || t === "" ? [] : t).flat();
}
__name(N, "N");
__name2(N, "N");
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
__name2(A, "A");
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
__name2(k, "k");
function B(e, t) {
  let a = "^//?(?:", s = ")/(.*)$";
  return !e.startsWith(a) || !e.endsWith(s) ? false : e.slice(a.length, -s.length).split("|").every((i) => t.has(i));
}
__name(B, "B");
__name2(B, "B");
u();
l();
d();
function de(e, { protocol: t, hostname: a, port: s, pathname: r }) {
  return !(t && e.protocol.replace(/:$/, "") !== t || !new RegExp(a).test(e.hostname) || s && !new RegExp(s).test(e.port) || r && !new RegExp(r).test(e.pathname));
}
__name(de, "de");
__name2(de, "de");
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
__name2(he, "he");
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
__name2(pe, "pe");
async function G(e, { buildOutput: t, assetsFetcher: a, imagesConfig: s }) {
  let r = he(e, s);
  if (!r)
    return new Response("Invalid image resizing request", { status: 400 });
  let { isRelative: i, imageUrl: n } = r, c = await (i && n.pathname in t ? a.fetch.bind(a) : fetch)(n);
  return pe(c, n, s);
}
__name(G, "G");
__name2(G, "G");
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
        let i = globalThis[ge], n = /* @__PURE__ */ __name2(async () => {
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
__name2(z, "z");
async function ye() {
  return process.env.__NEXT_ON_PAGES__KV_SUSPENSE_CACHE ? W("kv") : W("cache-api");
}
__name(ye, "ye");
__name2(ye, "ye");
async function W(e) {
  let t = await import(`./__next-on-pages-dist__/cache/${e}.js`);
  return new t.default();
}
__name(W, "W");
__name2(W, "W");
function K(e, t) {
  return e.headers.get(t)?.split(",")?.filter(Boolean);
}
__name(K, "K");
__name2(K, "K");
function X() {
  globalThis[J] || (_e(), globalThis[J] = true);
}
__name(X, "X");
__name2(X, "X");
function _e() {
  let e = globalThis.fetch;
  globalThis.fetch = async (...t) => {
    let a = new Request(...t), s = await xe(a);
    return s || (s = await z(a), s) ? s : (Re(a), e(a));
  };
}
__name(_e, "_e");
__name2(_e, "_e");
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
__name2(xe, "xe");
function Re(e) {
  e.headers.has("user-agent") || e.headers.set("user-agent", "Next.js Middleware");
}
__name(Re, "Re");
__name2(Re, "Re");
var J = Symbol.for("next-on-pages fetch patch");
u();
l();
d();
var Q = V(Z());
var M = /* @__PURE__ */ __name2(class {
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
__name2(Y, "Y");
async function ee(e, t = "none", a = false) {
  return await e.run(t) === "error" || !a && e.status && e.status >= 400 ? ee(e, "error", true) : { path: e.path, status: e.status, headers: e.headers, searchParams: e.searchParams, body: e.body };
}
__name(ee, "ee");
__name2(ee, "ee");
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
__name2(Ee, "Ee");
u();
l();
d();
function te() {
  globalThis.__nextOnPagesRoutesIsolation ??= { _map: /* @__PURE__ */ new Map(), getProxyFor: Me };
}
__name(te, "te");
__name2(te, "te");
function Me(e) {
  let t = globalThis.__nextOnPagesRoutesIsolation._map.get(e);
  if (t)
    return t;
  let a = Te();
  return globalThis.__nextOnPagesRoutesIsolation._map.set(e, a), a;
}
__name(Me, "Me");
__name2(Me, "Me");
function Te() {
  let e = /* @__PURE__ */ new Map();
  return new Proxy(globalThis, { get: (t, a) => e.has(a) ? e.get(a) : Reflect.get(globalThis, a), set: (t, a, s) => je.has(a) ? Reflect.set(globalThis, a, s) : (e.set(a, s), true) });
}
__name(Te, "Te");
__name2(Te, "Te");
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

// node_modules/wrangler/templates/pages-dev-util.ts
function isRoutingRuleMatch(pathname, routingRule) {
  if (!pathname) {
    throw new Error("Pathname is undefined.");
  }
  if (!routingRule) {
    throw new Error("Routing rule is undefined.");
  }
  const ruleRegExp = transformRoutingRuleToRegExp(routingRule);
  return pathname.match(ruleRegExp) !== null;
}
__name(isRoutingRuleMatch, "isRoutingRuleMatch");
function transformRoutingRuleToRegExp(rule) {
  let transformedRule;
  if (rule === "/" || rule === "/*") {
    transformedRule = rule;
  } else if (rule.endsWith("/*")) {
    transformedRule = `${rule.substring(0, rule.length - 2)}(/*)?`;
  } else if (rule.endsWith("/")) {
    transformedRule = `${rule.substring(0, rule.length - 1)}(/)?`;
  } else if (rule.endsWith("*")) {
    transformedRule = rule;
  } else {
    transformedRule = `${rule}(/)?`;
  }
  transformedRule = `^${transformedRule.replaceAll(/\./g, "\\.").replaceAll(/\*/g, ".*")}$`;
  return new RegExp(transformedRule);
}
__name(transformRoutingRuleToRegExp, "transformRoutingRuleToRegExp");

// .wrangler/tmp/pages-4AmyS0/53ovl9m0a0u.js
var define_ROUTES_default = { version: 1, description: "Built with @cloudflare/next-on-pages@1.13.7.", include: ["/*"], exclude: ["/_next/static/*"] };
var routes = define_ROUTES_default;
var pages_dev_pipeline_default = {
  fetch(request, env4, context3) {
    const { pathname } = new URL(request.url);
    for (const exclude of routes.exclude) {
      if (isRoutingRuleMatch(pathname, exclude)) {
        return env4.ASSETS.fetch(request);
      }
    }
    for (const include of routes.include) {
      if (isRoutingRuleMatch(pathname, include)) {
        if (ms.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return ms.fetch(request, env4, context3);
      }
    }
    return env4.ASSETS.fetch(request);
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env4, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env4);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env4, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env4);
  } catch (e) {
    const error4 = reduceError(e);
    return Response.json(error4, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-PrieUB/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_dev_pipeline_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env4, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env4, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env4, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env4, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-PrieUB/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env4, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env4, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env4, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env4, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env4, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env4, ctx) => {
      this.env = env4;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
//# sourceMappingURL=53ovl9m0a0u.js.map
