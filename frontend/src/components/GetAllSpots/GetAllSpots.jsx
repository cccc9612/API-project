import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpotsThunk } from "../../store/spots"
import { useNavigate } from "react-router-dom";
import './GetAllSpots.css'

function AllSpots() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const spotsObj = useSelector((state) => state.spots)
    const spots = Object.values(spotsObj)

    // console.log("log", spotsObj)

    useEffect(() => {
        dispatch(getSpotsThunk())
    }, [dispatch])

    return (
        <section className="all-spots">
            <div className="spots-container">
                {spots.map((spot) => (
                    <div key={spot.id} className='spot-preview' onClick={() => navigate(`/spots/${spot.id}`)}>
                        <div className="tool-tip">
                            <img className='preview-image' src={spot.previewImage} alt='image' />
                            <span className="hover-box">{spot.name}</span>
                        </div>
                        <div className="description-box">
                            <div className="leftside-text">
                                <span>{`${spot.city}, ${spot.state}`}</span>
                                <p className="price-box"><span style={{ fontWeight: 'bold' }}>{`$${Number(spot.price).toFixed(2)}`}</span> night</p>
                            </div>
                            <div className="rightside-box">
                                <i className="fas fa-star">{` ${spot.avgRating ? spot.avgRating.toFixed(1) : 'New'}`}</i>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default AllSpots;
