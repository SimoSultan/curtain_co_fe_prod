import React from "react";

import { Typography, Grid, TextField, Button } from "@material-ui/core";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import DeleteIcon from "@material-ui/icons/Delete";
import useStyles from "../../components/account/admin/AdminStyles";

function TrackForm({
    title,
    buttonText,
    handleTextChange,
    handleRadioChange,
    handleSubmit,
    product,
    handleRemove,
}) {
    const classes = useStyles();
    return (
        <>
            <Typography variant="h6">{title}</Typography>
            <Grid container spacing={2} justify="center" alignItems="center">
                <Grid item xs={12}>
                    <TextField
                        id="track-input"
                        label="Track Name"
                        variant="outlined"
                        name="name"
                        fullWidth
                        onChange={handleTextChange}
                        value={product.name}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="track-description-input"
                        label="Description"
                        variant="outlined"
                        name="description"
                        multiline
                        fullWidth
                        onChange={handleTextChange}
                        value={product.description}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        id="track-type-input"
                        label="Track Type"
                        variant="outlined"
                        name="type"
                        fullWidth
                        onChange={handleTextChange}
                        value={product.type}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        id="track-color-input"
                        label="Track Colour"
                        variant="outlined"
                        name="colour"
                        fullWidth
                        onChange={handleTextChange}
                        value={product.colour}
                    />
                </Grid>
                <Grid
                    item
                    container
                    justify="center"
                    alignItems="center"
                    xs={12}
                >
                    {/* IF PRODUCT.SINGLE IS EMPTY, DONT SELECT ANYTHING */}
                    {/* OTHERWISE CHANGE TRUE -> SINGLE AND FALSE -> DOUBLE */}
                    <RadioGroup
                        aria-label="single-double-input"
                        name="single"
                        onChange={handleRadioChange}
                        fullWidth
                        row
                        value={
                            product.single === ""
                                ? null
                                : product.single
                                ? "single"
                                : "double"
                        }
                    >
                        <FormControlLabel
                            value="single"
                            control={<Radio />}
                            label="Single"
                        />
                        <FormControlLabel
                            value="double"
                            control={<Radio />}
                            label="Double"
                        />
                    </RadioGroup>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        id="track-finial-style-input"
                        label="Finial Style"
                        variant="outlined"
                        name="finialStyle"
                        fullWidth
                        onChange={handleTextChange}
                        value={product.finialStyle}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        id="track-finial-color-input"
                        label="Finial Colour"
                        variant="outlined"
                        name="finialColour"
                        fullWidth
                        onChange={handleTextChange}
                        value={product.finialColour}
                    />
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        id="track-fix-location-input"
                        label="Fix Location"
                        variant="outlined"
                        name="location"
                        fullWidth
                        onChange={handleTextChange}
                        value={product.location}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        id="track-price-input"
                        label="Price"
                        variant="outlined"
                        type="number"
                        name="price"
                        fullWidth
                        onChange={handleTextChange}
                        value={product.price}
                    />
                </Grid>
                {product ? (
                    <Grid
                        item
                        container
                        justify="space-between"
                        alignItems="center"
                        xs={12}
                    >
                        {/* IF THE REMOVE HANDLER WAS PASSED IN, SHOW THE DELETE BUTTON */}
                        <Grid item>
                            {handleRemove ? (
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<DeleteIcon />}
                                    onClick={handleRemove}
                                >
                                    Delete
                                </Button>
                            ) : (
                                ""
                            )}
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                            >
                                {buttonText}
                            </Button>
                        </Grid>
                    </Grid>
                ) : (
                    ""
                )}
            </Grid>
        </>
    );
}

export default TrackForm;
