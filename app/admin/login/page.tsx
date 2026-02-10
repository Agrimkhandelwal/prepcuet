import Link from 'next/link';
import { Lock } from 'lucide-react';

export default function LoginPage() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f1f5f9'
        }}>
            <div style={{
                background: 'white',
                padding: '2.5rem',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center'
            }}>
                <div style={{
                    width: '50px',
                    height: '50px',
                    background: '#b91c1c',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem auto'
                }}>
                    <Lock size={24} />
                </div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginBottom: '2rem' }}>
                    Admin Login
                </h1>

                <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
                        <input type="email" placeholder="admin@example.com" style={{
                            width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #e2e8f0'
                        }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
                        <input type="password" placeholder="••••••••" style={{
                            width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #e2e8f0'
                        }} />
                    </div>
                    <Link href="/admin" style={{
                        background: '#b91c1c',
                        color: 'white',
                        padding: '0.75rem',
                        borderRadius: '4px',
                        fontWeight: 600,
                        marginTop: '1rem',
                        textAlign: 'center'
                    }}>
                        Sign In
                    </Link>
                </form>
                <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#64748b' }}>
                    <Link href="/" style={{ textDecoration: 'underline' }}>Back to Home</Link>
                </div>
            </div>
        </div>
    );
}
