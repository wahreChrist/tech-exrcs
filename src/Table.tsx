import React, { useEffect, useState } from "react";
import Update from "./Update";

interface Repo {
    id: number;
    owner: string;
    proj_name: string;
    url: string;
    stars: number;
    forks: number;
    issues: number;
    timestamp: string;
}

export default function Table(): JSX.Element {
    const [repo, setRepo] = useState<string>("");
    const [apiError, setApiError] = useState<boolean>(false);
    const [edit, setEdit] = useState<number>(0);
    const [repos, setRepos] = useState<Repo[]>([]);
    const [data1, setData1] = useState<string>("");
    const [data2, setData2] = useState<string>("");

    useEffect(() => {
        fetchRepos();
    }, []);

    const fetchRepos = () => {
        fetch(`/repos`)
            .then((res) => res.json())
            .then((data) => {
                // console.log("repos", data);
                setRepos(data);
            })
            .catch((err) =>
                console.log("error in retrieving repos for this user", err)
            );
    };

    const addRepo = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            const res = await fetch(
                `https://api.github.com/repos/${repo.toLowerCase()}`
            );
            const data = await res.json();
            console.log(data);
            if (data.message === "Not Found") {
                setApiError(true);
            } else {
                console.log(data);
                fetch(`/add-repo`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        owner: data.owner.login,
                        projName: data.name,
                        url: data.html_url,
                        stars: data.stargazers_count,
                        forks: data.forks_count,
                        issues: data.open_issues,
                        timestamp: data.created_at,
                    }),
                })
                    .then((res) => res.json())
                    .then((response) => {
                        console.log("response from a database", response);
                        setRepos((repos) => [...repos, response]);
                    });
            }
        } catch (error) {
            console.log("error in adding repo", error);
        }
    };

    const deleteRepo = async (
        e: React.MouseEvent<HTMLButtonElement>,
        id: number
    ) => {
        e.preventDefault();

        try {
            let resp = await fetch(`/delete-repo/${id}`, { method: "DELETE" });
            let notification = await resp.json();
            notification.success
                ? setRepos(repos.filter((repo) => repo.id !== id))
                : console.log("no repos with such id");
        } catch (error) {
            console.log("error in deleting row", error);
        }
    };

    const toggleUpdate = (
        e: React.MouseEvent<HTMLButtonElement>,
        id: number
    ) => {
        e.preventDefault();
        setEdit(id);
    };

    const updateRepo = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const raw = await fetch(`/update-repo`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ newOwner: data1, newName: data2, id: edit }),
        });
        const resp = await raw.json();
        // console.log("response from db:", resp);
        if (resp.success) {
            fetchRepos();
            setEdit(0);
        } else {
            console.log("error in updating db");
            setEdit(0);
        }
    };

    return (
        <div>
            <section className="text-gray-600 body-font">
                <div className="container px-5 py-24 mx-auto">
                    <div className="flex flex-wrap w-full flex-col items-center text-center">
                        <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">
                            Catharsis Manufacture Symposion
                        </h1>
                        <img
                            src="https://thumbs.dreamstime.com/b/letter-v-orange-red-rectangles-business-logo-placeholder-name-company-name-geometric-vector-logo-design-elements-169170579.jpg"
                            alt="logo"
                            className="w-[200px]"
                        />
                    </div>

                    <div className="flex lg:w-2/3 w-full sm:flex-row flex-col mx-auto px-8 sm:space-x-4 sm:space-y-0 space-y-4 sm:px-0 items-end mb-4">
                        <div className="relative flex-grow w-full ">
                            <input
                                type="text"
                                id="repository"
                                name="repository"
                                placeholder="Provide GitHub user/repository (e.g. `twbs/bootstrap`)"
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    setRepo(e.target.value);
                                    setApiError(false);
                                }}
                                className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                            ></input>
                        </div>
                        <button
                            className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                            onClick={addRepo}
                        >
                            Add
                        </button>
                    </div>
                    {apiError && (
                        <h3 className="font-bold mb-4 text-xl">
                            There is no GitHub repository with such user/name
                        </h3>
                    )}
                    <table className="border-collapsed table-auto border border-slate-500 mx-auto">
                        <thead>
                            <tr>
                                <th className="border border-slate-600 p-2 bg-slate-200">
                                    Project owner
                                </th>
                                <th className="border border-slate-600 p-2 bg-slate-200">
                                    Project name
                                </th>
                                <th className="border border-slate-600 p-2 bg-slate-200">
                                    Project URL
                                </th>
                                <th className="border border-slate-600 p-2 bg-slate-200">
                                    Count of stars
                                </th>
                                <th className="border border-slate-600 p-2 bg-slate-200">
                                    Count of forks
                                </th>
                                <th className="border border-slate-600 p-2 bg-slate-200">
                                    Count of issues
                                </th>
                                <th className="border border-slate-600 p-2 bg-slate-200">
                                    Created
                                </th>
                                <th className="border border-slate-600 p-2 bg-slate-200">
                                    Update/Delete
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {repos.length &&
                                repos.map((row, index) => (
                                    <tr key={index}>
                                        <td className="border border-slate-700 p-1.5 text-sm">
                                            {edit === row.id ? (
                                                <Update property={setData1} />
                                            ) : (
                                                row.owner
                                            )}
                                        </td>
                                        <td className="border border-slate-700 p-1.5 text-sm">
                                            {edit === row.id ? (
                                                <Update property={setData2} />
                                            ) : (
                                                row.proj_name
                                            )}
                                        </td>
                                        <td className="border border-slate-700 p-1.5 text-sm">
                                            {row.url}
                                        </td>
                                        <td className="border border-slate-700 p-1.5 text-sm">
                                            {row.stars}
                                        </td>
                                        <td className="border border-slate-700 p-1.5 text-sm">
                                            {row.forks}
                                        </td>
                                        <td className="border border-slate-700 p-1.5 text-sm">
                                            {row.issues}
                                        </td>
                                        <td className="border border-slate-700 p-1.5 text-sm">
                                            {row.timestamp}
                                        </td>

                                        <td className="p-1.5 border border-slate-700">
                                            <div className="flex">
                                                <button
                                                    onClick={
                                                        edit === row.id
                                                            ? updateRepo
                                                            : (e) =>
                                                                  toggleUpdate(
                                                                      e,
                                                                      row.id
                                                                  )
                                                    }
                                                    className="flex justify-self-center mx-auto text-white bg-indigo-500 border-0 py-1.5 px-4 focus:outline-none hover:bg-indigo-600 rounded-l text-xs"
                                                >
                                                    {edit === row.id
                                                        ? "submit"
                                                        : "update"}
                                                </button>
                                                <button
                                                    onClick={(
                                                        e: React.MouseEvent<
                                                            HTMLButtonElement,
                                                            MouseEvent
                                                        >
                                                    ) => deleteRepo(e, row.id)}
                                                    className="flex mx-auto text-white bg-red-500 border-0 py-1.5 px-4 focus:outline-none hover:bg-red-600 rounded-r text-xs"
                                                >
                                                    delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
