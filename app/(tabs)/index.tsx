import { Image, StyleSheet, Dimensions, View } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const { width: screenWidth } = Dimensions.get("window");

export default function HomeScreen() {
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
