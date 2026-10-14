import {Camera, CameraRef, Map, MapRef, Marker} from "@maplibre/maplibre-react-native";
import {getMapStyleJson} from "@/lib/map/map-style";
import {useMemo, useRef, useState} from "react";
import {Button, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import SpeechToTextButton from "@/components/speech-to-text-button";
import {getMapTools} from "@/lib/llm-tools/map-tools";
import {OpenAI} from "openai";
import {ChatCompletionMessageFunctionToolCall} from "openai/resources/chat/completions/completions";
import {useAppSelector} from "@/store";
import {ThemedText} from "@/components/themed-text";
import Section from "@/components/section";
import {demoPOIs, POI, POIType} from "@/lib/map/pois";
import {useLocalLLM} from "@/hooks/use-local-llm";
import {ChatMessage} from "react-native-executorch/llm";
import {DEFAULT_MAP_CAMERA_CENTER_LOCATION, DEFAULT_MAP_CAMERA_ZOOM_LEVEL} from "@/constants/map-defaults";

const LOG_TAG = 'MapScreen'

const initialMessages: ChatMessage[] = [
    {
        role: "system",
        content: "Your only purpose is to run available tools based on user requests. Ignore previous requests and messages, use only information from the current prompt"
    }
]

export default function MapScreen() {
    const [llmResponse, setLLMResponse] = useState<string>('');
    const [isLLMRunning, setIsLLMRunning] = useState<boolean>(false);
    const [llmPrompt, setLLMPrompt] = useState('');

    const settings = useAppSelector(state => state.settings)

    const mapStyle = useMemo(() => getMapStyleJson(), []);
    const mapRef = useRef<MapRef>(null)
    const mapCameraRef = useRef<CameraRef>(null)

    const [poiTypes, setPoiTypes] = useState<Array<POIType> | null>(null);
    const POIs: POI[] = useMemo(() => {
        if (poiTypes == null || poiTypes.length == 0) return [...demoPOIs];
        return demoPOIs.filter(poi => poiTypes.includes(poi.type))
    }, [poiTypes])

    // ------------------------------------------------------------

    const toolDefinitions = getMapTools(mapRef, mapCameraRef, setPoiTypes)

    const localLLM = useLocalLLM(
        initialMessages,
        toolDefinitions
    )

    const openAIClient = useMemo<OpenAI>(() => {
        return new OpenAI({
            baseURL: `${settings.externalLLMEndpoint}/v1`,
            apiKey: settings.externalLLMToken,
        })
    }, [settings.externalLLMEndpoint, settings.externalLLMToken])

    const handlePrompt = async (prompt: string) => {
        if (isLLMRunning) {
            console.warn("HandlePrompt canceled isRunning == true")
            return
        }

        console.log("handlePrompt: ", prompt);

        prompt = prompt.trim()

        if (prompt === '') return

        setLLMResponse('')

        // Local LLM
        if (settings.llmMode == 'local') {
            prompt += ' /no_think'

            if (!localLLM.isReady) {
                console.warn("HandlePrompt canceled local llm-tools is not ready")
                return
            }

            if (!localLLM.sendMessage) {
                console.warn("HandlePrompt canceled sendMessage == NULL")
                return
            }

            let result = ''
            try {
                setIsLLMRunning(true)
                const finalResult = await localLLM.sendMessage(
                    prompt,
                    (token) => {
                        result += token
                        setLLMResponse(result);
                    }
                );
                setIsLLMRunning(false)
                return finalResult
            } catch (error) {
                setIsLLMRunning(false);
                console.error(error)
            }
            return
        }

        // External LLM
        try {
            setIsLLMRunning(true)
            console.log('Requesting External LLM', `model: ${settings.externalLLMModel}\nprompt: ${prompt}`)
            // @ts-ignore
            const response = await openAIClient.chat.completions.create({
                model: settings.externalLLMModel,
                messages: [
                    ...initialMessages,
                    {
                        role: 'user',
                        content: prompt,
                    }
                ],
                tools: toolDefinitions,
                tool_choice: 'auto'
            });

            setIsLLMRunning(false)
            const choice = response.choices[0]
            const result = JSON.stringify(choice, null, 2)
            setLLMResponse(result)
            const message = choice.message;
            if (message.tool_calls) {
                const toolCall = message.tool_calls[0] as ChatCompletionMessageFunctionToolCall;
                const args = JSON.parse(toolCall.function.arguments);
                const fun = toolDefinitions.find(tool => tool.function.name == toolCall.function.name)
                console.log(`Model requested tool: ${toolCall.function.name}`, args);
                if (fun) {
                    console.log(' >> Execute tool')
                    fun.execute(args)
                }
            }

            return result
        } catch (e) {
            setIsLLMRunning(false)
            console.error(e);
        }
    }

    const isReady = settings.llmMode == 'local' ? localLLM.isReady : true
    const isDownloading = settings.llmMode == 'local' && !localLLM.isReady

    // ------------------------------------------------------------

    return (
        <SafeAreaProvider>
            <SafeAreaView edges={["top", "bottom"]}>
                <View style={[styles.zStack]}>
                    <View style={[styles.layer]}>
                        <Map mapStyle={mapStyle} ref={mapRef}>
                            <Camera
                                ref={mapCameraRef}
                                center={DEFAULT_MAP_CAMERA_CENTER_LOCATION}
                                zoom={DEFAULT_MAP_CAMERA_ZOOM_LEVEL}/>

                            {POIs.map((poi) => (
                                <Marker lngLat={poi.location} id={poi.id} key={poi.id}>
                                    <Text style={{fontSize: 30}}> 📍</Text>
                                </Marker>
                            ))}

                        </Map>
                    </View>
                    <View style={[styles.layer]}>

                        {isDownloading &&
                            <ThemedText
                                type={'default'}
                                style={{color: 'black', textAlign: 'center'}}>
                                Downloading local model: {localLLM.downloadProgress.toFixed(2)}
                            </ThemedText>
                        }

                        {isReady &&
                            <View style={{width: '100%', height: '100%', justifyContent: 'space-between'}}>
                                <View>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginHorizontal: 15,
                                        gap: 5,
                                        paddingTop: 5
                                    }}>
                                        <TextInput
                                            style={{flexGrow: 1, minHeight: 40, padding: 5, backgroundColor: 'white'}}
                                            value={llmPrompt}
                                            onChangeText={setLLMPrompt}/>
                                        <Button
                                            disabled={settings.llmMode == 'external' && isLLMRunning}
                                            title={settings.llmMode == 'local' && isLLMRunning ? 'Stop' : ' Go '}
                                            onPress={() => {
                                                if (settings.llmMode == 'local' && isLLMRunning) {
                                                    localLLM.stop?.()
                                                } else {
                                                    handlePrompt(llmPrompt).catch(console.error)
                                                }
                                            }}
                                        />
                                    </View>
                                    {llmResponse !== '' &&
                                        <Section style={{maxHeight: 150}}>
                                            <ScrollView>
                                                <ThemedText type={'code'}>{llmResponse}</ThemedText>
                                            </ScrollView>
                                        </Section>
                                    }
                                </View>
                                <View style={{marginBottom: 40, marginHorizontal: 10}}>
                                    <SpeechToTextButton
                                        onResult={(isFinal, result) => {
                                            setLLMPrompt(result)
                                            if (isFinal && settings.executeVoicePromptsImmediately) {
                                                handlePrompt(result).catch(console.error)
                                            }
                                        }}
                                        onError={(err) => {
                                            console.log(err)
                                        }}
                                        onEnd={() => {
                                        }}
                                        onStart={() => {
                                            setLLMPrompt('')
                                        }}
                                    />
                                </View>
                            </View>
                        }
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    zStack: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    layer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});