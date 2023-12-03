import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';

export default function AddNutritionMenu(props) {
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
        onClick={handleClick}
        sx={{minWidth: "35px", width: "35px", height: "35px", padding: "0px"}}
      >
        <AddBoxOutlinedIcon fontSize='large' sx={{ color: "#757575" }}/>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => {props.onSelect(1); handleClose()}} sx={{fontWeight: "300"}}>Add Food</MenuItem>
        <MenuItem onClick={() => {props.onSelect(2); handleClose()}} sx={{fontWeight: "300"}}>Add Water</MenuItem>
        <MenuItem onClick={() => {props.onSelect(3); handleClose()}} sx={{fontWeight: "300"}}>Add Steps</MenuItem>
        <MenuItem onClick={() => {props.onSelect(4); handleClose()}} sx={{fontWeight: "300"}}>Modify Trackers & Goals</MenuItem>
      </Menu>
    </div>
  );
}