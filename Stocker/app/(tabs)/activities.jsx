import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Books from "../../components/Books";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { useSQLiteContext } from "expo-sqlite/next";

const Activities = () => {
  const db = useSQLiteContext();
  return (
    <SafeAreaView className="justify-center h-full px-5">
      <Text className="text-xl font-pblack mb-4 my-5">Activities</Text>
      <ScrollView className="rounded-[30px] bg-gray-200 mb-6 mx-1 p-3">
        <View>
          <TouchableOpacity>
            <Books title="English" quantity="20" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Books title="Mathematics" quantity="20" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Books title="Civic Education" quantity="20" />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#fff" style="dark" />
    </SafeAreaView>
  );
};

export default Activities;
