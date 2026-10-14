import {PropsWithChildren} from "react";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {ScrollView, Text} from "react-native";

export interface ScreenProps extends PropsWithChildren{}

export default function Screen(props: ScreenProps) {
    return (
        <SafeAreaProvider>
            <SafeAreaView edges={["top", "bottom"]}>
                <ScrollView style={{width: '100%', height: '100%'}}>
                    {props.children}
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}