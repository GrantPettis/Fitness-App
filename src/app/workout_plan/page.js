import { useState, useEffect } from "react";

// Mock data for workout plans
const mockWorkoutPlans = [
    { title: "Muscle Building Plan", level: "Beginner", goal: "Muscle Building", duration: "4 weeks" },
    { title: "Fat Loss Plan", level: "Intermediate", goal: "Fat Loss", duration: "8 weeks" },
    { title: "Strength Training Plan", level: "Advanced", goal: "Strength", duration: "6 weeks" },
    // Add more plans as needed
];

export default function WorkoutPlanPage() {
    const [goal, setGoal] = useState("all");
    const [level, setLevel] = useState("all");
    const [duration, setDuration] = useState("all");
    const [plans, setPlans] = useState([]);

    // Simulating fetching data from backend
    useEffect(() => {
        setPlans(mockWorkoutPlans);
    }, []);

    const filterPlans = () => {
        let filteredPlans = mockWorkoutPlans.filter((plan) => {
            let goalMatch = goal === "all" || plan.goal === goal;
            let levelMatch = level === "all" || plan.level === level;
            let durationMatch = duration === "all" || plan.duration === duration;
            return goalMatch && levelMatch && durationMatch;
        });
        setPlans(filteredPlans);
    };

    return (
        <div>
            <h1>Workout Plan Page</h1>

            {/* Filter section */}
            <div id="filter-container">
                <div>
                    <label htmlFor="goal">Goal:</label>
                    <select id="goal" value={goal} onChange={(e) => setGoal(e.target.value)}>
                        <option value="all">All Goals</option>
                        <option value="Muscle Building">Muscle Building</option>
                        <option value="Fat Loss">Fat Loss</option>
                        <option value="Strength">Strength</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="level">Level:</label>
                    <select id="level" value={level} onChange={(e) => setLevel(e.target.value)}>
                        <option value="all">All Levels</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="duration">Duration:</label>
                    <select id="duration" value={duration} onChange={(e) => setDuration(e.target.value)}>
                        <option value="all">All Durations</option>
                        <option value="4 weeks">4 weeks</option>
                        <option value="8 weeks">8 weeks</option>
                        <option value="6 weeks">6 weeks</option>
                    </select>
                </div>
                <button id="filter-button" onClick={filterPlans}>Filter Plans</button>
            </div>

            {/* Plans section */}
            <div id="plans-container">
                {plans.map((plan, index) => (
                    <div className="plan-card" key={index}>
                        <h3 className="plan-title">{plan.title}</h3>
                        <p className="plan-details">Level: {plan.level}</p>
                        <p className="plan-details">Goal: {plan.goal}</p>
                        <p className="plan-duration">Duration: {plan.duration}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
