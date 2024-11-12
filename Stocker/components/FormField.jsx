import { View, Text } from "react-native";
import React from "react";
import { TextInput } from "react-native";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
}) => {
  return (
    <View
      className={
        "my-3 w-full h-14 px-3 bg-gray-200 rounded-2xl focus:border-black-200 items-center flex-row space-x-4"
      }
    >
      <TextInput
        className="flex-1 text-black font-psemibold text-base"
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#7B7B8B"
        onChangeText={handleChangeText}
      />
    </View>
  );
};

export default FormField;
