import React, { useState, useEffect } from "react";
import {
  ViroARScene,
  ViroVideo,
  ViroARSceneNavigator,
} from "@reactvision/react-viro";
import { useIsFocused } from "@react-navigation/native";

const HelloWorldARScene = () => {
  return (
    <ViroARScene>
      <ViroVideo
        source={require("@/assets/videos/Proklamasi.mp4")}
        loop={true}
        position={[0, 0, -4]}
        scale={[3, 2, 0]}
      />
    </ViroARScene>
  );
};

export default function ARScreen() {
  const isFocused = useIsFocused(); // Mendapatkan status apakah tab aktif
  const [showAR, setShowAR] = useState(true); // State untuk menampilkan ARScene

  // Mengontrol ARScene saat tab aktif/non-aktif
  useEffect(() => {
    if (!isFocused) {
      setShowAR(false);
    } else {
      setShowAR(true);
    }
  }, [isFocused]);

  return (
    <>
      {showAR && (
        <ViroARSceneNavigator initialScene={{ scene: HelloWorldARScene }} />
      )}
    </>
  );
}
