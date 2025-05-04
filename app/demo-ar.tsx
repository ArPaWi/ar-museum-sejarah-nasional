import React, { useState, useEffect, useCallback } from "react";
import { router, useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroVideo,
} from "@reactvision/react-viro";
import firestore from "@react-native-firebase/firestore";
import { Audio } from "expo-av";
import correctSound from "@/assets/audio/correct.mp3";
import wrongSound from "@/assets/audio/wrong.mp3";
import { useFocusEffect } from "@react-navigation/native";

const DemoARScene = ({
  markerKey,
  onQuizTrigger,
}: {
  markerKey: string;
  onQuizTrigger: (quizData: any) => void;
}) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await firestore()
          .collection("histories")
          .where("marker", "==", markerKey)
          .get();

        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();

          if (data.videoId) {
            const videoDoc = await data.videoId.get();
            if (videoDoc.exists) {
              const videoData = videoDoc.data();
              setVideoUrl(videoData.url);
            }
          }

          if (data.quizId) {
            const quizDoc = await data.quizId.get();
            if (quizDoc.exists) {
              const quizData = quizDoc.data();
              setQuiz(quizData.quiz);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [markerKey]);

  const handleVideoEnd = () => {
    if (quiz.length > 0) {
      const randomQuiz = quiz[Math.floor(Math.random() * quiz.length)];
      onQuizTrigger(randomQuiz);
    }
  };

  return (
    <ViroARScene>
      {videoUrl && (
        <ViroVideo
          source={{ uri: videoUrl }}
          loop={false}
          position={[0, 0, -0.35]}
          rotation={[-1, 0, 0]}
          scale={[0.2, 0.09, 0]}
          onFinish={handleVideoEnd}
        />
      )}
    </ViroARScene>
  );
};

const DemoARPage = () => {
  const { markerKey } = useLocalSearchParams<{ markerKey: string }>();
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
    router.push("/");
  };
  const arKey = `ar-scene-${markerKey}`;

  useFocusEffect(
    useCallback(() => {
      return () => {};
    }, [])
  );

  return (
    <>
      {markerKey && (
        <ViroARSceneNavigator
          key={arKey}
          initialScene={{
            scene: () => (
              <DemoARScene
                markerKey={markerKey}
                onQuizTrigger={handleQuizTrigger}
              />
            ),
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

export default DemoARPage;
