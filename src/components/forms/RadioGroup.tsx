import * as React from "react";
import {Controller} from "react-hook-form";
import {ErrorMessage} from "@hookform/error-message";
import {Control} from "react-hook-form/dist/types";
import FormControl, {FormControlProps} from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import MuiRadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import {FormHelperText} from "@mui/material";

interface Props<T> {
    id: string;
    name: string;
    radioOptions: RadioOption<T>[];
    required?: boolean;
    type?: React.InputHTMLAttributes<unknown>['type'];
    label: string;
    variant?: 'outlined' | 'standard';
    control: Control<{ [p: string]: string }, any>;
    rules: any;
    errors: any;
    formControlProps?: FormControlProps;
}

export function RadioGroup<T>(props: Props<T>)  {

    return (
        <FormControl margin={'normal'} fullWidth {...props.formControlProps}>
            <Controller
                name={props.name}
                control={props.control}
                rules={props.rules}
                render={({field, fieldState}) =>
                    <>
                        <FormLabel id="demo-radio-buttons-group-label">
                            {props.label}
                        </FormLabel>
                        <MuiRadioGroup
                            {...field}
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue={null}
                            name="radio-buttons-group"
                            sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between',}}
                        >
                            {
                                props.radioOptions.map((option, index) => (
                                    <FormControlLabel
                                        key={index}
                                        value={option.value}
                                        control={<Radio/>}
                                        label={option.label}
                                    />
                                ))
                            }
                        </MuiRadioGroup>
                        <FormHelperText sx={{color: 'error.main'}}>
                            <ErrorMessage errors={props.errors} name={props.name}/>
                        </FormHelperText>
                    </>
                }
            />
        </FormControl>
    );
}

export interface RadioOption<V> {
    value: V;
    label: string;
}
