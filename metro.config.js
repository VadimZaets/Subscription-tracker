// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.alias = {
  '@': path.resolve(__dirname, 'src'),
};
config.resolver.sourceExts.push('sql');

// react-native-svg-transformer: .svg файли імпортуються як React-компоненти
// (`import Icon from './x.svg'`) замість сирих asset-URI — svg іде через
// babel-трансформер у сирцевий JSX, тому переносимо його з assetExts у sourceExts.
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'svg');
config.resolver.sourceExts.push('svg');

module.exports = config;
