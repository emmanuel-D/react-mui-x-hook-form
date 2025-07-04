import Typography from "@mui/material/Typography";
import {Clock} from "react-feather";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";
import {TimeAgo, TimeAgoProps} from "./TimeAgo";

export const DateTimeAgo = (props: TimeAgoProps & {iconSize?: number, sx?: SxProps<Theme>;}) => (
    <Typography fontSize={14} sx={props.sx}>
        <Clock size={props.iconSize ?? 16} style={{marginBottom: -2}}/>  <TimeAgo {...props}/>
    </Typography>
);
