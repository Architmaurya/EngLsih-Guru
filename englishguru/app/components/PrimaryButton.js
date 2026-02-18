import React from 'react';
import { Pressable, Text } from 'react-native';

export default function PrimaryButton({ onPress, label, style, rounded = 'xl', className = '' }) {
  const roundedClass = rounded === '14' ? 'rounded-[14px]' : 'rounded-xl';
  return (
    <Pressable
      onPress={onPress}
      className={`items-center justify-center bg-button py-4 ${roundedClass} ${className}`.trim()}
      style={style}
    >
      <Text className="font-hindi text-body font-bold text-white">{label}</Text>
    </Pressable>
  );
}
