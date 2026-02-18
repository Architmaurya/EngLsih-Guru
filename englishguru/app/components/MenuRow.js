import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { cardShadow } from '../theme/shadows';

const ICON_COLOR = '#EC4899';
const CHEVRON_COLOR = '#6B7280';

export default function MenuRow({ icon, title, subtitle, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center rounded-2xl bg-white px-4 py-4"
      style={cardShadow}
    >
      <View className="mr-4 h-12 w-12 items-center justify-center rounded-xl bg-[#FCE7F3]">
        <Icon name={icon} size={24} color={ICON_COLOR} />
      </View>
      <View className="flex-1 min-w-0">
        <Text className="font-openSans text-body font-bold text-black">{title}</Text>
        <Text className="font-hindi mt-0.5 text-rest text-gray-500">{subtitle}</Text>
      </View>
      <Icon name="chevron-right" size={22} color={CHEVRON_COLOR} />
    </Pressable>
  );
}
