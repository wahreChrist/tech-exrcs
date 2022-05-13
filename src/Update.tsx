import React, { Dispatch, SetStateAction } from "react";

export default function Update({
    property,
}: {
    property: Dispatch<SetStateAction<string>>;
}): JSX.Element {
    return (
        <>
            <input
                className="w-full p-1.5 border border-slate-700"
                type="text"
                required
                onChange={(e) => property(e.target.value)}
            ></input>
        </>
    );
}
