import { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { baseURL } from './api';
import { FaUsers, FaMoneyBillWave, FaBriefcase, FaBuilding } from 'react-icons/fa';

function Home() {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        averageSalary: 0,
        departments: 0,
        positions: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${baseURL}/employees`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            // Calculate stats from employees data
            const employees = data.employees || [];
            const uniqueDepartments = new Set(employees.map(emp => emp.department));
            const uniquePositions = new Set(employees.map(emp => emp.position));
            const avgSalary = employees.length > 0
                ? employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length
                : 0;

            setStats({
                totalEmployees: employees.length,
                averageSalary: avgSalary,
                departments: uniqueDepartments.size,
                positions: uniquePositions.size
            });

        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    return (
        <Container fluid className="mt-5">
            <h1 className="text-center mb-4">Employee Management Dashboard</h1>

            <Row className="g-4">
                <Col md={3}>
                    <Card className="text-center h-100 shadow-sm">
                        <Card.Body>
                            <div className="display-4 text-primary mb-3">
                                <FaUsers />
                            </div>
                            <h3 className="display-6">{stats.totalEmployees}</h3>
                            <Card.Text className="text-muted">Total Employees</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className="text-center h-100 shadow-sm">
                        <Card.Body>
                            <div className="display-4 text-success mb-3">
                                <FaMoneyBillWave />
                            </div>
                            <h3 className="display-6">
                                {new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                    maximumFractionDigits: 0
                                }).format(stats.averageSalary)}
                            </h3>
                            <Card.Text className="text-muted">Average Salary</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className="text-center h-100 shadow-sm">
                        <Card.Body>
                            <div className="display-4 text-warning mb-3">
                                <FaBuilding />
                            </div>
                            <h3 className="display-6">{stats.departments}</h3>
                            <Card.Text className="text-muted">Departments</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className="text-center h-100 shadow-sm">
                        <Card.Body>
                            <div className="display-4 text-info mb-3">
                                <FaBriefcase />
                            </div>
                            <h3 className="display-6">{stats.positions}</h3>
                            <Card.Text className="text-muted">Unique Positions</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-5">
                <Col md={12}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <h3>Welcome to Employee Management System</h3>
                            <p className="lead">
                                Manage your organization's workforce efficiently with our comprehensive employee management solution.
                            </p>
                            <hr />
                            <h5>Quick Links:</h5>
                            <ul>
                                <li>View and manage all employees in the system</li>
                                <li>Add new employees to your organization</li>
                                <li>Update employee information and track changes</li>
                                <li>Monitor salary distributions and department statistics</li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Home;