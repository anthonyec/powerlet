import { js as beutify } from 'js-beautify';
import { minify, parse } from 'uglify-js';

export function prefixer() {
  const prefixRegix = /^javascript\:\s?/;

  return {
    pack: (str) => {
      if (str.match(prefixRegix)) {
        return str;
      }

      return `javascript:${str}`;
    },

    unpack: (str) => {
      return str.replace(prefixRegix, '');
    }
  };
}

export function uriComponent() {
  return {
    pack: (str) => {
      return encodeURIComponent(str);
    },

    unpack: (str) => {
      return decodeURIComponent(str);
    }
  };
}

export function format() {
  return {
    pack: (str) => {
      const result = minify(str, {
        keep_fnames: true,
        mangle: false,
        compress: false
      });

      return result.code;
    },
    unpack: (str) => {
      return beutify(str);
    }
  };
}

export function newlines() {
  function getNewlineIndices(str) {
    let indices = [];

    for (var i = 0; i < str.length; i++) {
      if (str[i] === `\n`) {
        indices.push(i);
      }
    }

    return indices;
  }
  return {
    pack: (str) => {
      const indices = getNewlineIndices(str);
      const indicesString = indices.join(',');
      const comment = `//@n${indicesString}`;

      return str.replace(/\n/g, '') + comment;
    },
    unpack: (str) => {}
  };
}
