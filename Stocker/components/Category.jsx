import { useNavigation } from "expo-router";
import { TouchableOpacity } from "react-native";
import { View, Text } from "react-native";

const Category = ({ books, items, handlePress, handleLongPress, stuff }) => {
  const navigation = useNavigation();
  const handleNavigation = (id) => {
    navigation.navigate("[id]", { id });
  };

  return (
    <View>
      <TouchableOpacity
        key={books}
        onPress={() => handleNavigation(items)}
        onLongPress={handleLongPress}
        className="bg-gray-200 p-3 rounded-[20px] mb-4 w-full h-14 justify-center items-center"
      >
        <Text className="text-xl font-pbold">{stuff}</Text>
      </TouchableOpacity>
    </View>
  );
};
export default Category;
