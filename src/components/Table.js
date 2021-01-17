import { TableFooter } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React from 'react';

export default function TableRender({ foodLog, totalCalories, removeFood, changeQuantity }) {
    return (

        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Name (brand)</TableCell>
                    <TableCell>Serving size</TableCell>
                    <TableCell>Calories</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {foodLog === [] ? <TableRow><TableCell ></TableCell><TableCell /><TableCell /></TableRow> : foodLog.map((food, index) => {
                    const { item_id, item_name, brand_name, nf_calories, nf_serving_size_qty, nf_serving_size_unit } = food;
                    return (
                        <TableRow key={item_id} >
                            <TableCell>{item_name} ({brand_name})</TableCell>
                            <TableCell>
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
                            </TableCell>
                            <TableCell>{(nf_calories * nf_serving_size_qty).toFixed(0)} calories</TableCell>
                            <TableCell><button onClick={() => removeFood(index)}>X</button></TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell></TableCell>
                    <TableCell><b>Total</b></TableCell>
                    <TableCell><b>{totalCalories.toFixed(0)}</b> calories</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
};