import { HashRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <HashRouter>
        <Applayout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            <Route path="/jobs" element={<ProtectedRoute><Joblisting /></ProtectedRoute>} />
            <Route path="/job/:id" element={<ProtectedRoute><JobPage /></ProtectedRoute>} />
            <Route path="/post-job" element={<ProtectedRoute><PostJob /></ProtectedRoute>} />
            <Route path="/save-job" element={<ProtectedRoute><SaveJob /></ProtectedRoute>} />
            <Route path="/my-jobs" element={<ProtectedRoute><MyJob /></ProtectedRoute>} />
          </Routes>
        </Applayout>
      </HashRouter>
    </ThemeProvider>
  )
}
export default App;