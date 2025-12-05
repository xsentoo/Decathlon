import React from "react";
import "./Leaderboard.css";

function Leaderboard({ leaderboardData = [] }) {
  if (!leaderboardData || leaderboardData.length === 0) {
    return <p>Aucun athlète dans le classement pour l'instant.</p>;
  }

  return (
    <div className="leaderboard-wrapper">
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Pseudo</th>
            <th>Points</th>
            <th>Badge</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((user, index) => (
            <tr key={user.pseudo ?? index}>
              <td>{index + 1}</td>
              <td>{user.pseudo}</td>
              <td>{user.point}</td>
              <td>{user.badge}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
