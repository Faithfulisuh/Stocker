import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Books from "../../../components/Books";
import { StatusBar } from "expo-status-bar";
import { useSQLiteContext } from "expo-sqlite";
import { useRoute } from "@react-navigation/native";

const List = () => {
  const db = useSQLiteContext();
  const route = useRoute();
  const { id } = route.params;
  const [books, setBooks] = useState([]);
  const [cat, setCat] = useState([]);
  const [num, setNum] = useState("");
  const [quantity, setQuantity] = useState("");
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
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
      }
    };

    fetchData();
  }, [db, id]);

  async function getData() {
    const bookResults = await db.getAllAsync(
      `SELECT * FROM Books WHERE category_id = ?;`,
      [id]
    );
    setBooks(bookResults);
  }

  async function deleteBook(id) {
    db.withTransactionAsync(async () => {
      await db.runAsync(`DELETE FROM Books WHERE id = ?;`, [id]);
      await getData();
    });
  }
  async function increaseQuantity(newQuantity, oldQuantity, selectedId) {
    if (!newQuantity) {
      console.error("Enter a value.");
      return;
    }
    db.withTransactionAsync(async () => {
      setShowList(!showList);
      const ans = parseInt(newQuantity) + parseInt(oldQuantity);
      setQuantity(ans);
      await db.runAsync(`UPDATE Books SET quantity = ? WHERE id = ?;`, [
        ans,
        selectedId,
      ]);
      await getData();
      setNum("");
    });
  }

  async function decreaseQuantity(newQuantity, oldQuantity, selectedId) {
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
      setQuantity(ans);
      await db.runAsync(`UPDATE Books SET quantity = ? WHERE id = ?;`, [
        ans,
        selectedId,
      ]);
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
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        {cat && ( // Render category only if cat is not null
          <Text className="text-xl font-psemibold my-10">
            Books for {cat.category}
          </Text>
        )}
        <View>
          {books.map((book, index) => {
            return (
              <TouchableOpacity key={index}>
                <Books
                  key={index}
                  handlePress={() => showItem(book.id)}
                  handleLongPress={() => deleteBook(book.id)}
                  title={book.name}
                  quantity={book.quantity}
                />
                {showList === book.id && (
                  <View className="flex-row justify-evenly">
                    <TextInput
                      value={num}
                      onChangeText={(e) => setNum(e)}
                      keyboardType="numeric"
                      className="text-black font-psemibold text-base border-2 p-1 px-3 w-28 text-center"
                    />
                    <TouchableOpacity
                      onPress={() =>
                        increaseQuantity(num, book.quantity, book.id)
                      }
                      className={
                        "bg-black-100 rounded-xl h-15 w-28 justify-center items-center "
                      }
                    >
                      <Text className="text-white font-psemibold text-xs">
                        Add
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        decreaseQuantity(num, book.quantity, book.id)
                      }
                      className={
                        "bg-black-100 rounded-xl h-15 w-28 justify-center items-center "
                      }
                    >
                      <Text className="text-white font-psemibold text-xs">
                        Remove
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#fff" style="dark" />
    </SafeAreaView>
  );
};

export default List;
