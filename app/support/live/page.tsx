'use client';

import { useState } from 'react';
import {
    Send, Headset, User, Sparkles,
    MoreHorizontal, Paperclip, Smile
} from 'lucide-react';
import styles from '../support.module.css';

export default function LiveSupportPage() {
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hello! Welcome to PrepCUET Support. My name is Alex. How can I assist with your preparation today?' },
        { type: 'user', text: 'Hi Alex, I have a question about the mock test schedule.' },
        { type: 'bot', text: 'Sure! The mock tests are conducted every Sunday at 10:00 AM. Would you like me to send you the full calendar for February?' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { type: 'user', text: input }]);
        setInput('');

        // Mock bot response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                type: 'bot',
                text: 'Thank you for your message. An academic counselor will be with you shortly to provide a detailed answer.'
            }]);
        }, 1000);
    };

    return (
        <div className={styles.container}>
            <div className="container">
                <div className={styles.supportWrapper}>
                    <div className={styles.chatContainer}>
                        {/* Header */}
                        <div className={styles.chatHeader}>
                            <div style={{ position: 'relative' }}>
                                <div className={styles.iconWrapper} style={{ margin: 0, width: '48px', height: '48px', background: 'white' }}>
                                    <Headset size={24} color="var(--primary)" />
                                </div>
                                <div style={{
                                    position: 'absolute',
                                    bottom: '0',
                                    right: '0',
                                    width: '12px',
                                    height: '12px',
                                    background: '#10b981',
                                    borderRadius: '50%',
                                    border: '2px solid white'
                                }}></div>
                            </div>
                            <div>
                                <h3 style={{ color: 'white', fontWeight: 800 }}>Academic Support</h3>
                                <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Online | Typically responds in 5 mins</p>
                            </div>
                            <MoreHorizontal size={24} style={{ marginLeft: 'auto', cursor: 'pointer' }} />
                        </div>

                        {/* Body */}
                        <div className={styles.chatBody}>
                            {messages.map((msg, index) => (
                                <div key={index} className={`${styles.message} ${msg.type === 'bot' ? styles.botMsg : styles.userMsg}`}>
                                    {msg.text}
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className={styles.chatFooter}>
                            <Paperclip size={20} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
                            <input
                                type="text"
                                className={styles.chatInput}
                                placeholder="Type your message here..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <Smile size={20} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
                            <button
                                onClick={handleSend}
                                style={{
                                    background: 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.6rem',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            <Sparkles size={14} style={{ verticalAlign: 'middle', marginRight: '4px', color: 'var(--primary)' }} />
                            Instant AI support is also available 24/7 for quick queries.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
