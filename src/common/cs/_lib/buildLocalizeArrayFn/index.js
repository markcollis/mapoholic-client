export default function buildLocalizeArrayFn(values, defaultType) {
  return function build(dirtyOptions) {
    const options = dirtyOptions || {};
    const type = (options.type) ? String(options.type) : defaultType;
    return values[type] || values[defaultType];
  };
}
