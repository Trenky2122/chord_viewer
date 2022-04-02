import MusicNotationViewersContainer from "./MusicNotationViewers/MusicNotationViewersContainer";

const HomeComponent = () => {
    return(
        <div className={"container-fluid"}>
            <div className={"row"}>
                <div className={"col"}>
                    ChordViewer HomePage
                </div>
                <MusicNotationViewersContainer />
            </div>
        </div>
    )
}

export default HomeComponent;