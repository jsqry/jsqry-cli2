// based on https://github.com/zvakanaka/color-json

const colors = {
  separator: "\x1b[1;37m",
  string: "\x1b[0;32m",
  number: "\x1b[0;37m",
  boolean: "\x1b[0;37m",
  null: "\x1b[1;30m",
  key: "\x1b[34;1m",
};

export default function (jsonObj, spacing = 2) {
  const json = JSON.stringify(jsonObj, undefined, spacing);
  return (
    colors.separator +
    json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
        let colorCode = "number";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) colorCode = "key";
          else colorCode = "string";
        } else if (/true|false/.test(match)) colorCode = "boolean";
        else if (/null/.test(match)) colorCode = "null";
        const color = colors[colorCode] || "";
        return `${color}${match}${colors.separator}`;
      }
    ) +
    "\x1b[0m"
  );
}
