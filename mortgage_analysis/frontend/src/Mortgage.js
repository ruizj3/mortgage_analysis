import React, { useEffect, useState, useRef } from 'react';
import Plotly from 'plotly.js-dist';
import axios from 'axios';
import './index.css';

const apiUrl = process.env.REACT_APP_CONNECT_TO_BACKEND_URL;

function Mortgage() {
  const initialInputValues = {
    principal: 700000,
    down_payment_percent: 0.2,
    rate: 0.07125,
    years: 30,
    compound: 12,
  };

  const [inputs, setInputs] = useState([initialInputValues]);

  const updateInput = (index, property, value) => {
    const newInputs = [...inputs];
    newInputs[index][property] = value;
    setInputs(newInputs);
  };

  const addGraph = () => {
    setInputs(inputs.concat(initialInputValues));
  };

  const removeGraph = (index) => {
    const newInputs = [...inputs];
    newInputs.splice(index, 1);
    setInputs(newInputs);
  };

  const calculateMortgage = (index) => {
    const input = inputs[index];
    const filteredInput = Object.keys(input).reduce((result, key) => {
      if (key !== "mortgage") {
        result[key] = input[key];
      }
      return result;
    }, {});
    const params = new URLSearchParams(filteredInput);
    axios.get(apiUrl + `/mortgage?${params}`)
      .then(response => {
        const mortgage = response.data;
        const transformedMortgage = mortgage.month_number.map((month, i) => ({
          month_number: month,
          loan_interest: mortgage.interest_paid[i],
          loan_principal: mortgage.principal_paid[i],
        }));
        updateInput(index, 'mortgage', transformedMortgage);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  useEffect(() => {
    inputs.forEach((input, index) => {
      if (!input.mortgage) {
        calculateMortgage(index);
      }
    });
  }, [inputs]);

  useEffect(() => {
    inputs.forEach((input, index) => {
      if (input.mortgage) {
        const trace1 = {
          x: input.mortgage.map(d => d.month_number),
          y: input.mortgage.map(d => d.loan_interest),
          mode: 'lines',
          name: 'Interest',
          line: { color: 'steelblue' },
        };

        const trace2 = {
          x: input.mortgage.map(d => d.month_number),
          y: input.mortgage.map(d => d.loan_principal),
          mode: 'lines',
          name: 'Principal',
          line: { color: 'red' },
        };

        const layout = {
          title: 'Interest and Principal Over Time',
        };

        Plotly.newPlot(`linePlot-${index}`, [trace1, trace2], layout);

        const barData = [
          {
            x: ['Interest', 'Principal'],
            y: [
              input.mortgage.reduce((a, b) => a + b.loan_interest, 0),
              input.mortgage.reduce((a, b) => a + b.loan_principal, 0),
            ],
            type: 'bar',
            marker: {
              color: ['steelblue', 'red'],
            },
          },
        ];

        const barLayout = {
          title: 'Total Interest vs Principal',
        };

        Plotly.newPlot(`barPlot-${index}`, barData, barLayout);
      }
    });
  }, [inputs]);

  return (
    <div className="Mortgage">
      {inputs.map((input, index) => (
        <div key={index}>
          <label>
            Principal value:
            <input
              type="number"
              value={input.principal}
              onChange={e => updateInput(index, 'principal', e.target.value)}
            />
          </label>
          <label>
            Down Payment Percent value:
            <input
              type="number"
              value={input.down_payment_percent}
              onChange={e => updateInput(index, 'down_payment_percent', e.target.value)}
            />
          </label>
          <label>
            Rate value:
            <input
              type="number"
              value={input.rate}
              onChange={e => updateInput(index, 'rate', e.target.value)}
            />
          </label>
          <label>
            Years value:
            <input
              type="number"
              value={input.years}
              onChange={e => updateInput(index, 'years', e.target.value)}
            />
          </label>
          <label>
            Compound value:
            <input
              type="number"
              value={input.compound}
              onChange={e => updateInput(index, 'compound', e.target.value)}
            />
          </label>
          <button onClick={() => calculateMortgage(index)}>Calculate Mortgage</button>
          <div style={{ display: 'flex' }}>
            <div id={`linePlot-${index}`} style={{ width: '50%', height: '500px' }}></div>
            <div id={`barPlot-${index}`} style={{ width: '50%', height: '500px' }}></div>
          </div>
          <button onClick={() => removeGraph(index)}>Remove this graph</button>
        </div>
      ))}
      <button onClick={addGraph}>Add another graph</button>
    </div>
  );
}

export default Mortgage;
