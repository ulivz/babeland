

/**
  * FIXME: how can we make that babel does not format code
  */
export const DEFAULT_TRANSFORM_OPTIONS: babel.TransformOptions = {
  /**
    * do not enable config file
    */
  configFile: false,
  /**
    * do not read babelrc
    */
  babelrc: false,
  compact: false,
  /**
    * enable typescript
    */
  parserOpts: {
    sourceType: 'module',
    plugins: [
      'typescript',
    ],
  },
};
