import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  TextInput,
} from "react-native";

import Modal from "react-native-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

type FieldKey = "variety" | "orchardType" | "soilType";

export default function AddStep2() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  const BG = isDark ? "bg-slate-950" : "bg-lime-50";

  const CARD = isDark
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-green-100";

  const TEXT_PRIMARY = isDark ? "text-white" : "text-green-950";
  const TEXT_SECONDARY = isDark ? "text-gray-400" : "text-green-700";

  // ✅ FORM STATE (UNCHANGED)
  const [variety, setVariety] = useState("");
  const [orchardType, setOrchardType] = useState("");
  const [soilType, setSoilType] = useState("");
  const [age, setAge] = useState("");

  const [modal, setModal] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [activeField, setActiveField] = useState<FieldKey | null>(null);

  useEffect(() => {
    (async () => {
      const d = await AsyncStorage.getItem("editingOrchard");
      if (!d) return;

      const o = JSON.parse(d);

      setVariety(o.variety ?? "");
      setOrchardType(o.orchardType ?? "");
      setSoilType(o.soilType ?? "");
      setAge(o.age ?? "");
    })();
  }, []);

  const openDropdown = (field: FieldKey, list: string[]) => {
    setActiveField(field);
    setOptions(list);
    setModal(true);
  };

  const selectOption = (value: string) => {
    if (activeField === "variety") setVariety(value);
    if (activeField === "orchardType") setOrchardType(value);
    if (activeField === "soilType") setSoilType(value);

    setModal(false);
    setActiveField(null);
  };

  const next = async () => {
    const editRaw = await AsyncStorage.getItem("editingOrchard");

    if (editRaw) {
      await AsyncStorage.setItem(
        "editingOrchard",
        JSON.stringify({
          ...JSON.parse(editRaw),
          variety,
          orchardType,
          soilType,
          age,
        })
      );
    } else {
      await AsyncStorage.setItem(
        "newOrchard",
        JSON.stringify({
          variety,
          orchardType,
          soilType,
          age,
        })
      );
    }

    router.push("/orchard/add-step-3");
  };

  // ✅ STEP 1 STYLE INPUT BASE (MATCHED EXACTLY)
  const inputBase =
    "rounded-2xl px-5 py-5 text-lg border";

  const inputStyle = isDark
    ? `${inputBase} bg-slate-800 text-white border-slate-700`
    : `${inputBase} bg-white text-green-950 border-green-100`;

  const modalCard = isDark
    ? "bg-slate-900 border border-slate-700"
    : "bg-white border border-green-100";

  const Dropdown = (
    label: string,
    value: string,
    field: FieldKey,
    list: string[]
  ) => (
    <View className="mt-6">
      <Text className={`mb-2 text-base font-semibold ${TEXT_PRIMARY}`}>
        {label}
      </Text>

      <TouchableOpacity
        onPress={() => openDropdown(field, list)}
        className={`px-5 py-5 rounded-2xl border ${CARD}`}
      >
        <Text className={value ? TEXT_PRIMARY : TEXT_SECONDARY}>
          {value || `Select ${label}`}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className={`flex-1 ${BG}`}>
      <ScrollView className="px-5">

        <Text className={`text-3xl font-bold mt-6 ${TEXT_PRIMARY}`}>
          Orchard Setup
        </Text>

        <Text className={TEXT_SECONDARY}>Step 2 of 3</Text>

        {Dropdown("Apple Variety", variety, "variety", [
          "Red Delicious",
          "Royal Delicious",
          "Rich-a-Red",
          "Scarlet Spur",
          "Red Chief",
          "Golden Delicious",
          "Maharaji",
          "American Trel",
          "Ambri",
          "Gala strains",
          "Fuji",
          "Honeycrisp",
          "Granny Smith",
          "Jonagold",
          "Oregon Spur",
          "Early Shanburry",
          "Spartan",
          "McIntosh",
          "Others",
        ])}

        {Dropdown("Orchard Type", orchardType, "orchardType", [
          "Traditional Orchard",
          "Medium Density Orchard",
          "High Density Orchard",
          "Ultra High Density Orchard",
        ])}

        {Dropdown("Soil Type", soilType, "soilType", [
          "Clayey",
          "Loamy",
          "Sandy",
          "Clay Loam",
          "Sandy Loam",
          "Silty",
          "Silty Loam",
          "Gravelly",
          "Organic Rich Soil",
        ])}

        {/* ✅ AGE INPUT MATCHED WITH STEP 1 STYLE */}
        <View className="mt-6">
          <Text className={`mb-2 text-base font-semibold ${TEXT_PRIMARY}`}>
            Orchard Age
          </Text>

          <TextInput
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            placeholder="Enter orchard age"
            placeholderTextColor="#888"
            className={inputStyle}
            style={{ textAlignVertical: "center" }}
          />
        </View>

        <TouchableOpacity
          onPress={next}
          className="bg-green-600 py-5 rounded-2xl mt-10 mb-10"
        >
          <Text className="text-white text-center font-semibold">
            Continue
          </Text>
        </TouchableOpacity>

      </ScrollView>

      {/* ✅ FIXED DROPDOWN MODAL LAYOUT */}
      <Modal
        isVisible={modal}
        onBackdropPress={() => setModal(false)}
        style={{ justifyContent: "center", margin: 20 }}
      >
        <View
          className={`${modalCard} rounded-3xl overflow-hidden`}
          style={{
            maxHeight: "70%",
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
          >
            {options.map((o, index) => (
              <TouchableOpacity
                key={o}
                onPress={() => selectOption(o)}
                className={`py-4 px-5 ${
                  index !== options.length - 1
                    ? isDark
                      ? "border-b border-slate-700"
                      : "border-b border-green-100"
                    : ""
                }`}
              >
                <Text
                  className={`text-base ${
                    isDark ? "text-white" : "text-green-950"
                  }`}
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
