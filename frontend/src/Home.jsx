import React, { useState } from "react";
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
  Star,
  Download,
  RefreshCw,
  MessageSquare,
} from "lucide-react";

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

const additionalStatsData = [
  { day: "Mon", avgWait: 42, sla: 78 },
  { day: "Tue", avgWait: 38, sla: 82 },
  { day: "Wed", avgWait: 45, sla: 76 },
  { day: "Thu", avgWait: 40, sla: 80 },
  { day: "Fri", avgWait: 36, sla: 85 },
  { day: "Sat", avgWait: 48, sla: 72 },
  { day: "Sun", avgWait: 44, sla: 75 },
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

      {/* ✅ Overflow-safe icon container */}
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

        {/* ✅ Overflow-safe icon */}
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

/* ----------- ADDITIONAL STATS (LINE GRAPH) ----------- */

const AdditionalStats = () => (
  <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-4 shadow-md hover:shadow-lg transition-shadow" data-aos="fade-up">
    <p className="text-xs font-medium text-gray-500 uppercase mb-3">
      Additional Stats
    </p>

    <div className="h-64 mt-16 mr-8">
      <ResponsiveContainer>
        <LineChart data={additionalStatsData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="avgWait"
            stroke="#6366f1"
            strokeWidth={2}
            name="Avg Wait (sec)"
          />
          <Line
            type="monotone"
            dataKey="sla"
            stroke="#10b981"
            strokeWidth={2}
            name="Service Level %"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

/* ---------------- TOP PERFORMERS (UNCHANGED) ---------------- */

const TopPerformers = () => {
  const agents = [
    { name: "Alex Johnson", calls: 120, satisfaction: 4.9, resolved: "98%" },
    { name: "Maria Garcia", calls: 115, satisfaction: 4.8, resolved: "95%" },
    { name: "James Smith", calls: 110, satisfaction: 4.7, resolved: "92%" },
    { name: "Emily White", calls: 105, satisfaction: 4.9, resolved: "99%" },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-md hover:shadow-lg transition-shadow" data-aos="fade-up" data-aos-delay="100">
      <div className="flex justify-between mb-3">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase">
            Top Performers
          </p>
          <p className="text-xs text-gray-600">
            Agents with highest satisfaction
          </p>
        </div>
        <MoreVertical className="w-4 h-4 text-gray-400" />
      </div>

      <div className="space-y-3">
        {agents.map((agent, index) => (
          <div key={index} className="flex items-center">
            <img
              src={`https://i.pravatar.cc/40?u=${agent.name}`}
              alt={agent.name}
              className="w-8 h-8 rounded-full mr-3"
            />
            <div className="flex-1">
              <p className="text-sm font-medium">{agent.name}</p>
              <div className="flex text-xs text-gray-500 space-x-2">
                <span>{agent.calls} calls</span>
                <span>|</span>
                <span className="flex items-center">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" />
                  {agent.satisfaction}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-emerald-600">
                {agent.resolved}
              </p>
              <p className="text-xs text-gray-500">Resolved</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* -------------------- MAIN PAGE -------------------- */

const Home = ({ answeredCalls = 405, abandonedCalls = 22 }) => {
  const incomingCalls = answeredCalls + abandonedCalls;

  return (
    <div className="lg:ml-20 ml-0 bg-gray-50 min-h-screen p-6 pb-24 lg:pb-6">
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
        <CallVolumeChart data={initialCallData} />
        <SentimentCard data={initialSentimentData} />
      </div>

      {/* BOTTOM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AdditionalStats />
        <TopPerformers />
      </div>
    </div>
  );
};

export default Home;