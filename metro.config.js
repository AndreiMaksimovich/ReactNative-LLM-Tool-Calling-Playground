// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('pte');
config.resolver.assetExts.push('bin');
config.resolver.assetExts.push('json');

config.resolver.assetExts.push('zip');


module.exports = config;
