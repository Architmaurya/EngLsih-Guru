import React from 'react';
import { Pressable, Text } from 'react-native';
import { roundedClass } from './PrimaryButton.styles';

export default function PrimaryButton({ onPress, label, style, rounded = 'xl', className = '' }) {
  return (
    <Pressable
      onPress={onPress}
      className={`items-center justify-center bg-button py-4 ${roundedClass(rounded)} ${className}`.trim()}
      style={style}
    >
      <Text className="font-hindi text-body font-bold text-white">{label}</Text>
    </Pressable>
  );
}
