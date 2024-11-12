import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/CustomButton";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

export default function App() {
  return (
    <SafeAreaView className="h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full h-[95vh] justify-center items-center px-5">
          <Text className="text-6xl font-pextrabold text-black">Stocker!</Text>
          <Text className="text-xs font-pregular text-black-200 text-center">
            Manage your books
          </Text>
          <CustomButton
            title="Proceed"
            handlePress={() => router.replace("/stuff/Categories")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#fff" style="dark" />
    </SafeAreaView>
  );
}
