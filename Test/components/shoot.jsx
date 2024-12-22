import { View, Text, ScrollView, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import Books from "../../components/Books";
import FormField from "../../components/FormField";
import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { TouchableOpacity } from "react-native";
import { icons } from "../../constants";
import moment from "moment";

const Create = () => {
  const db = useSQLiteContext();
  const [books, setBooks] = useState([]);
  const [cat, setCat] = useState("");
  const [form, setForm] = useState({ name: "", quantity: "" });
  const [showList, setShowList] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activityLogs, setActivityLogs] = useState([]);

  useEffect(() => {
    db.withTransactionAsync(async () => {
      await getData();
      await fetchActivityLogs();
    });
  }, [db]);

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
    const result = await db.getAllAsync(`SELECT * FROM Categories;`);
    setBooks(result);
  }

  async function addBook(name, quantity, catt) {
    if (!name || !quantity || !catt) {
      console.error(
        "Please provide a title, quantity, and category for the book."
      );
      return;
    }

    try {
      await db.withTransactionAsync(async () => {
        await db.runAsync(`INSERT INTO Categories (category) VALUES (?);`, [
          selectedItem,
        ]);
        await db.runAsync(
          `INSERT INTO Books(name, quantity, category_id) VALUES (?, ?, ?);`,
          [form.name, form.quantity, cat] // Use selectedCategory here
        );
        const category = await db.getAllAsync(
          `SELECT category FROM Categories WHERE id = ?`,
          [cat]
        ); // Log the activity
        await db.runAsync(
          `INSERT INTO Activities (action, timestamp, book_title, book_quantity, category_name) VALUES (?, ?, ?, ?, ?)`,
          [
            "Added",
            new Date().toISOString(),
            form.name,
            form.quantity,
            selectedItem,
          ]
        );
        console.log(form.name, form.quantity, cat);
        await getData(); //Update book list after adding
        await fetchActivityLogs();
        setForm({ name: "", quantity: "" });
        setCat("");
        setSelectedItem(null);
        setShowList(false);
      });
      console.log("Book added successfully!"); // Handle success scenario
    } catch (error) {
      console.error("Error adding book:", error); // Handle error scenario
    }
    addingActivitiesTable();
  }

  async function addingActivitiesTable() {
    try {
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
      console.log("Activities table added successfully.");
    } catch (error) {
      console.error("Error adding Activities table:", error);
    }
  }

  const addCategoryId = (prop1, prop2) => {
    setSelectedItem(prop1);
    setCat(prop2);
  };

  return (
    <SafeAreaView className="justify-center h-full px-5">
      <FlatList
        data={books}
        renderItem={({ item }) => (
          <View>
            {showList && (
              <View>
                <TouchableOpacity key={item.id}>
                  <Books
                    handlePress={() => addCategoryId(item.category, item.id)}
                    title={item.category}
                  />
                </TouchableOpacity>
                <FormField
                  title="Quantity"
                  value={selectedItem}
                  handleChangeText={(e) => setSelectedItem(e)}
                  otherStyles="mt-4"
                />
              </View>
            )}
          </View>
        )}
        ListHeaderComponent={
          <View>
            <Text className="text-[15px] font-psemibold mb-4 my-10">
              Add new books
            </Text>
            <View className="w-full min-h-[85vh] flex-col">
              <View className="w-full flex-col mb-7">
                <Text className="text-xl font-pbold">Title</Text>
                <FormField
                  title="Title"
                  value={form.name}
                  handleChangeText={(e) => setForm({ ...form, name: e })}
                  otherStyles="mt-4"
                />
              </View>
              <View className="w-full flex-col mb-7">
                <Text className="text-xl font-pbold">Quantity</Text>
                <FormField
                  title="Quantity"
                  value={form.quantity}
                  handleChangeText={(e) => setForm({ ...form, quantity: e })}
                  otherStyles="mt-4"
                  keyboardType="number"
                />
              </View>
              <TouchableOpacity
                onPress={() => setShowList(!showList)}
                className="bg-gray-200 p-3 mb-7 rounded-[20px] w-full h-14 justify-between items-center flex-row"
              >
                <Text className="text-xl font-psemibold">
                  {selectedItem ? selectedItem : "Category"}
                </Text>
                <Image
                  source={icons.downarrow}
                  className="w-5 h-5"
                  resizeMode="contain"
                />
              </TouchableOpacity>
          </View>
        }
        ListFooterComponent={}
      />
      <ScrollView>
        <Text className="text-[15px] font-psemibold mb-4 my-10">
          Add new books
        </Text>
        <View className="w-full min-h-[85vh] flex-col">
          <View className="w-full flex-col mb-7">
            <Text className="text-xl font-pbold">Title</Text>
            <FormField
              title="Title"
              value={form.name}
              handleChangeText={(e) => setForm({ ...form, name: e })}
              otherStyles="mt-4"
            />
          </View>
          <View className="w-full flex-col mb-7">
            <Text className="text-xl font-pbold">Quantity</Text>
            <FormField
              title="Quantity"
              value={form.quantity}
              handleChangeText={(e) => setForm({ ...form, quantity: e })}
              otherStyles="mt-4"
              keyboardType="number"
            />
          </View>
          <TouchableOpacity
            onPress={() => setShowList(!showList)}
            className="bg-gray-200 p-3 mb-7 rounded-[20px] w-full h-14 justify-between items-center flex-row"
          >
            <Text className="text-xl font-psemibold">
              {selectedItem ? selectedItem : "Category"}
            </Text>
            <Image
              source={icons.downarrow}
              className="w-5 h-5"
              resizeMode="contain"
            />
          </TouchableOpacity>
          {showList && (
            <View>
              {books.map((item) => (
                <TouchableOpacity key={item.id}>
                  <Books
                    handlePress={() => addCategoryId(item.category, item.id)}
                    title={item.category}
                  />
                </TouchableOpacity>
              ))}
              <FormField
                title="Quantity"
                value={selectedItem}
                handleChangeText={(e) => setSelectedItem(e)}
                otherStyles="mt-4"
              />
            </View>
          )}
          <CustomButton
            title="- ADD -"
            handlePress={() =>
              addBook(form.name, form.quantity, cat || selectedItem)
            }
            containerStyles="w-full mt-5"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
