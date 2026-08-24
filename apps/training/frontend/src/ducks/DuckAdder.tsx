import type {Duck} from "./DuckCard.tsx";
import type {Dispatch, SetStateAction} from "react";

export interface DuckAdderProps {
    setDucks: Dispatch<SetStateAction<Duck[]>>;
}

export function DuckAdder({setDucks}: DuckAdderProps) {
    const createDuck = (formData: FormData) => {
        const duck: Duck = {
            name: formData.get("name") as string ?? "",
            color: formData.get("color") as string ?? "",
            age: Number(formData.get("age") ?? 0)
        }
        setDucks((prevDucks) => [...prevDucks, duck])
    }

    return (
        <form action={createDuck}>
            <h2>Create a new duck</h2>

            <label htmlFor={"name"}>Name: </label>
            <input type={"text"} id={"name"} name={"name"} required={true}/>
            <br/>
            <label htmlFor={"color"}>Color: </label>
            <input type={"text"} id={"color"} name={"color"} required={true}/>
            <br/>
            <label htmlFor={"age"}>Age: </label>
            <input type={"number"} id={"age"} name={"age"} required={true}/>
            <br/>
            <input type={"submit"} value={"Create"}/>
        </form>
    )
}