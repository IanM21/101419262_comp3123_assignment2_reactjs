import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import { baseURL } from './api';

function EmployeeView() {
    const [employee, setEmployee] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const { id } = useParams();  // Get the id from the URL
    const navigate = useNavigate();

    useEffect(() => {
        fetchEmpByID(id);
    }, [id]);

    const fetchEmpByID = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${baseURL}/employees/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch employee details');
            }

            const data = await response.json();
            setEmployee(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <Button
                variant="outline-primary"
                className="mb-3"
                onClick={() => navigate('/employees')}
            >
                <FaArrowLeft /> Back to List
            </Button>

            {employee && (
                <Card>
                    <Card.Header as="h5">Employee Details</Card.Header>
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <h2>{`${employee.first_name} ${employee.last_name}`}</h2>
                                <p className="text-muted">{employee.email}</p>
                            </div>
                        </div>

                        <hr />

                        <div className="row mt-4">
                            <div className="col-md-6">
                                <h5>Position</h5>
                                <p>{employee.position}</p>
                            </div>
                            <div className="col-md-6">
                                <h5>Department</h5>
                                <p>{employee.department}</p>
                            </div>
                        </div>

                        <div className="row mt-3">
                            <div className="col-md-6">
                                <h5>Salary</h5>
                                <p>
                                    {new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: 'USD'
                                    }).format(employee.salary)}
                                </p>
                            </div>
                            <div className="col-md-6">
                                <h5>Added On</h5>
                                <p>{new Date(employee.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
}

export default EmployeeView;