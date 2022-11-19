import { Drivers, Storage } from '@ionic/storage'
import { useEffect, useState } from 'react'
import cordovaSQLiteDriver, * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver'

const TODOS_KEY = 'my-key'

interface Folder {
    title: string,
    id: string,
    tasks: Task[]
}
interface Task {
    title: string,
    date: string,
    done: boolean,
    folder: string,
    id: string
}
const useStorage = () => {
    const [store, setStore] = useState<Storage>()
    const [data, setData] = useState<Folder[]>()

    useEffect(()=> {
        const initStorage = async () => {
            const newStore = new Storage({
                name: 'main',
                driverOrder: [cordovaSQLiteDriver._driver, Drivers.IndexedDB, Drivers.LocalStorage]
            })
            const store = await newStore.create()
            setStore(store)

            const storedTodos = await store.get(TODOS_KEY) || []
            
            setData(storedTodos)
        }
        initStorage()
    },[])

    const updateData = async (newData:Folder[]) => {
        const tempData = JSON.parse(JSON.stringify(newData))
        setData(tempData)
        store?.set(TODOS_KEY, tempData)
    }
    return {data, updateData}
}

export {useStorage}