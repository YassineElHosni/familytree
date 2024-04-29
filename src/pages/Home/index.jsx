import React, { useState } from 'react'
import { Button } from 'antd'

import { sample_data } from '../../sample_data'
import PersonForm from '../../components/PersonForm'

export default function Home() {
    const [persons] = useState(sample_data.persons)
    const [partnerships] = useState(sample_data.partnerships)

    const [addPersonOpen, setAddPersonOpen] = useState(false)

    const handleAddPersonOnSave = values => {
        console.log('values', values)
        setAddPersonOpen(false)

        const newPersonId = new Date().toISOString()
        if (values.partner) {
            partnerships.push({ uid: new Date().toISOString(), partner1: newPersonId, partner2: values.partner })
        }

        const newPerson = { ...values, partner: undefined, uid: newPersonId }

        persons.push(newPerson)
    }

    const handleAddPersonOnCancel = () => {
        setAddPersonOpen(false)
    }

    return (
        <div>
            <h1>FAMILY-TREE</h1>

            <div>
                <div>
                    <h4>People:</h4>
                    <ul>
                        {persons.map(o => (
                            <li key={o.uid}>
                                {o.firstName} {o.lastName}
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
                            <li key={o.uid}>
                                {o.partner1} {o.partner2}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
