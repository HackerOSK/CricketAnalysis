import React, { useState, useEffect } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { motion } from 'framer-motion';
import { RefreshCw, BarChart2, PieChartIcon, Trophy } from 'lucide-react';

function TeamComparison() {
    // State for selected teams and comparison type
    const [team1, setTeam1] = useState('Mumbai Indians');
    const [team2, setTeam2] = useState('Chennai Super Kings');
    const [yearRange, setYearRange] = useState([2018, 2023]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('performance');

    // Teams data
    const teams = [
        { id: 'MI', name: 'Mumbai Indians', color: '#004BA0' },
        { id: 'CSK', name: 'Chennai Super Kings', color: '#F9CD05' },
        { id: 'RCB', name: 'Royal Challengers Bangalore', color: '#EC1C24' },
        { id: 'KKR', name: 'Kolkata Knight Riders', color: '#3A225D' },
        { id: 'DC', name: 'Delhi Capitals', color: '#00008B' },
        { id: 'PBKS', name: 'Punjab Kings', color: '#ED1B24' },
        { id: 'RR', name: 'Rajasthan Royals', color: '#FF1493' },
        { id: 'SRH', name: 'Sunrisers Hyderabad', color: '#FF822A' },
        { id: 'GT', name: 'Gujarat Titans', color: '#1C1C1C' },
        { id: 'LSG', name: 'Lucknow Super Giants', color: '#A72056' },
    ];

    // Get team colors
    const getTeamColor = (teamName) => {
        const team = teams.find(t => t.name === teamName);
        return team ? team.color : '#666666';
    };

    // Dummy data for team comparison
    const teamStats = {
        'Mumbai Indians': {
            totalMatches: 237,
            wins: 129,
            losses: 108,
            winPercentage: 54.4,
            titles: 5,
            avgRunRate: 8.83,
            avgScore: 167,
            highestScore: 235,
            lowestScore: 87,
            avgWicketsTaken: 6.2,
            avgEconRate: 8.42,
            playerStats: [
                { name: 'Rohit Sharma', matches: 213, runs: 5879, avg: 30.3, sr: 130.6 },
                { name: 'Jasprit Bumrah', matches: 120, runs: 56, avg: 5.6, sr: 84.8 },
                { name: 'Kieron Pollard', matches: 189, runs: 3412, avg: 28.7, sr: 147.3 },
            ],
            yearlyPerformance: [
                { year: 2018, wins: 11, losses: 7, position: 1 },
                { year: 2019, wins: 10, losses: 6, position: 1 },
                { year: 2020, wins: 9, losses: 7, position: 1 },
                { year: 2021, wins: 7, losses: 8, position: 5 },
                { year: 2022, wins: 4, losses: 10, position: 10 },
                { year: 2023, wins: 8, losses: 6, position: 4 },
            ],
            phasePerformance: {
                powerplay: { runRate: 8.6, wickets: 1.2, avgScore: 51 },
                middle: { runRate: 8.2, wickets: 2.8, avgScore: 74 },
                death: { runRate: 10.4, wickets: 2.2, avgScore: 42 }
            },
            venuePerformance: [
                { venue: 'Wankhede Stadium', matches: 78, wins: 48, winPercentage: 61.5 },
                { venue: 'Eden Gardens', matches: 21, wins: 12, winPercentage: 57.1 },
                { venue: 'M. Chinnaswamy Stadium', matches: 19, wins: 9, winPercentage: 47.4 },
                { venue: 'MA Chidambaram Stadium', matches: 18, wins: 6, winPercentage: 33.3 },
            ]
        },
        'Chennai Super Kings': {
            totalMatches: 218,
            wins: 126,
            losses: 92,
            winPercentage: 57.8,
            titles: 5,
            avgRunRate: 8.62,
            avgScore: 163,
            highestScore: 246,
            lowestScore: 79,
            avgWicketsTaken: 6.5,
            avgEconRate: 8.31,
            playerStats: [
                { name: 'MS Dhoni', matches: 234, runs: 5082, avg: 39.1, sr: 135.9 },
                { name: 'Ravindra Jadeja', matches: 174, runs: 2721, avg: 26.7, sr: 137.2 },
                { name: 'Suresh Raina', matches: 200, runs: 5528, avg: 32.5, sr: 136.8 },
            ],
            yearlyPerformance: [
                { year: 2018, wins: 9, losses: 7, position: 2 },
                { year: 2019, wins: 10, losses: 6, position: 2 },
                { year: 2020, wins: 6, losses: 8, position: 7 },
                { year: 2021, wins: 9, losses: 6, position: 2 },
                { year: 2022, wins: 4, losses: 10, position: 9 },
                { year: 2023, wins: 8, losses: 6, position: 1 },
            ],
            phasePerformance: {
                powerplay: { runRate: 8.3, wickets: 1.4, avgScore: 49 },
                middle: { runRate: 8.1, wickets: 2.6, avgScore: 73 },
                death: { runRate: 10.2, wickets: 2.5, avgScore: 41 }
            },
            venuePerformance: [
                { venue: 'MA Chidambaram Stadium', matches: 58, wins: 40, winPercentage: 69.0 },
                { venue: 'Wankhede Stadium', matches: 20, wins: 10, winPercentage: 50.0 },
                { venue: 'Eden Gardens', matches: 18, wins: 11, winPercentage: 61.1 },
                { venue: 'M. Chinnaswamy Stadium', matches: 16, wins: 7, winPercentage: 43.8 },
            ]
        },
        'Royal Challengers Bangalore': {
            totalMatches: 235,
            wins: 112,
            losses: 123,
            winPercentage: 47.7,
            titles: 0,
            avgRunRate: 8.75,
            avgScore: 165,
            highestScore: 263,
            lowestScore: 68,
            avgWicketsTaken: 5.9,
            avgEconRate: 8.67,
            playerStats: [
                { name: 'Virat Kohli', matches: 237, runs: 7263, avg: 37.2, sr: 130.0 },
                { name: 'AB de Villiers', matches: 156, runs: 4522, avg: 41.1, sr: 158.3 },
                { name: 'Yuzvendra Chahal', matches: 113, runs: 21, avg: 3.5, sr: 70.0 },
            ],
            yearlyPerformance: [
                { year: 2018, wins: 6, losses: 8, position: 6 },
                { year: 2019, wins: 5, losses: 9, position: 8 },
                { year: 2020, wins: 7, losses: 7, position: 4 },
                { year: 2021, wins: 9, losses: 5, position: 3 },
                { year: 2022, wins: 8, losses: 6, position: 4 },
                { year: 2023, wins: 7, losses: 7, position: 6 },
            ],
            phasePerformance: {
                powerplay: { runRate: 8.7, wickets: 1.3, avgScore: 52 },
                middle: { runRate: 8.4, wickets: 2.5, avgScore: 76 },
                death: { runRate: 10.6, wickets: 2.1, avgScore: 43 }
            },
            venuePerformance: [
                { venue: 'M. Chinnaswamy Stadium', matches: 74, wins: 42, winPercentage: 56.8 },
                { venue: 'Wankhede Stadium', matches: 19, wins: 8, winPercentage: 42.1 },
                { venue: 'Eden Gardens', matches: 17, wins: 7, winPercentage: 41.2 },
                { venue: 'MA Chidambaram Stadium', matches: 16, wins: 5, winPercentage: 31.3 },
            ]
        },
    };

    // Head to head data
    const headToHeadData = {
        'Mumbai Indians-Chennai Super Kings': {
            totalMatches: 36,
            team1Wins: 20,
            team2Wins: 16,
            highestTeam1Score: 219,
            highestTeam2Score: 218,
            recentResults: [
                { date: '2023-05-06', winner: 'Chennai Super Kings', margin: '6 wickets' },
                { date: '2023-04-08', winner: 'Mumbai Indians', margin: '7 wickets' },
                { date: '2022-05-12', winner: 'Mumbai Indians', margin: '5 wickets' },
                { date: '2022-04-21', winner: 'Chennai Super Kings', margin: '3 wickets' },
                { date: '2021-09-19', winner: 'Chennai Super Kings', margin: '20 runs' },
            ],
            keyBattles: [
                { player1: 'Rohit Sharma', player2: 'Deepak Chahar', advantage: 'Rohit Sharma' },
                { player1: 'Jasprit Bumrah', player2: 'MS Dhoni', advantage: 'Jasprit Bumrah' },
                { player1: 'Suryakumar Yadav', player2: 'Ravindra Jadeja', advantage: 'Even' },
            ]
        },
        'Mumbai Indians-Royal Challengers Bangalore': {
            totalMatches: 32,
            team1Wins: 19,
            team2Wins: 13,
            highestTeam1Score: 213,
            highestTeam2Score: 235,
            recentResults: [
                { date: '2023-05-09', winner: 'Mumbai Indians', margin: '6 wickets' },
                { date: '2023-04-02', winner: 'Royal Challengers Bangalore', margin: '8 wickets' },
                { date: '2022-04-09', winner: 'Royal Challengers Bangalore', margin: '7 wickets' },
                { date: '2021-09-26', winner: 'Royal Challengers Bangalore', margin: '54 runs' },
                { date: '2021-04-09', winner: 'Mumbai Indians', margin: '2 wickets' },
            ],
            keyBattles: [
                { player1: 'Rohit Sharma', player2: 'Mohammed Siraj', advantage: 'Rohit Sharma' },
                { player1: 'Jasprit Bumrah', player2: 'Virat Kohli', advantage: 'Jasprit Bumrah' },
                { player1: 'Kieron Pollard', player2: 'Yuzvendra Chahal', advantage: 'Even' },
            ]
        },
        'Chennai Super Kings-Royal Challengers Bangalore': {
            totalMatches: 30,
            team1Wins: 20,
            team2Wins: 10,
            highestTeam1Score: 205,
            highestTeam2Score: 218,
            recentResults: [
                { date: '2023-04-17', winner: 'Chennai Super Kings', margin: '8 runs' },
                { date: '2022-05-04', winner: 'Royal Challengers Bangalore', margin: '13 runs' },
                { date: '2021-09-24', winner: 'Chennai Super Kings', margin: '6 wickets' },
                { date: '2021-04-25', winner: 'Chennai Super Kings', margin: '69 runs' },
                { date: '2020-10-25', winner: 'Chennai Super Kings', margin: '8 wickets' },
            ],
            keyBattles: [
                { player1: 'MS Dhoni', player2: 'Yuzvendra Chahal', advantage: 'MS Dhoni' },
                { player1: 'Ravindra Jadeja', player2: 'Glenn Maxwell', advantage: 'Even' },
                { player1: 'Deepak Chahar', player2: 'Virat Kohli', advantage: 'Virat Kohli' },
            ]
        }
    };

    // Simulate loading data when teams change
    useEffect(() => {
        if (team1 && team2) {
            setIsLoading(true);
            // Simulate API call
            setTimeout(() => {
                setIsLoading(false);
            }, 800);
        }
    }, [team1, team2, yearRange]);

    // Get head to head data for selected teams
    const getHeadToHeadData = () => {
        const key1 = `${team1}-${team2}`;
        const key2 = `${team2}-${team1}`;
        
        if (headToHeadData[key1]) {
            return headToHeadData[key1];
        } else if (headToHeadData[key2]) {
            // Swap team1 and team2 data
            const data = headToHeadData[key2];
            return {
                ...data,
                team1Wins: data.team2Wins,
                team2Wins: data.team1Wins,
                highestTeam1Score: data.highestTeam2Score,
                highestTeam2Score: data.highestTeam1Score,
                keyBattles: data.keyBattles.map(battle => ({
                    player1: battle.player2,
                    player2: battle.player1,
                    advantage: battle.advantage === battle.player1 ? battle.player2 : 
                               battle.advantage === battle.player2 ? battle.player1 : 'Even'
                }))
            };
        }
        
        // Return default data if no match found
        return {
            totalMatches: 0,
            team1Wins: 0,
            team2Wins: 0,
            highestTeam1Score: 0,
            highestTeam2Score: 0,
            recentResults: [],
            keyBattles: []
        };
    };

    // Prepare data for charts
    const prepareOverallComparisonData = () => {
        const team1Data = teamStats[team1] || {};
        const team2Data = teamStats[team2] || {};
        
        return [
            { name: 'Win %', [team1]: team1Data.winPercentage || 0, [team2]: team2Data.winPercentage || 0 },
            { name: 'Avg Score', [team1]: team1Data.avgScore || 0, [team2]: team2Data.avgScore || 0 },
            { name: 'Titles', [team1]: team1Data.titles || 0, [team2]: team2Data.titles || 0 },
            { name: 'Avg Run Rate', [team1]: team1Data.avgRunRate || 0, [team2]: team2Data.avgRunRate || 0 },
        ];
    };

    // Prepare data for head to head chart
    const prepareHeadToHeadData = () => {
        const headToHead = getHeadToHeadData();
        return [
            { name: team1, value: headToHead.team1Wins, color: getTeamColor(team1) },
            { name: team2, value: headToHead.team2Wins, color: getTeamColor(team2) },
        ];
    };

    // Prepare data for yearly performance chart
    const prepareYearlyPerformanceData = () => {
        const team1Data = teamStats[team1]?.yearlyPerformance || [];
        const team2Data = teamStats[team2]?.yearlyPerformance || [];
        
        return team1Data
            .filter(p => p.year >= yearRange[0] && p.year <= yearRange[1])
            .map(p => {
                const team2Record = team2Data.find(t => t.year === p.year);
                return {
                    year: p.year,
                    [team1]: p.wins,
                    [team2]: team2Record?.wins || 0
                };
            });
    };

    // Prepare phase performance data
    const preparePhasePerformanceData = () => {
        const team1Data = teamStats[team1]?.phasePerformance || {};
        const team2Data = teamStats[team2]?.phasePerformance || {};
        
        if (!team1Data || !team2Data) return [];
        
        return [
            { 
                subject: 'Powerplay', 
                [team1]: team1Data.powerplay?.runRate || 0, 
                [team2]: team2Data.powerplay?.runRate || 0,
                fullMark: 12 
            },
            { 
                subject: 'Middle Overs', 
                [team1]: team1Data.middle?.runRate || 0, 
                [team2]: team2Data.middle?.runRate || 0, 
                fullMark: 12 
            },
            { 
                subject: 'Death Overs', 
                [team1]: team1Data.death?.runRate || 0, 
                [team2]: team2Data.death?.runRate || 0, 
                fullMark: 12 
            },
        ];
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    
    // Tab content for head to head
    const renderHeadToHeadContent = () => {
        const headToHead = getHeadToHeadData();
        
        return (
            <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Head to Head Record</h3>
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-center">
                                <div className="font-bold text-xl" style={{ color: getTeamColor(team1) }}>{headToHead.team1Wins}</div>
                                <div className="text-sm text-gray-600">{team1}</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-xl text-gray-800">{headToHead.totalMatches}</div>
                                <div className="text-sm text-gray-600">Total Matches</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-xl" style={{ color: getTeamColor(team2) }}>{headToHead.team2Wins}</div>
                                <div className="text-sm text-gray-600">{team2}</div>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={prepareHeadToHeadData()}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {prepareHeadToHeadData().map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Recent Encounters</h3>
                        <div className="overflow-hidden">
                            {headToHead.recentResults.slice(0, 5).map((result, index) => (
                                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <div className="text-sm">{result.date}</div>
                                    <div className="font-medium" style={{ color: result.winner === team1 ? getTeamColor(team1) : getTeamColor(team2) }}>
                                        {result.winner}
                                    </div>
                                    <div className="text-sm text-gray-600">{result.margin}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Key Player Battles</h3>
                        <div className="overflow-hidden">
                            {headToHead.keyBattles.map((battle, index) => (
                                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <div className="font-medium text-sm" style={{ color: getTeamColor(team1) }}>{battle.player1}</div>
                                    <div className="text-xs bg-gray-100 px-2 py-1 rounded">{battle.advantage}</div>
                                    <div className="font-medium text-sm" style={{ color: getTeamColor(team2) }}>{battle.player2}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Highest Scores</h3>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="text-center p-4 bg-gray-50 rounded">
                                <div className="text-sm text-gray-600">{team1}</div>
                                <div className="font-bold text-2xl" style={{ color: getTeamColor(team1) }}>{headToHead.highestTeam1Score}</div>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded">
                                <div className="text-sm text-gray-600">{team2}</div>
                                <div className="font-bold text-2xl" style={{ color: getTeamColor(team2) }}>{headToHead.highestTeam2Score}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    
    // Tab content for performance
    const renderPerformanceContent = () => {
        return (
            <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Overall Stats</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={prepareOverallComparisonData()}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey={team1} fill={getTeamColor(team1)} />
                                <Bar dataKey={team2} fill={getTeamColor(team2)} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Phase-wise Run Rate</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <RadarChart outerRadius={90} data={preparePhasePerformanceData()}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" />
                                <PolarRadiusAxis angle={30} domain={[0, 12]} />
                                <Radar name={team1} dataKey={team1} stroke={getTeamColor(team1)} fill={getTeamColor(team1)} fillOpacity={0.6} />
                                <Radar name={team2} dataKey={team2} stroke={getTeamColor(team2)} fill={getTeamColor(team2)} fillOpacity={0.6} />
                                <Legend />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-4 md:col-span-2">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Yearly Performance</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={prepareYearlyPerformanceData()}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey={team1} fill={getTeamColor(team1)} />
                                <Bar dataKey={team2} fill={getTeamColor(team2)} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        );
    };

    // Prepare venue performance data
    const prepareVenuePerformanceData = () => {
        const team1Data = teamStats[team1]?.venuePerformance || [];
        const team2Data = teamStats[team2]?.venuePerformance || [];
        
        // Find common venues
        const commonVenues = team1Data
            .filter(v1 => team2Data.some(v2 => v2.venue === v1.venue))
            .map(v => v.venue);
        
        return commonVenues.map(venue => {
            const team1Venue = team1Data.find(v => v.venue === venue) || {};
            const team2Venue = team2Data.find(v => v.venue === venue) || {};
            
            return {
                venue,
                [`${team1} Win %`]: team1Venue.winPercentage || 0,
                [`${team2} Win %`]: team2Venue.winPercentage || 0,
            };
        });
    };

    // Tab content for venue performance
    const renderVenuePerformanceContent = () => {
        return (
            <div className="p-4">
                <div className="grid grid-cols-1 gap-8">
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Venue Performance Comparison</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={prepareVenuePerformanceData()}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="venue" />
                                <YAxis label={{ value: 'Win Percentage (%)', angle: -90, position: 'insideLeft' }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey={`${team1} Win %`} fill={getTeamColor(team1)} />
                                <Bar dataKey={`${team2} Win %`} fill={getTeamColor(team2)} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Home Ground Advantage</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[team1, team2].map(team => {
                                const homeGround = teamStats[team]?.venuePerformance?.[0];
                                return (
                                    <div key={team} className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center mb-2">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 mr-3" style={{ backgroundColor: getTeamColor(team) }}></div>
                                            <h4 className="font-semibold">{team}</h4>
                                        </div>
                                        {homeGround ? (
                                            <div>
                                                <p className="text-sm text-gray-600">Home Ground: <span className="font-medium">{homeGround.venue}</span></p>
                                                <p className="text-sm text-gray-600">Matches: <span className="font-medium">{homeGround.matches}</span></p>
                                                <p className="text-sm text-gray-600">Wins: <span className="font-medium">{homeGround.wins}</span></p>
                                                <p className="text-sm text-gray-600">Win %: <span className="font-medium">{homeGround.winPercentage}%</span></p>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">No home ground data available</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gray-900 text-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto p-4 sm:p-6">
                <h1 className="text-2xl font-bold text-white mb-6">IPL Team Comparison</h1>
                
                {/* Team Selection Panel */}
                <div className="bg-gray-800 rounded-lg shadow-lg mb-6 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Team 1</label>
                            <select 
                                value={team1} 
                                onChange={e => setTeam1(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {teams.map(team => (
                                    <option key={team.id} value={team.name}>{team.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Team 2</label>
                            <select 
                                value={team2} 
                                onChange={e => setTeam2(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {teams.map(team => (
                                    <option key={team.id} value={team.name}>{team.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Year Range</label>
                            <select 
                                value={`${yearRange[0]}-${yearRange[1]}`} 
                                onChange={e => {
                                    const [start, end] = e.target.value.split('-').map(Number);
                                    setYearRange([start, end]);
                                }}
                                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="2018-2023">2018-2023</option>
                                <option value="2020-2023">2020-2023</option>
                                <option value="2022-2023">2022-2023</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button 
                                className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                                onClick={() => {
                                    setIsLoading(true);
                                    setTimeout(() => setIsLoading(false), 800);
                                }}
                            >
                                <RefreshCw size={18} className="mr-2" />
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Loading Indicator */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="bg-gray-800 rounded-lg shadow-lg">
                        {/* Tabs */}
                        <div className="border-b border-gray-700">
                            <nav className="flex -mb-px">
                                {['head-to-head', 'performance', 'venue'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                                            activeTab === tab
                                                ? 'border-blue-500 text-blue-500'
                                                : 'border-transparent text-gray-400 hover:text-gray-300'
                                        }`}
                                    >
                                        {tab === 'head-to-head' && 'Head to Head'}
                                        {tab === 'performance' && 'Performance'}
                                        {tab === 'venue' && 'Venue Analysis'}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {activeTab === 'head-to-head' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-16 h-16 rounded-full" style={{ backgroundColor: getTeamColor(team1) }}></div>
                                            <div className="text-center">
                                                <h3 className="text-xl font-bold">{team1}</h3>
                                            </div>
                                        </div>
                                        
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-gray-300">VS</div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-4">
                                            <div className="text-center">
                                                <h3 className="text-xl font-bold">{team2}</h3>
                                            </div>
                                            <div className="w-16 h-16 rounded-full" style={{ backgroundColor: getTeamColor(team2) }}></div>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-gray-700 rounded-lg p-4">
                                            <h3 className="text-lg font-semibold mb-4 text-center">Head to Head</h3>
                                            <div className="flex justify-between items-center">
                                                <div className="text-center">
                                                    <div className="text-3xl font-bold">{headToHeadData[`${team1}-${team2}`]?.team1Wins || 0}</div>
                                                    <div className="text-sm text-gray-400">Wins</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-3xl font-bold">{headToHeadData[`${team1}-${team2}`]?.totalMatches || 0}</div>
                                                    <div className="text-sm text-gray-400">Matches</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-3xl font-bold">{headToHeadData[`${team1}-${team2}`]?.team2Wins || 0}</div>
                                                    <div className="text-sm text-gray-400">Wins</div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-gray-700 rounded-lg p-4">
                                            <h3 className="text-lg font-semibold mb-4 text-center">Recent Form</h3>
                                            <div className="space-y-2">
                                                {(headToHeadData[`${team1}-${team2}`]?.recentResults || []).slice(0, 3).map((result, index) => (
                                                    <div key={index} className="flex justify-between items-center p-2 bg-gray-800 rounded">
                                                        <div className="text-sm">{result.date}</div>
                                                        <div className="text-sm font-medium">{result.winner}</div>
                                                        <div className="text-xs text-gray-400">{result.margin}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div className="bg-gray-700 rounded-lg p-4">
                                            <h3 className="text-lg font-semibold mb-4 text-center">Key Stats</h3>
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Highest Score</span>
                                                    <span className="font-medium">{headToHeadData[`${team1}-${team2}`]?.highestTeam1Score || 0} / {headToHeadData[`${team1}-${team2}`]?.highestTeam2Score || 0}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Win %</span>
                                                    <span className="font-medium">
                                                        {Math.round((headToHeadData[`${team1}-${team2}`]?.team1Wins / headToHeadData[`${team1}-${team2}`]?.totalMatches) * 100 || 0)}% / 
                                                        {Math.round((headToHeadData[`${team1}-${team2}`]?.team2Wins / headToHeadData[`${team1}-${team2}`]?.totalMatches) * 100 || 0)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {activeTab === 'performance' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-700 rounded-lg p-4">
                                            <h3 className="text-lg font-semibold mb-2 text-center">Overall Stats</h3>
                                            <ResponsiveContainer width="100%" height={300}>
                                                <BarChart data={[
                                                    { name: 'Win %', [team1]: teamStats[team1]?.winPercentage || 0, [team2]: teamStats[team2]?.winPercentage || 0 },
                                                    { name: 'Avg Score', [team1]: teamStats[team1]?.avgScore || 0, [team2]: teamStats[team2]?.avgScore || 0 },
                                                    { name: 'Run Rate', [team1]: teamStats[team1]?.avgRunRate || 0, [team2]: teamStats[team2]?.avgRunRate || 0 },
                                                ]}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                                    <XAxis dataKey="name" tick={{ fill: '#ccc' }} />
                                                    <YAxis tick={{ fill: '#ccc' }} />
                                                    <Tooltip contentStyle={{ backgroundColor: '#333', borderColor: '#555' }} />
                                                    <Legend />
                                                    <Bar dataKey={team1} fill={getTeamColor(team1)} />
                                                    <Bar dataKey={team2} fill={getTeamColor(team2)} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                        
                                        <div className="bg-gray-700 rounded-lg p-4">
                                            <h3 className="text-lg font-semibold mb-2 text-center">Team Strengths</h3>
                                            <ResponsiveContainer width="100%" height={300}>
                                                <RadarChart data={[
                                                    { attribute: 'Batting', [team1]: 8, [team2]: 9 },
                                                    { attribute: 'Bowling', [team1]: 9, [team2]: 7 },
                                                    { attribute: 'Fielding', [team1]: 7, [team2]: 8 },
                                                    { attribute: 'Consistency', [team1]: 8, [team2]: 9 },
                                                    { attribute: 'Experience', [team1]: 9, [team2]: 10 },
                                                ]}>
                                                    <PolarGrid stroke="#444" />
                                                    <PolarAngleAxis dataKey="attribute" tick={{ fill: '#ccc' }} />
                                                    <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: '#ccc' }} />
                                                    <Radar name={team1} dataKey={team1} stroke={getTeamColor(team1)} fill={getTeamColor(team1)} fillOpacity={0.6} />
                                                    <Radar name={team2} dataKey={team2} stroke={getTeamColor(team2)} fill={getTeamColor(team2)} fillOpacity={0.6} />
                                                    <Legend />
                                                    <Tooltip contentStyle={{ backgroundColor: '#333', borderColor: '#555' }} />
                                                </RadarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gray-700 rounded-lg p-4">
                                        <h3 className="text-lg font-semibold mb-2 text-center">Yearly Performance</h3>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart data={[
                                                ...Array.from({ length: yearRange[1] - yearRange[0] + 1 }, (_, i) => {
                                                    const year = yearRange[0] + i;
                                                    const team1Data = teamStats[team1]?.yearlyPerformance.find(y => y.year === year) || {};
                                                    const team2Data = teamStats[team2]?.yearlyPerformance.find(y => y.year === year) || {};
                                                    return {
                                                        year,
                                                        [`${team1} Wins`]: team1Data.wins || 0,
                                                        [`${team2} Wins`]: team2Data.wins || 0,
                                                    };
                                                })
                                            ]}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                                <XAxis dataKey="year" tick={{ fill: '#ccc' }} />
                                                <YAxis tick={{ fill: '#ccc' }} />
                                                <Tooltip contentStyle={{ backgroundColor: '#333', borderColor: '#555' }} />
                                                <Legend />
                                                <Line type="monotone" dataKey={`${team1} Wins`} stroke={getTeamColor(team1)} activeDot={{ r: 8 }} />
                                                <Line type="monotone" dataKey={`${team2} Wins`} stroke={getTeamColor(team2)} activeDot={{ r: 8 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}
                            
                            {activeTab === 'venue' && (
                                <div className="space-y-6">
                                    <div className="bg-gray-700 rounded-lg p-4">
                                        <h3 className="text-lg font-semibold mb-2 text-center">Venue Performance Comparison</h3>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={prepareVenuePerformanceData()}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                                <XAxis dataKey="venue" tick={{ fill: '#ccc' }} />
                                                <YAxis label={{ value: 'Win Percentage (%)', angle: -90, position: 'insideLeft', fill: '#ccc' }} tick={{ fill: '#ccc' }} />
                                                <Tooltip contentStyle={{ backgroundColor: '#333', borderColor: '#555' }} />
                                                <Legend />
                                                <Bar dataKey={`${team1} Win %`} fill={getTeamColor(team1)} />
                                                <Bar dataKey={`${team2} Win %`} fill={getTeamColor(team2)} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[team1, team2].map(team => {
                                            const homeGround = teamStats[team]?.venuePerformance?.[0];
                                            return (
                                                <div key={team} className="bg-gray-700 rounded-lg p-4">
                                                    <div className="flex items-center mb-4">
                                                        <div className="w-10 h-10 rounded-full mr-3" style={{ backgroundColor: getTeamColor(team) }}></div>
                                                        <h4 className="text-lg font-semibold">{team}</h4>
                                                    </div>
                                                    {homeGround ? (
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-400">Home Ground</span>
                                                                <span className="font-medium">{homeGround.venue}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-400">Matches</span>
                                                                <span className="font-medium">{homeGround.matches}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-400">Wins</span>
                                                                <span className="font-medium">{homeGround.wins}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-400">Win %</span>
                                                                <span className="font-medium">{homeGround.winPercentage}%</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-400">No home ground data available</p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}




export default TeamComparison;
