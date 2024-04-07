/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Card from '@mui/material/Card';
import AspectRatio from '@mui/joy/AspectRatio';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';

export default function DropZone(props) {
    const { icon, sx, ...other } = props;

    return (
        <Card
            variant="soft"
            {...other}
            sx={[
                {
                    borderRadius: 'sm',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    alignItems: 'center',
                    px: 3,
                    flexGrow: 1,
                    boxShadow: 'none',
                },
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
        >
            <AspectRatio
                ratio="1"
                variant="solid"
                color="primary"
                sx={{
                    minWidth: 32,
                    borderRadius: '50%',
                    '--Icon-fontSize': '16px',
                }}
            >
                <div>{icon || <FileUploadRoundedIcon />}</div>
            </AspectRatio>
            <Typography level="body-sm" textAlign="center">
                <Link component="button" overlay>
                    Click to upload
                </Link>{' '}
                or drag and drop
                <br /> SVG, PNG, JPG, or GIF (max. 800x400px)
            </Typography>
        </Card>
    );
}
