import React, { useState, useEffect, useRef } from "react"
// HELPERS AND SERVICES
import { logoutUser } from "../../services/authServices"
import { setErrorSnackBar } from "../../helpers/appHelpers"
// STATE
import { ACTIONS } from "../../config/stateReducer"
import { useCurtainContext } from "../../config/CurtainCoContext"
// STYLES
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Fab,
    Menu,
    MenuItem,
    Grid,
} from "@material-ui/core"
import useStyles from "./NavigationStyles"
// ICONS
import MenuIcon from "@material-ui/icons/Menu"
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown"
// COMPONENTS
import { Mobile, Desktop, Tablet } from "../reusable/Responsive"
// import MobileMenu from "./MobileMenu"
// PACKAGES
import { Link, withRouter } from "react-router-dom"

function NavBar() {
    const classes = useStyles()
    const { state, dispatch } = useCurtainContext()
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null)
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)
    const mobileMenuId = "app-bar-mobile"
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    // const mobileMenuItems = useRef()

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget)
    }

    const handleMobileMenuClose = (e) => {
        setMobileMoreAnchorEl(null)
    }

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    // function buildMenuItems(links) {
    //     let menuItems = []

    //     for (let i = 0; i < links.length; i++) {
    //         let place = links[i]
    //         if (place === "account" && state.currentUser !== null) {
    //             menuItems.push(
    //                 <MenuItem>
    //                     <Link
    //                         onClick={handleMobileMenuClose}
    //                         className={classes.link}
    //                         to={`/${place}`}
    //                     >
    //                         <Typography
    //                             variant="button"
    //                             className={classes.mobileMenuItemText}
    //                         >
    //                             {place}
    //                         </Typography>
    //                     </Link>
    //                 </MenuItem>
    //             )
    //         } else if (place === "login") {
    //         } else {
    //             menuItems.push(
    //                 <MenuItem>
    //                     <Link
    //                         onClick={handleMobileMenuClose}
    //                         className={classes.link}
    //                         to={place === "home" ? "/" : `/${place}`}
    //                     >
    //                         <Typography
    //                             variant="button"
    //                             className={classes.mobileMenuItemText}
    //                         >
    //                             {place}
    //                         </Typography>
    //                     </Link>
    //                 </MenuItem>
    //             )
    //         }
    //     }

    //     return menuItems
    // }

    // useEffect(() => {
    //     const mobileLinks = [
    //         "home",
    //         "collections",
    //         "products",
    //         "about",
    //         "cart",
    //         "account",
    //         "login",
    //         "logout",
    //     ]
    //     mobileMenuItems.current = buildMenuItems(
    //         mobileLinks,
    //         handleMobileMenuClose
    //     )
    // }, [buildMenuItems])

    function handleLogout(e) {
        e.preventDefault()

        logoutUser()
            .then((resp) => {
                console.log("Got back response on logout", resp)
                // logout the user locally
                if (resp.status === 204) {
                    dispatch({ type: ACTIONS.LOGOUT })
                    console.log("logging out")
                }
            })
            .catch((error) => {
                console.log(
                    "The server may be down - caught an exception on logout:",
                    error
                )
                setErrorSnackBar(
                    dispatch,
                    `Something went wrong and you were not logged out`
                )
            })
    }

    return (
        <>
            <Desktop>
                <AppBar
                    position="static"
                    color="transparent"
                    className={classes.appBar}
                >
                    <Toolbar>
                        <Link className={classes.link} to="/collections">
                            <Button color="inherit">Collections</Button>
                        </Link>

                        <Link className={classes.link} to="/products">
                            <Button color="inherit">Samples</Button>
                        </Link>

                        <Grid item container justify="center">
                            <Link className={classes.navbarLogoCont} to="/">
                                <img
                                    src="/CurtainCoLogo192.png"
                                    alt="the curtain co logo"
                                />
                                {/* <Button color="inherit">Home</Button> */}
                            </Link>
                        </Grid>

                        <Link className={classes.link} to="/about">
                            <Button color="inherit">About</Button>
                        </Link>

                        <Link className={classes.link} to="/cart">
                            <Button color="inherit">Cart</Button>
                        </Link>

                        {state.currentUser !== null ? (
                            <>
                                <Button
                                    color="inherit"
                                    className={classes.myAccountButton}
                                    onClick={handleMenu}
                                >
                                    My Account
                                    <ExpandMoreIcon />
                                </Button>

                                <Menu
                                    id="appbar-account-menu"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    open={open}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={handleClose}>
                                        <Link
                                            className={classes.link}
                                            to="/account"
                                            onClick={handleLogout}
                                        >
                                            {/* <Button
                                                color="inherit"
                                                onClick={handleLogout}
                                            > */}
                                            My Profile
                                            {/* </Button> */}
                                        </Link>
                                    </MenuItem>
                                    <MenuItem onClick={handleClose}>
                                        <Link
                                            className={classes.link}
                                            to="/"
                                            onClick={handleLogout}
                                        >
                                            {/* <Button
                                                color="inherit"
                                                onClick={handleLogout}
                                            > */}
                                            Logout
                                            {/* </Button> */}
                                        </Link>
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Link
                                className={classes.link}
                                to={{
                                    pathname: "/login",
                                    state: {
                                        prevUrl: window.location.href,
                                    },
                                }}
                            >
                                <Button color="inherit">Login</Button>
                            </Link>
                        )}
                    </Toolbar>
                </AppBar>
            </Desktop>

            {/* MOBILE STYLES */}

            <Mobile>
                <Link to={"/"} className={classes.link}>
                    <Typography variant="h4" className={classes.mobileHeader}>
                        THE CURTAIN CO
                    </Typography>
                </Link>
                <AppBar position="fixed" className={classes.appBar}>
                    <div className={classes.sectionMobile}>
                        <Fab
                            color="primary"
                            aria-label="menu"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            size="large"
                        >
                            <MenuIcon />
                        </Fab>
                    </div>

                    {/* {isMobileMenuOpen && (
                    <MobileMenu
                        handleLogout={handleLogout}
                        isMobileMenuOpen={isMobileMenuOpen}
                        mobileMenuId={mobileMenuId}
                        mobileMoreAnchorEl={mobileMoreAnchorEl}
                        handleMobileMenuClose={handleMobileMenuClose}
                    />
                )} */}

                    {/* {mobileMenuItems} */}
                    <Menu
                        anchorEl={mobileMoreAnchorEl}
                        anchorOrigin={{ vertical: "top", horizontal: "left" }}
                        getContentAnchorEl={null}
                        id={mobileMenuId}
                        keepMounted
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                        }}
                        open={isMobileMenuOpen}
                        onClose={handleMobileMenuClose}
                        position="fixed"
                        className
                    >
                        <MenuItem>
                            <Link
                                onClick={handleMobileMenuClose}
                                className={classes.link}
                                to={"/"}
                            >
                                <Typography
                                    variant="button"
                                    className={classes.mobileMenuItemText}
                                >
                                    home
                                </Typography>
                            </Link>
                        </MenuItem>

                        <MenuItem>
                            <Link
                                onClick={handleMobileMenuClose}
                                className={classes.link}
                                to={"/collections"}
                            >
                                <Typography
                                    variant="button"
                                    className={classes.mobileMenuItemText}
                                >
                                    collections
                                </Typography>
                            </Link>
                        </MenuItem>

                        <MenuItem>
                            <Link
                                onClick={handleMobileMenuClose}
                                className={classes.link}
                                to={"/products"}
                            >
                                <Typography
                                    variant="button"
                                    className={classes.mobileMenuItemText}
                                >
                                    products
                                </Typography>
                            </Link>
                        </MenuItem>

                        <MenuItem>
                            <Link
                                onClick={handleMobileMenuClose}
                                className={classes.link}
                                to={"/about"}
                            >
                                <Typography
                                    variant="button"
                                    className={classes.mobileMenuItemText}
                                >
                                    about
                                </Typography>
                            </Link>
                        </MenuItem>

                        <MenuItem>
                            <Link
                                onClick={handleMobileMenuClose}
                                className={classes.link}
                                to={"/cart"}
                            >
                                <Typography
                                    variant="button"
                                    className={classes.mobileMenuItemText}
                                >
                                    cart
                                </Typography>
                            </Link>
                        </MenuItem>

                        {state.currentUser !== null ? (
                            <>
                                <MenuItem>
                                    <Link
                                        onClick={handleMobileMenuClose}
                                        className={classes.link}
                                        to={"/account"}
                                    >
                                        <Typography
                                            variant="button"
                                            className={
                                                classes.mobileMenuItemText
                                            }
                                        >
                                            account
                                        </Typography>
                                    </Link>
                                </MenuItem>
                                <MenuItem>
                                    <Link
                                        onClick={handleMobileMenuClose}
                                        className={classes.link}
                                        to="/"
                                    >
                                        <Typography
                                            variant="button"
                                            color="inherit"
                                            onClick={handleLogout}
                                            className={
                                                classes.mobileMenuItemText
                                            }
                                        >
                                            Logout
                                        </Typography>
                                    </Link>
                                </MenuItem>
                            </>
                        ) : (
                            <MenuItem>
                                <Link
                                    onClick={handleMobileMenuClose}
                                    className={classes.link}
                                    to={{
                                        pathname: "/login",
                                        state: {
                                            prevUrl: window.location.href,
                                        },
                                    }}
                                >
                                    <Typography
                                        variant="button"
                                        color="inherit"
                                        className={classes.mobileMenuItemText}
                                    >
                                        Login
                                    </Typography>
                                </Link>
                            </MenuItem>
                        )}
                    </Menu>
                </AppBar>
            </Mobile>

            {/* TABLET STYLES */}

            <Tablet>
                <Typography variant="h4" className={classes.mobileHeader}>
                    Tablet
                </Typography>
            </Tablet>
        </>
    )
}

export default withRouter(NavBar)
