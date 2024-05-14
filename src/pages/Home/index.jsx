import React, { useCallback, useState } from 'react'
import { Button } from 'antd'

import { sample_data } from '../../sample_data'
import PersonForm from '../../components/PersonForm'

import './index.css'

export default function Home() {
    const [persons, setPersons] = useState(sample_data.persons)
    const [partnerships, setPartnerships] = useState(sample_data.partnerships)

    const [addPersonOpen, setAddPersonOpen] = useState(false)
    const [personToEdit, setPersonToEdit] = useState()

    const getPersonName = useCallback(
        personId => {
            const found = persons.find(o => o.uid === personId)
            if (!found) {
                return 'undefined'
            }
            return `${found.firstName} ${found.lastName}`
        },
        [persons],
    )

    const getChildrenNames = useCallback(
        partnershipId => {
            console.log(partnershipId, { partnerships, persons })
            const found = partnerships.find(o => o.uid === partnershipId)

            const children = persons.filter(
                o =>
                    (o.father && [found.partner1, found.partner2].includes(o.father)) ||
                    (o.mother && [found.partner1, found.partner2].includes(o.mother)),
            )

            return children.map(o => `${o.firstName} ${o.lastName}`).join(',')
        },
        [partnerships, persons],
    )

    const getPartnerIdByPartner = useCallback(
        person => {
            const partnerToFindWithProp = person.gender === 'MALE' ? 'partner1' : 'partner2'
            const partnerToFindProp = person.gender === 'MALE' ? 'partner2' : 'partner1'
            const found = partnerships.find(o => o[partnerToFindWithProp] === person.uid)
            if (!found) {
                return
            }
            return found[partnerToFindProp]
        },
        [partnerships],
    )

    const handleAddPersonOnSave = values => {
        console.log('values', values)
        setAddPersonOpen(false)

        const newPersonId = new Date().toISOString()
        if (values.partner) {
            let partner1 = newPersonId
            let partner2 = values.partner

            if (values.gender === 'FEMALE') {
                partner2 = newPersonId
                partner1 = values.partner
            }

            setPartnerships(previous => [...previous, { uid: new Date().toISOString(), partner1, partner2 }])
        }

        const newPerson = { ...values, partner: undefined, uid: newPersonId }

        setPersons(previous => [...previous, newPerson])
    }

    const handleAddPersonOnCancel = () => {
        setAddPersonOpen(false)
    }

    const handleEditPersonOnSave = values => {
        console.log('values', values)
        setPersons(previous => previous.map(o => (o.uid === values.uid ? { ...values, partner: undefined } : o)))

        const partnerFound = getPartnerIdByPartner(values)
debugger
        if (partnerFound !== values.partner) {
            if (partnerFound) {
                const partnerToFindProp = values.gender === 'MALE' ? 'partner2' : 'partner1'
                setPartnerships(previous =>
                    previous.map(o =>
                        o[partnerToFindProp] === partnerFound ? { ...o, [partnerFound]: values.partner } : o,
                    ),
                )
            } else {
                const partnerToFindWithProp = values.gender === 'MALE' ? 'partner1' : 'partner2'
                const halfPartnership = partnerships.find(o => o[partnerToFindWithProp] === values.uid)

                let partner1 = values.uid
                let partner2 = values.partner

                if (values.gender === 'FEMALE') {
                    partner2 = values.uid
                    partner1 = values.partner
                }

                if (halfPartnership) {
                    setPartnerships(previous =>
                        previous.map(o => (o.uid === halfPartnership.uid ? { ...o, partner1, partner2 } : o)),
                    )
                } else {
                    setPartnerships(previous => [...previous, { uid: new Date().toISOString(), partner1, partner2 }])
                }
            }
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
                <div>
                    <h4>Partnerships:</h4>
                    <ul>
                        {partnerships.map(o => (
                            <li key={o.uid} className="family-tree-grid">
                                <span>{o.uid}</span>
                                <span>{getPersonName(o.partner1)}</span>
                                <span>{getPersonName(o.partner2)}</span>
                                <span>{getChildrenNames(o.uid)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
