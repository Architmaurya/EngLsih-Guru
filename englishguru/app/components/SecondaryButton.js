import React from 'react';
import { Pressable, Text } from 'react-native';

export default function SecondaryButton({ onPress, label, rounded = 'xl', className = '' }) {
  const roundedClass = rounded === '14' ? 'rounded-[14px]' : 'rounded-xl';
  return (
    <Pressable
      onPress={onPress}
      className={`items-center justify-center border-2 border-button bg-white py-4 ${roundedClass} ${className}`.trim()}
    >
      <Text className="font-hindi text-body font-bold text-button">{label}</Text>
    </Pressable>
  );
}
