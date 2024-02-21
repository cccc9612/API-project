import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react";
import { getCurrentUserSpotsThunk } from "../../store/spots";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteSpot from "../DeleteSpot/DeleteSpot";
import './CurrentSpot.css'

function CurrentSpots() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const sessionUser = useSelector((state) => state.session.user)
    const spotsObj = useSelector((state) => state.spots)
    const spots = Object.values(spotsObj)

    useEffect(() => {
        if (!sessionUser) navigate('/')
        dispatch(getCurrentUserSpotsThunk())
    }, [dispatch, sessionUser, navigate])

    return (
        <>
            {sessionUser && (
                <div className="manage-spots-section">
                    <div className="manage-spots-container">
                        <h1>Manage Your Spots</h1>
                        <button className='create-new-spot-button' onClick={() => navigate('/spots/new')}>Create a New Spot</button>
                    </div>
                    <div className="spots-container">
                        {spots.map((spot) => (
                            <div key={spot.id}>
                                <div className='spot-tile' onClick={() => navigate(`/spots/${spot.id}`)}>
                                    <img className='spot-image' src={spot.previewImage} alt='preview' />
                                    <div className="text-container">
                                        <div className="spot-left">
                                            <span>{`${spot.city}, ${spot.state}`}</span>
                                            <p className="spot-prices"><span>{`$${Number(spot.price).toFixed(2)}`}</span> night</p>
                                        </div>
                                        <div className="rating-section">
                                            <i className="fas fa-star">{` ${spot.avgRating ? spot.avgRating.toFixed(1) : 'New'}`}</i>
                                        </div>
                                    </div>
                                </div>
                                <div className="manage-buttons">
                                    <button className='update-spot-button' onClick={() => navigate(`/spots/${spot.id}/edit`)}>Update</button>
                                    <OpenModalButton buttonText={"Delete"} modalComponent={<DeleteSpot spotId={spot.id} />} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

export default CurrentSpots;
