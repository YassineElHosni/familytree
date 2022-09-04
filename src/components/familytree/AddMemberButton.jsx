import React, { useState, useEffect } from "react"
import { PlusCircleOutlined } from "@ant-design/icons"

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
            <button onClick={openModal} variant="outline-success" size="sm">
                <PlusCircleOutlined />
            </button>
            {open && (
                <form onSubmit={handleSubmit}>
                    <div>
                        <h2>NEW MEMBER</h2>
                        <div>
                            <label>Firstname</label>
                            <input
                                type="text"
                                required
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Lastname</label>
                            <input
                                type="text"
                                required
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Birthday</label>
                            <input
                                type="text"
                                required
                                value={birthday}
                                onChange={(e) => setBirthday(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Spouse</label>
                            <input as="select" value={spouse} onChange={(e) => setSpouse(e.target.value)}>
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
                            </input>
                        </div>
                        <div hidden={spouse === -1}>
                            <label>Kids</label>
                            <div className="selectedKids">
                                {selectedKids
                                    ? selectedKids.map((id) => {
                                          let o = members.find((b) => b.id === id)
                                          return (
                                              <div key={o.id} id={o.id} onClick={(e) => removeKid(e.target)}>
                                                  {o.firstname + " " + o.lastname + " " + o.birthday}
                                                  down
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
                                              up
                                          </div>
                                      ))
                                    : ""}
                            </div>
                        </div>
                    </div>
                    <div>
                        <button variant="secondary" onClick={closeModal}>
                            Close
                        </button>
                        <button variant="success" type="submit">
                            Add
                        </button>
                    </div>
                </form>
            )}
        </>
    )
}
