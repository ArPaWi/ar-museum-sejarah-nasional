import { StyleSheet, Image, Platform, Dimensions } from "react-native";

import { Collapsible } from "@/components/Collapsible";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const { width: screenWidth } = Dimensions.get("window");

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/fotoProklamasi.jpg")}
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">DAFTAR SEJARAH</ThemedText>
      </ThemedView>
      <ThemedText style={styles.caption}>
        Aplikasi ini memiliki berbagai daftar peristiwa bersejarah di Indonesia.
      </ThemedText>
      <Collapsible title="Sumpah Pemuda">
        <ThemedText style={styles.caption}>
          Sumpah Pemuda adalah sebuah deklarasi yang diikrarkan oleh para pemuda
          Indonesia pada 28 Oktober 1928, yang menyatakan tekad untuk bersatu
          dalam satu tanah air, bangsa, dan bahasa. Peristiwa ini menjadi
          tonggak penting dalam perjuangan kemerdekaan Indonesia, sebagai simbol
          persatuan bangsa yang mengarah pada kemerdekaan dari penjajahan.
        </ThemedText>
        <Image
          source={require("@/assets/images/markers/sumpahPemuda.jpg")}
          style={{
            alignSelf: "center",
            width: screenWidth * 0.75,
            height: undefined,
            aspectRatio: 16 / 9,
          }}
        />
      </Collapsible>
      <Collapsible title="Romusha">
        <ThemedText style={styles.caption}>
          Romusha adalah sistem kerja paksa yang diterapkan oleh Jepang selama
          penjajahan di Indonesia antara 1942-1945. Para pekerja paksa, yang
          sebagian besar terdiri dari rakyat Indonesia, dipaksa untuk bekerja di
          proyek-proyek Jepang seperti pembangunan jalur kereta api dan benteng
          pertahanan dengan kondisi yang sangat berat dan banyak yang meninggal
          akibat kelelahan dan penyiksaan.
        </ThemedText>
        <Image
          source={require("@/assets/images/markers/romusya.jpg")}
          style={{
            alignSelf: "center",
            width: screenWidth * 0.75,
            height: undefined,
            aspectRatio: 16 / 9,
          }}
        />
      </Collapsible>
      <Collapsible title="Pemberontakan Tentara PETA">
        <ThemedText style={styles.caption}>
          Pemberontakan Tentara PETA (Pembela Tanah Air) yang terjadi pada 14
          Februari 1945 di Blitar merupakan upaya dari anggota PETA untuk
          melawan penjajahan Jepang yang semakin menindas. Pemberontakan ini
          dipimpin oleh Letnan Supriyadi, namun gagal dan berakhir dengan
          banyaknya korban, meskipun hal ini menjadi simbol perlawanan rakyat
          Indonesia terhadap penjajah.
        </ThemedText>
        <Image
          source={require("@/assets/images/markers/tentaraPETA.jpg")}
          style={{
            alignSelf: "center",
            width: screenWidth * 0.75,
            height: undefined,
            aspectRatio: 16 / 9,
          }}
        />
      </Collapsible>
      <Collapsible title="Proklamasi Kemerdekaan Indonesia">
        <ThemedText style={styles.caption}>
          Proklamasi Kemerdekaan Indonesia pada 17 Agustus 1945 merupakan momen
          bersejarah di mana Indonesia menyatakan kemerdekaannya dari penjajahan
          Jepang. Dikenal sebagai titik awal kemerdekaan Indonesia, proklamasi
          ini dibacakan oleh Soekarno dan Hatta di Jakarta, yang kemudian
          diikuti dengan pengakuan dunia atas kemerdekaan bangsa Indonesia.
        </ThemedText>
        <Image
          source={require("@/assets/images/markers/proklamasi.jpg")}
          style={{
            alignSelf: "center",
            width: screenWidth * 0.75,
            height: undefined,
            aspectRatio: 16 / 9,
          }}
        />
      </Collapsible>
      <Collapsible title="Pengesahan Pancasila dan UUD 1945">
        <ThemedText style={styles.caption}>
          Pengesahan Pancasila sebagai dasar negara dan UUD 1945 pada 18 Agustus
          1945 menandai langkah penting dalam pembentukan negara Indonesia
          setelah kemerdekaan. Pada tanggal tersebut, telah disahkan Pancasila
          sebagai dasar negara dan Undang-Undang Dasar 1945 sebagai konstitusi
          negara yang berlaku, yang menjadi landasan bagi kehidupan berbangsa
          dan bernegara di Indonesia.
        </ThemedText>
        <Image
          source={require("@/assets/images/markers/pengesahanPancasila.jpg")}
          style={{
            alignSelf: "center",
            width: screenWidth * 0.75,
            height: undefined,
            aspectRatio: 16 / 9,
          }}
        />
      </Collapsible>
      <Collapsible title="Hari Lahir ABRI">
        <ThemedText style={styles.caption}>
          Hari Lahir ABRI (Angkatan Bersenjata Republik Indonesia) diperingati
          pada 5 Oktober 1945, yang merupakan pembentukan tentara nasional
          Indonesia setelah kemerdekaan. Pada tanggal ini, pemerintah Indonesia
          menggabungkan berbagai kelompok militer yang ada, seperti Badan
          Keamanan Rakyat (BKR) dan pasukan lainnya, menjadi angkatan bersenjata
          yang terorganisir di bawah komando negara.
        </ThemedText>
        <Image
          source={require("@/assets/images/markers/ABRI.jpg")}
          style={{
            alignSelf: "center",
            width: screenWidth * 0.75,
            height: undefined,
            aspectRatio: 16 / 9,
          }}
        />
      </Collapsible>
      <Collapsible title="Pertempuran Surabaya">
        <ThemedText style={styles.caption}>
          Pertempuran Surabaya pada 10 November 1945 adalah salah satu
          pertempuran terbesar dalam sejarah perjuangan kemerdekaan Indonesia
          setelah proklamasi kemerdekaan. Peristiwa ini terjadi ketika pasukan
          Sekutu yang didukung oleh Inggris berusaha merebut Surabaya dari
          tangan pejuang kemerdekaan Indonesia, yang akhirnya mengakibatkan
          jatuhnya banyak korban jiwa di kedua belah pihak dan menjadikan 10
          November sebagai Hari Pahlawan di Indonesia.
        </ThemedText>
        <Image
          source={require("@/assets/images/markers/pertempuranSurabaya.jpg")}
          style={{
            alignSelf: "center",
            width: screenWidth * 0.75,
            height: undefined,
            aspectRatio: 16 / 9,
          }}
        />
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    height: "100%",
    width: "100%",
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  caption: {
    textAlign: "justify",
  },
});
