import {
  FlatList,
  View,
  Text,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Books from "../../../components/Books";
import { StatusBar } from "expo-status-bar";
import { useSQLiteContext } from "expo-sqlite";
import { useRoute } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import moment from "moment";

const List = () => {
  const db = useSQLiteContext();
  const { id } = useLocalSearchParams();
  //const route = useRoute();
  //const { id } = route.params;
  const [books, setBooks] = useState([]);
  const [cat, setCat] = useState([]);
  const [num, setNum] = useState("");
  //const [quantity, setQuantity] = useState("");
  const [showList, setShowList] = useState(false);
  const [activityLogs, setActivityLogs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setRefreshing(true);
      try {
        await db.withTransactionAsync(async () => {
          const bookResults = await db.getAllAsync(
            `SELECT * FROM Books WHERE category_id = ?;`,
            [id]
          );
          setBooks(bookResults);

          const catResults = await db.getAllAsync(
            `SELECT * FROM Categories WHERE id = ?;`,
            [id]
          );
          setCat(catResults[0] || null); // Get the first item or set to null if empty
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        // You can display an error message to the user here
      } finally {
        setRefreshing(false);
      }
      await fetchActivityLogs();
    };
    fetchData();
  }, [db, id]);

  const fetchActivityLogs = async () => {
    const result = await db.getAllAsync(
      "SELECT * FROM Activities ORDER BY timestamp DESC"
    );

    setActivityLogs(
      result.map((log) => ({
        ...log,
        formattedTime: moment(log.timestamp).format("MMMM Do YYYY, h:mm:ss a"),
      }))
    );
  };

  async function getData() {
    const bookResults = await db.getAllAsync(
      `SELECT * FROM Books WHERE category_id = ?;`,
      [id]
    );
    setBooks(bookResults);
  }

  async function deleteBook(id, name, quantity) {
    db.withTransactionAsync(async () => {
      const book = await db.getAllAsync(`SELECT * FROM Books WHERE id = ?`, [
        id,
      ]);
      await db.runAsync(`DELETE FROM Books WHERE id = ?;`, [id]);
      await getData();
      // Log the deletion activity
      await db.runAsync(
        `INSERT INTO Activities (action, timestamp, book_title, book_quantity, category_name) VALUES (?, ?, ?, ?, ?)`,
        ["Deleted", new Date().toISOString(), name, quantity, cat.category]
      );
      await fetchActivityLogs();
      await getData();
    });
  }

  async function increaseQuantity(newQuantity, oldQuantity, selectedId, name) {
    if (!newQuantity) {
      console.error("Enter a value.");
      return;
    }

    db.withTransactionAsync(async () => {
      setShowList(!showList);
      const ans = parseInt(newQuantity) + parseInt(oldQuantity);
      await db.runAsync(`UPDATE Books SET quantity = ? WHERE id = ?;`, [
        ans,
        selectedId,
      ]);

      await db.runAsync(
        `INSERT INTO Activities (action, timestamp, book_title, book_quantity, category_name) VALUES (?, ?, ?, ?, ?)`,
        ["Added", new Date().toISOString(), name, newQuantity, cat.category]
      );
      await fetchActivityLogs();
      await getData();
      setNum("");
    });
  }

  async function decreaseQuantity(newQuantity, oldQuantity, selectedId, name) {
    if (!newQuantity) {
      console.error("Enter a value.");
      return;
    } else if (newQuantity > oldQuantity) {
      console.error("This value is greater than the current quantity!");
      return;
    }
    db.withTransactionAsync(async () => {
      setShowList(!showList);
      const ans = parseInt(oldQuantity) - parseInt(newQuantity);
      await db.runAsync(`UPDATE Books SET quantity = ? WHERE id = ?;`, [
        ans,
        selectedId,
      ]);

      await db.runAsync(
        `INSERT INTO Activities (action, timestamp, book_title, book_quantity, category_name) VALUES (?, ?, ?, ?, ?)`,
        ["Removed", new Date().toISOString(), name, newQuantity, cat.category]
      );
      await fetchActivityLogs();
      await getData();
      setNum("");
    });
  }

  const showItem = (Id) => {
    if (showList === Id) {
      setShowList(false);
    } else {
      setShowList(Id);
    }
  };

  return (
    <SafeAreaView className="items-center justify-center bg-primary h-full px-5">
      {cat && ( // Render category only if cat is not null
        <Text className="text-xl font-psemibold my-10">
          Books for {cat.category}
        </Text>
      )}
      <FlatList
        data={books}
        renderItem={({ item }) => (
          <TouchableOpacity key={item.id}>
            <Books
              handlePress={() => showItem(item.id)}
              handleLongPress={() =>
                deleteBook(item.id, item.name, item.quantity)
              }
              title={item.name}
              quantity={item.quantity}
            />
            {showList === item.id && (
              <View className="flex-row justify-evenly">
                <TextInput
                  value={num}
                  onChangeText={(e) => setNum(e)}
                  keyboardType="numeric"
                  className="text-black rounded-xl font-psemibold text-base border-2 p-1 px-3 w-20 text-center"
                />
                <TouchableOpacity
                  onPress={() =>
                    increaseQuantity(num, item.quantity, item.id, item.name)
                  }
                  className={
                    "bg-black-100 rounded-xl h-15 w-24 justify-center items-center "
                  }
                >
                  <Text className="text-white font-psemibold text-xs">Add</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    decreaseQuantity(num, item.quantity, item.id, item.name)
                  }
                  className={
                    "bg-black-100 rounded-xl h-15 w-24 justify-center items-center "
                  }
                >
                  <Text className="text-white font-psemibold text-xs">
                    Remove
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        initialNumToRender={10} // Adjust this based on your data and desired performance
        windowSize={5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={getData} />
        }
      />
      <StatusBar backgroundColor="#fff" style="dark" />
    </SafeAreaView>
  );
};

export default List;
