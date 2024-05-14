import React, { useCallback, useState } from 'react'
import { Button } from 'antd'

import { sample_data } from '../../sample_data'
import PersonForm from '../../components/PersonForm'

import './index.css'

export default function Home() {
    const [persons, setPersons] = useState(sample_data)

    const [addPersonOpen, setAddPersonOpen] = useState(false)
    const [personToEdit, setPersonToEdit] = useState()

    const getPartnerIdByPartner = useCallback(person => {
        const partnerToFindProp = person.gender === 'MALE' ? 'partner2' : 'partner1'
        const partnerId = person.partnerships?.[0]?.[partnerToFindProp]

        return partnerId ? [partnerId] : undefined
    }, [])

    const handleAddPersonOnSave = values => {
        console.log('values', values)
        setAddPersonOpen(false)

        let newPerson = { ...values, partner: undefined, uid: new Date().toISOString() }

        if (values.partner) {
            let partner1 = newPerson.uid
            let partner2 = values.partner

            if (values.gender === 'FEMALE') {
                partner2 = newPerson.uid
                partner1 = values.partner
            }

            const newPartnership = { uid: new Date().toISOString(), partner1, partner2 }

            newPerson.partnerships = [newPartnership]

            setPersons(previous =>
                previous.map(o =>
                    o.uid === values.partner
                        ? {
                              ...o,
                              partnerships: [newPartnership],
                          }
                        : o,
                ),
            )
        }

        setPersons(previous => [...previous, newPerson])
    }

    const handleAddPersonOnCancel = () => {
        setAddPersonOpen(false)
    }

    const handleEditPersonOnSave = values => {
        console.log('values', values)
        const personBeforeEdit = persons.find(o => o.uid === values.uid)
        const previousPartnerId = getPartnerIdByPartner(personBeforeEdit)[0]

        if (values.partner !== previousPartnerId) {
            // remove
            if (!values.partner && previousPartnerId) {
                // for edited
                setPersons(previous =>
                    previous.map(o =>
                        o.uid === values.uid
                            ? {
                                  ...o,
                                  ...values,
                                  partner: undefined,
                                  partnerships: o.partnerships.filter(b => b.uid === previousPartnerId),
                              }
                            : o,
                    ),
                )
                // for partner
                setPersons(previous =>
                    previous.map(o =>
                        o.uid === previousPartnerId
                            ? {
                                  ...o,
                                  partnerships: o.partnerships.filter(b => b.uid === values.uid),
                              }
                            : o,
                    ),
                )
            }

            let partner1 = values.uid
            let partner2 = values.partner

            if (values.gender === 'FEMALE') {
                partner2 = values.uid
                partner1 = values.partner
            }
            const newPartnership = { uid: new Date().toISOString(), partner1, partner2 }

            // add
            if (values.partner && !previousPartnerId) {
                // for edited
                setPersons(previous =>
                    previous.map(o =>
                        o.uid === values.uid
                            ? {
                                  ...o,
                                  ...values,
                                  partner: undefined,
                                  partnerships: [newPartnership],
                              }
                            : o,
                    ),
                )
                // for partner
                setPersons(previous =>
                    previous.map(o =>
                        o.uid === previousPartnerId
                            ? {
                                  ...o,
                                  partnerships: [newPartnership],
                              }
                            : o,
                    ),
                )
            }
            // change
            if (values.partner && previousPartnerId) {
                // for edited
                setPersons(previous =>
                    previous.map(o =>
                        o.uid === values.uid
                            ? {
                                  ...o,
                                  ...values,
                                  partner: undefined,
                                  partnerships: [newPartnership],
                              }
                            : o,
                    ),
                )
                // for previous partner
                setPersons(previous =>
                    previous.map(o =>
                        o.uid === previousPartnerId
                            ? {
                                  ...o,
                                  partnerships: [],
                              }
                            : o,
                    ),
                )
                // for partner
                setPersons(previous =>
                    previous.map(o =>
                        o.uid === values.partner
                            ? {
                                  ...o,
                                  partnerships: [newPartnership],
                              }
                            : o,
                    ),
                )
                if (personBeforeEdit.partnerships[0].children?.length > 0) {
                    // remove any children connection
                    setPersons(previous =>
                        previous.map(o =>
                            o.father === partner1 || o.mother === partner2
                                ? {
                                      ...o,
                                      father: undefined,
                                      mother: undefined,
                                  }
                                : o,
                        ),
                    )
                }
            }
        } else {
            setPersons(previous =>
                previous.map(o =>
                    o.uid === values.uid
                        ? {
                              ...o,
                              ...values,
                          }
                        : o,
                ),
            )
        }
    }

    const handleEditPersonOnCancel = () => {
        setPersonToEdit()
    }

    return (
        <div>
            <h1>FAMILY-TREE</h1>

            <div>
                <div>
                    <h4>People:</h4>
                    <ul>
                        {persons.map(o => (
                            <li key={o.uid} className="family-tree-grid">
                                <span>{o.uid} </span>
                                <span>
                                    {o.firstName} {o.lastName}
                                </span>
                                <span>
                                    <Button
                                        onClick={() => setPersonToEdit({ ...o, partner: getPartnerIdByPartner(o) })}
                                    >
                                        Edit
                                    </Button>
                                </span>
                            </li>
                        ))}
                    </ul>
                    {personToEdit && (
                        <PersonForm
                            values={personToEdit}
                            onSave={handleEditPersonOnSave}
                            onCancel={handleEditPersonOnCancel}
                            persons={persons}
                            isEdit
                        />
                    )}
                    <Button onClick={() => setAddPersonOpen(true)}>Add new person</Button>
                    {addPersonOpen && (
                        <PersonForm
                            values={{}}
                            onSave={handleAddPersonOnSave}
                            onCancel={handleAddPersonOnCancel}
                            persons={persons}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
