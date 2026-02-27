import { Platform } from 'react-native';

export const logoShadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  android: {
    elevation: 10,
  },
});
