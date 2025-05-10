import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart, Scatter
} from 'recharts';
import { 
  FaFilter, FaCalendarAlt, FaChartBar, FaChartLine, FaChartPie, 
  FaChartArea, FaSpinner, FaExchangeAlt, FaSearch, FaBaseballBall
} from 'react-icons/fa';

function Match_analysis() {
    // State for filters
    const [tournamentType, setTournamentType] = useState('league');
    const [year, setYear] = useState(2023);
    const [team1, setTeam1] = useState('');
    const [team2, setTeam2] = useState('');
    const [loading, setLoading] = useState(false);
    const [seriesData, setSeriesData] = useState([]);
    const [selectedSeries, setSelectedSeries] = useState(null);
    const [matchesData, setMatchesData] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [matchAnalysis, setMatchAnalysis] = useState({
        matchInfo: { date: '', venue: '', result: '', toss: '' },
        scores: {
            team1: { name: '', code: '', score: 0, wickets: 0, overs: '0.0' },
            team2: { name: '', code: '', score: 0, wickets: 0, overs: '0.0' }
        },
        battingData: { team1: [], team2: [] },
        bowlingData: { team1: [], team2: [] },
        partnerships: { team1: [], team2: [] },
        overByOver: { team1: [], team2: [] },
        matchPhases: { team1: [], team2: [] },
        playerPerformance: { team1: [], team2: [] },
        wagonWheel: { team1: [], team2: [] }
    });
    const [error, setError] = useState(null);
    
    // Available years for selection
    const years = Array.from({ length: 16 }, (_, i) => 2025 - i);
    
    // Teams data (would be fetched from API in production)
    const teams = [
        { id: 1, name: 'Mumbai Indians', code: 'MI' },
        { id: 2, name: 'Chennai Super Kings', code: 'CSK' },
        { id: 3, name: 'Royal Challengers Bangalore', code: 'RCB' },
        { id: 4, name: 'Kolkata Knight Riders', code: 'KKR' },
        { id: 5, name: 'Delhi Capitals', code: 'DC' },
        { id: 6, name: 'Punjab Kings', code: 'PBKS' },
        { id: 7, name: 'Rajasthan Royals', code: 'RR' },
        { id: 8, name: 'Sunrisers Hyderabad', code: 'SRH' },
        { id: 9, name: 'Gujarat Titans', code: 'GT' },
        { id: 10, name: 'Lucknow Super Giants', code: 'LSG' },
        // International teams
        { id: 11, name: 'India', code: 'IND' },
        { id: 12, name: 'Australia', code: 'AUS' },
        { id: 13, name: 'England', code: 'ENG' },
        { id: 14, name: 'Pakistan', code: 'PAK' },
        { id: 15, name: 'New Zealand', code: 'NZ' },
        { id: 16, name: 'South Africa', code: 'SA' },
        { id: 17, name: 'West Indies', code: 'WI' },
        { id: 18, name: 'Sri Lanka', code: 'SL' },
        { id: 19, name: 'Bangladesh', code: 'BAN' },
        { id: 20, name: 'Afghanistan', code: 'AFG' }
    ];
    
    // Fetch series data based on tournament type and year
    useEffect(() => {
        const fetchSeriesData = async () => {
            if (!year) return;
            
            setLoading(true);
            setError(null);
            
            try {
                const options = {
                    method: 'GET',
                    url: `https://cricbuzz-cricket.p.rapidapi.com/series/v1/archives/league`,
                    headers: {
                        'x-rapidapi-key': 'e4cfe50474msh3678b3dd360d14bp132c36jsn172ec647c633',
                        'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
                    },
                    params: { year: year.toString() }
                };
                
                const response = await axios.request(options);
                
                // Filter for IPL series if tournament type is league
                let filteredSeries = [];
                if (tournamentType === 'league') {
                    response.data.seriesMapProto.forEach(yearData => {
                        if (yearData.date === year.toString()) {
                            filteredSeries = yearData.series.filter(series => 
                                series.name.includes('Indian Premier League')
                            );
                        }
                    });
                } else {
                    response.data.seriesMapProto.forEach(yearData => {
                        if (yearData.date === year.toString()) {
                            filteredSeries = yearData.series;
                        }
                    });
                }
                
                setSeriesData(filteredSeries);
                
                // Auto-select first series if available
                if (filteredSeries.length > 0) {
                    setSelectedSeries(filteredSeries[0]);
                } else {
                    setSelectedSeries(null);
                    setMatchesData([]);
                }
            } catch (error) {
                console.error('Error fetching series data:', error);
                setError('Failed to fetch tournament data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchSeriesData();
    }, [tournamentType, year]);
    
    // Fetch matches data when a series is selected
    useEffect(() => {
        const fetchMatchesData = async () => {
            if (!selectedSeries) return;
            
            setLoading(true);
            setError(null);
            
            try {
                const options = {
                    method: 'GET',
                    url: `https://cricbuzz-cricket.p.rapidapi.com/series/v1/${selectedSeries.id}`,
                    headers: {
                        'x-rapidapi-key': '47905f51f7mshbd5b1b7136cc7e9p1d0fdfjsn2c1d748c31f9',
                        'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
                    }
                };
                
                const response = await axios.request(options);
                console.log('API Response:', response.data);
                
                // Process the matches data from the API response
                let matches = [];
                if (response.data && response.data.matchDetails) {
                    // Flatten the structure to get all matches
                    response.data.matchDetails.forEach(detail => {
                        if (detail.matchDetailsMap) {
                            // Handle matchDetailsMap format
                            if (detail.matchDetailsMap.match && Array.isArray(detail.matchDetailsMap.match)) {
                                detail.matchDetailsMap.match.forEach(match => {
                                    if (match.matchInfo) {
                                        matches.push({
                                            id: match.matchInfo.matchId,
                                            matchDate: new Date(parseInt(match.matchInfo.startDate)).toLocaleDateString(),
                                            venue: match.matchInfo.venueInfo?.ground,
                                            team1: {
                                                name: match.matchInfo.team1?.teamName || 'Team 1',
                                                shortName: match.matchInfo.team1?.teamSName || 'T1'
                                            },
                                            team2: {
                                                name: match.matchInfo.team2?.teamName || 'Team 2',
                                                shortName: match.matchInfo.team2?.teamSName || 'T2'
                                            },
                                            status: match.matchInfo.status,
                                            score1: match.matchInfo.matchScore?.team1Score?.inngs1,
                                            score2: match.matchInfo.matchScore?.team2Score?.inngs1
                                        });
                                    }
                                });
                            } else {
                                // Handle single match format
                                const match = detail.matchDetailsMap;
                                matches.push({
                                    id: match.id || Math.random().toString(),
                                    matchDate: match.key || 'Unknown date',
                                    venue: 'Unknown venue',
                                    team1: {
                                        name: match.team1?.name || 'Team 1',
                                        shortName: match.team1?.shortName || 'T1'
                                    },
                                    team2: {
                                        name: match.team2?.name || 'Team 2',
                                        shortName: match.team2?.shortName || 'T2'
                                    }
                                });
                            }
                        }
                    });
                    
                    // Filter matches based on selected teams if both are selected
                    if (team1 && team2) {
                        matches = matches.filter(match => {
                            const team1Names = [
                                match.team1?.name?.toLowerCase() || '',
                                match.team1?.shortName?.toLowerCase() || ''
                            ];
                            
                            const team2Names = [
                                match.team2?.name?.toLowerCase() || '',
                                match.team2?.shortName?.toLowerCase() || ''
                            ];
                            
                            return (
                                (team1Names.some(name => name.includes(team1.toLowerCase())) && 
                                 team2Names.some(name => name.includes(team2.toLowerCase()))) ||
                                (team1Names.some(name => name.includes(team2.toLowerCase())) && 
                                 team2Names.some(name => name.includes(team1.toLowerCase())))
                            );
                        });
                    }
                }
                
                console.log('Processed matches:', matches);
                setMatchesData(matches);
                
                // Auto-select first match if available
                if (matches.length > 0) {
                    setSelectedMatch(matches[0]);
                    generateMatchAnalysis(matches[0]);
                } else {
                    setSelectedMatch(null);
                    setMatchAnalysis(null);
                }
            } catch (error) {
                console.error('Error fetching matches data:', error);
                setError('Failed to fetch match data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchMatchesData();
    }, [selectedSeries, team1, team2]);
    
    // Generate match analysis data
    const generateMatchAnalysis = (match) => {
        if (!match) return;
        
        // In a real application, you would fetch detailed match data from an API
        // For this demo, we'll generate mock data based on the match information
        
        const team1Name = match.team1?.name || 'Team 1';
        const team2Name = match.team2?.name || 'Team 2';
        const team1Code = match.team1?.shortName || 'T1';
        const team2Code = match.team2?.shortName || 'T2';
        
        // Generate random scores
        const team1Score = Math.floor(Math.random() * 100) + 120;
        const team2Score = Math.floor(Math.random() * 100) + 120;
        const team1Wickets = Math.floor(Math.random() * 10);
        const team2Wickets = Math.floor(Math.random() * 10);
        const team1Overs = (Math.random() * 10 + 10).toFixed(1);
        const team2Overs = (Math.random() * 10 + 10).toFixed(1);
        
        // Determine winner
        const winner = team1Score > team2Score ? team1Name : team2Name;
        const margin = Math.abs(team1Score - team2Score);
        
        // Generate batting data
        const generateBattingData = (teamName, teamScore) => {
            const players = 6;
            const battingData = [];
            let remainingRuns = teamScore;
            
            for (let i = 0; i < players; i++) {
                const isLastPlayer = i === players - 1;
                const runs = isLastPlayer ? remainingRuns : Math.floor(Math.random() * (remainingRuns / 2));
                const balls = Math.floor(runs * (Math.random() * 0.5 + 0.7));
                const fours = Math.floor(runs / 10);
                const sixes = Math.floor(runs / 20);
                
                battingData.push({
                    name: `Player ${i+1}`,
                    team: teamName,
                    runs,
                    balls,
                    strikeRate: ((runs / balls) * 100).toFixed(2),
                    fours,
                    sixes
                });
                
                remainingRuns -= runs;
                if (remainingRuns <= 0) break;
            }
            
            return battingData;
        };
        
        // Generate bowling data
        const generateBowlingData = (teamName) => {
            const players = 5;
            const bowlingData = [];
            
            for (let i = 0; i < players; i++) {
                const overs = (Math.random() * 3 + 1).toFixed(1);
                const maidens = Math.floor(Math.random() * 2);
                const runs = Math.floor(Math.random() * 40) + 10;
                const wickets = Math.floor(Math.random() * 3);
                
                bowlingData.push({
                    name: `Bowler ${i+1}`,
                    team: teamName,
                    overs,
                    maidens,
                    runs,
                    wickets,
                    economy: (runs / parseFloat(overs)).toFixed(2)
                });
            }
            
            return bowlingData;
        };
        
        // Generate partnership data
        const generatePartnershipData = (teamName, teamScore) => {
            const partnerships = [];
            let totalRuns = 0;
            
            for (let i = 1; i <= 5; i++) {
                const runs = i === 5 ? teamScore - totalRuns : Math.floor(Math.random() * (teamScore / 6));
                const balls = Math.floor(runs * (Math.random() * 0.5 + 0.7));
                
                partnerships.push({
                    wicket: i,
                    runs,
                    balls,
                    players: `Player ${i} & Player ${i+1}`,
                    team: teamName
                });
                
                totalRuns += runs;
                if (totalRuns >= teamScore) break;
            }
            
            return partnerships;
        };
        
        // Generate over-by-over data
        const generateOverByOverData = (teamName, teamScore, overs) => {
            const overData = [];
            const totalOvers = Math.floor(parseFloat(overs));
            let remainingRuns = teamScore;
            
            for (let i = 1; i <= totalOvers; i++) {
                const isLastOver = i === totalOvers;
                const runsInOver = isLastOver ? remainingRuns : Math.floor(Math.random() * 15);
                const wicketsInOver = Math.random() > 0.8 ? 1 : 0;
                
                overData.push({
                    over: i,
                    runs: runsInOver,
                    wickets: wicketsInOver,
                    team: teamName // Ensure team name is included
                });
                
                remainingRuns -= runsInOver;
                if (remainingRuns <= 0) {
                    // Add at least one run for remaining overs
                    for (let j = i + 1; j <= totalOvers; j++) {
                        overData.push({
                            over: j,
                            runs: 1,
                            wickets: 0,
                            team: teamName // Ensure team name is included
                        });
                    }
                    break;
                }
            }
            
            return overData;
        };
        
        // Generate match phases data (powerplay, middle, death)
        const generateMatchPhasesData = (teamName, teamScore) => {
            const powerplayRuns = Math.floor(teamScore * (Math.random() * 0.1 + 0.25));
            const middleRuns = Math.floor(teamScore * (Math.random() * 0.1 + 0.35));
            const deathRuns = teamScore - powerplayRuns - middleRuns;
            
            return [
                { phase: 'Powerplay (1-6)', runs: powerplayRuns, team: teamName },
                { phase: 'Middle (7-15)', runs: middleRuns, team: teamName },
                { phase: 'Death (16-20)', runs: deathRuns, team: teamName }
            ];
        };
        
        // Generate player performance data
        const generatePlayerPerformanceData = (teamName) => {
            const players = 6;
            const performanceData = [];
            
            for (let i = 0; i < players; i++) {
                const runs = Math.floor(Math.random() * 50) + 10;
                const wickets = Math.floor(Math.random() * 3);
                
                performanceData.push({
                    name: `Player ${i+1}`,
                    team: teamName,
                    runs,
                    wickets
                });
            }
            
            return performanceData;
        };
        
        // Generate wagon wheel data
        const generateWagonWheelData = (teamName, teamScore) => {
            const directions = [
                'Fine Leg', 'Square Leg', 'Mid Wicket', 'Mid On', 'Cover', 'Point', 'Third Man'
            ];
            const wagonWheelData = [];
            
            directions.forEach(direction => {
                const runs = Math.floor(Math.random() * (teamScore / 7));
                wagonWheelData.push({
                    direction,
                    runs
                });
            });
            
            return wagonWheelData;
        };
        
        // Combine all data
        const analysis = {
            matchInfo: {
                date: match.matchDate || 'Unknown date',
                venue: match.venue || 'Unknown venue',
                result: `${winner} won by ${margin} runs`,
                toss: Math.random() > 0.5 ? `${team1Name} won the toss and elected to bat` : `${team2Name} won the toss and elected to field`
            },
            scores: {
                team1: {
                    name: team1Name,
                    code: team1Code,
                    score: team1Score,
                    wickets: team1Wickets,
                    overs: team1Overs
                },
                team2: {
                    name: team2Name,
                    code: team2Code,
                    score: team2Score,
                    wickets: team2Wickets,
                    overs: team2Overs
                }
            },
            battingData: {
                team1: generateBattingData(team1Name, team1Score),
                team2: generateBattingData(team2Name, team2Score)
            },
            bowlingData: {
                team1: generateBowlingData(team1Name),
                team2: generateBowlingData(team2Name)
            },
            partnerships: {
                team1: generatePartnershipData(team1Name, team1Score),
                team2: generatePartnershipData(team2Name, team2Score)
            },
            overByOver: {
                team1: generateOverByOverData(team1Name, team1Score, team1Overs),
                team2: generateOverByOverData(team2Name, team2Score, team2Overs)
            },
            matchPhases: {
                team1: generateMatchPhasesData(team1Name, team1Score),
                team2: generateMatchPhasesData(team2Name, team2Score)
            },
            playerPerformance: {
                team1: generatePlayerPerformanceData(team1Name),
                team2: generatePlayerPerformanceData(team2Name)
            },
            wagonWheel: {
                team1: generateWagonWheelData(team1Name, team1Score),
                team2: generateWagonWheelData(team2Name, team2Score)
            }
        };

        // Ensure all data is valid before setting state
        if (analysis && 
            analysis.overByOver && 
            analysis.overByOver.team1 && 
            analysis.overByOver.team2 && 
            analysis.overByOver.team1.length > 0 && 
            analysis.overByOver.team2.length > 0) {
            setMatchAnalysis(analysis);
        } else {
            console.error("Invalid match analysis data generated");
            // Set a default analysis with minimal data
            setMatchAnalysis({
                matchInfo: { date: 'Unknown date', venue: 'Unknown venue', result: 'Unknown result', toss: 'Unknown toss' },
                scores: {
                    team1: { name: team1Name, code: team1Code, score: 0, wickets: 0, overs: '0.0' },
                    team2: { name: team2Name, code: team2Code, score: 0, wickets: 0, overs: '0.0' }
                },
                battingData: { team1: [], team2: [] },
                bowlingData: { team1: [], team2: [] },
                partnerships: { team1: [], team2: [] },
                overByOver: { 
                    team1: [{ over: 1, runs: 0, wickets: 0, team: team1Name }], 
                    team2: [{ over: 1, runs: 0, wickets: 0, team: team2Name }] 
                },
                matchPhases: { team1: [], team2: [] },
                playerPerformance: { team1: [], team2: [] },
                wagonWheel: { team1: [], team2: [] }
            });
        }
    };
    
    // Handle match selection
    const handleMatchSelect = (match) => {
        setSelectedMatch(match);
        generateMatchAnalysis(match);
    };
    
    // Colors for charts
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    
    return (
        <div className="p-6 bg-gray-900 text-white min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 border-b border-gray-700 pb-4">Match Analysis</h1>
                
                {/* Filters */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <FaFilter className="mr-2" />
                        Match Filters
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Tournament Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Tournament Type</label>
                            <select
                                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={tournamentType}
                                onChange={(e) => setTournamentType(e.target.value)}
                            >
                                <option value="league">League (IPL)</option>
                                <option value="international">International</option>
                            </select>
                        </div>
                        
                        {/* Year */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Year</label>
                            <select
                                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={year}
                                onChange={(e) => setYear(parseInt(e.target.value))}
                            >
                                {years.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Team 1 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Team 1</label>
                            <select
                                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={team1}
                                onChange={(e) => setTeam1(e.target.value)}
                            >
                                <option value="">Select Team 1</option>
                                {teams.map(team => (
                                    <option key={team.id} value={team.name}>{team.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Team 2 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Team 2</label>
                            <select
                                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={team2}
                                onChange={(e) => setTeam2(e.target.value)}
                            >
                                <option value="">Select Team 2</option>
                                {teams.map(team => (
                                    <option key={team.id} value={team.name}>{team.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                
                {/* Series Selection */}
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <FaSpinner className="animate-spin text-4xl" />
                    </div>
                ) : error ? (
                    <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
                        {error}
                    </div>
                ) : (
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <FaCalendarAlt className="mr-2" />
                            Select Series
                        </h2>
                        
                        {seriesData.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {seriesData.map(series => (
                                    <div
                                        key={series.id}
                                        className={`p-4 rounded-lg cursor-pointer ${selectedSeries?.id === series.id ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                                        onClick={() => setSelectedSeries(series)}
                                    >
                                        <h3 className="text-lg font-semibold mb-2">{series.name}</h3>
                                        <p className="text-sm">{series.startDate} - {series.endDate}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400">No series found for the selected filters.</p>
                        )}
                    </div>
                )}
                
                {/* Match Selection */}
                {selectedSeries && !loading && !error && (
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <FaExchangeAlt className="mr-2" />
                            Select Match
                        </h2>
                        
                        {matchesData.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {matchesData.map(match => (
                                    <div
                                        key={match.id}
                                        className={`p-4 rounded-lg cursor-pointer ${selectedMatch?.id === match.id ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                                        onClick={() => handleMatchSelect(match)}
                                    >
                                        <h3 className="text-lg font-semibold mb-2">{match.team1?.name} vs {match.team2?.name}</h3>
                                        <p className="text-sm">{match.matchDate}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400">No matches found for the selected series.</p>
                        )}
                    </div>
                )}
                
                {/* Match Analysis */}
                {matchAnalysis && (
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <FaBaseballBall className="mr-2" />
                            Match Analysis
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Match Info */}
                            <div className="bg-gray-700 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">Match Info</h3>
                                <p className="text-sm">Date: {matchAnalysis.matchInfo.date}</p>
                                <p className="text-sm">Venue: {matchAnalysis.matchInfo.venue}</p>
                                <p className="text-sm">Result: {matchAnalysis.matchInfo.result}</p>
                                <p className="text-sm">Toss: {matchAnalysis.matchInfo.toss}</p>
                            </div>
                            
                            {/* Scores */}
                            <div className="bg-gray-700 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">Scores</h3>
                                <div className="flex justify-between mb-2">
                                    <div>
                                        <h4 className="text-sm font-semibold">{matchAnalysis.scores.team1.name}</h4>
                                        <p className="text-sm">{matchAnalysis.scores.team1.score}/{matchAnalysis.scores.team1.wickets} ({matchAnalysis.scores.team1.overs})</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold">{matchAnalysis.scores.team2.name}</h4>
                                        <p className="text-sm">{matchAnalysis.scores.team2.score}/{matchAnalysis.scores.team2.wickets} ({matchAnalysis.scores.team2.overs})</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Batting Analysis */}
                            <div className="bg-gray-700 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">Batting Analysis</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {matchAnalysis?.battingData?.team1 && Array.isArray(matchAnalysis.battingData.team1) && matchAnalysis.battingData.team1.length > 0 ? (
                                        <div>
                                            <h4 className="text-sm font-semibold">{matchAnalysis.scores?.team1?.name || 'Team 1'}</h4>
                                            <BarChart
                                                width={300}
                                                height={200}
                                                data={matchAnalysis.battingData.team1}
                                                margin={{
                                                    top: 5, right: 30, left: 20, bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="runs" fill={COLORS[0]} />
                                            </BarChart>
                                        </div>
                                    ) : (
                                        <div className="text-gray-400">No batting data available for Team 1</div>
                                    )}
                                    
                                    {matchAnalysis?.battingData?.team2 && Array.isArray(matchAnalysis.battingData.team2) && matchAnalysis.battingData.team2.length > 0 ? (
                                        <div>
                                            <h4 className="text-sm font-semibold">{matchAnalysis.scores?.team2?.name || 'Team 2'}</h4>
                                            <BarChart
                                                width={300}
                                                height={200}
                                                data={matchAnalysis.battingData.team2}
                                                margin={{
                                                    top: 5, right: 30, left: 20, bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="runs" fill={COLORS[1]} />
                                            </BarChart>
                                        </div>
                                    ) : (
                                        <div className="text-gray-400">No batting data available for Team 2</div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Bowling Analysis */}
                            <div className="bg-gray-700 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">Bowling Analysis</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {matchAnalysis?.bowlingData?.team1 && Array.isArray(matchAnalysis.bowlingData.team1) && matchAnalysis.bowlingData.team1.length > 0 ? (
                                        <div>
                                            <h4 className="text-sm font-semibold">{matchAnalysis.scores?.team1?.name || 'Team 1'}</h4>
                                            <BarChart
                                                width={300}
                                                height={200}
                                                data={matchAnalysis.bowlingData.team1}
                                                margin={{
                                                    top: 5, right: 30, left: 20, bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="wickets" fill={COLORS[2]} />
                                            </BarChart>
                                        </div>
                                    ) : (
                                        <div className="text-gray-400">No bowling data available for Team 1</div>
                                    )}
                                    
                                    {matchAnalysis?.bowlingData?.team2 && Array.isArray(matchAnalysis.bowlingData.team2) && matchAnalysis.bowlingData.team2.length > 0 ? (
                                        <div>
                                            <h4 className="text-sm font-semibold">{matchAnalysis.scores?.team2?.name || 'Team 2'}</h4>
                                            <BarChart
                                                width={300}
                                                height={200}
                                                data={matchAnalysis.bowlingData.team2}
                                                margin={{
                                                    top: 5, right: 30, left: 20, bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="wickets" fill={COLORS[3]} />
                                            </BarChart>
                                        </div>
                                    ) : (
                                        <div className="text-gray-400">No bowling data available for Team 2</div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Partnership Analysis */}
                            <div className="bg-gray-700 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">Partnership Analysis</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {matchAnalysis?.partnerships?.team1 && Array.isArray(matchAnalysis.partnerships.team1) && matchAnalysis.partnerships.team1.length > 0 ? (
                                        <div>
                                            <h4 className="text-sm font-semibold">{matchAnalysis.scores?.team1?.name || 'Team 1'}</h4>
                                            <LineChart
                                                width={300}
                                                height={200}
                                                data={matchAnalysis.partnerships.team1}
                                                margin={{
                                                    top: 5, right: 30, left: 20, bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="wicket" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line type="monotone" dataKey="runs" stroke={COLORS[4]} />
                                            </LineChart>
                                        </div>
                                    ) : (
                                        <div className="text-gray-400">No partnership data available for Team 1</div>
                                    )}
                                    
                                    {matchAnalysis?.partnerships?.team2 && Array.isArray(matchAnalysis.partnerships.team2) && matchAnalysis.partnerships.team2.length > 0 ? (
                                        <div>
                                            <h4 className="text-sm font-semibold">{matchAnalysis.scores?.team2?.name || 'Team 2'}</h4>
                                            <LineChart
                                                width={300}
                                                height={200}
                                                data={matchAnalysis.partnerships.team2}
                                                margin={{
                                                    top: 5, right: 30, left: 20, bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="wicket" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line type="monotone" dataKey="runs" stroke={COLORS[5]} />
                                            </LineChart>
                                        </div>
                                    ) : (
                                        <div className="text-gray-400">No partnership data available for Team 2</div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Over-by-Over Analysis */}
                            <div className="bg-gray-700 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">Over-by-Over Analysis</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {matchAnalysis?.overByOver?.team1 && Array.isArray(matchAnalysis.overByOver.team1) && matchAnalysis.overByOver.team1.length > 0 ? (
                                        <div>
                                            <h4 className="text-sm font-semibold">{matchAnalysis.scores?.team1?.name || 'Team 1'}</h4>
                                            <LineChart
                                                width={300}
                                                height={200}
                                                data={matchAnalysis.overByOver.team1}
                                                margin={{
                                                    top: 5, right: 30, left: 20, bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="over" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line type="monotone" dataKey="runs" stroke={COLORS[0]} />
                                            </LineChart>
                                        </div>
                                    ) : (
                                        <div className="text-gray-400">No over-by-over data available for Team 1</div>
                                    )}
                                    
                                    {matchAnalysis?.overByOver?.team2 && Array.isArray(matchAnalysis.overByOver.team2) && matchAnalysis.overByOver.team2.length > 0 ? (
                                        <div>
                                            <h4 className="text-sm font-semibold">{matchAnalysis.scores?.team2?.name || 'Team 2'}</h4>
                                            <LineChart
                                                width={300}
                                                height={200}
                                                data={matchAnalysis.overByOver.team2}
                                                margin={{
                                                    top: 5, right: 30, left: 20, bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="over" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line type="monotone" dataKey="runs" stroke={COLORS[1]} />
                                            </LineChart>
                                        </div>
                                    ) : (
                                        <div className="text-gray-400">No over-by-over data available for Team 2</div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Match Phases Analysis */}
                            <div className="bg-gray-700 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">Match Phases Analysis</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {matchAnalysis?.matchPhases?.team1 && Array.isArray(matchAnalysis.matchPhases.team1) && matchAnalysis.matchPhases.team1.length > 0 ? (
                                        <div>
                                            <h4 className="text-sm font-semibold">{matchAnalysis.scores?.team1?.name || 'Team 1'}</h4>
                                            <PieChart width={300} height={200}>
                                                <Pie
                                                    data={matchAnalysis.matchPhases.team1}
                                                    dataKey="runs"
                                                    nameKey="phase"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                >
                                                    {matchAnalysis.matchPhases.team1.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </div>
                                    ) : (
                                        <div className="text-gray-400">No phase data available for Team 1</div>
                                    )}
                                    
                                    {matchAnalysis?.matchPhases?.team2 && Array.isArray(matchAnalysis.matchPhases.team2) && matchAnalysis.matchPhases.team2.length > 0 ? (
                                        <div>
                                            <h4 className="text-sm font-semibold">{matchAnalysis.scores?.team2?.name || 'Team 2'}</h4>
                                            <PieChart width={300} height={200}>
                                                <Pie
                                                    data={matchAnalysis.matchPhases.team2}
                                                    dataKey="runs"
                                                    nameKey="phase"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                >
                                                    {matchAnalysis.matchPhases.team2.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </div>
                                    ) : (
                                        <div className="text-gray-400">No phase data available for Team 2</div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Player Performance Analysis */}
                            <div className="bg-gray-700 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">Player Performance Analysis</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {matchAnalysis?.playerPerformance?.team1 && Array.isArray(matchAnalysis.playerPerformance.team1) && matchAnalysis.playerPerformance.team1.length > 0 ? (
                                        <div>
                                            <h4 className="text-sm font-semibold">{matchAnalysis.scores?.team1?.name || 'Team 1'}</h4>
                                            <BarChart
                                                width={300}
                                                height={200}
                                                data={matchAnalysis.playerPerformance.team1}
                                                margin={{
                                                    top: 5, right: 30, left: 20, bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="runs" name="Runs" fill={COLORS[0]} />
                                                <Bar dataKey="wickets" name="Wickets" fill={COLORS[1]} />
                                            </BarChart>
                                        </div>
                                    ) : (
                                        <div className="text-gray-400">No data available for Team 1</div>
                                    )}
                                    
                                    {matchAnalysis?.playerPerformance?.team2 && Array.isArray(matchAnalysis.playerPerformance.team2) && matchAnalysis.playerPerformance.team2.length > 0 ? (
                                        <div>
                                            <h4 className="text-sm font-semibold">{matchAnalysis.scores?.team2?.name || 'Team 2'}</h4>
                                            <BarChart
                                                width={300}
                                                height={200}
                                                data={matchAnalysis.playerPerformance.team2}
                                                margin={{
                                                    top: 5, right: 30, left: 20, bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="runs" name="Runs" fill={COLORS[0]} />
                                                <Bar dataKey="wickets" name="Wickets" fill={COLORS[1]} />
                                            </BarChart>
                                        </div>
                                    ) : (
                                        <div className="text-gray-400">No data available for Team 2</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}








export default Match_analysis;
