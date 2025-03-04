import { useState, useEffect, useRef } from 'react';
import { Key, LogOut, Moon, Sun, Camera } from 'lucide-react';
type Scores = {
  Atigala: number;
  Parakrama: number;
  Vijaya: number;
  Gemunu: number;
};
function App() {
  const maxScore = 1000;
  const [scores, setScores] = useState<Scores>({ Atigala: 800, Parakrama: 650, Vijaya: 900, Gemunu: 850 });
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [showAdminPopup, setShowAdminPopup] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [events, setEvents] = useState<string[]>([]);
  const [newEvent, setNewEvent] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState<{text: string, timestamp: string}[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load events from localStorage
  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem('events') || '[]');
    if (savedEvents.length === 0) {
      const defaultEvents = [
        "Football Match - 10:00 AM",
        "Relay Race - 12:00 PM",
        "High Jump - 2:00 PM"
      ];
      setEvents(defaultEvents);
      localStorage.setItem('events', JSON.stringify(defaultEvents));
    } else {
      setEvents(savedEvents);
    }
  }, []);

  // Save events to localStorage when they change
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  // Toggle dark theme
  useEffect(() => {
    document.body.classList.toggle('dark', isDarkTheme);
  }, [isDarkTheme]);

  // Update score function
  const updateScore = (house: keyof Scores, value: string) => {
    const numValue = parseInt(value);
    const validValue = Math.max(0, Math.min(maxScore, numValue || 0));
    
    setScores(prevScores => ({
      ...prevScores,
      [house]: validValue
    }));
  };

  // Admin login function
  const adminLogin = () => {
    if (adminUsername === "admin" && adminPassword === "password") {
      setIsAdminLoggedIn(true);
      setShowAdminPopup(false);
      setAdminUsername('');
      setAdminPassword('');
      alert('Login successful!');
    } else {
      alert('Invalid credentials!');
    }
  };

  // Admin logout function
  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    alert('Logged out successfully!');
  };

  // Event management functions
  const addEvent = () => {
    if (newEvent.trim()) {
      setEvents([...events, newEvent.trim()]);
      setNewEvent('');
    }
  };

  const updateEvent = (index: number, value: string) => {
    if (value.trim()) {
      const updatedEvents = [...events];
      updatedEvents[index] = value.trim();
      setEvents(updatedEvents);
    }
  };

  const deleteEvent = (index: number) => {
    const updatedEvents = events.filter((_, i) => i !== index);
    setEvents(updatedEvents);
  };

  // Comment functions
  const handleGoogleLogin = () => {
    setIsUserLoggedIn(true);
    alert('Logged in with Google successfully!');
  };

  const postComment = () => {
    if (!isUserLoggedIn) {
      alert("Please login with Google to comment.");
      return;
    }
    
    if (commentInput.trim()) {
      setComments([
        ...comments, 
        {
          text: commentInput.trim(),
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
      setCommentInput('');
    }
  };

  // Generate shareable image
  const generateShareableImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set background color
    ctx.fillStyle = '#1a1a1a'; // Dark background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add title
    ctx.font = 'bold 72px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('INTER-HOUSE SPORTS MEET 2025', canvas.width / 2, 120);

    // Add subtitle
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = '#cccccc';
    ctx.fillText('LEADERBOARD', canvas.width / 2, 200);

    // Draw scores
    const houseColors = {
      Atigala: '#FFD700', // Gold
      Parakrama: '#00FF00', // Green
      Vijaya: '#FF0000', // Red
      Gemunu: '#0000FF' // Blue
    };

    const houseNames = {
      Atigala: 'ATIGALA HOUSE',
      Parakrama: 'PARAKRAMA HOUSE',
      Vijaya: 'VIJAYA HOUSE',
      Gemunu: 'GEMUNU HOUSE'
    };

    const sortedHouses = (Object.keys(scores) as (keyof Scores)[]).sort((a, b) => scores[b] - scores[a]);

    let yOffset = 300;
    sortedHouses.forEach((house, index) => {
      // Draw rank
      ctx.font = 'bold 48px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText(`${index + 1}`, 150, yOffset);

      // Draw house name
      ctx.font = 'bold 48px Arial';
      ctx.fillStyle = houseColors[house as keyof typeof houseColors];
      ctx.fillText(houseNames[house as keyof typeof houseNames], 300, yOffset);

      // Draw score
      ctx.font = 'bold 48px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'right';
      ctx.fillText(scores[house].toString(), canvas.width - 150, yOffset);

      yOffset += 100;
    });

    // Add footer
    ctx.font = '36px Arial';
    ctx.fillStyle = '#cccccc';
    ctx.textAlign = 'center';
    ctx.fillText('#SCCPA & #SCCMU', canvas.width / 2, canvas.height - 50);

    // Add date
    ctx.font = '24px Arial';
    ctx.fillStyle = '#cccccc';
    ctx.textAlign = 'center';
    ctx.fillText('4TH MARCH 2025', canvas.width / 2, canvas.height - 100);

    // Convert canvas to image and download
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'sports-meet-leaderboard.png';
    link.click();
  };

  // Sort houses by score for leaderboard
  const sortedHouses = (Object.keys(scores) as (keyof Scores)[]).sort((a, b) => scores[b] - scores[a]);

  return (
    <div className={`min-h-screen ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Header */}
      <header className={`p-4 flex flex-col md:flex-row items-center justify-between ${isDarkTheme ? 'bg-gray-800' : 'bg-blue-600 text-white'}`}>
        <div className="flex items-center mb-4 md:mb-0">
          <img 
            src="https://samithe.yolasite.com/resources/logo.gif" 
            alt="Logo" 
            className="h-16 w-16 mr-4 rounded-full"
          />
          <h1 className="text-2xl md:text-3xl font-bold">Sports Meet Live Scores</h1>
        </div>
        <div className="flex items-center">
          <button 
            onClick={() => setShowAdminPopup(true)} 
            className={`p-2 rounded-full mr-2 ${isDarkTheme ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-400'}`}
            aria-label="Admin Login"
          >
            {isAdminLoggedIn ? <LogOut size={24} /> : <Key size={24} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scoreboard */}
          <div className={`p-6 rounded-lg shadow-lg ${isDarkTheme ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-2xl font-bold mb-4">House Scores</h2>
            <div className="space-y-6">
              {Object.entries(scores).map(([house, score]) => (
                <div key={house} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{house}</span>
                    <span>{score} / {maxScore}</span>
                  </div>
                  <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full flex items-center justify-end pr-2 text-white font-bold`}
                      style={{
                        width: `${(score / maxScore) * 100}%`,
                        background: house === 'Atigala' ? 'gold' : 
                                    house === 'Parakrama' ? 'green' : 
                                    house === 'Vijaya' ? 'red' : 'blue'
                      }}
                    >
                      {score}
                    </div>
                  </div>
                  {isAdminLoggedIn && (
                    <input 
                      type="number" 
                      value={score}
                      onChange={(e) => updateScore(house as keyof Scores, e.target.value)}
                      className={`w-full p-2 border rounded ${isDarkTheme ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                      min="0"
                      max={maxScore}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Event Schedule */}
          <div className={`p-6 rounded-lg shadow-lg ${isDarkTheme ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-2xl font-bold mb-4">Today's Events</h2>
            <ul className="space-y-3">
              {events.map((event, index) => (
                <li key={index} className="flex items-center">
                  {isAdminLoggedIn ? (
                    <>
                      <input 
                        type="text" 
                        value={event}
                        onChange={(e) => updateEvent(index, e.target.value)}
                        className={`flex-grow p-2 border rounded mr-2 ${isDarkTheme ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                      />
                      <button 
                        onClick={() => deleteEvent(index)}
                        className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <span className={`py-2 px-4 rounded-lg ${isDarkTheme ? 'bg-gray-700' : 'bg-blue-100'} w-full block`}>
                      {event}
                    </span>
                  )}
                </li>
              ))}
              {isAdminLoggedIn && (
                <li className="flex items-center mt-4">
                  <input 
                    type="text" 
                    value={newEvent}
                    onChange={(e) => setNewEvent(e.target.value)}
                    placeholder="Add new event"
                    className={`flex-grow p-2 border rounded mr-2 ${isDarkTheme ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                  <button 
                    onClick={addEvent}
                    className={`p-2 rounded ${isDarkTheme ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                  >
                    Add
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Leaderboard */}
          <div className={`p-6 rounded-lg shadow-lg ${isDarkTheme ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
            <ol className="space-y-3">
            {sortedHouses.map((house, index) => (
                <li key={house} className={`flex justify-between p-3 rounded-lg ${
                  index === 0 ? 'bg-yellow-100 text-yellow-800' : 
                  index === 1 ? 'bg-gray-100 text-gray-800' : 
                  index === 2 ? 'bg-amber-100 text-amber-800' : 
                  'bg-blue-50 text-blue-800'
                } ${isDarkTheme ? 'opacity-80' : ''}`}>
                  <span className="font-bold">{index + 1}. {house}</span>
                  <span className="font-bold">{scores[house]}</span>
                </li>
              ))}
            </ol>
            <button 
              onClick={generateShareableImage}
              className={`mt-6 w-full p-3 rounded-lg flex items-center justify-center ${
                isDarkTheme ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              } text-white font-bold`}
            >
              <Camera size={20} className="mr-2" />
              Share Scores as Image
            </button>
          </div>

          {/* Comment Section */}
          <div className={`p-6 rounded-lg shadow-lg ${isDarkTheme ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-2xl font-bold mb-4">Comments</h2>
            <div className={`h-64 overflow-y-auto mb-4 p-4 rounded-lg ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-100'}`}>
              {comments.length === 0 ? (
                <div className="flex items-start mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${isDarkTheme ? 'bg-gray-600' : 'bg-blue-500'} text-white`}>
                    U
                  </div>
                  <div className={`flex-1 p-3 rounded-lg ${isDarkTheme ? 'bg-gray-600' : 'bg-white'}`}>
                    <p>No comments yet. Be the first to comment!</p>
                    <div className="text-xs mt-2 text-gray-500">Just now</div>
                  </div>
                </div>
              ) : (
                comments.map((comment, index) => (
                  <div key={index} className="flex items-start mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${isDarkTheme ? 'bg-gray-600' : 'bg-blue-500'} text-white`}>
                      U
                    </div>
                    <div className={`flex-1 p-3 rounded-lg ${isDarkTheme ? 'bg-gray-600' : 'bg-white'}`}>
                      <p>{comment.text}</p>
                      <div className="text-xs mt-2 text-gray-500">{comment.timestamp}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {!isUserLoggedIn ? (
              <button 
                onClick={handleGoogleLogin}
                className={`w-full p-3 rounded-lg ${isDarkTheme ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white font-bold`}
              >
                Login with Google to Comment
              </button>
            ) : (
              <div className="flex">
                <input 
                  type="text" 
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Add a comment..."
                  className={`flex-grow p-3 border rounded-l-lg ${isDarkTheme ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                />
                <button 
                  onClick={postComment}
                  className={`p-3 rounded-r-lg ${isDarkTheme ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-bold`}
                >
                  Post
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Theme Toggle and Logout Button */}
        <div className="fixed bottom-6 right-6 flex flex-col space-y-2">
          <button 
            onClick={() => setIsDarkTheme(!isDarkTheme)}
            className={`p-3 rounded-full shadow-lg ${isDarkTheme ? 'bg-yellow-500' : 'bg-gray-800 text-white'}`}
            aria-label="Toggle Theme"
          >
            {isDarkTheme ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          {isAdminLoggedIn && (
            <button 
              onClick={handleLogout}
              className="p-3 rounded-full shadow-lg bg-red-500 text-white"
              aria-label="Logout"
            >
              <LogOut size={24} />
            </button>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className={`p-6 mt-8 ${isDarkTheme ? 'bg-gray-800' : 'bg-blue-600 text-white'}`}>
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="mb-4 md:mb-0">Powered by R/Sivali Central College</p>
            <div className="flex space-x-4">
              <a href="#" className="flex items-center hover:underline">
                 Facebook
              </a>
              <a href="#" className="flex items-center hover:underline">
                 Twitter
              </a>
              <a href="#" className="flex items-center hover:underline">
                 Instagram
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Admin Popup */}
      {showAdminPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg shadow-lg max-w-md w-full ${isDarkTheme ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
            <input 
              type="text" 
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
              placeholder="Username"
              className={`w-full p-3 border rounded mb-3 ${isDarkTheme ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
            />
            <input 
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Password"
              className={`w-full p-3 border rounded mb-4 ${isDarkTheme ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
            />
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowAdminPopup(false)}
                className={`p-3 rounded ${isDarkTheme ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Close
              </button>
              <button 
                onClick={adminLogin}
                className={`p-3 rounded ${isDarkTheme ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Canvas for Image Generation */}
      <canvas ref={canvasRef} width="1200" height="800" className="hidden"></canvas>
    </div>
  );
}

export default App;