const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

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

module.exports = withNativeWind(config, { input: './global.css' });
