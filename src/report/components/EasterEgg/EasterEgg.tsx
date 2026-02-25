import { teamMates } from "./teamMates";

type EasterEggProps = {};

const EasterEgg = (props: EasterEggProps) => {
  const currentTeamMate =
    teamMates[Math.floor(Math.random() * teamMates.length)];

  const title = `עובד/ת החודש היא/הוא: ${currentTeamMate.name}`;

  return (
    <div>
      <h1>{title}</h1>
    </div>
  );
};

export default EasterEgg;
