import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RiDashboardLine, RiBarChartBoxLine, RiTeamLine, RiUserSearchLine } from 'react-icons/ri';
import { MdOutlineSportsScore, MdOutlineSportsCricket, MdOutlineLeaderboard } from 'react-icons/md';
import { GiCricketBat, GiTrophy } from 'react-icons/gi';
import { CgProfile } from 'react-icons/cg';
import { BiInfoCircle, BiLogOut, BiUser } from 'react-icons/bi';
import { BsChatDots } from 'react-icons/bs';

import logo from "../assets/companyLogo.png";

const Sidebar = ({ isOpen, setIsOpen, hideSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { title: 'Match Analysis', path: '/analytics', icon: <MdOutlineSportsScore size={20} color='white'/> },
        { title: 'Players Statistics', path: '/email', icon: <RiUserSearchLine size={20} color='white'/> },
        { title: 'Team Comparison', path: '/manual-reply', icon: <RiTeamLine size={20} color='white'/> },
        { title: 'Tournament Overview', path: '/account-settings', icon: <GiTrophy size={20} color='white'/> },
        { title: 'Predictive Analysis', path: '/predictive-analysis', icon: <RiBarChartBoxLine size={20} color='white'/> },
        { title: 'ChatBot', path: '/chatbot', icon: <BsChatDots size={20} color='white'/> },
        { title: 'Profile Settings', path: '/profile', icon: <CgProfile size={20} color='white'/> },
        { title: 'Help and Support', path: '/support', icon: <BiInfoCircle size={20} color='white'/> },
        // Add logout as the last navigation item when sidebar is collapsed
        ...(!isOpen ? [{ 
            title: 'Logout', 
            path: '#', 
            icon: <BiLogOut size={20} color='#f87171' />,
            onClick: () => {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                navigate('/login');
            }
        }] : [])
    ];

    const handleLogout = () => {
        // Clear user data from localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        // Redirect to login page
        navigate('/');
    };

    // Get user data from localStorage
    const getUserName = () => {
        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            return userData?.name || 'User';
        } catch (error) {
            return 'User';
        }
    };

    return (
        <div
            className={`${isOpen ? 'w-64' : 'w-20'} duration-300 h-screen bg-neutral-900 text-white fixed left-0 top-0 p-5 pt-8 shadow-lg ${hideSidebar ? 'hidden' : 'block'}`}
        >
            {/* Company Logo */}
            <div className="flex gap-x-4 items-center">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            setIsOpen(!isOpen);
                        }
                    }}
                    style={{ backgroundImage: `url(${logo})` }}
                    className="w-10 h-10 bg-cover bg-center bg-no-repeat duration-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 hover:opacity-80
                    transition-all ease-in-out"
                    aria-label="Toggle sidebar"
                />
                <h3
                    className={`origin-left text-xl font-medium duration-300 ${!isOpen && 'scale-0 opacity-0 hidden'}`}
                >
                    Cricket Analysis
                </h3>
            </div>

            {/* Divider */}
            <div className="my-6 bg-gray-600 h-[1px]"></div>

            {/* Navigation Items */}
            <div className="flex flex-col gap-y-1">
                {navItems.map((item, index) => (
                    item.onClick ? (
                        // For items with onClick handler (like logout in collapsed mode)
                        <button
                            key={index}
                            onClick={item.onClick}
                            className={`flex items-center gap-x-4 cursor-pointer p-3 rounded-lg 
                            text-gray-500 hover:bg-gray-700
                            ${!isOpen && 'justify-center'}
                            transition-all duration-200 group w-full text-left`}
                        >
                            <div className="relative">
                                {item.icon}
                                {!isOpen && (
                                    <span className="absolute left-full ml-2 px-2 py-1 bg-gray-700 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50">
                                        {item.title}
                                    </span>
                                )}
                            </div>
                            {isOpen && (
                                <span className="text-sm font-medium text-gray-300">
                                    {item.title}
                                </span>
                            )}
                        </button>
                    ) : (
                        // Regular navigation links
                        <Link
                            key={index}
                            to={item.path}
                            className={`flex items-center gap-x-4 cursor-pointer p-3 rounded-lg 
                            ${location.pathname === item.path
                                ? 'bg-gray-700 text-white'
                                : 'text-gray-500 hover:bg-gray-700'
                            }
                            ${!isOpen && 'justify-center'}
                            transition-all duration-200 group`}
                        >
                            <div className="relative">
                                {item.icon}
                                {!isOpen && (
                                    <span className="absolute left-full ml-2 px-2 py-1 bg-gray-700 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50">
                                        {item.title}
                                    </span>
                                )}
                            </div>
                            {isOpen && (
                                <span className="text-sm font-medium text-gray-300">
                                    {item.title}
                                </span>
                            )}
                        </Link>
                    )
                ))}
            </div>

            {/* User Profile and Logout Section - Only visible when sidebar is expanded */}
            {isOpen && (
                <div className="absolute bottom-5 left-0 right-0 px-5">
                    <div className="bg-gray-800/50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                            {/* Profile photo and name */}
                            <div className="flex items-center gap-3">
                                <div className="bg-gray-700 p-2 rounded-full">
                                    <BiUser size={20} color='white' />
                                </div>
                                <div className="overflow-hidden">
                                    <h4 className="text-sm font-medium text-gray-300 truncate">
                                        {getUserName()}
                                    </h4>
                                </div>
                            </div>
                            
                            {/* Logout button - only visible when sidebar is expanded */}
                            <button 
                                onClick={handleLogout}
                                className="p-2 rounded-full bg-gray-700 hover:bg-red-500/20 transition-colors"
                                aria-label="Logout"
                                title="Logout"
                            >
                                <BiLogOut size={20} color='#f87171' />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default Sidebar;



