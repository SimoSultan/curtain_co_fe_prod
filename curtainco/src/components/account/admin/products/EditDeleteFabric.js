import React, { useState, useEffect } from "react";

import FabricForm from "../../../reusable/FabricForm";
import {
    submitProductToDbAndUpdateState,
    deleteProduct,
} from "../../../../services/productServices";
import { useCurtainContext } from "../../../../config/CurtainCoContext";
import { ACTIONS } from "../../../../config/stateReducer";
import { getOneProductFromState } from "../../../../helpers/productHelpers";
import { isPhotoPresent } from "../../../../helpers/appHelpers";
import { uploadPhotoToS3 } from "../../../../services/uploadServices";

function EditDeleteFabric({ editProductId, setEditProductId }) {
    const { state, dispatch } = useCurtainContext();
    const [resetFile, setResetFile] = useState(false);
    const [previousProduct, setPreviousProduct] = useState(editProductId);
    const [photo, setPhoto] = useState({});
    const [fabric, setFabric] = useState({
        category: "Fabric",
        _id: "",
        name: "",
        colour: "",
        imgUrl: "",
        price: "",
        density: "",
        style: "",
        size: "",
        length: "",
        description: "",
    });

    function handleFileChange(file) {
        console.log(file);
        setPhoto(file);
    }

    useEffect(() => {
        // this resets the file in the FileInput component on
        // a product change / update to form
        if (editProductId !== previousProduct) {
            setPreviousProduct(editProductId);
            setResetFile(true);
        }
        // IF PRODUCT ID COMES THROUGH AS A PROP, SET THE FORM
        // OTHERWISE CLEAR THE FORM
        if (editProductId !== "") {
            const fabricBeingUpdated = getOneProductFromState(
                state.products,
                editProductId
            );
            setFabric({
                category: fabricBeingUpdated.category,
                _id: fabricBeingUpdated._id,
                name: fabricBeingUpdated.name,
                colour: fabricBeingUpdated.colour,
                imgUrl: fabricBeingUpdated.imgUrl,
                price: fabricBeingUpdated.price,
                density: fabricBeingUpdated.density,
                style: fabricBeingUpdated.style,
                size: fabricBeingUpdated.size,
                length: fabricBeingUpdated.length,
                description: fabricBeingUpdated.description,
            });
        } else {
            setFabric({
                category: "Fabric",
                _id: "",
                name: "",
                colour: "",
                imgUrl: "",
                price: "",
                density: "",
                style: "",
                size: "",
                description: "",
                length: "",
            });
        }
    }, [state.products, editProductId, previousProduct]);

    function handleTextChange(event) {
        setFabric({ ...fabric, [event.target.name]: event.target.value });
    }

    async function handleUpdateProduct() {
        // UPDATE THE PRODUCT ON THE DB
        // IF SUCCESSFUL, UPDATE PRODUCT IN GLOBAL STATE AND SHOW SUCCESS SNACKBAR
        let editProdError = false;
        let tempProduct = { ...fabric };
        let userIsUpdatingPhoto = isPhotoPresent(photo);

        // UPLOAD THE PHOTO TO S3
        if (userIsUpdatingPhoto) {
            try {
                let s3Resp = await uploadPhotoToS3(photo);
                console.log(s3Resp);
                if (s3Resp.status === 201) {
                    tempProduct.imgUrl = s3Resp.data.image.location;
                    setResetFile(true);
                    setPhoto({});
                }
            } catch (error) {
                editProdError = `Error ocurred when retrieving photo on update fabric: Error: ${error}.`;
                console.log(editProdError);
            }
        }

        // BLOCK THE UPDATE TO DATABASE IF THE IMAGE UPLOAD FAILED
        // editProdError WILL STILL BE FALSE IF THEY HAVEN'T UPLOADED A PHOTO
        // OR THERE WAS NO ERROR WHEN UPLOADING IT
        if (editProdError)
            return alert(
                "Something went wrong when uploading photo to storage on fabric"
            );

        // UPDATE THE DB
        let respOrError = await submitProductToDbAndUpdateState(
            tempProduct,
            "fabric",
            dispatch,
            ACTIONS,
            setResetFile,
            setPhoto
        );
        console.log(respOrError);
    }

    function handleRemoveProduct() {
        // DELETE THE PRODUCT ON THE DB
        // IF SUCCESSFUL, DELETE PRODUCT IN GLOBAL STATE AND SHOW SUCCESS SNACKBAR
        // THEN SET THE EDIT PRODUCT ID THAT THIS COMPONENT TAKES AS A PROP TO = "" TO RESET THE FORM
        deleteProduct(fabric)
            .then((resp) => {
                console.log(resp);
                if (resp.status === 202) {
                    dispatch({
                        type: ACTIONS.DELETE_PRODUCT,
                        payload: fabric._id,
                    });
                    dispatch({
                        type: ACTIONS.SET_SNACKBAR,
                        payload: {
                            open: true,
                            success: "success",
                            message: "Fabric successfully deleted",
                        },
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            });
        setEditProductId("");
    }

    // PASS IN TITLE AND TEXT FOR THE BUTTON TO THE Fabric FORM
    // PASS IN THE HANDLERS
    // PASS IN THE CURRENT FABRIC
    return (
        <FabricForm
            title={"Edit Fabric"}
            buttonText={"Update"}
            handleTextChange={handleTextChange}
            handleSubmit={handleUpdateProduct}
            handleRemove={handleRemoveProduct}
            product={editProductId === "" ? false : fabric}
            handleFileChange={handleFileChange}
            setResetFile={setResetFile}
            resetFile={resetFile}
        />
    );
}

export default EditDeleteFabric;
