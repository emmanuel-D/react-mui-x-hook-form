import * as React from "react";
import {Controller} from "react-hook-form";
import {ErrorMessage} from "@hookform/error-message";
import {Control} from "react-hook-form";
import FormControl, {FormControlProps} from "@mui/material/FormControl";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {TimePicker as MuiTimePicker} from "@mui/x-date-pickers/TimePicker";
import {Grid, Typography} from "@mui/material";
import {Clock} from "react-feather";
import {Dayjs} from "dayjs";
import {APP_TIME_FORMAT} from "../../constants/dates.constant";

interface Props {
    startName: string;
    endName: string;
    label?: string;
    startLabel?: string;
    endlabel?: string;
    required?: boolean;
    control: Control<{ [key: string]: any }, any>;
    rules?: {
        start?: any;
        end?: any;
    };
    errors?: any;
    formControlProps?: FormControlProps;
    minTime?: Dayjs;
    maxTime?: Dayjs;
}

/**
 * Usage:
 * ```tsx
 * <TimeRangePicker
 *   label="Meeting Time"
 *   startName="meetingStart"
 *   endName="meetingEnd"
 *   control={control}
 *   errors={errors}
 * />
 * ```
 *
 * @param startName
 * @param endName
 * @param control
 * @param label
 * @param startLabel
 * @param endlabel
 * @param required
 * @param rules
 * @param errors
 * @param formControlProps
 * @param minTime
 * @param maxTime
 * @constructor
 */
export const TimeRangePicker = ({
                                    startName,
                                    endName,
                                    control,
                                    label,
                                    startLabel,
                                    endlabel,
                                    required,
                                    rules,
                                    errors,
                                    formControlProps,
                                    minTime,
                                    maxTime,
                                }: Props) => {
    const [startTime, setStartTime] = React.useState<Dayjs | null>(null);
    const [endTime, setEndTime] = React.useState<Dayjs | null>(null);

    return (
        <FormControl fullWidth margin="normal" {...formControlProps}>
            {label && (
                <Typography variant="subtitle2" mb={1}>
                    {label} {required && "*"}
                </Typography>
            )}

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid container spacing={2}>
                    {/* Start Time */}
                    <Grid size={{xs: 6}}>
                        <Controller
                            name={startName}
                            control={control}
                            rules={rules?.start}
                            render={({field: {onChange, ref}, fieldState}) => (
                                <MuiTimePicker
                                    label={startLabel ?? "Start Time"}
                                    value={startTime}
                                    onChange={(newValue) => {
                                        setStartTime(newValue);
                                        onChange(newValue);
                                        if (endTime && newValue && endTime.isBefore(newValue)) {
                                            setEndTime(null);
                                        }
                                    }}
                                    format={APP_TIME_FORMAT}
                                    minTime={minTime}
                                    maxTime={maxTime}
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
                                                startAdornment: <Clock size={16}/>,
                                            },
                                        },
                                    }}
                                />
                            )}
                        />
                    </Grid>

                    {/* End Time */}
                    <Grid size={{xs: 6}}>
                        <Controller
                            name={endName}
                            control={control}
                            rules={rules?.end}
                            render={({field: {onChange, ref}, fieldState}) => (
                                <MuiTimePicker
                                    label={endlabel ?? "End Time"}
                                    value={endTime}
                                    onChange={(newValue) => {
                                        setEndTime(newValue);
                                        onChange(newValue);
                                    }}
                                    format={APP_TIME_FORMAT}
                                    minTime={startTime || minTime}
                                    maxTime={maxTime}
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
                                                startAdornment: <Clock size={16}/>,
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
