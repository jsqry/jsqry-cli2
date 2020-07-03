import * as std from "std";
import jsqry from "./jsqry.js";

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

function doWork(jsonStr, queryStr, useFirst) {
  let json;
  try {
    json = JSON.parse(jsonStr);
  } catch (e) {
    return "error: Wrong JSON";
  }
  let res;
  try {
    res = (useFirst ? jsqry.first : jsqry.query)(json, queryStr);
  } catch (e) {
    return "error: " + e;
  }
  print(JSON.stringify(res, null, 2));
  return null;
}

function parseArgs() {
  const params = {};
  const args = [];

  for (let i = 1; i < scriptArgs.length; i++) {
    const arg = scriptArgs[i];
    if (arg.indexOf("-") === 0) {
      params[arg] = true;
    } else {
      args.push(arg);
    }
  }

  return [params, args];
}

const inputStr = getstdin();

const [params, args] = parseArgs();

if (params["-v"] || params["--version"]) {
  print(VERSION);
} else if (params["-h"] || params["--help"]) {
  print(`jsqry ver. ${VERSION}
Usage: echo $JSON | jsqry 'query'
 -1,--first     return first result element
 -h,--help      print help and exit
 -v,--version   print version and exit`);
} else {
  const errMsg = doWork(
    inputStr,
    args[0] || "",
    params["-1"] || params["--first"]
  );
  if (errMsg) {
    err(errMsg);
    std.exit(1);
  }
}