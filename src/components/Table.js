import React from 'react';

export default function Table({ foodLog, totalCalories, removeFood, changeQuantity }) {
    return (
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
    );
};