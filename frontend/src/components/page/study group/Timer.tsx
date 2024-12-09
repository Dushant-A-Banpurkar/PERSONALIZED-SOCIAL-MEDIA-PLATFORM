import React, { useEffect, useState } from "react";

interface TimerProps {
  timeLimit: number; // Time limit in seconds
  onTimerEnd?: () => void; // Callback for when the timer ends
}

const Timer: React.FC<TimerProps> = ({ timeLimit, onTimerEnd }) => {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    // Countdown timer logic
    if (timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval); // Cleanup interval on component unmount
    } else if (timeRemaining === 0 && onTimerEnd) {
      onTimerEnd(); // Notify when the timer ends
    }
  }, [timeRemaining, onTimerEnd]);

  useEffect(() => {
    // Current session time updater
    const timeUpdater = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString()); // Updates every second
    }, 1000);

    return () => clearInterval(timeUpdater); // Cleanup interval on component unmount
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="timer bg-gray-100 p-4 rounded-md shadow-md">
      {/* Time Remaining */}
      <p className="text-lg font-medium mb-2">
        <span className="text-blue-600">Time Remaining:</span> {formatTime(timeRemaining)}
      </p>
      {/* Current Time */}
      <p className="text-lg font-medium">
        <span className="text-green-600">Current Session Time:</span> {currentTime}
      </p>
    </div>
  );
};

export default Timer;
