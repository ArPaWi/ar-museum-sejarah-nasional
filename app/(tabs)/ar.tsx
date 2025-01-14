import React, { useState, useEffect } from "react";
import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroVideo,
  ViroARImageMarker,
  ViroARTrackingTargets,
} from "@reactvision/react-viro";
import { useIsFocused } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { View } from "react-native-reanimated/lib/typescript/Animated";

type Histories = {
  id: number;
  name: string;
  desc: string;
  quizId: FirebaseFirestoreTypes.DocumentReference | null;
  videoId: FirebaseFirestoreTypes.DocumentReference | null;
};

ViroARTrackingTargets.createTargets({
  proklamasiMarker: {
    source: require("@/assets/images/markers/proklamasi.jpg"),
    orientation: "Up",
    physicalWidth: 0.2,
  },
});

const HelloWorldARScene = () => {
  const [videoVisible, setVideoVisible] = useState(false);

  return (
    <ViroARScene>
      <ViroARImageMarker
        target="proklamasiMarker"
        onAnchorFound={() => setVideoVisible(true)}
        onAnchorRemoved={() => setVideoVisible(false)}
      >
        {videoVisible && (
          <>
            <ViroVideo
              source={{
                uri: "https://drive.google.com/uc?export=download&id=1vMd-Lg97GnRyH4-T6T4C5DZ7IJloyxme",
              }}
              loop={false}
              position={[0, 0, 0]}
              rotation={[-85, 0, 0]}
              scale={[0.3, 0.2, 0]}
            />
          </>
        )}
      </ViroARImageMarker>
    </ViroARScene>
  );
};

export default function ARScreen() {
  const isFocused = useIsFocused();
  const [showAR, setShowAR] = useState(true);
  const [histories, setHistories] = useState<Histories[]>([]);

  // Fungsi untuk mengambil data dari Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await firestore().collection("histories").get();
        const historyList = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const data = doc.data();

            // Ambil data dari videoId (referensi dokumen)
            let videoData = null;
            if (data.videoId?.get) {
              const videoDoc = await data.videoId.get();
              videoData = videoDoc.exists ? videoDoc.data() : null;
            }

            // Ambil data dari quizId (referensi dokumen)
            let quizData = null;
            if (data.quizId && typeof data.quizId.get === "function") {
              const quizDoc = await data.quizId.get();
              quizData = quizDoc.exists ? quizDoc.data() : null;
            } else {
              console.warn(
                `Quiz reference is not valid for history ID: ${data.id}`
              );
            }

            return {
              id: data.id,
              name: data.name,
              desc: data.desc,
              quiz: quizData, // Data dari referensi quizId
              video: videoData, // Data dari referensi videoId
            } as Histories & { quiz: any; video: any };
          })
        );

        console.log("History List:", JSON.stringify(historyList, null, 2)); // Tampilkan data ke console
        setHistories(historyList); // Set state dengan data yang diambil
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setShowAR(isFocused);
  }, [isFocused]);

  return (
    <>
      {showAR && (
        <ViroARSceneNavigator initialScene={{ scene: HelloWorldARScene }} />
      )}
    </>
  );
}
