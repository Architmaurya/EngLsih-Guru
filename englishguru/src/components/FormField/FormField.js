import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { PLACEHOLDER_COLOR, defaultInputClassName } from './FormField.styles';

export default function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  containerClassName,
  inputClassName = defaultInputClassName,
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
