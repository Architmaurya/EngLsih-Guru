import { Dimensions, StyleSheet } from 'react-native';
import { cardShadowStrong } from '../../../../theme/shadows';

export const CARD_IMAGE_HEIGHT = 200;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_PADDING = 32;
export const CARD_IMAGE_WIDTH = Math.round(SCREEN_WIDTH - CARD_PADDING);

export const styles = StyleSheet.create({
  cardImageContainer: {
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  cardImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: CARD_IMAGE_WIDTH,
    height: CARD_IMAGE_HEIGHT,
  },
});

export { cardShadowStrong };
