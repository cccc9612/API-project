import { useDispatch } from "react-redux";
import { deleteSpotThunk } from "../../store/spots";
import { useModal } from "../../context/Modal";
import './DeleteSpot.css'

function DeleteSpot({ spotId }) {
    const dispatch = useDispatch()
    const { closeModal } = useModal()

    const handleDelete = async (e) => {
        e.preventDefault()

        await dispatch(deleteSpotThunk(spotId))
            .then(closeModal)
    }

    return (
        <form className='delete-form' onSubmit={handleDelete}>
            <h2 className="delete-spot-h2">Confirm Delete</h2>
            <p>Are you sure you want to remove this spot from the listings?</p>
            <div className="delete-buttons">
                <button className='yes-button' type="submit">Yes (Delete Spot)</button>
                <button className='no-button' onClick={() => closeModal()}>No (Keep Spot)</button>
            </div>
        </form>
    )
}

export default DeleteSpot;
