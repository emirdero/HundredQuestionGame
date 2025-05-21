// src/screens/GameScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';
import { DRINK_PROMPT, GAME_OVER_PROMPT } from '../data/questions'; // Make sure this path is correct

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25; // Min distance to trigger swipe
const ANIMATION_DURATION = 250; // ms

// Enum-like object for card content type
const CardType = {
    THEME: 'THEME',
    QUESTION: 'QUESTION',
    PROMPT: 'PROMPT',
    GAMEOVER: 'GAMEOVER',
};

export default function GameScreen({ route, navigation }) {
    const { selectedSet, selectedTheme } = route.params;

    // If selectedTheme is provided, use it directly; otherwise, use themeIndex
    const [themeIndex, setThemeIndex] = useState(() => {
        if (selectedTheme) {
            // Find the index of the selected theme in the set
            const idx = selectedSet.themes.findIndex(t => t.name === selectedTheme.name);
            return idx !== -1 ? idx : 0;
        }
        return 0;
    });
    // -1 for theme intro, 0-9 for questions, 10 for drink prompt
    const [questionIndex, setQuestionIndex] = useState(-1);
    const [currentText, setCurrentText] = useState('');
    const [cardType, setCardType] = useState(CardType.THEME);

    const translateX = useSharedValue(0);
    const opacity = useSharedValue(1);

    // Determine current content based on state
    useEffect(() => {
        if (cardType === CardType.GAMEOVER) {
            setCurrentText(GAME_OVER_PROMPT);
            return;
        }

        // Ensure selectedSet and themes exist before accessing
        if (!selectedSet || !selectedSet.themes || !selectedSet.themes[themeIndex]) {
             console.error("Invalid set or theme index:", themeIndex, selectedSet);
             setCardType(CardType.GAMEOVER); // Or navigate back
             setCurrentText(GAME_OVER_PROMPT);
             return;
        }

        const currentTheme = selectedSet.themes[themeIndex];

        if (questionIndex === -1) {
            setCardType(CardType.THEME);
            setCurrentText(`Tema: ${currentTheme.name}`);
        } else if (questionIndex >= 0 && questionIndex < currentTheme.questions.length) {
            setCardType(CardType.QUESTION);
            setCurrentText(currentTheme.questions[questionIndex]);
        } else if (questionIndex === currentTheme.questions.length) {
            setCardType(CardType.PROMPT);
            setCurrentText(DRINK_PROMPT);
        } else {
            // Fallback case, should ideally not be reached with proper logic
            console.warn("Unexpected state:", { themeIndex, questionIndex });
             if (themeIndex >= selectedSet.themes.length -1) {
                 setCardType(CardType.GAMEOVER);
                 setCurrentText(GAME_OVER_PROMPT);
             } else {
                 // Try to recover by moving to next theme prompt maybe? Or just show game over.
                 setCardType(CardType.GAMEOVER); // Safer default
                 setCurrentText(GAME_OVER_PROMPT);
             }
        }
    }, [themeIndex, questionIndex, selectedSet, cardType]); // Added cardType dependency


    // --- State Update Logic ---
    const goToNext = () => {
        // Check if selectedSet and themes are valid before proceeding
        if (!selectedSet || !selectedSet.themes || !selectedSet.themes[themeIndex]) return;

        const currentTheme = selectedSet.themes[themeIndex];
        if (questionIndex < currentTheme.questions.length - 1) {
            // Next question in the same theme
            setQuestionIndex(qIndex => qIndex + 1);
        } else if (questionIndex === currentTheme.questions.length - 1) {
            // Last question of theme done -> show prompt
            setQuestionIndex(qIndex => qIndex + 1); // To trigger prompt display
        }
        // Swiping next on Theme/Prompt/GameOver does nothing, handled by tap
    };

    const goToPrevious = () => {
        // Check if selectedSet and themes are valid before proceeding
        if (!selectedSet || !selectedSet.themes) return;

        if (questionIndex > 0) {
            // Previous question in the same theme
            setQuestionIndex(qIndex => qIndex - 1);
        } else if (questionIndex === 0) {
            // Go back to theme title
            setQuestionIndex(-1);
            setCardType(CardType.THEME); // Explicitly set type
        } else if (questionIndex === -1 && themeIndex > 0) {
            // On Theme title, go to *prompt* of previous theme
             // Check if previous theme exists
            if (!selectedSet.themes[themeIndex - 1]) return;
            const prevTheme = selectedSet.themes[themeIndex - 1];
            setThemeIndex(tIndex => tIndex - 1);
            setQuestionIndex(prevTheme.questions.length); // Show prompt of previous theme
            setCardType(CardType.PROMPT); // Explicitly set type
        } else if (questionIndex === selectedSet.themes[themeIndex]?.questions.length) {
            // On Prompt, go to last question of current theme
            // Check if current theme and questions exist
            if (!selectedSet.themes[themeIndex]?.questions) return;
            setQuestionIndex(selectedSet.themes[themeIndex].questions.length - 1);
            setCardType(CardType.QUESTION); // Explicitly set type
        }
         // Swiping back on GameOver does nothing
    };

    const handleTap = () => {
        if (cardType === CardType.THEME) {
            // Check if current theme and questions exist
             if (!selectedSet?.themes[themeIndex]?.questions) return;
            // Start questions for the current theme
            setQuestionIndex(0);
            setCardType(CardType.QUESTION); // Explicitly set type
            resetCardPosition(false); // Reset position without animation for instant update
        } else if (cardType === CardType.PROMPT) {
            // Move to the next theme or game over
            // Check if selectedSet and themes exist
             if (!selectedSet?.themes) return;
            if (themeIndex < selectedSet.themes.length - 1) {
                setThemeIndex(tIndex => tIndex + 1);
                setQuestionIndex(-1); // Show next theme title
                setCardType(CardType.THEME); // Explicitly set type
                resetCardPosition(false);
            } else {
                // Game Over
                setCardType(CardType.GAMEOVER);
                resetCardPosition(false);
            }
        } else if (cardType === CardType.GAMEOVER) {
            navigation.popToTop(); // Go back to the start screen
        }
        // Tapping on a question card does nothing, requires swipe
    };


    // --- Animation Logic ---
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
        opacity: opacity.value,
    }));

    const resetCardPosition = (animated = true) => {
        if (animated) {
            translateX.value = withTiming(0, { duration: ANIMATION_DURATION });
            opacity.value = withTiming(1, { duration: ANIMATION_DURATION });
        } else {
            translateX.value = 0;
            opacity.value = 1;
        }
    };

    // Wrapper functions for state updates needed for runOnJS
    const updateNextState = () => {
        goToNext();
    };
    const updatePrevState = () => {
        goToPrevious();
    };

    // --- Gesture Handling ---
    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            // Only allow horizontal swiping on Question cards
            if (cardType === CardType.QUESTION) {
                translateX.value = event.translationX;
                // Dim card slightly when swiping
                opacity.value = 1 - Math.abs(event.translationX / SCREEN_WIDTH);
            } else {
                // Prevent dragging on Theme/Prompt/GameOver
                translateX.value = 0;
            }
        })
        .onEnd((event) => {
            if (cardType !== CardType.QUESTION) {
                // If not a question card, reset immediately if dragged slightly by mistake
                 // Only reset if it was actually moved (check threshold maybe?)
                 if (Math.abs(translateX.value) > 5) {
                     resetCardPosition();
                 }
                return;
            }

            const translationX = event.translationX;
            if (translationX < -SWIPE_THRESHOLD) {
                // Swipe Left (Next)
                translateX.value = withTiming(-SCREEN_WIDTH, { duration: ANIMATION_DURATION }, (finished) => {
                    if (finished) {
                        runOnJS(updateNextState)(); // Update state AFTER animation finishes
                        // Run state update on JS thread AFTER animation
                        // Reset position off-screen right then slide in
                        translateX.value = SCREEN_WIDTH; // Instantly move off-screen right
                        requestAnimationFrame(() => { // Ensure state update propagates before next animation
                            resetCardPosition(); // Slide in from right
                        })
                    } else {
                        // If animation didn't finish (interrupted?), snap back
                        resetCardPosition();
                    }
                });
                opacity.value = withTiming(0, { duration: ANIMATION_DURATION });

            } else if (translationX > SWIPE_THRESHOLD) {
                // Swipe Right (Previous)
                translateX.value = withTiming(SCREEN_WIDTH, { duration: ANIMATION_DURATION }, (finished) => {
                    if (finished) {
                        runOnJS(updatePrevState)(); // Update state AFTER animation finishes
                        // Reset position off-screen left then slide in
                        translateX.value = -SCREEN_WIDTH; // Instantly move off-screen left
                         requestAnimationFrame(() => { // Ensure state update propagates before next animation
                            resetCardPosition(); // Slide in from left
                         })
                    } else {
                        resetCardPosition();
                    }
                });
                opacity.value = withTiming(0, { duration: ANIMATION_DURATION });

            } else {
                // Didn't swipe far enough, snap back
                resetCardPosition();
            }
        });

    // Separate Tap gesture for advancing Theme/Prompt/GameOver
    const tapGesture = Gesture.Tap().onEnd(() => {
        // Run tap logic only if it's not a question card
        if (cardType !== CardType.QUESTION) {
            runOnJS(handleTap)();
        }
    });

    // Combine gestures: Pan has priority for questions, Tap for others
    const combinedGesture = Gesture.Exclusive(panGesture, tapGesture);

    // *** THEME HEADER TEXT - GET NAME SAFELY ***
    const currentThemeName = selectedSet.themes[themeIndex]?.name || '';

    return (
        // The main container View now holds the theme header AND the gesture detector
        // *** MAIN CONTAINER VIEW ***
        <View style={styles.container} >
            {/* *** THEME HEADER TEXT - DISPLAY CONDITIONALLY *** */}
            {cardType === CardType.QUESTION && (
                <Text style={styles.themeHeaderText}>
                    {currentThemeName}
                </Text>
            )}

            {/* The GestureDetector now wraps the animated card part */}
            <GestureDetector gesture={combinedGesture}>
                {/* *** CARD CONTAINER VIEW *** */}
                <View style={styles.cardContainer} collapsable={false}>
                    {/* Card container helps position the card below the theme header */}
                    <Animated.View style={[styles.card, animatedStyle]}>
                        <Text style={
                            cardType === CardType.THEME ? styles.themeText :
                            cardType === CardType.PROMPT ? styles.promptText :
                            cardType === CardType.GAMEOVER ? styles.gameOverText :
                            styles.questionText // Default to question style
                        }>
                            {currentText}
                        </Text>
                    </Animated.View>
                </View>
            </GestureDetector>
        </View>
    );
}

// --- Styles (Dark Theme Applied) ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center', // Adjust vertical alignment slightly if needed
        alignItems: 'center',
        backgroundColor: '#000000', // Black background
        paddingTop: 60, // Give space for theme header (adjust as needed)
        paddingHorizontal: 10,
    },
    // Style for the theme header text
    themeHeaderText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF', // White text
        textAlign: 'center',
        marginBottom: 20, // Space between header and card
        paddingHorizontal: 15, // Prevent text touching edges
    },
    // A container for the card (useful for flexbox layout)
    cardContainer: {
       flex: 1, // Takes remaining space below header
       width: '100%',
       justifyContent: 'center', // Center card vertically in remaining space
       alignItems: 'center',
       paddingBottom: 40, // Add some padding at the bottom if needed
    },
    card: {
        width: SCREEN_WIDTH * 0.9,
        height: '70%', // Adjust as needed, maybe slightly less due to header
        backgroundColor: '#222222', // Dark grey card background
        borderRadius: 20,
        padding: 25,
        justifyContent: 'center',
        alignItems: 'center',
        // Shadows are less visible on dark backgrounds, adjust or remove if desired
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    themeText: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#FFFFFF', // White text
    },
    questionText: {
        fontSize: 22,
        textAlign: 'center',
        color: '#FFFFFF', // White text
    },
    promptText: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#FFFFFF', // White text (Maybe a light red like #FF8A80 ?)
    },
    gameOverText: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#FFFFFF', // White text (Maybe a light green like #B9F6CA ?)
    }
});