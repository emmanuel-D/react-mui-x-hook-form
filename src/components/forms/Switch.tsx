import * as React from "react";
import {Controller} from "react-hook-form";
import {ErrorMessage} from "@hookform/error-message";
import {Control} from "react-hook-form/dist/types";
import FormControl, {FormControlProps} from "@mui/material/FormControl";
import MuiSwitch from '@mui/material/Switch';
import FormControlLabel from "@mui/material/FormControlLabel";

interface Props {
    id: string;
    name: string;
    label: string;
    control: Control<{ [p: string]: string }, any>;
    rules: any;
    errors: any;
    defaultChecked?: boolean;
    formControlProps?: FormControlProps;
}

export const Switch = (props: Props) => {
    return (
        <FormControl margin="normal" fullWidth {...props.formControlProps}>
            <Controller
                name={props.name as any}
                control={props.control as any}
                rules={props.rules}
                render={({ field, fieldState }) => (
                    <FormControlLabel
                        label={props.label}
                        control={
                            <MuiSwitch
                                id={props.id}
                                checked={!!field.value} // 👈 controlled by RHF
                                onChange={(e) => field.onChange(e.target.checked)} // 👈 pass boolean back
                            />
                        }
                    />
                )}
            />
            <ErrorMessage errors={props.errors} name={props.name} />
        </FormControl>
    );
};

