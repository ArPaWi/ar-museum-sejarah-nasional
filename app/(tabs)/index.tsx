import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Dimensions,
  View,
  ActivityIndicator,
} from "react-native";
import {
  GoogleSignin,
  SignInSuccessResponse,
} from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const { width: screenWidth } = Dimensions.get("window");

export default function HomeScreen() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "38421602592-cafkdnuah5tnokb5lnoe7b5rlv61pq1d.apps.googleusercontent.com",
    });

    const checkUserAuth = async () => {
      try {
        const currentUser = await auth().currentUser;

        if (currentUser) {
          setUser(currentUser);
        } else {
          await signInWithGoogle();
        }
      } catch (error) {
        console.error("Gagal memeriksa autentikasi:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUserAuth();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const signInResult = await GoogleSignin.signIn();

      // Akses idToken dari signInResult.data
      const idToken = signInResult?.data?.idToken;

      if (!idToken) {
        throw new Error("idToken tidak ditemukan");
      }

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      await auth().signInWithCredential(googleCredential);

      setUser(auth().currentUser);
    } catch (error) {
      console.error("Gagal login dengan Google:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/monas.jpg")}
          style={styles.monas}
        />
      }
    >
      <ThemedView>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Selamat Datang!</ThemedText>
          <HelloWave />
        </ThemedView>
        <View style={styles.bannerContainer}>
          <Image
            source={require("@/assets/images/banner/sumpahPemuda.png")}
            style={styles.banner}
            resizeMode="contain"
          />
          <Image
            source={require("@/assets/images/banner/romusya.png")}
            style={styles.banner}
            resizeMode="contain"
          />
          <Image
            source={require("@/assets/images/banner/pemberontakanPETA.png")}
            style={styles.banner}
            resizeMode="contain"
          />
          <Image
            source={require("@/assets/images/banner/proklamasiKemerdekaan.png")}
            style={styles.banner}
            resizeMode="contain"
          />
          <Image
            source={require("@/assets/images/banner/pengesahanPancasiladanUUD.png")}
            style={styles.banner}
            resizeMode="contain"
          />
          <Image
            source={require("@/assets/images/banner/hariLahirABRI.png")}
            style={styles.banner}
            resizeMode="contain"
          />
          <Image
            source={require("@/assets/images/banner/pertempuranSurabaya.png")}
            style={styles.banner}
            resizeMode="contain"
          />
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  monas: {
    height: "100%",
    width: "100%",
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  bannerContainer: {
    alignItems: "center",
    gap: 7,
    marginTop: 7,
  },
  banner: {
    width: screenWidth * 0.9,
    height: undefined,
    aspectRatio: 4 / 1.5,
  },
});
