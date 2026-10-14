import {ToolDefinition} from "react-native-executorch/llm";
import {ChatCompletionTool} from "openai/resources/chat/completions/completions";
import {RefObject} from "react";
import {CameraRef, MapRef} from "@maplibre/maplibre-react-native";

export enum ZoomToolMode {
    zoomIn = 'zoom in',
    zoomOut = 'zoom out',
    zoomToLevel = 'zoom to level'
}

export const mapToolZoom = (
    mapRef: RefObject<MapRef | null>,
    cameraRef: RefObject<CameraRef | null>
): ToolDefinition & ChatCompletionTool => {
    return {
        type: 'function',
        function: {
            name: 'zoom',
            parameters: {
                type: "object",
                properties: {
                    zoomMode: {
                        type: 'string',
                        enum: Object.values(ZoomToolMode),
                        description: "How to change the zoom: \"zoom in\" to zoom in one level, \"zoom out\" to zoom out one level, or \"zoom to level\" to jump to the exact level given in `level`."
                    },
                    zoomLevel: {
                        type: 'number',
                        description: "The exact zoom level to set. Required when the action is \"set\"; ignored when the action is \"in\" or \"out\".",
                        minValue: 1,
                        maxValue: 18
                    }
                },
                required: ['zoomMode']
            },
            description: 'Changes the map\'s zoom level. Use when the user asks to zoom in, zoom out, get closer, or see a wider area. Provide either a direction ("in" or "out") to change the zoom by one level, or an exact zoom level to jump to. Keeps the current map center. Does not change the map\'s position, markers, or layers.',
        },
        execute: (args: Record<string, unknown>) => {
            async function run() {
                const zoomMode = args['zoomMode'];

                const map = mapRef.current;
                const camera = cameraRef.current;

                if (!map || !camera) {
                    return null
                }

                if (!zoomMode) {
                    return;
                }

                if (zoomMode == ZoomToolMode.zoomToLevel) {
                    let zoomLevel = args['zoomLevel'] as number;
                    if (!zoomLevel) return;
                    camera.zoomTo(zoomLevel)
                    return
                }

                const currentZoomLevel = await map.getZoom()

                // Zoom in
                if (zoomMode == ZoomToolMode.zoomIn) {
                    camera.zoomTo(Math.min(currentZoomLevel + 1, 18))
                    return
                }

                // Zoom out
                if (zoomMode == ZoomToolMode.zoomOut) {
                    camera.zoomTo(Math.max(currentZoomLevel - 1, 0))
                    return
                }
            }

            run().catch(console.error);

            return ''
        }
    }
}