import { useState, useEffect } from 'react';
import { FiEdit2, FiMail, FiCheckCircle, FiClock, FiSave } from 'react-icons/fi';
import { BiUser } from 'react-icons/bi';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        role: "",
        joinedDate: "",
        avatar: null
    });

    const [formData, setFormData] = useState({ ...profileData });
    const [statistics, setStatistics] = useState({
        totalEmails: 0,
        autoReplied: 0,
        manualReplies: 0,
        avgResponseTime: "",
        successRate: "",
        lastActive: ""
    });

    // Fetch user profile data on component mount
    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        setIsLoading(true);
        setError('');
        
        try {
            // Get user ID from localStorage
            const userData = JSON.parse(localStorage.getItem('user'));
            if (!userData || !userData.id) {
                throw new Error('User not authenticated');
            }
            
            // Fetch user profile data
            const response = await fetch(`http://localhost:3001/api/admins/${userData.id}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch profile data');
            }
            
            const data = await response.json();
            
            // Format the joined date (assuming created_at is in ISO format)
            const joinedDate = data.created_at ? new Date(data.created_at).toISOString().split('T')[0] : '';
            
            setProfileData({
                name: data.name || '',
                email: data.email || '',
                role: data.status === 'active' ? 'Admin' : 'Inactive Admin',
                joinedDate: joinedDate,
                avatar: data.avatar || null
            });
            
            setFormData({
                name: data.name || '',
                email: data.email || '',
                role: data.status === 'active' ? 'Admin' : 'Inactive Admin',
                joinedDate: joinedDate,
                avatar: data.avatar || null
            });
            
            // Fetch user statistics
            await fetchUserStatistics(userData.id);
            
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const fetchUserStatistics = async (userId) => {
        try {
            // Fetch user statistics from the server
            const response = await fetch(`http://localhost:3001/api/admins/${userId}/statistics`);
            
            if (!response.ok) {
                // If endpoint doesn't exist or returns an error, use empty values
                setStatistics({
                    totalEmails: 0,
                    autoReplied: 0,
                    manualReplies: 0,
                    avgResponseTime: "N/A",
                    successRate: "N/A",
                    lastActive: "N/A"
                });
                return;
            }
            
            const data = await response.json();
            setStatistics(data);
            
        } catch (err) {
            console.error('Error fetching statistics:', err);
            // Use empty values as fallback
            setStatistics({
                totalEmails: 0,
                autoReplied: 0,
                manualReplies: 0,
                avgResponseTime: "N/A",
                successRate: "N/A",
                lastActive: "N/A"
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        
        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            if (!userData || !userData.id) {
                throw new Error('User not authenticated');
            }
            
            const response = await fetch(`http://localhost:3001/api/admins/${userData.id}/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update profile');
            }
            
            setProfileData(formData);
            setIsEditing(false);
            setSuccessMessage('Profile updated successfully');
            
            // Update user data in localStorage
            const updatedUserData = {
                ...userData,
                name: formData.name,
                email: formData.email
            };
            localStorage.setItem('user', JSON.stringify(updatedUserData));
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.message);
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 bg-black min-h-screen flex items-center justify-center">
                <div className="text-white">Loading profile data...</div>
            </div>
        );
    }

    return (
        <div className="p-8 bg-black min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-semibold text-gray-100">Profile Settings</h2>
                    <button
                        onClick={() => isEditing ? handleSubmit(new Event('submit')) : setIsEditing(true)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
                            ${isEditing 
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                        {isEditing ? (
                            <>
                                <FiSave className="w-5 h-5" />
                                <span>Save Profile</span>
                            </>
                        ) : (
                            <>
                                <FiEdit2 className="w-5 h-5" />
                                <span>Edit Profile</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Error and Success Messages */}
                {error && (
                    <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
                        {error}
                    </div>
                )}
                
                {successMessage && (
                    <div className="mb-4 p-3 bg-green-900/50 border border-green-500 rounded-lg text-green-200">
                        {successMessage}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Information */}
                    <div className="lg:col-span-2">
                        <div className="bg-black rounded-xl border border-white p-6 shadow-lg">
                            <form onSubmit={handleSubmit}>
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="bg-gray-700 p-8 rounded-full">
                                        <BiUser size={48} className="text-gray-300" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-semibold text-gray-100 mb-2">
                                            {profileData.name || 'User'}
                                        </h2>
                                        <p className="text-gray-400">{profileData.role || 'Admin'}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-gray-100 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-gray-100 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Joined Date
                                        </label>
                                        <input
                                            type="date"
                                            name="joinedDate"
                                            value={formData.joinedDate}
                                            onChange={handleInputChange}
                                            disabled={true} // Joined date should not be editable
                                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-gray-100 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Role
                                        </label>
                                        <input
                                            type="text"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            disabled={true} // Role should not be editable by user
                                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-gray-100 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="space-y-6">
                        <div className="bg-black rounded-xl border border-white p-6 shadow-lg">
                            <h3 className="text-xl font-semibold text-gray-100 mb-4">Performance Stats</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FiMail className="w-5 h-5 text-blue-400" />
                                        <span className="text-gray-400">Total Emails</span>
                                    </div>
                                    <span className="text-gray-100 font-semibold">{statistics.totalEmails || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FiCheckCircle className="w-5 h-5 text-green-400" />
                                        <span className="text-gray-400">Auto Replied</span>
                                    </div>
                                    <span className="text-gray-100 font-semibold">{statistics.autoReplied || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FiEdit2 className="w-5 h-5 text-yellow-400" />
                                        <span className="text-gray-400">Manual Replies</span>
                                    </div>
                                    <span className="text-gray-100 font-semibold">{statistics.manualReplies || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FiClock className="w-5 h-5 text-purple-400" />
                                        <span className="text-gray-400">Avg Response Time</span>
                                    </div>
                                    <span className="text-gray-100 font-semibold">{statistics.avgResponseTime || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;


