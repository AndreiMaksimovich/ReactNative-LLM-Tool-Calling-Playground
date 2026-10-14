import {ThemedText} from "@/components/themed-text";
import Screen from "@/components/screen";
import {useAppDispatch, useAppSelector} from "@/store";
import {StyleSheet, Switch, View} from "react-native";
import {
    setExecuteVoicePromptsImmediately,
    setExternalLLMEndpoint,
    setExternalLLMModel,
    setExternalLLMToken,
    setLLMMode,
    setLocalModelId
} from "@/store/slice-settings";
import {Picker} from "@react-native-picker/picker";
import Section from "@/components/section";
import {TextInput} from "react-native";
import {supportedLMStudioModels, supportedLocalModels} from "@/lib/llm-tools/types";

export default function SettingsScreen() {
    const settings = useAppSelector((state) => state.settings)
    const dispatch = useAppDispatch();

    return (
        <Screen>

            <Section header={"Settings"}>
                <View style={styles.formRow}>
                    <ThemedText type={'smallBold'}>
                        LLM Mode
                    </ThemedText>
                    <Picker itemStyle={styles.formPickerItemStyle} style={styles.formPicker} selectedValue={settings.llmMode} onValueChange={(value) => dispatch(setLLMMode(value))}>
                        <Picker.Item value={'local'} label={"Local"}/>
                        <Picker.Item value={'external'} label={"Remote"}/>
                    </Picker>
                </View>
                <Section.Separator />
                <View style={styles.formRow}>
                    <ThemedText type={'smallBold'}>
                        Execute voice prompts immediately
                    </ThemedText>
                    <Switch
                        value={settings.executeVoicePromptsImmediately}
                        onValueChange={(value) => {dispatch(setExecuteVoicePromptsImmediately(value))}}/>
                </View>
            </Section>

            <Section header={'Local LLM'}>
                <View style={styles.formRow}>
                    <ThemedText type={'smallBold'}>
                        Model
                    </ThemedText>
                    <Picker itemStyle={styles.formPickerItemStyle} style={styles.formPicker} selectedValue={settings.localModelId} onValueChange={(value) => dispatch(setLocalModelId(value))}>
                        {Object.values(supportedLocalModels).map(model => (
                            <Picker.Item value={model.id} label={model.label}/>
                        ))}
                    </Picker>
                </View>
            </Section>

            <Section header={'Remote LLM'}>
                <View style={styles.formRow}>
                    <ThemedText type={'smallBold'}>
                        Endpoint
                    </ThemedText>
                    <TextInput
                        style={styles.formTextInput}
                        value={settings.externalLLMEndpoint}
                        placeholder={'Endpoint'}
                        onChangeText={(value) => dispatch(setExternalLLMEndpoint(value))} />
                </View>
                <Section.Separator />
                <View style={styles.formRow}>
                    <ThemedText type={'smallBold'}>
                        Token
                    </ThemedText>
                    <TextInput
                        style={styles.formTextInput}
                        value={settings.externalLLMToken}
                        placeholder={'Token'}
                        onChangeText={(value) => dispatch(setExternalLLMToken(value))} />
                </View>
                <Section.Separator />
                <View style={styles.formRow}>
                    <ThemedText type={'smallBold'}>
                        Model
                    </ThemedText>
                    <Picker itemStyle={styles.formPickerItemStyle} style={styles.formPicker} selectedValue={settings.externalLLMModel} onValueChange={(value) => dispatch(setExternalLLMModel(value))}>
                        {Object.values(supportedLMStudioModels).map(model => (
                            <Picker.Item value={model} label={model}/>
                        ))}
                    </Picker>
                </View>
            </Section>

        </Screen>
    )
}


const styles = StyleSheet.create({
    formContainer: {
        flexDirection: "column",
        width: "100%",
    },
    formRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: 50
    },
    formPicker: {
        width: 200,
    },
    formPickerItemStyle: {
        color: 'white',
    },
    formTextInput: {
        color: 'white',
    }
})