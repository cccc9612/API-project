import { useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { updateSpotThunk } from "../../store/spots"
import { useNavigate, useParams } from 'react-router-dom';

function UpdateSpot() {
    const { spotId } = useParams()
    const spot = useSelector((state) => state.spots[spotId])
    const sessionUser = useSelector((state) => state.session.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [country, setCountry] = useState(spot?.country)
    const [address, setAddress] = useState(spot?.address)
    const [city, setCity] = useState(spot?.city)
    const [state, setState] = useState(spot?.state)
    const [description, setDescription] = useState(spot?.description)
    const [name, setName] = useState(spot?.name)
    const [price, setPrice] = useState(spot?.price)
    const [errors, setErrors] = useState([])
    const [validations, setValidations] = useState({})

    useEffect(() => {
        if (!sessionUser) navigate('/')
        const errorsArr = []
        const validationsObj = {}

        if (!country) {
            errorsArr.push('Country is required')
            validationsObj.country = 'Country is required'
        }

        if (!address) {
            errorsArr.push('Address is required')
            validationsObj.address = 'Address is required'
        }

        if (!city) {
            errorsArr.push('City is required')
            validationsObj.city = 'City is required'
        }

        if (!state) {
            errorsArr.push('State is required')
            validationsObj.state = 'State is required'
        }

        if (String(description).length < 30) {
            errorsArr.push('Description needs a minimum of 30 characters')
            validationsObj.description = 'Description needs a minimum of 30 characters'
        }

        if (!name) {
            errorsArr.push('Name is required')
            validationsObj.name = 'Name is required'
        }

        if (!Number(price)) {
            errorsArr.push('Price is required')
            validationsObj.price = 'Price is required'
        }

        setErrors(errorsArr)
        setValidations(validationsObj)

    }, [navigate, sessionUser, country, address, city, state, description, name, price])

    const handleSubmit = async (e) => {
        e.preventDefault()

        const updatedSpot = {
            country,
            address,
            city,
            state,
            description,
            name,
            price,
            lat: 1,
            lng: 1
        }

        const submit = await dispatch(updateSpotThunk(updatedSpot, spotId))

        navigate(`/spots/${submit.id}`)
    }

    return (
        <>
            {sessionUser && (
                <form onSubmit={handleSubmit} className="form-container">
                    <div className="location-input section-divider">
                        <h1>Update Your Spot</h1>
                        <h2 className="create-spot-h2">Where&apos;s your place located?</h2>
                        <p className="create-spot-p">Guests will only get your exact address once they booked a reservation.</p>
                        <label className="label">
                            {<span>Country <span className="errors">{errors.filter((error) => error.includes('Country'))}</span></span>}
                            <input
                                type='text'
                                value={country}
                                placeholder='Country'
                                onChange={(e) => setCountry(e.target.value)}
                                required
                            />
                        </label>
                        <label className="label">
                            {<span>Street Address <span className="errors">{errors.filter((error) => error.includes('Address'))}</span></span>}
                            <input
                                type='text'
                                value={address}
                                placeholder='Address'
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </label>
                        <div className="city-state">
                            <label className="city-header">
                                {<span>City <span className="errors">{errors.filter((error) => error.includes('City'))}</span></span>}
                                <input
                                    className="city-input"
                                    type='text'
                                    value={city}
                                    placeholder='City'
                                    onChange={(e) => setCity(e.target.value)}
                                    required
                                />
                            </label>
                            <span className="comma">, </span>
                            <label className="state-header">
                                {<span>State <span className="errors">{errors.filter((error) => error.includes('State'))}</span></span>}
                                <input
                                    type='text'
                                    value={state}
                                    placeholder='STATE'
                                    onChange={(e) => setState(e.target.value)}
                                    required
                                />
                            </label>
                        </div>
                    </div>
                    <div className="description-input section-divider">
                        <h2 className="create-spot-h2">Describe your place to guests</h2>
                        <p className="create-spot-p">Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
                        <label className="label">
                            <textarea
                                className="text-box"
                                type='text'
                                value={description}
                                placeholder='Please write at least 30 characters'
                                onChange={(e) => setDescription(e.target.value)}
                                minLength={30}
                            />
                            {<span className="errors">{errors.filter((error) => error.includes('Description'))}</span>}
                        </label>
                    </div>
                    <div className="title-input section-divider">
                        <h2 className="create-spot-h2">Create a title for your spot</h2>
                        <p className="create-spot-p">Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
                        <label className="label">
                            <input
                                type='text'
                                value={name}
                                placeholder='Name of your spot'
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            {<span className="errors">{errors.filter((error) => error.includes('Name'))}</span>}
                        </label>
                    </div>
                    <div className="price-input section-divider">
                        <h2 className="create-spot-h2">Set a base price for your spot</h2>
                        <p className="create-spot-p">Competitive pricing can help your listing stand out and rank higher in search results.</p>
                        <div className="price-input-detail">
                            <span className="dollar-sign">$</span>
                            <label className="label">
                                <input
                                    className="price-section"
                                    type='number'
                                    value={price}
                                    placeholder='Price per night (USD)'
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
                                {<span className="errors">{errors.filter((error) => error.includes('Price'))}</span>}
                            </label>
                        </div>
                    </div>
                    <div className="create-spot-button">
                        <button className="create-spot" type="submit" disabled={Object.values(validations).length}>Update Your Spot</button>
                    </div>
                </form>
            )}
        </>
    )
}

export default UpdateSpot;
