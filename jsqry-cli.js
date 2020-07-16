import * as std from "std";
import * as os from "os";
import jsqry from "./jsqry.js";
import colorJson from "./colorJson.js";

const VERSION = "0.0.2";

// based on code from https://github.com/twardoch/svgop/blob/master/src/app/svgop-qjs.js
const utf8ArrayToStr = (function () {
  const charCache = new Array(128); // Preallocate the cache for the common single byte chars
  const charFromCodePt = String.fromCodePoint || String.fromCharCode;
  const result = [];

  return function (array) {
    let codePt, byte1;
    const buffLen = array.length;

    result.length = 0;

    for (let i = 0; i < buffLen; ) {
      byte1 = array[i++];

      if (byte1 <= 0x7f) {
        codePt = byte1;
      } else if (byte1 <= 0xdf) {
        codePt = ((byte1 & 0x1f) << 6) | (array[i++] & 0x3f);
      } else if (byte1 <= 0xef) {
        codePt =
          ((byte1 & 0x0f) << 12) |
          ((array[i++] & 0x3f) << 6) |
          (array[i++] & 0x3f);
      } else if (String.fromCodePoint) {
        codePt =
          ((byte1 & 0x07) << 18) |
          ((array[i++] & 0x3f) << 12) |
          ((array[i++] & 0x3f) << 6) |
          (array[i++] & 0x3f);
      } else {
        codePt = 63; // Cannot convert four byte code points, so use "?" instead
        i += 3;
      }

      result.push(
        charCache[codePt] || (charCache[codePt] = charFromCodePt(codePt))
      );
    }

    return result.join("");
  };
})();

function getstdin() {
  const result = [];
  let length = 0;
  let chunk;
  while (!std.in.eof()) {
    chunk = std.in.getByte();
    if (chunk > 0) {
      result.push(chunk);
      length += chunk.length;
    }
  }
  return utf8ArrayToStr(result);
}

function err(msg) {
  std.err.puts(msg);
  std.err.puts("\n");
}

const isTtyIn = os.isatty(0);
const isTtyOut = os.isatty(1);

function unquoteResult(res) {
  function isPrimitive(val) {
    const type = typeof val;
    return type === "string" || type === "boolean" || type === "number";
  }
  if (isPrimitive(res)) {
    return [false, res];
  } else if (Array.isArray(res)) {
    return [
      res.length > 0,
      res.map((e) => (isPrimitive(e) ? e : JSON.stringify(e))).join("\n"),
    ];
  } else {
    return [false, JSON.stringify(res)];
  }
}

function doWork(jsonStr, queryStr, queryArgs, useFirst, compact, unquote) {
  let json;
  try {
    json = JSON.parse(jsonStr);
  } catch (e) {
    return "error: Wrong JSON";
  }
  let res;
  try {
    res = (useFirst ? jsqry.first : jsqry.query)(json, queryStr, ...queryArgs);
  } catch (e) {
    return "error: " + e;
  }
  if (unquote) {
    const [arrayNotEmpty, ur] = unquoteResult(res);
    if (ur === "") {
      if (arrayNotEmpty) {
        print();
      }
    } else {
      print(ur);
    }
  } else {
    print(
      compact
        ? JSON.stringify(res)
        : isTtyOut
        ? colorJson(res, 2)
        : JSON.stringify(res, null, 2)
    );
  }
  return null;
}

const QUERY_ARG_STR = "-as";
const QUERY_ARG_STR1 = "--arg-str";
const QUERY_ARG_OTHER = "-a";
const QUERY_ARG_OTHER1 = "--arg";

function parseArgs() {
  const valueSwitches = {
    [QUERY_ARG_STR]: 1,
    [QUERY_ARG_STR1]: 1,
    [QUERY_ARG_OTHER]: 1,
    [QUERY_ARG_OTHER1]: 1,
  };
  const params = {};
  const args = [];
  const queryArgs = [];
  let prevArg = null;

  for (let i = 1; i < scriptArgs.length; i++) {
    const arg = scriptArgs[i];
    if (arg.indexOf("-") === 0) {
      if (!valueSwitches[arg]) {
        params[arg] = true;
      }
    } else {
      if (valueSwitches[prevArg]) {
        queryArgs.push([prevArg, arg]);
      } else {
        args.push(arg);
      }
    }
    prevArg = arg;
  }

  return [params, args, queryArgs];
}

const [params, args, queryArgs] = parseArgs();

const queryArgsParsed = queryArgs.map(([switch_, arg]) =>
  QUERY_ARG_STR === switch_ || QUERY_ARG_STR1 === switch_
    ? arg
    : JSON.parse(arg)
);

if (params["-v"] || params["--version"]) {
  print(VERSION);
} else if (
  params["-h"] ||
  params["--help"] ||
  (isTtyIn && scriptArgs.length === 1) /* called with no params */
) {
  print(`jsqry ver. ${VERSION}
Usage: echo $JSON | jsqry 'query'
 -1,--first     return first result element
 -h,--help      print help and exit
 -v,--version   print version and exit
 -c,--compact   compact output (no pretty-print)
 -u,--unquote   unquote output string(s)
 -as ARG,
 --arg-str ARG  supply string query argument
 -a ARG,
 --arg ARG      supply query argument of any other type`);
} else {
  const inputStr = getstdin();
  const errMsg = doWork(
    inputStr,
    args[0] || "",
    queryArgsParsed,
    params["-1"] || params["--first"],
    params["-c"] || params["--compact"],
    params["-u"] || params["--unquote"]
  );
  if (errMsg) {
    err(errMsg);
    std.exit(1);
  }
}
