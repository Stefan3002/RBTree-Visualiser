import './blur.css'
import React, {MouseEventHandler} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getAboutOpened} from "../../utils/store/about/aboutSelectors";
import {setAboutOpened} from "../../utils/store/about/aboutActions";

const Blur: React.FC = () => {

    const dispatch = useDispatch()
    const aboutOpened = useSelector(getAboutOpened)

    const openAbout = (): void => {
        aboutOpened ? dispatch(setAboutOpened(false)) : dispatch(setAboutOpened(true))
    }

    const closeSection = (): void => {
        openAbout()
    }

    return (
        <div className='blur-container' onClick={closeSection} />
    )
}
export default Blur