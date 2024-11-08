import React, { useState, useEffect } from "react";
import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroVideo,
  ViroARImageMarker,
  ViroARTrackingTargets,
} from "@reactvision/react-viro";
import { useIsFocused } from "@react-navigation/native";

ViroARTrackingTargets.createTargets({
  proklamasiMarker: {
    source: require("@/assets/images/markers/proklamasi.jpg"), // Gambar marker
    orientation: "Up",
    physicalWidth: 0.2, // Lebar fisik marker dalam meter
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
          <ViroVideo
            source={require("@/assets/videos/Proklamasi.mp4")}
            loop={false}
            position={[0, 0, 0]}
            rotation={[-85, 0, 0]}
            scale={[0.3, 0.2, 0]}
          />
        )}
      </ViroARImageMarker>
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
    <>
      {showAR && (
        <ViroARSceneNavigator initialScene={{ scene: HelloWorldARScene }} />
      )}
    </>
  );
}
