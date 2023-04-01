import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchView from './SearchComponent';
import axios from 'axios';

function getApiKey(creds, setApiKeyfn) {
  setApiKeyfn("Bearer " + creds);
  //axios.post("https://accounts.spotify.com/api/token", body, { headers: headers }).then((response) => { setApiKeyfn("Bearer " + response.data.access_token); console.log("set apiKey") })
}

function App() {
  const [songs, setSongs] = useState(["Song 1", "Song 2"]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState("Song 3");
  const [searchParams, setSearchParams] = useSearchParams()
  const [apiKey, setApiKey] = useState();
  useEffect(() => getApiKey(searchParams.get("creds"), setApiKey), [searchParams]);

  if (apiKey === null | apiKey === "") {
    return (<></>);
  }

  return (
    <div className="App">
      <SearchView apiKey={apiKey} />
      {/* <CurrentlyPlaying apiKey={apiKey} /> */}
    </div>
  );
}

export default App;
