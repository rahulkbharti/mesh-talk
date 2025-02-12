import { useDispatch, useSelector } from "react-redux";
import { addInterest, removeInterest } from "../modules/intrest/intrestSlice";

const Interest = () => {
    const dispatch = useDispatch();
    const interests = useSelector((state) => state.intrest.intrest);
    // console.log(interests);
    const handleAddInterest = (interest) => {
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
            <input type="text" id="newInterest" />
            <button onClick={() => handleAddInterest(document.getElementById('newInterest').value)}>Add Interest</button>
        </div>
    );
};

export default Interest;