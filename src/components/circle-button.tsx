import React from 'react';
import {Pressable, StyleSheet, StyleProp, ViewStyle, Button} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {ColorValue} from "react-native/Libraries/StyleSheet/StyleSheet";

export interface CircleButtonProps {
    backgroundColor?: ColorValue | undefined;
    style?: StyleProp<ViewStyle>;
    icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
    onPress?: () => void;
    accessibilityLabel?: string;
    onPressIn?: () => void;
    onPressOut?: () => void;
}

export default function CircleButton(props: CircleButtonProps) {
    return (
        <Pressable
            role={'button'}
            accessibilityRole="button"
            accessibilityLabel={props.accessibilityLabel}
            style={({ pressed }) => [
                styles.button,
                {
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: props.backgroundColor,
                    opacity: pressed ? 0.8 : 1,
                },
                props.style,
            ]}
            onPress={props.onPress}
            onPressIn={props.onPressIn}
            onPressOut={props.onPressOut}
        >
            <MaterialCommunityIcons name={props.icon} size={28} color="black" />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        // shadow (iOS)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        // shadow (Android)
        elevation: 4,
    },
});