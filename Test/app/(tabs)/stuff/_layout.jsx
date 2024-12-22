import { Stack } from "expo-router";

export default function StuffStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Categories" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
