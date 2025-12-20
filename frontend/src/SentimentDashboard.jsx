import React, { useState } from "react";
import axios from "axios";
import { ReactMediaRecorder } from "react-media-recorder-2";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { Upload, Mic, FileText, BarChart2, Clock, ChevronUp, ChevronDown } from "lucide-react";

const COLORS = ["#10b981", "#ef4444", "#f59e0b"];

const CompactStatCard = ({ title, value, change, icon: Icon, color }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-md hover:shadow-xl transition-shadow" data-aos="fade-up">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{title}</p>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
        </div>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <div className={`flex items-center text-xs ${change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
        {change >= 0 ? <ChevronUp className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
        <span className="font-medium">{Math.abs(change)}%</span>
        <span className="text-gray-500 ml-1">vs prev. analysis</span>
      </div>
    </div>
  );
};

const StatCardPlaceholder = ({ title, Icon }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-md hover:shadow-xl transition-shadow" data-aos="fade-up">
    <div className="flex items-start justify-between mb-2">
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{title}</p>
        <div className="text-2xl font-bold text-gray-400">-</div>
      </div>
      <div className="p-2 rounded-lg bg-gray-200">
        <Icon className="w-4 h-4 text-gray-400" />
      </div>
    </div>
    <div className="flex items-center text-xs text-gray-400 mt-1">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
  </div>
);

export default function SentimentDashboard({
  user,
  onAnalysisComplete,
  result,
  callerName,
  onCallerNameChange,
  file,
  onFileChange,
}) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleUpload = (e) => {
    onFileChange(e.target.files[0]);
  };

  const analyzeAudio = async () => {
    if (!callerName.trim()) return alert("Please enter a name.");
    if (!file) return alert("Select or record audio!");

    setIsAnalyzing(true);
    const form = new FormData();
    form.append("audio", file);
    form.append("callerName", callerName);
    if (user && user._id) {
      form.append("userId", user._id);
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/process-call`, form);
      const analysisResult = res.data.data;

      const positiveCount = analysisResult.positiveKeywords?.length || 0;
      const negativeCount = analysisResult.negativeKeywords?.length || 0;

      const totalWords = analysisResult.transcript ? analysisResult.transcript.split(' ').filter(w => w.length > 0).length : 0;

      const neutralCount = Math.max(0, totalWords - (positiveCount + negativeCount));

      const sentimentData = {
        ...analysisResult,
        name: analysisResult.callerName,
        positive: positiveCount,
        negative: negativeCount,
        neutral: neutralCount,
      };
      onAnalysisComplete({ success: true, data: sentimentData });
    } catch (err) {
      console.error(err);
      alert("Error analyzing audio");
      onAnalysisComplete({ success: false });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sentimentChartData = result && result.success ? [
    { name: 'Positive', value: result.data.positive, color: '#10b981' },
    { name: 'Negative', value: result.data.negative, color: '#ef4444' },
    { name: 'Neutral', value: result.data.neutral, color: '#f59e0b' },
  ] : [];

  return (
    <main className="lg:ml-20 ml-0 min-h-screen bg-gray-50 p-4 pb-24 lg:pb-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-900">Sentiment Analysis</h1>
          <p className="text-xs text-gray-600 mt-0.5">Upload or record audio to analyze customer sentiment.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 h-157 shadow-md hover:shadow-xl transition-shadow" data-aos="fade-left">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Analyze New Call</h2>
              <div className="space-y-3">
                <input
                  type="text"
                  value={callerName}
                  onChange={(e) => onCallerNameChange(e.target.value)}
                  className="mb-4 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter Caller's Name"
                />
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-60 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center">
                      <Upload size={28} className="mt-25 text-gray-400" />
                      <p className="text-xs text-gray-500 mt-1"><span className="font-semibold">Click to upload</span> or drag & drop</p>
                    </div>
                    <input type="file" className="hidden" onChange={handleUpload} accept="audio/*" />
                  </label>
                </div>
                {file && <p className="text-xs text-gray-600">File: {file.name}</p>}
                <ReactMediaRecorder
                  audio
                  onStop={(url, blob) => onFileChange(new File([blob], "recording.wav", { type: "audio/wav" }))}
                  render={({ startRecording, stopRecording, status }) => (
                    <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg mt-4">
                      <div className="flex items-center gap-2">
                        <Mic size={16} className="text-gray-600" />
                        <p className="text-xs font-medium text-gray-700 mt-3">Record Audio</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={startRecording} className="px-4 py-1 text-xs bg-green-100 text-green-700 !rounded-full hover:bg-green-200">Start</button>
                        <button onClick={stopRecording} className="px-4 py-1 text-xs bg-red-100 text-red-700 !rounded-full hover:bg-red-200">Stop</button>
                      </div>
                    </div>
                  )}
                />
                <button
                  className="!rounded-full w-full h-18 y-2 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-800 transition-colors "
                  onClick={analyzeAudio}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Sentiment"}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {result && result.success ? (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <CompactStatCard title="Positive" value={result.data.positive} change={10} icon={ChevronUp} color="bg-green-500" />
                  <CompactStatCard title="Negative" value={result.data.negative} change={-5} icon={ChevronDown} color="bg-red-500" />
                  <CompactStatCard title="Neutral" value={result.data.neutral} change={2} icon={ChevronUp} color="bg-yellow-500" />
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 shadow-md hover:shadow-xl transition-shadow" data-aos="fade-right">
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">Sentiment Visualization for {result.data.name}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sentimentChartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '0.5rem' }} />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {sentimentChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={sentimentChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} labelLine={false} label={({ name, percent, value }) => value > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}>
                            {sentimentChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '0.5rem' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 shadow-md hover:shadow-xl transition-shadow" data-aos="fade-up">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center"><FileText size={18} className="mr-2" /> Transcript</h2>
                  <div className="p-3 bg-gray-50 rounded-lg max-h-36 overflow-y-auto text-xs text-gray-700 leading-relaxed">
                    {result.data.transcript || "No transcript available."}
                  </div>
                </div>
              </>

            ) : (
              <>

                <div className="grid grid-cols-3 gap-4">
                  <StatCardPlaceholder title="Positive" Icon={ChevronUp} />
                  <StatCardPlaceholder title="Negative" Icon={ChevronDown} />
                  <StatCardPlaceholder title="Neutral" Icon={ChevronUp} />
                </div>
                <div className="flex flex-col items-center justify-center bg-white p-4 rounded-xl shadow-sm border border-gray-200 shadow-md hover:shadow-xl transition-shadow" style={{ height: '320px' }} data-aos="fade-right">
                  <div className="text-center">
                    <BarChart2 size={48} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800">Sentiment Visualization</h3>
                    <p className="text-sm text-gray-500 mt-1">Graphs will appear here after analysis.</p>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center bg-white p-4 rounded-xl shadow-sm border border-gray-200 shadow-md hover:shadow-xl transition-shadow" style={{ height: '150px' }} data-aos="fade-up">
                  <div className="text-center">
                    <FileText size={48} className="text-gray-300 mx-auto" />
                    <h3 className="text-lg font-semibold text-gray-800">Transcript</h3>
                    <p className="text-sm text-gray-500 mt-1">Transcript will appear here.</p>
                  </div>
                </div>
              </>

            )}
          </div>
        </div>
      </div>
    </main>
  );
}