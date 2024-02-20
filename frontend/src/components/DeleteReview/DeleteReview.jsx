import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteReviewThunk } from "../../store/reviews";

function DeleteReview({ reviewId, spotId }) {
    const dispatch = useDispatch()
    const { closeModal } = useModal()

    const handleDelete = async (e) => {
        e.preventDefault()

        await dispatch(deleteReviewThunk(reviewId, spotId))
            .then(closeModal)
    }

    return (
        <form className='delete-form' onSubmit={handleDelete}>
            <h2 className="delete-spot-h2">Confirm Delete</h2>
            <p>Are you sure you want to delete this review?</p>
            <div className="delete-buttons">
                <button className='yes-button' type="submit">Yes (Delete Review)</button>
                <button className='no-button' onClick={() => closeModal()}>No (Keep Review)</button>
            </div>
        </form>
    )
}

export default DeleteReview;
