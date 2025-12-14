// בס"ד
import type { FC } from "react";
import { fetchData, useFetch } from "../utils/Fetches";
import type { Project } from "../../../types/project";
import type { Unit } from "../../../types/units";

interface ProjcetsProps {}

const emptyProjectsLength = 0;

export const Projects: FC<ProjcetsProps> = () => {
  const [currentProjects, setNewProjects] = useFetch<{ projects: Project[] }>(
    "projects"
  );

  console.log(currentProjects);

  const formatUnit = (unit: Unit): string => {
    // Simplified display logic for brevity. A full implementation would check all nested types.
    if (typeof unit.type === "string") {
      return `${unit.amount} ${unit.type}`;
    }
    return `${unit.amount} units`; // Fallback for complex structural types
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Current Projects Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProjects?.projects.map((project) => (
          <div
            key={project.name}
            className="bg-white shadow-lg rounded-xl p-6 transform hover:scale-105 transition duration-300 border border-gray-200"
          >
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600 border-b pb-2">
              {project.name}
            </h2>

            <p className="text-gray-600 mb-4">
              Total Products: **{project.products.length}**
            </p>

            <h3 className="text-lg font-medium mb-3 text-gray-700">
              Product List:
            </h3>

            <ul className="space-y-3">
              {project.products.map((product) => (
                <li
                  key={product.id}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm"
                >
                  <span className="font-medium text-gray-800">
                    {product.type}
                  </span>
                  <span className="text-sm font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                    {formatUnit(product.stock.unit)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {!currentProjects ||
        (currentProjects.projects.length === emptyProjectsLength && (
          <p className="text-gray-500 italic mt-8">No projects found.</p>
        ))}
    </div>
  );
};
