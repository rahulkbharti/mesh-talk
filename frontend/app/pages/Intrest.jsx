import { useDispatch, useSelector } from "react-redux";
import { addInterest, removeInterest } from "../modules/intrest/intrestSlice";
import { useRef } from "react";
// import { use } from "react"

const Interest = () => {
    const dispatch = useDispatch();
    const interests = useSelector((state) => state.intrest.intrest);
    const input = useRef(null);
    // console.log(interests);
    const handleAddInterest = (interest) => {
        input.current.value = "";
        dispatch(addInterest(interest));
    };
    const handleRemoveInterest = (interest) => {
        dispatch(removeInterest(interest));
    };

    return (
        <div>
            <h2>Interests</h2>
            <ul>
                {interests.map((interest, index) => (
                    <li key={index}>
                        {interest}
                        <button onClick={() => handleRemoveInterest(interest)}>Remove</button>
                    </li>
                ))}
            </ul>
            <input type="text" id="newInterest" ref={input} />
            <button onClick={() => handleAddInterest(input.current.value)}>Add Interest</button>
        </div>
    );
};

export default Interest;