import React from 'react'

import { sample_data } from '../../sample_data'

export default function HomePage() {
    const [persons, setPersons] = useState(sample_data.persons)
    const [partnerships, setPartnerships] = useState(sample_data.partnerships)

    return (
        <div>
            <h1>FAMILY-TREE</h1>

            <div>
                <div>
                    <h4>People:</h4>
                    <ul>
                        {persons.map((o) => (
                            <li key={o.uid}>
                                {o.firstName} {o.lastName}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4>Partnerships:</h4>
                    <ul>
                        {partnerships.map((o) => (
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
