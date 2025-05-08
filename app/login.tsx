import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Ionicons } from "@expo/vector-icons";

const { width: screenWidth } = Dimensions.get("window");

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "38421602592-cafkdnuah5tnokb5lnoe7b5rlv61pq1d.apps.googleusercontent.com",
    });
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const { idToken } = await GoogleSignin.getTokens();

      const credential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(credential);

      router.replace("/");
    } catch (err) {
      console.error("Login gagal:", err);
      Alert.alert("Gagal login", "Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/appLogo.png")}
        style={styles.logo}
      />
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={handleLogin}
        disabled={loading}
      >
        <View style={styles.button}>
          <Ionicons name="logo-google" size={25} color="white" />
          <Text style={styles.buttonText}>Sign in with Google</Text>
        </View>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color="#000" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 20,
  },
  logo: {
    width: screenWidth * 0.25,
    height: undefined,
    aspectRatio: 1 / 1,
  },
  buttonContainer: {
    backgroundColor: "#e76800",
    padding: 15,
    borderRadius: 8,
  },
  button: {
    flexDirection: "row",
    gap: 10,
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 17 },
});
