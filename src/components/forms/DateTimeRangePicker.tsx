import * as React from "react";
import {Controller} from "react-hook-form";
import {ErrorMessage} from "@hookform/error-message";
import {Control} from "react-hook-form";
import FormControl, {FormControlProps} from "@mui/material/FormControl";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DateTimePicker as MuiDateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import {Grid, Typography} from "@mui/material";
import {Calendar} from "react-feather";
import {Dayjs} from "dayjs";
import {APP_DATE_FORMAT, APP_TIME_FORMAT} from "../../constants/dates.constant";

interface Props {
    startName: string;
    endName: string;
    label?: string;
    startLabel?: string;
    endLabel?: string;
    required?: boolean;
    control: Control<{ [key: string]: any }, any>;
    rules?: {
        start?: any;
        end?: any;
    };
    errors?: any;
    formControlProps?: FormControlProps;
    minDateTime?: Dayjs;
    maxDateTime?: Dayjs;
}

export const DateTimeRangePicker = ({
                                        startName,
                                        endName,
                                        control,
                                        label,
                                        startLabel,
                                        endLabel,
                                        required,
                                        rules,
                                        errors,
                                        formControlProps,
                                        minDateTime,
                                        maxDateTime,
                                    }: Props) => {
    const [startDT, setStartDT] = React.useState<Dayjs | null>(null);
    const [endDT, setEndDT] = React.useState<Dayjs | null>(null);

    return (
        <FormControl fullWidth margin="normal" {...formControlProps}>
            {label && (
                <Typography variant="subtitle2" mb={1}>
                    {label} {required && "*"}
                </Typography>
            )}

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid container spacing={2}>
                    {/* Start DateTime */}
                    <Grid size={{xs: 6}}>
                        <Controller
                            name={startName}
                            control={control}
                            rules={rules?.start}
                            render={({field: {onChange, ref}, fieldState}) => (
                                <MuiDateTimePicker
                                    label={startLabel ?? "Start Date & Time"}
                                    value={startDT}
                                    onChange={(newValue) => {
                                        setStartDT(newValue);
                                        onChange(newValue);
                                        if (endDT && newValue && endDT.isBefore(newValue)) {
                                            setEndDT(null);
                                        }
                                    }}
                                    format={`${APP_DATE_FORMAT} ${APP_TIME_FORMAT}`}
                                    minDateTime={minDateTime}
                                    maxDateTime={maxDateTime}
                                    slotProps={{
                                        textField: {
                                            inputRef: ref,
                                            required,
                                            variant: "outlined",
                                            error: !!fieldState.error,
                                            helperText: (
                                                <ErrorMessage errors={errors} name={startName}/>
                                            ),
                                            InputProps: {
                                                endAdornment: <Calendar/>,
                                            },
                                        },
                                    }}
                                />
                            )}
                        />
                    </Grid>

                    {/* End DateTime */}
                    <Grid size={{xs: 6}}>
                        <Controller
                            name={endName}
                            control={control}
                            rules={rules?.end}
                            render={({field: {onChange, ref}, fieldState}) => (
                                <MuiDateTimePicker
                                    label={endLabel ?? "End Date & Time"}
                                    value={endDT}
                                    onChange={(newValue) => {
                                        setEndDT(newValue);
                                        onChange(newValue);
                                    }}
                                    format={`${APP_DATE_FORMAT} ${APP_TIME_FORMAT}`}
                                    minDateTime={startDT || minDateTime}
                                    maxDateTime={maxDateTime}
                                    slotProps={{
                                        textField: {
                                            inputRef: ref,
                                            required,
                                            variant: "outlined",
                                            error: !!fieldState.error,
                                            helperText: (
                                                <ErrorMessage errors={errors} name={endName}/>
                                            ),
                                            InputProps: {
                                                endAdornment: <Calendar/>,
                                            },
                                        },
                                    }}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            </LocalizationProvider>
        </FormControl>
    );
};
