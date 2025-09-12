import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

const REVIEWS = [
  `R. Sharma: The pitch looks good for batting, and the bounce is consistent. We'll need to take advantage of the first few overs. Fielding side looks sharp, so running between wickets will be crucial. Planning to rotate strike and look for boundaries in gaps. Team morale is high, and everyone is pumped for this inning.`,
  `V. Kohli: The surface is offering good value for shots. Rotating strike is key, but boundaries will come if we stay patient. Fitness and running hard between wickets will play a big role today.`,
  `B. Azam: The bowlers need to stay disciplined. A total around 170+ is competitive here. Field placement and sharp fielding will decide the outcome in the second innings.`,
];

const PLAYERS = [
  "R. Sharma", "V. Kohli", "S. Iyer", "R. Pant", "H. Pandya", "R. Jadeja", "I. Kishan",
  "B. Azam", "M. Rizwan", "F. Zaman", "I. Ahmed", "S. Khan", "M. Nawaz", "A. Ali"
];

const BreakTimer = ({ seconds }) => {
  const [review, setReview] = useState("");

  useEffect(() => {
    const updateReview = () => {
      const player = PLAYERS[Math.floor(Math.random() * PLAYERS.length)];
      const reviewText =
        REVIEWS[Math.floor(Math.random() * REVIEWS.length)].replace(
          /(R\. Sharma|V\. Kohli|B\. Azam)/,
          player
        );
      setReview(reviewText);
    };

    updateReview(); // initial review
    const interval = setInterval(updateReview, 10000); // change every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <View
      style={{
        marginBottom: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: "#facc15",
        borderRadius: 10,
        backgroundColor: "#1e293b",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
      }}
    >
      {/* Countdown */}
      <Text
        style={{
          color: "#facc15",
          fontSize: 20,
          fontWeight: "700",
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        ⏳ Next Inning Starts In: {seconds}s
      </Text>

      {/* Player Insight */}
      <Text
        style={{
          color: "#facc15",
          fontSize: 14,
          fontWeight: "600",
          marginBottom: 4,
        }}
      >
        🎙 Player Insight
      </Text>
      <Text
        style={{
          color: "white",
          fontSize: 15,
          lineHeight: 21,
        }}
      >
        {review}
      </Text>
    </View>
  );
};

export default BreakTimer;
