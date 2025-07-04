import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material";

interface Props {
    sxContainer?: SxProps<Theme>;
    sxDivider?: SxProps<Theme>;
}

export const SectionDivider = (props: Props) => {
    return (
        <Box sx={props.sxContainer} display={'flex'} justifyContent={"center"}>
            <Divider
                textAlign={'center'}
                sx={{
                    width: 200,
                    borderBottomWidth: 10,
                    borderRadius: 23,
                    borderColor: 'primary.main',
                    ...props?.sxDivider
                }}
            />
        </Box>
    );
}
