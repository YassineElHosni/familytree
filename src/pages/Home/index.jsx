import React, { useState } from 'react'

import { sample_data } from '../../sample_data'
import PersonForm from '../../components/PersonForm'

export default function Home() {
    const [persons] = useState(sample_data.persons)
    const [partnerships] = useState(sample_data.partnerships)

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
                    <PersonForm values={{}} onChange={values => console.log('values', values)} />
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
