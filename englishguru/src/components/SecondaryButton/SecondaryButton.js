import React from 'react';
import { Pressable, Text } from 'react-native';
import { roundedClass } from './SecondaryButton.styles';

export default function SecondaryButton({ onPress, label, rounded = 'xl', className = '' }) {
  return (
    <Pressable
      onPress={onPress}
      className={`items-center justify-center border-2 border-button bg-white py-4 ${roundedClass(rounded)} ${className}`.trim()}
    >
      <Text className="font-hindi text-body font-bold text-button">{label}</Text>
    </Pressable>
  );
}
