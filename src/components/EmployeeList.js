import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import { baseURL } from './api';
import { FaEdit, FaTrash, FaUserPlus, FaEye } from 'react-icons/fa';

function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${baseURL}/employees`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch employees');
            }

            const data = await response.json();
            setEmployees(data.employees);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEmployee = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`baseURL/employees/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to delete employee');
                }

                // Refresh the employee list
                fetchEmployees();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const formatSalary = (salary) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(salary);
    };

    return (
        <Container className="mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Employee List</h2>
                <Button
                    variant="primary"
                    onClick={() => navigate('/add-employee')}
                    className="d-flex align-items-center gap-2"
                >
                    <FaUserPlus /> Add New Employee
                </Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : employees.length === 0 ? (
                <Alert variant="info">No employees found. Add some employees to get started!</Alert>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Position</th>
                            <th>Department</th>
                            <th>Salary</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee) => (
                            <tr key={employee._id}>
                                <td>{`${employee.first_name} ${employee.last_name}`}</td>
                                <td>{employee.email}</td>
                                <td>{employee.position}</td>
                                <td>{employee.department}</td>
                                <td>{formatSalary(employee.salary)}</td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <Button
                                            variant="info"
                                            size="sm"
                                            onClick={() => navigate(`/employee/${employee._id}`)}
                                        >
                                            <FaEye />
                                        </Button>
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            onClick={() => navigate(`/edit-employee/${employee._id}`)}
                                        >
                                            <FaEdit />
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDeleteEmployee(employee._id)}
                                        >
                                            <FaTrash />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
}

export default EmployeeList;