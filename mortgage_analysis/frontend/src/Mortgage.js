// frontend/src/Mortgage.js
import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

function Mortgage() {
  const [mortgage, setMortgage] = useState(null);
  const d3Container = useRef(null);
  const [principal, setPrincipal] = useState(700000);
  const [down_payment_percent, setDownPaymentPercent] = useState(0.3);
  const [rate, setRate] = useState(0.07125);
  const [years, setYears] = useState(30);
  const [compound, setCompound] = useState(12);

  const calculateMortgage = () => {
    const params = new URLSearchParams({
        principal: principal,
        down_payment_percent: down_payment_percent,
        rate: rate,
        years: years,
        compound: compound,
      })
    fetch(`http://127.0.0.1:5000//mortgage?${params}`)
    .then(response => response.json())
    .then(mortgage => {
        const transformedMortgage = mortgage.month_number.map((month, i) => ({
          month_number: month,
          loan_interest: mortgage.interest_paid[i],
          loan_principal: mortgage.principal_paid[i],
        }));
        setMortgage(transformedMortgage);
      });
  };

  useEffect(() => {
    const params = new URLSearchParams({
      principal: principal,
      down_payment_percent: down_payment_percent,
      rate: rate,
      years: years,
      compound: compound,
    });
    fetch(`http://127.0.0.1:5000//mortgage?${params}`)
      .then(response => response.json())
      .then(mortgage => {
        const transformedMortgage = mortgage.month_number.map((month, i) => ({
          month_number: month,
          loan_interest: mortgage.interest_paid[i],
          loan_principal: mortgage.principal_paid[i],
        }));
        setMortgage(transformedMortgage);
      });
  }, []);

  useEffect(() => {
    if (mortgage && d3Container.current) {
      const svg = d3.select(d3Container.current);
  
      const margin = {top: 20, right: 20, bottom: 30, left: 40};
      const width = 960 - margin.left - margin.right;
      const height = 500 - margin.top - margin.bottom;
  
      const xScale = d3.scaleLinear()
        .domain([0, d3.max(mortgage, d => d.month_number)])
        .range([margin.left, width - margin.right]);
  
      const yScale = d3.scaleLinear()
        .domain([0, d3.max(mortgage, d => Math.max(d.loan_interest, d.loan_principal))])
        .range([height - margin.bottom, margin.top]);
  
      const line = d3.line()
        .x(d => xScale(d.month_number))
        .y(d => yScale(d.loan_interest));
  
      const line2 = d3.line()
        .x(d => xScale(d.month_number))
        .y(d => yScale(d.loan_principal));

      svg.selectAll("*").remove();
  
      svg.append("path")
        .datum(mortgage)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);
  
      svg.append("path")
        .datum(mortgage)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("d", line2);
  
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);
  
      svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(xAxis);
  
      svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(yAxis);
    }
  }, [mortgage]);
  

  return (
    <div className="Mortgage">
    <label>
        Principal value:
        <input 
          type="float"
          value={principal}
          onChange={e => setPrincipal(e.target.value)}
        />
      </label>
      <label>
        Down Payment Percent value:
        <input 
          type="float"
          value={down_payment_percent}
          onChange={e => setDownPaymentPercent(e.target.value)}
        />
      </label>
      <label>
        Rate value:
        <input 
          type="float"
          value={rate}
          onChange={e => setRate(e.target.value)}
        />
      </label>
      <label>
        Years value:
        <input 
          type="int"
          value={years}
          onChange={e => setYears(e.target.value)}
        />
      </label>
      <label>
        Compound value:
        <input 
          type="int"
          value={compound}
          onChange={e => setCompound(e.target.value)}
        />
      </label>
      <button onClick={calculateMortgage}>Calculate Mortgage</button>
      <h1>Mortgage:</h1>
      <svg className="d3-component" width={1000} height={500} ref={d3Container} />
      
    </div>
  );
}

export default Mortgage;
