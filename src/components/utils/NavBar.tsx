import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";
import IconButton from "@mui/material/IconButton";
import {ArrowLeft} from "react-feather";
import {TypographyProps} from "@mui/material/Typography/Typography";
import Box from "@mui/material/Box";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles/createTheme";

interface Props {
    showBackButton?: boolean;
    onBackButtonClicked: () => any;
    title: string | React.ReactNode;
    titleProps?: TypographyProps;
    RightComponent?: React.ReactNode;
    sxContainer?: SxProps<Theme>;
}
export const NavBar = (props: Props) => {

    const {title, titleProps, showBackButton, RightComponent} = props;

    return (
        <Stack direction={'row'} alignItems={'center'} mb={1.5} columnGap={1.5} sx={props.sxContainer}>
            {
              showBackButton &&
              <IconButton onClick={props.onBackButtonClicked}>
                  <ArrowLeft size={27}/>
              </IconButton>
            }
            {
                typeof title === 'string' ?
                    <Typography fontWeight={"bolder"} variant={"h5"} textAlign={"left"} {...titleProps} width={'100%'}>
                        {title}
                    </Typography>
                    :
                    <>
                        {title}
                        <Box sx={{flexGrow: 1}}/>
                    </>
            }
            {RightComponent}
        </Stack>
    );
}
