import FormControl, {FormControlProps} from "@mui/material/FormControl";
import * as React from "react";
import {Control} from "react-hook-form/dist/types";
import {Controller} from "react-hook-form";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {ErrorMessage} from "@hookform/error-message";
import Typography from "@mui/material/Typography";
import {SelectProps} from "@mui/material/Select/Select";
import {JSX} from "react";

export interface AppSelectOption<T> {
    id: string | number;
    value: T;
    label: string
}

interface Props<T> {
    id: string;
    name: string;
    required?: boolean;
    defaultValueId?: string;
    options: AppSelectOption<T>[];
    isOptionDisable?: (option: T) => boolean;
    type?: React.InputHTMLAttributes<unknown>['type'];
    label: string;
    variant?: 'outlined' | 'standard';
    control: Control<{ [p: string]: string }, any>;
    rules: any;
    errors: any;
    Icon?: JSX.Element;
    selectFieldProps?: SelectProps;
    formControlProps?: FormControlProps;
}

export function SelectDropdown<T>(props: Props<T>) {

    return (
        <FormControl variant={props.variant ?? 'outlined'} fullWidth {...props.formControlProps}>
            <InputLabel>{props.label}</InputLabel>
            <Controller
                name={props.name as any}
                control={props.control as any}
                defaultValue={props.defaultValueId as any}
                rules={props.rules}
                render={({field, fieldState, formState}) => (
                    <>
                        <Select
                            variant={props.variant ?? 'outlined'}
                            {...field} id={props.id} label={props.label}
                            value={field?.value || ''}
                            error={fieldState.invalid}
                            {...props.selectFieldProps}
                        >
                            {
                                props.options?.map((item, index) => {
                                    return (
                                        <MenuItem
                                            key={index} value={item.id as any}
                                            disabled={(props.isOptionDisable && props.isOptionDisable(item as any)) as boolean}
                                        >
                                            {item.label}
                                        </MenuItem>
                                    );
                                })
                            }
                        </Select>
                        <Typography color={'red'} variant={'body2'}>
                            <ErrorMessage errors={props.errors} name={props.name}/>
                        </Typography>
                    </>
                )}
            />
        </FormControl>
    );
}
