import Fondo from "./assets/fondo.png";
import SearchIcon from "./assets/Search.svg";
import Chield from "./assets/Chield_alt.svg";
import Nesting from "./assets/Nesting.svg";
import Star from "./assets/Star.svg";

import { useState, useEffect, Suspense } from "react";
import { formatDistanceToNow } from "date-fns";

function App() {
  const [user, setUser] = useState("github");
  const [userData, setUserData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [allProjects, setAllProjects] = useState(false);
  const [inputInfo, setInputInfo] = useState("");
  const [userNotFound, setUserNotFound] = useState(false);

  useEffect(() => {
    const fetchUserAndProjects = async () => {
      try {
        const userResponse = await fetch(
          `https://api.github.com/users/${user}`
        );
        if (!userResponse.ok) {
          throw new Error("Usuario no encontrado");
        }
        const userData = await userResponse.json();
        setUserData(userData);
        setUserNotFound(false);

        const projectsResponse = await fetch(
          `https://api.github.com/users/${user}/repos`
        );
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);
      } catch (error) {
        console.error("Error al obtener los datos:", error.message);
        setUserNotFound(true);
      }
    };

    fetchUserAndProjects();
  }, [user]);

  const timeAgo = (updatedAt) => {
    const updatedDate = new Date(updatedAt);
    return `updated ${formatDistanceToNow(updatedDate)} ago`;
  };

  const handleChangeInput = (e) => {
    setInputInfo(e.target.value);
  };

  const handleChangeUser = () => {
    setUser(inputInfo);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleChangeUser();
    }
  };

  return (
    <div className="h-full w-full">
      <div className="h-full w-full">
        <img src={Fondo} alt="" />
        <div className="absolute w-full top-3 sm:top-10 flex justify-center items-center">
          <button
            className="bg-slate-800 pl-3 h-10 sm:h-16 py-3 rounded-l-lg"
            onClick={handleChangeUser}
          >
            <img src={SearchIcon} alt="" className=" opacity-35" />
          </button>
          <input
            type="text"
            className="w-3/6 bg-slate-800 h-10 sm:h-16 px-4 items-center rounded-r-lg text-white placeholder:opacity-35 focus:outline-none"
            placeholder="username"
            value={inputInfo}
            onChange={handleChangeInput}
            onKeyDown={handleKeyDown}
          />
        </div>
        {userNotFound && (
          <label className="text-red-500 block mt-2 text-center">
            Usuario no encontrado
          </label>
        )}
      </div>
      <div className=" w-full sm:w-2/3 sm:ml-48">
        {userData && (
          <div className="flex w-full sm:items-center justify-start sm:ml-0 mt-2 text-lg">
            <div className="bg-black h-20 rounded-xl ml-5 sm:ml-0 sm:h-32">
              <img
                src={userData.avatar_url}
                className="w-full h-full rounded-xl object-contain sm:object-cover"
                alt=""
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-10 ml-8">
              <div className="bg-slate-900 text-sm sm:text-base w-48 sm:w-1/3 h-14 flex items-center gap-6 rounded-xl px-8 py-2">
                <h2 className="text-white opacity-40">Followers</h2>
                <div className="h-2/3 bg-white w-0.5 opacity-30 rounded-xl"></div>
                <h2 className="text-white">{userData.followers}</h2>
              </div>
              <div className="bg-slate-900 w-48 text-sm sm:text-base sm:w-1/3 h-14 flex items-center gap-6 rounded-xl px-8 py-2">
                <h2 className="text-white opacity-40">Following</h2>
                <div className="h-2/3 bg-white w-0.5 opacity-30 rounded-xl"></div>
                <h2 className="text-white">{userData.following}</h2>
              </div>
              <div className="bg-slate-900 w-48 h-14 text-sm sm:text-base sm:w-full flex items-center gap-6 rounded-lg px-8 py-2">
                <h2 className="text-white opacity-40">Location</h2>
                <div className="h-2/3 bg-white w-0.5 opacity-30 rounded-lg"></div>
                <h2 className="text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
                  {userData.location}
                </h2>
              </div>
            </div>
          </div>
        )}
        <div className="text-white ml-5 sm:ml-0 mt-8">
          {userData && (
            <>
              <h1 className="text-4xl">{userData.name}</h1>
              <h2 className=" opacity-40 mt-4">{userData.bio}</h2>
            </>
          )}
        </div>
      </div>
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-10 mx-10 sm:mx-40">
          {projects.length > 0
            ? projects
                .slice(0, allProjects ? projects.length : 4)
                .map((project) => (
                  <a href={project.html_url } target="_blank">
                  <div
                    key={project.id}
                    className="bg-gradient-to-br from-slate-900 to-indigo-950 p-4 w-full rounded-xl flex flex-col gap-4 text-gray-400"
                    >
                    <h2 className="text-lg font-semibold">{project.name}</h2>
                    <p className="text-gray-400 opacity-90">
                      {project.description}
                    </p>
                    <div className="flex gap-4">
                      {project.license && (
                        <div className="flex items-center">
                          <img src={Chield} alt="" />
                          <h2>
                            {project.license ? project.license.spdx_id : ""}
                          </h2>
                        </div>
                      )}
                      <div className="flex items-center">
                        <img src={Nesting} alt="" />
                        <h2>{project.forks}</h2>
                      </div>
                      <div className="flex items-center">
                        <img src={Star} alt="" />
                        <h2>{project.stargazers_count}</h2>
                      </div>
                      <div>{timeAgo(project.updated_at)}</div>
                    </div>
                  </div>
                      </a>
                ))
            : ""}
        </div>
      </div>

      <div className="w-full flex items-center justify-center mt-10 mb-10 text-slate-300">
        {!allProjects && (
          <button onClick={() => setAllProjects(true)}>
            View all projects
          </button>
        )}
        {allProjects && (
          <button onClick={() => setAllProjects(false)}>
            See fewer projects
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
