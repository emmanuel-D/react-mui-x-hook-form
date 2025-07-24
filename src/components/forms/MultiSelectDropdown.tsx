import FormControl, {FormControlProps} from "@mui/material/FormControl";
import * as React from "react";
import {Control} from "react-hook-form/dist/types";
import {Controller} from "react-hook-form";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {ErrorMessage} from "@hookform/error-message";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import {useEffect, useState} from "react";
import _ from "lodash";
import _x from "@manu_omg/lodash-x";
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
    defaultValueIds?: string[];
    options: AppSelectOption<T>[];
    setMultiValueOnChange: (selectedValuesIds: string[]) => void;
    isOptionDisable?: (option: T) => boolean;
    type?: React.InputHTMLAttributes<unknown>['type'];
    label: string;
    variant?: 'outlined' | 'standard';
    control: Control<{ [p: string]: string }, any>;
    rules: any;
    errors: any;
    Icon?: JSX.Element;
    renderValues?: (valueIds: string[]) => React.ReactNode;
    selectFieldProps?: SelectProps;
    formControlProps?: FormControlProps;
}

export function MultiSelectDropdown<T>(props: Props<T>) {

    const [selectedValuesIds, setSelectedValuesIds] = useState<string[]>([]);

    const handleValuesChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const nextSelectedIds: string[] = _.uniq([...event.target.value as string[]]);
        setSelectedValuesIds(nextSelectedIds);
        props.setMultiValueOnChange(nextSelectedIds);
    }

    useEffect(() => {
        if (props.defaultValueIds?.length && selectedValuesIds.length === 0) {
            setSelectedValuesIds(props.defaultValueIds as string[]);
            props.setMultiValueOnChange(props.defaultValueIds as string[]);
        }
    }, [props.defaultValueIds]);

    return (
        <FormControl variant={props.variant ?? 'outlined'} fullWidth {...props.formControlProps}>
            <InputLabel>{props.label}</InputLabel>
            <Controller
                name={props.name as any}
                control={props.control as any}
                defaultValue={props.defaultValueIds as any}
                rules={props.rules}
                render={({field, fieldState, formState}) => (
                    <>
                        <Select
                            variant={props.variant ?? 'outlined'}
                            {...field} id={props.id} label={props.label}
                            multiple
                            value={selectedValuesIds as any}
                            onChange={handleValuesChange as any}
                            error={fieldState.invalid}
                            renderValue={props.renderValues as any}
                            {...props.selectFieldProps}
                        >
                            {
                                props.options?.map((item, index) => {
                                    return (
                                        <MenuItem
                                            key={index} value={item.id as any} dense
                                            disabled={(props.isOptionDisable && props.isOptionDisable(item as any)) as boolean}
                                        >
                                            <Checkbox checked={_x.doesArrayContainsOneOrMore(selectedValuesIds, [item.id])}/>
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
