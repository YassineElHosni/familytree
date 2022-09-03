import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"
import defaultTreeData from "./default-tree-data.json"
import Member from "./models/Member"
import Relationship from "./models/Relationship"

const app = firebase.initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
})

const dbRoot = firebase.database().ref()

export const database = {
    root: firebase.database().ref(),
    members: dbRoot.child("members"),
    relationships: dbRoot.child("relationships"),
    membersManager: {
        add: async (member: Member) => {
            console.log('members manager - add', member)
            return await dbRoot.child("members").push(member)},
        update: (member: Member) => {
            let { id, ...o } = member
            dbRoot.child("members").child(id).update(o)
        },
        remove: (memberId: string) => dbRoot.child("members").child(memberId).remove(),
        set: async (member: Member) => {
            let { id, ...o } = member
            return await dbRoot.child("members/" + id).set(o)
            return member
        },

        // addAll: async (members: Member[]) =>
        //     await Promise.all([
        //         ...members.reduce((t, o) => (t = [...t, database.membersManager.add(o)]), [] as Promise<any>[]),
        //     ]).then((values) => values.reduce((t, o) => [...t, o.key], [])),
        // setAll: async (members: Member[]) =>
        //     await Promise.all([
        //         ...members.reduce((t, o) => (t = [...t, database.membersManager.set(o)]), [] as Promise<any>[]),
        //     ]).then((values) => values.reduce((t, o) => [...t, o.key], [])),

        showAll: () => dbRoot.child("members").on("value", (s) => console.log(s.val())),
        getAll: async () => {
            const results = await dbRoot.child("members").once("value", (s) => s.val())
            console.log("memebermanager - getAll - results", results)
            return []
            // Object.entries(await ().val()).map(
            //     (o) =>
            //         (o = {
            //             id: o[0],
            //             ...o[1],
            //         } )
            // )as Member[],
        },
    },
    relationshipsManager: {
        push: async (relationship: Relationship) => await dbRoot.child("relationships").push(relationship),
        update: (relationship: Relationship) =>
            dbRoot.child("relationships").child(relationship.id).update(relationship),
        remove: (relationshipId: string) => dbRoot.child("mrelationshipembers").child(relationshipId).remove(),
        set: async (relationship: Relationship) => {
            let { id, ...o } = relationship
            return await dbRoot.child("relationships/" + id).set(o)
            return {
                id: relationship.id,
                ...o,
            }
        },

        addAll: async (relationships: Relationship[]) =>
            await Promise.all([
                ...relationships.reduce(
                    (t, o) => (t = [...t, database.relationshipsManager.push(o)]),
                    [] as Promise<any>[]
                ),
            ]).then((values) => values.reduce((t, o) => [...t, o.key], [])),

        setAll: async (relationships: Relationship[]) =>
            await Promise.all([
                ...relationships.reduce(
                    (t, o) => (t = [...t, database.relationshipsManager.set(o)]),
                    [] as Promise<any>[]
                ),
            ]).then((values) => values.reduce((t, o) => [...t, o.key], [])),

        showAll: () => dbRoot.child("relationships").on("value", (s) => console.log(s.val())),
        getAll: async () => {
            const results = await dbRoot.child("relationships").once("value", (s) => s.val())
            console.log("relationshipsManager - getAll - results", results)
            // Object.entries(await ().val()).map(
            //     (o) =>
            //         (o = {
            //             id: o[0],
            //             ...o[1],
            //         })
            // ),
        },
    },
    membersFactory: {
        fill: () => {
            let data = defaultTreeData
            // database.membersManager.setAll(data.members)
            database.relationshipsManager.setAll(data.relationships)
        },
        clear: () => {
            dbRoot.child("members").remove()
            dbRoot.child("relationships").remove()
        },
    },
}
/* Run Factory to produce default data */
// database.membersFactory.clear();
// database.membersFactory.fill();

/* This command returns data already present at the database (before run time) */
// database.relationshipsManager.getAll().then(res=>console.log(res))

export const auth = app.auth()
export default app
