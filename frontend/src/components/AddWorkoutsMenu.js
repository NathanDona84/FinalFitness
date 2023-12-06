import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';

export default function AddWorkoutsMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        sx={{minWidth: "35px", width: "35px", height: "35px", padding: "0px"}}
        onClick={() => {props.onSelect(1); handleClose()}}
      >
        <AddBoxOutlinedIcon fontSize='large' sx={{ color: "#757575" }}/>
      </Button>
    </div>
  );
}