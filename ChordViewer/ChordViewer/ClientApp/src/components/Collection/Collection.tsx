import {useEffect, useState} from "react";
import {Constants} from "../../models/Constants";
import {BackendService} from "../../service/BackendService";
import {useParams} from "react-router-dom";

const Collection = ()=>{
    let [collection, setCollection] = useState(Constants.defaultUser);
    let {collectionId} = useParams();
    useEffect(()=>{
        BackendService.GetCollection(+collectionId!).then(res => setCollection(res.data));
    })
    return (
        <div>
            {JSON.stringify(collection)}
        </div>
    )
}

export default Collection;