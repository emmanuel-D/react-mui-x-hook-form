import * as React from "react";
import {Controller} from "react-hook-form";
import {ErrorMessage} from "@hookform/error-message";
import {Control} from "react-hook-form/dist/types";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import MuiCheckbox from "@mui/material/Checkbox";

interface Props {
    id: string;
    name: string;
    label: string;
    control: Control<{ [p: string]: string }, any>;
    rules: any;
    errors: any;
    defaultChecked?: boolean;
}

export const Checkbox = (props: Props) => {

    return (
        <FormControl margin={'normal'} fullWidth>
            <Controller
                name={props.name as any}
                control={props.control as any}
                rules={props.rules}
                render={({field, fieldState}) =>
                    <FormControlLabel
                        label={props.label}
                        control={
                            <MuiCheckbox
                                // @ts-ignore
                                {...field} id={props.id} label={props.label}
                                defaultChecked={!!props.defaultChecked} error={!!fieldState.error}
                                helperText={<ErrorMessage errors={props.errors} name={props.name}/>}
                            />
                        }
                    />
                }
            />
        </FormControl>
    );
}
