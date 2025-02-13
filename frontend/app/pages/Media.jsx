import useMedia from "../hooks/useMediaDevice"

const Media = () => {
    const media = useMedia();
    console.log();
    return (
        <div>
            <h1>Media</h1>
        </div>
    )
}
export default Media;