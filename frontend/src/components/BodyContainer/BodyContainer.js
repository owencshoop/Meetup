import {useState} from 'react'

const BodyContainer = () => {
    const [eventGroup, setEventGroup] = useState('events')
    return (
        <div className="body-div" style={{border:'5px solid red', display: 'block', margin: 'auto', maxWidth: '600px', boxSizing: 'border-box'}}>
            <div className="event-group-selector-container" style={{border: '5px solid orange', width: '100%', boxSizing: 'border-box', display: 'flex', justifyContent: 'left'}}>
                <button onClick={() => setEventGroup('events')}>Events</button>
                <button onClick={() => setEventGroup('groups')}>Groups</button>
            </div>
            <div className="event-group-list-container" style={{border: '5px solid green', width: '100%', boxSizing: 'border-box'}}>List events/groups</div>
        </div>
    )
}

export default BodyContainer
