import * as React from "react";
import {Controller} from "react-hook-form";
import {ErrorMessage} from "@hookform/error-message";
import {Control} from "react-hook-form/dist/types";
import FormControl, {FormControlProps} from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DesktopDatePicker} from '@mui/x-date-pickers/DesktopDatePicker';
import {JSX, useState} from "react";
import dayjs, {Dayjs} from "dayjs";
import {APP_DATE_FORMAT, APP_TIME_FORMAT} from "../../constants/dates.constant";

interface Props {
    id: string;
    name: string;
    defaultDate?: Dayjs | Date | string;
    required?: boolean;
    type?: React.InputHTMLAttributes<unknown>['type'];
    label: string;
    variant?: 'outlined' | 'standard';
    control: Control<{ [p: string]: string }, any>;
    rules: any;
    errors: any;
    Icon?: JSX.Element;
    isTimeOnly?: boolean;
    formControlProps?: FormControlProps;
}

export const DatePicker = (props: Props) => {

    const [date, setDate] = useState<Dayjs | null | undefined>(props.defaultDate ? dayjs(props.defaultDate) : null);

    const handleChange = (newValue: Dayjs | null) => {
        setDate(newValue);
    };

    return (
        <FormControl margin={'normal'} fullWidth {...props.formControlProps}>
            <Controller
                name={props.name}
                control={props.control}
                rules={props.rules}
                render={({field: {onChange}, fieldState, ...restField}) =>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                            label={props.label}
                            inputFormat={props.isTimeOnly ? APP_TIME_FORMAT : APP_DATE_FORMAT}
                            value={date}
                            onChange={(event) => {
                                onChange(event);
                                handleChange(event as any);
                            }}
                            renderInput={(params: any) =>
                                <TextField
                                    {...params} id={props.id} label={props.label} variant="outlined"
                                    required={props.required} error={!!fieldState.error}
                                    helperText={<ErrorMessage errors={props.errors} name={props.name}/>}
                                    type={props.type}
                                />}
                            // @ts-ignore
                            views={props.isTimeOnly ? ['hours', 'minutes'] : undefined}
                        />
                    </LocalizationProvider>
                }
            />
        </FormControl>
    );
}
