import React, { useState, useEffect } from "react"
import { CloseCircleOutlined, EditOutlined } from "@ant-design/icons"

// import { database } from "../../firebase.ts"
import SearchInput from "./SearchInput"

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

        // console.log(database)

        // database.membersManager.update({
        //     id: member.id,
        //     firstname: firstname,
        //     lastname: lastname,
        //     birthday: birthday,
        // })
        // database.relationshipsManager.getAll().then((rs) => {
        //     // TODO: needs cleaning
        //     let r = rs.filter((o) => o.spouse.includes(member.id))
        //     console.log(r, spouse, selectedKids, member)
        //     if (r.length && spouse === -1) {
        //         database.relationshipsManager.remove()
        //         return -1
        //     } else if (member.spouse === -1 && spouse === -1) return 0
        //     else if (member.spouse === -1 && spouse !== -1)
        //         database.relationshipsManager.push({
        //             spouse: [spouse, member.id],
        //             children: selectedKids,
        //         })
        //     else if (member.spouse !== -1 && spouse !== -1)
        //         database.relationshipsManager.update({
        //             id: r.id,
        //             spouse: [spouse, member.id],
        //             children: selectedKids,
        //         })
        // })

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
        // database.membersManager.remove(member.id)
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
                    <button onClick={openModal}>
                        <EditOutlined />
                    </button>
                    <button onClick={removeMember}>
                        <CloseCircleOutlined />
                    </button>
                </div>
            </div>
            {open && (
                <form onSubmit={handleSubmit} className="edit-member-form">
                    <div>
                        <h2>EDIT MEMBER</h2>
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
                            <select value={spouse} onChange={(e) => setSpouse(e.target.value)}>
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
                            </select>
                        </div>
                        <div>
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
                        <button onClick={closeModal}>Close</button>
                        <button type="submit">Update</button>
                    </div>
                </form>
            )}
        </>
    )
}
