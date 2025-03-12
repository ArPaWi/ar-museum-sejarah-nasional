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
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

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

const ARScene = ({
  onQuizTrigger,
}: {
  onQuizTrigger: (quizData: any) => void;
}) => {
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
  const [quiz, setQuiz] = useState<{ [key: string]: any[] }>({});

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

    // Cek apakah ada kuis untuk marker tersebut
    const quizList = quiz[markerName];
    if (quizList && quizList.length > 0) {
      const randomQuiz = quizList[Math.floor(Math.random() * quizList.length)];
      onQuizTrigger(randomQuiz); // Kirim event ke ARScreen
    }
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

export default function ARScreen() {
  const isFocused = useIsFocused();
  const [showAR, setShowAR] = useState(true);

  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleQuizTrigger = (quizData: any) => {
    setCurrentQuiz(quizData);
    setShowQuizModal(true);
    setSelectedAnswer(null);
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const closeQuizModal = () => {
    setShowQuizModal(false);
    setSelectedAnswer(null);
  };

  useEffect(() => {
    setShowAR(isFocused);
  }, [isFocused]);

  return (
    <>
      {showAR && (
        <ViroARSceneNavigator
          initialScene={{
            scene: () => <ARScene onQuizTrigger={handleQuizTrigger} />,
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
