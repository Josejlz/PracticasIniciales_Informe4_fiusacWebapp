import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Load student from localStorage on first render
  const [student, setStudent] = useState(() => {
    const saved = localStorage.getItem('student');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (studentData) => {
    setStudent(studentData);
    localStorage.setItem('student', JSON.stringify(studentData)); // persist it
  };

  const logout = () => {
    setStudent(null);
    localStorage.removeItem('student'); // clear it
  };

  return (
    <AuthContext.Provider value={{ student, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}