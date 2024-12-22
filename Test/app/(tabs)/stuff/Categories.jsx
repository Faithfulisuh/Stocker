import { Text, TouchableOpacity, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Category from "../../../components/Category";
import SearchInput from "../../../components/SearchInput";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { useRouter } from "expo-router";

const Categories = () => {
  const [books, setBooks] = useState([]);
  const db = useSQLiteContext();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const createActivityLogTable = async () => {
      await db.runAsync(`
        CREATE TABLE IF NOT EXISTS Activities (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          action TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          book_title TEXT,
          book_quantity INTEGER,
          category_name TEXT
        )
      `);
    };

    const CategoriesTable = async () => {
      await db.runAsync(`
        CREATE TABLE IF NOT EXISTS Categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          category TEXT NOT NULL
        )
      `);
    };

    const BooksTable = async () => {
      await db.runAsync(`
        CREATE TABLE IF NOT EXISTS Books (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          quantity INTEGER,
          category_id INTEGER,
          FOREIGN KEY (category_id) REFERENCES Categories (id)
        )
      `);
    };

    CategoriesTable();
    BooksTable();
    createActivityLogTable();
  }, [db]);

  useEffect(() => {
    getData();
  }, [db]);

  async function getData() {
    setRefreshing(true);
    try {
      const result = await db.getAllAsync(
        `SELECT * FROM Categories ORDER BY id DESC;`
      );
      setBooks(result);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setRefreshing(false);
    }
  }

  async function deleteBook(id) {
    db.withTransactionAsync(async () => {
      await db.runAsync(`DELETE FROM Categories WHERE id = ?;`, [id]);
      await getData();
    });
  }

  const handlePress = (id) => {
    router.push(`${id}`);
  };

  return (
    <SafeAreaView className="justify-center h-full px-5">
      <Text className="text-xl font-psemibold mb-4">Categories</Text>
      <SearchInput title="Categories" />
      <FlatList
        data={books}
        renderItem={({ item }) => (
          <TouchableOpacity key={item.id}>
            <Category
              categoryName={item.category}
              categoryId={item.id}
              //handlePress={() => console.log(item.id)}
              handleLongPress={() => deleteBook(item.id)}
            />
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

export default Categories;
