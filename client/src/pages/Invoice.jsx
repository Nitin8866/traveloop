import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/layout/Layout';
import { Printer, Download, FileText, DollarSign, Calendar, MapPin } from 'lucide-react';

const Invoice = () => {
    const { tripId } = useParams();
    const [trip, setTrip] = useState(null);
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const tripRes = await axios.get(`/api/trips`, { headers });
            setTrip(tripRes.data.find(t => t.id === parseInt(tripId)));
            const expRes = await axios.get(`/api/utility/expenses/${tripId}`, { headers });
            setExpenses(expRes.data);
        };
        fetchData();
    }, [tripId]);

    const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

    if (!trip) return <Layout><div style={{ padding: '5rem', textAlign: 'center' }}>Generating invoice...</div></Layout>;

    return (
        <Layout>
            <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem' }}>Expense Invoice</h1>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => window.print()} className="btn-primary" style={{ background: '#eee', color: 'var(--primary)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <Printer size={18} /> Print
                        </button>
                        <button className="btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <Download size={18} /> Download PDF
                        </button>
                    </div>
                </div>

                <div className="premium-card" style={{ padding: '4rem', background: 'white' }}>
                    {/* Invoice Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #f8f9fa', paddingBottom: '3rem', marginBottom: '3rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                                <div style={{ background: 'var(--primary)', padding: '6px', borderRadius: '8px' }}>
                                    <FileText size={24} color="white" />
                                </div>
                                <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Traveloop</h2>
                            </div>
                            <p style={{ fontWeight: 700, marginBottom: '4px' }}>Invoice For:</p>
                            <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '4px' }}>{trip.name}</h3>
                            <p style={{ color: 'var(--text-muted)' }}><Calendar size={12} /> {new Date(trip.start_date).toLocaleDateString()} — {new Date(trip.end_date).toLocaleDateString()}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Invoice #INV-{trip.id}102</h4>
                            <p style={{ fontWeight: 600 }}>Date: {new Date().toLocaleDateString()}</p>
                            <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8f9fa', borderRadius: '16px', textAlign: 'center' }}>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Amount</p>
                                <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>${total.toFixed(2)}</h2>
                            </div>
                        </div>
                    </div>

                    {/* Invoice Table */}
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '3rem' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Category</th>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Description</th>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', textAlign: 'right' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((exp, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #f8f9fa' }}>
                                    <td style={{ padding: '1.2rem', fontWeight: 600 }}>{exp.category}</td>
                                    <td style={{ padding: '1.2rem', color: 'var(--text-muted)' }}>{exp.description}</td>
                                    <td style={{ padding: '1.2rem', textAlign: 'right', fontWeight: 700 }}>${exp.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem', borderTop: '1px solid #f8f9fa' }}>
                        <p>Thank you for choosing Traveloop for your journey planning!</p>
                        <p style={{ fontSize: '0.8rem', marginTop: '1rem' }}>Generated by Traveloop App • Production Environment</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Invoice;
