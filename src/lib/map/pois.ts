import {LngLat} from "@maplibre/maplibre-react-native";

export interface POI {
    id: string;
    location: LngLat;
    name: string;
    type: POIType
}

export enum POIType {
    church = 'church',
    bar = "bar",
    museum = "museum",
    mural = "mural",
    artGallery = "art gallery",
    mosque = "mosque",
    synagogue = "synagogue",
    park = "park",
    forest = "forest",
    natureReserve = "nature reserve",
    cafe = "cafe",
    restaurant = "restaurant",
    coffeeShop = "coffee shop"
}

export const demoPOIs: POI[] = [
    {
        id: "Bagrati Cathedral",
        location: [42.70423514587815, 42.27728227913505],
        type: POIType.church,
        name: 'Bagrati Cathedral'
    },

    {
        id: 'Kutaisi State Historical Museum',
        location: [42.70409697240615, 42.268709578376104],
        type: POIType.museum,
        name: 'Kutaisi State Historical Museum'
    },

    {
        id: 'Bebia (Grandmother) Mural',
        location: [42.70408741395147, 42.27338965266067],
        type: POIType.mural,
        name: 'Bebia (Grandmother) Mural'
    },

    {
        id: 'Kutaisi Synagogue',
        location: [42.70910128142895, 42.274203367278695],
        type: POIType.synagogue,
        name: 'Kutaisi Synagogue'
    },

    {
        id: 'Kutaisi Centeral Park',
        location: [42.703823974502924, 42.271235537412664],
        type: POIType.park,
        name: 'Kutaisi Centeral Park'
    },
]