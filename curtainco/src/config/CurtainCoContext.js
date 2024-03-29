import React, { useReducer, createContext, useContext } from "react"
import stateReducer from "./stateReducer"

const Context = createContext()

export function useCurtainContext() {
    return useContext(Context)
}

function CurtainContext({ children }) {
    // initial state for state reducer
    const initialState = {
        currentUser: null,
        users: [],
        timeOut: null,
        snackbar: {
            severity: "success",
            message: "",
            open: false,
        },
        modal: {
            open: false,
            title: "",
            message: "",
            data: {},
            paymentSummary: false,
            orderSummary: false,
            consultSummary: false,
            productSummary: false
        },
        alert: {
            severity: "success",
            message: ""
        },
        products: [],
        collections: [],
        customizedCollection: { track: [], fabric: [], accessory: [] },
        consults: [],
        orders: [],
        cartLength: 0,
        discounts: {
            mostProductsMultiplier: 0.85,
            someProductsMultiplier: 0.87,
            littleProductsMultiplier: 0.89,
        },
    }

    const [state, dispatch] = useReducer(stateReducer, initialState)

    return (
        <Context.Provider value={{ state, dispatch }}>
            {children}
        </Context.Provider>
    )
}

export default CurtainContext
