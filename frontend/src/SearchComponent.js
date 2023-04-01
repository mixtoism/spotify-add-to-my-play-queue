import { useState } from "react";
import ListGroup from 'react-bootstrap/ListGroup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import axios from "axios";
function SearchBar(props) {
    const [searchTerm, setSearchTerm] = useState();
    let setSongs = (listSongSchema) => {
        let songs = listSongSchema.tracks.items.map(item => {
            return {
                artist: item.artists[0].name,
                name: item.name,
                uri: item.uri
            }

        });
        console.log(songs)
        props.updateSongs(songs)
    }
    let doSearch = (searchTerm) => {
        let queryObj = {
            q: searchTerm,
            type: 'track',
            // limit: 5,
            market: 'ES'
        }
        let headers = { "Authorization": props.apiKey }
        let queryString = Object.keys(queryObj).map(key => key + '=' + encodeURIComponent(queryObj[key])).join("&");
        let url = "https://api.spotify.com/v1/search/?" + queryString;
        console.log(headers)
        axios.get(url, { headers: headers }).then(response => setSongs(response.data));
    }
    return (<input className="form-control" type="text" placeholder="Search" aria-label="Search" onChange={(e) => { doSearch(e.target.value) }} />);

}

function Song(props) {
    const startPlaying = () => {
        let uri = props.song.uri;
        let headers = { "Authorization": props.apiKey }

        let url = "https://api.spotify.com/v1/me/player/queue?uri=" + uri;
        axios.post(url, { "uri": uri }, { headers: headers }).then(props.onSongAdded(props.song.name + " añadida"))
    }
    return (
        <ListGroup.Item onClick={startPlaying}>
            <div className="ms-2 me-auto">
                <div className="fw-bold">{props.song.name}</div>
                {props.song.artist}
            </div>
        </ListGroup.Item>
    )
}
function SongList(props) {
    let songs = [];

    return (<ListGroup>
        {props.songs.map((song) => <Song song={song} apiKey={props.apiKey} />)}
    </ListGroup>
    )
}
function SearchView(props) {
    const [songs, setSongs] = useState([]);
    let notify = (message) => { toast.success(message) }
    return (
        <>
            <SearchBar updateSongs={setSongs} apiKey={props.apiKey} />
            <SongList songs={songs} apiKey={props.apiKey} onSongAdded={notify} />
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />


        </>)


}
export default SearchView;