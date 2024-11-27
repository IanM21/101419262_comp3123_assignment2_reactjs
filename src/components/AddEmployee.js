import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import { baseURL } from './api';
import { FaArrowLeft, FaSave } from 'react-icons/fa';

function AddEmployee() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [position, setPosition] = useState('');
    const [salary, setSalary] = useState('');
    const [department, setDepartment] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${baseURL}/employees`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    position,
                    salary: Number(salary),
                    department
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Add employee failed');
            }

            navigate('/employees');
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container className="mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Add Employee</h2>
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
                        variant="primary"
                        type="submit"
                        disabled={loading}
                        className="d-flex align-items-center justify-content-center gap-2"
                    >
                        <FaSave /> {loading ? 'Saving...' : 'Save Employee'}
                    </Button>
                </div>
            </Form>
        </Container>
    )
}

export default AddEmployee;