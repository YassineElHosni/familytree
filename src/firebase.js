import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"
import defaultTreeData from "./default-tree-data.json"

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
        add: async (member) => await dbRoot.child("members").push(member),
        update: (member) => {
            let { id, ...o } = member
            dbRoot.child("members").child(id).update(o)
        },
        remove: (memberId) => dbRoot.child("members").child(memberId).remove(),
        set: (member) => {
            let { id, ...o } = member
            dbRoot.child("members/" + id).set(o)
            return member
        },

        addAll: async (members) =>
            await Promise.all([...members.reduce((t, o) => (t = [...t, database.membersManager.add(o)]), [])]).then(
                (values) => values.reduce((t, o) => [...t, o.key], [])
            ),
        setAll: async (members) =>
            await Promise.all([...members.reduce((t, o) => (t = [...t, database.membersManager.set(o)]), [])]).then(
                (values) => values.reduce((t, o) => [...t, o.key], [])
            ),

        showAll: () => dbRoot.child("members").on("value", (s) => console.log(s.val())),
        getAll: async () =>
            Object.entries(await (await dbRoot.child("members").once("value", (s) => s.val())).val()).map(
                (o) =>
                    (o = {
                        id: o[0],
                        ...o[1],
                    })
            ),
    },
    relationshipsManager: {
        push: async (relationship) => await dbRoot.child("relationships").push(relationship),
        update: (relationship) => dbRoot.child("relationships").child(relationship.id).update(relationship),
        remove: (relationshipId) => dbRoot.child("mrelationshipembers").child(relationshipId).remove(),
        set: (member) => {
            let { id, ...o } = member
            dbRoot.child("relationships/" + id).set(o)
            return {
                id: member.id,
                ...o,
            }
        },

        addAll: async (relationships) =>
            await Promise.all([
                ...relationships.reduce((t, o) => (t = [...t, database.relationshipsManager.push(o)]), []),
            ]).then((values) => values.reduce((t, o) => [...t, o.key], [])),

        setAll: async (relationships) =>
            await Promise.all([
                ...relationships.reduce((t, o) => (t = [...t, database.relationshipsManager.set(o)]), []),
            ]).then((values) => values.reduce((t, o) => [...t, o.key], [])),

        showAll: () => dbRoot.child("relationships").on("value", (s) => console.log(s.val())),
        getAll: async () =>
            Object.entries(await (await dbRoot.child("relationships").once("value", (s) => s.val())).val()).map(
                (o) =>
                    (o = {
                        id: o[0],
                        ...o[1],
                    })
            ),
    },
    membersFactory: {
        fill: () => {
            let data = defaultTreeData
            database.membersManager.setAll(data.members)
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
