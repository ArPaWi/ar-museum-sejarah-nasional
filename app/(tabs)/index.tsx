import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  Image,
  StyleSheet,
  Dimensions,
  View,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Text,
} from "react-native";
import {
  GoogleSignin,
  SignInSuccessResponse,
} from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";

const { width: screenWidth } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();

  const handleBannerPress = (markerKey: string) => {
    router.push(`/demo-ar?markerKey=${markerKey}`);
  };

  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

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
      router.replace("/login");
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
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Ionicons name="help-circle-outline" size={40} color="orange" />
          </TouchableOpacity>
        </ThemedView>
        <View style={styles.container}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>
                  Selamat datang di AR Museum Sejarah Nasional!
                </Text>
                <Text style={styles.modalText}>
                  Aplikasi ini menggunakan teknologi Augmented Reality untuk
                  menghadirkan sejarah Indonesia secara interaktif.{"\n\n"}
                  Dikembangkan oleh:{"\n"}
                  Arya Panca Wibowo{"\n"}
                  aryapancawibowo56@gmail.com
                </Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeText}>Tutup</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
        <View style={styles.bannerContainer}>
          <TouchableOpacity
            onPress={() => handleBannerPress("sumpahPemudaMarker")}
          >
            <Image
              source={require("@/assets/images/banner/sumpahPemuda.png")}
              style={styles.banner}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleBannerPress("romushaMarker")}>
            <Image
              source={require("@/assets/images/banner/romusya.png")}
              style={styles.banner}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleBannerPress("petaMarker")}>
            <Image
              source={require("@/assets/images/banner/pemberontakanPETA.png")}
              style={styles.banner}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleBannerPress("proklamasiMarker")}
          >
            <Image
              source={require("@/assets/images/banner/proklamasiKemerdekaan.png")}
              style={styles.banner}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleBannerPress("pancasilaMarker")}
          >
            <Image
              source={require("@/assets/images/banner/pengesahanPancasiladanUUD.png")}
              style={styles.banner}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleBannerPress("abriMarker")}>
            <Image
              source={require("@/assets/images/banner/hariLahirABRI.png")}
              style={styles.banner}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleBannerPress("surabayaMarker")}>
            <Image
              source={require("@/assets/images/banner/pertempuranSurabaya.png")}
              style={styles.banner}
              resizeMode="contain"
            />
          </TouchableOpacity>
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
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: { fontSize: 16, marginBottom: 10, textAlign: "center" },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#e76800",
    borderRadius: 5,
  },
  modalTitle: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  closeText: { color: "white", fontWeight: "bold" },
});
