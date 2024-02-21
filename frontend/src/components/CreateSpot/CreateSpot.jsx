import { useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { createSpotThunk } from "../../store/spots"
import { useNavigate } from 'react-router-dom';
import './CreateSpot.css'

function CreateSpot() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const sessionUser = useSelector((state) => state.session.user)
    const [country, setCountry] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [description, setDescription] = useState('')
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [previewImage, setPreviewImage] = useState('')
    const [image1, setImage1] = useState('')
    const [image2, setImage2] = useState('')
    const [image3, setImage3] = useState('')
    const [image4, setImage4] = useState('')
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

        if (!previewImage) {
            errorsArr.push('Preview image is required')
            validationsObj.previewImage = 'Preview image is required'
        }

        const imageArr = [image1, image2, image3, image4]

        imageArr.forEach((image, index) => {
            if (image && !image.endsWith('.png') && !image.endsWith('.jpg') && !image.endsWith('.jpeg')) {
                errorsArr.push(`Image ${index + 2} URL must end in .png, .jpg, or .jpeg`)
            }
        })

        setErrors(errorsArr)
        setValidations(validationsObj)

    }, [navigate, sessionUser, country, address, city, state, description, name, price, previewImage, image1, image2, image3, image4])

    const handleSubmit = async (e) => {
        e.preventDefault()

        const newSpot = {
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

        const newImages = {
            previewImage,
            image1,
            image2,
            image3,
            image4
        }

        const submit = await dispatch(createSpotThunk(newSpot, newImages))

        navigate(`/spots/${submit.id}`)
    }

    return (
        <>
            {sessionUser && (
                <form onSubmit={handleSubmit} className="form-container">
                    <div className="location-input section-divider">
                        <h1>Create a New Spot</h1>
                        <h2 className="section-header">Where&apos;s your place located?</h2>
                        <p className="section-p">Guests will only get your exact address once they booked a reservation.</p>
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
                                placeholder='Description needs a minimum of 30 characters'
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
                    <div className="photos-input section-divider">
                        <h2 className="create-spot-h2">Liven up your spot with photos</h2>
                        <p className="create-spot-p">Submit a link to at least one photo to publish your spot.</p>
                        <label className="label">
                            <input
                                type='url'
                                value={previewImage}
                                placeholder='Preview Image URL'
                                onChange={(e) => setPreviewImage(e.target.value)}
                                required
                            />
                            {<span className="errors">{errors.filter((error) => error.includes('Preview'))}</span>}
                        </label>
                        <label className="label">
                            <input
                                type='url'
                                value={image1}
                                placeholder='Image URL'
                                onChange={(e) => setImage1(e.target.value)}
                            />
                            {<span className="errors">{errors.find((error) => error.includes('Image 2'))}</span>}
                        </label>
                        <label className="label">
                            <input
                                type='url'
                                value={image2}
                                placeholder='Image URL'
                                onChange={(e) => setImage2(e.target.value)}
                            />
                            {<span className="errors">{errors.find((error) => error.includes('Image 3'))}</span>}
                        </label>
                        <label className="label">
                            <input
                                type='url'
                                value={image3}
                                placeholder='Image URL'
                                onChange={(e) => setImage3(e.target.value)}
                            />
                            {<span className="errors">{errors.find((error) => error.includes('Image 4'))}</span>}
                        </label>
                        <label className="label">
                            <input
                                type='url'
                                value={image4}
                                placeholder='Image URL'
                                onChange={(e) => setImage4(e.target.value)}
                            />
                            {<span className="errors">{errors.find((error) => error.includes('Image 5'))}</span>}
                        </label>
                    </div>
                    <div className="create-spot-button">
                        <button className="create-spot" type="submit" disabled={Object.values(validations).length}>Create Spot</button>
                    </div>
                </form>
            )}
        </>
    )
}

export default CreateSpot;
