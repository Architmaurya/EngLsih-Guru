import React from 'react';
import { Text, View } from 'react-native';
import { defaultClassName, defaultTitleClassName } from './ContentCard.styles';

export default function ContentCard({
  title,
  titleClassName,
  className = defaultClassName,
  children,
}) {
  return (
    <View className={className}>
      {title != null && (
        <Text className={titleClassName ?? defaultTitleClassName}>{title}</Text>
      )}
      {children}
    </View>
  );
}
