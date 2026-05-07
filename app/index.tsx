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
      "A smart platform designed to simplify your agricultural operations and productivity.",
  },
  {
    id: "2",
    title: "<APP NAME>",
    textBlock1:
      "Built to modernize agricultural workflows with smart digital tools and seamless farm management.",
    textBlock2:
      "Powered through the collaboration of SKUAST and HADP to support innovation-driven farming ecosystems.",
  },
  {
    id: "3",
    appName: "<APP NAME>",
    title: "Grow Better Every Season",
    description:
      "Empowering farmers with technology-driven insights and smarter workflows.",
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

  // SESSION RESTORE
  useEffect(() => {
    const checkSession = async () => {
      const isLoggedIn =
        await AsyncStorage.getItem(
          "isLoggedIn"
        );

      if (isLoggedIn === "true") {
        router.replace("/home");
      }
    };

    checkSession();
  }, []);

  // TRACK SLIDE
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

  // DOT NAVIGATION
  const goToSlide = (index: number) => {
    setCurrentIndex(index);

    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
    });
  };

  // GO LOGIN
  const goToLogin = () => {
    router.push("/login");
  };

  // SLIDES
  const renderItem = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => {
    const isFirst = index === 0;
    const isSecond = index === 1;

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
                    : "text-green-950"
                }`}
              >
                {item.title}
              </Text>

              <Text
                className={`text-center mt-5 text-base leading-7 px-2 ${
                  isDark
                    ? "text-gray-400"
                    : "text-green-800"
                }`}
              >
                {item.description}
              </Text>

            </View>

            {/* LOGOS */}
            <View className="flex-1 items-center justify-center">

              <View className="w-44 h-44 items-center justify-center">
                <Image
                  source={require("../assets/skaust-logo.png")}
                  className="w-32 h-32"
                  resizeMode="contain"
                />
              </View>

              <View className="h-8" />

              <View className="w-44 h-44 items-center justify-center">
                <Image
                  source={require("../assets/hadp-logo.png")}
                  className="w-32 h-32"
                  resizeMode="contain"
                />
              </View>

            </View>
          </>
        ) : isSecond ? (
          /* SECOND SCREEN */
          <View className="flex-1">

            {/* APP NAME */}
            <View className="items-center mt-14">

              <Text
                className={`text-4xl font-bold text-center ${
                  isDark
                    ? "text-white"
                    : "text-green-950"
                }`}
              >
                {item.title}
              </Text>

            </View>

            {/* TEXT BLOCKS */}
            <View className="mt-14 space-y-5">

              <View
                className={`rounded-3xl p-5 border ${
                  isDark
                    ? "bg-slate-800 border-slate-700"
                    : "bg-white border-green-100"
                }`}
              >
                <Text
                  className={`text-base leading-7 text-center ${
                    isDark
                      ? "text-gray-300"
                      : "text-green-800"
                  }`}
                >
                  {item.textBlock1}
                </Text>
              </View>

              <View
                className={`rounded-3xl p-5 border mt-5 ${
                  isDark
                    ? "bg-slate-800 border-slate-700"
                    : "bg-white border-green-100"
                }`}
              >
                <Text
                  className={`text-base leading-7 text-center ${
                    isDark
                      ? "text-gray-300"
                      : "text-green-800"
                  }`}
                >
                  {item.textBlock2}
                </Text>
              </View>

            </View>

            {/* SIDE BY SIDE LOGOS */}
            <View className="flex-1 flex-row items-center justify-center gap-6">

              <View className="w-36 h-36 items-center justify-center">
                <Image
                  source={require("../assets/skaust-logo.png")}
                  className="w-24 h-24"
                  resizeMode="contain"
                />
              </View>

              <View className="w-36 h-36 items-center justify-center">
                <Image
                  source={require("../assets/hadp-logo.png")}
                  className="w-24 h-24"
                  resizeMode="contain"
                />
              </View>

            </View>

          </View>
        ) : (
          /* THIRD SCREEN */
          <View className="flex-1">

            {/* APP NAME */}
            <View className="items-center mt-14">

              <Text
                className={`text-4xl font-bold text-center ${
                  isDark
                    ? "text-white"
                    : "text-green-950"
                }`}
              >
                {item.appName}
              </Text>

            </View>

            {/* CONTENT */}
            <View className="flex-1 items-center justify-center">

              <View className="w-56 h-56 items-center justify-center">
                <Image
                  source={item.image}
                  className="w-32 h-32"
                  resizeMode="contain"
                />
              </View>

              {/* TITLE */}
              <Text
                className={`text-2xl font-semibold text-center mt-6 ${
                  isDark
                    ? "text-white"
                    : "text-green-900"
                }`}
              >
                {item.title}
              </Text>

              {/* DESCRIPTION */}
              <Text
                className={`text-center mt-5 text-base leading-7 px-3 ${
                  isDark
                    ? "text-gray-400"
                    : "text-green-800"
                }`}
              >
                {item.description}
              </Text>

            </View>

          </View>
        )}

      </View>
    );
  };

  return (
    <SafeAreaView
      className={`flex-1 ${
        isDark
          ? "bg-slate-950"
          : "bg-lime-50"
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
            activeOpacity={0.7}
          >
            <View
              className={`h-2 rounded-full mx-1 ${
                index === currentIndex
                  ? "bg-green-700 w-5"
                  : isDark
                  ? "bg-slate-700 w-2"
                  : "bg-green-200 w-2"
              }`}
            />
          </TouchableOpacity>
        ))}

      </View>

      {/* LOGIN BUTTON */}
      <View className="px-6 pb-10">

        <TouchableOpacity
          onPress={goToLogin}
          activeOpacity={0.85}
          className="bg-green-700 py-4 rounded-2xl items-center shadow-sm"
        >
          <Text className="text-white font-semibold text-base">
            Login with Mobile OTP
          </Text>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}
