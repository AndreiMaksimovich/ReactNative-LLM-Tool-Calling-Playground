import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type InitializationStep = 'not-initialized' | 'initialized' | 'in-progress' | 'failed';

export interface InitializationState {
    step: InitializationStep;
    error?: Error | string;
}

const initialState: InitializationState = {
    step: 'not-initialized',
}

export const sliceInitialization = createSlice({
    name: 'initialization',
    initialState: initialState,
    reducers: {
        setInitializationStep(state, action: PayloadAction<InitializationStep>) {
            state.step = action.payload;
        },
        setInitializationError(state, action: PayloadAction<Error | string>) {
            state.step = 'failed'
            state.error = action.payload;
        }
    }
})

export const {setInitializationStep, setInitializationError} = sliceInitialization.actions

export const reducerInitialization = sliceInitialization.reducer