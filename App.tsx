import { useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
  Text,
} from "react-native";
import { colors, data } from "./data";

const { width, height } = Dimensions.get("window");

type Props = {
  onPress: () => void;
  animatedValue: Animated.Value;
  animatedValue2: Animated.Value;
  index: number;
};

const Circle = ({ onPress, animatedValue, animatedValue2, index }: Props) => {
  const { initialBgColor, bgColor, nextBgColor } = colors[index];

  const containerBg = animatedValue2.interpolate({
    inputRange: [0, 0.001, 0.5, 0.501, 1],
    outputRange: [
      initialBgColor,
      initialBgColor,
      initialBgColor,
      bgColor,
      bgColor,
    ],
  });

  const circleBg = animatedValue2.interpolate({
    inputRange: [0, 0.001, 0.5, 0.501, 0.9, 1],
    outputRange: [
      bgColor,
      bgColor,
      bgColor,
      initialBgColor,
      initialBgColor,
      nextBgColor,
    ],
  });

  return (
    <Animated.View
      style={[
        styles.circleContainer,
        StyleSheet.absoluteFillObject,
        { backgroundColor: containerBg },
      ]}
    >
      <Animated.View
        style={[
          styles.circle,
          {
            backgroundColor: circleBg,
            transform: [
              {
                perspective: 800,
              },
              {
                rotateY: animatedValue2.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: ["0deg", "-90deg", "-180deg"],
                }),
              },
              {
                scale: animatedValue2.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 10, 1],
                }),
              },
              {
                translateX: animatedValue2.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [
                    parseInt("0%"),
                    parseInt("50%"),
                    parseInt("0%"),
                  ],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity onPress={onPress}>
          <Animated.View
            style={[
              styles.circle,
              styles.circleButton,
              {
                transform: [
                  {
                    scale: animatedValue.interpolate({
                      inputRange: [0, 0.05, 0.5, 1],
                      outputRange: [1, 0, 0, 1],
                    }),
                  },
                  {
                    rotateY: animatedValue.interpolate({
                      inputRange: [0, 0.05, 0.9, 1],
                      outputRange: ["0deg", "180deg", "180deg", "180deg"],
                    }),
                  },
                ],
                opacity: animatedValue.interpolate({
                  inputRange: [0, 0.05, 0.9, 1],
                  outputRange: [1, 0, 0, 1],
                }),
              },
            ]}
          >
            <MaterialIcons name="arrow-forward-ios" size={16} color="#fff" />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

export default function App() {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const animatedValue2 = useRef(new Animated.Value(0)).current;
  const sliderAnimatedValue = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);

  const animation = (toValue: number) =>
    Animated.parallel([
      Animated.timing(sliderAnimatedValue, {
        toValue: toValue,
        duration: 2500,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue2, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: false,
      }),
    ]);

  const onPress = () => {
    animatedValue.setValue(0);
    animatedValue2.setValue(0);
    animation((index + 1) % colors.length).start();
    setIndex((index + 1) % colors.length);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Circle
        onPress={onPress}
        animatedValue={animatedValue}
        animatedValue2={animatedValue2}
        index={index}
      />
      <View>
        <Animated.View
          style={{
            flexDirection: "row",
            transform: [
              {
                translateX: sliderAnimatedValue.interpolate({
                  inputRange: [...Array(data.length).keys()],
                  outputRange:
                    index === 0
                      ? data.map((_, i) => +i * width * 2)
                      : data.map((_, i) => -i * width * 2),
                }),
              },
            ],
            opacity: sliderAnimatedValue.interpolate({
              inputRange: [...Array(data.length * 2 + 1).keys()].map(
                (i) => i / 2
              ),
              outputRange: [...Array(data.length * 2 + 1).keys()].map((i) =>
                i % 2 === 0 ? 1 : 0
              ),
            }),
          }}
        >
          {data.map(({ image }, index) => {
            return (
              <View key={index} style={styles.containerImage}>
                <Text style={styles.title}>¡Hello World!</Text>
                <Image source={{ uri: image }} style={styles.image} />
              </View>
            );
          })}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: height > 592 ? 90 : 50,
  },
  circleContainer: {
    backgroundColor: "gold",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: height > 592 ? 90 : 30,
  },
  circle: {
    backgroundColor: "#444",
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
  },
  circleButton: {
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  containerImage: {
    width: width * 2,
    paddingRight: width,
    alignItems: "center",
  },
  image: {
    width: width * 0.65,
    height: height * 0.5,
    borderRadius: 16,
  },
  title: {
    fontWeight: "bold",
    fontSize: 25,
    letterSpacing: 0.5,
    marginBottom: 22,
    color: "#fff",
  },
});
