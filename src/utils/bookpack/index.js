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
