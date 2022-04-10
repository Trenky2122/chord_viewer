import MusicNotationViewersContainer from "./MusicNotationViewers/MusicNotationViewersContainer";

const HomeComponent = () => {
    return(
        <div className={"container-fluid"}>
            <div className={"row"}>
                <MusicNotationViewersContainer />
            </div>
        </div>
    )
}

export default HomeComponent;