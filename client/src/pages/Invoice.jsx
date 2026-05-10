import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/layout/Layout';
import { FileText, Download, Printer, CheckCircle2, DollarSign, Calendar, MapPin, PieChart as PieChartIcon } from 'lucide-react';

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

    const subtotal = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const tax = subtotal * 0.05;
    const discount = 50;
    const total = subtotal + tax - discount;

    if (!trip) return <Layout><div>Loading...</div></Layout>;

    return (
        <Layout>
            <div className="animate-fade-in" style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Expense Invoice</h1>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn-primary" style={{ background: '#F3F4F6', color: 'var(--text-main)', border: '1px solid #E5E7EB' }}><Download size={18} /> Download Invoice</button>
                        <button className="btn-primary" style={{ background: '#F3F4F6', color: 'var(--text-main)', border: '1px solid #E5E7EB' }}><FileText size={18} /> Export as PDF</button>
                        <button className="btn-primary"><CheckCircle2 size={18} /> Mark as paid</button>
                    </div>
                </div>

                <div className="premium-card" style={{ padding: '4rem', background: 'white' }}>
                    {/* Header (Matches Wireframe) */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem', borderBottom: '2px solid #F9FAFB', paddingBottom: '3rem', marginBottom: '3rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2.5rem' }}>
                                <div style={{ background: 'var(--primary-gradient)', padding: '8px', borderRadius: '12px' }}>
                                    <FileText size={24} color="white" />
                                </div>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Traveloop</h2>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div>
                                    <p style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Trip Details</p>
                                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{trip.name}</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}><Calendar size={12} /> {new Date(trip.start_date).toLocaleDateString()} — {new Date(trip.end_date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Invoice Info</p>
                                    <p style={{ fontWeight: 700 }}>Invoice Id: <span style={{ color: 'var(--text-muted)' }}>INV-tp-{trip.id}0240</span></p>
                                    <p style={{ fontWeight: 700 }}>Generated date: <span style={{ color: 'var(--text-muted)' }}>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Budget Insights (Matches Wireframe) */}
                        <div style={{ background: '#F9FAFB', borderRadius: '24px', padding: '2rem' }}>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}><PieChartIcon size={16} /> Budget Insights</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '15px solid var(--primary)', borderTopColor: '#eee' }}></div>
                                <div style={{ fontSize: '0.85rem' }}>
                                    <p style={{ fontWeight: 700 }}>Total Budget: <span style={{ color: 'var(--primary)' }}>$22,000</span></p>
                                    <p style={{ fontWeight: 700 }}>Total Spent: <span style={{ color: 'var(--accent)' }}>$2,450</span></p>
                                    <p style={{ fontWeight: 700 }}>Remaining: <span style={{ color: 'var(--warning)' }}>$19,550</span></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Invoice Table (Matches Wireframe) */}
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '4rem' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '2px solid #F9FAFB', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                <th style={{ padding: '1rem 0' }}>#</th>
                                <th style={{ padding: '1rem' }}>Category</th>
                                <th style={{ padding: '1rem' }}>Description</th>
                                <th style={{ padding: '1rem' }}>Qty/Details</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>Unit Cost</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((exp, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #F9FAFB' }}>
                                    <td style={{ padding: '1.2rem 0', fontWeight: 700 }}>{i + 1}</td>
                                    <td style={{ padding: '1.2rem' }}><span style={{ padding: '4px 12px', borderRadius: '50px', background: '#F3F4F6', fontSize: '0.75rem', fontWeight: 800 }}>{exp.category}</span></td>
                                    <td style={{ padding: '1.2rem', color: 'var(--text-muted)' }}>{exp.description}</td>
                                    <td style={{ padding: '1.2rem', color: 'var(--text-muted)' }}>1 Unit / 3 nights</td>
                                    <td style={{ padding: '1.2rem', textAlign: 'right', fontWeight: 700 }}>${exp.amount}</td>
                                    <td style={{ padding: '1.2rem', textAlign: 'right', fontWeight: 800, color: 'var(--primary)' }}>${exp.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Footer Totals (Matches Wireframe) */}
                    <div style={{ width: '300px', marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontWeight: 600 }}>
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontWeight: 600 }}>
                            <span>Tax (5%)</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--warning)', fontWeight: 600 }}>
                            <span>Discount</span>
                            <span>-${discount.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #111', paddingTop: '1rem', fontSize: '1.4rem', fontWeight: 900 }}>
                            <span>Grand Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Invoice;
