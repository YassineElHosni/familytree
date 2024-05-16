import React, { useCallback, useState } from 'react'
import { Button } from 'antd'

import { sample_data } from '../../sample_data'
import MemberForm from '../../components/MemberForm'

import './index.css'

export default function Home() {
    const [members, setMembers] = useState(sample_data)

    const [addMemberOpen, setAddMemberOpen] = useState(false)
    const [memberToEdit, setMemberToEdit] = useState()

    const getPartnerIdByPartner = useCallback(member => {
        const partnerToFindProp = member.gender === 'MALE' ? 'partner2' : 'partner1'
        const partnerId = member.partnerships?.[0]?.[partnerToFindProp]

        return partnerId ? [partnerId] : undefined
    }, [])

    const handleAddMemberOnSave = values => {
        console.log('values', values)
        setAddMemberOpen(false)

        let newMember = { ...values, partner: undefined, uid: new Date().toISOString() }

        if (values.partner) {
            let partner1 = newMember.uid
            let partner2 = values.partner

            if (values.gender === 'FEMALE') {
                partner2 = newMember.uid
                partner1 = values.partner
            }

            const newPartnership = { uid: new Date().toISOString(), partner1, partner2 }

            newMember.partnerships = [newPartnership]

            setMembers(previous =>
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

        setMembers(previous => [...previous, newMember])
    }

    const handleAddMemberOnCancel = () => {
        setAddMemberOpen(false)
    }

    const handleEditMemberOnSave = values => {
        console.log('values', values)
        const memberBeforeEdit = members.find(o => o.uid === values.uid)
        const previousPartnerId = getPartnerIdByPartner(memberBeforeEdit)[0]

        if (values.partner !== previousPartnerId) {
            // remove
            if (!values.partner && previousPartnerId) {
                // for edited
                setMembers(previous =>
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
                setMembers(previous =>
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
                setMembers(previous =>
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
                setMembers(previous =>
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
                setMembers(previous =>
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
                setMembers(previous =>
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
                setMembers(previous =>
                    previous.map(o =>
                        o.uid === values.partner
                            ? {
                                  ...o,
                                  partnerships: [newPartnership],
                              }
                            : o,
                    ),
                )
                if (memberBeforeEdit.partnerships[0].children?.length > 0) {
                    // remove any children connection
                    setMembers(previous =>
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
            setMembers(previous =>
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

    const handleEditMemberOnCancel = () => {
        setMemberToEdit()
    }

    return (
        <div>
            <h1>FAMILY-TREE</h1>

            <div>
                <div>
                    <h4>People:</h4>
                    <ul>
                        {members.map(o => (
                            <li key={o.uid} className="family-tree-grid">
                                <span>{o.uid} </span>
                                <span>
                                    {o.firstName} {o.lastName}
                                </span>
                                <span>
                                    <Button
                                        onClick={() => setMemberToEdit({ ...o, partner: getPartnerIdByPartner(o) })}
                                    >
                                        Edit
                                    </Button>
                                </span>
                            </li>
                        ))}
                    </ul>
                    {memberToEdit && (
                        <MemberForm
                            values={memberToEdit}
                            onSave={handleEditMemberOnSave}
                            onCancel={handleEditMemberOnCancel}
                            members={members}
                            isEdit
                        />
                    )}
                    <Button onClick={() => setAddMemberOpen(true)}>Add new member</Button>
                    {addMemberOpen && (
                        <MemberForm
                            values={{}}
                            onSave={handleAddMemberOnSave}
                            onCancel={handleAddMemberOnCancel}
                            members={members}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
