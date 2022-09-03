import React, { useEffect, useState } from "react"
import { database } from "../../firebase"
import Member from "./Member"
import AddMemberButton from "./AddMemberButton"

// function useMembers(){
//     const [members, setMembers] = useState([])

//     useEffect(()=>{
//         database.membersManager.getAll().then(data=>{
//             setMembers(data)
//         })
//     },[])

//     useDebugValue(members ?? 'loading...')

//     return members
// }
export default function MemberList() {
    const [members, setMembers] = useState([])
    // const [relationships, setRelationships] = useState([])
    // const members = useMembers()
    function refactor(data) {
        return Object.entries(data).map(
            (o) =>
                (o = {
                    id: o[0],
                    ...o[1],
                })
        )
    }
    function mWithCh(m, rs) {
        return m.map((o) => {
            let r = rs.find((b) => b.spouse.includes(o.id))
            if (r) return { ...o, children: r.children, spouse: r.spouse.find((s) => s !== o.id) }
            else return o
        })
    }
    useEffect(() => {
        database.root.on("value", (qs) => {
            let data = qs.val()
            let m = refactor(data.members)
            let r = refactor(data.relationships)
            let newM = mWithCh(m, r)
            setMembers(newM)
            console.log(newM)
        })
    }, [])
    return (
        <div>
            <div className="myHeader">
                MEMBERS LIST
                <AddMemberButton members={members} />
            </div>
            {members ? members.map((o, i) => <Member member={o} members={members} key={o.id} />) : ""}
        </div>
    )
}
