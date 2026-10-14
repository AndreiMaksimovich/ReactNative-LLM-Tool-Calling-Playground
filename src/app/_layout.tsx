import {DarkTheme, ThemeProvider} from 'expo-router';
import {View} from 'react-native';
import AppTabs from '@/components/app-tabs';
import {Provider} from 'react-redux';
import {store, useAppDispatch, useAppSelector} from '@/store'
import {ThemedText} from "@/components/themed-text";
import {useEffect} from "react";
import {setInitializationError, setInitializationStep} from "@/store/slice-initialization";
import {prepareMapResources} from "@/lib/map/map-style";

export default function AppxLayout() {
    return (
        <Provider store={store}>
            <ThemeProvider value={DarkTheme}>
                <RootView />
            </ThemeProvider>
        </Provider>
    );
}

function RootView() {
    const initializationStep = useAppSelector(state => state.initialization).step

    return (
        <>
            {/* Progress */}
            {(initializationStep == 'not-initialized' || initializationStep == 'in-progress') && (
                <InitializationScreen />
            )}

            {/* Initialization failed */}
            {initializationStep == 'failed' && (
                <InitializationErrorScreen />
            )}

            {/* App */}
            {initializationStep == 'initialized' && (
                <AppTabs/>
            )}
        </>
    )
}

function InitializationScreen() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setInitializationStep('in-progress'))
        prepareMapResources()
            .then(() => {
                dispatch(setInitializationStep('initialized'))
            })
            .catch((error) => {
                dispatch(setInitializationError(error));
            })
    }, [])

    return (
        <View style={{width: '100%', height: '100%', alignContent: 'center', alignItems: 'center', justifyContent: 'space-around'}}>
            <ThemedText type={'smallBold'}>Loading ...</ThemedText>
        </View>
    )
}

function InitializationErrorScreen() {
    const error = useAppSelector(state => state.initialization).error
    const errorMessage = error ? (typeof error == 'string' ? error : error.message) : "Something went wrong"

    return (
        <View>
            <ThemedText type={'subtitle'}>Initialization failed</ThemedText>
            <ThemedText type={'error'}>{errorMessage}</ThemedText>
        </View>
    )
}