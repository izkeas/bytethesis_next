import styles from "../styles/components/menu.module.css"
import Link from "next/link"

import IconButton from "../components/IconButton"
import {AiOutlineClose} from "react-icons/ai"
import { Language } from "@app/lib/Language";

interface Props {
    pages? : {name : string; link : string}[];
    languages? : Language[];
    isActive? : boolean;
    onDeactivate? : () => void;
}

export default function Menu (props : Props){
    return (
        <div className={styles.menu}
            style={{
                display : props.isActive ? "block" : "none"
            }}
        >
            <IconButton 
                icon={<AiOutlineClose className={styles.menu_button}/>}
                onClick={() => (props.onDeactivate && props.onDeactivate()) }
            />

            <div className={styles.menu_wrapper}>
                <nav>
                    <Link href="/">HOME</Link> <br/>

                    { props.pages && props.pages.map((item) => (
                        <div key={item.name}>
                            <a href={`/${item.name}`}>{item.name.toUpperCase()}</a>
                            <br/>
                        </div>
                    ))}
                </nav>

                <hr/>
                
                {props.languages && props.languages.map( (item) => (
                    <div key={item.name}>
                        <Link href={`/${item.shortName !== "en" ? item.shortName : ""}`}> {item.name} </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}