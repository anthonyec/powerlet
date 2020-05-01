export default function basicMinify(code) {
  code = code.split(/\r\n|\r|\n/g);

  var i = 0,
    len = code.length,
    noSemiColon = {},
    t;

  "} { ; ,".split(" ").forEach(function(i, x) {
    noSemiColon[x] = 1;
  });

  for (; i < len; i++) {
    t = code[i].trim();

    code[i] = t;
  }
  return code.join("").replace(/;$/, "");
}
