import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Books from "../../components/Books";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite/next";
import moment from "moment";

const Activities = () => {
  const db = useSQLiteContext();
  const [activityLogs, setActivityLogs] = useState([]);

  useEffect(() => {
    const fetchActivityLogs = async () => {
      const result = await db.getAllAsync(
        "SELECT * FROM Activities ORDER BY timestamp DESC"
      );
      setActivityLogs(
        result.map((log) => ({
          ...log,
          formattedTime: moment(log.timestamp).format(
            "MMMM Do YYYY, h:mm:ss a"
          ),
        }))
      );
    };

    fetchActivityLogs();
  }, [db]);

  return (
    <SafeAreaView className="justify-center h-full px-5">
      <Text className="text-xl font-pblack mb-4 my-5">Activities</Text>
      <View className="rounded-[30px] bg-gray-200 mb-6 mx-1 p-3 h-[90%]">
        <FlatList
          data={activityLogs}
          renderItem={({ item }) => (
            <View className="border-b-2 border-solid p-3 rounded-[20px] mb-4 w-full flex-row justify-between">
              <View className="w-5 h-5 border-solid rounded-md border-4 justify-center items-center"></View>
              <Text className="text-xs font-psemibold mx-2">
                <Text className="text-xs font-pbold">{item.action}</Text>:{" "}
                {item.book_quantity} {item.book_title} textbooks in category{" "}
                {item.category_name} at {item.formattedTime}
              </Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
      <StatusBar backgroundColor="#fff" style="dark" />
    </SafeAreaView>
  );
};

export default Activities;
