import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import UserSetting from '../UserSetting';
import { Link } from 'react-router-dom';

const adminRoutes = [
    {
        path: '/user-info',
        placeholder: 'User setting',
        component: UserSetting
    },
]
export const mainListItems = (
    <React.Fragment>
        <ListItemButton component={Link} to="/profile/user-info">
            <ListItemIcon>
                <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="User setting" />
        </ListItemButton>
        {/* ... other list items ... */}
    </React.Fragment>
);

export const secondaryListItems = (
    <React.Fragment>
        {/* ... existing code ... */}
        <ListItemButton component={Link} to="/">
            <ListItemIcon>
                <ArrowBackIcon />
            </ListItemIcon>
            <ListItemText primary="Back to chat" />
        </ListItemButton>
    </React.Fragment>
);