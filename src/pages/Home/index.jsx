import React, { useCallback, useEffect, useState } from 'react'
import { Button } from 'antd'

import MemberForm from '../../components/MemberForm'
import * as memberServices from '../../services/member.services'

import './index.css'

export default function Home() {
    const [members, setMembers] = useState([])

    const [addMemberOpen, setAddMemberOpen] = useState(false)
    const [memberToEdit, setMemberToEdit] = useState()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await memberServices.getAll()

                setMembers(response.data)
            } catch (error) {
                console.error('/fetchData - error', error)
            }
        }
        fetchData()
    }, [])

    const getPartnerIdByPartner = useCallback(member => {
        const partnerToFindProp = member.gender === 'MALE' ? 'wife' : 'husband'
        const partnerId = member.relationships?.[0]?.[partnerToFindProp]

        return partnerId ? [partnerId] : undefined
    }, [])

    const handleAddMemberOnSave = async values => {
        console.log('values', values)
        setAddMemberOpen(false)

        const response = await memberServices.create(values)

        console.log('create - response', response)

        let newMember = { ...values, partner: undefined, uid: response.data.id }

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

    const handleEditMemberOnSave = async values => {
        console.log('values', values)
        const response = await memberServices.edit(values)

        console.log('edit - response', response)
        const memberBeforeEdit = members.find(o => o.uid === values.uid)
        const previousPartnerId = getPartnerIdByPartner(memberBeforeEdit)?.[0]

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
                            o.parentsRelationship
                                ? {
                                      ...o,
                                      parentsRelationship: undefined,
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
