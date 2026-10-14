import {POIType} from "@/lib/map/pois";
import {ToolDefinition} from "react-native-executorch/llm";
import {ChatCompletionTool} from "openai/resources/chat/completions/completions";

export const mapToolShowPOIs = (
    setPOITypes: (types: POIType[] | null) => void
): ToolDefinition & ChatCompletionTool => {
    return {
        type: 'function',
        function: {
            name: 'showPOIs',
            parameters: {
                type: "object",
                properties: {
                    types: {
                        type: 'array',
                        enum: Object.values(POIType),
                        description: "The types of points of interest (POIs) to show on the map, such as \"restaurant\", \"museum\", \"park\", etc. Only these types are displayed."
                    },
                },
                required: ['types']
            },
            description: 'Shows points of interest (POIs) on the map, limited to the selected types (for example restaurants, museums, or parks). Use when the user asks to see, display, or highlight places of a certain kind on the map. Takes a list of POI types; only those types are shown. Does not move or zoom the map.',
        },
        execute: (args) => {
            const types = args['types'] as string[];
            // console.log(types);
            if (!types || types.length < 1) {
                setPOITypes(null);
                return '';
            }

            let finalTypes: POIType[] = [];

            try {
                for (const [_, type] of types.entries()) {
                    const poiType = POIType[type as keyof typeof POIType]
                    if (poiType) {
                        finalTypes.push(poiType)
                    }
                }

                if (finalTypes.length > 0) {
                    setPOITypes(finalTypes);
                } else {
                    setPOITypes(null)
                }
            } catch (error) {
                console.error(error);
            }

            return ''
        }
    }
}