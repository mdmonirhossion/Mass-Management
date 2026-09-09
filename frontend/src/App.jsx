import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import DailyMeal from './pages/DailyMeal';
import Bazar from './pages/Bazar';
import MonthlyBills from './pages/MonthlyBills';
import Settlement from './pages/Settlement';
import Members from './pages/Members';
import LoginPage from './pages/LoginPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currentMonth, setCurrentMonth] = useState('September 2026');

  // Dark Mode Theme State
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('mess_theme') === 'dark';
  });

  // User Auth & Session State
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mess_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('mess_theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('mess_theme', 'light');
    }
  }, [darkMode]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('mess_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('mess_user');
  };

  const getPageDetails = () => {
    switch (currentPage) {
      case 'dashboard':
        return { title: 'Dashboard', subtitle: 'Overview of Mess Expenses, Meals & Balances' };
      case 'daily-meal':
        return { title: 'Daily Meal', subtitle: 'Manage and update daily meal entries' };
      case 'bazar':
        return { title: 'Bazar', subtitle: 'Manage daily bazar expenses and purchases' };
      case 'monthly-bills':
        return { title: 'Monthly Bills', subtitle: 'Manage fixed monthly expenses per person' };
      case 'settlement':
        return { title: 'Settlement', subtitle: 'Review pay and receive balances per member' };
      case 'members':
        return { title: 'Members & Access', subtitle: 'Manage mess members, roles and access permissions' };
      default:
        return { title: 'Dashboard', subtitle: 'Mess Management System' };
    }
  };

  const { title, subtitle } = getPageDetails();

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        user={user}
        onLogout={handleLogout}
      />

      <main className="main-content">
        <Topbar
          title={title}
          subtitle={subtitle}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          user={user}
          onLogout={handleLogout}
        />

        {currentPage === 'dashboard' && (
          <Dashboard currentMonth={currentMonth} setCurrentPage={setCurrentPage} />
        )}
        {currentPage === 'daily-meal' && <DailyMeal currentMonth={currentMonth} user={user} />}
        {currentPage === 'bazar' && <Bazar currentMonth={currentMonth} user={user} />}
        {currentPage === 'monthly-bills' && <MonthlyBills currentMonth={currentMonth} user={user} />}
        {currentPage === 'settlement' && <Settlement currentMonth={currentMonth} />}
        {currentPage === 'members' && <Members user={user} />}
      </main>
    </div>
  );
}
