import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  TextInput,
  Alert,
  Image,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AddStep3() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  const BG = isDark ? "bg-slate-950" : "bg-lime-50";

  const CARD = isDark
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-green-100";

  const TEXT_PRIMARY = isDark ? "text-white" : "text-green-950";
  const TEXT_SECONDARY = isDark ? "text-gray-400" : "text-green-700";

  const inputBase =
    "rounded-2xl px-5 py-5 text-lg border";

  const inputStyle = isDark
    ? `${inputBase} bg-slate-800 text-white border-slate-700`
    : `${inputBase} bg-white text-green-950 border-green-100`;

  const [area, setArea] = useState("");
  const [landType, setLandType] = useState("");
  const [image, setImage] = useState("");

  const [modal, setModal] = useState(false);

  const [loaded, setLoaded] = useState(false);

  const options = [
    "Irrigated",
    "Rainfed",
    "Karewa",
    "Plains",
    "Hilly",
    "Terraced",
    "Others",
  ];

  useEffect(() => {
    (async () => {
      const d = await AsyncStorage.getItem("editingOrchard");
      if (!d) {
        setLoaded(true);
        return;
      }

      const o = JSON.parse(d);

      setArea(o.area ?? "");
      setLandType(o.landType ?? "");
      setImage(o.image ?? "");

      setLoaded(true);
    })();
  }, []);

  const pickImage = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      return Alert.alert("Permission required");
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!res.canceled) {
      setImage(res.assets[0].uri);
    }
  };

  const save = async () => {
    const editRaw = await AsyncStorage.getItem("editingOrchard");

    if (editRaw) {
      await AsyncStorage.setItem(
        "editingOrchard",
        JSON.stringify({
          ...JSON.parse(editRaw),
          area,
          landType,
          image,
        })
      );
    } else {
      await AsyncStorage.setItem(
        "newOrchard",
        JSON.stringify({
          area,
          landType,
          image,
        })
      );
    }

    router.replace("/home");
  };

  return (
    <SafeAreaView className={`flex-1 ${BG}`}>
      <ScrollView className="px-5">

        <Text className={`text-3xl font-bold mt-6 ${TEXT_PRIMARY}`}>
          Finish Setup
        </Text>

        <Text className={`mt-2 text-base ${TEXT_SECONDARY}`}>
          Step 3 of 3
        </Text>

        {/* AREA */}
        <View className="mt-6">
          <Text
            className={`mb-2 text-base font-semibold ${TEXT_PRIMARY}`}
          >
            Area in Canals
          </Text>

          <TextInput
            value={area}
            onChangeText={setArea}
            keyboardType="numeric"
            placeholder="Enter orchard area"
            placeholderTextColor="#888"
            className={inputStyle}
            style={{ textAlignVertical: "center" }}
          />
        </View>

        {/* LAND TYPE */}
        <View className="mt-6">
          <Text
            className={`mb-2 text-base font-semibold ${TEXT_PRIMARY}`}
          >
            Land Type
          </Text>

          <TouchableOpacity
            onPress={() => setModal(true)}
            className={`px-5 py-5 rounded-2xl border ${CARD}`}
          >
            <Text
              className={
                landType ? TEXT_PRIMARY : TEXT_SECONDARY
              }
            >
              {loaded ? landType || "Select Land Type" : "Loading..."}
            </Text>
          </TouchableOpacity>
        </View>

        {/* IMAGE */}
        <TouchableOpacity
          onPress={pickImage}
          className={`mt-8 h-64 rounded-3xl border overflow-hidden items-center justify-center ${CARD}`}
        >
          {image ? (
            <Image
              source={{ uri: image }}
              className="w-full h-full"
            />
          ) : (
            <>
              <Ionicons
                name="camera-outline"
                size={42}
                color="#6B7280"
              />

              <Text className="text-gray-400 mt-3">
                Tap to upload orchard image
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* SAVE */}
        <TouchableOpacity
          onPress={save}
          className="bg-green-600 py-5 rounded-2xl mt-10 mb-6"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Save Orchard
          </Text>
        </TouchableOpacity>

      </ScrollView>

      {/* MODAL */}
      <Modal
        isVisible={modal}
        onBackdropPress={() => setModal(false)}
        style={{ justifyContent: "center", margin: 20 }}
      >
        <View
          className={`${CARD} rounded-2xl p-4 max-h-[70%]`}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
          >
            {options.map((o) => (
              <TouchableOpacity
                key={o}
                onPress={() => {
                  setLandType(o);
                  setModal(false);
                }}
                className="py-4 border-b border-gray-200 dark:border-slate-700"
              >
                <Text
                  className={`text-base ${TEXT_PRIMARY}`}
                >
                  {o}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
