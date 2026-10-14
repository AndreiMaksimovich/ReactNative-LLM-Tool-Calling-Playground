import { configureStore } from '@reduxjs/toolkit';
import { reducerSettings } from './slice-settings';
import {reducerInitialization} from "@/store/slice-initialization";

export const store = configureStore({
    reducer: {
        settings: reducerSettings,
        initialization: reducerInitialization
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;