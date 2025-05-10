import { useState, useEffect } from 'react';
import { Search, Target, ChevronDown, Award, Calendar, MapPin, Activity } from 'lucide-react';
import { 
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import axios from 'axios';

// API key for Cricbuzz
const API_KEY = 'e4cfe50474msh3678b3dd360d14bp132c36jsn172ec647c633';

const formatNumber = (num) => {
  if (!num) return '0';
  return parseInt(num).toLocaleString();
};

export default function PlayersStats() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [playerInfo, setPlayerInfo] = useState(null);
    const [battingStats, setBattingStats] = useState(null);
    const [bowlingStats, setBowlingStats] = useState(null);
    const [activeTab, setActiveTab] = useState('batting');
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Search for players by name
    const searchPlayers = async (name) => {
        if (!name || name.trim().length < 3) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const options = {
                method: 'GET',
                url: 'https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/search',
                params: {
                    plrN: name
                },
                headers: {
                    'x-rapidapi-key': API_KEY,
                    'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
                }
            };
            
            const response = await axios.request(options);
            setSearchResults(response.data.player || []);
        } catch (error) {
            console.error("Error searching players:", error);
            setError("Failed to search players. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    
    // Get player info by ID
    const getPlayerInfo = async (playerId) => {
        setLoading(true);
        setError(null);
        
        try {
            const options = {
                method: 'GET',
                url: `https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/${playerId}`,
                headers: {
                    'x-rapidapi-key': API_KEY,
                    'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
                }
            };
            
            const response = await axios.request(options);
            setPlayerInfo(response.data);
        } catch (error) {
            console.error("Error fetching player info:", error);
            setError("Failed to fetch player information. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    
    // Get batting stats by player ID
    const getBattingStats = async (playerId) => {
        setLoading(true);
        
        try {
            const options = {
                method: 'GET',
                url: `https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/${playerId}/batting`,
                headers: {
                    'x-rapidapi-key': API_KEY,
                    'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
                }
            };
            
            const response = await axios.request(options);
            setBattingStats(response.data);
        } catch (error) {
            console.error("Error fetching batting stats:", error);
        } finally {
            setLoading(false);
        }
    };
    
    // Get bowling stats by player ID
    const getBowlingStats = async (playerId) => {
        setLoading(true);
        
        try {
            const options = {
                method: 'GET',
                url: `https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/${playerId}/bowling`,
                headers: {
                    'x-rapidapi-key': API_KEY,
                    'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
                }
            };
            
            const response = await axios.request(options);
            setBowlingStats(response.data);
        } catch (error) {
            console.error("Error fetching bowling stats:", error);
        } finally {
            setLoading(false);
        }
    };
    
    // Handle search input changes with debounce
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm.trim().length >= 3) {
                searchPlayers(searchTerm);
            }
        }, 500);
        
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);
    
    // Load player data when a player is selected
    useEffect(() => {
        if (selectedPlayer) {
            getPlayerInfo(selectedPlayer.id);
            getBattingStats(selectedPlayer.id);
            getBowlingStats(selectedPlayer.id);
        }
    }, [selectedPlayer]);
    
    // Prepare chart data for batting
    const battingChartData = battingStats ? [
        { name: 'Test', runs: parseInt(battingStats.values[2]?.values[1] || 0), avg: parseFloat(battingStats.values[5]?.values[1] || 0) },
        { name: 'ODI', runs: parseInt(battingStats.values[2]?.values[2] || 0), avg: parseFloat(battingStats.values[5]?.values[2] || 0) },
        { name: 'T20', runs: parseInt(battingStats.values[2]?.values[3] || 0), avg: parseFloat(battingStats.values[5]?.values[3] || 0) },
        { name: 'IPL', runs: parseInt(battingStats.values[2]?.values[4] || 0), avg: parseFloat(battingStats.values[5]?.values[4] || 0) }
    ] : [];

    // Prepare chart data for bowling
    const bowlingChartData = bowlingStats ? [
        { name: 'Test', wickets: parseInt(bowlingStats.values[5]?.values[1] || 0), economy: parseFloat(bowlingStats.values[7]?.values[1] || 0) },
        { name: 'ODI', wickets: parseInt(bowlingStats.values[5]?.values[2] || 0), economy: parseFloat(bowlingStats.values[7]?.values[2] || 0) },
        { name: 'T20', wickets: parseInt(bowlingStats.values[5]?.values[3] || 0), economy: parseFloat(bowlingStats.values[7]?.values[3] || 0) },
        { name: 'IPL', wickets: parseInt(bowlingStats.values[5]?.values[4] || 0), economy: parseFloat(bowlingStats.values[7]?.values[4] || 0) }
    ] : [];

    // Prepare pie chart data for centuries and half-centuries
    const centuriesData = battingStats ? [
        { name: '100s', value: parseInt(battingStats.values[12]?.values[1] || 0) + 
                               parseInt(battingStats.values[12]?.values[2] || 0) + 
                               parseInt(battingStats.values[12]?.values[3] || 0) + 
                               parseInt(battingStats.values[12]?.values[4] || 0) },
        { name: '50s', value: parseInt(battingStats.values[11]?.values[1] || 0) + 
                              parseInt(battingStats.values[11]?.values[2] || 0) + 
                              parseInt(battingStats.values[11]?.values[3] || 0) + 
                              parseInt(battingStats.values[11]?.values[4] || 0) }
    ] : [];

    // Prepare radar chart data
    const radarData = battingStats ? [
        {
            subject: 'Test',
            value: parseInt(battingStats.values[2]?.values[1] || 0) / 2000, // Normalized for better visualization
            fullMark: 5,
        },
        {
            subject: 'ODI',
            value: parseInt(battingStats.values[2]?.values[2] || 0) / 2000,
            fullMark: 5,
        },
        {
            subject: 'T20',
            value: parseInt(battingStats.values[2]?.values[3] || 0) / 1000,
            fullMark: 5,
        },
        {
            subject: 'IPL',
            value: parseInt(battingStats.values[2]?.values[4] || 0) / 1500,
            fullMark: 5,
        },
    ] : [];

    // Colors for charts
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
    const statsBoxColors = ['bg-blue-900/30', 'bg-emerald-900/30', 'bg-amber-900/30', 'bg-red-900/30'];

    // Default player to show on initial load
    useEffect(() => {
        // Load Virat Kohli as default player
        if (!selectedPlayer && !loading) {
            searchPlayers("virat kohli");
        }
    }, []);

    // Set first search result as selected player if none is selected
    useEffect(() => {
        if (searchResults.length > 0 && !selectedPlayer) {
            setSelectedPlayer(searchResults[0]);
        }
    }, [searchResults]);

    return (
        <div className="bg-gray-900 min-h-screen text-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 shadow-xl">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                    <h1 className="text-3xl font-bold mb-4 md:mb-0 flex items-center">
                        <Target className="mr-2 text-blue-300" size={28} />
                        Cricket Analytics Hub
                    </h1>
                    
                    <div className="relative w-full md:w-80">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search players..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => setShowDropdown(true)}
                                className="w-full bg-gray-800/70 text-white border border-gray-700 rounded-lg py-2 px-4 pl-10 
                                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            {loading && <div className="absolute right-3 top-2.5 text-gray-400">Loading...</div>}
                        </div>
                        
                        {showDropdown && searchResults.length > 0 && (
                            <div className="absolute z-10 w-full bg-gray-800 mt-1 rounded-lg shadow-2xl border border-gray-700 overflow-hidden">
                                {searchResults.map((player) => (
                                    <div 
                                        key={player.id} 
                                        className="p-3 hover:bg-blue-800/30 cursor-pointer transition-colors border-b border-gray-700 last:border-0 flex items-center"
                                        onClick={() => {
                                            setSelectedPlayer(player);
                                            setSearchTerm('');
                                            setShowDropdown(false);
                                        }}
                                    >
                                        <div className="h-8 w-8 mr-3 bg-blue-900 rounded-full flex items-center justify-center overflow-hidden">
                                            <span className="font-bold">{player.name.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <div className="font-semibold">{player.name}</div>
                                            <div className="text-xs text-gray-400">{player.teamName}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {loading && !playerInfo ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-900/30 p-4 rounded-lg text-center">
                        {error}
                    </div>
                ) : playerInfo ? (
                    <>
                        {/* Player Hero Section */}
                        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden mb-8">
                            <div className="flex flex-col md:flex-row">
                                <div className="md:w-1/3 bg-gradient-to-br from-blue-900 to-indigo-900 p-6">
                                    <div className="aspect-w-3 aspect-h-4 bg-white pt-5 overflow-hidden shadow-lg mb-4 rounded-full">
                                        <img 
                                            src={playerInfo.image || `https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/${playerInfo.faceImageId}.png`}
                                            alt={playerInfo.name}
                                            className="object-cover w-full h-full"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = `https://ui-avatars.com/api/?name=${playerInfo.name.charAt(0)}&background=0D47A1&color=fff&size=150`;
                                            }}
                                        />
                                    </div>
                                    <h2 className="text-3xl font-bold mb-1">{playerInfo.name}</h2>
                                    <p className="text-blue-300 mb-4 flex items-center">
                                        <Award size={16} className="mr-1" />
                                        {playerInfo.role || playerInfo.bat}
                                    </p>
                                    
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center">
                                            <Calendar size={16} className="mr-2 text-gray-400" />
                                            <span className="text-gray-300">Born: {playerInfo.DoBFormat || playerInfo.DoB}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <MapPin size={16} className="mr-2 text-gray-400" />
                                            <span className="text-gray-300">{playerInfo.birthPlace}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Activity size={16} className="mr-2 text-gray-400" />
                                            <span className="text-gray-300">Batting: {playerInfo.bat}</span>
                                        </div>
                                        {playerInfo.bowl && playerInfo.bowl !== "-" && (
                                            <div className="flex items-center">
                                                <Activity size={16} className="mr-2 text-gray-400" />
                                                <span className="text-gray-300">Bowling: {playerInfo.bowl}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="md:w-2/3 p-6">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold mb-2">Biography</h3>
                                        <div className="text-gray-300 text-sm h-32 overflow-y-auto pr-2" 
                                             dangerouslySetInnerHTML={{ __html: playerInfo.bio || "No biography available." }}>
                                        </div>
                                    </div>
                                    
                                    {/* Stats Tabs */}
                                    <div className="mb-4">
                                        <div className="flex border-b border-gray-700">
                                            <button 
                                                className={`py-2 px-4 font-medium text-sm ${activeTab === 'batting' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                                                onClick={() => setActiveTab('batting')}
                                            >
                                                Batting Stats
                                            </button>
                                            <button 
                                                className={`py-2 px-4 font-medium text-sm ${activeTab === 'bowling' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                                                onClick={() => setActiveTab('bowling')}
                                            >
                                                Bowling Stats
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Stats Overview */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                        {activeTab === 'batting' ? (
                                            <>
                                                <div className={`${statsBoxColors[0]} rounded-lg p-3`}>
                                                    <div className="text-xs text-gray-400">Total Runs</div>
                                                    <div className="text-2xl font-bold">
                                                        {formatNumber(
                                                            (parseInt(battingStats?.values[2]?.values[1] || 0) +
                                                            parseInt(battingStats?.values[2]?.values[2] || 0) +
                                                            parseInt(battingStats?.values[2]?.values[3] || 0) +
                                                            parseInt(battingStats?.values[2]?.values[4] || 0))
                                                        )}
                                                    </div>
                                                </div>
                                                <div className={`${statsBoxColors[1]} rounded-lg p-3`}>
                                                    <div className="text-xs text-gray-400">Highest Score</div>
                                                    <div className="text-2xl font-bold">
                                                        {battingStats?.values[4]?.values[1] || '0'}
                                                    </div>
                                                </div>
                                                <div className={`${statsBoxColors[2]} rounded-lg p-3`}>
                                                    <div className="text-xs text-gray-400">Centuries</div>
                                                    <div className="text-2xl font-bold">
                                                        {formatNumber(
                                                            (parseInt(battingStats?.values[12]?.values[1] || 0) +
                                                            parseInt(battingStats?.values[12]?.values[2] || 0) +
                                                            parseInt(battingStats?.values[12]?.values[3] || 0) +
                                                            parseInt(battingStats?.values[12]?.values[4] || 0))
                                                        )}
                                                    </div>
                                                </div>
                                                <div className={`${statsBoxColors[3]} rounded-lg p-3`}>
                                                    <div className="text-xs text-gray-400">Total Wickets</div>
                                                    <div className="text-2xl font-bold">
                                                        {formatNumber(
                                                            (parseInt(bowlingStats?.values[5]?.values[1] || 0) +
                                                            parseInt(bowlingStats?.values[5]?.values[2] || 0) +
                                                            parseInt(bowlingStats?.values[5]?.values[3] || 0) +
                                                            parseInt(bowlingStats?.values[5]?.values[4] || 0))
                                                        )}
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className={`${statsBoxColors[0]} rounded-lg p-3`}>
                                                    <div className="text-xs text-gray-400">Total Wickets</div>
                                                    <div className="text-2xl font-bold">
                                                        {formatNumber(
                                                            (parseInt(bowlingStats?.values[5]?.values[1] || 0) +
                                                            parseInt(bowlingStats?.values[5]?.values[2] || 0) +
                                                            parseInt(bowlingStats?.values[5]?.values[3] || 0) +
                                                            parseInt(bowlingStats?.values[5]?.values[4] || 0))
                                                        )}
                                                    </div>
                                                </div>
                                                <div className={`${statsBoxColors[1]} rounded-lg p-3`}>
                                                    <div className="text-xs text-gray-400">Best Bowling</div>
                                                    <div className="text-2xl font-bold">
                                                        {bowlingStats?.values[3]?.values[1] || '0/0'}
                                                    </div>
                                                </div>
                                                <div className={`${statsBoxColors[2]} rounded-lg p-3`}>
                                                    <div className="text-xs text-gray-400">Economy Rate</div>
                                                    <div className="text-2xl font-bold">
                                                        {formatNumber(
                                                            (parseFloat(bowlingStats?.values[7]?.values[1] || 0) +
                                                            parseFloat(bowlingStats?.values[7]?.values[2] || 0) +
                                                            parseFloat(bowlingStats?.values[7]?.values[3] || 0) +
                                                            parseFloat(bowlingStats?.values[7]?.values[4] || 0)) / 4
                                                        )}
                                                    </div>
                                                </div>
                                                <div className={`${statsBoxColors[3]} rounded-lg p-3`}>
                                                    <div className="text-xs text-gray-400">Average Wickets</div>
                                                    <div className="text-2xl font-bold">
                                                        {formatNumber(
                                                            (parseFloat(bowlingStats?.values[6]?.values[1] || 0) +
                                                            parseFloat(bowlingStats?.values[6]?.values[2] || 0) +
                                                            parseFloat(bowlingStats?.values[6]?.values[3] || 0) +
                                                            parseFloat(bowlingStats?.values[6]?.values[4] || 0)) / 4
                                                        )}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs for Stats */}
                        <div className="flex mb-6 bg-gray-800 rounded-lg p-3 shadow-lg max-w-xs gap-3 ">
                            <button 
                                className={`flex-1 px-4 py-2 rounded-md transition-all duration-200 ${activeTab === 'batting' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                onClick={() => setActiveTab('batting')}
                            >
                                Batting
                            </button>
                            <button 
                                className={`flex-1 px-4 py-2 rounded-md transition-all duration-200 ${activeTab === 'bowling' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                onClick={() => setActiveTab('bowling')}
                            >
                                Bowling
                            </button>
                        </div>

                        {/* Statistics Content */}
                        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl mb-8">
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-6">
                                    {activeTab === 'batting' ? 'Batting Statistics' : 'Bowling Statistics'}
                                </h3>
                                
                                {/* Format Stats Table */}
                                <div className="overflow-x-auto mb-8">
                                    <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden">
                                        <thead className="bg-gray-800">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Format</th>
                                                {activeTab === 'batting' ? (
                                                    <>
                                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">M</th>
                                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Runs</th>
                                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">HS</th>
                                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Avg</th>
                                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">SR</th>
                                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">50s</th>
                                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">100s</th>
                                                    </>
                                                ) : (
                                                    <>
                                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">M</th>
                                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">W</th>
                                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Best</th>
                                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Econ</th>
                                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Avg</th>
                                                    </>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800">
                                            {['Test', 'ODI', 'T20', 'IPL'].map((format, idx) => (
                                                <tr key={format} className="hover:bg-gray-800/50 transition-colors">
                                                    <td className="px-4 py-3 text-sm font-medium">{format}</td>
                                                    {activeTab === 'batting' ? (
                                                        <>
                                                            <td className="px-4 py-3 text-sm">{battingStats?.values[1]?.values[idx+1] || '0'}</td>
                                                            <td className="px-4 py-3 text-sm">{formatNumber(battingStats?.values[2]?.values[idx+1] || 0)}</td>
                                                            <td className="px-4 py-3 text-sm">{battingStats?.values[3]?.values[idx+1] || '0'}</td>
                                                            <td className="px-4 py-3 text-sm">{battingStats?.values[5]?.values[idx+1] || '0.00'}</td>
                                                            <td className="px-4 py-3 text-sm">{battingStats?.values[4]?.values[idx+1] || '0.00'}</td>
                                                            <td className="px-4 py-3 text-sm">{battingStats?.values[11]?.values[idx+1] || '0'}</td>
                                                            <td className="px-4 py-3 text-sm">{battingStats?.values[12]?.values[idx+1] || '0'}</td>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <td className="px-4 py-3 text-sm">{bowlingStats?.values[1]?.values[idx+1] || '0'}</td>
                                                            <td className="px-4 py-3 text-sm">{bowlingStats?.values[2]?.values[idx+1] || '0'}</td>
                                                            <td className="px-4 py-3 text-sm">{bowlingStats?.values[3]?.values[idx+1] || '0/0'}</td>
                                                            <td className="px-4 py-3 text-sm">{bowlingStats?.values[4]?.values[idx+1] || '0.00'}</td>
                                                            <td className="px-4 py-3 text-sm">{bowlingStats?.values[5]?.values[idx+1] || '0.00'}</td>
                                                        </>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                
                                {/* Charts */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Bar Chart */}
                                    <div className="bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-800">
                                        <h4 className="text-lg font-semibold mb-4">
                                            {activeTab === 'batting' ? 'Runs & Average by Format' : 'Wickets & Economy by Format'}
                                        </h4>
                                        <div className="h-80">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                    data={activeTab === 'batting' ? battingChartData : bowlingChartData}
                                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                                    <XAxis dataKey="name" stroke="#9CA3AF" />
                                                    <YAxis stroke="#9CA3AF" />
                                                    <Tooltip 
                                                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', color: '#F9FAFB' }}
                                                        itemStyle={{ color: '#F9FAFB' }}
                                                    />
                                                    <Legend wrapperStyle={{ color: '#D1D5DB' }} />
                                                    {activeTab === 'batting' ? (
                                                        <>
                                                            <Bar dataKey="runs" name="Runs" fill="#3B82F6" />
                                                            <Bar dataKey="avg" name="Average" fill="#10B981" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Bar dataKey="wickets" name="Wickets" fill="#3B82F6" />
                                                            <Bar dataKey="economy" name="Economy" fill="#EF4444" />
                                                        </>
                                                    )}
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    
                                    {/* Pie/Radar Chart */}
                                    <div className="bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-800">
                                        <h4 className="text-lg font-semibold mb-4">
                                            {activeTab === 'batting' ? 'Centuries & Half-Centuries' : 'Performance Analysis'}
                                        </h4>
                                        <div className="h-80">
                                            <ResponsiveContainer width="100%" height="100%">
                                                {activeTab === 'batting' ? (
                                                    <PieChart>
                                                        <Pie
                                                            data={centuriesData}
                                                            cx="50%"
                                                            cy="50%"
                                                            labelLine={true}
                                                            label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                                                            outerRadius={80}
                                                            fill="#8884d8"
                                                            dataKey="value"
                                                        >
                                                            {centuriesData.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip 
                                                            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', color: '#F9FAFB' }}
                                                            formatter={(value, name) => [`${value}`, name]}
                                                        />
                                                    </PieChart>
                                                ) : (
                                                    <RadarChart cx="50%" cy="50%" outerRadius={80} data={radarData}>
                                                        <PolarGrid stroke="#4B5563" />
                                                        <PolarAngleAxis dataKey="subject" stroke="#9CA3AF" />
                                                        <PolarRadiusAxis stroke="#9CA3AF" />
                                                        <Radar name="Performance" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                                                        <Tooltip 
                                                            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', color: '#F9FAFB' }}
                                                        />
                                                    </RadarChart>
                                                )}
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Performance Comparison */}
                        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl mb-8">
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-6 flex items-center">
                                    <ChevronDown className="mr-2 text-blue-400" size={20} />
                                    Format Performance Comparison
                                </h3>
                                
                                <div className="h-96">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius={150} data={radarData}>
                                            <PolarGrid stroke="#4B5563" />
                                            <PolarAngleAxis dataKey="subject" stroke="#9CA3AF" />
                                            <PolarRadiusAxis stroke="#9CA3AF" />
                                            <Radar name="Batting Performance" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', color: '#F9FAFB' }}
                                                formatter={(value) => [`${(value * 5).toFixed(2)} Rating`, 'Performance']}
                                            />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
}


