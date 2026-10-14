import {
    createLLMChatSession,
    LLMChatSessionOptions, models, ResourceOptions
} from "react-native-executorch";
import {useResourceDownload} from "react-native-executorch";
import {useModel} from "react-native-executorch";
import {useAppSelector} from "@/store";
import {getLocalModelToolParser, getSupportedLocalModel, ToolArray} from "@/lib/llm-tools/types";
import type {ChatMessage} from "react-native-executorch/llm";
import {useMemo} from "react";

export function useLocalLLM(
    initialMessages: ChatMessage[],
    tools?: ToolArray
) {

    const settings = useAppSelector(state => state.settings)
    const localModel = getSupportedLocalModel(settings.localModelId)

    const options: LLMChatSessionOptions & ResourceOptions = {
        initialMessages: initialMessages,
        toolOpts: !tools ? undefined : {
            maxToolTurns: 1,
            tools: tools,
            parseToolCalls: getLocalModelToolParser(localModel.toolParser)
        },
        generationConfig: {
            temperature: 0,
            maxNewTokens: 512,
        }
    }

    const { resource, downloadProgress, downloadError } = useResourceDownload(localModel.model, options);
    const { model: session, error } = useModel((res) => createLLMChatSession(res, options), resource);

    return {
        isReady: !!session,
        error: downloadError || error,
        downloadProgress,
        resource,
        sendMessage: session?.sendMessage,
        getHistory: session?.getHistory,
        getKVCacheState: session?.getKVCacheState,
        stop: session?.stop,
    };
}