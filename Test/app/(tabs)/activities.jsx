import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import moment from "moment";
import SearchInput from "../../components/SearchInput";

const Activities = () => {
  const db = useSQLiteContext();
  const [activityLogs, setActivityLogs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchActivityLogs = async () => {
    setRefreshing(true);
    try {
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
    } catch (error) {
      console.error("Error fetching activity logs:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchActivityLogs();
  }, [db]);

  async function clearTable() {
    db.withTransactionAsync(async () => {
      await db.runAsync(`DELETE FROM Activities;`);
      await fetchActivityLogs();
    });
  }

  return (
    <SafeAreaView className="justify-center h-full px-5">
      <View className="my-1">
        <View className="px-1 items-center flex-row justify-between">
          <Text className="text-xl font-pblack">Activities</Text>
          <TouchableOpacity
            className="rounded-lg bg-slate-300 w-20 h-6 items-center justify-center px-2"
            onPress={() => clearTable()}
          >
            <Text className="text-xs font-psemibold">Clear</Text>
          </TouchableOpacity>
        </View>
        <SearchInput title="Activities" />
      </View>
      <View className="rounded-[30px] bg-gray-200 mb-1 mx-1 p-3 h-[79%]">
        <FlatList
          data={activityLogs}
          renderItem={({ item }) => (
            <View className="border-b-2 border-solid p-3 rounded-[20px] mb-4 w-full flex-row justify-between">
              <View className="border-secondary w-5 h-5 border-solid rounded-md border-4 justify-center items-center "></View>
              <Text className="text-xs font-psemibold mx-2">
                <Text className="text-xs font-pbold">{item.action}</Text>:{" "}
                <Text className="text-xs font-pextrabold text-secondary">
                  {item.book_quantity}
                </Text>{" "}
                {item.book_title} textbooks in {item.category_name} at{" "}
                {item.formattedTime}
              </Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
          initialNumToRender={10} // Adjust this based on your data and desired performance
          windowSize={5}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchActivityLogs}
            />
          }
        />
      </View>
      <StatusBar backgroundColor="#fff" style="dark" />
    </SafeAreaView>
  );
};

export default Activities;
