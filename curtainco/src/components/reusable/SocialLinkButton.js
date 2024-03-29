import { IconButton } from "@material-ui/core"
import React from "react"
import { useTheme } from "@material-ui/core"

function SocialLinkButton({ text, link }) {
    const theme = useTheme()
    return (
        <IconButton
            color="primary"
            size="medium"
            style={{
                border: `1px solid ${theme.palette.primary.main}`,
                width: "70%",
                height: "60%",
            }}
        >
            <a
                href={link}
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: "none" }}
            >
                {text}
            </a>
        </IconButton>
    )
}

export default SocialLinkButton
