import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

const TEAL = '#0D9488';

export default function ConfirmModal({
  visible,
  onRequestClose,
  title,
  message,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  confirmLabelColor = TEAL,
}) {
  const buttonStyle = { color: confirmLabelColor };
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50 px-6">
        <Pressable className="absolute inset-0" onPress={onRequestClose} />
        <Pressable
          className="w-full max-w-sm rounded-2xl bg-white p-6"
          onPress={(e) => e.stopPropagation()}
        >
          <Text className="font-openSans text-xl font-bold text-gray-900">{title}</Text>
          <Text className="font-hindi mt-3 text-rest text-gray-700">{message}</Text>
          <View className="mt-6 flex-row justify-end gap-4">
            <Pressable onPress={onCancel} hitSlop={12}>
              <Text className="font-openSans text-rest font-semibold uppercase tracking-wide" style={buttonStyle}>
                {cancelLabel}
              </Text>
            </Pressable>
            <Pressable onPress={onConfirm} hitSlop={12}>
              <Text className="font-openSans text-rest font-semibold uppercase tracking-wide" style={buttonStyle}>
                {confirmLabel}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </View>
    </Modal>
  );
}
