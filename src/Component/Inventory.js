import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";

const useStyles = styled({
  table: {
    minWidth: 650,
  },
});

const Inventory = () => {
  const classes = useStyles();
  const [items, setItems] = useState([]);

  const [itemName, setItemName] = useState("");
  const [itemBuyingPrice, setItemBuyingPrice] = useState("");
  const [itemSellingPrice, setItemSellingPrice] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const response = await axios.get(`http://localhost:8091/app/item`);
    setItems(response.data);
  };

  


  const handleSubmit = async (event) => {
    event.preventDefault();
    const newItem = {
      itemId: Math.floor(Math.random() * 1000000),
      itemName: itemName,
      itemBuyingPrice: itemBuyingPrice,
      itemSellingPrice: itemSellingPrice,
      itemEnteredByUser: "Gurdeep",
      itemEnteredDate: new Date(),
      itemLastModifiedDate: new Date(),
      itemLastModifiedByUser: "gurdeep",
      itemStatus: "AVAILABLE",
    };
    try {
      const response = await axios.post(
        `http://localhost:8091/app/item`,
        newItem,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setItems([...items, response.data]);
      setItemName("");
      setItemSellingPrice("");
      setItemBuyingPrice("");
    } catch (e) {
      alert(e);
    }
  };

  const handleUpdate = (item) => {
    axios
      .put(`http://localhost:8091/app/item/${item.itemId}`, item)
      .then((response) => {
        const updatedItems = items.map((i) =>
          i.itemId === item.itemId ? response.data : i
        );
        setItems(updatedItems);
      })
      .catch((error) => console.log(error));
  };



    const handleDeleteItem = async (itemId) => {
      await axios.delete(`http://localhost:8091/app/item/${itemId}`);
      setItems(items.filter((item) => item.itemId !== itemId));
    };

  return (
    <>
      <Box p={2}>
        <h2>Inventory Management System</h2>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Item Name"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(event) => setItemName(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Buying Price"
                variant="outlined"
                fullWidth
                value={itemBuyingPrice}
                onChange={(event) => setItemBuyingPrice(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Selling Price"
                variant="outlined"
                fullWidth
                value={itemSellingPrice}
                onChange={(event) => setItemSellingPrice(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="inventory table">
          <TableHead>
            <TableRow>
              <TableCell align="right">Item Name</TableCell>
              <TableCell align="right">Item Selling Price</TableCell>
              <TableCell align="right">Item Buying Price</TableCell>
              <TableCell align="right">AvailableStatus</TableCell>
              <TableCell align="right">Actions</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.itemId}>
                <TableCell align="right">{item.itemName}</TableCell>
                <TableCell align="right">{item.itemSellingPrice}</TableCell>
                <TableCell align="right">{item.itemBuyingPrice}</TableCell>
                <TableCell align="right">{item.itemStatus}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleUpdate(item.itemId)}>
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteItem(item.itemId)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Inventory;
