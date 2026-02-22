'use client';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const ACTIVITY_DATA = [
    { name: 'Mon', attempts: 45, newUsers: 12 },
    { name: 'Tue', attempts: 52, newUsers: 15 },
    { name: 'Wed', attempts: 38, newUsers: 8 },
    { name: 'Thu', attempts: 65, newUsers: 22 },
    { name: 'Fri', attempts: 48, newUsers: 18 },
    { name: 'Sat', attempts: 72, newUsers: 25 },
    { name: 'Sun', attempts: 55, newUsers: 14 },
];

const SUBJECT_DATA = [
    { name: 'Physics', value: 400 },
    { name: 'Chemistry', value: 300 },
    { name: 'Maths', value: 300 },
    { name: 'Biology', value: 200 },
    { name: 'English', value: 278 },
    { name: 'General', value: 189 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ff7c7c', '#8dd1e1'];

interface ActivityData {
    name: string;
    attempts: number;
    newUsers: number;
}

interface SubjectData {
    name: string;
    value: number;
}

export function ActivityChart({ data }: { data?: ActivityData[] }) {
    const chartData = data || ACTIVITY_DATA;
    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <AreaChart
                    data={chartData}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        itemStyle={{ fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="attempts" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Test Attempts" />
                    <Area type="monotone" dataKey="newUsers" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.2} name="New Users" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

export function SubjectDistributionChart({ data }: { data?: SubjectData[] }) {
    const chartData = data || SUBJECT_DATA;
    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        itemStyle={{ fontSize: '12px' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
