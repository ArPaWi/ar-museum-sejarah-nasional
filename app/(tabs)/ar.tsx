import React, { useState, useEffect } from "react";
import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroVideo,
  ViroARImageMarker,
  ViroARTrackingTargets,
} from "@reactvision/react-viro";
import firestore from "@react-native-firebase/firestore";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import correctSound from "@/assets/audio/correct.mp3";
import wrongSound from "@/assets/audio/wrong.mp3";

export const unstable_settings = {
  unmountOnBlur: true,
};

/**
 * Type for historical data structure
 */
type Histories = {
  name: string;
  marker: string;
  quizId: FirebaseFirestoreTypes.DocumentReference | null;
  videoId: FirebaseFirestoreTypes.DocumentReference | null;
};

/**
 * Define AR image tracking targets with corresponding markers
 */
const markerList = [
  "petaMarker",
  "proklamasiMarker",
  "pancasilaMarker",
  "abriMarker",
  "surabayaMarker",
  "romushaMarker",
  "sumpahPemudaMarker",
];

const markerImages: { [key: string]: any } = {
  petaMarker: require("@/assets/images/markers/tentaraPETA.jpg"),
  proklamasiMarker: require("@/assets/images/markers/proklamasi.jpg"),
  pancasilaMarker: require("@/assets/images/markers/pengesahanPancasila.jpg"),
  abriMarker: require("@/assets/images/markers/ABRI.jpg"),
  surabayaMarker: require("@/assets/images/markers/pertempuranSurabaya.jpg"),
  romushaMarker: require("@/assets/images/markers/romusya.jpg"),
  sumpahPemudaMarker: require("@/assets/images/markers/sumpahPemuda.jpg"),
};

markerList.forEach((marker) => {
  ViroARTrackingTargets.createTargets({
    [marker]: {
      source: markerImages[marker],
      orientation: "Up",
      physicalWidth: 0.2,
    },
  });
});

/**
 * Component that renders the AR scene and handles marker events
 */
const ARScene = ({
  onQuizTrigger,
}: {
  onQuizTrigger: (quizData: any) => void;
}) => {
  const [videoVisible, setVideoVisible] = useState<{ [key: string]: boolean }>(
    Object.fromEntries(markerList.map((m) => [m, false]))
  );

  const [videoUrls, setVideoUrls] = useState<{ [key: string]: string | null }>(
    {}
  );
  const [quiz, setQuiz] = useState<{ [key: string]: any[] }>({});

  /**
   * Event handler for when a marker is detected
   */
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

          if (data.videoId) {
            const videoDoc = await data.videoId.get();
            if (videoDoc.exists) {
              const videoData = videoDoc.data();
              setVideoUrls((prev) => ({
                ...prev,
                [markerName]: videoData.url,
              }));
            }
          }

          if (data.quizId) {
            const quizDoc = await data.quizId.get();
            if (quizDoc.exists) {
              const quizData = quizDoc.data();
              setQuiz((prev) => ({ ...prev, [markerName]: quizData.quiz }));
            }
          }
        });

        const endTime = performance.now();
        console.log(
          `Marker "${markerName}" dikenali dalam ${(
            endTime - startTime
          ).toFixed(2)} ms`
        );
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  /**
   * Event handler for when a marker is removed
   */
  const handleAnchorRemoved = (markerName: string) => {
    setVideoVisible((prev) => ({ ...prev, [markerName]: false }));
    setVideoUrls((prev) => ({ ...prev, [markerName]: null }));
    const quizList = quiz[markerName];
    if (quizList && quizList.length > 0) {
      const randomQuiz = quizList[Math.floor(Math.random() * quizList.length)];
      onQuizTrigger(randomQuiz);
    }
  };

  return (
    <ViroARScene>
      {markerList.map((markerName) => (
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

/**
 * Styles for modal and quiz interface
 */
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  questionText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  optionButton: {
    width: "100%",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#e76800",
    borderRadius: 5,
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    textAlign: "center",
  },
  feedbackText: {
    marginTop: 20,
    fontSize: 16,
    color: "green",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#e76800",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});

/**
 * Main screen component that manages AR and quiz display
 */
export default function ARScreen() {
  const [showAR, setShowAR] = useState(true);
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const playSound = async (soundFile: any) => {
    const { sound } = await Audio.Sound.createAsync(soundFile);
    await sound.playAsync();
  };

  const handleQuizTrigger = (quizData: any) => {
    setCurrentQuiz(quizData);
    setShowQuizModal(true);
    setSelectedAnswer(null);
  };

  const handleAnswer = async (answer: string) => {
    setSelectedAnswer(answer);
    if (answer === currentQuiz?.answer) {
      await playSound(correctSound);
    } else {
      await playSound(wrongSound);
    }
  };

  const closeQuizModal = () => {
    setShowQuizModal(false);
    setSelectedAnswer(null);
  };

  return (
    <>
      {showAR && (
        <ViroARSceneNavigator
          key={showAR ? "AR_ON" : "AR_OFF"}
          initialScene={{
            scene: () => <ARScene onQuizTrigger={handleQuizTrigger} />,
          }}
          viroAppProps={{
            isActive: showAR,
          }}
        />
      )}

      <Modal visible={showQuizModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.questionText}>{currentQuiz?.question}</Text>
            {currentQuiz?.options.map((option: string, index: number) => {
              let backgroundColor = "#ffffff";
              if (selectedAnswer) {
                if (option === currentQuiz.answer) {
                  backgroundColor = "#4CAF50";
                } else if (option === selectedAnswer) {
                  backgroundColor = "#F44336";
                }
              }
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.optionButton, { backgroundColor }]}
                  onPress={() => handleAnswer(option)}
                  disabled={!!selectedAnswer}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeQuizModal}
            >
              <Text style={styles.closeButtonText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
