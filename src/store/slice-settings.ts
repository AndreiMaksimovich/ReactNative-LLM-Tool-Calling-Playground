import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    defaultSupportedLMStudioModel,
    defaultSupportedLocalModelId,
} from "@/lib/llm-tools/types";

export  type LLMMode = 'local' | 'external'

export interface SettingsState {
    llmMode: LLMMode;
    externalLLMEndpoint: string;
    externalLLMToken: string;
    externalLLMModel: string;
    localModelId: string;
    executeVoicePromptsImmediately: boolean;
}

const initialState: SettingsState = {
    llmMode: 'local',
    externalLLMEndpoint: 'http://192.168.0.53:1234',
    externalLLMToken: 'some-token',
    externalLLMModel: defaultSupportedLMStudioModel,
    localModelId: defaultSupportedLocalModelId,
    executeVoicePromptsImmediately: true
};

const slice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setLLMMode(state, action: PayloadAction<LLMMode>) {
            state.llmMode = action.payload;
        },
        setExternalLLMEndpoint(state, action: PayloadAction<string>) {
            state.externalLLMEndpoint = action.payload;
        },
        setExternalLLMToken(state, action: PayloadAction<string>) {
            state.externalLLMToken = action.payload;
        },
        setExternalLLMModel(state, action: PayloadAction<string>) {
            state.externalLLMModel = action.payload;
        },
        setLocalModelId(state, action: PayloadAction<string>) {
            state.localModelId = action.payload;
        },
        setExecuteVoicePromptsImmediately(state, action: PayloadAction<boolean>) {
            state.executeVoicePromptsImmediately = action.payload;
        }
    },
});

export const {
    setLLMMode,
    setExternalLLMEndpoint,
    setExternalLLMToken,
    setExternalLLMModel,
    setLocalModelId,
    setExecuteVoicePromptsImmediately
} = slice.actions;

export const reducerSettings = slice.reducer;