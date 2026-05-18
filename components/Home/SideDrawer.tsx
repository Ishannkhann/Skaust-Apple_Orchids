import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  Modal,
} from "react-native";

import {
  X,
  House,
  Bell,
  User,
  LogOut,
  Sprout,
} from "lucide-react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { router } from "expo-router";

interface SideDrawerProps {
  visible: boolean;
  onClose: () => void;
}

export default function SideDrawer({
  visible,
  onClose,
}: SideDrawerProps) {
  const isDark = useColorScheme() === "dark";

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("isLoggedIn");
      await AsyncStorage.removeItem("userPhone");
      router.replace("/");
    } catch (error) {
      console.log(error);
    }
  };

  const menuItems = [
    {
      title: "Home",
      icon: House,
      onPress: () => {
        onClose();
        router.push("/home");
      },
    },

    {
      title: "My Orchards",
      icon: Sprout,
      onPress: () => {
        onClose();
        router.push("/orchard/my-orchards");
      },
    },

    {
      title: "Notifications",
      icon: Bell,
      onPress: () => {
        onClose();
        router.push("/notifications");
      },
    },

    {
      title: "Profile",
      icon: User,
      onPress: () => {
        onClose();
      },
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >

      {/* OVERLAY */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1 bg-black/40 flex-row"
      >

        {/* DRAWER */}
        <TouchableOpacity
          activeOpacity={1}
          className={`w-[78%] h-full pt-16 px-5 ${
            isDark ? "bg-slate-900" : "bg-white"
          }`}
        >

          {/* TOP */}
          <View className="flex-row items-center justify-between">

            <Text
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-green-950"
              }`}
            >
              Menu
            </Text>

            <TouchableOpacity onPress={onClose}>
              <X size={24} color={isDark ? "white" : "#14532d"} />
            </TouchableOpacity>

          </View>

          {/* MENU ITEMS */}
          <View className="mt-10">

            {menuItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <TouchableOpacity
                  key={index}
                  onPress={item.onPress}
                  activeOpacity={0.8}
                  className={`flex-row items-center py-4 px-4 rounded-2xl mb-3 ${
                    isDark ? "bg-slate-800" : "bg-lime-50"
                  }`}
                >

                  <Icon
                    size={22}
                    color={isDark ? "white" : "#14532d"}
                  />

                  <Text
                    className={`ml-4 text-base font-semibold ${
                      isDark ? "text-white" : "text-green-950"
                    }`}
                  >
                    {item.title}
                  </Text>

                </TouchableOpacity>
              );
            })}

          </View>

          {/* LOGOUT */}
          <TouchableOpacity
            onPress={logout}
            activeOpacity={0.85}
            className="mt-auto mb-10 flex-row items-center bg-red-500 py-4 rounded-2xl justify-center"
          >

            <LogOut size={20} color="white" />

            <Text className="text-white font-bold ml-3">
              Logout
            </Text>

          </TouchableOpacity>

        </TouchableOpacity>

      </TouchableOpacity>

    </Modal>
  );
}
