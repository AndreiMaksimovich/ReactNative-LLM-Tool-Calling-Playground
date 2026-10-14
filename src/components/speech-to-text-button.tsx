import React from 'react';
import CircleButton from "@/components/circle-button";
import { useState, useEffect } from 'react';
import {
    start,
    stop,
    requestPermissions,
    isAvailable,
    addSpeechResultListener,
    addSpeechErrorListener,
    addSpeechEndListener,
    type SpeechResult,
} from '@dbkable/react-native-speech-to-text';
import { trigger } from "react-native-haptic-feedback";

export interface SpeechToTextButtonProps {
    onResult: (isFinal: boolean, text: string) => void;
    onError?: (error: Error | string) => void;
    onEnd?: () => void;
    onStart?: () => void;
}

const LOG_TAG = 'SpeechToTextButton'

export default function SpeechToTextButton(props: SpeechToTextButtonProps) {

    const [isListening, setIsListening] = useState(false);

    useEffect(() => {

        // Listen for results
        const resultListener = addSpeechResultListener((result: SpeechResult) => {
            // console.log(LOG_TAG, 'OnResult Confidence:', result.confidence, 'Transcript:', result.transcript, 'isFinal:', result.isFinal);
            props.onResult?.(result.isFinal, result.transcript)
        });

        // Listen for errors
        const errorListener = addSpeechErrorListener((error) => {
            // console.error(LOG_TAG, 'Speech error:', error);
            props.onError?.(error.message)
            setIsListening(false);
        });

        // Listen for end of speech
        const endListener = addSpeechEndListener(() => {
            // console.log(LOG_TAG, 'End listening:');
            props.onEnd?.()
            setIsListening(false);
            trigger('gestureEnd')
        });

        // Cleanup
        return () => {
            resultListener.remove();
            errorListener.remove();
            endListener.remove();
        };
    }, []);

    const handleStart = async () => {
        try {
            // console.log(LOG_TAG, 'handleStart');

            if (isListening) {
                // console.warn(LOG_TAG, 'Cannot start listening: isListening == true');
                return
            }

            const available = await isAvailable();
            if (!available) {
                alert('Speech recognition not available');
                return;
            }

            const hasPermission = await requestPermissions();
            if (!hasPermission) {
                alert('Permission denied');
                return;
            }

            // console.log(LOG_TAG, 'Start listening');
            await start({ language: 'en-US' });
            trigger('impactLight')
            setIsListening(true);
            props.onStart?.();
        } catch (error) {
            console.error(error);
        }
    };

    const handleStop = async () => {
        try {
            if (!isListening) return
            // console.log(LOG_TAG, 'handleStop');
            await stop();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <CircleButton
            icon={'microphone'}
            backgroundColor={'white'}
            onPressIn={() => {
                handleStart().catch((err) => console.log(err));
            }}
            onPressOut={() => {
                handleStop().catch((err) => console.log(err));
            }}
        />
    )
}

