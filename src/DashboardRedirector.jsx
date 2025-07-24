import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import toast from 'react-hot-toast';
import { AuthContext } from './Context/AuthProvider';
import useAxiosSecure from './hooks/useAxiosSecure';

const DashboardRedirector = () => {
    const { user, loading, logOut } = useContext(AuthContext);
    const [userRole, setUserRole] = React.useState(null);
    const [isRoleLoading, setIsRoleLoading] = React.useState(true);
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserRole = async () => {
            if (user && user.email) {
                try {
                    setIsRoleLoading(true);
                    const { data } = await axiosSecure.get(`/user/role/${user.email}`);
                    setUserRole(data.role);
                } catch (error) {
                    console.error("Error fetching user role for redirection:", error);
                    toast.error("Failed to load user role for dashboard. Please try again.");
                    setUserRole(null);
                    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                        logOut();
                        navigate('/login');
                    }
                } finally {
                    setIsRoleLoading(false);
                }
            } else if (!loading) {
                setUserRole(null);
                setIsRoleLoading(false);
                navigate('/login'); // Redirect if not authenticated
            }
        };

        fetchUserRole();
    }, [user, loading, axiosSecure, logOut, navigate]);

    useEffect(() => {
        if (!isRoleLoading && userRole) {
            // Redirect based on role
            if (userRole === 'admin') {
                navigate('/dashboard/admin-home', { replace: true });
            } else if (userRole === 'seller') {
                navigate('/dashboard/seller-home', { replace: true });
            } else if (userRole === 'customer') {
                navigate('/dashboard/customer-home', { replace: true });
            } else {
                toast.error("Unknown user role. Redirecting to home.");
                navigate('/', { replace: true }); // Fallback to home page
            }
        }
    }, [isRoleLoading, userRole, navigate]);

    if (loading || isRoleLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
                <p className="ml-2">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center text-gray-600">
            <p>Redirecting to your dashboard...</p>
        </div>
    );
};

export default DashboardRedirector;