import React, { useState, useEffect } from "react";
import Table from "./Table";
import "./App.css";

function App() {
    const [displayError, setDisplayError] = useState<boolean>(false);
    const [loginView, setLoginView] = useState<boolean>(true);
    const [user, setUser] = useState<number | null>(null);
    const [email, setEmail] = useState<string>("null");
    const [pass, setPass] = useState<string>("null");

    useEffect(() => {
        fetch("/user/id.json")
            .then((res) => res.json())
            .then((data) => {
                // console.log(data);
                setUser(data.userId);
            })
            .catch((err) => console.log("error in getting user cookie", err));
    }, [user]);

    const submitRegister = (e: React.SyntheticEvent) => {
        e.preventDefault();
        fetch("/user/register.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, pass }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("returned data after registration", data);
                setUser(data.id);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const loginSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        fetch("/user/login.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, pass }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("returned data after registration", data);
                data.success === false
                    ? setDisplayError(true)
                    : setUser(data.id);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    if (!user) {
        return (
            <section className="min-h-screen flex items-center">
                <div className="w-[400px] mx-auto text-center">
                    {loginView ? (
                        <form className="flex flex-col space-y-4">
                            <img
                                src="https://siderite.dev/Posts/files/placeholder.com-logo1_637146769278368505.jpg"
                                alt="Login log"
                                className="w-full mx-auto pb-16 "
                            />
                            <h2 className="text-xl font-semibold">Login</h2>
                            {displayError && (
                                <p className="text-red-500">
                                    *provide proper credentials
                                </p>
                            )}
                            <input
                                className="p-1.5 rounded text-black border"
                                type="email"
                                placeholder="E-mail"
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => setEmail(e.target.value)}
                            ></input>
                            <input
                                className="p-1.5 rounded text-black border"
                                type="password"
                                placeholder="password"
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => setPass(e.target.value)}
                            ></input>
                            <button
                                onClick={loginSubmit}
                                className="text-white bg-indigo-500 border-0 py-2 px-10 focus:outline-none hover:bg-indigo-600 rounded text-lg self-center"
                            >
                                Login
                            </button>
                            <p className="pb-4">
                                Register{" "}
                                <code
                                    className="text-buff hover:text-red-500 cursor-pointer text-indigo-500"
                                    onClick={() =>
                                        setLoginView((prev) => !prev)
                                    }
                                >
                                    here
                                </code>{" "}
                                if you doesnt have an account
                            </p>
                        </form>
                    ) : (
                        <form className="flex flex-col space-y-4">
                            <img
                                src="https://siderite.dev/Posts/files/placeholder.com-logo1_637146769278368505.jpg"
                                alt="Login log"
                                className="w-full mx-auto pt-4"
                            />
                            <h2 className="text-xl font-semibold">
                                Register a new user:
                            </h2>

                            <input
                                className="p-1.5 rounded text-black border"
                                type="text"
                                placeholder="E-mail"
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => setEmail(e.target.value)}
                            ></input>
                            <input
                                className="p-1.5 rounded text-black border"
                                type="password"
                                placeholder="password"
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => setPass(e.target.value)}
                            ></input>
                            <button
                                onClick={submitRegister}
                                className="text-white bg-indigo-500 border-0 py-2 px-10 focus:outline-none hover:bg-indigo-600 rounded text-lg self-center"
                            >
                                Sign Up
                            </button>
                            <p>
                                Login{" "}
                                <code
                                    className="text-buff hover:text-red-500 cursor-pointer text-indigo-500"
                                    onClick={() =>
                                        setLoginView((prev) => !prev)
                                    }
                                >
                                    here
                                </code>
                            </p>
                        </form>
                    )}
                </div>
            </section>
        );
    } else {
        return (
            <div className="App">
                <Table />
            </div>
        );
    }
}

export default App;
