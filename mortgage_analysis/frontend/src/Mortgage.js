import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import './index.css';

const apiUrl = process.env.REACT_APP_CONNECT_TO_BACKEND_URL;
console.log(apiUrl)

function Mortgage() {
  const initialInputValues = {
    principal: 700000,
    down_payment_percent: 0.2,
    rate: 0.07125,
    years: 30,
    compound: 12,
    d3ContainerLine: useRef(null),
    d3ContainerBar: useRef(null)
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
        if (key !== "mortgage" && key !== "d3ContainerLine" && key !== "d3ContainerBar") {
          result[key] = input[key];
        }
        return result;
      }, {});
    const params = new URLSearchParams(filteredInput);
    axios.get(apiUrl+`/mortgage?${params}`)
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
    // fetch data for each input set
    inputs.forEach((input, index) => {
      if (!input.mortgage) {
        calculateMortgage(index);
      }
    });
  }, [inputs]);

  useEffect(() => {
    inputs.forEach((input, index) => {
      if (input.mortgage && input.d3ContainerLine.current && input.d3ContainerBar.current) {
        const svgLine = d3.select(input.d3ContainerLine.current);
        const svgBar = d3.select(input.d3ContainerBar.current);

        const margin = {top: 20, right: 20, bottom: 30, left: 60};
        const width = 460 - margin.left - margin.right; // reduced size to place graphs side by side
        const height = 500 - margin.top - margin.bottom;

        const xScale = d3.scaleLinear()
          .domain([0, d3.max(input.mortgage, d => d.month_number)])
          .range([margin.left, width - margin.right]);

        const yScaleLine = d3.scaleLinear()
          .domain([0, d3.max(input.mortgage, d => Math.max(d.loan_interest, d.loan_principal))])
          .range([height - margin.bottom, margin.top]);

        const totalInterest = input.mortgage.reduce((a, b) => a + b.loan_interest, 0);
        const totalPrincipal = input.mortgage.reduce((a, b) => a + b.loan_principal, 0);
        const totals = [{name: 'Interest', value: totalInterest}, {name: 'Principal', value: totalPrincipal}];
  
        const xScaleBar = d3.scaleBand()
            .domain(totals.map(d => d.name))
            .range([margin.left, width - margin.right])
            .padding(0.1);
  
        const yScaleBar = d3.scaleLinear()
            .domain([0, d3.max(totals, d => d.value)])
            .range([height - margin.bottom, margin.top]);

        const line = d3.line()
          .x(d => xScale(d.month_number))
          .y(d => yScaleLine(d.loan_interest));
        const line2 = d3.line()
          .x(d => xScale(d.month_number))
          .y(d => yScaleLine(d.loan_principal));
        const line3 = d3.line()
          .x(d => xScale(d.month_number))
          .y(d => yScaleLine(d.loan_paid_total));

        svgLine.selectAll("*").remove();

        svgLine.append("path")
          .datum(input.mortgage)
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-width", 1.5)
          .attr("d", line);
        
        svgLine.append("path")
          .datum(input.mortgage)
          .attr("fill", "none")
          .attr("stroke", "red")
          .attr("stroke-width", 1.5)
          .attr("d", line2);

        svgLine.append("path")
          .datum(input.mortgage)
          .attr("fill", "none")
          .attr("stroke", "black")
          .attr("stroke-width", 1.5)
          .attr("d", line3);

        const xAxisLine = d3.axisBottom(xScale);
        const yAxisLine = d3.axisLeft(yScaleLine);

        svgLine.append('g')
          .attr('transform', `translate(0,${height - margin.bottom})`)
          .call(xAxisLine);

        svgLine.append('g')
          .attr('transform', `translate(${margin.left},0)`)
          .call(yAxisLine);

        svgBar.selectAll("*").remove();

        svgBar.selectAll("*").remove();

        svgBar.selectAll("rect")
          .data(totals)
          .enter()
          .append("rect")
          .attr("x", d => xScaleBar(d.name))
          .attr("y", d => yScaleBar(d.value))
          .attr("width", xScaleBar.bandwidth())
          .attr("height", d => height - margin.bottom - yScaleBar(d.value))
          .attr("fill", d => d.name === 'Interest' ? "steelblue" : "red");

        const xAxisBar = d3.axisBottom(xScaleBar);
        const yAxisBar = d3.axisLeft(yScaleBar);

        svgBar.append('g')
          .attr('transform', `translate(0,${height - margin.bottom})`)
          .call(xAxisBar);

        svgBar.append('g')
          .attr('transform', `translate(${margin.left},0)`)
          .call(yAxisBar);
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
            <svg className="d3-component" width={500} height={500} ref={input.d3ContainerLine} />
            <svg className="d3-component" width={500} height={500} ref={input.d3ContainerBar} />
          </div>
          <button onClick={() => removeGraph(index)}>Remove this graph</button>
        </div>
      ))}
      <button onClick={addGraph}>Add another graph</button>
    </div>
  );
}

export default Mortgage;
