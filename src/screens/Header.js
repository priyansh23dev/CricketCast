import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

const BreakTimer = ({ seconds, isVisible }) => {
    const [review, setReview] = useState("");
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    const REVIEWS = [
        `R. Sharma: The pitch looks good for batting, consistent bounce. Running between wickets will be key.`,
        `V. Kohli: Respect the good balls, build partnerships. Outfield is quick, boundaries will come.`,
        `B. Azam: We must bowl tight lines and cut off singles. Early wickets can change the game.`,
        `M. Rizwan: Rotate strike, punish loose balls. This is the moment to build a big stand.`,
    ];

    const PLAYERS = [
        "R. Sharma", "V. Kohli", "S. Iyer", "R. Pant", "H. Pandya", "R. Jadeja", "I. Kishan",
        "B. Azam", "M. Rizwan", "F. Zaman", "I. Ahmed", "S. Khan", "M. Nawaz", "A. Ali"
    ];

    useEffect(() => {
        if (isVisible) {
            const player = PLAYERS[Math.floor(Math.random() * PLAYERS.length)];
            const reviewText = REVIEWS[Math.floor(Math.random() * REVIEWS.length)]
                .replace(/^[^:]+:/, `${player}:`);
            setReview(reviewText);

            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }).start();
        }
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <Animated.View style={[styles.breakContainer, { opacity: fadeAnim }]}>
            <View style={styles.breakHeader}>
                <Text style={styles.breakIcon}>⏳</Text>
                <Text style={styles.breakTitle}>Innings Break</Text>
                <View style={styles.timerBadge}>
                    <Text style={styles.timerText}>{seconds}s</Text>
                </View>
            </View>

            <View style={styles.reviewContainer}>
                <Text style={styles.reviewLabel}>Player Insight:</Text>
                <Text style={styles.reviewText}>"{review}"</Text>
            </View>
        </Animated.View>
    );
};

const MatchHeader = ({ matchState }) => {
    const battingTeam = matchState.innings === 1 ? "India" : "Pakistan";
    const bowlingTeam = matchState.innings === 1 ? "Pakistan" : "India";

    const batting = matchState.teams[battingTeam];
    const bowling = matchState.teams[bowlingTeam];

    const isMatchFinished = matchState.finished;
    const isInningsBreak = matchState.inBreak;
    const breakSeconds = matchState.breakSeconds || 0;

    const scaleValue = React.useRef(new Animated.Value(0)).current;
    const fadeValue = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isMatchFinished) {
            Animated.parallel([
                Animated.spring(scaleValue, {
                    toValue: 1,
                    friction: 4,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeValue, {
                    toValue: 1,
                    duration: 900,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [isMatchFinished]);

    if (isMatchFinished) {
        const indiaScore = matchState.teams.India.runs;
        const pakistanScore = matchState.teams.Pakistan.runs;
        const winner = indiaScore > pakistanScore ? "India" :
            pakistanScore > indiaScore ? "Pakistan" : "Draw";

        return (
            <Animated.View
                style={[
                    styles.container,
                    styles.finishedContainer,
                    { opacity: fadeValue, transform: [{ scale: scaleValue }] }
                ]}
            >
                <Text style={styles.trophyIcon}>🏆</Text>
                <Text style={styles.matchFinishedText}>MATCH FINISHED</Text>

                <View style={styles.winnerContainer}>
                    <Text style={styles.winnerText}>
                        {winner === "Draw" ? "Match Tied!" : `${winner} Won!`}
                    </Text>
                    {winner !== "Draw" && (
                        <Text style={styles.congratsText}>Congratulations!</Text>
                    )}
                </View>

                <View style={styles.finalScoresContainer}>
                    {Object.entries(matchState.teams).map(([team, data]) => (
                        <View key={team} style={styles.teamScoreCard}>
                            <Text style={styles.teamName}>{team}</Text>
                            <Text style={styles.finalScore}>
                                {data.runs}/{data.wickets}
                            </Text>
                            <Text style={styles.overs}>
                                ({Math.floor(data.balls / 6)}.{data.balls % 6} overs)
                            </Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.resultText}>{matchState.result}</Text>
            </Animated.View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Match status (LIVE or BREAK) */}
            <View style={[
                styles.statusIndicator,
                isInningsBreak ? styles.breakIndicator : styles.liveIndicator
            ]}>
                <View style={styles.dot} />
                <Text style={styles.statusText}>
                    {isInningsBreak ? "BREAK" : "LIVE"}
                </Text>
            </View>

            {/* Batting info */}
            <Text style={styles.battingHeader}>🏏 {battingTeam} Batting</Text>

            <View style={styles.batsmenContainer}>
                <View style={styles.batsmanRow}>
                    <Text style={styles.label}>Striker:</Text>
                    <Text style={styles.value}>{batting.striker}</Text>
                </View>
                <View style={styles.batsmanRow}>
                    <Text style={styles.label}>Non-Striker:</Text>
                    <Text style={styles.value}>{batting.nonStriker}</Text>
                </View>
            </View>

            {/* Bowling info */}
            <View style={styles.bowlingContainer}>
                <View style={styles.bowlerRow}>
                    <Text style={styles.label}>Bowler:</Text>
                    <Text style={styles.value}>{bowling.currentBowler}</Text>
                </View>
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Overs</Text>
                        <Text style={styles.statValue}>
                            {Math.floor(batting.balls / 6)}.{batting.balls % 6}
                        </Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Wickets</Text>
                        <Text style={styles.statValue}>{batting.wickets}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Run Rate</Text>
                        <Text style={styles.statValue}>
                            {(batting.runs / (batting.balls / 6)).toFixed(2)}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Scoreboard */}
            <View style={styles.scoreboardContainer}>
                <Text style={styles.scoreboardTitle}>Scoreboard</Text>
                {Object.entries(matchState.teams).map(([team, data]) => (
                    <View key={team} style={styles.teamRow}>
                        <Text style={styles.teamName}>{team}</Text>
                        <Text style={styles.teamScore}>
                            {data.runs}/{data.wickets}
                        </Text>
                        <Text style={styles.teamOvers}>
                            ({Math.floor(data.balls / 6)}.{data.balls % 6} overs)
                        </Text>
                    </View>
                ))}
            </View>

            {/* Break Timer
            <BreakTimer seconds={breakSeconds} isVisible={isInningsBreak} /> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: "#1e293b",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#334155",
    },

    /** Break Timer **/
    breakContainer: {
        backgroundColor: '#fff7ed',
        borderRadius: 10,
        padding: 16,
        marginTop: 16,
        borderLeftWidth: 5,
        borderLeftColor: '#f97316',
    },
    breakHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    breakIcon: {
        fontSize: 22,
        marginRight: 8,
    },
    breakTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#c2410c',
        flex: 1,
    },
    timerBadge: {
        backgroundColor: '#f97316',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    timerText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 13,
    },
    reviewContainer: {
        marginTop: 6,
        padding: 10,
        backgroundColor: 'rgba(255,255,255,0.85)',
        borderRadius: 8,
    },
    reviewLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#92400e',
        marginBottom: 4,
    },
    reviewText: {
        fontSize: 14,
        color: '#78350f',
        fontStyle: 'italic',
        lineHeight: 20,
    },

    /** Match Finished **/
    finishedContainer: {
        alignItems: 'center',
        backgroundColor: '#0f172a',
        paddingVertical: 24,
    },
    trophyIcon: {
        fontSize: 50,
        marginBottom: 8,
    },
    matchFinishedText: {
        color: '#facc15',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    winnerContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    winnerText: {
        color: 'white',
        fontSize: 26,
        fontWeight: 'bold',
    },
    congratsText: {
        color: '#4ade80',
        fontSize: 16,
        marginTop: 4,
    },
    finalScoresContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        marginBottom: 16,
    },
    teamScoreCard: {
        alignItems: 'center',
        backgroundColor: '#1e293b',
        padding: 14,
        borderRadius: 10,
        minWidth: 110,
    },
    finalScore: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 4,
    },
    overs: {
        color: '#94a3b8',
        fontSize: 13,
    },
    resultText: {
        color: '#f1f5f9',
        fontSize: 15,
        textAlign: 'center',
        fontStyle: 'italic',
    },

    /** Live / Break Status **/
    statusIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        marginBottom: 12,
    },
    liveIndicator: {
        backgroundColor: '#dc2626',
    },
    breakIndicator: {
        backgroundColor: '#f59e0b',
    },
    dot: {
        width: 8,
        height: 8,
        backgroundColor: 'white',
        borderRadius: 4,
        marginRight: 6,
    },
    statusText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },

    /** Live Score **/
    battingHeader: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#facc15",
        marginBottom: 12,
    },
    batsmenContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    batsmanRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        color: "#94a3b8",
        fontWeight: "500",
        marginRight: 4,
    },
    value: {
        color: "white",
        fontWeight: "500",
    },
    bowlingContainer: {
        marginBottom: 16,
    },
    bowlerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        alignItems: 'center',
        backgroundColor: '#334155',
        padding: 8,
        borderRadius: 8,
        minWidth: 80,
    },
    statLabel: {
        color: '#94a3b8',
        fontSize: 12,
        marginBottom: 4,
    },
    statValue: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },

    /** Scoreboard **/
    scoreboardContainer: {
        borderTopWidth: 1,
        borderTopColor: "#334155",
        paddingTop: 12,
    },
    scoreboardTitle: {
        color: '#facc15',
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
        fontSize: 16,
    },
    teamRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 4,
        paddingVertical: 4,
    },
    teamName: {
        color: "white",
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
    },
    teamScore: {
        color: "white",
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    teamOvers: {
        color: "#94a3b8",
        fontSize: 14,
        flex: 1,
        textAlign: 'right',
    },
});

export default MatchHeader;
