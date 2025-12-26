import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from "recharts";
import {
    ChevronUp,
    ChevronDown,
    MoreVertical,
    TrendingUp,
    Phone,
    CheckCircle,
    PhoneOff,
    MessageSquare,
} from "lucide-react";
import { FaUserCircle } from "react-icons/fa";

/* -------------------- DATA -------------------- */
const initialCallData = [
    { name: "Oct 7-13", incoming: 120, answered: 110, abandoned: 10 },
    { name: "Oct 28-Nov 3", incoming: 280, answered: 200, abandoned: 80 },
    { name: "Nov 18-24", incoming: 450, answered: 400, abandoned: 50 },
    { name: "Dec 9-15", incoming: 427, answered: 405, abandoned: 22 },
    { name: "Dec 30-Jan 5", incoming: 600, answered: 550, abandoned: 50 },
];

const initialSentimentData = [
    { name: "Positive", value: 65, color: "#10b981" },
    { name: "Neutral", value: 25, color: "#6366f1" },
    { name: "Negative", value: 10, color: "#ef4444" },
];

const initialStatsData = [
    { day: "Mon", avgSentiment: 0, positivePct: 0 },
    { day: "Tue", avgSentiment: 0, positivePct: 0 },
    { day: "Wed", avgSentiment: 0, positivePct: 0 },
    { day: "Thu", avgSentiment: 0, positivePct: 0 },
    { day: "Fri", avgSentiment: 0, positivePct: 0 },
    { day: "Sat", avgSentiment: 0, positivePct: 0 },
    { day: "Sun", avgSentiment: 0, positivePct: 0 },
];

/* -------------------- COMPONENTS -------------------- */
const CompactStatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-md hover:shadow-lg transition-shadow" data-aos="fade-up">
        <div className="flex justify-between mb-2">
            <div>
                <p className="text-xs font-medium text-gray-500 uppercase">
                    {title}
                </p>
                <div className="text-2xl font-bold">
                    {value.toLocaleString()}
                </div>
            </div>
            <div
                className={`w-10 h-10 flex items-center justify-center rounded-full ${color} overflow-hidden shrink-0`}
            >
                <Icon className="w-5 h-5 text-white" />
            </div>
        </div>
        <div
            className={`flex items-center text-xs ${change >= 0 ? "text-emerald-600" : "text-red-600"
                }`}
        >
            {change >= 0 ? (
                <ChevronUp className="w-3 h-3 mr-1" />
            ) : (
                <ChevronDown className="w-3 h-3 mr-1" />
            )}
            {Math.abs(change)}% vs last week
        </div>
    </div>
);

const ServiceLevelCard = ({ answered, total }) => {
    const serviceLevel =
        total > 0 ? ((answered / total) * 100).toFixed(1) : "0.0";

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-md hover:shadow-lg transition-shadow" data-aos="fade-up" data-aos-delay="100">
            <div className="flex justify-between mb-2">
                <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">
                        Service Level
                    </p>
                    <div className="text-2xl font-bold">
                        {serviceLevel}%
                    </div>
                </div>
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 overflow-hidden shrink-0">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
            </div>
            <div className="text-xs text-emerald-600 flex items-center">
                <ChevronUp className="w-3 h-3 mr-1" /> +2.3% trend
            </div>
        </div>
    );
};

const SentimentCard = ({ data }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-md hover:shadow-lg transition-shadow" data-aos="fade-right" data-aos-delay="200">
        <div className="flex justify-between mb-2">
            <p className="text-xs font-medium text-gray-500 uppercase">
                Sentiment Analysis
            </p>
            <MessageSquare className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="h-36">
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        innerRadius={35}
                        outerRadius={55}
                        dataKey="value"
                    >
                        {data.map((d, i) => (
                            <Cell key={i} fill={d.color} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
        {data.map((d, i) => (
            <div key={i} className="flex justify-between text-xs mt-1">
                <span>{d.name}</span>
                <span className="font-medium">{d.value}%</span>
            </div>
        ))}
    </div>
);

const CallVolumeChart = ({ data }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 lg:col-span-2 shadow-md hover:shadow-lg transition-shadow" data-aos="fade-left">
        <p className="text-xs font-medium text-gray-500 uppercase mb-3">
            Call Volume
        </p>
        <div className="h-64">
            <ResponsiveContainer>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="incoming" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="answered" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="abandoned" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
);

const AdditionalStats = ({ data }) => (
    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-4 shadow-md hover:shadow-lg transition-shadow" data-aos="fade-up">
        <p className="text-xs font-medium text-gray-500 uppercase mb-3">
            Sentiment Trends
        </p>
        <div className="h-64 mt-16 mr-8">
            <ResponsiveContainer>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="avgSentiment"
                        stroke="#6366f1"
                        strokeWidth={2}
                        name="Avg Score"
                    />
                    <Line
                        type="monotone"
                        dataKey="positivePct"
                        stroke="#10b981"
                        strokeWidth={2}
                        name="Positive %"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </div>
);

const TopPerformers = ({ agents }) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-md hover:shadow-lg transition-shadow" data-aos="fade-up" data-aos-delay="100">
            <div className="flex justify-between mb-3">
                <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">
                        Top Performers
                    </p>
                    <p className="text-xs text-gray-600">
                        Agents with highest service level
                    </p>
                </div>
                <MoreVertical className="w-4 h-4 text-gray-400" />
            </div>
            <div className="space-y-3">
                {agents && agents.length > 0 ? (
                    agents.map((agent, index) => (
                        <div key={index} className="flex items-center">
                            {agent.profilePicture ? (
                                <img
                                    src={`${import.meta.env.VITE_API_URL}${agent.profilePicture}`}
                                    alt={agent.name}
                                    className="w-8 h-8 rounded-full mr-3 object-cover"
                                />
                            ) : (
                                <FaUserCircle className="w-8 h-8 text-gray-400 mr-3" />
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{agent.name}</p>
                                <p className="text-xs text-gray-500">{agent.calls} calls</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold text-emerald-600">
                                    {agent.serviceLevel}
                                </p>
                                <p className="text-xs text-gray-500">Service Level</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No data available</p>
                )}
            </div>
        </div>
    );
};


/* -------------------- MAIN PAGE -------------------- */
const Home = ({ answeredCalls = 405, abandonedCalls = 22, user }) => {
    const incomingCalls = answeredCalls + abandonedCalls;
    const [sentimentData, setSentimentData] = useState(initialSentimentData);
    const [callVolumeData, setCallVolumeData] = useState(initialCallData);
    const [statsData, setStatsData] = useState(initialStatsData);
    const [topAgents, setTopAgents] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;
            try {
                const [historyRes, leaderboardRes, abandonedRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/history?userId=${user._id}`),
                    axios.get(`${import.meta.env.VITE_API_URL}/leaderboard`),
                    axios.get(`${import.meta.env.VITE_API_URL}/abandoned-history?userId=${user._id}`)
                ]);

                const history = historyRes.data;
                const abandonedHistory = abandonedRes.data;
                setTopAgents(leaderboardRes.data);

                /* --- SENTIMENT DATA PROCESSING --- */
                let totalPos = 0;
                let totalNeg = 0;
                let totalNeu = 0;

                history.forEach(item => {
                    const pos = item.positiveKeywords?.length || 0;
                    const neg = item.negativeKeywords?.length || 0;
                    const neu = Math.max(0, (item.transcript?.split(' ').length || 0) - pos - neg);

                    totalPos += pos;
                    totalNeg += neg;
                    totalNeu += neu;
                });

                const totalSentiment = totalPos + totalNeg + totalNeu;

                if (totalSentiment > 0) {
                    const posPct = Math.round((totalPos / totalSentiment) * 100);
                    const negPct = Math.round((totalNeg / totalSentiment) * 100);
                    const neuPct = 100 - posPct - negPct;

                    setSentimentData([
                        { name: "Positive", value: posPct, color: "#10b981" },
                        { name: "Neutral", value: neuPct, color: "#6366f1" },
                        { name: "Negative", value: negPct, color: "#ef4444" },
                    ]);
                }

                /* --- CALL VOLUME & TRENDS PROCESSING --- */
                const volumeMap = new Map();
                const days = 7;
                const now = new Date();

                for (let i = days - 1; i >= 0; i--) {
                    const d = new Date(now);
                    d.setDate(d.getDate() - i);
                    const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    volumeMap.set(key, {
                        name: key,
                        incoming: 0,
                        answered: 0,
                        abandoned: 0,
                        sentimentSum: 0,
                        positiveCount: 0,
                        count: 0
                    });
                }

                history.forEach(item => {
                    const itemDate = new Date(item.date);
                    const key = itemDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                    if (volumeMap.has(key)) {
                        const entry = volumeMap.get(key);
                        entry.answered += 1;
                        entry.incoming += 1;
                        entry.count += 1;
                        entry.sentimentSum += (item.sentimentScore || 0);
                        if ((item.sentimentScore || 0) > 0) {
                            entry.positiveCount += 1;
                        }
                    }
                });

                // Process Abandoned Calls
                if (abandonedHistory && Array.isArray(abandonedHistory)) {
                    abandonedHistory.forEach(item => {
                        const itemDate = new Date(item.date);
                        const key = itemDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                        if (volumeMap.has(key)) {
                            const entry = volumeMap.get(key);
                            entry.abandoned += 1;
                            entry.incoming += 1; // Abandoned also counts as incoming
                        }
                    });
                }

                // Volume Data
                setCallVolumeData(Array.from(volumeMap.values()));

                // Stats Data (Trends)
                const newStatsData = Array.from(volumeMap.values()).map(day => ({
                    day: day.name,
                    avgSentiment: day.count > 0 ? parseFloat((day.sentimentSum / day.count).toFixed(1)) : 0,
                    positivePct: day.count > 0 ? Math.round((day.positiveCount / day.count) * 100) : 0
                }));
                setStatsData(newStatsData);

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            }
        };

        fetchDashboardData();
    }, [user]);

    return (
        <main className="lg:ml-20 ml-0 min-h-screen bg-gray-50 p-4 pb-24 lg:pb-4 max-w-full">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Performance Dashboard</h1>

                {/* STATS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6 mt-4">
                    <CompactStatCard
                        title="Incoming Calls"
                        value={incomingCalls}
                        change={15.3}
                        icon={Phone}
                        color="bg-indigo-500"
                    />
                    <CompactStatCard
                        title="Answered Calls"
                        value={answeredCalls}
                        change={12.1}
                        icon={CheckCircle}
                        color="bg-emerald-500"
                    />
                    <CompactStatCard
                        title="Abandoned Calls"
                        value={abandonedCalls}
                        change={-5.2}
                        icon={PhoneOff}
                        color="bg-red-500"
                    />
                    <ServiceLevelCard answered={answeredCalls} total={incomingCalls} />
                </div>

                {/* CHARTS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <CallVolumeChart data={callVolumeData} />
                    <SentimentCard data={sentimentData} />
                </div>

                {/* BOTTOM */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <AdditionalStats data={statsData} />
                    <TopPerformers agents={topAgents} />
                </div>
            </div>
        </main>
    );
};

export default Home;
