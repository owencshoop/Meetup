import {useState, useEffect} from 'react'
import { useDispatch } from "react-redux";
import EventGroupList from '../EventGroupList'
import { loadGroups } from '../../store/groups';
import { loadEvents } from '../../store/events';
import { NavLink, useLocation } from 'react-router-dom';

const BodyContainer = () => {
    const {pathname} = useLocation()
    const dispatch = useDispatch()
    const [eventGroup, setEventGroup] = useState(pathname.split('/')[1])

    useEffect(() => {
        dispatch(loadGroups())
        dispatch(loadEvents())
    }, [dispatch, eventGroup])

    return (
        <div className="body-div" style={{border:'5px solid red', display: 'block', margin: '5px auto', maxWidth: '600px', boxSizing: 'border-box'}}>
            <div className="event-group-selector-container" style={{border: '5px solid orange', width: '100%', boxSizing: 'border-box', display: 'flex', justifyContent: 'left', margin:'10px auto'}}>
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
