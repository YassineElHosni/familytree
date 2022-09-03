import { Button, Modal, Form } from "react-bootstrap"
import React, { useState, useEffect } from "react"
import { database } from "../../firebase.ts"
import SearchInput from "./SearchInput"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowCircleUp, faUserTimes, faArrowCircleDown, faUserEdit } from "@fortawesome/free-solid-svg-icons"

export default function Member({ member, members }) {
    const [open, setOpen] = useState(false)
    const [firstname, setFirstname] = useState(member.firstname)
    const [lastname, setLastname] = useState(member.lastname)
    const [birthday, setBirthday] = useState(member.birthday)
    const [spouse, setSpouse] = useState(member.spouse ?? -1)

    const [selectedKids, setSelectedKids] = useState(member.children ? member.children : [])
    const [searchTarget, setSearchTarget] = useState("")
    const [searchResults, setDisplayedMembers] = useState(members)

    function addKid(target) {
        if (!selectedKids.find((o) => o === target.id)) setSelectedKids((o) => [...o, target.id])
    }
    function removeKid(target) {
        setSelectedKids((o) => o.filter((b) => b !== target.id))
    }
    useEffect(() => {}, [selectedKids])
    useEffect(() => {
        setDisplayedMembers(
            searchTarget.trim() === ""
                ? members
                : members.filter(
                      (o) =>
                          o.firstname.includes(searchTarget) ||
                          o.lastname.includes(searchTarget) ||
                          o.birthday.includes(searchTarget)
                  )
        )
    }, [searchTarget, members])

    function openModal() {
        setOpen(true)
    }
    function closeModal() {
        setOpen(false)
    }
    function handleSubmit(e) {
        e.preventDefault()

        console.log(database)

        database.membersManager.update({
            id: member.id,
            firstname: firstname,
            lastname: lastname,
            birthday: birthday,
        })
        database.relationshipsManager.getAll().then((rs) => {
            // TODO: needs cleaning
            let r = rs.filter((o) => o.spouse.includes(member.id))
            console.log(r, spouse, selectedKids, member)
            if (r.length && spouse === -1) {
                database.relationshipsManager.remove()
                return -1
            } else if (member.spouse === -1 && spouse === -1) return 0
            else if (member.spouse === -1 && spouse !== -1)
                database.relationshipsManager.push({
                    spouse: [spouse, member.id],
                    children: selectedKids,
                })
            else if (member.spouse !== -1 && spouse !== -1)
                database.relationshipsManager.update({
                    id: r.id,
                    spouse: [spouse, member.id],
                    children: selectedKids,
                })
        })

        setFirstname("")
        setLastname("")
        setBirthday("")
        setSpouse(-1)

        setSelectedKids([])
        setSearchTarget("")
        setDisplayedMembers(members)

        closeModal()
    }
    function removeMember() {
        database.membersManager.remove(member.id)
    }

    useEffect(() => {
        setFirstname(member.firstname)
        setLastname(member.lastname)
        setBirthday(member.birthday)
        setSpouse(member.spouse ?? -1)

        setSelectedKids(member.children ? member.children : [])
        setSearchTarget("")
    }, [member])

    return (
        <>
            <div className="myMember row">
                <div className="col">
                    {`${member.firstname} ${member.lastname} ${member.birthday} ch:${
                        member.children ? member.children.length : 0
                    }`}
                </div>
                <div className="col">
                    <Button onClick={openModal} variant="outline-primary" size="sm">
                        <FontAwesomeIcon icon={faUserEdit} />
                    </Button>
                    <Button onClick={removeMember} variant="outline-danger" size="sm">
                        <FontAwesomeIcon icon={faUserTimes} />
                    </Button>
                </div>
            </div>
            <Modal show={open} onHide={closeModal}>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Modal.Header>EDIT MEMBER</Modal.Header>
                        <Form.Group>
                            <Form.Label>Firstname</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Lastname</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Birthday</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                value={birthday}
                                onChange={(e) => setBirthday(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Spouse</Form.Label>
                            <Form.Control as="select" value={spouse} onChange={(e) => setSpouse(e.target.value)}>
                                <option key={-1} value={-1}>
                                    - NONE -
                                </option>
                                {members
                                    ? members.map((o) => (
                                          <option key={o.id} value={o.id}>
                                              {o.firstname + " " + o.lastname + " " + o.birthday}
                                          </option>
                                      ))
                                    : ""}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Kids</Form.Label>
                            <div className="selectedKids">
                                {selectedKids
                                    ? selectedKids.map((id) => {
                                          let o = members.find((b) => b.id === id)
                                          return (
                                              <div key={o.id} id={o.id} onClick={(e) => removeKid(e.target)}>
                                                  {o.firstname + " " + o.lastname + " " + o.birthday}
                                                  <FontAwesomeIcon icon={faArrowCircleDown} />
                                              </div>
                                          )
                                      })
                                    : ""}
                            </div>
                            <SearchInput
                                onChange={(e) => setSearchTarget(e.target.value)}
                                placeholder="find selectedKids"
                            />
                            <div className="searchResults">
                                {searchResults
                                    ? searchResults.map((o) => (
                                          <div
                                              key={o.id}
                                              id={o.id}
                                              onClick={(e) => addKid(e.target)}
                                              bg={o.picked ? "success" : "secondary"}
                                          >
                                              {o.firstname + " " + o.lastname + " " + o.birthday}
                                              <FontAwesomeIcon icon={faArrowCircleUp} />
                                          </div>
                                      ))
                                    : ""}
                            </div>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModal}>
                            Close
                        </Button>
                        <Button variant="success" type="submit">
                            Update
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}
