import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {Check} from "react-feather";
import React from "react";

interface Props {
    isOpen: boolean;
    closeDialog: (...params: any) => any;
    onAgreeClicked: (...params: any) => any;
    title?: string;
    description?: string;
    hideCancelButton?: boolean;
    hideOkButton?: boolean;
    Buttons?: React.JSX.Element[];
}

export const ConfirmDialog = (props: Props) => {

    return (
        <Dialog
            open={props.isOpen}
            onClose={props.closeDialog}
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
        >
            <DialogTitle id="confirm-dialog-title">
                {props.title ?? "Do you confirm this action ?"}
            </DialogTitle>
            <DialogContent>
                {
                    props.description &&
                    <DialogContentText id="confirm-dialog-description" whiteSpace={'pre-line'}>
                        {props.description}
                    </DialogContentText>
                }
            </DialogContent>
            <DialogActions sx={{columnGap: 1}}>
                {
                    !props.hideCancelButton &&
                    <Button onClick={props.closeDialog}>Cancel</Button>
                }
                {
                    props.Buttons?.map((Button, index) => Button)
                }
                {
                    !props.hideOkButton &&
                    <Button onClick={props.onAgreeClicked} autoFocus endIcon={<Check/>} variant={'contained'}>
                        Agree
                    </Button>
                }
            </DialogActions>
        </Dialog>
    );
}
