import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Category from "../../../components/Category";
import SearchInput from "../../../components/SearchInput";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite/next";

const Categories = () => {
  const [books, setBooks] = useState([]);
  const db = useSQLiteContext();

  {
    /*  useEffect(() => {
    const createActivityLogTable = async () => {
      await db.runAsync(`
        CREATE TABLE IF NOT EXISTS ActivityLog (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          action TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          book_title TEXT,
          book_quantity INTEGER,
          category_name TEXT
        )
      `);
    };

    createActivityLogTable();
  }, [db]);*/
  }

  useEffect(() => {
    db.withTransactionAsync(async () => {
      await getData();
    });
  }, [db]);

  async function getData() {
    const result = await db.getAllAsync(`SELECT * FROM Categories;`);
    setBooks(result);
  }

  async function deleteBook(id) {
    db.withTransactionAsync(async () => {
      await db.runAsync(`DELETE FROM Books WHERE id = ?;`, [id]);
      await getData();
    });
  }

  return (
    <SafeAreaView className="justify-center h-full px-5">
      <ScrollView>
        <Text className="text-2xl font-pblack my-3 text-center">HOME</Text>
        <Text className="text-xl font-psemibold mb-4">Categories</Text>
        <SearchInput title="Categories" />
        <View>
          {books.map((book, index) => {
            return (
              <TouchableOpacity key={index}>
                <Category
                  key={index}
                  handlePress={() => console.log(book.id)}
                  handleLongPress={() => deleteBook(book.id)}
                  stuff={book.category}
                  items={book.id}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#fff" style="dark" />
    </SafeAreaView>
  );
};

export default Categories;
