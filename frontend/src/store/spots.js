import { csrfFetch } from "./csrf";

// action types
const GET_SPOTS = 'spots/getSpots';
const GET_CURRENT_USER_SPOTS = 'spots/getCurrentUserSpots';
const GET_SPOT_BY_ID = 'spots/getSpotById';
const CREATE_SPOT = 'spots/createSpot';
const UPDATE_SPOT = 'spots/updateSpot';
const DELETE_SPOT = 'spots/deleteSpot';

// action creators
const getSpots = (spots) => {
    return {
        type: GET_SPOTS,
        spots
    }
}

const getCurrentUserSpots = (spots) => {
    return {
        type: GET_CURRENT_USER_SPOTS,
        spots
    }
}

const getSpotById = (spot) => {
    return {
        type: GET_SPOT_BY_ID,
        spot
    }
}

const createSpot = (spot) => {
    return {
        type: CREATE_SPOT,
        spot
    }
}

const updateSpot = (spot) => {
    return {
        type: UPDATE_SPOT,
        spot
    }
}

const deleteSpot = (spotId) => {
    return {
        type: DELETE_SPOT,
        spotId
    }
}

// thunk action creators
export const getSpotsThunk = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(getSpots(data))
        return data
    }
}

export const getCurrentUserSpotsThunk = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots/current', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(getCurrentUserSpots(data))
        return data
    }
}

export const getSpotByIdThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(getSpotById(data))
        return data
    }
}

export const createSpotThunk = (spot, images) => async (dispatch) => {
    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spot)
    })

    if (res.ok) {
        const data = await res.json()

        const resPreviewImage = await csrfFetch(`/api/spots/${data.id}/images`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url: images.previewImage,
                preview: true
            })
        })

        if (resPreviewImage.ok) {
            const previewImageData = await resPreviewImage.json()
            data.previewImage = previewImageData.url
        }

        const imageKeys = ['image1', 'image2', 'image3', 'image4']
        for (const key of imageKeys) {
            const imageUrl = images[key]

            if (imageUrl) {
                const resImage = await csrfFetch(`/api/spots/${data.id}/images`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        url: imageUrl,
                        preview: true
                    })
                })

                if (resImage.ok) {
                    const imageData = await resImage.json()
                    data[key] = imageData.url
                }
            }
        }

        dispatch(createSpot(data))
        return data
    }
}

export const updateSpotThunk = (updatedSpot, spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSpot)
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(updateSpot(data))
        return data
    }
}

export const deleteSpotThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })

    if (res.ok) {
        dispatch(deleteSpot(spotId))
    }
}

// reducer
const spotsReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_SPOTS: {
            const newState = {}
            action.spots.Spots.forEach((spot) => (
                newState[spot.id] = spot
            ))
            return newState
        }
        case GET_CURRENT_USER_SPOTS: {
            const newState = {}
            action.spots.Spots.forEach((spot) => (
                newState[spot.id] = spot
            ))
            return newState
        }
        case GET_SPOT_BY_ID: {
            const newState = {
                [action.spot.id]: action.spot
            }
            return newState
        }
        case CREATE_SPOT:
            return { ...state, [action.spot.id]: action.spot }
        case UPDATE_SPOT:
            return { ...state, [action.spot.id]: action.spot }
        case DELETE_SPOT: {
            const newState = { ...state }
            delete newState[action.spotId]
            return newState
        }
        default:
            return state
    }
}

export default spotsReducer;
