import { useState, useEffect } from "react";

const Table = () => {

    const [peopleList, setpeopleList] = useState([]) //* <- here our people arr after response
    const [visibleList, setvisibleList] = useState([]) //* <- here our people arr after response
    const [itemsOnPage, setItemsOnPage] = useState([]) //* <- here our people arr after response
    const [selectedPerson, setselectedPerson] = useState(false) //* <- here visible info about person after click
    const [countPages, setcountPages] = useState(1) //* <- count pages in pagination
    const [currentPage, setcurrentPage] = useState(1) //* <- current selected page
    const [sortingField, setsortingField] = useState('')
    const [sortingOrder, setsortingOrder] = useState('asc')

    const ITEMS_PER_PAGE = 20 //* <- How many element per page

    const headers = [
        { name: 'ID', field: 'id', sortable: true },
        { name: 'First name', field: 'firstName', sortable: true },
        { name: 'Last name', field: 'lastName', sortable: true },
        { name: 'Email', field: 'email', sortable: true },
        { name: 'Phone', field: 'phone', sortable: true },
        { name: 'State', field: 'state', sortable: false }
    ]

    useEffect(() => {
        const response = () => {
            fetch('https://itrex-react-lab-files.s3.eu-central-1.amazonaws.com/react-test-api.json')
                .then(response => response.json().then(data => {
                    let dataWithUniqId = _returnArrayWithUniqId(data);
                    setpeopleList(dataWithUniqId);
                    setvisibleList(dataWithUniqId);
                    setItemsOnPage(_getVisibleItems(dataWithUniqId));
                    console.log("firstRendering");
                }))
        }
        response()
    }, [])

    useEffect(() => {
        _getPageCount(visibleList.length);
        setItemsOnPage(_getVisibleItems(visibleList));
    }, [visibleList])

    useEffect(() => {
        setItemsOnPage(_getVisibleItems(visibleList));
    }, [currentPage])

    const _returnArrayWithUniqId = array => {
        return array.map((item, index) => {
            item.uniqKey = index;
            return item;
        });
    }

    const _getPageCount = itemCount => {
        var pageCount = Math.ceil(itemCount / ITEMS_PER_PAGE);
        const arr = []
        for (let index = 1; index <= pageCount; index++) {
            arr.push(index)
        }
        setcountPages(arr)
    }

    const _getVisibleItems = defaultArray => {
        let startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        let endIndex = defaultArray.length < currentPage * ITEMS_PER_PAGE ? defaultArray.length : currentPage * ITEMS_PER_PAGE
        const itemsOnPage = defaultArray.slice(startIndex, endIndex);
        return itemsOnPage;
    }

    const sortElementAsc = (array, field) => {
        array.sort((a, b) => {
            if (a[field] > b[field]) {
                return 1;
            }
            if (a[field] < b[field]) {
                return -1;
            }
            return 0;
        });
        return [...array];
    }

    const sortElementDesc = (array, field) => {
        array.sort((a, b) => {
            if (a[field] > b[field]) {
                return -1;
            }
            if (a[field] < b[field]) {
                return 1;
            }
            return 0;
        });
        return [...array];
    }

    const onInputSearch = (value) => {
        let arr = [];
        if (value) {
            arr = peopleList.filter((e) =>
                e.firstName.toLowerCase().includes(value.toLowerCase()) ||
                e.lastName.toLowerCase().includes(value.toLowerCase()) ||
                e.email.toLowerCase().includes(value.toLowerCase()) ||
                e.phone.includes(value)
            );
        } else {
            arr = peopleList;
        }

        if (sortingField) {
            if (sortingOrder === "asc") {
                arr = sortElementAsc(arr, sortingField);
            }
            if (sortingOrder === "desc") {
                arr = sortElementDesc(arr, sortingField);
            }
        }

        setvisibleList(arr);
        setcurrentPage(1);
    }

    const onSortingChange = (field) => {
        const order = field === sortingField && sortingOrder === "asc" ? "desc" : "asc";
        setsortingField(field);
        setsortingOrder(order);
        let sortedArray = [];
        if (order === "asc") {
            sortedArray = sortElementAsc(visibleList, field);
        }
        if (order === "desc") {
            sortedArray = sortElementDesc(visibleList, field);
        }
        setvisibleList(sortedArray);
    }

    const onTableItemClick = (person) => {
        setselectedPerson(person)
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
        <div className="table-container">
            <h1 className='tible-title'>ITRex test project</h1>
            <div className='table'>
                <div className="table__actions">
                    <input className='table__input-search' type="text"
                        onChange={(event) => onInputSearch(event.target.value)}
                        placeholder='Search Users by Name, Email, Phone' />
                </div>
                <ul className="table__body">
                    <li className="table__row table__row--default">
                        <ul className='person__list'>
                            {headers.map(({ name, field, sortable }) => {
                                return (
                                    <li className={`person__item person__item--${field}`}
                                        onClick={() => sortable ? onSortingChange(field) : null}
                                        key={name}>
                                        {name}
                                        {sortingField && sortingField === field ? (sortingOrder === "asc"
                                            ? "⬆"
                                            : "⬇") : null}
                                    </li>
                                )
                            })}
                        </ul>
                    </li>
                    {itemsOnPage.map((person) => {
                        return (
                            <li onClick={() => onTableItemClick(person)} className="table__row" key={person.uniqKey}>
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
                        <ul className='pagination__list'>
                            <li className='pagination__item' onClick={() => onMinusPage()}>Previous</li>
                            {countPages.length > 1 ?
                                countPages.map((page) => {
                                    return (
                                        <li className='pagination__item'
                                            style={{ backgroundColor: currentPage === page ? '#6E6893' : 'white' }}
                                            onClick={() => {
                                                setcurrentPage(page)
                                            }} key={page}>{page}
                                        </li>
                                    )
                                }) : <p>Only one page</p>}
                            <li className='pagination__item' onClick={() => onPlusPage()}>Next</li>
                        </ul>
                    </div>
                </div>
            </div>

            {selectedPerson &&
                <div className="person-info">
                    <h4 className='person-info__title'>Profile info:</h4>
                    <ul className='person-info__list'>
                        <li className='person-info__item'>Selected profile: {selectedPerson.firstName} {selectedPerson.lastName}</li>
                        <li className='person-info__item'>Description: {selectedPerson.description}</li>
                        <li className='person-info__item'>Adress: {selectedPerson.adress.streetAddress}</li>
                        <li className='person-info__item'>City: {selectedPerson.adress.city}</li>
                        <li className='person-info__item'>State: {selectedPerson.adress.state}</li>
                        <li className='person-info__item'>Index: {selectedPerson.adress.zip}</li>
                    </ul>
                </div>
            }
        </div>
    )
}

export default Table