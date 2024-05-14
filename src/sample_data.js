export const sample_data = {
    persons: [
        {
            uid: '0x1a519f61f8',
            firstName: 'Abdelaziz',
            lastName: 'EL HOSNI',
            gender: 'MALE',
            mother: '0x1a519f61fe',
            partnerships: [
                {
                    uid: '0x1a519f61fa',
                    partner1: '0x1a519f61f8',
                    partner2: '0x1a519f61f9',
                    children: [
                        {
                            uid: '0x1a519f61fb',
                        },
                        {
                            uid: '0x1a519f61fc',
                        },
                        {
                            uid: '0x1a519f61fd',
                        },
                    ],
                },
            ],
        },
        {
            uid: '0x1a519f61f9',
            firstName: 'Widad',
            lastName: 'DOUGHAILI',
            gender: 'FEMALE',
            partnerships: [
                {
                    uid: '0x1a519f61fa',
                    partner1: '0x1a519f61f8',
                    partner2: '0x1a519f61f9',
                    children: [
                        {
                            uid: '0x1a519f61fb',
                        },
                        {
                            uid: '0x1a519f61fc',
                        },
                        {
                            uid: '0x1a519f61fd',
                        },
                    ],
                },
            ],
        },
        {
            uid: '0x1a519f61fb',
            firstName: 'Yassine',
            lastName: 'EL HOSNI',
            gender: 'MALE',
            father: '0x1a519f61f8',
            mother: '0x1a519f61f9',
        },
        {
            uid: '0x1a519f61fc',
            firstName: 'Hamza',
            lastName: 'EL HOSNI',
            gender: 'MALE',
            father: '0x1a519f61f8',
            mother: '0x1a519f61f9',
        },
        {
            uid: '0x1a519f61fd',
            firstName: 'Zakariya',
            lastName: 'EL HOSNI',
            gender: 'MALE',
            father: '0x1a519f61f8',
            mother: '0x1a519f61f9',
        },
        {
            uid: '0x1a519f61fe',
            firstName: 'Lakbira',
            lastName: 'BEN ACHIR',
            gender: 'FEMALE',
            partnerships: [
                {
                    uid: '0x1a519f61ff',
                    partner2: '0x1a519f61fe',
                    children: [
                        {
                            uid: '0x1a519f61f8',
                        },
                    ],
                },
            ],
        },
    ],
    partnerships: [
        {
            uid: '0x1a519f61fa',
            partner1: '0x1a519f61f8',
            partner2: '0x1a519f61f9',
            children: [
                {
                    uid: '0x1a519f61fb',
                },
                {
                    uid: '0x1a519f61fc',
                },
                {
                    uid: '0x1a519f61fd',
                },
            ],
        },
        {
            uid: '0x1a519f61ff',
            partner2: '0x1a519f61fe',
            children: [
                {
                    uid: '0x1a519f61f8',
                },
            ],
        },
    ],
}
