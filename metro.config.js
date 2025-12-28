// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Configure transformer for web platform
config.transformer = {
    ...config.transformer,
    unstable_allowRequireContext: true,
};

// Ensure proper module resolution for web
config.resolver = {
    ...config.resolver,
    sourceExts: [...(config.resolver?.sourceExts || []), 'mjs'],
};

module.exports = config;
