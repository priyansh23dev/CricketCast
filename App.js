import React from "react";
import { SafeAreaView, ScrollView, StatusBar } from "react-native";
import Header from "./src/screens/Header";
import BreakTimer from "./src/screens/BreakTimer";
import CommentaryFeed from "./src/screens/CommentaryFeed";
import useMatchEngine from "./src/screens/useMatchEngine";

export default function App() {
  const matchState = useMatchEngine();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f172a", paddingTop:70 }}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Header matchState={matchState} />
        {matchState.inBreak && <BreakTimer seconds={matchState.breakTimeLeft} />}
        <CommentaryFeed events={matchState.events} />
      </ScrollView>
    </SafeAreaView>
  );
}
