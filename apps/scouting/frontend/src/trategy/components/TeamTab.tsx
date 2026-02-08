// בס"ד
import type { Movement } from "@repo/scouting_types";
import type { FC } from "react";

interface TeamTabProps {
    teamNumber: string;
    team2Number: string;
}
export const TeamTab: FC<TeamTabProps> = ({ teamNumber, team2Number }) => {
//     async function fetchData(teamNumber: number, team2Number: number) {
//         const response = await fetch(`/api/v1/teams/${teamNumber}/movement`);
//         const data = await response.json() as Movement[];
//         return data;
//     }
//     const [data, setData] = useState<Movement[]>([]);
//     useEffect(() => {
//         fetchData(teamNumber, team2Number).then((data) => {
//             setData(data);
//         });
//     }, [teamNumber, team2Number]);
     return <div>TeamTab</div>;
}