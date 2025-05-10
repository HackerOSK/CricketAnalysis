import { useState, useEffect } from 'react';
import { FaTrophy, FaFilter, FaCalendarAlt, FaMedal, FaBaseballBall, FaTable, FaChartBar } from 'react-icons/fa';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

function Tournament_overview() {
    // State for filters
    const [tournamentType, setTournamentType] = useState('IPL');
    const [year, setYear] = useState(2023);
    const [activeTab, setActiveTab] = useState('points');
    
    // Sample data - would be fetched from database in real implementation
    const tournaments = [
        { id: 1, name: 'IPL 2023', type: 'IPL', year: 2023 },
        { id: 2, name: 'T20 World Cup 2022', type: 'T20 World Cup', year: 2022 },
        { id: 3, name: 'ODI World Cup 2023', type: 'ODI World Cup', year: 2023 },
        { id: 4, name: 'Champions Trophy 2017', type: 'Champions Trophy', year: 2017 },
        { id: 5, name: 'IPL 2022', type: 'IPL', year: 2022 },
    ];
    
    // Available years for filtering
    const years = [2023, 2022, 2021, 2020, 2019, 2018, 2017];
    
    // Available tournament types for filtering
    const tournamentTypes = ['IPL', 'ODI World Cup', 'T20 World Cup', 'Champions Trophy'];
    
    // Points table data
    const pointsTableData = {
        'IPL-2023': [
            { team: 'Gujarat Titans', played: 14, won: 10, lost: 4, nr: 0, points: 20, nrr: 0.809 },
            { team: 'Chennai Super Kings', played: 14, won: 8, lost: 5, nr: 1, points: 17, nrr: 0.381 },
            { team: 'Lucknow Super Giants', played: 14, won: 8, lost: 6, nr: 0, points: 16, nrr: 0.284 },
            { team: 'Mumbai Indians', played: 14, won: 8, lost: 6, nr: 0, points: 16, nrr: -0.044 },
            { team: 'Rajasthan Royals', played: 14, won: 7, lost: 7, nr: 0, points: 14, nrr: 0.148 },
            { team: 'Royal Challengers Bangalore', played: 14, won: 7, lost: 7, nr: 0, points: 14, nrr: 0.135 },
            { team: 'Kolkata Knight Riders', played: 14, won: 6, lost: 8, nr: 0, points: 12, nrr: 0.147 },
            { team: 'Punjab Kings', played: 14, won: 6, lost: 8, nr: 0, points: 12, nrr: -0.304 },
            { team: 'Delhi Capitals', played: 14, won: 5, lost: 9, nr: 0, points: 10, nrr: -0.808 },
            { team: 'Sunrisers Hyderabad', played: 14, won: 4, lost: 10, nr: 0, points: 8, nrr: -0.590 }
        ],
        'T20 World Cup-2022': [
            { team: 'England', played: 6, won: 5, lost: 1, nr: 0, points: 10, nrr: 2.371 },
            { team: 'Pakistan', played: 6, won: 4, lost: 2, nr: 0, points: 8, nrr: 1.028 },
            { team: 'India', played: 6, won: 4, lost: 2, nr: 0, points: 8, nrr: 0.975 },
            { team: 'New Zealand', played: 5, won: 3, lost: 1, nr: 1, points: 7, nrr: 2.113 },
            { team: 'Australia', played: 5, won: 3, lost: 1, nr: 1, points: 7, nrr: 1.216 },
            { team: 'South Africa', played: 5, won: 2, lost: 2, nr: 1, points: 5, nrr: 0.874 }
        ],
        'ODI World Cup-2023': [
            { team: 'India', played: 11, won: 10, lost: 1, nr: 0, points: 20, nrr: 2.407 },
            { team: 'Australia', played: 11, won: 8, lost: 3, nr: 0, points: 16, nrr: 0.841 },
            { team: 'South Africa', played: 10, won: 7, lost: 3, nr: 0, points: 14, nrr: 1.261 },
            { team: 'New Zealand', played: 10, won: 5, lost: 5, nr: 0, points: 10, nrr: 0.743 },
            { team: 'Pakistan', played: 9, won: 4, lost: 5, nr: 0, points: 8, nrr: -0.047 },
            { team: 'Afghanistan', played: 9, won: 4, lost: 5, nr: 0, points: 8, nrr: -0.336 }
        ],
        'Champions Trophy-2017': [
            { team: 'Pakistan', played: 5, won: 4, lost: 1, nr: 0, points: 8, nrr: 0.474 },
            { team: 'India', played: 5, won: 3, lost: 2, nr: 0, points: 6, nrr: 0.897 },
            { team: 'England', played: 4, won: 3, lost: 1, nr: 0, points: 6, nrr: 0.315 },
            { team: 'Bangladesh', played: 5, won: 2, lost: 3, nr: 0, points: 4, nrr: -0.407 },
            { team: 'Sri Lanka', played: 3, won: 1, lost: 2, nr: 0, points: 2, nrr: -0.259 },
            { team: 'South Africa', played: 3, won: 1, lost: 2, nr: 0, points: 2, nrr: -0.649 }
        ]
    };
    
    // Top performers data
    const topPerformersData = {
        'IPL-2023': {
            batsmen: [
                { name: 'Shubman Gill', team: 'GT', matches: 17, runs: 890, avg: 59.33, sr: 157.80, fifties: 4, hundreds: 3 },
                { name: 'Faf du Plessis', team: 'RCB', matches: 14, runs: 730, avg: 56.15, sr: 153.68, fifties: 8, hundreds: 0 },
                { name: 'Devon Conway', team: 'CSK', matches: 16, runs: 672, avg: 51.69, sr: 139.70, fifties: 6, hundreds: 0 },
                { name: 'Virat Kohli', team: 'RCB', matches: 14, runs: 639, avg: 53.25, sr: 139.82, fifties: 6, hundreds: 2 },
                { name: 'Yashasvi Jaiswal', team: 'RR', matches: 14, runs: 625, avg: 48.08, sr: 163.61, fifties: 5, hundreds: 1 }
            ],
            bowlers: [
                { name: 'Mohammed Shami', team: 'GT', matches: 17, wickets: 28, economy: 8.03, avg: 18.64, sr: 13.93 },
                { name: 'Rashid Khan', team: 'GT', matches: 17, wickets: 27, economy: 8.24, avg: 20.81, sr: 15.15 },
                { name: 'Piyush Chawla', team: 'MI', matches: 16, wickets: 22, economy: 8.11, avg: 26.77, sr: 19.82 },
                { name: 'Tushar Deshpande', team: 'CSK', matches: 16, wickets: 21, economy: 9.92, avg: 31.19, sr: 18.86 },
                { name: 'Arshdeep Singh', team: 'PBKS', matches: 14, wickets: 19, economy: 9.03, avg: 28.42, sr: 18.89 }
            ]
        },
        'T20 World Cup-2022': {
            batsmen: [
                { name: 'Virat Kohli', team: 'IND', matches: 6, runs: 296, avg: 98.67, sr: 136.41, fifties: 4, hundreds: 0 },
                { name: 'Jos Buttler', team: 'ENG', matches: 6, runs: 225, avg: 45.00, sr: 144.23, fifties: 2, hundreds: 0 },
                { name: 'Rilee Rossouw', team: 'SA', matches: 5, runs: 141, avg: 47.00, sr: 171.95, fifties: 1, hundreds: 1 },
                { name: 'Glenn Phillips', team: 'NZ', matches: 5, runs: 201, avg: 40.20, sr: 158.27, fifties: 1, hundreds: 1 },
                { name: 'Suryakumar Yadav', team: 'IND', matches: 6, runs: 239, avg: 59.75, sr: 189.68, fifties: 3, hundreds: 0 }
            ],
            bowlers: [
                { name: 'Sam Curran', team: 'ENG', matches: 6, wickets: 13, economy: 6.52, avg: 11.38, sr: 10.46 },
                { name: 'Wanindu Hasaranga', team: 'SL', matches: 8, wickets: 15, economy: 6.41, avg: 13.26, sr: 12.40 },
                { name: 'Anrich Nortje', team: 'SA', matches: 5, wickets: 11, economy: 5.37, avg: 8.54, sr: 9.54 },
                { name: 'Shaheen Afridi', team: 'PAK', matches: 7, wickets: 11, economy: 6.15, avg: 14.09, sr: 13.72 },
                { name: 'Shadab Khan', team: 'PAK', matches: 7, wickets: 11, economy: 6.34, avg: 15.00, sr: 14.18 }
            ]
        },
        'ODI World Cup-2023': {
            batsmen: [
                { name: 'Virat Kohli', team: 'IND', matches: 11, runs: 765, avg: 95.62, sr: 90.31, fifties: 6, hundreds: 3 },
                { name: 'Rohit Sharma', team: 'IND', matches: 11, runs: 597, avg: 54.27, sr: 125.95, fifties: 3, hundreds: 1 },
                { name: 'Quinton de Kock', team: 'SA', matches: 10, runs: 594, avg: 59.40, sr: 107.03, fifties: 4, hundreds: 3 },
                { name: 'Rachin Ravindra', team: 'NZ', matches: 10, runs: 578, avg: 64.22, sr: 106.44, fifties: 3, hundreds: 3 },
                { name: 'David Warner', team: 'AUS', matches: 11, runs: 535, avg: 48.63, sr: 93.53, fifties: 2, hundreds: 2 }
            ],
            bowlers: [
                { name: 'Mohammed Shami', team: 'IND', matches: 7, wickets: 24, economy: 5.26, avg: 10.70, sr: 12.20 },
                { name: 'Adam Zampa', team: 'AUS', matches: 11, wickets: 23, economy: 5.36, avg: 19.47, sr: 21.78 },
                { name: 'Jasprit Bumrah', team: 'IND', matches: 11, wickets: 20, economy: 4.06, avg: 18.65, sr: 27.55 },
                { name: 'Marco Jansen', team: 'SA', matches: 10, wickets: 20, economy: 5.46, avg: 20.65, sr: 22.70 },
                { name: 'Mitchell Santner', team: 'NZ', matches: 10, wickets: 16, economy: 4.84, avg: 24.12, sr: 29.87 }
            ]
        },
        'Champions Trophy-2017': {
            batsmen: [
                { name: 'Shikhar Dhawan', team: 'IND', matches: 5, runs: 338, avg: 67.60, sr: 102.11, fifties: 1, hundreds: 1 },
                { name: 'Rohit Sharma', team: 'IND', matches: 5, runs: 304, avg: 76.00, sr: 88.89, fifties: 1, hundreds: 1 },
                { name: 'Tamim Iqbal', team: 'BAN', matches: 4, runs: 293, avg: 73.25, sr: 79.19, fifties: 2, hundreds: 1 },
                { name: 'Joe Root', team: 'ENG', matches: 4, runs: 258, avg: 129.00, sr: 93.48, fifties: 3, hundreds: 0 },
                { name: 'Kane Williamson', team: 'NZ', matches: 3, runs: 244, avg: 81.33, sr: 96.44, fifties: 1, hundreds: 1 }
            ],
            bowlers: [
                { name: 'Hasan Ali', team: 'PAK', matches: 5, wickets: 13, economy: 4.29, avg: 14.69, sr: 20.53 },
                { name: 'Junaid Khan', team: 'PAK', matches: 4, wickets: 8, economy: 4.58, avg: 19.37, sr: 25.37 },
                { name: 'Adil Rashid', team: 'ENG', matches: 4, wickets: 7, economy: 5.69, avg: 28.71, sr: 30.28 },
                { name: 'Liam Plunkett', team: 'ENG', matches: 4, wickets: 8, economy: 5.29, avg: 23.12, sr: 26.25 },
                { name: 'Josh Hazlewood', team: 'AUS', matches: 2, wickets: 9, economy: 5.01, avg: 9.77, sr: 11.66 }
            ]
        }
    };
    
    // Tournament outcomes data
    const tournamentOutcomes = {
        'IPL-2023': { winner: 'Chennai Super Kings', runnerUp: 'Gujarat Titans' },
        'T20 World Cup-2022': { winner: 'England', runnerUp: 'Pakistan' },
        'ODI World Cup-2023': { winner: 'Australia', runnerUp: 'India' },
        'Champions Trophy-2017': { winner: 'Pakistan', runnerUp: 'India' }
    };
    
    // Get current tournament data based on filters
    const currentTournamentKey = `${tournamentType}-${year}`;
    const currentPointsTable = pointsTableData[currentTournamentKey] || [];
    const currentTopPerformers = topPerformersData[currentTournamentKey] || { batsmen: [], bowlers: [] };
    const currentOutcome = tournamentOutcomes[currentTournamentKey] || { winner: 'N/A', runnerUp: 'N/A' };
    
    // Chart data for team performance
    const teamPerformanceData = currentPointsTable.map(team => ({
        name: team.team,
        wins: team.won,
        losses: team.lost,
        points: team.points
    }));
    
    // Chart data for top run scorers
    const topRunScorersData = currentTopPerformers.batsmen.map(batsman => ({
        name: batsman.name,
        runs: batsman.runs,
        avg: batsman.avg
    }));
    
    // Chart data for top wicket takers
    const topWicketTakersData = currentTopPerformers.bowlers.map(bowler => ({
        name: bowler.name,
        wickets: bowler.wickets,
        economy: bowler.economy
    }));
    
    // Colors for charts
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];
    
    return (
        <div className="p-6 bg-gray-900 min-h-screen text-white">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold mb-4 md:mb-0 flex items-center">
                        <FaTrophy className="mr-2 text-yellow-500" size={32} />
                        Tournament Overview
                    </h1>
                    
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <FaFilter className="text-gray-400" />
                            </div>
                            <select
                                className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                                value={tournamentType}
                                onChange={(e) => setTournamentType(e.target.value)}
                            >
                                {tournamentTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <FaCalendarAlt className="text-gray-400" />
                            </div>
                            <select
                                className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                                value={year}
                                onChange={(e) => setYear(parseInt(e.target.value))}
                            >
                                {years.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                
                {/* Tournament Info Card */}
                <div className="bg-gray-800 rounded-lg p-6 mb-8 border-l-4 border-blue-500 shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">{tournamentType} {year}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-2 text-gray-300">Winner</h3>
                            <div className="flex items-center">
                                <FaMedal className="text-yellow-500 mr-2" size={24} />
                                <span className="text-xl font-bold">{currentOutcome.winner}</span>
                            </div>
                        </div>
                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-2 text-gray-300">Runner-up</h3>
                            <div className="flex items-center">
                                <FaMedal className="text-gray-400 mr-2" size={24} />
                                <span className="text-xl font-bold">{currentOutcome.runnerUp}</span>
                            </div>
                        </div>
                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-2 text-gray-300">Teams</h3>
                            <div className="flex items-center">
                                <span className="text-xl font-bold">{currentPointsTable.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Tabs */}
                <div className="mb-6 border-b border-gray-700">
                    <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                        <li className="mr-2">
                            <button
                                className={`inline-flex items-center p-4 border-b-2 rounded-t-lg ${activeTab === 'points' ? 'text-blue-500 border-blue-500' : 'border-transparent hover:text-gray-300 hover:border-gray-300'}`}
                                onClick={() => setActiveTab('points')}
                            >
                                <FaTrophy className="mr-2" />
                                Points Table
                            </button>
                        </li>
                        <li className="mr-2">
                            <button
                                className={`inline-flex items-center p-4 border-b-2 rounded-t-lg ${activeTab === 'batsmen' ? 'text-blue-500 border-blue-500' : 'border-transparent hover:text-gray-300 hover:border-gray-300'}`}
                                onClick={() => setActiveTab('batsmen')}
                            >
                                <FaChartBar className="mr-2" />
                                Top Batsmen
                            </button>
                        </li>
                        <li className="mr-2">
                            <button
                                className={`inline-flex items-center p-4 border-b-2 rounded-t-lg ${activeTab === 'bowlers' ? 'text-blue-500 border-blue-500' : 'border-transparent hover:text-gray-300 hover:border-gray-300'}`}
                                onClick={() => setActiveTab('bowlers')}
                            >
                                <FaBaseballBall className="mr-2" />
                                Top Bowlers
                            </button>
                        </li>
                    </ul>
                </div>
                
                {/* Content based on active tab */}
                {activeTab === 'points' && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Points Table</h2>
                        <div className="overflow-x-auto mb-8">
                            <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Team</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-300">M</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-300">W</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-300">L</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-300">NR</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-300">Pts</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-300">NRR</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {currentPointsTable.map((team, index) => (
                                        <tr key={index} className={`${index < 4 ? 'bg-gray-800/80' : 'bg-gray-800/40'} hover:bg-gray-700/70 transition-colors`}>
                                            <td className="px-4 py-3 text-sm font-medium">{team.team}</td>
                                            <td className="px-4 py-3 text-sm text-center">{team.played}</td>
                                            <td className="px-4 py-3 text-sm text-center text-green-500 font-medium">{team.won}</td>
                                            <td className="px-4 py-3 text-sm text-center text-red-500 font-medium">{team.lost}</td>
                                            <td className="px-4 py-3 text-sm text-center">{team.nr}</td>
                                            <td className="px-4 py-3 text-sm text-center font-bold">{team.points}</td>
                                            <td className="px-4 py-3 text-sm text-center">{team.nrr.toFixed(3)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Team Performance Chart */}
                        <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-8">
                            <h3 className="text-lg font-semibold mb-4">Team Performance</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={teamPerformanceData}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis dataKey="name" stroke="#9CA3AF" />
                                        <YAxis stroke="#9CA3AF" />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', color: '#F9FAFB' }}
                                            itemStyle={{ color: '#F9FAFB' }}
                                        />
                                        <Legend />
                                        <Bar dataKey="wins" name="Wins" fill="#10B981" />
                                        <Bar dataKey="losses" name="Losses" fill="#EF4444" />
                                        <Bar dataKey="points" name="Points" fill="#3B82F6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}
                
                {activeTab === 'batsmen' && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Top Batsmen</h2>
                        <div className="overflow-x-auto mb-8">
                            <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Player</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Team</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-300">M</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-300">Runs</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-300">Avg</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-300">SR</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-300">50s</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-300">100s</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {currentTopPerformers.batsmen.map((batsman, index) => (
                                        <tr key={index} className={`${index === 0 ? 'bg-yellow-900/20' : ''} hover:bg-gray-700/70 transition-colors`}>
                                            <td className="px-4 py-3 text-sm font-medium">{batsman.name}</td>
                                            <td className="px-4 py-3 text-sm">{batsman.team}</td>
                                            <td className="px-4 py-3 text-sm text-center">{batsman.matches}</td>
                                            <td className="px-4 py-3 text-sm text-center font-bold">{batsman.runs}</td>
                                            <td className="px-4 py-3 text-sm text-center">{batsman.avg.toFixed(2)}</td>
                                            <td className="px-4 py-3 text-sm text-center">{batsman.sr.toFixed(2)}</td>
                                            <td className="px-4 py-3 text-sm text-center">{batsman.fifties}</td>
                                            <td className="px-4 py-3 text-sm text-center">{batsman.hundreds}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Top Run Scorers Chart */}
                        <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-8">
                            <h3 className="text-lg font-semibold mb-4">Top Run Scorers</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={topRunScorersData}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis dataKey="name" stroke="#9CA3AF" />
                                        <YAxis stroke="#9CA3AF" />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', color: '#F9FAFB' }}
                                            itemStyle={{ color: '#F9FAFB' }}
                                        />
                                        <Legend />
                                        <Bar dataKey="runs" name="Runs" fill="#3B82F6" />
                                        <Bar dataKey="avg" name="Average" fill="#10B981" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        
                        {/* Batting Stats Distribution */}
                        <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-8">
                            <h3 className="text-lg font-semibold mb-4">Batting Stats Distribution</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={currentTopPerformers.batsmen.map(batsman => ({
                                                name: batsman.name,
                                                value: batsman.runs
                                            }))}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={true}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {currentTopPerformers.batsmen.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', color: '#F9FAFB' }}
                                            formatter={(value) => [`${value} runs`, 'Runs']}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}
                
                {activeTab === 'bowlers' && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Top Bowlers</h2>
                        <div className="overflow-x-auto mb-8">
                            <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Player</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Team</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-300">M</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-300">W</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-300">Econ</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-300">Avg</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-300">SR</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {currentTopPerformers.bowlers.map((bowler, index) => (
                                        <tr key={index} className={`${index === 0 ? 'bg-yellow-900/20' : ''} hover:bg-gray-700/70 transition-colors`}>
                                            <td className="px-4 py-3 text-sm font-medium">{bowler.name}</td>
                                            <td className="px-4 py-3 text-sm">{bowler.team}</td>
                                            <td className="px-4 py-3 text-sm text-center">{bowler.matches}</td>
                                            <td className="px-4 py-3 text-sm text-center font-bold">{bowler.wickets}</td>
                                            <td className="px-4 py-3 text-sm text-center">{bowler.economy.toFixed(2)}</td>
                                            <td className="px-4 py-3 text-sm text-center">{bowler.avg.toFixed(2)}</td>
                                            <td className="px-4 py-3 text-sm text-center">{bowler.sr.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Top Wicket Takers Chart */}
                        <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-8">
                            <h3 className="text-lg font-semibold mb-4">Top Wicket Takers</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={topWicketTakersData}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis dataKey="name" stroke="#9CA3AF" />
                                        <YAxis stroke="#9CA3AF" />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', color: '#F9FAFB' }}
                                            itemStyle={{ color: '#F9FAFB' }}
                                        />
                                        <Legend />
                                        <Bar dataKey="wickets" name="Wickets" fill="#EF4444" />
                                        <Bar dataKey="economy" name="Economy" fill="#F59E0B" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        
                        {/* Bowling Stats Distribution */}
                        <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-8">
                            <h3 className="text-lg font-semibold mb-4">Bowling Stats Distribution</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={currentTopPerformers.bowlers.map(bowler => ({
                                                name: bowler.name,
                                                value: bowler.wickets
                                            }))}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={true}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {currentTopPerformers.bowlers.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', color: '#F9FAFB' }}
                                            formatter={(value) => [`${value} wickets`, 'Wickets']}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Tournament Progression */}
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-8">
                    <h3 className="text-lg font-semibold mb-4">Tournament Progression</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={[
                                    { name: 'Group Stage', winner: 80, runnerUp: 70, third: 60 },
                                    { name: 'Super 8', winner: 85, runnerUp: 80, third: 70 },
                                    { name: 'Semi Finals', winner: 90, runnerUp: 85, third: 0 },
                                    { name: 'Final', winner: 100, runnerUp: 90, third: 0 }
                                ]}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorWinner" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorRunnerUp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorThird" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', color: '#F9FAFB' }}
                                    itemStyle={{ color: '#F9FAFB' }}
                                />
                                <Area type="monotone" dataKey="winner" name={currentOutcome.winner} stroke="#3B82F6" fillOpacity={1} fill="url(#colorWinner)" />
                                <Area type="monotone" dataKey="runnerUp" name={currentOutcome.runnerUp} stroke="#10B981" fillOpacity={1} fill="url(#colorRunnerUp)" />
                                <Area type="monotone" dataKey="third" name="3rd Place" stroke="#F59E0B" fillOpacity={1} fill="url(#colorThird)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                {/* Tournament Summary */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
                    <h3 className="text-xl font-semibold mb-4">Tournament Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h4 className="text-lg font-medium mb-2 text-gray-300">Most Runs</h4>
                            <div className="flex items-center">
                                <FaChartBar className="text-blue-500 mr-2" size={24} />
                                <div>
                                    <p className="text-xl font-bold">{currentTopPerformers.batsmen[0]?.name || 'N/A'}</p>
                                    <p className="text-sm text-gray-400">{currentTopPerformers.batsmen[0]?.runs || 0} runs</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h4 className="text-lg font-medium mb-2 text-gray-300">Best Batting Avg</h4>
                            <div className="flex items-center">
                                <FaChartBar className="text-green-500 mr-2" size={24} />
                                <div>
                                    <p className="text-xl font-bold">
                                        {currentTopPerformers.batsmen.sort((a, b) => b.avg - a.avg)[0]?.name || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        {currentTopPerformers.batsmen.sort((a, b) => b.avg - a.avg)[0]?.avg.toFixed(2) || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Data Source Note */}
                <div className="text-center text-gray-500 text-sm mt-8">
                    <p>Data shown is for demonstration purposes. In a production environment, this would be fetched from the database.</p>
                </div>
            </div>
        </div>
    );
}

export default Tournament_overview;
