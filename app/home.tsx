import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home() {
  const router = useRouter();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [phone, setPhone] = useState<string>("");

  // ✅ Load user session
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userPhone =
          await AsyncStorage.getItem(
            "userPhone"
          );

        if (userPhone) {
          setPhone(userPhone);
        }

      } catch (err) {
        console.log(err);
      }
    };

    loadUser();
  }, []);

  // ✅ Logout
  const logout = async () => {
    try {

      // CLEAR SESSION
      await AsyncStorage.removeItem(
        "isLoggedIn"
      );

      await AsyncStorage.removeItem(
        "userPhone"
      );

      // GO TO WELCOME SCREEN
      router.replace("/");

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView
      className={`flex-1 items-center justify-center px-6 ${
        isDark ? "bg-black" : "bg-white"
      }`}
    >

      <Text
        className={`text-3xl font-bold mb-4 ${
          isDark
            ? "text-white"
            : "text-gray-900"
        }`}
      >
        Home Screen
      </Text>

      <Text
        className={`text-base mb-10 ${
          isDark
            ? "text-gray-400"
            : "text-gray-600"
        }`}
      >
        Logged in as +91 {phone}
      </Text>

      <TouchableOpacity
        onPress={logout}
        className="bg-red-500 py-4 px-10 rounded-2xl"
        activeOpacity={0.85}
      >
        <Text className="text-white font-semibold text-base">
          Logout
        </Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}
