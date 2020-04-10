import { js as beutify } from 'js-beautify';
import { minify, parse } from 'uglify-js';

export function pack(str = '', pipeline = []) {
  return pipeline.reduce((mem, pipe) => {
    return pipe().pack(mem);
  }, str);
}

export function unpack(str = '', pipeline = []) {
  // `slice()` stops mutating the original array.
  return pipeline.slice().reverse().reduce((mem, pipe) => {
    return pipe().unpack(mem);
  }, str);
}

export function prefixPipe() {
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

export function uriComponentPipe() {
  return {
    pack: (str) => {
      return encodeURIComponent(str);
    },

    unpack: (str) => {
      return decodeURIComponent(str);
    }
  };
}

export function formatPipe() {
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

export function newlinesPipe() {
  const packedRegex = /\/\/\@n(\d*\,?)+$/g;
  function getNewlineIndices(str) {
    let indices = [];

    for (var i = 0; i < str.length; i++) {
      if (str[i] === `\n`) {
        indices.push(i);
      }
    }

    return indices;
  }

  function insert(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
  }

  return {
    pack: (str) => {
      const indices = getNewlineIndices(str);
      const indicesString = indices.join(',');
      const comment = `//@n${indicesString}`;

      return str.replace(/\n/g, '') + comment;
    },
    unpack: (str) => {
      const match = str.match(packedRegex);

      // TODO: Test this
      if (match && match.length === 1) {
        const comment = match[0];
        const indices = comment.replace('//@n', '').split(',').map((n) => parseInt(n));

        let newStr = str;

        indices.forEach((indexOfNewLine) => {
          newStr = insert(newStr, indexOfNewLine, '\n');
        });

        return newStr.replace(comment, '');
      }

      // TODO: Test this
      return str;
    }
  };
}
