import React, { useState, useEffect } from "react";
import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroVideo,
  ViroARImageMarker,
  ViroARTrackingTargets,
} from "@reactvision/react-viro";
import { useIsFocused } from "@react-navigation/native";
import firestore, { Timestamp } from "@react-native-firebase/firestore";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { View } from "react-native-reanimated/lib/typescript/Animated";

type Histories = {
  name: string;
  marker: string;
  quizId: FirebaseFirestoreTypes.DocumentReference | null;
  videoId: FirebaseFirestoreTypes.DocumentReference | null;
};

ViroARTrackingTargets.createTargets({
  petaMarker: {
    source: require("@/assets/images/markers/tentaraPETA.jpg"),
    orientation: "Up",
    physicalWidth: 0.2,
  },
  proklamasiMarker: {
    source: require("@/assets/images/markers/proklamasi.jpg"),
    orientation: "Up",
    physicalWidth: 0.2,
  },
  pancasilaMarker: {
    source: require("@/assets/images/markers/pengesahanPancasila.jpg"),
    orientation: "Up",
    physicalWidth: 0.2,
  },
  abriMarker: {
    source: require("@/assets/images/markers/ABRI.jpg"),
    orientation: "Up",
    physicalWidth: 0.2,
  },
  surabayaMarker: {
    source: require("@/assets/images/markers/pertempuranSurabaya.jpg"),
    orientation: "Up",
    physicalWidth: 0.2,
  },
  romushaMarker: {
    source: require("@/assets/images/markers/romusya.jpg"),
    orientation: "Up",
    physicalWidth: 0.2,
  },
  sumpahPemudaMarker: {
    source: require("@/assets/images/markers/sumpahPemuda.jpg"),
    orientation: "Up",
    physicalWidth: 0.2,
  },
});

const ARScene = () => {
  const [videoVisible, setVideoVisible] = useState<{ [key: string]: boolean }>({
    petaMarker: false,
    proklamasiMarker: false,
    pancasilaMarker: false,
    abriMarker: false,
    surabayaMarker: false,
    romushaMarker: false,
    sumpahPemudaMarker: false,
  });

  const [videoUrls, setVideoUrls] = useState<{ [key: string]: string | null }>(
    {}
  );

  const [quiz, setQuiz] = useState<{ [key: string]: string | null }>({});

  const handleAnchorFound = async (markerName: string) => {
    const startTime = performance.now();
    setVideoVisible((prev) => ({ ...prev, [markerName]: true }));

    try {
      const historiesRef = firestore().collection("histories");
      const querySnapshot = await historiesRef
        .where("marker", "==", markerName)
        .get();

      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (doc) => {
          const data = doc.data();
          console.log("Sejarah: ", data.name);
          console.log("Marker: ", data.marker);

          if (data.videoId) {
            const videoDoc = await data.videoId.get();
            if (videoDoc.exists) {
              const videoData = videoDoc.data();
              console.log("URL Video:", videoData);

              setVideoUrls((prev) => ({
                ...prev,
                [markerName]: videoData.url,
              }));
            } else {
              console.log("Video document not found for marker:", markerName);
            }
          }

          if (data.quizId) {
            const quizDoc = await data.quizId.get();
            if (quizDoc.exists) {
              const quizData = quizDoc.data();
              console.log("Quiz:", quizData);

              setQuiz((prev) => ({
                ...prev,
                [markerName]: quizData.quiz,
              }));
            } else {
              console.log("Quiz document not found for marker:", markerName);
            }
          }
        });
        const endTime = performance.now(); // Catat waktu aplikasi mengenali marker
        console.log(
          `Marker "${markerName}" dikenali dalam ${(
            endTime - startTime
          ).toFixed(2)} ms`
        );
      } else {
        console.log("Tidak ada data history untuk marker:", markerName);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const handleAnchorRemoved = (markerName: string) => {
    setVideoVisible((prev) => ({ ...prev, [markerName]: false }));
  };

  return (
    <ViroARScene>
      {Object.keys(videoVisible).map((markerName) => (
        <ViroARImageMarker
          key={markerName}
          target={markerName}
          onAnchorFound={() => handleAnchorFound(markerName)}
          onAnchorRemoved={() => handleAnchorRemoved(markerName)}
        >
          {videoVisible[markerName] && videoUrls[markerName] && (
            <ViroVideo
              source={{ uri: videoUrls[markerName] }}
              loop={false}
              position={[0, 0, 0]}
              rotation={[-85, 0, 0]}
              scale={[0.2, 0.09, 0]}
              onFinish={() => handleAnchorRemoved(markerName)}
            />
          )}
        </ViroARImageMarker>
      ))}
    </ViroARScene>
  );
};

export default function ARScreen() {
  const isFocused = useIsFocused();
  const [showAR, setShowAR] = useState(true);

  useEffect(() => {
    setShowAR(isFocused);
  }, [isFocused]);

  return (
    <>{showAR && <ViroARSceneNavigator initialScene={{ scene: ARScene }} />}</>
  );
}
