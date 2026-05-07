import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function Login() {
  const router = useRouter();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [phone, setPhone] = useState<string>("");
  const [step, setStep] = useState<"phone" | "otp">("phone");

  const [otp, setOtp] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const inputs = useRef<(TextInput | null)[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [timer, setTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);

  // ⏱ OTP Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (step === "otp" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [timer, step]);

  // 🔙 Back to Welcome Screen
  const goBack = () => {
    router.replace("/");
  };

  // 📲 SEND OTP
  const sendOtp = async () => {
    if (phone.length !== 10) {
      setError("Enter valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Sending OTP to +91" + phone);

      setTimeout(() => {
        setStep("otp");
        setLoading(false);

        setTimer(60);
        setCanResend(false);
      }, 1000);

    } catch (err) {
      setError("Failed to send OTP");
      setLoading(false);
    }
  };

  // 🔐 VERIFY OTP
  const verifyOtp = async () => {
    const code = otp.join("");

    if (code.length !== 6) {
      setError("Enter 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Verifying OTP:", code);

      setTimeout(async () => {

        // ✅ Save session
        await AsyncStorage.setItem(
          "isLoggedIn",
          "true"
        );

        await AsyncStorage.setItem(
          "userPhone",
          phone
        );

        setLoading(false);

        // ✅ Go Home
        router.replace("/home");

      }, 1200);

    } catch (err) {
      setError("Invalid OTP");
      setLoading(false);
    }
  };

  // 🔁 RESEND OTP
  const resendOtp = () => {
    if (!canResend) return;

    setTimer(60);
    setCanResend(false);

    sendOtp();
  };

  // 🔢 OTP INPUT
  const handleOtpChange = (
    value: string,
    index: number
  ) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    // Auto move next
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  return (
    <SafeAreaView
      className={`flex-1 ${
        isDark ? "bg-black" : "bg-[#F8FAFC]"
      }`}
    >

      {/* BACK BUTTON */}
      <View className="px-6 pt-2">
        <TouchableOpacity
          onPress={goBack}
          activeOpacity={0.7}
          className={`w-11 h-11 rounded-full items-center justify-center ${
            isDark
              ? "bg-[#111827]"
              : "bg-white"
          }`}
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 8,
            shadowOffset: {
              width: 0,
              height: 3,
            },
            elevation: 3,
          }}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={isDark ? "#fff" : "#111827"}
          />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={
          Platform.OS === "ios" ? "padding" : undefined
        }
        className="flex-1 justify-center px-6"
      >

        {/* HEADER */}
        <View className="mb-14">

          <Text
            className={`text-4xl font-bold text-center mb-3 ${
              isDark
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            Welcome Back
          </Text>

          <Text
            className={`text-center text-base leading-6 ${
              isDark
                ? "text-gray-400"
                : "text-gray-500"
            }`}
          >
            Login with your mobile number
          </Text>

        </View>

        {/* ERROR */}
        {error ? (
          <Text className="text-red-500 text-center mb-5">
            {error}
          </Text>
        ) : null}

        {/* PHONE STEP */}
        {step === "phone" && (
          <>
            {/* PHONE INPUT */}
            <View
              className={`flex-row items-center rounded-2xl border px-5 h-[68px] mb-8 ${
                isDark
                  ? "bg-[#111827] border-gray-800"
                  : "bg-white border-gray-200"
              }`}
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.06,
                shadowRadius: 10,
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                elevation: 3,
              }}
            >

              {/* COUNTRY CODE */}
              <View className="justify-center items-center pr-4">
                <Text
                  className={`text-base font-semibold ${
                    isDark
                      ? "text-white"
                      : "text-gray-900"
                  }`}
                >
                  +91
                </Text>
              </View>

              {/* DIVIDER */}
              <View
                className={`w-[1px] h-7 mr-4 ${
                  isDark
                    ? "bg-gray-700"
                    : "bg-gray-300"
                }`}
              />

              {/* INPUT */}
              <TextInput
                placeholder="Enter mobile number"
                placeholderTextColor={
                  isDark ? "#6B7280" : "#9CA3AF"
                }
                keyboardType="number-pad"
                maxLength={10}
                value={phone}
                onChangeText={setPhone}
                className={`flex-1 text-[17px] font-medium ${
                  isDark
                    ? "text-white"
                    : "text-gray-900"
                }`}
                style={{
                  paddingVertical: 0,
                  textAlignVertical: "center",
                }}
              />

            </View>

            {/* SEND OTP BUTTON */}
            <TouchableOpacity
              onPress={sendOtp}
              className="bg-blue-600 h-[60px] rounded-2xl items-center justify-center"
              activeOpacity={0.85}
              style={{
                shadowColor: "#2563EB",
                shadowOpacity: 0.25,
                shadowRadius: 10,
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                elevation: 4,
              }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-semibold text-base">
                  Send OTP
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {/* OTP STEP */}
        {step === "otp" && (
          <>
            <Text
              className={`text-center mb-8 text-base ${
                isDark
                  ? "text-gray-400"
                  : "text-gray-600"
              }`}
            >
              Enter OTP sent to +91 {phone}
            </Text>

            {/* OTP BOXES */}
            <View className="flex-row justify-between mb-8">

              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputs.current[index] = ref;
                  }}
                  value={digit}
                  onChangeText={(value) =>
                    handleOtpChange(value, index)
                  }
                  keyboardType="number-pad"
                  maxLength={1}
                  placeholder="•"
                  placeholderTextColor={
                    isDark ? "#6B7280" : "#9CA3AF"
                  }
                  className={`w-12 h-14 rounded-2xl border text-center text-xl font-bold ${
                    isDark
                      ? "bg-[#111827] border-gray-700 text-white"
                      : "bg-white border-gray-200 text-black"
                  }`}
                />
              ))}

            </View>

            {/* VERIFY BUTTON */}
            <TouchableOpacity
              onPress={verifyOtp}
              className="bg-blue-600 h-[60px] rounded-2xl items-center justify-center"
              activeOpacity={0.85}
              style={{
                shadowColor: "#2563EB",
                shadowOpacity: 0.25,
                shadowRadius: 10,
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                elevation: 4,
              }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-semibold text-base">
                  Verify OTP
                </Text>
              )}
            </TouchableOpacity>

            {/* RESEND OTP */}
            <View className="items-center mt-6">

              <TouchableOpacity
                onPress={resendOtp}
                disabled={!canResend}
              >
                <Text
                  className={`font-medium text-base ${
                    canResend
                      ? "text-blue-600"
                      : "text-gray-400"
                  }`}
                >
                  {canResend
                    ? "Resend OTP"
                    : `Resend in ${timer}s`}
                </Text>
              </TouchableOpacity>

            </View>
          </>
        )}

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
