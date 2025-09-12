import React from "react";
import { View, Text, ScrollView, StyleSheet, Animated } from "react-native";

const CommentaryFeed = ({ events }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(20)).current; // slide up animation

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [events]);

  const getEventStyle = (type) => {
    switch (type) {
      case "BOUNDARY":
        return {
          borderColor: "#4ade80",
          backgroundColor: "rgba(22, 63, 44, 0.9)",
          icon: "🏏",
          accentColor: "#4ade80",
          label: "Boundary!",
        };
      case "WICKET":
        return {
          borderColor: "#f87171",
          backgroundColor: "rgba(44, 19, 19, 0.9)",
          icon: "💥",
          accentColor: "#f87171",
          label: "Wicket!",
        };
      case "MATCH_STATUS":
        return {
          borderColor: "#facc15",
          backgroundColor: "rgba(74, 59, 0, 0.9)",
          icon: "⏳",
          accentColor: "#facc15",
          label: "Match Update",
        };
      case "BALL":
        return {
          borderColor: "#60a5fa",
          backgroundColor: "rgba(30, 41, 59, 0.9)",
          icon: "•",
          accentColor: "#93c5fd",
          label: "Ball",
        };
      default:
        return {
          borderColor: "#a855f7",
          backgroundColor: "rgba(46, 16, 77, 0.9)",
          icon: "⚡",
          accentColor: "#d8b4fe",
          label: "Unknown Event",
        };
    }
  };

  const formatOverBall = (over, ball) => {
    if (ball === 6) {
      return `${over - 1}.${ball}`;
    }
    return `${over}.${ball}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📡 Live Commentary</Text>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {events.map((e, idx) => {
          const { borderColor, backgroundColor, icon, accentColor, label } =
            getEventStyle(e.type);

          return (
            <Animated.View
              key={idx}
              style={[
                styles.eventItem,
                {
                  backgroundColor,
                  borderLeftColor: borderColor,
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {/* Header Row */}
              <View style={styles.eventHeader}>
                <Text style={[styles.eventIcon, { color: accentColor }]}>
                  {icon}
                </Text>
                <Text style={[styles.eventLabel, { color: accentColor }]}>
                  {label}
                </Text>
                {e.payload?.over !== undefined && e.payload?.ball !== undefined && (
                  <Text style={[styles.overText, { color: accentColor }]}>
                    {formatOverBall(e.payload.over, e.payload.ball)}
                  </Text>
                )}
              </View>

              {/* Commentary */}
              <Text style={styles.commentaryText}>
                {e.payload.commentary || "No commentary available."}
              </Text>

              {/* Bowler Info */}
              {e.payload?.bowler && (
                <Text style={styles.bowlerText}>
                  🎯 Bowler: {e.payload.bowler}
                </Text>
              )}

              {/* Conditional Highlights */}
              {e.type === "WICKET" && (
                <View style={styles.specialInfo}>
                  <Text style={[styles.specialText, { color: "#f87171" }]}>
                    🚪 Out: {e.payload.playerOut} ({e.payload.dismissal})
                  </Text>
                </View>
              )}

              {e.type === "BOUNDARY" && (
                <View style={styles.specialInfo}>
                  <Text style={[styles.specialText, { color: "#4ade80" }]}>
                    🏃‍♂️ Runs: {e.payload.runs}
                  </Text>
                </View>
              )}

              {e.type === "MATCH_STATUS" && (
                <View style={styles.specialInfo}>
                  <Text style={[styles.specialText, { color: "#facc15" }]}>
                    📢 {e.payload.summary}
                  </Text>
                </View>
              )}

              {e.type !== "WICKET" &&
                e.type !== "BOUNDARY" &&
                e.type !== "MATCH_STATUS" &&
                e.type !== "BALL" && (
                  <View style={styles.specialInfo}>
                    <Text style={[styles.specialText, { color: "#d8b4fe" }]}>
                      ⚠️ Unrecognized Event Data
                    </Text>
                  </View>
                )}
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    flex: 1,
    paddingHorizontal: 8,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 16,
    paddingLeft: 4,
    letterSpacing: 0.5,
  },
  scrollContainer: {
    paddingBottom: 24,
  },
  eventItem: {
    borderLeftWidth: 6,
    padding: 14,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  eventHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    justifyContent: "space-between",
  },
  eventIcon: {
    fontSize: 20,
    marginRight: 6,
  },
  eventLabel: {
    fontWeight: "700",
    fontSize: 16,
    flex: 1,
  },
  overText: {
    fontWeight: "700",
    fontSize: 16,
  },
  commentaryText: {
    color: "white",
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 6,
  },
  bowlerText: {
    fontStyle: "italic",
    color: "#d1d5db",
    fontSize: 14,
    marginBottom: 4,
  },
  specialInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  specialText: {
    fontSize: 15,
    fontWeight: "600",
  },
});

export default CommentaryFeed;
