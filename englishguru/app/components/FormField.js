import React from 'react';
import { Text, TextInput, View } from 'react-native';

const PLACEHOLDER_COLOR = '#9CA3AF';

export default function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  containerClassName,
  inputClassName = 'mb-8 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-openSans text-body text-gray-900',
}) {
  return (
    <View className={containerClassName ?? ''}>
      <Text className="font-hindi mb-2 text-rest font-semibold text-gray-700">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={PLACEHOLDER_COLOR}
        keyboardType={keyboardType}
        className={inputClassName}
      />
    </View>
  );
}
