import { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowRight, BarChart2, RefreshCw, AlertCircle } from 'lucide-react';

function Predictive_Analysis() {
    // Form state
    const [battingTeam, setBattingTeam] = useState('');
    const [bowlingTeam, setBowlingTeam] = useState('');
    const [city, setCity] = useState('');
    const [target, setTarget] = useState('');
    const [score, setScore] = useState('');
    const [overs, setOvers] = useState('');
    const [wickets, setWickets] = useState('');
    
    // Derived values
    const [runsLeft, setRunsLeft] = useState(0);
    const [ballsLeft, setBallsLeft] = useState(0);
    const [crr, setCrr] = useState(0);
    const [rrr, setRrr] = useState(0);
    
    // UI state
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    
    // Teams and cities data
    const teams = [
        'Sunrisers Hyderabad',
        'Mumbai Indians',
        'Royal Challengers Bengaluru',
        'Kolkata Knight Riders',
        'Punjab Kings',
        'Chennai Super Kings',
        'Rajasthan Royals',
        'Delhi Capitals',
        'Lucknow Super Giants',
        'Gujarat Titans'
    ];
    
    const cities = [
        'Hyderabad', 'Bangalore', 'Mumbai', 'Indore', 'Kolkata', 'Delhi',
        'Chandigarh', 'Jaipur', 'Chennai', 'Cape Town', 'Port Elizabeth',
        'Durban', 'Centurion', 'East London', 'Johannesburg', 'Kimberley',
        'Bloemfontein', 'Ahmedabad', 'Cuttack', 'Nagpur', 'Dharamsala',
        'Visakhapatnam', 'Pune', 'Raipur', 'Ranchi', 'Abu Dhabi',
        'Sharjah', 'Mohali', 'Bengaluru'
    ];
    
    // Calculate derived values when inputs change
    useEffect(() => {
        try {
            // Parse inputs
            const targetRuns = parseInt(target) || 0;
            const currentScore = parseInt(score) || 0;
            const currentOvers = parseFloat(overs) || 0;
            const currentWickets = parseInt(wickets) || 0;
            
            // Calculate balls completed
            const oversCompleted = Math.floor(currentOvers);
            const ballsCompleted = (currentOvers - oversCompleted) * 10 + oversCompleted * 6;
            
            // Calculate derived values
            const runs_left = targetRuns - currentScore;
            const balls_left = 120 - ballsCompleted; // T20 match has 120 balls
            const current_run_rate = ballsCompleted > 0 ? (currentScore / ballsCompleted) * 6 : 0;
            const required_run_rate = balls_left > 0 ? (runs_left / balls_left) * 6 : 99.99;
            
            // Update state
            setRunsLeft(runs_left);
            setBallsLeft(balls_left);
            setCrr(parseFloat(current_run_rate.toFixed(2)));
            setRrr(parseFloat(required_run_rate.toFixed(2)));
        } catch (error) {
            console.error("Calculation error:", error);
        }
    }, [target, score, overs]);
    
    // Validate form
    const validateForm = () => {
        const errors = {};
        
        if (!battingTeam) errors.battingTeam = "Batting team is required";
        if (!bowlingTeam) errors.bowlingTeam = "Bowling team is required";
        if (battingTeam === bowlingTeam) errors.bowlingTeam = "Batting and bowling teams must be different";
        if (!city) errors.city = "City is required";
        if (!target) errors.target = "Target score is required";
        if (!score) errors.score = "Current score is required";
        if (!overs) errors.overs = "Current overs is required";
        if (!wickets) errors.wickets = "Current wickets is required";
        
        // Validate numeric inputs
        if (target && (isNaN(parseInt(target)) || parseInt(target) <= 0)) 
            errors.target = "Target must be a positive number";
        if (score && (isNaN(parseInt(score)) || parseInt(score) < 0)) 
            errors.score = "Score must be a non-negative number";
        if (overs && (isNaN(parseFloat(overs)) || parseFloat(overs) < 0 || parseFloat(overs) >= 20)) 
            errors.overs = "Overs must be between 0 and 19.9";
        if (wickets && (isNaN(parseInt(wickets)) || parseInt(wickets) < 0 || parseInt(wickets) > 10)) 
            errors.wickets = "Wickets must be between 0 and 10";
            
        // Validate match situation
        if (parseInt(score) >= parseInt(target)) 
            errors.score = "Current score cannot be greater than or equal to target";
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };
    
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.post('http://localhost:5000/predict', {
                batting_team: battingTeam,
                bowling_team: bowlingTeam,
                city: city,
                runs_left: runsLeft,
                balls_left: ballsLeft,
                wickets: parseInt(wickets),
                target: parseInt(target),
                crr: crr,
                rrr: rrr
            });
            
            setResult(response.data);
        } catch (error) {
            console.error("Prediction error:", error);
            setError(error.response?.data?.error || "Failed to get prediction. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    
    // Reset form
    const resetForm = () => {
        setBattingTeam('');
        setBowlingTeam('');
        setCity('');
        setTarget('');
        setScore('');
        setOvers('');
        setWickets('');
        setResult(null);
        setError(null);
        setFormErrors({});
    };
    
    return (
        <div className="bg-gray-900 min-h-screen text-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-blue-400 mb-2">IPL Match Predictor</h1>
                    <p className="text-gray-400">Predict the outcome of an ongoing IPL match using machine learning</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-gray-800 rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold mb-6 flex items-center">
                                <BarChart2 className="mr-2 text-blue-400" size={20} />
                                Match Details
                            </h2>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    {/* Batting Team */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Batting Team
                                        </label>
                                        <select
                                            value={battingTeam}
                                            onChange={(e) => setBattingTeam(e.target.value)}
                                            className={`w-full bg-gray-700 border ${formErrors.battingTeam ? 'border-red-500' : 'border-gray-600'} rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        >
                                            <option value="">Select Batting Team</option>
                                            {teams.map(team => (
                                                <option key={`batting-${team}`} value={team}>{team}</option>
                                            ))}
                                        </select>
                                        {formErrors.battingTeam && (
                                            <p className="mt-1 text-sm text-red-500">{formErrors.battingTeam}</p>
                                        )}
                                    </div>
                                    
                                    {/* Bowling Team */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Bowling Team
                                        </label>
                                        <select
                                            value={bowlingTeam}
                                            onChange={(e) => setBowlingTeam(e.target.value)}
                                            className={`w-full bg-gray-700 border ${formErrors.bowlingTeam ? 'border-red-500' : 'border-gray-600'} rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        >
                                            <option value="">Select Bowling Team</option>
                                            {teams.map(team => (
                                                <option key={`bowling-${team}`} value={team}>{team}</option>
                                            ))}
                                        </select>
                                        {formErrors.bowlingTeam && (
                                            <p className="mt-1 text-sm text-red-500">{formErrors.bowlingTeam}</p>
                                        )}
                                    </div>
                                    
                                    {/* City */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            City
                                        </label>
                                        <select
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            className={`w-full bg-gray-700 border ${formErrors.city ? 'border-red-500' : 'border-gray-600'} rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        >
                                            <option value="">Select City</option>
                                            {cities.map(city => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                        {formErrors.city && (
                                            <p className="mt-1 text-sm text-red-500">{formErrors.city}</p>
                                        )}
                                    </div>
                                    
                                    {/* Target */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Target Score
                                        </label>
                                        <input
                                            type="number"
                                            value={target}
                                            onChange={(e) => setTarget(e.target.value)}
                                            placeholder="e.g. 180"
                                            className={`w-full bg-gray-700 border ${formErrors.target ? 'border-red-500' : 'border-gray-600'} rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        />
                                        {formErrors.target && (
                                            <p className="mt-1 text-sm text-red-500">{formErrors.target}</p>
                                        )}
                                    </div>
                                    
                                    {/* Current Score */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Current Score
                                        </label>
                                        <input
                                            type="number"
                                            value={score}
                                            onChange={(e) => setScore(e.target.value)}
                                            placeholder="e.g. 100"
                                            className={`w-full bg-gray-700 border ${formErrors.score ? 'border-red-500' : 'border-gray-600'} rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        />
                                        {formErrors.score && (
                                            <p className="mt-1 text-sm text-red-500">{formErrors.score}</p>
                                        )}
                                    </div>
                                    
                                    {/* Current Overs */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Current Overs
                                        </label>
                                        <input
                                            type="text"
                                            value={overs}
                                            onChange={(e) => setOvers(e.target.value)}
                                            placeholder="e.g. 10.2"
                                            className={`w-full bg-gray-700 border ${formErrors.overs ? 'border-red-500' : 'border-gray-600'} rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        />
                                        {formErrors.overs && (
                                            <p className="mt-1 text-sm text-red-500">{formErrors.overs}</p>
                                        )}
                                    </div>
                                    
                                    {/* Wickets */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Wickets Lost
                                        </label>
                                        <select
                                            value={wickets}
                                            onChange={(e) => setWickets(e.target.value)}
                                            className={`w-full bg-gray-700 border ${formErrors.wickets ? 'border-red-500' : 'border-gray-600'} rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        >
                                            <option value="">Select Wickets</option>
                                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(w => (
                                                <option key={w} value={w}>{w}</option>
                                            ))}
                                        </select>
                                        {formErrors.wickets && (
                                            <p className="mt-1 text-sm text-red-500">{formErrors.wickets}</p>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Calculated Values */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 bg-gray-700/50 p-4 rounded-lg">
                                    <div>
                                        <div className="text-xs text-gray-400">Runs Left</div>
                                        <div className="text-lg font-semibold">{runsLeft}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400">Balls Left</div>
                                        <div className="text-lg font-semibold">{ballsLeft}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400">Current RR</div>
                                        <div className="text-lg font-semibold">{crr}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400">Required RR</div>
                                        <div className="text-lg font-semibold">{rrr}</div>
                                    </div>
                                </div>
                                
                                {/* Form Actions */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center"
                                    >
                                        {loading ? (
                                            <>
                                                <RefreshCw className="animate-spin mr-2" size={18} />
                                                Predicting...
                                            </>
                                        ) : (
                                            <>
                                                Predict Winner
                                                <ArrowRight className="ml-2" size={18} />
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    
                    {/* Results Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-800 rounded-xl shadow-lg p-6 h-full">
                            <h2 className="text-xl font-semibold mb-6">Prediction Results</h2>
                            
                            {error && (
                                <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 mb-6 flex items-start">
                                    <AlertCircle className="text-red-500 mr-2 mt-0.5 flex-shrink-0" size={18} />
                                    <p className="text-sm text-red-300">{error}</p>
                                </div>
                            )}
                            
                            {result ? (
                                <div className="space-y-6">
                                    <div className="text-center mb-4">
                                        <h3 className="text-lg font-medium mb-1">Win Probability</h3>
                                        <p className="text-sm text-gray-400">Based on current match situation</p>
                                    </div>
                                    
                                    {/* Batting Team Probability */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">{battingTeam}</span>
                                            <span className="text-sm font-bold">
                                                {(result.batting_team_win_probability * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-4">
                                            <div 
                                                className="bg-blue-600 h-4 rounded-full"
                                                style={{ width: `${result.batting_team_win_probability * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    
                                    {/* Bowling Team Probability */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">{bowlingTeam}</span>
                                            <span className="text-sm font-bold">
                                                {(result.bowling_team_win_probability * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-4">
                                            <div 
                                                className="bg-green-600 h-4 rounded-full"
                                                style={{ width: `${result.bowling_team_win_probability * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    
                                    {/* Prediction Summary */}
                                    <div className="mt-6 pt-6 border-t border-gray-700">
                                        <h4 className="text-sm font-medium text-gray-400 mb-2">Prediction Summary</h4>
                                        <p className="text-sm text-gray-300">{result.prediction_summary}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400">Enter match details to predict the winner.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Predictive_Analysis;

                                    