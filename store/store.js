import create from "zustand";
import { persist, devtools } from "zustand/middleware";

let store = (set) => ({
    user: "",
    setUser: (newUser) =>{
        set({
            user: newUser
        })
    },
});

store = persist(store, {name: "store"})
store = devtools(store, {name: "store"})

export const useStore = create(store);
