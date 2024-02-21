import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useState } from 'react'
import { createReviewThunk } from "../../store/reviews";
import { useModal } from "../../context/Modal";
import './CreateReview.css'

function CreateReview({ spotId }) {
    const dispatch = useDispatch()
    const { closeModal } = useModal()
    const [review, setReview] = useState('')
    const [stars, setStars] = useState(0)
    const [hover, setHover] = useState(0)
    const [validations, setValidations] = useState({})
    const sessionUser = useSelector((state) => state.session.user)

    useEffect(() => {
        const validationsObj = {}

        if (String(review).length < 10) {
            validationsObj.review = 'Review needs a minimum of 10 characters'
        }

        if (!stars) {
            validationsObj.stars = 'Star rating must be filled'
        }

        setValidations(validationsObj)
    }, [review, stars])

    const handleStarClick = (rating) => {
        setStars(rating)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const newReview = {
            review,
            stars
        }

        await dispatch(createReviewThunk(newReview, spotId, sessionUser))
            .then(closeModal)

    }

    return (
        <form className='review-form' onSubmit={handleSubmit}>
            <h2 className="review-header">How was your stay?</h2>
            <textarea
                className="text-box"
                type='text'
                value={review}
                placeholder='Leave your review here...'
                onChange={(e) => setReview(e.target.value)}
                minLength={10}
            />
            <div className="star-rating-section">
                {[...Array(5)].map((stars, index) => {
                    const rating = index + 1
                    return (
                        <label key={rating}>
                            <input
                                type='radio'
                                value={rating}
                                onClick={() => handleStarClick(rating)}
                            />
                            <i
                                className="fas fa-star"
                                style={{
                                    color: rating <= (hover || stars) ? 'gold' : 'grey',
                                }}
                                onMouseEnter={() => setHover(rating)}
                                onMouseLeave={() => setHover(0)}
                            ></i>
                        </label>
                    )
                })} Stars
            </div>
            <button className="submit-button" type="submit" disabled={Object.values(validations).length}>Submit Your Review</button>
        </form>
    )
}

export default CreateReview;
