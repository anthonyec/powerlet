export default function basicMinify(code) {
  let minifiedCode = code.split(/\r\n|\r|\n/g);
  let t;

  const len = minifiedCode.length;
  const noSemiColon = {};

  '} { ; ,'.split(' ').forEach(function (i, x) {
    noSemiColon[x] = 1;
  });

  for (let i = 0; i < len; i++) {
    t = minifiedCode[i].trim();

    minifiedCode[i] = t;
  }
  return minifiedCode.join('').replace(/;$/, '');
}
