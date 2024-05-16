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
        const partnerToFindProp = member.gender === 'MALE' ? 'wife' : 'husband'
        const partnerId = member.relationships?.[0]?.[partnerToFindProp]

        return partnerId ? [partnerId] : undefined
    }, [])

    const handleAddMemberOnSave = values => {
        console.log('values', values)
        setAddMemberOpen(false)

        let newMember = { ...values, partner: undefined, uid: new Date().toISOString() }

        if (values.partner) {
            let husband = newMember.uid
            let wife = values.partner

            if (values.gender === 'FEMALE') {
                wife = newMember.uid
                husband = values.partner
            }

            const newRelationship = { uid: new Date().toISOString(), husband, wife }

            newMember.relationships = [newRelationship]

            setMembers(previous =>
                previous.map(o =>
                    o.uid === values.partner
                        ? {
                              ...o,
                              relationships: [newRelationship],
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
                                  relationships: o.relationships.filter(b => b.uid === previousPartnerId),
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
                                  relationships: o.relationships.filter(b => b.uid === values.uid),
                              }
                            : o,
                    ),
                )
            }

            let husband = values.uid
            let wife = values.partner

            if (values.gender === 'FEMALE') {
                wife = values.uid
                husband = values.partner
            }
            const newRelationship = { uid: new Date().toISOString(), husband, wife }

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
                                  relationships: [newRelationship],
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
                                  relationships: [newRelationship],
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
                                  relationships: [newRelationship],
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
                                  relationships: [],
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
                                  relationships: [newRelationship],
                              }
                            : o,
                    ),
                )
                if (memberBeforeEdit.relationships[0].children?.length > 0) {
                    // remove any children connection
                    setMembers(previous =>
                        previous.map(o =>
                            o.father === husband || o.mother === wife
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
