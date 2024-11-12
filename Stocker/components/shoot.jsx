{
  /*  const [isLoading, setIsLoading] = useState(false);
const [books, setBooks] = useState();
const [dbLoaded, setDbLoaded] = useState(false);
const loadDatabase = async () => {
  const dbName = "StockerDatabase.db";
  const dbAsset = require("../../../assets/StockerDatabase.db");
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}SQLite`,
      { intermediates: true }
    );
    await FileSystem.downloadAsync(dbUri, dbFilePath);
  }
};
useEffect(() => {
  loadDatabase()
    .then(() => setDbLoaded(true))
    .catch((e) => console.error(e));
}, []);

if (!dbLoaded)
  return (
    <View className="bg-white flex-1 items-center justify-center">
      <ActivityIndicator size={"large"} />
      <Text>Loading Database...</Text>
    </View>
  );

const db = SQLite.useSQLiteContext();

async function getData() {
  const result = await db.getAllAsync("SELECT * FROM Books");
  setBooks(result);
}

if (isLoading) {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Text>Loading...</Text>
    </View>
  );
}
*/
}

import { Link, router } from "expo-router";
import { TouchableOpacity } from "react-native";
import { View, Text } from "react-native";
import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";

const Category = (books, deleteBook) => {
  const [books, setBooks] = useState();

  const db = useSQLiteContext();

  useEffect(() => {
    db.withTransactionAsync(async () => {
      await getData();
    });
  }, [db]);

  async function getData() {
    const result = await db.getAllAsync("SELECT * FROM Books");
    setBooks(result);
  }

  async function deleteBook() {
    db.withTransactionAsync(async () => {
      await db.runAsync("DELETE FROM Books WHERE id = ?;", [id]);
      await getData();
    });
  }

  return (
    <View>
      {books.map((book) => {
        <TouchableOpacity
          key={books.id}
          onPress={() => router.push("/stuff/[id]")}
          onLongPress={() => deleteBook(books.id)}
          className="bg-gray-300 p-3 rounded-[20px] mb-4 w-[95%] h-14 flex-row justify-center"
        >
          <Text className="text-xl font-pbold">{title}</Text>
        </TouchableOpacity>;
      })}
    </View>
  );
};
export default Category;

import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Category from "../../../components/Category";
import SearchInput from "../../../components/SearchInput";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite/next";
import { Link, router } from "expo-router";

const Categories = () => {
  const [books, setBooks] = useState([]);

  const db = useSQLiteContext();

  useEffect(() => {
    db.withTransactionAsync(async () => {
      await showData();
    });
  }, [db]);

  async function getData() {
    const result = await db.getAllAsync(
      `SELECT * FROM Books ORDER BY category;`
    );
    setBooks(result);
  }

  /*async function addData() {
    db.withTransactionAsync(async () => {
      const insert = await db.execAsync(
        `INSERT INTO Books(title, quantity, category) VALUES('Essential Biology', 16, 'SS 1');`
      );
      setBooks(insert);
      await getData();
    });
  }*/

  async function deleteBook(id) {
    db.withTransactionAsync(async () => {
      await db.runAsync(`DELETE FROM Books WHERE id = ?;`, [id]);
      await getData();
    });
  }

  const showData = () => {
    return books.map((book, index) => {
      return (
        <View key={index}>
          <Text>{book.category}</Text>
        </View>
      );
    });
  };

  const addNew = () => {
    const insert = db.withTransactionSync(() => {
      db.execSync(
        "INSERT INTO Books(title, quantity, category) VALUES('Learn Africa Physical and Health Education', 20, 'JSS 1');"
      );
      setBooks(insert);
      showData();
    });
  };

  return (
    <SafeAreaView className="justify-center h-full px-5">
      <ScrollView>
        <Text className="text-2xl font-pblack my-3 text-center">HOME</Text>
        <Text className="text-xl font-psemibold mb-4">Categories</Text>
        <SearchInput title="Categories" />
        <View>
          {books.map((book, index) => {
            return (
              <TouchableOpacity>
                <Category
                  key={index}
                  //handlePress={() => router.push(`/${book.category}`)}
                  handleLongPress={() => deleteBook(book.id)}
                  stuff={book.category}
                  items={book.category}
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
