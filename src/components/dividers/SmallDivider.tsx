import Box from "@mui/material/Box";
import React from "react";
import {SxProps} from "@mui/system/styleFunctionSx";

interface Props {
    sx?: SxProps<any>;
}
export const SmallDivider = (props: Props) => (
    <Box display="flex" justifyContent="center">
        <Box sx={{backgroundColor: '#000', height: 7, width: 120, borderRadius: 23, m: 2, ...props.sx}}/>
    </Box>
);
