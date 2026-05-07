import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const slides = [
  {
    id: "1",
    title: "Welcome to <APP NAME>",
    description:
      "A smart platform designed to simplify your daily tasks and boost productivity.",
  },
  {
    id: "2",
    title: "Stay Organized",
    description:
      "Manage everything in one place with a clean and intuitive interface built for you.",
    image: require("../assets/hadp-logo.png"),
  },
  {
    id: "3",
    title: "Get Started Now",
    description:
      "Join thousands of users and experience a smoother, faster way to work and grow.",
    image: require("../assets/skaust-logo.png"),
  },
];

export default function Onboarding() {
  const router = useRouter();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const flatListRef = useRef<FlatList>(null);

  const [currentIndex, setCurrentIndex] =
    useState<number>(0);

  // ✅ Session Restore
  useEffect(() => {
    const checkSession = async () => {
      try {
        const isLoggedIn =
          await AsyncStorage.getItem(
            "isLoggedIn"
          );

        // ONLY redirect if logged in
        if (isLoggedIn === "true") {
          router.replace("/home");
        }

      } catch (err) {
        console.log(err);
      }
    };

    checkSession();
  }, []);

  // ✅ Track slide
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: any) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewConfigRef = useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  // ✅ Dot navigation
  const goToSlide = (index: number) => {
    setCurrentIndex(index);

    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
    });
  };

  // ✅ Go Login
  const goToLogin = () => {
    router.push("/login");
  };

  // ✅ Slides
  const renderItem = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => {
    const isFirst = index === 0;

    return (
      <View className="w-screen flex-1 px-8">

        {/* FIRST SCREEN */}
        {isFirst ? (
          <>
            {/* TEXT */}
            <View className="items-center mt-12">

              <Text
                className={`text-4xl font-bold text-center ${
                  isDark
                    ? "text-white"
                    : "text-gray-900"
                }`}
              >
                {item.title}
              </Text>

              <Text
                className={`text-center mt-5 text-base leading-7 ${
                  isDark
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                {item.description}
              </Text>

            </View>

            {/* LOGOS */}
            <View className="flex-1 items-center justify-center">

              {/* SKAUST */}
              <View
                className={`w-44 h-44 rounded-full items-center justify-center border ${
                  isDark
                    ? "bg-[#111827] border-gray-800"
                    : "bg-white border-gray-100"
                }`}
              >
                <Image
                  source={require("../assets/skaust-logo.png")}
                  className="w-28 h-28"
                  resizeMode="contain"
                />
              </View>

              <View className="h-8" />

              {/* HADP */}
              <View
                className={`w-44 h-44 rounded-full items-center justify-center border ${
                  isDark
                    ? "bg-[#111827] border-gray-800"
                    : "bg-white border-gray-100"
                }`}
              >
                <Image
                  source={require("../assets/hadp-logo.png")}
                  className="w-28 h-28"
                  resizeMode="contain"
                />
              </View>

            </View>
          </>
        ) : (
          /* OTHER SCREENS */
          <View className="flex-1 items-center justify-center">

            <View
              className={`w-56 h-56 rounded-full items-center justify-center border ${
                isDark
                  ? "bg-[#111827] border-gray-800"
                  : "bg-white border-gray-100"
              }`}
            >
              <Image
                source={item.image}
                className="w-32 h-32"
                resizeMode="contain"
              />
            </View>

            <Text
              className={`text-3xl font-bold text-center mt-10 ${
                isDark
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              {item.title}
            </Text>

            <Text
              className={`text-center mt-5 text-base leading-7 ${
                isDark
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              {item.description}
            </Text>

          </View>
        )}

      </View>
    );
  };

  return (
    <SafeAreaView
      className={`flex-1 ${
        isDark ? "bg-black" : "bg-[#F4F7FF]"
      }`}
    >

      {/* SLIDER */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={
          onViewableItemsChanged
        }
        viewabilityConfig={viewConfigRef.current}
      />

      {/* DOTS */}
      <View className="flex-row justify-center mb-7">

        {slides.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => goToSlide(index)}
          >
            <View
              className={`h-2 rounded-full mx-1 ${
                index === currentIndex
                  ? "bg-blue-600 w-5"
                  : isDark
                  ? "bg-gray-700 w-2"
                  : "bg-gray-300 w-2"
              }`}
            />
          </TouchableOpacity>
        ))}

      </View>

      {/* LOGIN BUTTON */}
      <View className="px-6 pb-10">

        <TouchableOpacity
          onPress={goToLogin}
          className="bg-blue-600 py-4 rounded-2xl items-center"
          activeOpacity={0.85}
        >
          <Text className="text-white font-semibold text-base">
            Login with Mobile OTP
          </Text>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}
