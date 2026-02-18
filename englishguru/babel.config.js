const isTest = process.env.BABEL_ENV === 'test' || process.env.NODE_ENV === 'test';

module.exports = {
  // `nativewind/babel` is a *preset* in NativeWind v4 (not a plugin).
  presets: ['module:@react-native/babel-preset', !isTest && 'nativewind/babel'].filter(Boolean),
  plugins: [],
};
