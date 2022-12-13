import {useState, useEffect} from 'react'
import { useDispatch } from "react-redux";
import EventGroupList from '../EventGroupList'
import { loadGroups } from '../../store/groups';
import { loadEvents } from '../../store/events';
import { NavLink, useLocation } from 'react-router-dom';
import './BodyContainer.css'

const BodyContainer = () => {
    const {pathname} = useLocation()
    const dispatch = useDispatch()
    const [eventGroup, setEventGroup] = useState(pathname.split('/')[1])

    useEffect(() => {
        dispatch(loadGroups())
        dispatch(loadEvents())
    }, [dispatch, eventGroup])

    return (
        <div className="body-div">
            <div className="event-group-selector-container">
                <NavLink to ='/events' onClick={() => setEventGroup('events')} style={{borderBottom:`${eventGroup === 'events' ? '5px solid blue' : ''}`, marginRight:'10px'}}>Events</NavLink>
                <NavLink to='/groups' onClick={() => setEventGroup('groups')} style={{borderBottom:`${eventGroup === 'groups' ? '5px solid blue' : ''}`, marginRight:'10px', }}>Groups</NavLink>
            </div>
            <div className="event-group-list-container" style={{border: '5px solid green', width: '100%', boxSizing: 'border-box'}}>
                <EventGroupList eventgroup={eventGroup} />
            </div>
        </div>
    )
}

export default BodyContainer
