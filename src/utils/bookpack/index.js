export function prefixer() {
  const prefixRegix = /^javascript\:\s?/;

  return {
    pack: (str) => {
      if (str.match(prefixRegix)) {
        return str;
      }

      return `javascript:${str}`
    },

    unpack: (str) => {
      return str.replace(prefixRegix, '');
    }
  }
}

export function uriComponent() {
  return {
    pack: (str) => {
      return encodeURIComponent(str);
    },

    unpack: (str) => {
      return decodeURIComponent(str)
    }
  }
}
