import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpotByIdThunk } from "../../store/spots";
import { useParams } from "react-router";
import SpotReviews from "../SpotReviews/SpotReviews"
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import CreateReview from "../CreateReview/CreateReview";
import './SpotDetails.css'

function SpotDetails() {
    const dispatch = useDispatch()
    const { spotId } = useParams()
    const spot = useSelector((state) => state.spots[spotId])
    const sessionUser = useSelector((state) => state.session.user)
    const reviewsObj = useSelector((state) => state.reviews)
    const reviews = Object.values(reviewsObj)

    useEffect(() => {
        dispatch(getSpotByIdThunk(spotId))
    }, [dispatch, spotId])

    if (!spot || !reviews) return null

    const reserve = (e) => {
        e.preventDefault()
        window.alert('Feature Coming Soon...')
    }

    function ratings() {
        if (spot.avgRating && spot.numReviews === 1) {
            return `${spot.avgRating.toFixed(1)} · ${spot.numReviews} review`
        } else if (spot.avgRating && spot.numReviews > 1) {
            return `${spot.avgRating.toFixed(1)} · ${spot.numReviews} reviews`
        } else {
            return 'New'
        }
    }

    const hasUserReviewed = reviews.some((review) => review.User?.id === sessionUser?.id)

    return (
        <section className="spot-details-section">
            <h1>{spot.name}</h1>
            <span className="spot-location">{spot.city}, {spot.state}, {spot.country}</span>
            <div className="image-container">
                <div className="large-image-section">
                    <img className="large-image" src={spot.SpotImages?.[0]?.url} alt={spot.SpotImages ? spot.SpotImages[0]?.url : null} />
                </div>
                <div className="small-images-section">
                    <img className="small-images" src={spot.SpotImages?.[1]?.url} alt={spot.SpotImages ? spot.SpotImages[1]?.url : null} />
                    <img className="small-images" src={spot.SpotImages?.[2]?.url} alt={spot.SpotImages ? spot.SpotImages[2]?.url : null} />
                    <img className="small-images" src={spot.SpotImages?.[3]?.url} alt={spot.SpotImages ? spot.SpotImages[3]?.url : null} />
                    <img className="small-images" src={spot.SpotImages?.[4]?.url} alt={spot.SpotImages ? spot.SpotImages[4]?.url : null} />
                </div>
            </div>
            <div className="middle-section">
                <div className="description">
                    <h1 className="host-name">Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}</h1>
                    <p>{spot.description}</p>
                </div>
                <div className="reserve-box">
                    <div className="reserve-box-info">
                        <div className="reserve-box-left">
                            <p className="spot-price"><span className='spot-price-number' style={{ fontWeight: 'bold', fontSize: 'x-large' }}>{`$${Number(spot.price).toFixed(2)}`}</span>night</p>
                        </div>
                        <div className="reserve-box-right">
                            <i className="fas fa-star rating"></i>
                            <span className="reserve-box-rating">{` ${ratings()}`}</span>
                        </div>
                    </div>
                    <button onClick={reserve} className="reserve-button">Reserve</button>
                </div>
            </div>
            <div className="review-section">
                <h1 className="rating-review-h1"><i className="fas fa-star rating">{` ${ratings()}`}</i></h1>
                {sessionUser && sessionUser?.id !== spot?.Owner?.id && !hasUserReviewed && (
                    <OpenModalButton buttonText={'Post Your Review'} modalComponent={<CreateReview spotId={spot.id} />} />
                )}
                {sessionUser && sessionUser?.id !== spot?.Owner?.id && reviews.length === 0 && (
                    <p>Be the first to post a review!</p>
                )}
                <SpotReviews />
            </div>
        </section>
    )
}

export default SpotDetails;
