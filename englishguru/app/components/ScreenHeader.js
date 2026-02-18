import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function ScreenHeader({ onBack, title, leftContent }) {
  return (
    <View className="flex-row items-center border-b border-gray-100 px-4 py-3">
      <Pressable onPress={onBack} hitSlop={12} className="mr-3 h-10 w-10 items-center justify-center">
        <Icon name="chevron-left" size={24} color="#1f2937" />
      </Pressable>
      {leftContent}
      <Text className="font-hindi text-lg font-bold text-gray-900">{title}</Text>
    </View>
  );
}
