import { useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
} from "react-native";

const data = [
  {
    image:
      "https://i.pinimg.com/564x/45/17/a4/4517a4a7c41cce31bc78939a264539f2.jpg",
  },
  {
    image:
      "https://i.pinimg.com/564x/45/17/a4/4517a4a7c41cce31bc78939a264539f2.jpg",
  },
  {
    image:
      "https://i.pinimg.com/564x/45/17/a4/4517a4a7c41cce31bc78939a264539f2.jpg",
  },
  {
    image:
      "https://i.pinimg.com/564x/45/17/a4/4517a4a7c41cce31bc78939a264539f2.jpg",
  },
  {
    image:
      "https://i.pinimg.com/564x/45/17/a4/4517a4a7c41cce31bc78939a264539f2.jpg",
  },
  {
    image:
      "https://i.pinimg.com/564x/45/17/a4/4517a4a7c41cce31bc78939a264539f2.jpg",
  },
];

const colors = [
  {
    initialBgColor: "goldenrod",
    bgColor: "#222",
    nextBgColor: "goldenrod",
  },
  {
    initialBgColor: "#222",
    bgColor: "goldenrod",
    nextBgColor: "yellowgreen",
  },
  {
    initialBgColor: "goldenrod",
    bgColor: "yellowgreen",
    nextBgColor: "midnightblue",
  },
  {
    initialBgColor: "yellowgreen",
    bgColor: "midnightblue",
    nextBgColor: "turquoise",
  },
  {
    initialBgColor: "midnightblue",
    bgColor: "turquoise",
    nextBgColor: "goldenrod",
  },
  {
    initialBgColor: "turquoise",
    bgColor: "goldenrod",
    nextBgColor: "#222",
  },
];

const { width } = Dimensions.get("window");

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
                  outputRange: [1, 8, 1],
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
            <MaterialIcons name="arrow-forward-ios" size={24} color="red" />
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
  console.log(index, "INDEX");

  //gira para un lado y despuees vuelve cuando apreto el boton
  // const animation = (toValue: number) =>
  //   Animated.timing(animatedValue, {
  //     toValue: toValue,
  //     duration: 3000,
  //     useNativeDriver: false,
  //   });

  //que gire siempre para el mismo lado cuando apreto el boton
  const animation = (toValue: number) =>
    Animated.parallel([
      Animated.timing(sliderAnimatedValue, {
        toValue: toValue,
        duration: 3000,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue2, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      }),
    ]);

  const onPress = () => {
    //gira para un lado y despuees vuelve cuando apreto el boton
    // setIndex(index === 1 ? 0 : 1);
    // animation(index === 1 ? 0 : 1).start();
    //*****/
    //que gire siempre para el mismo lado cuando apreto el boton
    animatedValue.setValue(0);
    animatedValue2.setValue(0);
    animation((index + 1) % colors.length).start();
    setIndex((index + 1) % colors.length);

    // animation(index + 1).start();
    // if (index === colors.length - 1) {
    //   return setIndex(0);
    // }
    // setIndex(index + 1);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Circle
        onPress={onPress}
        animatedValue={animatedValue}
        animatedValue2={animatedValue2}
        index={index}
      />
      <Animated.View
        style={{
          flexDirection: "row",
          transform: [
            {
              translateX: sliderAnimatedValue.interpolate({
                inputRange: [...Array(data.length).keys()],
                outputRange:
                  index === 0
                    ? data.map((_, i) => i * width * 2)
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
            <View
              key={index}
              style={{
                width: width * 2,
                paddingRight: width,
                alignItems: "center",
              }}
            >
              <Image
                source={{ uri: image }}
                style={{
                  width: width * 0.65,
                  height: 350,
                  borderRadius: 16,
                  //opacity: index === 0 ? 0 : 1,
                }}
                resizeMode="stretch"
              />
            </View>
          );
        })}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 100,
  },
  circleContainer: {
    backgroundColor: "gold",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 100,
    padding: 8,
  },
  circle: {
    backgroundColor: "#444",
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
  },
  circleButton: {
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
});
