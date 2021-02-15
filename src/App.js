import React, { useState, useEffect } from 'react';
import axios from "axios";
import TableRender from './components/Table';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import AddIcon from "@material-ui/icons/Add";
import Typography from '@material-ui/core/Typography';

const App = () => {
  const classes = useStyles();

  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [selectedFood, setSelectedFood] = useState('');
  const [foodLog, setFoodLog] = useState(JSON.parse(localStorage.getItem('foodLog')) || []);
  const [totalCalories, setTotalCalories] = useState(0);

  const options = {
    method: 'GET',
    url: `https://nutritionix-api.p.rapidapi.com/v1_1/search/${query}`,
    params: { fields: 'item_name,item_id,brand_name,nf_calories,nf_total_fat' },
    headers: {
      'x-rapidapi-key': '28a3be72f0msh89a952b3f72ae72p19522ajsn239b1c85034a',
      'x-rapidapi-host': 'nutritionix-api.p.rapidapi.com'
    }
  };

  useEffect(() => {
    localStorage.setItem('foodLog', JSON.stringify(foodLog));
    var newTotal = 0;
    foodLog.map((food) => {
      newTotal += (food.nf_calories * food.nf_serving_size_qty);
      return (newTotal);
    });
    setTotalCalories(newTotal);
  }, [foodLog]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (query === '') {
      alert('*Field required: Food');
    } else {
      // fetch data
      axios.request(options).then(function (response) {
        console.log(response.data);
        setResult(response.data);
      }).catch(function (error) {
        console.error(error);
      });
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    let newItem = result.hits.filter((item) => item.fields.item_id === selectedFood);
    if (!foodLog) {
      setFoodLog([newItem[0].fields]);
    } else {
      let newLog = [...foodLog, newItem[0].fields];
      setFoodLog(newLog);
    }
    console.log("Food log", foodLog);
  };

  const removeFood = (index) => {
    const updatedFoodLog = [...foodLog];
    updatedFoodLog.splice(index, 1);
    setFoodLog(updatedFoodLog);
  };

  let changeQuantity = (index, quantity) => {
    let updatedFoodLog = [...foodLog];
    updatedFoodLog[index].nf_serving_size_qty = quantity;
    setFoodLog(updatedFoodLog);
  };

  return (
    <div>
      <Typography variant='h3'>Nutrition App</Typography>
      <Paper elevation={2} className={classes.paper}>
        <form className={classes.formControl}>
          <TextField className={classes.inputs} id="foodQuery" label="Food" value={query} onChange={(e) => { setQuery(e.target.value); }} />
          {/* <input type="text" value={query} onChange={(e) => { setQuery(e.target.value); }} placeholder="Enter food" /> */}
          <Button variant="contained" color="primary" onClick={handleSubmit}><SearchIcon /></Button>
          {/* <button type="submit" onClick={handleSubmit}>Submit</button> */}
        </form>

        <br />

        {
          result === ''
            ?
            <div></div>
            :
            <form onSubmit={handleAddItem} className={classes.formControl}>

              <InputLabel id="demo-simple-select-label">Select</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedFood}
                onChange={(e) => setSelectedFood(e.target.value)}
                className={classes.selectOverflow}
              >
                {
                  (result === '')
                    ?
                    <MenuItem value='0'>None</MenuItem>
                    :
                    result.hits.map((item) => {
                      const { fields: { item_id, item_name, brand_name, nf_calories } } = item;
                      return (<MenuItem key={item_id} value={item_id}>{item_name}, {brand_name}, {nf_calories} calories</MenuItem>);
                    })
                }
              </Select>
              <Button type="submit" value="Add" variant="contained" color="primary"><AddIcon /></Button>
            </form>
        }

      </Paper>

      <Typography variant="h4">Food Log</Typography>
      <Paper className={classes.table}>
        <TableRender
          foodLog={foodLog}
          totalCalories={totalCalories}
          removeFood={removeFood}
          changeQuantity={changeQuantity}
        />
      </Paper>
    </div>
  );
};

// Custom Styles 
const useStyles = makeStyles((theme) => ({
  root: {
    margin: 10,
    display: "flex",
    justifyContent: "center",
    minWidth: 500,
  },
  paper: {
    display: 'flex',
    justifyContent: 'center',
    margin: 10,
    padding: theme.spacing(3, 2),
    minWidth: 300,
    backgroundColor: '#C6F5FF',
  },

  table: {
    display: 'flex',
    justifyContent: 'center',
    flexFlow: 'column wrap',
    margin: 10,
    padding: theme.spacing(3, 2),
    minWidth: 400,
    backgroundColor: '#C6F5FF',
  },
  formControl: {
    margin: 10,
  },
  inputs: {
    minWidth: 200,
  },
  selectOverflow: {
    width: 100,
  }
}
));

// Grid Rendering
const PageRender = () => {
  const classes = useStyles();
  return (
    <Grid container>
      <Grid item xs={12} sm={2} />
      <Grid item xs={12} sm={8} className={classes.root}>
        <App />
      </Grid>
      <Grid item xs={12} sm={2} />
    </Grid>
  );
};

export default PageRender;