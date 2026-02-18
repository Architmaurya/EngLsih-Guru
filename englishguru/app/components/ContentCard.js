import React from 'react';
import { Text, View } from 'react-native';

export default function ContentCard({ title, titleClassName, className = 'rounded-2xl bg-gray-50 p-5 mb-4', children }) {
  return (
    <View className={className}>
      {title != null && (
        <Text className={titleClassName ?? 'font-hindi text-rest font-semibold text-gray-800 mb-2'}>
          {title}
        </Text>
      )}
      {children}
    </View>
  );
}
