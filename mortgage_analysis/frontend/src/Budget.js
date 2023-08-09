import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTable } from 'react-table';
import './index.css';

const apiUrl = process.env.REACT_APP_CONNECT_TO_BACKEND_URL;

function BudgetTable({ userid }) {
    const [budgetData, setBudgetData] = useState([]);

    const columns = React.useMemo(() => [
        { Header: 'Budget ID', accessor: 'budgetid' },
        { Header: 'User ID', accessor: 'userid' },
        { Header: 'Month', accessor: 'month' },
        { Header: 'Category', accessor: 'category' },
        { Header: 'Goal', accessor: 'goal' },
        { Header: 'CurrentValue', accessor: 'currentvalue' }
    ], []);

    const data = React.useMemo(() => budgetData, [budgetData]);

    useEffect(() => {
        if (userid) {
            const fetchBudgetData = async () => {
                const params = new URLSearchParams({ userid }).toString();
                try {
                    const response = await axios.get(apiUrl + `/budget?${params}`);
                    setBudgetData(JSON.parse(response.data));
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };
            fetchBudgetData();
        }
    }, [userid]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({ columns, data });

    return (
        <div>
            <table {...getTableProps()} className="table">
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

function Budget() {
    const [userid, setUserid] = useState(null);

    return (
        <div className="Budget">
            <label>
                UserID:
                <input
                    type="number"
                    value={userid || ''}
                    onChange={e => setUserid(e.target.value)}
                />
            </label>
            {userid && <BudgetTable userid={userid} />}
        </div>
    );
}

export default Budget;
