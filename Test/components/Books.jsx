import { View, Text } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";

const Books = ({ books, handlePress, handleLongPress, title, quantity }) => {
  return (
    <TouchableOpacity
      key={books}
      onPress={handlePress}
      onLongPress={handleLongPress}
      className="border-b-2 border-solid border-secondary-100 p-3 rounded-[20px] mb-4 w-full h-14 flex-row justify-between"
    >
      <View className="overflow-hidden w-[90%] flex-wrap">
        <Text className="text-[15px] font-pregular">{title}</Text>
      </View>
      <View>
        <Text className="text-xl font-pbold text-gray">{quantity}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Books;
