import React, {FC} from "react";
import "style/mainpage.scss"
import tw from "assets/tw.svg"
import { ReactComponent as Logo } from 'assets/tw.svg'

const Mainpage: FC<any> = () => {
    return (
        <>
            <div className="flex flex-row">
                <div>
                    <div className="flex">
                        新竹市
                    </div>
                    <div>
                        123
                    </div>
                </div>
                <div className="flex-1">
                    {/*<img src={tw} alt="map"/>*/}
                    <Logo className="tw-map"/>
                </div>
            </div>
        </>
    )

}

export default Mainpage;