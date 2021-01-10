import React, { useState, useEffect } from 'react';
import axios from "axios";

const App = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
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
      alert('type something');
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
    let newItem = result.hits.filter((item) => item.fields.item_id === e.target.foodItem.value);
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
      <h1>Nutrition App</h1>
      <input type="text" value={query} onChange={(e) => { setQuery(e.target.value); }} placeholder="Enter food" />
      <button type="submit" onClick={handleSubmit}>Submit</button>
      <h2><u>Results</u></h2>

      <form onSubmit={handleAddItem}>
        <select name="foodItem">
          {
            (result === '')
              ?
              <option value="0">Food dropdown here...</option>
              :
              result.hits.map((item) => {
                const { fields: { item_id, item_name, brand_name, nf_calories } } = item;
                return (<option key={item_id} value={item_id}>{item_name}, {brand_name}, {nf_calories} calories</option>);
              })
          }
        </select>
        <input type="submit" value="Add" />
      </form>
      <table style={{ border: "1px solid black" }}>
        <thead>
          <tr>
            <th>Name (brand)</th>
            <th>Serving size</th>
            <th>Calories</th>
          </tr>
        </thead>

        <tbody>
          {foodLog === [] ? <tr><td ></td><td /><td /></tr> : foodLog.map((food, index) => {
            const { item_id, item_name, brand_name, nf_calories, nf_serving_size_qty, nf_serving_size_unit } = food;
            return (
              <tr key={item_id} >
                <td>{item_name} ({brand_name})</td>
                <td>
                  <input
                    type="number"
                    value={nf_serving_size_qty}
                    onChange={(e) => {
                      if (e.target.value < 0) {
                        e.target.value = 0;
                      } else {
                        changeQuantity(index, e.target.value);
                      }
                    }}
                  />
                  {nf_serving_size_unit}
                </td>
                <td>{(nf_calories * nf_serving_size_qty).toFixed(0)} calories</td>
                <td><button onClick={() => removeFood(index)}>X</button></td>
              </tr>
            );
          })}
        </tbody>

        <tfoot>
          <tr>
            <td></td>
            <td><b>Total</b></td>
            <td><b>{totalCalories.toFixed(0)}</b> calories</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default App;