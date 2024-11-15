import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Search = () => {
  const { query } = useLocalSearchParams();
  return (
    <SafeAreaView className="items-center justify-center bg-primary h-full px-5">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <Text className="text-2xl font-pblack my-10 text-center">HOME</Text>
        <Text className="text-xl font-psemibold mb-4">Books</Text>
        <View></View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Search;
