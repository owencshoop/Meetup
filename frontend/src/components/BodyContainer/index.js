import {useState, useEffect} from 'react'
import { useDispatch } from "react-redux";
import EventGroupList from '../EventGroupList'
import { clearGroupState, loadGroups } from '../../store/groups';
import { clearEventState, loadEvents } from '../../store/events';
import { NavLink, useLocation } from 'react-router-dom';
import './BodyContainer.css'

const BodyContainer = () => {
    const {pathname} = useLocation()
    const dispatch = useDispatch()
    const [eventGroup, setEventGroup] = useState(pathname.split('/')[1])
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        dispatch(loadGroups())
        .then(res => dispatch(loadEvents()))
        .then(res => setIsLoaded(true))

        return (
            () => {
                dispatch(clearGroupState())
                dispatch(clearEventState())
                setIsLoaded(false)
            }
        )
    }, [dispatch, eventGroup])

    return (
        <div className="body-div">
            <div className="event-group-selector-container">
                <NavLink to ='/events' onClick={() => setEventGroup('events')} style={{borderBottom:`${eventGroup === 'events' ? '4px solid #008294' : ''}`, marginRight:'10px', textDecoration:'none', color:`${eventGroup === 'events' ? '#008294' : '#757575'}`}}>Events</NavLink>
                <NavLink to='/groups' onClick={() => setEventGroup('groups')} style={{borderBottom:`${eventGroup === 'groups' ? '4px solid #008294' : ''}`, marginRight:'10px', textDecoration:'none', color:`${eventGroup === 'groups' ? '#008294' : '#757575'}`}}>Groups</NavLink>
            </div>
            {isLoaded ? <EventGroupList eventgroup={eventGroup}/> : <div style={{height:'712px'}}></div>}
        </div>
    )
}

export default BodyContainer
