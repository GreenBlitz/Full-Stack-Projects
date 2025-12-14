// בס"ד
import type { FC } from "react";
import { fetchData, useFetch } from "../utils/Fetches";
import type { Project } from "../../../types/project";

interface ProjcetsProps {}

export const Projects: FC<ProjcetsProps> = () => {
  const [currentProjects, setNewProjects] = useFetch<Project[]>("projects");

  return <></>;
};
