import {ToolDefinition} from "react-native-executorch/llm";
import {ChatCompletionTool} from "openai/resources/chat/completions/completions";
import {RefObject} from "react";
import {CameraRef, MapRef} from "@maplibre/maplibre-react-native";
import {DEFAULT_MAP_CAMERA_CENTER_LOCATION, DEFAULT_MAP_CAMERA_ZOOM_LEVEL} from "@/constants/map-defaults";

export const mapToolReset = (
    mapRef: RefObject<MapRef | null>,
    cameraRef: RefObject<CameraRef | null>
): ToolDefinition & ChatCompletionTool => {
    return {
        type: 'function',
        function: {
            name: 'reset',
            parameters: {
                type: "object",
                properties: {},
                required: []
            },
            description: 'Resets the map to its default center position and zoom level. Takes no parameters. Does not affect markers or layers.',
        },
        execute: (args: Record<string, unknown>) => {
            const camera = cameraRef.current
            if (!camera) return ''

            camera.flyTo({
                center: DEFAULT_MAP_CAMERA_CENTER_LOCATION,
                zoom: DEFAULT_MAP_CAMERA_ZOOM_LEVEL
            })

            return ''
        }
    }
}