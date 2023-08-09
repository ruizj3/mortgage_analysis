import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import './index.css';

const apiUrl = process.env.REACT_APP_CONNECT_TO_BACKEND_URL;

function Budget() {
    const initialInputValues = {
        userid: null,
        d3Container: useRef(null),
        budget: null
    };

    const [inputs, setInputs] = useState([initialInputValues]);

    const updateInput = (index, property, value) => {
        const newInputs = [...inputs];
        newInputs[index][property] = value;
        setInputs(newInputs);
    };

    const getBudgetData = async (index) => {
        const input = inputs[index];
        const filteredInput = { userid: input.userid };
        const params = new URLSearchParams(filteredInput).toString();
        try {
            const response = await axios.get(apiUrl+`/budget?${params}`);
            updateInput(index, 'budget', response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    //useEffect(() => {
    //    inputs.forEach((input, index) => {
    //        if (!input.budget) {
    //            getBudgetData(index);
    //        }
    //    });
    //}, [inputs]);

    useEffect(() => {
        inputs.forEach((input, index) => {
            if (input.budget) {
                const data = JSON.parse(input.budget);
                const container = d3.select(input.d3Container.current);
                container.selectAll('*').remove();  // Clear previous table

                const table = container.append('table');
                const thead = table.append('thead');
                const tbody = table.append('tbody');

                thead.append('tr')
                    .selectAll('th')
                    .data(["Budget ID", "User ID", "Month", "Category", "Goal", "CurrentValue"])
                    .enter().append('th')
                    .text(d => d)
                    .style("border", "2px solid black");

                const rows = tbody.selectAll('tr')
                    .data(data)
                    .enter().append('tr');

                rows.selectAll('td')
                    .data(d => [d.budgetid, d.userid, d.month, d.category, d.goal, d.currentvalue])
                    .enter().append('td')
                    .text(d => d)
                    .style("border", "2px solid black");
            }
        });
    }, [inputs]);

    const handleFormSubmit = (index) => (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        getBudgetData(index);
    };

    return (
        <div className="Budget">
            {inputs.map((input, index) => (
                <div key={index}>
                    <label>
                        UserID:
                        <input
                            type="number"
                            value={input.userid}
                            onChange={e => updateInput(index, 'userid', e.target.value)} />
                    </label>
                    <button onClick={handleFormSubmit(index)}>Submit</button>
                    <div ref={input.d3Container}></div>
                </div>
            ))}
        </div>
    )
}

export default Budget;
