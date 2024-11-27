import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import { baseURL } from './api';
import { FaArrowLeft, FaSave } from 'react-icons/fa';

function EditEmployee() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [position, setPosition] = useState('');
    const [salary, setSalary] = useState('');
    const [department, setDepartment] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchingEmployee, setFetchingEmployee] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    // Fetch employee data when component mounts
    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${baseURL}/employees/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch employee');
                }

                const data = await response.json();

                // Pre-fill the form with existing data
                setFirstName(data.first_name);
                setLastName(data.last_name);
                setEmail(data.email);
                setPosition(data.position);
                setSalary(data.salary);
                setDepartment(data.department);
            } catch (err) {
                setError(err.message);
            } finally {
                setFetchingEmployee(false);
            }
        };

        fetchEmployee();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');

            // Only include fields that have been modified
            const updates = {};
            if (firstName) updates.first_name = firstName;
            if (lastName) updates.last_name = lastName;
            if (email) updates.email = email;
            if (position) updates.position = position;
            if (salary) updates.salary = Number(salary);
            if (department) updates.department = department;

            const response = await fetch(`${baseURL}/employees/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updates)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Update failed');
            }

            // Success! Redirect back to employee list
            navigate('/employees');

        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    if (fetchingEmployee) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Edit Employee</h2>
                <Button
                    variant="outline-primary"
                    onClick={() => navigate('/employees')}
                >
                    <FaArrowLeft /> Back to List
                </Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6">
                        <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                placeholder="Enter first name"
                            />
                        </Form.Group>
                    </div>
                    <div className="col-md-6">
                        <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                placeholder="Enter last name"
                            />
                        </Form.Group>
                    </div>
                </div>

                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter email"
                    />
                </Form.Group>

                <div className="row">
                    <div className="col-md-6">
                        <Form.Group className="mb-3">
                            <Form.Label>Position</Form.Label>
                            <Form.Control
                                type="text"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                                required
                                placeholder="Enter position"
                            />
                        </Form.Group>
                    </div>
                    <div className="col-md-6">
                        <Form.Group className="mb-3">
                            <Form.Label>Department</Form.Label>
                            <Form.Control
                                type="text"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                required
                                placeholder="Enter department"
                            />
                        </Form.Group>
                    </div>
                </div>

                <Form.Group className="mb-4">
                    <Form.Label>Salary</Form.Label>
                    <Form.Control
                        type="number"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        required
                        placeholder="Enter salary"
                        min="0"
                        step="0.01"
                    />
                </Form.Group>

                <div className="d-grid gap-2">
                    <Button
                        variant="warning"
                        type="submit"
                        disabled={loading}
                        className="d-flex align-items-center justify-content-center gap-2"
                    >
                        <FaSave /> {loading ? 'Updating...' : 'Update Employee'}
                    </Button>
                </div>
            </Form>
        </Container>
    )
}

export default EditEmployee;