import React, { useState } from "react"

import Container from "@material-ui/core/Container"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import useStyles from "../../user/UserDashboardStyles"

import { useCurtainContext } from "../../../../config/CurtainCoContext"
import { ACTIONS } from "../../../../config/stateReducer"
import {
    getFirstNameFromFullName,
    getLastNameFromFullName,
} from "../../../../helpers/userHelpers"
import { updateUserInformation } from "../../../../services/userServices"
import ShowUserInformation from "../../user/ShowUserInformation"
import EditUserInformation from "../../user/EditUserInformation"
import {
    setErrorSnackBar,
    setSuccessSnackBar,
} from "../../../../helpers/appHelpers"

function AdminProfile() {
    const classes = useStyles()
    const { state, dispatch } = useCurtainContext()
    const [editUser, setEditUser] = useState(false)

    function toggleEditUserForm() {
        setEditUser(!editUser)
    }

    function handleUpdate(userDetails) {
        let updateError = false
        let userId = state.currentUser._id

        updateUserInformation(userDetails, userId)
            .then((resp) => {
                if (resp.status === 200) {
                    dispatch({
                        type: ACTIONS.SET_CURRENT_USER,
                        payload: resp.data,
                    })
                    setSuccessSnackBar(dispatch, "User successfully updated")
                    console.log("User successfully updated")
                }
            })
            .catch((error) => {
                updateError = `An error ocurred on updating user information: ${error.response}`
                console.log(updateError)
                setErrorSnackBar(
                    dispatch,
                    "Error: Something went wrong, profile not updated"
                )
            })

        toggleEditUserForm()
        return updateError
    }

    return (
        <Container>
            <Typography variant="h5" className={classes.heading}>
                {`${getFirstNameFromFullName(
                    state.currentUser.fullName
                )} ${getLastNameFromFullName(state.currentUser.fullName)}`}
            </Typography>

            {editUser ? (
                <EditUserInformation
                    user={state.currentUser}
                    handleUpdate={handleUpdate}
                />
            ) : (
                <ShowUserInformation user={state.currentUser} />
            )}

            <Button
                variant="outlined"
                color="primary"
                onClick={toggleEditUserForm}
            >
                {editUser ? "Back" : "Edit Information"}
            </Button>
        </Container>
    )
}

export default AdminProfile
