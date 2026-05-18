import React, { useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  useColorScheme,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

// ─── Type (matches your existing Orchard shape) ───────────────────────────────

type Orchard = {
  id: string;
  name: string;
  message: string;
  image?: string;
  variety?: string;
  orchardType?: string;
  area?: string;
  landType?: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 20 * 2 - 12) / 2; // 2 columns, 20px side padding, 12px gap

const CROP_COLORS: Record<string, { bg: string; text: string }> = {
  Apple:  { bg: "#EAF3DE", text: "#3B6D11" },
  Mango:  { bg: "#FAEEDA", text: "#854F0B" },
  Cherry: { bg: "#FAECE7", text: "#993C1D" },
  Walnut: { bg: "#F1EFE8", text: "#5F5E5A" },
  Pear:   { bg: "#EAF3DE", text: "#27500A" },
  Orange: { bg: "#FAEEDA", text: "#633806" },
};
const DEFAULT_CROP_STYLE = { bg: "#EAF3DE", text: "#3B6D11" };

// ─── Orchard Card ─────────────────────────────────────────────────────────────

const OrchardCard = React.memo(
  ({
    item,
    isDark,
    onPress,
  }: {
    item: Orchard;
    isDark: boolean;
    onPress: () => void;
  }) => {
    const cropStyle = CROP_COLORS[item.variety ?? ""] ?? DEFAULT_CROP_STYLE;

    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={{ width: CARD_WIDTH }}
        className={`rounded-3xl overflow-hidden border ${
          isDark
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-green-100"
        }`}
      >
        {/* Image or placeholder */}
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={{ width: "100%", height: 96 }}
            resizeMode="cover"
          />
        ) : (
          <View
            className="w-full items-center justify-center"
            style={{ height: 96, backgroundColor: cropStyle.bg }}
          >
            <Ionicons name="leaf-outline" size={36} color={cropStyle.text} />
          </View>
        )}

        {/* Card content */}
        <View className="p-3">
          <Text
            numberOfLines={1}
            className={`text-sm font-bold ${
              isDark ? "text-white" : "text-green-950"
            }`}
          >
            {item.name}
          </Text>

          {(item.variety || item.orchardType) && (
            <Text
              numberOfLines={1}
              className={`text-xs mt-0.5 ${
                isDark ? "text-gray-400" : "text-green-700"
              }`}
            >
              {[item.variety, item.orchardType].filter(Boolean).join(" • ")}
            </Text>
          )}

          {item.area && (
            <Text
              numberOfLines={1}
              className={`text-xs mt-0.5 ${
                isDark ? "text-gray-500" : "text-green-600"
              }`}
            >
              {item.area} Canals{item.landType ? ` • ${item.landType}` : ""}
            </Text>
          )}

          {/* Crop badge — shows first variety only to avoid overflow */}
          {item.variety && (
            <View
              className="self-start mt-2 rounded-full px-2 py-0.5"
              style={{ backgroundColor: cropStyle.bg, maxWidth: "100%" }}
            >
              <Text
                numberOfLines={1}
                className="text-xs font-medium"
                style={{ color: cropStyle.text }}
              >
                {item.variety.split(",")[0].trim()}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
);

// ─── Filter Dropdown ──────────────────────────────────────────────────────────

const FilterDropdown = ({
  options,
  active,
  isDark,
  onSelect,
}: {
  options: string[];
  active: string;
  isDark: boolean;
  onSelect: (val: string) => void;
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <View style={{ position: "relative", zIndex: 10 }}>
      <TouchableOpacity
        onPress={() => setOpen((o) => !o)}
        activeOpacity={0.8}
        style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
        className={`rounded-2xl px-4 py-2.5 border ${
          isDark
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-green-100"
        }`}
      >
        <Ionicons
          name="options-outline"
          size={15}
          color={isDark ? "#9ca3af" : "#4b7c3f"}
        />
        <Text
          numberOfLines={1}
          style={{ maxWidth: 180 }}
          className={`text-sm font-medium ${
            active !== "All"
              ? isDark ? "text-green-400" : "text-green-700"
              : isDark ? "text-gray-400" : "text-green-800"
          }`}
        >
          {active === "All" ? "All types" : active}
        </Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={14}
          color={isDark ? "#9ca3af" : "#4b7c3f"}
        />
      </TouchableOpacity>

      {open && (
        <View
          style={{ position: "absolute", top: 46, left: 0, right: 0, minWidth: 220, zIndex: 999 }}
          className={`rounded-2xl border overflow-hidden ${
            isDark
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-green-100"
          }`}
        >
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => { onSelect(opt); setOpen(false); }}
              activeOpacity={0.7}
              style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12 }}
              className={opt !== options[options.length - 1]
                ? isDark ? "border-b border-slate-700" : "border-b border-green-50"
                : ""}
            >
              <Text
                numberOfLines={1}
                style={{ flex: 1 }}
                className={`text-sm ${
                  active === opt
                    ? isDark ? "text-green-400 font-semibold" : "text-green-700 font-semibold"
                    : isDark ? "text-gray-300" : "text-green-950"
                }`}
              >
                {opt === "All" ? "All types" : opt}
              </Text>
              {active === opt && (
                <Ionicons name="checkmark" size={16} color={isDark ? "#4ade80" : "#15803d"} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function MyOrchardsScreen() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";
  const isNavigatingRef = useRef(false);

  const insets = useSafeAreaInsets();
  const [orchards, setOrchards] = useState<Orchard[]>([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  // Reload whenever screen is focused — same pattern as your home.tsx
  useFocusEffect(
    React.useCallback(() => {
      loadOrchards();
    }, [])
  );

  const loadOrchards = async () => {
    try {
      const saved = await AsyncStorage.getItem("orchards");
      if (saved) {
        const all: Orchard[] = JSON.parse(saved);
        setOrchards(all.filter((o) => o?.id && o?.name));
      }
    } catch (err) {
      console.log("Failed to load orchards:", err);
    }
  };

  // Unique orchard types for filter chips (orchardType is a single value, variety can be multi)
  const cropTypes = [
    "All",
    ...Array.from(
      new Set(orchards.map((o) => o.orchardType).filter(Boolean) as string[])
    ),
  ];

  // Filter + search (guard against incomplete orchard objects)
  const filtered = orchards.filter((o) => {
    if (!o?.id || !o?.name) return false;
    const matchesFilter = activeFilter === "All" || o.orchardType === activeFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      (o.name ?? "").toLowerCase().includes(q) ||
      (o.variety ?? "").toLowerCase().includes(q) ||
      (o.orchardType ?? "").toLowerCase().includes(q) ||
      (o.landType ?? "").toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const addNewOrchard = async () => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    await AsyncStorage.removeItem("editingOrchard");
    await AsyncStorage.removeItem("newOrchard");
    router.push("/orchard/add-step-1");
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000);
  };

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? "bg-slate-950" : "bg-lime-50"}`}
      edges={["bottom"]}
    >
      {/* ── Header ── */}
      <View
        className={`px-5 pb-5 ${
          isDark ? "bg-slate-900" : "bg-green-900"
        }`}
        style={{ paddingTop: insets.top + 12 }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.8}
          className="flex-row items-center gap-1 mb-3"
        >
          <Ionicons name="arrow-back" size={16} color="#86efac" />
          <Text className="text-sm text-green-300">Back</Text>
        </TouchableOpacity>
        <Text className="text-xs font-medium tracking-widest text-green-400 uppercase mb-1">
          My orchards
        </Text>
        <Text className="text-2xl font-bold text-lime-50">
          {filtered.length} {filtered.length === 1 ? "Orchard" : "Orchards"}
        </Text>
        <Text className="text-sm text-green-400 mt-0.5">Last updated today</Text>
      </View>

      {/* ── Search ── */}
      <View className="px-5 mt-4">
        <View
          className={`flex-row items-center gap-2 rounded-2xl px-4 py-2.5 border ${
            isDark
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-green-100"
          }`}
        >
          <Ionicons
            name="search-outline"
            size={16}
            color={isDark ? "#9ca3af" : "#4b7c3f"}
          />
          <TextInput
            className={`flex-1 text-sm ${
              isDark ? "text-white" : "text-green-950"
            }`}
            placeholder="Search orchards..."
            placeholderTextColor={isDark ? "#6b7280" : "#86a97e"}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons
                name="close-circle"
                size={16}
                color={isDark ? "#6b7280" : "#86a97e"}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Filter dropdown ── */}
      <View style={{ paddingHorizontal: 20, paddingTop: 12, zIndex: 10 }}>
        <FilterDropdown
          options={cropTypes}
          active={activeFilter}
          isDark={isDark}
          onSelect={setActiveFilter}
        />
      </View>

      {/* ── Card Grid ── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12, paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingTop: 14, paddingBottom: 120, gap: 12 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <OrchardCard
            item={item}
            isDark={isDark}
            onPress={() => router.push(`/orchard/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <View className="items-center pt-16 px-8">
            <Ionicons
              name="leaf-outline"
              size={52}
              color={isDark ? "#374151" : "#bbf7d0"}
            />
            <Text
              className={`text-lg font-bold mt-4 text-center ${
                isDark ? "text-white" : "text-green-950"
              }`}
            >
              No orchards found
            </Text>
            <Text
              className={`text-sm text-center mt-2 leading-6 ${
                isDark ? "text-gray-400" : "text-green-700"
              }`}
            >
              {search || activeFilter !== "All"
                ? "Try adjusting your search or filter."
                : "Add your first orchard to get started."}
            </Text>
          </View>
        }
      />

      {/* ── Add FAB ── */}
      <View className="absolute bottom-8 left-5 right-5">
        <TouchableOpacity
          onPress={addNewOrchard}
          activeOpacity={0.85}
          className="bg-green-700 rounded-2xl py-4 flex-row items-center justify-center gap-2"
        >
          <Ionicons name="add" size={20} color="white" />
          <Text className="text-white font-semibold text-base">
            Add new orchard
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
