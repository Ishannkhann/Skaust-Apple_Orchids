import { View, Text, Image, Pressable, Modal, TextInput } from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

export default function ProfileScreen() {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState(
    "This is a sample profile description."
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [tempDescription, setTempDescription] = useState(description);

  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Permission required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const saveDescription = () => {
    setDescription(tempDescription);
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f3f4f6", padding: 20 }}>

      {/* PROFILE CARD */}
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 20,
          padding: 20,
          alignItems: "center",
          marginBottom: 15,
        }}
      >
        <Image
          source={
            image
              ? { uri: image }
              : { uri: "https://via.placeholder.com/120" }
          }
          style={{
            width: 110,
            height: 110,
            borderRadius: 55,
            marginBottom: 10,
            backgroundColor: "#3b82f6",
          }}
        />

        <Pressable
          onPress={pickImage}
          style={{
            backgroundColor: "#3b82f6",
            paddingHorizontal: 20,
            paddingVertical: 8,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>
            Update Image
          </Text>
        </Pressable>
      </View>

      {/* STATUS CARD */}
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 20,
          padding: 15,
          marginBottom: 15,
        }}
      >
        <Text style={{ fontWeight: "600", marginBottom: 10 }}>
          Your Profile Status
        </Text>

        <View
          style={{
            height: 10,
            backgroundColor: "#e5e7eb",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: "60%",
              height: "100%",
              backgroundColor: "#22c55e",
            }}
          />
        </View>

        <Text style={{ color: "#16a34a", marginTop: 8 }}>60%</Text>
      </View>

      {/* INFO CARD */}
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 20,
          padding: 15,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          John Doe
        </Text>

        <Text style={{ color: "#6b7280", marginBottom: 10 }}>
          john@example.com
        </Text>

        <Text style={{ marginBottom: 10 }}>{description}</Text>

        <Pressable
          onPress={() => {
            setTempDescription(description);
            setModalVisible(true);
          }}
          style={{
            backgroundColor: "#3b82f6",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            alignSelf: "flex-start",
          }}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>
            Update Description
          </Text>
        </Pressable>
      </View>

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 20,
              padding: 20,
            }}
          >
            <Text style={{ fontWeight: "600", marginBottom: 10 }}>
              Edit Description
            </Text>

            <TextInput
              value={tempDescription}
              onChangeText={setTempDescription}
              multiline
              style={{
                borderWidth: 1,
                borderColor: "#e5e7eb",
                borderRadius: 10,
                padding: 10,
                height: 100,
                marginBottom: 15,
                textAlignVertical: "top",
              }}
            />

            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={{ marginRight: 10 }}
              >
                <Text style={{ color: "#6b7280" }}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={saveDescription}
                style={{
                  backgroundColor: "#3b82f6",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 10,
                }}
              >
                <Text style={{ color: "white", fontWeight: "600" }}>
                  Save
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}
