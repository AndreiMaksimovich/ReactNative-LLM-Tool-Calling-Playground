import {ToolDefinition} from 'react-native-executorch/llm';
import {ChatCompletionTool} from "openai/resources/chat/completions/completions";
import {LLMModel, models} from "react-native-executorch";
import {gemma4ToolParser, qwenToolParser} from "@/lib/llm-tools/tool-call-parsers";

export const supportedLMStudioModels: string[] = [
    'qwen3.5-0.8b',
    'qwen3-vl-4b-instruct',
    'qwen/qwen3.5-9b',
    'qwen/qwen3.8-27b'
]

export const defaultSupportedLMStudioModel = 'qwen3-vl-4b-instruct'

export enum LocalModelToolParserType {
    Qwen,
    Gemma
}

export interface SupportedLocalModel {
    model: LLMModel
    label: string
    id: string
    toolParser: LocalModelToolParserType
}

export const supportedLocalModels: SupportedLocalModel[] = [
    {
        model: models.llm.GEMMA4_E2B.DEFAULT,
        id: "GEMMA4_E2B.DEFAULT",
        label: "Gemma 4 2B",
        toolParser: LocalModelToolParserType.Gemma
    },

    {
        model: models.llm.QWEN3_0_6B.DEFAULT,
        id: "QWEN3_0_6B.DEFAULT",
        label: "Qwen 3 0.6B",
        toolParser: LocalModelToolParserType.Qwen
    },

    {
        model: models.llm.QWEN3_1_7B.DEFAULT,
        id: "QWEN3_1_7B.DEFAULT",
        label: "Qwen 3 1.7B",
        toolParser: LocalModelToolParserType.Qwen
    }
]

export const defaultSupportedLocalModelId = 'QWEN3_0_6B.DEFAULT'

export function getSupportedLocalModel(id: string) {
    return supportedLocalModels.find((x) => x.id === id)!;
}

export function getLocalModelToolParser(type: LocalModelToolParserType) {
    switch (type) {
        case LocalModelToolParserType.Qwen: return qwenToolParser
        case LocalModelToolParserType.Gemma: return gemma4ToolParser
    }
}

export type ToolArray = Array<ToolDefinition & ChatCompletionTool>
