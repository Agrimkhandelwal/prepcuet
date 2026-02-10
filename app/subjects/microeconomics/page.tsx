'use client';

import {
    BookOpen, TrendingUp, Target, Layers,
    PieChart, Scale, ArrowLeft, ChevronRight,
    Zap, Cpu, Globe, Brain
} from 'lucide-react';
import Link from 'next/link';
import styles from './microeconomics.module.css';

export default function MicroeconomicsPage() {
    const toc = [
        { id: 'micro-macro', label: 'Micro vs Macro' },
        { id: 'what-is-micro', label: 'What is Microeconomics?' },
        { id: 'central-problems', label: 'Central Problems' },
        { id: 'ppf', label: 'Production Possibility Frontier' },
        { id: 'economic-activities', label: 'Types of Economic Activities' },
        { id: 'positive-normative', label: 'Positive vs Normative' }
    ];

    return (
        <div className={styles.pageContainer}>
            <header className={styles.hero}>
                <div className="container">
                    <Link href="/subjects/economics" className={styles.backLink} style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', textDecoration: 'none', opacity: 0.7 }}>
                        <ArrowLeft size={16} /> Back to Economics
                    </Link>
                    <h1 className={styles.title}>Microeconomics</h1>
                    <p className={styles.subtitle}>A comprehensive guide to understanding individual economic behavior and the functioning of specific markets.</p>
                </div>
            </header>

            <div className="container">
                <div className={styles.layout}>
                    {/* Sticky Sidebar */}
                    <aside className={styles.toc}>
                        <h3 className={styles.tocTitle}>Table of Contents</h3>
                        <nav>
                            <ul className={styles.tocList}>
                                {toc.map((item) => (
                                    <li key={item.id}>
                                        <a href={`#${item.id}`} className={styles.tocLink}>{item.label}</a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'var(--primary-light)', borderRadius: '16px' }}>
                            <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 800, marginBottom: '0.5rem' }}>CUET Prep Pro</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', opacity: 0.8, marginBottom: '1rem' }}>Get personalized notes and doubt clearing sessions.</p>
                            <Link href="/subscription" style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.85rem', textDecoration: 'none' }}>Upgrade Now &rarr;</Link>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className={styles.contentBody}>

                        {/* Section 1: Micro vs Macro */}
                        <section id="micro-macro" className={styles.section}>
                            <h2 className={styles.sectionTitle}><Layers size={32} color="var(--primary)" /> Micro vs Macroeconomics</h2>
                            <div className={styles.contentCard}>
                                <p>Economics is traditionally studied under two broad branches. While both branches study economic problems, they differ in their level of analysis, focus of study, and the type of questions addressed.</p>

                                <div className={styles.tableContainer}>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>Feature</th>
                                                <th>Microeconomics</th>
                                                <th>Macroeconomics</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td><strong>Level of Analysis</strong></td>
                                                <td>Individual economic agents (Consumers, Firms)</td>
                                                <td>Economy as a whole (Aggregate level)</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Focus</strong></td>
                                                <td>Prices and quantities in specific markets</td>
                                                <td>Overall performance (Output, Employment)</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Nature</strong></td>
                                                <td>Studies small units of the economy</td>
                                                <td>Comprehensive and overall manner</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className={styles.grid}>
                                    <div className={styles.featureCard}>
                                        <h4>Micro Questions</h4>
                                        <ul className={styles.list}>
                                            <li>How is the price of a commodity determined?</li>
                                            <li>Why does the demand for a good decrease?</li>
                                            <li>How does a firm decide output quantity?</li>
                                        </ul>
                                    </div>
                                    <div className={styles.featureCard}>
                                        <h4>Macro Questions</h4>
                                        <ul className={styles.list}>
                                            <li>What is the level of total output?</li>
                                            <li>Are resources fully employed?</li>
                                            <li>Why do prices rise over time (inflation)?</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 2: What is Micro? */}
                        <section id="what-is-micro" className={styles.section}>
                            <h2 className={styles.sectionTitle}><BookOpen size={32} color="var(--primary)" /> What is Microeconomics?</h2>
                            <div className={styles.contentCard}>
                                <p>Microeconomics focuses on <strong>small parts of the economy</strong>, not the entire country. It studies the behavior of individual units such as consumers, producers, and specific prices.</p>

                                <div className={styles.highlightBox}>
                                    <p>Key Study Areas: Consumer Behavior, Producer Behavior, Price Determination, Market Types (Monopoly, Competition), and Resource Allocation.</p>
                                </div>

                                <h3 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>Importance of Microeconomics</h3>
                                <div className={styles.grid} style={{ gridTemplateColumns: '1fr 1fr' }}>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <Zap size={24} color="var(--primary)" />
                                        <span>Helps consumers make better choices and maximize utility.</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <Cpu size={24} color="var(--primary)" />
                                        <span>Enables firms to maximize profit and optimize production.</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <Globe size={24} color="var(--primary)" />
                                        <span>Assists government in making price and taxation policies.</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <Brain size={24} color="var(--primary)" />
                                        <span>Explains complex real-life market problems through theory.</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 3: Central Problems */}
                        <section id="central-problems" className={styles.section}>
                            <h2 className={styles.sectionTitle}><Target size={32} color="var(--primary)" /> Central Problems of an Economy</h2>
                            <div className={styles.contentCard}>
                                <p>The main economic problem arises because <strong>human wants are unlimited</strong> while <strong>resources are limited (scarcity)</strong>. This forces every society to make choices.</p>

                                <h3 style={{ margin: '2rem 0 1.5rem', fontWeight: 800 }}>The Three Fundamental Questions</h3>
                                <div className={styles.grid}>
                                    <div className={styles.featureCard}>
                                        <h4>1. What to produce?</h4>
                                        <p>Deciding the type and quantity of goods. Should we produce more basic goods or luxury items? Education or Defense?</p>
                                    </div>
                                    <div className={styles.featureCard}>
                                        <h4>2. How to produce?</h4>
                                        <p>Choosing the method: Labour-intensive (preferred in India) or Capital-intensive (preferred in developed nations).</p>
                                    </div>
                                    <div className={styles.featureCard}>
                                        <h4>3. For whom to produce?</h4>
                                        <p>How should the output be distributed? This addresses issues of social justice and inequality.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 4: PPF */}
                        <section id="ppf" className={styles.section}>
                            <h2 className={styles.sectionTitle}><TrendingUp size={32} color="var(--primary)" /> Production Possibility Frontier (PPF)</h2>
                            <div className={styles.contentCard}>
                                <p>The PPF represents the maximum possible combinations of two goods that can be produced given full and efficient use of existing resources.</p>

                                <div className={styles.ppfTable}>
                                    <h4 style={{ textAlign: 'center', marginBottom: '1rem' }}>Production Possibility Set (Corn vs Cotton)</h4>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>Possibility</th>
                                                <th>Corn (Units)</th>
                                                <th>Cotton (Units)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr><td>A</td><td>0</td><td>10</td></tr>
                                            <tr><td>B</td><td>1</td><td>9</td></tr>
                                            <tr><td>C</td><td>2</td><td>7</td></tr>
                                            <tr><td>D</td><td>3</td><td>4</td></tr>
                                            <tr><td>E</td><td>4</td><td>0</td></tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className={styles.highlightBox}>
                                    <p><strong>Opportunity Cost:</strong> The amount of one good sacrificed to produce an additional unit of another. <em>Example: Moving from C to D costs 3 units of cotton for 1 unit of corn.</em></p>
                                </div>

                                <h3 style={{ margin: '2rem 0 1.5rem', fontWeight: 800 }}>Key Points on the PPF</h3>
                                <ul className={styles.list}>
                                    <li><strong>On the curve:</strong> Full and efficient utilization of resources.</li>
                                    <li><strong>Inside the curve:</strong> Underutilization or unemployment of resources.</li>
                                    <li><strong>Outside the curve:</strong> Unattainable combinations with current technology.</li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 5: Economic Activities */}
                        <section id="economic-activities" className={styles.section}>
                            <h2 className={styles.sectionTitle}><PieChart size={32} color="var(--primary)" /> Types of Economic Activities</h2>
                            <div className={styles.contentCard}>
                                <div className={styles.grid}>
                                    <div className={styles.featureCard}>
                                        <h4>Centrally Planned</h4>
                                        <p>Government takes all decisions Focused on social welfare and equality. <em>Example: 20th century China.</em></p>
                                    </div>
                                    <div className={styles.featureCard}>
                                        <h4>Market Economy</h4>
                                        <p>Decisions made by buyers/sellers. Prices act as market signals. <em>Example: USA.</em></p>
                                    </div>
                                    <div className={styles.featureCard}>
                                        <h4>Mixed Economy</h4>
                                        <p>A hybrid system combining government planning and market interaction. <em>Example: India.</em></p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 6: Positive vs Normative */}
                        <section id="positive-normative" className={styles.section}>
                            <h2 className={styles.sectionTitle}><Scale size={32} color="var(--primary)" /> Positive and Normative Economics</h2>
                            <div className={styles.contentCard}>
                                <div className={styles.tableContainer}>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>Branch</th>
                                                <th>Focus</th>
                                                <th>Examples</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td><strong>Positive</strong></td>
                                                <td>Facts, "What is", Can be verified</td>
                                                <td>"Increase in price reduces demand"</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Normative</strong></td>
                                                <td>Value judgments, "What ought to be", Cannot be tested</td>
                                                <td>"Government should provide free education"</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>

                    </main>
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="container" style={{ marginTop: '8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3rem', background: 'white', borderRadius: '32px', border: '1px solid var(--border)' }}>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Previous Topic</p>
                        <h4 style={{ fontWeight: 800 }}>Intro to Economics</h4>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Next Topic</p>
                        <h4 style={{ fontWeight: 800 }}>Macroeconomics Basics</h4>
                    </div>
                </div>
            </div>
        </div>
    );
}
