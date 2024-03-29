import React, { useEffect, useState } from "react"
// STYLES
import {
    Checkbox,
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableHead,
    Paper,
    Button,
    IconButton,
    useTheme,
} from "@material-ui/core"
import useStyles from "../AdminStyles"
// COMPONENTS
import Title from "../../../reusable/Title"
// HELPERS AND SERVICES
import {
    getFirstNameFromFullName,
    getLastNameFromFullName,
} from "../../../../helpers/userHelpers"
import {
    displayShortDate,
    setSuccessSnackBar,
    setErrorSnackBar,
    setWarningSnackBar,
} from "../../../../helpers/appHelpers"
import {
    getAllConsultations,
    markConsultationCompleted,
    removeConsultation,
} from "../../../../services/consultationServices"
// STATE
import { useCurtainContext } from "../../../../config/CurtainCoContext"
import { ACTIONS } from "../../../../config/stateReducer"
import DeleteIcon from "@material-ui/icons/Delete"

export default function AllConsults() {
    const classes = useStyles()
    const { state, dispatch } = useCurtainContext()
    const [isConsultUpdated, setIsConsultUpdated] = useState(false)
    // const theme = useTheme()

    useEffect(() => {
        getAllConsultations()
            .then((resp) => {
                if (resp.status === 200) {
                    // console.log("---CONSULTATIONS---")
                    // console.log(resp.data)
                    dispatch({
                        type: ACTIONS.SET_ALL_CONSULTATIONS,
                        payload: resp.data,
                    })
                    setIsConsultUpdated(false)
                } else {
                    console.log(
                        "status code wasn't correct when getting all consultations"
                    )
                }
            })
            .catch((error) => {
                console.log(error.response)
                setErrorSnackBar(
                    dispatch,
                    "Error: Something went wrong when fetching all consultations"
                )
            })
    }, [dispatch, isConsultUpdated])

    function handleConsultationCheckbox(event) {
        const checked = event.target.checked
        const consultId = event.currentTarget.parentNode.parentNode.id
        markConsultationCompleted(consultId, { isProcessed: checked })
            .then((resp) => {
                // console.log("---UPDATED CONSULTATION---")
                // console.log(resp.data)
                if (resp.status === 200) {
                    dispatch({
                        type: ACTIONS.UPDATE_CONSULTATION,
                        payload: resp.data,
                    })
                    setSuccessSnackBar(dispatch, "Consult successfully updated")
                }
            })
            .catch((error) => {
                console.log(
                    `Something went wrong when updating the consultation: ${error.response}`
                )
                setErrorSnackBar(
                    dispatch,
                    "Error: Something went wrong and consultation was not updated"
                )
            })
    }

    function handleMessageButton(event) {
        const consultId = event.currentTarget.parentNode.parentNode.id
        const consult = state.consults.find((cons) => cons._id === consultId)
        dispatch({
            type: ACTIONS.SET_MODAL,
            payload: {
                open: true,
                data: consult,
                consultSummary: true,
            },
        })
    }

    function handleRemove(event) {
        const consultId = event.currentTarget.parentNode.parentNode.id

        // CATCH AN ACCIDENTAL PRESS OF THE DELETE BUTTON
        if (!window.confirm("Are you sure wish to delete this request?")) {
            return
        }

        removeConsultation(consultId)
            .then((resp) => {
                dispatch({
                    type: ACTIONS.DELETE_CONSULTATION,
                    payload: resp.data,
                })
                setWarningSnackBar(dispatch, "Consult Removed.")
                setIsConsultUpdated(true)
            })
            .catch((error) => {
                setErrorSnackBar(
                    dispatch,
                    "There was a problem deleting the consultation."
                )
                console.log(
                    "Problem Removing the consultation.",
                    error.response
                )
            })
    }

    // REMOVE ADMIN ROLE FROM LIST

    const userRow = state.consults.map((cons) => (
        <TableRow key={cons._id} id={cons._id} hover>
            <TableCell>
                <Checkbox
                    color="primary"
                    checked={cons.isProcessed}
                    inputProps={{ "aria-label": "secondary checkbox" }}
                    onClick={handleConsultationCheckbox}
                />
            </TableCell>
            <TableCell
                className={cons.isProcessed ? classes.checkboxSelected : ""}
            >
                {displayShortDate(cons.createdAt)}
            </TableCell>
            <TableCell
                className={cons.isProcessed ? classes.checkboxSelected : ""}
            >
                {`${getFirstNameFromFullName(cons.fullName)} 
                ${getLastNameFromFullName(cons.fullName)}`}
            </TableCell>
            <TableCell
                className={cons.isProcessed ? classes.checkboxSelected : ""}
            >
                {cons.email}
            </TableCell>
            <TableCell
                className={cons.isProcessed ? classes.checkboxSelected : ""}
            >
                {cons.phone}
            </TableCell>
            <TableCell
                className={cons.isProcessed ? classes.checkboxSelected : ""}
            >
                {`${cons.suburb}, ${cons.state}`}
            </TableCell>
            <TableCell>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleMessageButton}
                    value={`${cons.fullName}/${cons.message}`}
                >
                    View
                </Button>
            </TableCell>
            <TableCell>
                <IconButton onClick={handleRemove} disabled={!cons.isProcessed}>
                    <DeleteIcon
                        color={cons.isProcessed ? "error" : "disabled"}
                    />
                </IconButton>
            </TableCell>
        </TableRow>
    ))

    return (
        <Paper className={classes.paper}>
            <Title>All Consultations</Title>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Done</TableCell>
                        <TableCell>Requested On</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Address</TableCell>
                        <TableCell>Message</TableCell>
                        <TableCell>Remove</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>{userRow}</TableBody>
            </Table>
        </Paper>
    )
}
