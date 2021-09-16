import { useState, useEffect } from "react";

const Table = () => {

    const [peopleList, setpeopleList] = useState([]) //* <- here our people arr after response
    const [displayedPeopleList, setdisplayedPeopleList] = useState([]) //* <- here visible people list
    const [selectedPerson, setselectedPerson] = useState(false) //* <- here visible info about person after click
    const [inputSearch, setinputSearch] = useState('') //* <- here TwoSideBinding for search input 

    useEffect(() => {
       response()
    }, [])

    const response = () => {
        fetch('https://itrex-react-lab-files.s3.eu-central-1.amazonaws.com/react-test-api.json')
            .then(response => response.json().then(data => setpeopleList(data)))
    }

    const showPerson = (person) => {
        setselectedPerson(person)
    }

    return (
        console.log('render'),
        <div className="table-container">
            <h1 className='tible-title'>ITRex test project</h1>
            <div className='table'>
                <div className="table__actions">
                    <input className='table__input-search' type="text" value = {inputSearch}
                        onChange = {(event) => setinputSearch(event.target.value)}
                        placeholder='Search Users by ID, Name, Email, Phone' />
                    <select>
                        <option>Пункт 1</option>
                        <option>Пункт 2</option>
                    </select>
                </div>
                <div className="table__header">
                    <ul className="table__body">
                        <li className="table__row table__row--default">
                            <ul className='person__list'>
                                <li className='person__item person__item--id'>ID</li>
                                <li className='person__item person__item--first-name'>First name</li>
                                <li className='person__item person__item--lastname'>Last name</li>
                                <li className='person__item person__item--email'>Email</li>
                                <li className='person__item person__item--phone'>Phone</li>
                                <li className='person__item person__item--state'>State</li>
                            </ul>
                        </li>
                        {/*Error here about Each child in a list should have a unique "key"*/}
                        {peopleList.map((person) => {
                            return (
                                <li onClick = {() => showPerson(person)} className="table__row" key = {person.number}>
                                    <ul className='person__list'>
                                        <li className='person__item person__item--id'>{person.id}</li>
                                        <li className='person__item person__item--first-name'>{person.firstName}</li>
                                        <li className='person__item person__item--lastname'>{person.lastName}</li>
                                        <li className='person__item person__item--email'>{person.email}</li>
                                        <li className='person__item person__item--phone'>{person.phone}</li>
                                        <li className='person__item person__item--state'>{person.adress.state}</li>
                                    </ul>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div className="table__footer">
                    <div className="pagination">
                        
                    </div>
                </div>
            </div>
            {selectedPerson && 
                <div className="person-info">
                    <h4 className = 'person-info__title'>Profile info:</h4>
                    <ul className = 'person-info__list'>
                        <li className = 'person-info__item'>Selected profile: {selectedPerson.firstName} {selectedPerson.lastName}</li>
                        <li className = 'person-info__item'>Description: {selectedPerson.description}</li>
                        <li className = 'person-info__item'>Adress: {selectedPerson.adress.streetAddress}</li>
                        <li className = 'person-info__item'>City: {selectedPerson.adress.city}</li>
                        <li className = 'person-info__item'>State: {selectedPerson.adress.state}</li>
                        <li className = 'person-info__item'>Index: {selectedPerson.adress.zip}</li>    
                    </ul>
                </div> 
            }
        </div>
    )
}

export default Table