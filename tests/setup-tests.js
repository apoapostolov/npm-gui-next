// eslint-disable-next-line no-undef
jest.setTimeout(60000);
global.IS_REACT_ACT_ENVIRONMENT = true;

const { TextDecoder, TextEncoder } = require('util');

if (global.TextEncoder === undefined) {
  global.TextEncoder = TextEncoder;
}

if (global.TextDecoder === undefined) {
  global.TextDecoder = TextDecoder;
}

if (typeof window !== 'undefined' && window.matchMedia === undefined) {
  window.matchMedia = (query) => ({
    addEventListener: () => {},
    addListener: () => {},
    dispatchEvent: () => false,
    matches: false,
    media: query,
    onchange: null,
    removeEventListener: () => {},
    removeListener: () => {},
  });
}
