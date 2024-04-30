import React, { useCallback, useEffect, useState } from 'react'
import { Button } from 'antd'

import { sample_data } from '../../sample_data'
import PersonForm from '../../components/PersonForm'

import './index.css'

export default function Home() {
    const [persons] = useState(sample_data.persons)
    const [partnerships] = useState(sample_data.partnerships)

    const [addPersonOpen, setAddPersonOpen] = useState(false)

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

            partnerships.push({ uid: new Date().toISOString(), partner1, partner2 })
        }

        const newPerson = { ...values, partner: undefined, uid: newPersonId }

        persons.push(newPerson)
    }

    const handleAddPersonOnCancel = () => {
        setAddPersonOpen(false)
    }

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
                            </li>
                        ))}
                    </ul>
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
