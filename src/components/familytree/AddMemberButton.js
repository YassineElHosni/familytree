import React, { useState, useEffect } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserPlus, faArrowCircleUp, faArrowCircleDown } from "@fortawesome/free-solid-svg-icons"
import { database } from "../../firebase.ts"
import SearchInput from "./SearchInput"

export default function AddMemberButton({ members }) {
    const [open, setOpen] = useState(false)
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [birthday, setBirthday] = useState("")
    const [spouse, setSpouse] = useState(-1)

    const [selectedKids, setSelectedKids] = useState([])
    const [searchTarget, setSearchTarget] = useState("")
    const [searchResults, setDisplayedMembers] = useState(members)

    function addKid(target) {
        if (!selectedKids.find((o) => o === target.id)) setSelectedKids((o) => [...o, target.id]) //{o.push(target.id);console.log(selectedKids);return o;})
    }
    function removeKid(target) {
        // console.log('removing :',target)
        setSelectedKids((o) => o.filter((b) => b !== target.id))
    }
    useEffect(() => {
        // console.log("selectedKids: ", selectedKids)
    }, [selectedKids])
    useEffect(() => {
        // console.log(searchTarget)
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

        database.membersManager
            .add({
                firstname: firstname,
                lastname: lastname,
                birthday: birthday,
            })
            .then((mRef) => {
                return mRef.key
            })
            .then((mId) => {
                console.log(spouse, selectedKids, mId)
                if (spouse !== -1) {
                    database.relationshipsManager.push({
                        spouse: [spouse, mId],
                        children: selectedKids,
                    })
                }
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
    return (
        <>
            <Button onClick={openModal} variant="outline-success" size="sm">
                <FontAwesomeIcon icon={faUserPlus} />
            </Button>
            <Modal show={open} onHide={closeModal}>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Modal.Header>NEW MEMBER</Modal.Header>
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
                        <Form.Group hidden={spouse === -1}>
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
                            Add
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}
