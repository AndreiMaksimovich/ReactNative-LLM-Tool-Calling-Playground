import {CameraRef, MapRef} from "@maplibre/maplibre-react-native";
import {RefObject} from "react";
import {POIType} from "@/lib/map/pois";
import {ToolArray} from "@/lib/llm-tools/types";
import {mapToolZoom} from "@/lib/llm-tools/map-tool-zoom";
import {mapToolShowPOIs} from "@/lib/llm-tools/map-tool-show-pois";
import {mapToolReset} from "@/lib/llm-tools/map-tool-reset";

export const getMapTools = (
    mapRef: RefObject<MapRef | null>,
    cameraRef: RefObject<CameraRef | null>,
    setPOITypes: (types: POIType[] | null) => void
): ToolArray => {
    return [
        mapToolZoom(mapRef, cameraRef),
        mapToolShowPOIs(setPOITypes),
        mapToolReset(mapRef, cameraRef),
    ]
}