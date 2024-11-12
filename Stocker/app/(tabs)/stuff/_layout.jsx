import { Stack } from "expo-router";

export default function StuffStack() {
  return (
    <Stack>
      <Stack.Screen name="Categories" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
