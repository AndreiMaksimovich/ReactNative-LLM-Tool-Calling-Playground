import {StyleSheet, View, ViewStyle} from "react-native";
import {PropsWithChildren, ReactNode} from "react";
import {ThemedText} from "@/components/themed-text";

export interface SectionProps extends PropsWithChildren {
    header?: string | ReactNode;
    footer?: string | ReactNode;
    style?: ViewStyle;
}

export default function Section(props: SectionProps): ReactNode {
    return (
        <View style={[styles.wrapper, props.style]}>
            {props.header &&
                (typeof props.header == 'string' ?
                        ( <ThemedText type={'smallBold'}>{props.header}</ThemedText> )
                        :
                        ( props.header )
                )
            }
            <View style={styles.card}>
                {props.children}
            </View>
            {props.footer &&
                (typeof props.footer == 'string' ?
                        ( <ThemedText type={'smallBold'}>{props.footer}</ThemedText> )
                        :
                        ( props.footer )
                )
            }
        </View>
    )
}

function SectionSeparator() {
    return (
        <View style={styles.separator}></View>
    )
}

Section.Separator = SectionSeparator;

const styles = StyleSheet.create({
    wrapper: {
        padding: 16
    },
    card: {
        backgroundColor: '#1C1C1E',
        borderRadius: 10,
        paddingHorizontal: 16,
        overflow: 'hidden',
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: 'gray',
    },
});