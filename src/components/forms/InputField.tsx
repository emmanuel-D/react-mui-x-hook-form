import * as React from "react";
import {Controller} from "react-hook-form";
import {ErrorMessage} from "@hookform/error-message";
import {Control} from "react-hook-form/dist/types";
import FormControl, {FormControlProps} from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import {TextFieldProps} from "@mui/material/TextField/TextField";
import {JSX} from "react";

interface Props {
    id: string;
    name: string;
    required?: boolean;
    type?: React.InputHTMLAttributes<unknown>['type'];
    label: string;
    variant?: 'outlined' | 'standard';
    control: Control<{ [p: string]: string }, any>;
    rules: any;
    errors: any;
    Icon?: JSX.Element;
    EndIcon?: JSX.Element;
    textFieldProps?: TextFieldProps;
    formControlProps?: FormControlProps;
}

export const InputField = (props: Props) => {

    return (
        <FormControl margin={'normal'} fullWidth {...props.formControlProps}>
        <Controller
                name={props.name}
                control={props.control}
                rules={props.rules}
                render={({field, fieldState}) =>
                    <TextField
                        {...field} id={props.id} label={props.label} variant={props.variant ?? 'outlined'}
                        required={props.required} error={!!fieldState.error}
                        helperText={<ErrorMessage errors={props.errors} name={props.name}/>}
                        type={props.type}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    {props.Icon}
                                </InputAdornment>
                            ),
                            endAdornment: props.EndIcon ?
                                <InputAdornment position="end">
                                    {props.EndIcon}
                                </InputAdornment>
                                : undefined
                        }}
                        {...props.textFieldProps}
                    />
                }
            />
        </FormControl>
    );
}
