const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
// NOTE: Some Windows + emulator setups can get "stuck" at ~99.x% when the app
// requests the bundle with `lazy=true` (lazy bundling / inline requires).
// This forces `lazy=false` for `/index.bundle` requests to make bundling stable.
const config = {
  resolver: {
    resolveRequest(context, moduleName, platform) {
      // Fix @react-navigation/bottom-tabs internal resolve: BottomTabBar.js -> ./BottomTabItem.js
      if (
        moduleName === './BottomTabItem.js' &&
        context.originModulePath &&
        context.originModulePath.includes('bottom-tabs') &&
        context.originModulePath.endsWith('BottomTabBar.js')
      ) {
        const dir = path.dirname(context.originModulePath);
        return {
          type: 'sourceFile',
          filePath: path.join(dir, 'BottomTabItem.js'),
        };
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
  server: {
    enhanceMiddleware: (middleware) => {
      return (req, res, next) => {
        try {
          if (typeof req?.url === 'string' && req.url.startsWith('/index.bundle')) {
            const url = new URL(req.url, 'http://localhost');
            if (url.searchParams.get('lazy') === 'true') {
              url.searchParams.set('lazy', 'false');
              req.url = `${url.pathname}?${url.searchParams.toString()}`;
            }
          }
        } catch {
          // ignore
        }
        return middleware(req, res, next);
      };
    },
  },
};

module.exports = withNativeWind(
  mergeConfig(getDefaultConfig(__dirname), config),
  { input: './global.css' },
);
