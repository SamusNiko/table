import { useState, useEffect } from "react";

const Table = () => {

    const [peopleList, setpeopleList] = useState([]) //* <- here our people arr after response
    const [selectedPerson, setselectedPerson] = useState(false) //* <- here visible info about person after click
    const [inputSearch, setinputSearch] = useState('') //* <- here TwoSideBinding for search input 
    const [countPages, setcountPages] = useState([]) //* <- count pages in pagination
    const [currentPage, setcurrentPage] = useState(1) //* <- current selected page

    const [number, setnumber] = useState()

    const [sortingField, setsortingField] = useState('')
    const [sortingOrder, setsortingOrder] = useState('asc')

    const ITEMS_PER_PAGE = 20 //* <- How many element per page

    const headers = [
        { name: 'ID', field: 'id', sortable: true},
        { name: 'First name', field: 'firstName', sortable: true},
        { name: 'Last name', field: 'lastName', sortable: true},
        { name: 'Email', field: 'email', sortable: true},
        { name: 'Phone', field: 'phone', sortable: true},
        { name: 'State', field: 'state', sortable: true}
    ]

    useEffect(() => {
        const response = () => {
            fetch('https://itrex-react-lab-files.s3.eu-central-1.amazonaws.com/react-test-api.json')
                .then(response => response.json().then(data => {
                    setpeopleList(data)
                    visibleList()
                }))
        }
        response()
    }, [])

    useEffect(() => {
        console.log(123);
        const countPage = () => {
            const arr = []
            for (let index = 1; index <= peopleList.length / ITEMS_PER_PAGE; index++) {
                arr.push(index)
            }
            setcountPages(arr) 
        }
        countPage()
        visibleList()   
    }, [peopleList, inputSearch])

    useEffect(() => {
        visibleList()
    }, [currentPage])

    useEffect(() => {
        onInputSearch()
    }, [inputSearch])

    const onInputSearch = () => {
        console.log(inputSearch);
        let arr = []
        if (inputSearch) {
            arr = peopleList.filter((e) => 
                e.firstName.toLowerCase().includes(inputSearch.toLowerCase()) ||
                e.lastName.toLowerCase().includes(inputSearch.toLowerCase()) ||
                e.email.toLowerCase().includes(inputSearch.toLowerCase()) ||
                e.phone.includes(inputSearch)
                )
            visibleList(arr)
        } else visibleList()
    }

    const onSortingChange = (field) => {
            const order = field === sortingField && sortingOrder === "asc" ? "desc" : "asc";

            setsortingField(field);
            setsortingOrder(order);

            const sortElementAsc = (field) => {
                setpeopleList(peopleList.sort((a, b) => {
                    if (a[field] > b[field]) {
                        return 1;
                      }
                      if (a[field] < b[field]) {
                        return -1;
                      }
                      return 0;
                    })
                )
            }

            const sortElementDesc = (field) => {
                setpeopleList(peopleList.sort((a, b) => {
                    if (a[field] > b[field]) {
                        return -1;
                      }
                      if (a[field] < b[field]) {
                        return 1;
                      }
                      return 0;
                    })
                )
            }

            if (order === "asc") {
                sortElementAsc(field)
            }

            if (order === "desc") {
                sortElementDesc(field)
            }

        visibleList()
    }

    const visibleListPerson = (person) => {
        setselectedPerson(person)
    }

    const visibleList = (list = peopleList,) => {
        const indexOfLastItem = currentPage * ITEMS_PER_PAGE //* <- we find the last element
        const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE //* <- we find the first element

        
        if (!inputSearch) {
            const resultList = (list.slice(indexOfFirstItem , indexOfLastItem))
            console.log('length',resultList.length);
            return resultList    
        } else {
            let resultList = list.filter((e) => 
                e.firstName.toLowerCase().includes(inputSearch.toLowerCase()) ||
                e.lastName.toLowerCase().includes(inputSearch.toLowerCase()) ||
                e.email.toLowerCase().includes(inputSearch.toLowerCase()) ||
                e.phone.includes(inputSearch)
                )
            resultList = resultList.slice(indexOfFirstItem , indexOfLastItem)
            console.log('length',resultList.length);

            return resultList
        }
    }

    const onPlusPage = () => {
        if (countPages.length > currentPage) {
            setcurrentPage(currentPage + 1)
        }
    }

    const onMinusPage = () => {
        if (currentPage > 1) {
            setcurrentPage(currentPage - 1)
        }
    }

    return (
        console.log('render'),
        <div className="table-container">
            <h1 className='tible-title'>ITRex test project</h1>
            <div className='table'>
                <div className="table__actions">
                    <input className='table__input-search' type="text" value = {inputSearch}
                        onChange = {(event) => setinputSearch(event.target.value)}
                        placeholder='Search Users by Name, Email, Phone' />
                    <select>
                        <option>Пункт 1</option>
                        <option>Пункт 2</option>
                    </select>
                </div>
                    <ul className="table__body">
                        <li className="table__row table__row--default">
                            <ul className='person__list'>

                                {headers.map(({ name, field, sortable }) => {
                                    return (
                                        <li className={`person__item person__item--${field}`} 
                                                onClick = {() => sortable ?  onSortingChange(field) : null} 
                                                key = {name}>
                                            {name}
                                            {sortingField && sortingField === field ? (sortingOrder === "asc"
                                            ? "⬇"
                                            : "⬆") : null}
                                        </li>
                                    )
                                })}
                                {/* <li className='person__item person__item--id'>ID</li>
                                <li className='person__item person__item--first-name' onClick = {() => sort()}>First name</li>
                                <li className='person__item person__item--lastname'>Last name</li>
                                <li className='person__item person__item--email'>Email</li>
                                <li className='person__item person__item--phone'>Phone</li>
                                <li className='person__item person__item--state'>State</li> */}
                            </ul>
                        </li>
                        {/*Error here about Each child in a list should have a unique "key"*/}
                        {visibleList().map((person) => {
                            return (
                                <li onClick = {() => visibleListPerson(person)} className="table__row" key = {person.number}>
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
                <div className="table__footer">
                    <div className="pagination">
                        {/* fix when <1 pages */}
                        <ul className = 'pagination__list'>
                            <li className = 'pagination__item'  onClick = {() => onMinusPage()}>Previous</li>
                                {countPages.length > 1 ? 
                                    countPages.map((page) => {
                                        return(
                                            <li className = 'pagination__item'
                                                style = {{backgroundColor: currentPage === page ? '#6E6893' : 'white'}} 
                                                onClick = {() => {
                                                setcurrentPage(page)
                                            }} key = {page}>{page}
                                            </li>
                                        )
                                }) : <p>Only one page</p>}
                            <li className = 'pagination__item' onClick = {() => onPlusPage()}>Next</li>
                        </ul>
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